import io
import os
import logging
import numpy as np
from typing import Optional, Dict, Any
from pathlib import Path

from fastapi import FastAPI, File, UploadFile, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.efficientnet import preprocess_input
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications import EfficientNetB5
from tensorflow.keras import layers, models
from PIL import Image, ImageOps
import uvicorn

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Pydantic models for response validation
class PredictionResponse(BaseModel):
    predicted_class: str
    confidence: float
    top_predictions: Optional[Dict[str, float]] = None

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None

# Create FastAPI instance with metadata
app = FastAPI(
    title="Plant Species Classification API",
    description="API for classifying plant species from images using deep learning",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
class Config:
    # Base directory where this script resides
    BASE_DIR = Path(__file__).resolve().parent
    # Absolute model path (avoid issues with different working directories)
    MODEL_PATH = BASE_DIR / "models" / "Plant_species.h5"
    IMG_HEIGHT = 456
    IMG_WIDTH = 456
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".tiff"}
    CONFIDENCE_THRESHOLD = 0.5
    TOP_K_PREDICTIONS = 3

config = Config()

# Class labels mapping
CLASS_LABELS = {
    0: "Aloe Vera", 1: "Banana", 2: "Bitter Gourd", 3: "Cantaloupe", 4: "Cassava",
    5: "Coconut", 6: "Corn", 7: "Cucumber", 8: "Curry Leaves", 9: "Eggplant",
    10: "Ginger", 11: "Guar", 12: "Guava", 13: "Kale", 14: "Long Beans",
    15: "Mango", 16: "Melon", 17: "Miracle Fruit", 18: "Onion", 19: "Paddy",
    20: "Papaya", 21: "Paper Chili", 22: "Pineapple", 23: "Ponila", 24: "Radish",
    25: "Soybean", 26: "Spinach", 27: "Sweet Corn", 28: "Tobacco", 29: "Watermelon"
}

# Global model variable
model = None

def load_ml_model():
    """Load the machine learning model with error handling."""
    global model
    try:
        model_path = Path(config.MODEL_PATH)
        logger.info(f"Resolved model path: {model_path}")
        if not model_path.exists():
            raise FileNotFoundError(f"Model file not found at {model_path}")

        logger.info(f"Loading model from {model_path} (size: {model_path.stat().st_size} bytes)")
        model = load_model(str(model_path))
        logger.info("Model loaded successfully")

        # Warm up the model with a dummy prediction (channels=3 assumed)
        dummy_input = np.random.random((1, config.IMG_HEIGHT, config.IMG_WIDTH, 3))
        _ = model.predict(dummy_input, verbose=0)
        logger.info("Model warmed up successfully")

    except Exception as e:
        err_msg = str(e)
        logger.error(f"Failed to load model (path={config.MODEL_PATH}): {err_msg}")

        # Fallback path: rebuild EfficientNetB5 if stem_conv channel mismatch detected
        if "Shape mismatch" in err_msg and "stem_conv/kernel" in err_msg:
            try:
                logger.warning("Attempting fallback rebuild (EfficientNetB5 RGB) with by-name weight loading, skipping mismatches.")

                def build_model():
                    base = EfficientNetB5(include_top=False, weights=None, input_shape=(config.IMG_HEIGHT, config.IMG_WIDTH, 3), pooling='avg')
                    x = layers.Dropout(0.2, name='rebuild_dropout')(base.output)
                    output = layers.Dense(len(CLASS_LABELS), activation='softmax', name='predictions')(x)
                    return models.Model(inputs=base.input, outputs=output, name='plant_species_model')

                rebuilt = build_model()
                # Try to load weights; skip mismatches so first conv can accept existing kernel if shape matches
                rebuilt.load_weights(str(model_path), by_name=True, skip_mismatch=True)

                # Warm up and assign to global
                dummy_input = np.random.random((1, config.IMG_HEIGHT, config.IMG_WIDTH, 3))
                _ = rebuilt.predict(dummy_input, verbose=0)
                model = rebuilt
                logger.info("Fallback rebuild succeeded; model operational.")
                return
            except Exception as fb_e:
                logger.error(f"Fallback rebuild failed: {fb_e}")
                raise RuntimeError(f"Model loading failed after fallback: {fb_e}")

        raise RuntimeError(f"Model loading failed: {err_msg}")

def validate_image_file(file: UploadFile) -> None:
    """Validate uploaded image file."""
    # Check file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in config.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {file_ext} not supported. Allowed types: {', '.join(config.ALLOWED_EXTENSIONS)}"
        )
    
    # Check content type
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image"
        )

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """Preprocess image for model prediction."""
    try:
        # Open and convert image
        img = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if necessary
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Apply EXIF orientation
        img = ImageOps.exif_transpose(img)
        
        # Resize image
        img = img.resize((config.IMG_WIDTH, config.IMG_HEIGHT), Image.Resampling.LANCZOS)
        
        # Convert to array and preprocess
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)
        
        return img_array
        
    except Exception as e:
        logger.error(f"Image preprocessing failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid image format: {str(e)}"
        )

def get_top_predictions(predictions: np.ndarray, top_k: int = 3) -> Dict[str, float]:
    """Get top k predictions with labels and confidence scores."""
    top_indices = np.argsort(predictions[0])[::-1][:top_k]
    top_predictions = {}
    
    for idx in top_indices:
        label = CLASS_LABELS.get(idx, f"Unknown_{idx}")
        confidence = float(predictions[0][idx])
        top_predictions[label] = confidence
    
    return top_predictions

@app.on_event("startup")
async def startup_event():
    """Load model on startup."""
    load_ml_model()

@app.get("/", tags=["Health"])
async def root():
    """Root endpoint for health check."""
    return {
        "message": "Plant Species Classification API",
        "status": "healthy",
        "model_loaded": model is not None,
        "supported_classes": len(CLASS_LABELS)
    }

@app.get("/health", tags=["Health"])
async def health_check():
    """Detailed health check endpoint."""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "model_path": config.MODEL_PATH,
        "image_size": f"{config.IMG_WIDTH}x{config.IMG_HEIGHT}",
        "supported_formats": list(config.ALLOWED_EXTENSIONS),
        "max_file_size_mb": config.MAX_FILE_SIZE / (1024 * 1024),
        "total_classes": len(CLASS_LABELS)
    }

@app.get("/classes", tags=["Model Info"])
async def get_supported_classes():
    """Get list of supported plant species classes."""
    return {
        "total_classes": len(CLASS_LABELS),
        "classes": CLASS_LABELS
    }

@app.post("/predict/", response_model=PredictionResponse, tags=["Prediction"])
async def predict_plant_species(
    file: UploadFile = File(..., description="Image file of a plant species"),
    top_k: Optional[int] = 3
):
    """
    Predict plant species from an uploaded image.
    
    - **file**: Image file (JPG, PNG, BMP, TIFF formats supported)
    - **top_k**: Number of top predictions to return (default: 3)
    """
    if model is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model not loaded. Please try again later."
        )
    
    # Validate top_k parameter
    top_k = max(1, min(top_k or 3, len(CLASS_LABELS)))
    
    try:
        # Validate file
        validate_image_file(file)
        
        # Check file size
        contents = await file.read()
        if len(contents) > config.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File size exceeds {config.MAX_FILE_SIZE / (1024 * 1024):.1f}MB limit"
            )
        
        # Preprocess image
        img_array = preprocess_image(contents)
        
        # Make prediction
        logger.info(f"Making prediction for file: {file.filename}")
        predictions = model.predict(img_array, verbose=0)
        
        # Get top predictions
        top_predictions = get_top_predictions(predictions, top_k)
        
        # Get the best prediction
        predicted_class_idx = int(np.argmax(predictions, axis=1)[0])
        predicted_label = CLASS_LABELS.get(predicted_class_idx, "Unknown")
        confidence = float(np.max(predictions))
        
        logger.info(f"Prediction completed: {predicted_label} (confidence: {confidence:.3f})")
        
        # Check confidence threshold
        if confidence < config.CONFIDENCE_THRESHOLD:
            logger.warning(f"Low confidence prediction: {confidence:.3f}")
        
        return PredictionResponse(
            predicted_class=predicted_label,
            confidence=confidence,
            top_predictions=top_predictions
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )

@app.post("/predict/batch/", tags=["Prediction"])
async def predict_batch(files: list[UploadFile] = File(...)):
    """
    Predict plant species for multiple images at once.
    
    - **files**: List of image files
    """
    if model is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model not loaded. Please try again later."
        )
    
    if len(files) > 10:  # Limit batch size
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 10 files allowed per batch"
        )
    
    results = []
    
    for i, file in enumerate(files):
        try:
            # Validate and process each file
            validate_image_file(file)
            contents = await file.read()
            
            if len(contents) > config.MAX_FILE_SIZE:
                results.append({
                    "filename": file.filename,
                    "error": f"File size exceeds {config.MAX_FILE_SIZE / (1024 * 1024):.1f}MB limit"
                })
                continue
            
            img_array = preprocess_image(contents)
            predictions = model.predict(img_array, verbose=0)
            
            predicted_class_idx = int(np.argmax(predictions, axis=1)[0])
            predicted_label = CLASS_LABELS.get(predicted_class_idx, "Unknown")
            confidence = float(np.max(predictions))
            
            results.append({
                "filename": file.filename,
                "predicted_class": predicted_label,
                "confidence": confidence
            })
            
        except Exception as e:
            results.append({
                "filename": file.filename,
                "error": str(e)
            })
    
    return {"results": results}

# Custom exception handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"error": "Endpoint not found", "detail": "The requested endpoint does not exist"}
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    logger.error(f"Internal server error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": "An unexpected error occurred"}
    )

# Run the app
if __name__ == "__main__":
    uvicorn.run(
        "api1forplant_species:app",  # Use string format for better reloading
        host="0.0.0.0",
        port=8000,
        reload=True,  # Enable auto-reload for development
        log_level="info"
    )
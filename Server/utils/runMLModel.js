import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import FormData from "form-data";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

//plant species identification
export const runMLModel = async (imagePath) => {
  try {
    // ✅ Create form data
    const form = new FormData();
    form.append("file", fs.createReadStream(imagePath));

    // ✅ Send POST request with form-data
    const response = await axios.post(
      "https://38eb-103-88-134-250.ngrok-free.app/predict/",
      form,
      {
        headers: form.getHeaders(),
      }
    );

    const data = response.data;

    console.log("ML API Response:", data);
    // ✅ Check if the response is valid

    // ✅ Check response
    if (data && data.predicted_class) {
      return {
        species: data.predicted_class,
        confidence: data.confidence || 1,
      };
    } else {
      return {
        species: "Unknown",
        confidence: 0,
      };
    }
  } catch (error) {
    console.error(
      "Error calling ML API:",
      error.response?.data || error.message
    );
    return {
      species: "Error",
      confidence: 0,
    };
  }
};

//mock 
export const runMLModel1 = async (imagePath) => {
  console.log(`🔍 [MOCK] Running ML model on: ${imagePath}`);

  // Simulate some mock predictions
  const mockSpecies = ['Rose', 'Sunflower', 'Neem', 'Mango', 'Unknown'];
  const randomIndex = Math.floor(Math.random() * mockSpecies.length);
  const species = mockSpecies[randomIndex];
  const confidence = species === 'Unknown' ? 0.3 : +(Math.random() * 0.4 + 0.6).toFixed(2); // 0.6 to 1.0

  return {
    species,
    confidence,
  };
};


// 🌟 Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🌱 Plant Disease Detection
export const runMLModel2 = async (imagePath) => {
  try {
    // Read image file and encode to base64
    const imageBuffer = fs.readFileSync(imagePath);
    const encodedImage = imageBuffer.toString("base64");

    // Send the image as a base64-encoded string in a JSON payload
    const response = await axios.post(
      "https://07e5-103-88-134-250.ngrok-free.app/predict",
      { image_base64: encodedImage },
      { headers: { "Content-Type": "application/json" } }
    );

    const data = response.data;
    console.log("Disease ML API Response:", data);

    const prediction = data?.prediction?.toLowerCase() || "unknown";

    if (prediction.includes("healthy")) {
      // 🌿 Plant is healthy
      return {
        disease: "Healthy",
        cure: "",
      };
    } else {
      // 🌾 Plant has disease, generate cure write-up
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `The plant disease detected is "${prediction}". Please provide a detailed explanation about this disease, its causes, and remedies for farmers to treat and prevent it effectively. Write within 100 words.`;

      const result = await model.generateContent(prompt);
      const responseText =
        result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No information found.";

      return {
        disease: prediction,
        cure: responseText.trim(),
      };
    }
  } catch (error) {
    console.log(error);
    console.error(
      "Error in runMLModel2:",
      error.response?.data || error.message
    );
    return {
      disease: "Error",
      cure: "Could not process the image.",
    };
  }
};

// mock for disease detection
export const runMLModel3 = async (imagePath) => {
  console.log(`🧪 [MOCK] Running disease detection model on: ${imagePath}`);

  // Mock prediction logic
  const mockDiseases = [
    'Powdery mildew',
    'Leaf blight',
    'Rust',
    'Healthy',
    'Bacterial wilt',
  ];

  const randomIndex = Math.floor(Math.random() * mockDiseases.length);
  const prediction = mockDiseases[randomIndex].toLowerCase();

  if (prediction.includes('healthy')) {
    return {
      disease: 'Healthy',
      cure: '',
    };
  }

  // Mocked cure (Gemini-style)
  const mockCure = `The plant disease detected is "${prediction}". It is commonly caused by overwatering or fungal spores in humid conditions. To treat, remove affected leaves, apply appropriate fungicides, and ensure proper air circulation. Crop rotation and healthy soil management help prevent future outbreaks.`;

  return {
    disease: prediction,
    cure: mockCure,
  };
};

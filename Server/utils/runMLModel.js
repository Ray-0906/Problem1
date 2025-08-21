import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import FormData from "form-data";

dotenv.config();

// 🌱 Plant Species Identification
export const runMLModel = async (imagePath) => {
  try {
    const form = new FormData();
    form.append("file", fs.createReadStream(imagePath));

    const response = await axios.post(
      "https://aniket2886-plant_species.hf.space/run/predict/",
      form,
      { headers: form.getHeaders() }
    );

    const data = response.data;
    console.log("ML API Response:", data);

    if (data && data.predicted_class) {
      return {
        species: data.predicted_class,
        confidence: data.confidence || 1,
      };
    } else {
      return { species: "Unknown", confidence: 0 };
    }
  } catch (error) {
    console.error(
      "Error calling ML API:",
      error.response?.data || error.message
    );
    return { species: "Error", confidence: 0 };
  }
};

// 🌱 Mock for Species
export const runMLModel1 = async (imagePath) => {
  console.log(`🔍 [MOCK] Running ML model on: ${imagePath}`);

  const mockSpecies = ["Rose", "Sunflower", "Neem", "Mango", "Unknown"];
  const randomIndex = Math.floor(Math.random() * mockSpecies.length);
  const species = mockSpecies[randomIndex];
  const confidence =
    species === "Unknown"
      ? 0.3
      : +(Math.random() * 0.4 + 0.6).toFixed(2); // 0.6 to 1.0

  return {
    species,
    confidence,
  };
};

// 🌟 Initialize Mistral API
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

// 🌱 Plant Disease Detection (Mistral instead of Gemini)
export const runMLModel2 = async (imagePath) => {
  try {
    // Send image for prediction
    const form = new FormData();
    form.append("file", fs.createReadStream(imagePath));

    const response = await axios.post("http://localhost:8000/predict", form, {
      headers: form.getHeaders(),
    });

    const data = response.data;
    console.log("Disease ML API Response:", data);

    const prediction = data?.prediction?.toLowerCase() || "unknown";

    if (prediction.includes("healthy")) {
      return {
        disease: "Healthy",
        cure: "",
      };
    } else {
      // 🌾 Ask Mistral for cure explanation
      const prompt = `The plant disease detected is "${prediction}". Please provide a detailed explanation about this disease, its causes, and remedies for farmers to treat and prevent it effectively. Write within 100 words.`;

      const mistralResp = await axios.post(
        MISTRAL_API_URL,
        {
          model: "mistral-medium-3", // ✅ You can use mistral-large-latest if available
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${MISTRAL_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const cure =
        mistralResp.data.choices?.[0]?.message?.content ||
        "No information found.";

      return {
        disease: prediction,
        cure: cure.trim(),
      };
    }
  } catch (error) {
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

// 🌱 Mock for Disease Detection
export const runMLModel3 = async (imagePath) => {
  console.log(`🧪 [MOCK] Running disease detection model on: ${imagePath}`);

  const mockDiseases = [
    "Powdery mildew",
    "Leaf blight",
    "Rust",
    "Healthy",
    "Bacterial wilt",
  ];

  const randomIndex = Math.floor(Math.random() * mockDiseases.length);
  const prediction = mockDiseases[randomIndex].toLowerCase();

  if (prediction.includes("healthy")) {
    return {
      disease: "Healthy",
      cure: "",
    };
  }

  const mockCure = `The plant disease detected is "${prediction}". It is commonly caused by overwatering or fungal spores in humid conditions. To treat, remove affected leaves, apply appropriate fungicides, and ensure proper air circulation. Crop rotation and healthy soil management help prevent future outbreaks.`;

  return {
    disease: prediction,
    cure: mockCure,
  };
};

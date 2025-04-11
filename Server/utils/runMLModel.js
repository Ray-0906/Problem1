import axios from "axios";
import fs from "fs";

const runMLModel = async (imagePath) => {
  try {
    // Read image as base64
    const imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });

    const response = await axios.post(
      "https://api.plant.id/v2/identify",
      {
        images: [imageBase64],
        modifiers: ["crops_fast", "similar_images"],
        plant_language: "en",
        plant_details: ["common_names", "url", "name_authority", "wiki_description", "taxonomy"],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Api-Key": "YOUR_PLANT_ID_API_KEY", // 🔑 Replace this with your API key
        },
      }
    );

    const suggestions = response.data.suggestions;

    if (suggestions && suggestions.length > 0) {
      const topSuggestion = suggestions[0];

      return {
        species: topSuggestion.plant_name,
        confidence: topSuggestion.probability,
        details: topSuggestion.plant_details,
      };
    } else {
      return {
        species: "Unknown",
        confidence: 0,
      };
    }
  } catch (error) {
    console.error("Error calling plant.id API:", error.response?.data || error.message);
    return {
      species: "Error",
      confidence: 0,
    };
  }
};

export default runMLModel;

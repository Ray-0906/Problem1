import axios from "axios";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ 1. Get climate data from Open Meteo
const getClimateData = async (latitude, longitude) => {
  try {
    const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude,
        longitude,
        daily: [
          "temperature_2m_max",
          "temperature_2m_min",
          "precipitation_sum",
        ],
        timezone: "auto",
        temperature_unit: "celsius",
        precipitation_unit: "mm",
      },
    });

    const data = response.data.daily;

    return {
      temperatureMax: data.temperature_2m_max[0],
      temperatureMin: data.temperature_2m_min[0],
      precipitation: data.precipitation_sum[0],
    };
  } catch (error) {
    console.error("Error fetching climate data:", error.message);
    throw new Error("Unable to fetch climate data.");
  }
};

// ✅ 2. Get city name using Reverse Geocoding (OpenCage example)
const getCityName = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      "https://api.opencagedata.com/geocode/v1/json",
      {
        params: {
          key: process.env.OPENCAGE_API_KEY,
          q: `${latitude},${longitude}`,
          pretty: 1,
        },
      }
    );

    const components = response.data.results[0].components;
    const city =
      components.city ||
      components.town ||
      components.village ||
      components.country;

    return city || "Unknown Location";
  } catch (error) {
    console.error("Error fetching city name:", error.message);
    throw new Error("Unable to fetch city name.");
  }
};

// ✅ 3. Get tree suggestions from Gemini AI
const getTreeSuggestionsFromGemini = async (climateData, cityName) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
You are an environmental bot assisting in reforestation projects.

Here is the climate data:
- City: ${cityName}
- Max Temperature: ${climateData.temperatureMax} °C
- Min Temperature: ${climateData.temperatureMin} °C
- Precipitation: ${climateData.precipitation} mm

Based on this, suggest 5 suitable tree species for this region.
For each tree, include:
- Tree Name
- Reasons why it is suitable for this climate
- Growth time
- Environmental benefits
Format the response as a JSON array like this:
[
  {
    "tree": "Name of Tree",
    "reasons": "Reasons why it suits this climate",
    "growthTime": "Estimated time to mature",
    "benefits": "Environmental benefits"
  },
  ...
]
`;

    const result = await model.generateContent(prompt);

    const responseText = result.response.candidates[0].content.parts[0].text;

    const cleanedText = responseText
      .replace(/```json/, "")
      .replace(/```/, "")
      .trim();

    const suggestions = JSON.parse(cleanedText);
    console.log("Tree suggestions:", suggestions);
    return suggestions;
  } catch (error) {
    console.error("Error fetching tree suggestions:", error.message);
    throw new Error("Unable to get tree suggestions.");
  }
};

// ✅ 4. Main controller
export const suggestTreesController = async (req, res) => {
  try {
    const { latitude, longitude, cityName } = req.body;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude are required." });
    }

    const climateData = await getClimateData(latitude, longitude);

    const treeSuggestions = await getTreeSuggestionsFromGemini(
      climateData,
      cityName
    );

    res.status(200).json({
      location: cityName,
      climate: climateData,
      suggestions: treeSuggestions,
    });
  } catch (error) {
    console.error("Error in suggestTreesController:", error.message);
    res.status(500).json({ error: error.message });
  }
};

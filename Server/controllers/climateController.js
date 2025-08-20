import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// 🌱 Initialize Mistral API
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

// Simple in-memory cache for suggestions
const suggestionCache = new Map();
const SUGGESTION_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
const roundTo = (n, step) => Math.round(Number(n) / step) * step;

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

// ✅ 2. Get city name using Reverse Geocoding (OpenCage) with Nominatim fallback
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

    const components = response.data.results?.[0]?.components || {};
    const city =
      components.city ||
      components.town ||
      components.village ||
      components.hamlet ||
      components.suburb ||
      components.municipality ||
      components.county ||
      components.state_district ||
      components.state ||
      components.country;

    return city || "Unknown Location";
  } catch (error) {
    console.error("Error fetching city name (OpenCage):", error.message);
    // Fallback to Nominatim on server with a proper User-Agent
    try {
      const nomRes = await axios.get("https://nominatim.openstreetmap.org/reverse", {
        params: { lat: latitude, lon: longitude, format: "json" },
        headers: { "User-Agent": "Problem1App/1.0" },
      });
      const addr = nomRes.data?.address || {};
      const city = addr.city || addr.town || addr.village || addr.hamlet || addr.suburb || addr.county || addr.state || addr.country;
      return city || "Unknown Location";
    } catch (e2) {
      console.error("Error fetching city name (Nominatim):", e2.message);
      return "Unknown Location";
    }
  }
};

  // Normalize multiline strings inside JSON (escape raw newlines within quotes)
  const normalizeJSONString = (str) => {
    let out = "";
    let inString = false;
    let escape = false;
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (inString) {
        if (escape) {
          out += ch;
          escape = false;
          continue;
        }
        if (ch === "\\") {
          out += ch;
          escape = true;
          continue;
        }
        if (ch === "\n" || ch === "\r") {
          out += "\\n";
          continue;
        }
        if (ch === '"') {
          inString = false;
          out += ch;
          continue;
        }
        out += ch;
      } else {
        out += ch;
        if (ch === '"') inString = true;
      }
    }
    return out;
  };

// ✅ 3. Get tree suggestions from Mistral AI
const getTreeSuggestionsFromMistral = async (climateData, cityName) => {
  try {
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
Format the response strictly as a JSON array like this:
[
  {
    "tree": "Name of Tree",
    "reasons": "Reasons why it suits this climate",
    "growthTime": "Estimated time to mature",
    "benefits": "Environmental benefits"
  }
]
`;

    const mistralResp = await axios.post(
      MISTRAL_API_URL,
      {
        model: "mistral-large-latest", // ✅ valid Mistral model
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const responseText =
      mistralResp.data.choices?.[0]?.message?.content || "[]";

    // Clean and parse JSON robustly
    let cleanedText = responseText
      .replace(/```json/i, "")
      .replace(/```/g, "")
      .trim();

    let suggestions = [];
    const attempts = [];
    attempts.push(() => JSON.parse(cleanedText));
    attempts.push(() => JSON.parse(normalizeJSONString(cleanedText)));
    attempts.push(() => {
      const start = cleanedText.indexOf("[");
      const end = cleanedText.lastIndexOf("]");
      if (start >= 0 && end > start) {
        const sub = cleanedText.slice(start, end + 1);
        return JSON.parse(normalizeJSONString(sub));
      }
      throw new Error("No JSON array found");
    });

    for (const parseFn of attempts) {
      try {
        const parsed = parseFn();
        if (Array.isArray(parsed)) {
          suggestions = parsed;
          break;
        }
      } catch {}
    }

    if (!Array.isArray(suggestions)) suggestions = [];
    return suggestions;
  } catch (error) {
    const status = error.response?.status;
    console.error("Error fetching tree suggestions:", status || "", error.message);
    const e = new Error("Unable to get tree suggestions.");
    e.status = status;
    throw e;
  }
};

// Heuristic fallback suggestions if AI is unavailable or rate-limited
const generateHeuristicTreeSuggestions = (climateData, cityName) => {
  const tMax = Number(climateData.temperatureMax);
  const tMin = Number(climateData.temperatureMin);
  const precip = Number(climateData.precipitation);

  const out = [];
  const add = (tree, reasons, growthTime, benefits) => out.push({ tree, reasons, growthTime, benefits });

  if (tMax >= 35 && precip < 50) {
    add("Neem (Azadirachta indica)", "Thrives in hot, dry climates and poor soils", "3–5 years to establish", "Shade, air purification, medicinal uses");
    add("Acacia (Babool)", "Drought tolerant; nitrogen fixer", "3–4 years", "Soil improvement, erosion control");
    add("Moringa (Drumstick)", "Heat/drought hardy; edible leaves", "1–2 years", "Nutrition, fast biomass");
    add("Tamarind", "Handles heat once established", "4–6 years", "Food, shade");
    add("Terminalia arjuna", "Heat-tolerant; hardy tree", "4–7 years", "Shade, biodiversity");
  } else if (precip >= 150) {
    add("Teak (Tectona grandis)", "Warm, humid with good rainfall", "8–10+ years", "Timber, canopy, carbon storage");
    add("Bamboo", "Thrives in high rainfall; very fast growth", "6–18 months", "Soil binding, carbon, habitat");
    add("Jackfruit", "Moist, warm climates", "3–5 years", "Food, shade, biodiversity");
    add("Albizia saman (Rain Tree)", "Excels in humid tropics", "3–5 years", "Shade avenues, nitrogen fixation");
    add("Terminalia catappa", "Coastal/humid tolerant", "3–5 years", "Urban shade, ornamental");
  } else if (tMax <= 20) {
    add("Himalayan Pine", "Prefers cooler climates", "8–12+ years", "Watershed protection, carbon");
    add("Deodar Cedar", "Cooler, temperate zones", "10–15+ years", "Timber, habitat");
    add("Poplar", "Fast-growing in temperate zones", "4–6 years", "Timber, windbreaks");
    add("Silver Oak", "Mild to cool climates", "6–8 years", "Agroforestry, shade");
    add("Cold-tolerant Eucalyptus", "Some species handle cooler temps", "5–7 years", "Windbreaks, pulp");
  } else {
    add("Mango", "Warm, moderate rainfall; widely adapted", "3–6 years", "Food, shade, biodiversity");
    add("Banyan/Peepal", "Adaptable urban shade trees", "5–7 years", "Shade, habitat, cultural value");
    add("Gulmohar", "Warm climates; ornamental and shade", "3–5 years", "Urban canopy, pollinators");
    add("Amla (Indian Gooseberry)", "Moderate climates; drought tolerant", "3–4 years", "Nutrition, medicinal");
    add("Sandalwood (with host)", "Warm climates; semi-parasitic", "7–10+ years", "High-value, biodiversity");
  }

  return out.slice(0, 5);
};

// ✅ 4. Main controller
export const suggestTreesController = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude are required." });
    }

    const resolvedCityName = await getCityName(latitude, longitude);

    console.log(
      "Received coordinates:",
      latitude,
      longitude,
      "city:",
      resolvedCityName
    );

    const climateData = await getClimateData(latitude, longitude);

    // Cache key by city and coarse-grained climate
    const key = `${resolvedCityName}|tmax:${roundTo(climateData.temperatureMax, 1)}|tmin:${roundTo(climateData.temperatureMin, 1)}|p:${roundTo(climateData.precipitation, 5)}`;
    const now = Date.now();
    const cached = suggestionCache.get(key);
    if (cached && (now - cached.when) < SUGGESTION_TTL_MS) {
      return res.status(200).json({ location: resolvedCityName, climate: climateData, suggestions: cached.data });
    }

    let suggestions;
    if (!MISTRAL_API_KEY) {
      console.warn("MISTRAL_API_KEY not set; using heuristic suggestions.");
      suggestions = generateHeuristicTreeSuggestions(climateData, resolvedCityName);
    } else {
      try {
        suggestions = await getTreeSuggestionsFromMistral(climateData, resolvedCityName);
      } catch (err) {
        if (err.status === 429) {
          console.warn("Mistral rate-limited (429). Falling back to heuristic suggestions.");
          suggestions = generateHeuristicTreeSuggestions(climateData, resolvedCityName);
        } else {
          throw err;
        }
      }
    }

    suggestionCache.set(key, { when: now, data: suggestions });
    res.status(200).json({ location: resolvedCityName, climate: climateData, suggestions });
  } catch (error) {
    console.error("Error in suggestTreesController:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ✅ 5. Lightweight endpoint: reverse geocode city by coords
export const reverseGeocodeCityController = async (req, res) => {
  try {
    const { lat, lon, latitude, longitude } = req.query;
    const latNum = parseFloat(lat ?? latitude);
    const lonNum = parseFloat(lon ?? longitude);

    if (!latNum || !lonNum) {
      return res.status(400).json({ error: "lat and lon are required" });
    }

    const cityName = await getCityName(latNum, lonNum);

    return res.json({ city: cityName });
  } catch (err) {
    console.error("Error in reverseGeocodeCityController:", err.message);
    return res.status(500).json({ error: "Failed to resolve city" });
  }
};

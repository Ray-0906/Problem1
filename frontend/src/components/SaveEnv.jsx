import { useState } from 'react';
import axios from 'axios';

export function SaveEnv() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const hardcodedData = {
    location: "Jamshedpur",
    climate: {
      temperatureMax: 33.4,
      temperatureMin: 21.3,
      precipitation: 0
    },
    suggestions: [
      {
        tree: "Indian Rosewood (Dalbergia sissoo)",
        reasons: "Tolerates high temperatures and dry periods, common in Jamshedpur's climate. It can also withstand some degree of waterlogging during monsoons.",
        growthTime: "Moderate to fast, reaching maturity in 15-20 years.",
        benefits: "Provides valuable timber, nitrogen fixation in soil, shade, and supports biodiversity."
      },
      {
        tree: "Neem (Azadirachta indica)",
        reasons: "Highly drought-resistant and thrives in hot climates. Adaptable to various soil types and requires minimal rainfall.",
        growthTime: "Fast-growing, reaching maturity in 5-7 years.",
        benefits: "Natural insecticide, medicinal properties, improves soil fertility, provides shade, and absorbs air pollutants."
      },
      {
        tree: "Indian Banyan (Ficus benghalensis)",
        reasons: "Adaptable to hot and dry conditions, common in Jamshedpur. Once established, it's highly drought-tolerant.",
        growthTime: "Slow-growing, but exceptionally long-lived. Can take several decades to reach full size.",
        benefits: "Provides extensive shade, supports a wide range of wildlife, helps control soil erosion, and has cultural significance."
      },
      {
        tree: "Arjun (Terminalia arjuna)",
        reasons: "Tolerant of a range of temperatures and can withstand dry spells. It prefers well-drained soil and can handle Jamshedpur's climate.",
        growthTime: "Moderate growth rate, reaching maturity in about 20-25 years.",
        benefits: "Medicinal properties, particularly for heart health. Provides good shade and supports biodiversity."
      },
      {
        tree: "Bamboo (Bambusoideae)",
        reasons: "Many bamboo species thrive in tropical climates like Jamshedpur's. Some are drought-tolerant while others prefer more humid conditions.",
        growthTime: "Very fast-growing, some species can reach maturity in just a few years.",
        benefits: "Versatile material for construction and crafts. Carbon sequestration, soil erosion control, and creates habitat for wildlife."
      }
    ]
  };
  setData(hardcodedData); // Set hardcoded data initially
  const handleGetSuggestions = async () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const geoRes = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
          params: {
            lat: latitude,
            lon: longitude,
            format: 'json',
          },
        });

        const city = geoRes.data.address.city || geoRes.data.address.town || geoRes.data.address.village || "Unknown";

        const res = await axios.post(
          'http://localhost:5000/api/climate/suggest-trees',
          { latitude, longitude, city },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        setData(res.data);
      } catch (err) {
        console.error("Failed to get suggestions", err);
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <div className="p-6">
      <button
        onClick={handleGetSuggestions}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {loading ? "Loading..." : "Get Suggestions"}
      </button>

      {data && (
        <div className="mt-6 space-y-4">
          <div className="bg-gray-100 p-4 rounded shadow">
            <h2 className="text-2xl font-bold text-green-700">Suggestions for {data.location}</h2>
            <p className="mt-2 text-gray-700">
              <strong>Climate:</strong><br />
              Max Temp: {data.climate.temperatureMax}°C<br />
              Min Temp: {data.climate.temperatureMin}°C<br />
              Precipitation: {data.climate.precipitation}mm
            </p>
          </div>

          {data.suggestions.map((s, idx) => (
            <div key={idx} className="bg-white shadow rounded p-4 border-l-4 border-green-600">
              <h3 className="text-xl font-semibold text-green-800">{s.tree}</h3>
              <p className="mt-2 text-gray-700"><strong>Reasons:</strong> {s.reasons}</p>
              <p className="mt-1 text-gray-700"><strong>Growth Time:</strong> {s.growthTime}</p>
              <p className="mt-1 text-gray-700"><strong>Benefits:</strong> {s.benefits}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import axiosInstance from '../utils/axios';

export function SaveEnv() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
 // Set hardcoded data initially
  const handleGetSuggestions = async () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        axiosInstance.defaults.withCredentials = true; // Ensure cookies are sent with requests
        // Send only coordinates; server will resolve the city name via OpenCage
        const res = await axiosInstance.post('/api/climate/suggest-trees', { latitude, longitude });

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

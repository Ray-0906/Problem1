// UserDashboard.jsx

import axios from 'axios';
import { useState } from 'react';

export function SaveEnv() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGetSuggestions = async () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      console.log("Latitude:", latitude, "Longitude:", longitude); // Debugging line
      try {
        const res = await axios.post(
          'http://localhost:5000/api/suggestions',
          { latitude, longitude },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setSuggestions(res.data);
      } catch (err) {
        console.error("Failed to get suggestions", err);
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <div>
      <button onClick={handleGetSuggestions} disabled={loading}>
        {loading ? "Loading..." : "Get Suggestions"}
      </button>

      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((plant, index) => (
            <li key={index}>{plant}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

//export default UserDashboard;

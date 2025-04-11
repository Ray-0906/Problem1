import { useEffect, useState } from "react";
import axios from "axios";

export default function UserObservationHistory() {
  const [observations, setObservations] = useState([]);

  useEffect(() => {
    const fetchObservations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/usersplant", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Fetched observations:", res); // Debugging line
        setObservations(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch observation history:", err);
        setObservations([]); // fallback to empty array
      }
    };
  
    fetchObservations();
  }, []);
  

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-green-700 mb-4">My Plant Observations</h2>

      {observations.length === 0 ? (
        <p className="text-gray-600">No observations found yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {observations.map((obs) => (
            <div
              key={obs._id}
              className="bg-white shadow-md rounded-xl p-4 border border-green-100"
            >
              <img
                src={`/${obs.imageUrl}`}
                alt="Plant"
                className="rounded-lg h-48 w-full object-cover mb-3"
              />
              <p><span className="font-semibold text-green-600">Species:</span> {obs.prediction?.species || "Unknown"}</p>
              <p><span className="font-semibold text-green-600">Confidence:</span> {obs.prediction?.confidence ? `${(obs.prediction.confidence * 100).toFixed(2)}%` : "N/A"}</p>
              <p><span className="font-semibold text-green-600">Status:</span> {obs.prediction?.status}</p>
              <p><span className="font-semibold text-green-600">Location:</span> Lat {obs.location.coordinates[1]}, Lng {obs.location.coordinates[0]}</p>
              <p className="text-gray-500 text-sm mt-2">Submitted: {new Date(obs.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

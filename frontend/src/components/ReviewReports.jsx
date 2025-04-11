import { useEffect, useState } from "react";
import axios from "axios";

export default function ReviewPanel() {
  const [observations, setObservations] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/ecologist/pending", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      console.log("Fetched data:", res.data);
      setObservations(res.data); // Should be an array!
    })
    .catch((err) => {
      console.error("Error fetching observations", err);
    });
  }, []);
  
  

  const markReviewed = async () => {
    await axios.put(`/api/ecologist/review/${selected._id}`, {
      species: selected.correctedSpecies || selected.prediction.species,
      confidence: selected.correctedConfidence || selected.prediction.confidence,
      action: "reviewed",
    });
    setSelected(null);
    setObservations((prev) => prev.filter((obs) => obs._id !== selected._id));
  };

  const flagForVerification = async () => {
    await axios.put(`/api/observations/review/${selected._id}`, {
      action: "needs-verification",
    });
    setSelected(null);
    setObservations((prev) => prev.filter((obs) => obs._id !== selected._id));
  };

  if (selected) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-green-800">Observation Details</h2>
        <img src={selected.imageUrl} className="w-full max-w-md rounded shadow" />
        <p><strong>User:</strong> {selected.user?.name}</p>
        <p><strong>Location:</strong> {selected.location?.coordinates?.join(', ')}</p>
        <p><strong>Prediction:</strong> {selected.prediction.species}</p>
        <p><strong>Confidence:</strong> {selected.prediction.confidence}%</p>

        <input
          type="text"
          placeholder="Edit Species"
          defaultValue={selected.prediction.species}
          onChange={(e) => (selected.correctedSpecies = e.target.value)}
          className="w-full border rounded p-2"
        />
        <input
          type="number"
          placeholder="Edit Confidence"
          defaultValue={selected.prediction.confidence}
          onChange={(e) => (selected.correctedConfidence = e.target.value)}
          className="w-full border rounded p-2"
        />

        <div className="flex gap-3 mt-4">
          <button onClick={markReviewed} className="bg-green-600 text-white px-4 py-2 rounded">Mark as Reviewed</button>
          <button onClick={flagForVerification} className="bg-yellow-500 text-white px-4 py-2 rounded">Needs Verification</button>
          <button onClick={() => setSelected(null)} className="bg-gray-400 text-white px-4 py-2 rounded">Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-green-800">Pending Observations</h2>
      {observations.length === 0 ? (
        <p className="text-gray-500">No pending requests.</p>
      ) : (
        <div className="grid gap-4">
          {observations.map((obs) => (
            <div key={obs._id} className="border p-4 rounded shadow bg-white flex gap-4 items-center">
              <img src={obs.imageUrl} className="w-24 h-24 object-cover rounded" />
              <div className="flex-1">
                <p><strong>Species:</strong> {obs.prediction.species || "Unknown"}</p>
                <p><strong>User:</strong> {obs.user?.name}</p>
              </div>
              <button
                onClick={() => setSelected(obs)}
                className="bg-green-700 text-white px-3 py-1 rounded"
              >
                Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

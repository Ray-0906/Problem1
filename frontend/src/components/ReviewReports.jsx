import { useEffect, useState } from "react";
import axios from "axios";

export default function ReviewPanel() {
  const [observations, setObservations] = useState([]);
  const [selectedObs, setSelectedObs] = useState(null);
  const [editSpecies, setEditSpecies] = useState("");
  const [editEndangered, setEditEndangered] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");

  const fetchPending = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/ecologist/pending");
      setObservations(res.data);
    } catch (err) {
      console.error("Failed to load pending reports", err);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleReview = async () => {
    try {
      await axios.put(`http://localhost:5000/api/ecologist/review/${selectedObs._id}`, {
        confirmedSpecies: editSpecies,
        endangeredStatus: editEndangered ? "endangered" : "not endangered",
        notes:reviewNotes,
      });
      setSelectedObs(null);
      fetchPending();
    } catch (err) {
      console.error("Failed to submit review", err);
    }
  };

  if (!selectedObs) {
    return (
      <div>
        <h2 className="text-lg font-semibold mb-4">Pending Observations</h2>
        {Array.isArray(observations) && observations.length ? (
          <ul className="space-y-4">
            {observations.map((obs) => (
              <li key={obs._id} className="bg-white rounded shadow p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{obs.name || "Unnamed Plant"}</p>
                  <p className="text-sm text-gray-600">{obs.prediction?.species || "Unidentified"}</p>
                </div>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setSelectedObs(obs);
                    setEditSpecies(obs.prediction?.species || "");
                    setEditEndangered(obs.status === "endangered");
                    setReviewNotes(obs.reviewNotes || "");
                  }}
                >
                  Details
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No pending reports.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        className="text-blue-600 underline"
        onClick={() => setSelectedObs(null)}
      >
        ← Back to list
      </button>

      <div className="bg-white rounded shadow p-6">
        <h3 className="text-xl font-semibold mb-2">Observation Details</h3>
        <img src={selectedObs.imageUrl} alt="Plant" className="w-64 rounded mb-4" />
        <p><strong>User:</strong> {selectedObs.user?.name || selectedObs.user}</p>
        <p><strong>Submitted Name:</strong> {selectedObs.name || "N/A"}</p>
        <p><strong>Predicted Species:</strong> {selectedObs.prediction?.species}</p>
        <p><strong>Confidence:</strong> {selectedObs.prediction?.confidence}%</p>
        <p><strong>Coordinates:</strong> {selectedObs.location?.coordinates?.join(", ")}</p>

        <div className="mt-4">
          <label className="block font-medium mb-1">Species</label>
          <input
            value={editSpecies}
            onChange={(e) => setEditSpecies(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        <div className="mt-4">
          <label className="block font-medium mb-1">Endangered?</label>
          <input
            type="checkbox"
            checked={editEndangered}
            onChange={(e) => setEditEndangered(e.target.checked)}
          />{" "}
          {editEndangered ? "Yes" : "No"}
        </div>

        <div className="mt-4">
          <label className="block mb-1 font-medium">Review Notes</label>
          <textarea
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            rows={3}
            className="border px-3 py-2 rounded w-full"
            placeholder="Add any comments or notes here..."
          />
        </div>

        <div className="mt-6 space-x-3">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleReview}
          >
            Mark as Reviewed
          </button>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={() => alert("Marked for further verification!")}
          >
            Need Verification
          </button>
        </div>
      </div>
    </div>
  );
}

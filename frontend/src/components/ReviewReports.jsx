import { useEffect, useState } from "react";
import axios from "axios";

export default function ReviewPanel() {
  const [observations, setObservations] = useState([]);
  const [selectedObs, setSelectedObs] = useState(null);
  const [editSpecies, setEditSpecies] = useState("");
  const [editEndangered, setEditEndangered] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPending = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/ecologist/pending"
      );
      setObservations(res.data);
    } catch (err) {
      console.error("Failed to load pending reports", err);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleReview = async () => {
    if (!selectedObs) return;
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/api/ecologist/review/${selectedObs._id}`,
        {
          confirmedSpecies: editSpecies,
          endangeredStatus: editEndangered ? "endangered" : "not endangered",
          notes: reviewNotes,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSelectedObs(null);
      setEditSpecies("");
      setEditEndangered(false);
      setReviewNotes("");
      fetchPending();
    } catch (err) {
      console.error("Failed to submit review", err);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedObs) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Pending Observations</h2>
        {Array.isArray(observations) && observations.length ? (
          <ul className="space-y-4">
            {observations.map((obs) => (
              <li
                key={obs._id}
                className="bg-white rounded shadow p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{obs.name || "Unnamed Plant"}</p>
                  <p className="text-sm text-gray-600">
                    {obs.prediction?.species || "No prediction"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedObs(obs);
                    setEditSpecies(obs.prediction?.species || "");
                  }}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Review
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No pending observations found.</p>
        )}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Review Observation</h2>
      <div className="mb-4">
        <img
          src={selectedObs.imageUrl}
          alt="Plant"
          className="w-48 h-48 object-cover rounded mb-2"
        />
        <p className="font-medium">{selectedObs.name || "Unnamed Plant"}</p>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Species Name:</label>
        <input
          type="text"
          value={editSpecies}
          onChange={(e) => setEditSpecies(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Endangered Status:</label>
        <select
          value={editEndangered ? "endangered" : "not endangered"}
          onChange={(e) => setEditEndangered(e.target.value === "endangered")}
          className="border border-gray-300 rounded px-2 py-1 w-full"
        >
          <option value="not endangered">Not Endangered</option>
          <option value="endangered">Endangered</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Review Notes:</label>
        <textarea
          value={reviewNotes}
          onChange={(e) => setReviewNotes(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 w-full"
        />
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleReview}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
        <button
          onClick={() => setSelectedObs(null)}
          className="bg-gray-300 text-black px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

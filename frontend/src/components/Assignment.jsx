import { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";

export default function RangerAssignments() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const res = await axiosInstance.get("/api/ecologist/ranger/tasks");
      setTasks(res.data || []);
    } catch (e) {
      console.error("Failed to load assignments", e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const complete = async (id) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        `/api/ecologist/ranger/tasks/${id}/complete`,
        {
          completionNotes: "Completed on field",
        }
      );
      setTasks((prev) => prev.filter((t) => t._id !== id));
      alert("✅ Task marked as completed; +25 green points awarded.");
    } catch (e) {
      console.error("Failed to complete task", e);
      alert("❌ Failed to complete task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Assignments from Ecologists</h3>
      {tasks.length === 0 ? (
        <div className="text-sm text-gray-500">No pending assignments.</div>
      ) : (
        tasks.map((t) => (
          <div key={t._id} className="p-4 rounded-xl bg-white border">
            <div className="text-sm text-gray-600">
              Assigned by:{" "}
              <span className="font-medium">
                {t.ecologist?.name || "Unknown"}
              </span>
            </div>
            <div className="text-sm text-gray-800 mt-1">
              Task: <span className="font-medium">{t.notes || "—"}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Species: {t.finalSpecies} • Status: {t.status}
            </div>
            {t.observation?.imageUrl ? (
              <img
                alt="observation"
                src={t.observation.imageUrl}
                className="mt-3 w-full max-w-md rounded-lg"
              />
            ) : null}
            <button
              onClick={() => complete(t._id)}
              disabled={loading}
              className="mt-3 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Mark as Done"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}

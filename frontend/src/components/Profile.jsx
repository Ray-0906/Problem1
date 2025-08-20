import { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";

export function Profile() {
  const [profile, setProfile] = useState({ name: "", email: "", location: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axiosInstance.get("/api/auth/profile");
        if (!ignore) {
          setProfile({
            name: res.data?.name || "",
            email: res.data?.email || "",
            location: res.data?.location || "",
          });
        }
      } catch (e) {
        if (!ignore) setError("Failed to load profile");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await axiosInstance.put("/api/auth/profile", profile);
      setMessage("Profile updated");
      setProfile({
        name: res.data?.name || "",
        email: res.data?.email || "",
        location: res.data?.location || "",
      });
    } catch (e) {
      setError(e?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-gray-500">Loading profile…</div>;

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {message && <div className="text-green-600 text-sm">{message}</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          className="w-full border p-2 rounded"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          className="w-full border p-2 rounded"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <input
          className="w-full border p-2 rounded"
          value={profile.location}
          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        className={`px-4 py-2 rounded text-white ${saving ? 'bg-green-400' : 'bg-green-700 hover:bg-green-800'}`}
      >
        {saving ? 'Saving…' : 'Update'}
      </button>
    </form>
  );
}
  
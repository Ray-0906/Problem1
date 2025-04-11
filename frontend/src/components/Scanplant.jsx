import { useState } from "react";
import axios from "axios";

export default function ScanPlant() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    setMessage("");

    navigator.geolocation.getCurrentPosition(async (position) => {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("latitude", position.coords.latitude);
      formData.append("longitude", position.coords.longitude);

      try {
        const token = localStorage.getItem("token");
        const res = await axios.post("http://localhost:5000/api/observations/", formData, {
          headers: { "Content-Type": "multipart/form-data" ,
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage(res.data.message || "Scan submitted successfully.");
      } catch (err) {
        setMessage("Error uploading: " + (err.response?.data?.message || "Something went wrong."));
      } finally {
        setLoading(false);
      }
    }, () => {
      setMessage("Location access denied.");
      setLoading(false);
    });
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-green-700 mb-4">Scan a Plant</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageChange}
          className="w-full"
        />

        {preview && <img src={preview} alt="Preview" className="w-full rounded-lg" />}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700"
        >
          {loading ? "Scanning..." : "Submit Scan"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
    </div>
  );
}

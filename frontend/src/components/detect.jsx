import { useState } from "react";
import axios from "axios";
import { UploadCloud, Loader2 } from "lucide-react";
import axiosInstance from "../utils/axios";

export default function DiseaseDetector() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setResult(null);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axiosInstance.post("/api/observations/detect", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Detection result:", res.data);
      setResult(res.data);
    } catch (err) {
      console.error("Detection failed", err);
      setResult({ error: "Detection failed. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-green-800 mb-2">🌱 Plant Disease Detector</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="block w-full border rounded-lg p-2 border-green-300"
      />

      {previewUrl && (
        <div className="mt-4">
          <p className="text-green-800 font-medium mb-2">🔍 Preview:</p>
          <img src={previewUrl} alt="Preview" className="w-full h-auto rounded-lg shadow" />
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !image}
        className="bg-green-700 text-white px-4 py-2 rounded-xl hover:bg-green-800 flex items-center gap-2 w-full justify-center"
      >
        {loading ? <Loader2 className="animate-spin" /> : <UploadCloud />}
        {loading ? "Detecting..." : "Upload and Detect"}
      </button>

      {result && (
        <div className="bg-green-50 border border-green-300 rounded-lg p-4 space-y-2">
          {result.error ? (
            <p className="text-red-600">{result.error}</p>
          ) : (
            <>
              <h3 className="font-bold text-green-900">🌿 Plant: </h3>
              <p><strong>🦠 Disease:</strong> {result.disease}</p>
              <p><strong>💊 Treatment:</strong> {result.cure}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

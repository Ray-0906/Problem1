import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

export default function UnconfirmedEcologistReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await axios.get("http://localhost:5000/unconfirmed",{headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }});
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to fetch ecologist reviews", err);
      alert("❌ Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const pinIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold text-green-700">🌿 Unconfirmed Ecologist Reviews</h2>

      {loading && <p className="text-gray-500">Loading reviews...</p>}

      {!loading && reviews.length === 0 && (
        <p className="text-gray-600">No pending reviews to confirm.</p>
      )}

      {reviews.length > 0 && (
        <>
          <MapContainer
            center={[reviews[0].latitude, reviews[0].longitude]}
            zoom={7}
            scrollWheelZoom={false}
            style={{ height: "300px", width: "100%" }}
            className="rounded-lg shadow"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            />
            {reviews.map((r) => (
              <Marker
                key={r._id}
                position={[r.latitude, r.longitude]}
                icon={pinIcon}
              >
                <Popup>
                  <strong>{r.finalSpecies}</strong><br />
                  {r.status}
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <div className="grid gap-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="border border-gray-300 p-4 rounded-lg shadow"
              >
                <h3 className="font-semibold text-green-800 text-lg">
                  {review.finalSpecies}
                </h3>
                <p>Status: <span className="font-medium">{review.status}</span></p>
                <p>Notes: {review.notes || "—"}</p>
                <p>Lat/Lng: {review.latitude}, {review.longitude}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

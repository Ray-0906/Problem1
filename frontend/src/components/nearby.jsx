import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function NearbyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });
      },
      (err) => {
        console.error("Failed to get location", err);
        alert("⚠️ Enable location to fetch nearby reports.");
      }
    );
  }, []);

  useEffect(() => {
    if (location) fetchReports();
  }, [location]);

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/observations/nearby", {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          radiusInKm: 10,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setReports(res.data);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    }
  };

  const handleApprove = async (reportId) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/observations/approve/${reportId}`,
        {headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setReports((prev) => prev.filter((r) => r._id !== reportId));
      alert(`✅ ${res.data.message}`);
    } catch (err) {
      console.error("Approval failed", err);
      alert("❌ Failed to approve observation");
    } finally {
      setLoading(false);
    }
  };
  
  const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  });
  
  return (
    <div className="space-y-6">
      {!location ? (
        <p className="text-gray-500 text-center">📍 Acquiring your location...</p>
      ) : (
        <>
          <MapContainer
            center={[location.latitude, location.longitude]}
            zoom={12}
            style={{ height: "400px", width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            />
            <Marker position={[location.latitude, location.longitude]} icon={customIcon}>
              <Popup>You are here</Popup>
            </Marker>
            {reports.map((report) => (
              <Marker
                key={report._id}
                position={[report.location.coordinates[1], report.location.coordinates[0]]}
                icon={customIcon}
              >
                <Popup>
                  <strong>Status:</strong> {report.prediction?.status || "Unknown"}<br />
                  <strong>Danger:</strong> {report.status}<br />
                  <em>{new Date(report.createdAt).toLocaleString()}</em>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <div className="space-y-4">
            {reports.length === 0 ? (
              <p className="text-center text-gray-500">No nearby reports found.</p>
            ) : (
              reports.map((report) => (
                <div
                  key={report._id}
                  className="bg-green-100 border border-green-300 p-4 rounded-xl shadow-md space-y-2"
                >
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">Prediction:</span> {report.prediction?.status}
                  </div>
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">Danger Status:</span> {report.status}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold">Reported At:</span>{" "}
                    {new Date(report.createdAt).toLocaleString()}
                  </div>

                  <button
                    onClick={() => handleApprove(report._id)}
                    className="mt-2 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 w-full"
                    disabled={loading}
                  >
                    {loading ? "Approving..." : "✅ Approve & Reward"}
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

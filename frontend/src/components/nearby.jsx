import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axiosInstance from "../utils/axios";

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
      axiosInstance.defaults.withCredentials = true; 
      const res = await axiosInstance.get("/api/observations/nearby", {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          radiusInKm: 10,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Nearby reports:", res.data);
      setReports(res.data);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    }
  };

  const handleApprove = async (reportId) => {
    try {
      setLoading(true);
      axiosInstance.defaults.withCredentials = true; 
  const res = await axiosInstance.get(
  `/api/observations/approve/${reportId}`,
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

  const fmtPct = (v) => (typeof v === "number" ? `${Math.round(v * 100)}%` : "—");
  const toLatLng = (r) => {
    const c = r?.location?.coordinates;
    if (Array.isArray(c) && c.length >= 2) {
      const [lng, lat] = c; // GeoJSON order
      return [lat, lng];
    }
    return [location.latitude, location.longitude];
  };
  
  return (
    <div className="space-y-6">
      {!location ? (
        <p className="text-gray-500 text-center">📍 Acquiring your location...</p>
      ) : (
        <>
          <div className="relative z-0 overflow-hidden rounded-lg shadow">
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
                position={toLatLng(report)}
                icon={customIcon}
              >
                <Popup>
                  {report.imageUrl ? (
                    <img src={report.imageUrl} alt="plant" style={{ width: 160, height: 90, objectFit: "cover", borderRadius: 8, marginBottom: 8 }} />
                  ) : null}
                  <div><strong>Species:</strong> {report.prediction?.species || "Unknown"}</div>
                  <div><strong>Confidence:</strong> {fmtPct(report.prediction?.confidence)}</div>
                  <div><strong>Status:</strong> {report.prediction?.status || "Unknown"}</div>
                  <div><strong>Danger:</strong> {report.status}</div>
                  <div className="text-xs"><em>{new Date(report.createdAt).toLocaleString()}</em></div>
                </Popup>
              </Marker>
            ))}
            </MapContainer>
          </div>

          <div className="relative z-10 space-y-4">
            {reports.length === 0 ? (
              <p className="text-center text-gray-500">No nearby reports found.</p>
            ) : (
              reports.map((report) => (
                <div
                  key={report._id}
                  className="bg-green-100 border border-green-300 p-4 rounded-xl shadow-md space-y-2"
                >
                  <div className="flex gap-3">
                    {report.imageUrl ? (
                      <img src={report.imageUrl} alt="plant" className="w-28 h-20 object-cover rounded-md" />
                    ) : null}
                    <div className="flex-1 space-y-1">
                      <div className="text-sm text-gray-800">
                        <span className="font-semibold">Species:</span> {report.prediction?.species || "Unknown"}
                      </div>
                      <div className="text-sm text-gray-700">
                        <span className="font-semibold">Prediction:</span> {report.prediction?.status || "—"} ({fmtPct(report.prediction?.confidence)})
                      </div>
                      <div className="text-sm text-gray-700">
                        <span className="font-semibold">Danger Status:</span> {report.status}
                      </div>
                      <div className="text-xs text-gray-500">
                        <span className="font-semibold">Reported At:</span> {new Date(report.createdAt).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        <span className="font-semibold">Coords:</span> {toLatLng(report)[0].toFixed(5)}, {toLatLng(report)[1].toFixed(5)}
                      </div>
                    </div>
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

import { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import socket from "../socket/socket";
import VideoChat from "./videoChat";
import CallLoader from "./CallLoader";

export default function PlantationVerifyPanel() {
  const [attempts, setAttempts] = useState([]);
  const [calling, setCalling] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [adminSocketId, setAdminSocketId] = useState(null);
  const [activeVerificationId, setActiveVerificationId] = useState(null);

  const fetchMy = async () => {
    const res = await axiosInstance.get("/api/plantation/my");
    setAttempts(res.data || []);
  };

  useEffect(() => {
    fetchMy();
  }, []);

  const startVerification = async () => {
    // Create verification record with optional location
    const pos = await new Promise((resolve) =>
      navigator.geolocation.getCurrentPosition(
        (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => resolve(null)
      )
    );

    const res = await axiosInstance.post("/api/plantation/start", {
      latitude: pos?.lat,
      longitude: pos?.lng,
    });

    const verification = res.data;
    setActiveVerificationId(verification._id);
    setCalling(true);

    // Notify rangers
    const userId = localStorage.getItem("userId");
    socket.emit("user:callRequest", { userId, verificationId: verification._id });
  };

  const cancel = () => {
    setCalling(false);
    socket.emit("call:cancelled", { userId: localStorage.getItem("userId") });
  };

  useEffect(() => {
    const onAccepted = ({ adminSocketId, verificationId }) => {
      if (verificationId && verificationId !== activeVerificationId) return;
      setAdminSocketId(adminSocketId);
      setCalling(false);
      setInCall(true);
    };
    socket.on("call:accepted", onAccepted);
    return () => socket.off("call:accepted", onAccepted);
  }, [activeVerificationId]);

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Tree Plantation Campaign</h3>
          {!calling && !inCall && (
            <button
              onClick={startVerification}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Start Verification
            </button>
          )}
        </div>
        {calling && (
          <div className="mt-4">
            <CallLoader message="Waiting for ranger to accept..." />
            <button onClick={cancel} className="mt-2 text-sm text-gray-600 underline">Cancel</button>
          </div>
        )}
        {inCall && (
          <div className="mt-4">
            <VideoChat targetSocketId={adminSocketId} />
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl border">
        <h4 className="font-semibold mb-2">Your verification attempts</h4>
        <div className="space-y-2">
          {attempts.map((a) => (
            <div key={a._id} className="p-3 rounded-lg bg-gray-50 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-800">Status: {a.status}</div>
                <div className="text-xs text-gray-500">Started: {new Date(a.createdAt).toLocaleString()}</div>
              </div>
              {a.notes && <div className="text-xs text-gray-600">Notes: {a.notes}</div>}
            </div>
          ))}
          {attempts.length === 0 && <div className="text-sm text-gray-500">No attempts yet.</div>}
        </div>
      </div>
    </div>
  );
}

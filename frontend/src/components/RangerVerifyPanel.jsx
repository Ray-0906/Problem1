import { useEffect, useState } from "react";
import socket from "../socket/socket";
import VideoChat from "./videoChat";
import axiosInstance from "../utils/axios";

export default function RangerVerifyPanel() {
  const [calls, setCalls] = useState([]);
  const [inCallWith, setInCallWith] = useState(null);
  const [verificationId, setVerificationId] = useState(null);

  useEffect(() => {
    const onIncoming = ({ userId, userSocketId, verificationId }) => {
      setCalls((prev) => [...prev, { userId, userSocketId, verificationId }]);
    };
    const onCancelled = ({ userId }) => {
      setCalls((prev) => prev.filter((c) => c.userId !== userId));
    };
    socket.on("admin:callIncoming", onIncoming);
    socket.on("call:cancelled", onCancelled);
    return () => {
      socket.off("admin:callIncoming", onIncoming);
      socket.off("call:cancelled", onCancelled);
    };
  }, []);

  const accept = async (call) => {
    socket.emit("admin:acceptCall", { userId: call.userId, userSocketId: call.userSocketId, adminSocketId: socket.id });
    setInCallWith(call.userSocketId);
    setVerificationId(call.verificationId);
    setCalls([]);
  };

  const complete = async (decision, notes) => {
    if (!verificationId) return;
    await axiosInstance.post(`/api/plantation/${verificationId}/complete`, { decision, notes });
    alert(`Verification ${decision}`);
    window.location.reload();
  };

  return inCallWith ? (
    <div className="space-y-4">
      <VideoChat targetSocketId={inCallWith} />
      <div className="bg-white p-4 rounded-xl border">
        <h4 className="font-semibold mb-2">Finalize Verification</h4>
        <div className="flex gap-2">
          <button onClick={() => complete("approved")} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">Approve</button>
          <button onClick={() => complete("rejected")} className="px-4 py-2 rounded-lg bg-red-600 text-white">Reject</button>
        </div>
      </div>
    </div>
  ) : (
    <div className="space-y-2">
      <h4 className="font-semibold">Incoming Verification Requests</h4>
      {calls.map((c) => (
        <div key={c.userId} className="p-3 rounded-lg bg-gray-50 flex items-center justify-between">
          <div className="text-sm">User: {c.userId}</div>
          <button onClick={() => accept(c)} className="px-3 py-1 rounded bg-teal-600 text-white">Join Now</button>
        </div>
      ))}
      {calls.length === 0 && <div className="text-sm text-gray-500">No pending requests</div>}
    </div>
  );
}

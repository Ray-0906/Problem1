import { useEffect, useState } from "react";
import socket from "../socket/socket";
import VideoChat from "./videoChat";
import VideoChat1 from "./VideoConnect";

const IncomingCallList = () => {
  const [calls, setCalls] = useState([]);
  const [inCallWith, setInCallWith] = useState(null);

  useEffect(() => {
  socket.on("admin:callIncoming", ({ userId, userSocketId }) => {
      console.log("📥 Received incoming call from:", userId);
      setCalls((prev) => [...prev, { userId, userSocketId }]);
    });

    socket.on("call:cancelled", ({ userId }) => {
      console.log("❌ Call cancelled by user:", userId);
      setCalls((prev) => prev.filter((c) => c.userId !== userId));
    });

    return () => {
      socket.off("admin:callIncoming");
      socket.off("call:cancelled");
    };
  }, []);

  const acceptCall = (call) => {
    console.log("✅ Accepting call from:", call.userId);
    console.log("✅ Accepting call from socket:", call.userSocketId);
    socket.emit("admin:acceptCall", {
      userId: call.userId,
      userSocketId: call.userSocketId,
      adminSocketId: socket.id,
    });
    setInCallWith(call.userSocketId);
    setCalls([]); // Clear list
  };

  return inCallWith ? (
   <VideoChat   targetSocketId={inCallWith} />
  ) : (
    <div>
      <h3>Incoming Calls</h3>
      {calls.map((call) => (
        <div key={call.userId}>
          <p>📞 Call from user: {call.userId}</p>
          <button onClick={() => acceptCall(call)}>Accept</button>
        </div>
      ))}
    </div>
  );
};

export default IncomingCallList;

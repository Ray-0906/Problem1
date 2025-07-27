import { useEffect, useState } from "react";
import socket from "../socket/socket";


const AdminCallHandler = () => {
  const [incomingCall, setIncomingCall] = useState(null);

  useEffect(() => {
    socket.on("admin:callIncoming", (data) => {
      setIncomingCall(data);
    });

    return () => socket.off("admin:callIncoming");
  }, []);

  const acceptCall = () => {
    socket.emit("admin:acceptCall", { userId: incomingCall.userId });
  };

  return incomingCall ? (
    <div>
      <p>Incoming call from user {incomingCall.userId}</p>
      <button onClick={acceptCall}>✅ Accept</button>
    </div>
  ) : null;
};

export default AdminCallHandler;

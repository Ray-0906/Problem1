import { useEffect, useState } from "react";
import socket from "../socket/socket";
import VideoChat from "./videoChat";


const IncomingCallList = () => {
  const [calls, setCalls] = useState([]);
  const [inCallWith, setInCallWith] = useState(null);

  useEffect(() => {
    socket.on("admin:callIncoming", ({ userId, userSocketId }) => {
      console.log("recieved ")
      setCalls((prev) => [...prev, { userId, userSocketId }]);
    });

    socket.on("call:cancelled", ({ userId }) => {
      setCalls((prev) => prev.filter((c) => c.userId !== userId));
    });

    return () => {
      socket.off("admin:callIncoming");
      socket.off("call:cancelled");
    };
  }, []);

  const acceptCall = (call) => {
    socket.emit("admin:acceptCall", { userId: call.userId });
    setInCallWith(call.userSocketId);
    setCalls([]); // Clear list
  };

  return inCallWith ? (
    <VideoChat targetSocketId={inCallWith} />
  ) : (
    <div>
      <h3>Incoming Calls</h3>
      {calls.map((call) => (
        <div key={call.userId}>
          <p>Call from user: {call.userId}</p>
          <button onClick={() => acceptCall(call)}>Accept</button>
        </div>
      ))}
    </div>
  );
};

export default IncomingCallList;

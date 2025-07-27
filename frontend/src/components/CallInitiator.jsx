
import { useState, useEffect } from "react";
import socket from "../socket/socket";
import CallLoader from "./CallLoader";
import VideoChat from "./videoChat";
import VideoChat1 from "./VideoConnect";


const CallInitiator = () => {
  const [calling, setCalling] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [adminSocketId, setAdminSocketId] = useState(null);

  const userId = localStorage.getItem("userId");

  const startCall = () => {
    setCalling(true);
    console.log("Requesting call to ranger...");
    socket.emit("user:callRequest", { userId });
  };

  const cancelCall = () => {
    setCalling(false);
    socket.emit("call:cancelled", { userId });
  };

  useEffect(() => {
    socket.on("call:accepted", ({ adminSocketId }) => {
      console.log("✅ Call accepted by ranger:", adminSocketId);
      setAdminSocketId(adminSocketId);
      setCalling(false);
      setInCall(true);
    });

    return () => {
      socket.off("call:accepted");
    };
  }, []);

  return (
    <>
      {inCall ? (
        <VideoChat   targetSocketId={adminSocketId} />
      ) : calling ? (
        <>
          <CallLoader message="Searching for available ranger..." />
          <button onClick={cancelCall}>Cancel</button>
        </>
      ) : (
        <button onClick={startCall}>📞 Call Ranger</button>
      )}
    </>
  );
};

export default CallInitiator;

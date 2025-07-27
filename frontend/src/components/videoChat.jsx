
import Peer from 'simple-peer/simplepeer.min.js'; // ✅ Avoids Node modules

import { useEffect, useRef, useState } from "react";
import socket from "../socket/socket";
import UnconfirmedEcologistReviews from "./Assignment";

const VideoChat = ({ targetSocketId }) => {
  const myVideo = useRef();
  const userVideo = useRef();
  const [peer, setPeer] = useState(null);
  const peerRef = useRef(null);
const localStreamRef = useRef(null);


useEffect(() => {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
    myVideo.current.srcObject = stream;
    localStreamRef.current = stream;

    const isUser = localStorage.getItem("role") === "user";

    const newPeer = new Peer({
      initiator: isUser,
      trickle: false,
      stream,
    });

    peerRef.current = newPeer;
    setPeer(newPeer);

    newPeer.on("signal", (signal) => {
      socket.emit("webrtc:signal", { signal, to: targetSocketId });
    });

    newPeer.on("stream", (remoteStream) => {
      userVideo.current.srcObject = remoteStream;
    });

    const handleSignal = ({ signal }) => {
      try {
        if (newPeer.destroyed) return;
        newPeer.signal(signal);
      } catch (err) {
        console.error("Error handling signal:", err);
      }
    };

    socket.on("webrtc:signal", handleSignal);

    return () => {
      socket.off("webrtc:signal", handleSignal);
      newPeer.destroy();
    };
  });
}, [targetSocketId]);


  // 👇 Call end handler
  useEffect(() => {
    socket.on("call:end", () => {
      alert("Call ended by other party.");
      window.location.reload(); // or redirect to /dashboard
    });

    return () => {
      socket.off("call:end");
    };
  }, []);

const endCall = () => {
  try {
    // Clean up peer connection
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    // Stop media tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    // Notify other side
    socket.emit("call:end", { to: targetSocketId });

    // Optionally reload or reset state
    window.location.reload(); // Or use a state reset
  } catch (err) {
    console.error("Error ending call:", err);
  }
};



  return (
    <div>
      <video ref={myVideo}  autoPlay muted />
      <video ref={userVideo} autoPlay />
      <button onClick={endCall}>❌ End Call</button>
    </div>
  );
};

export default VideoChat;

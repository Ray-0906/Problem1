import Peer from 'simple-peer/simplepeer.min.js';
import { useEffect, useRef, useState } from "react";
import socket from "../socket/socket";

const VideoChat = ({ targetSocketId }) => {
  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);

  const [peerReady, setPeerReady] = useState(false);

  useEffect(() => {
    const isUser = localStorage.getItem("role") === "user";
    const isAdmin = localStorage.getItem("role") === "admin";

    if (isUser === isAdmin) {
      console.warn("Invalid role or same role on both ends. Skipping peer init.");
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }

        const peer = new Peer({
          initiator: isUser,
          trickle: false,
          stream,
        });

        peerRef.current = peer;

        peer.on("signal", (signal) => {
          socket.emit("webrtc:signal", {
            signal,
            to: targetSocketId,
          });
        });

        peer.on("stream", (remoteStream) => {
          if (userVideo.current) {
            userVideo.current.srcObject = remoteStream;
          }
        });

        peer.on("error", (err) => {
          console.error("Peer error:", err);
        });

        // Listen for signal from other peer
        const handleSignal = ({ signal }) => {
          try {
            // Avoid applying answer when already stable
            const state = peer._pc.signalingState;
            if (signal.type === "answer" && state === "stable") {
              console.warn("Skipping duplicate answer signal");
              return;
            }

            peer.signal(signal);
          } catch (err) {
            console.error("Error signaling peer:", err);
          }
        };

        socket.on("webrtc:signal", handleSignal);

        setPeerReady(true);

        return () => {
          socket.off("webrtc:signal", handleSignal);
        };
      })
      .catch((err) => {
        console.error("Media access error:", err);
        alert("Failed to access camera/mic.");
      });

    // Cleanup on unmount
    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
    };
  }, [targetSocketId]);

  useEffect(() => {
    socket.on("call:end", () => {
      alert("Call ended by other party.");
      window.location.reload();
    });

    return () => {
      socket.off("call:end");
    };
  }, []);

  const endCall = () => {
    try {
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }

      socket.emit("call:end", { to: targetSocketId });

      window.location.reload(); // or redirect
    } catch (err) {
      console.error("Error ending call:", err);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center space-y-4">
      <video ref={myVideo} autoPlay muted playsInline className="w-64 h-48 bg-black rounded" />
      <video ref={userVideo} autoPlay playsInline className="w-64 h-48 bg-black rounded" />
      <button onClick={endCall} className="px-4 py-2 bg-red-600 text-white rounded">
        ❌ End Call
      </button>
    </div>
  );
};

export default VideoChat;

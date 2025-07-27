import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import socket from "../socket/socket";
// Assuming socket is exported

const VideoChat = ({ role, targetSocketId }) => {
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [signalProcessed, setSignalProcessed] = useState(false);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(localStream);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = localStream;
        }

        if (role === "user") {
          // Initiator
          console.log("📞 Starting video chat - Role:", role);
          console.log("👉 Target socket ID:", targetSocketId);
          const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: localStream,
          });

          peer.on("signal", (data) => {
            console.log("📡 Sending signal to:", targetSocketId, data);
            socket.emit("send-signal", {
              signal: data,
              to: targetSocketId,
            });
          });

          peer.on("stream", (remoteStream) => {
            console.log("🎥 Received remote stream");
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });

          peer.on("error", (err) => {
            console.error("🚨 Peer error (initiator):", err);
          });

          peerRef.current = peer;
        }
      } catch (err) {
        console.error("Failed to access camera/mic:", err);
      }
    };

    getMedia();

    // Cleanup
    return () => {
      if (peerRef.current) peerRef.current.destroy();
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!socket || !stream) return;

    socket.on("receive-signal", ({ signal, from }) => {
      console.log("📥 Received signal from peer:", signal);

      if (signalProcessed && signal.type === "answer") {
        console.log("⛔ Skipping duplicate answer signal");
        return;
      }

      if (!peerRef.current) {
        // Receiver (admin)
        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream,
        });

        peer.on("signal", (data) => {
          console.log("📡 Sending signal back to:", from, data);
          socket.emit("send-signal", {
            signal: data,
            to: from,
          });
        });

        peer.on("stream", (remoteStream) => {
          console.log("🎥 Received remote stream");
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        });

        peer.on("error", (err) => {
          console.error("🚨 Peer error (receiver):", err);
        });

        peer.signal(signal); // Apply received offer
        peerRef.current = peer;
        setSignalProcessed(true);
      } else {
        try {
          peerRef.current.signal(signal); // Apply answer
          if (signal.type === "answer") setSignalProcessed(true);
        } catch (err) {
          console.warn("⚠️ Skipping duplicate or invalid signal", err);
        }
      }
    });

    return () => {
      socket.off("receive-signal");
    };
  }, [stream]);

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <video ref={myVideoRef} autoPlay muted className="w-64 h-48 bg-black" />
      <video ref={remoteVideoRef} autoPlay className="w-64 h-48 bg-black" />
    </div>
  );
};

export default VideoChat;

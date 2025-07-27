import Peer from 'simple-peer/simplepeer.min.js';
import { useEffect, useRef } from 'react';
import socket from '../socket/socket';

const VideoChat = ({ targetSocketId }) => {
  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const peerRef = useRef(null);
  const streamRef = useRef(null);
  const isUser = localStorage.getItem('role') === 'user';

  useEffect(() => {
    if (!targetSocketId) return;

    // 1. Define the signal handler function
    const handleSignal = ({ signal }) => {
      console.log('📥 Received signal from peer:', signal);
      // Ensure the peer exists and hasn't been destroyed before signaling
      if (peerRef.current && !peerRef.current.destroyed) {
        // simple-peer will throw the error if state is wrong, no need for extra checks here.
        // The key is ensuring this handler is not duplicated.
        peerRef.current.signal(signal);
      }
    };

    // 2. Attach the named handler
    socket.on('webrtc:signal', handleSignal);

    const startVideoChat = async () => {
      try {
        console.log('📞 Starting video chat - Role:', isUser ? 'user' : 'admin');
        console.log('👉 Target socket ID:', targetSocketId);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        streamRef.current = stream;
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }

        const peer = new Peer({
          initiator: isUser,
          trickle: false,
          stream,
        });

        peerRef.current = peer;

        peer.on('signal', (signal) => {
          console.log('📡 Sending signal to:', targetSocketId, signal);
          socket.emit('webrtc:signal', { signal, to: targetSocketId });
        });

        peer.on('stream', (remoteStream) => {
          console.log('🎥 Received remote stream');
          if (userVideo.current) {
            userVideo.current.srcObject = remoteStream;
          }
        });

        peer.on('error', (err) => {
          console.error('🚨 Peer error:', err);
        });

        peer.on('close', () => {
            console.log('Peer connection closed.');
        });

      } catch (err) {
        console.error('❌ Failed to start video chat:', err);
      }
    };

    startVideoChat();

    // 3. Cleanup function runs on unmount or before the effect re-runs
    return () => {
      console.log('🧹 Cleaning up video chat effect.');
      // Remove the specific listener to prevent duplicates
      socket.off('webrtc:signal', handleSignal);

      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [targetSocketId, isUser]); // Dependency array is correct

  const endCall = () => {
    socket.emit('call:end', { to: targetSocketId });
    // Cleanup is now handled by the effect, but direct reload is fine for a hard stop
    window.location.reload();
  };

  return (
    <div>
      <div>
        <video ref={myVideo} autoPlay muted playsInline style={{ width: '45%' }} />
        <video ref={userVideo} autoPlay playsInline style={{ width: '45%' }} />
      </div>
      <button onClick={endCall}>❌ End Call</button>
    </div>
  );
};

export default VideoChat;
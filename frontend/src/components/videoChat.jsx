import Peer from 'simple-peer/simplepeer.min.js';
import { useEffect, useRef, useState } from 'react';
import socket from '../socket/socket';

const VideoChat = ({ targetSocketId }) => {
  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const peerRef = useRef(null);
  const streamRef = useRef(null);
  const [hasReceivedAnswer, setHasReceivedAnswer] = useState(false);
  const isUser = localStorage.getItem('role') === 'user';
  const peerCreated = useRef(false); // Add this to track peer creation

  useEffect(() => {
    const startVideoChat = async () => {
      // Check if a peer has already been created
      if (peerCreated.current) {
        console.log('⏩ Peer already created, skipping');
        return;
      }
      peerCreated.current = true; // Mark peer as created

      try {
        console.log('📞 Starting video chat - Role:', isUser ? 'user' : 'admin');
        console.log('👉 Target socket ID:', targetSocketId);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        streamRef.current = stream;
        myVideo.current.srcObject = stream;

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
          userVideo.current.srcObject = remoteStream;
        });

        peer.on('error', (err) => {
          console.error('🚨 Peer error:', err);
        });

        socket.on('webrtc:signal', ({ signal }) => {
          console.log('📥 Received signal from peer:', signal);

          if (signal.type === 'answer') {
            if (hasReceivedAnswer) {
              console.log('⛔ Skipping duplicate answer signal');
              return;
            }
            setHasReceivedAnswer(true);
          }

          try {
            peer.signal(signal);
          } catch (err) {
            console.error('❌ Failed to signal peer:', err);
          }
        });

        // Cleanup function (runs when useEffect re-runs or component unmounts)
        return () => {
          peer.destroy();
          stream.getTracks().forEach((track) => track.stop());
          socket.off('webrtc:signal');
        };
      } catch (err) {
        console.error('❌ Failed to start video chat:', err);
      }
    };

    if (targetSocketId) {
      startVideoChat();
    }

    socket.on('call:end', () => {
      alert('Call ended by other party.');
      window.location.reload();
    });

    // Cleanup for socket listeners
    return () => {
      socket.off('call:end');
    };
  }, [targetSocketId]);

  const endCall = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    socket.emit('call:end', { to: targetSocketId });
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
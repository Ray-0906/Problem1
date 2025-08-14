import Peer from 'simple-peer';
import { useEffect, useRef, useState } from 'react';
import socket from '../socket/socket';

const VideoChat = ({ targetSocketId }) => {
  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const peerRef = useRef(null);
  const streamRef = useRef(null);
  const [hasReceivedAnswer, setHasReceivedAnswer] = useState(false); // reserved for future use
  const isUser = localStorage.getItem('role') === 'user';
  const peerCreated = useRef(false); // Add this to track peer creation
  const pendingSignals = useRef([]); // store early signals until peer is ready
  const remoteStreamRef = useRef(null);
  const readyRef = useRef(false);

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
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });

        streamRef.current = stream;
        myVideo.current.srcObject = stream;

        // Build ICE servers (add TURN from env if provided)
        const iceServers = [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ];
        const turnUrl = import.meta?.env?.VITE_TURN_URL;
        const turnUser = import.meta?.env?.VITE_TURN_USERNAME;
        const turnCred = import.meta?.env?.VITE_TURN_CREDENTIAL;
        if (turnUrl && turnUser && turnCred) {
          iceServers.push({ urls: turnUrl, username: turnUser, credential: turnCred });
        }

  const peer = new Peer({
          initiator: isUser,
          trickle: true, // allow ICE trickle for better connectivity
          config: { iceServers },
          stream,
        });

        peerRef.current = peer;

        peer.on('signal', (signal) => {
          const kind = signal?.type || (signal?.candidate ? 'candidate' : '');
          console.log('📡 Sending signal to:', targetSocketId, kind);
          socket.emit('webrtc:signal', { signal, to: targetSocketId });
        });

        // some browsers prefer ontrack; simple-peer emits 'stream' for convenience
        peer.on('stream', (remoteStream) => {
          console.log('🎥 Received remote stream');
          remoteStreamRef.current = remoteStream;
          if (userVideo.current) userVideo.current.srcObject = remoteStream;
        });

        peer.on('connect', () => {
          console.log('✅ WebRTC data channel connected');
        });

        peer.on('iceStateChange', (state) => {
          console.log('❄️ ICE state:', state);
        });

        peer.on('error', (err) => {
          console.error('🚨 Peer error:', err);
        });

        // Mark ourselves ready and notify the other side; also flush any early signals
        readyRef.current = true;
        socket.emit('webrtc:ready', { to: targetSocketId });
        if (pendingSignals.current.length) {
          console.log(`📦 Flushing ${pendingSignals.current.length} pending signals`);
          pendingSignals.current.forEach((sig) => {
            try { peer.signal(sig); } catch (e) { console.warn('Failed applying buffered signal', e); }
          });
          pendingSignals.current = [];
        }

        const onSignal = ({ signal, from }) => {
          // Only accept signals from the intended peer
          if (from !== targetSocketId) return;
          const kind = signal?.type || (signal?.candidate ? 'candidate' : '');
          console.log('📥 Received signal from peer:', from, kind);
          try {
            if (!readyRef.current) {
              // buffer until we mark ready
              pendingSignals.current.push(signal);
            } else {
              peer.signal(signal);
            }
          } catch (err) {
            console.error('❌ Failed to signal peer:', err);
          }
        };
        socket.on('webrtc:signal', onSignal);
        const onPeerReady = ({ from }) => {
          if (from !== targetSocketId) return;
          console.log('🤝 Peer reported ready');
          if (pendingSignals.current.length) {
            pendingSignals.current.forEach((sig) => {
              try { peer.signal(sig); } catch (e) { console.warn('Failed applying buffered signal', e); }
            });
            pendingSignals.current = [];
          }
        };
        socket.on('webrtc:peerReady', onPeerReady);

        // Cleanup function (runs when useEffect re-runs or component unmounts)
        return () => {
          peer.destroy();
          stream.getTracks().forEach((track) => track.stop());
          socket.off('webrtc:signal', onSignal);
          socket.off('webrtc:peerReady', onPeerReady);
        };
      } catch (err) {
        console.error('❌ Failed to start video chat:', err);
      }
    };

    if (targetSocketId) {
      startVideoChat();
    }

    const onCallEnd = () => {
      alert('Call ended by other party.');
      // Graceful stop instead of immediate reload to avoid hanging camera
      try { peerRef.current?.destroy(); } catch {}
      try { streamRef.current?.getTracks().forEach(t => t.stop()); } catch {}
      setTimeout(() => window.location.reload(), 250);
    };
    socket.on('call:end', onCallEnd);

    // Cleanup for socket listeners
    return () => {
  socket.off('call:end', onCallEnd);
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
  setTimeout(() => window.location.reload(), 250);
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
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
  const containerRef = useRef(null);

  // UI state
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [usingFrontCam, setUsingFrontCam] = useState(true);
  const [duration, setDuration] = useState(0); // seconds
  const [status, setStatus] = useState('connecting'); // connecting|connected|disconnected|failed

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
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: usingFrontCam ? 'user' : 'environment' },
          audio: true,
        });

        streamRef.current = stream;
        myVideo.current.srcObject = stream;

        // Build ICE servers (add TURN from env if provided)
        const iceServers = [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ];

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
          setStatus('connected');
        });

        peer.on('iceStateChange', (state) => {
          console.log('❄️ ICE state:', state);
          if (state === 'connected' || state === 'completed') setStatus('connected');
          if (state === 'disconnected') setStatus('disconnected');
          if (state === 'failed') setStatus('failed');
        });

        peer.on('error', (err) => {
          console.error('🚨 Peer error:', err);
          setStatus('failed');
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

  // Call controls
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

  const toggleMic = () => {
    const tracks = streamRef.current?.getAudioTracks?.() || [];
    if (tracks[0]) {
      tracks[0].enabled = !tracks[0].enabled;
      setMicOn(tracks[0].enabled);
    }
  };

  const toggleCam = () => {
    const tracks = streamRef.current?.getVideoTracks?.() || [];
    if (tracks[0]) {
      tracks[0].enabled = !tracks[0].enabled;
      setCamOn(tracks[0].enabled);
    }
  };

  const flipCamera = async () => {
    try {
      const nextFront = !usingFrontCam;
      const current = streamRef.current;
      const oldVideo = current?.getVideoTracks?.()[0];
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: nextFront ? 'user' : 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      const newVideo = newStream.getVideoTracks()[0];
      const newAudio = newStream.getAudioTracks()[0];

      if (peerRef.current && oldVideo && newVideo) {
        try { peerRef.current.replaceTrack(oldVideo, newVideo, current); } catch {}
      }
      // Replace audio too for consistency
      const oldAudio = current?.getAudioTracks?.()[0];
      if (peerRef.current && oldAudio && newAudio) {
        try { peerRef.current.replaceTrack(oldAudio, newAudio, current); } catch {}
      }

      // Stop old tracks and swap stream
      current?.getTracks()?.forEach(t => t.stop());
      streamRef.current = newStream;
      if (myVideo.current) myVideo.current.srcObject = newStream;
      setUsingFrontCam(nextFront);
    } catch (e) {
      console.warn('Failed to flip camera', e);
    }
  };

  const toggleFullscreen = async () => {
    try {
      const el = containerRef.current;
      if (!document.fullscreenElement) {
        await el?.requestFullscreen?.();
      } else {
        await document.exitFullscreen();
      }
    } catch {}
  };

  const enterPiP = async () => {
    try {
      if (userVideo.current && document.pictureInPictureEnabled) {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await userVideo.current.requestPictureInPicture();
        }
      }
    } catch {}
  };

  // Start call timer
  useEffect(() => {
    setDuration(0);
    setStatus('connecting');
    const id = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(id);
  }, [targetSocketId]);

  const fmt = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${m}:${ss}`;
  };

  return (
    <div ref={containerRef} className="relative w-full h-[60vh] md:h-[70vh] rounded-2xl overflow-hidden bg-black">
      {/* Remote video full-bleed */}
      <video ref={userVideo} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />

      {/* Gradient top bar like Instagram Live */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
        <div className="pointer-events-auto flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${status==='connected'?'bg-emerald-400':status==='connecting'?'bg-yellow-300':status==='failed'?'bg-red-500':'bg-orange-400'}`}></span>
            <span className="font-semibold">Live Verification</span>
            <span className="text-xs opacity-80">{fmt(duration)}</span>
          </div>
          <button onClick={endCall} className="px-3 py-1.5 rounded-full bg-red-600 text-xs font-medium hover:bg-red-700 transition">End</button>
        </div>
      </div>

      {/* Local video PiP */}
      <div className="absolute bottom-28 right-4 md:bottom-32 md:right-6">
        <video ref={myVideo} autoPlay muted playsInline className="w-28 h-40 md:w-36 md:h-52 rounded-xl object-cover border border-white/20 shadow-xl" />
      </div>

      {/* Bottom control bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
        <div className="mx-auto flex items-center justify-center gap-3 md:gap-4">
          <IconBtn active={micOn} onClick={toggleMic} title={micOn?'Mute mic':'Unmute mic'}>
            {micOn ? Icons.MicOn : Icons.MicOff}
          </IconBtn>
          <IconBtn active={camOn} onClick={toggleCam} title={camOn?'Turn camera off':'Turn camera on'}>
            {camOn ? Icons.CamOn : Icons.CamOff}
          </IconBtn>
          <IconBtn onClick={flipCamera} title="Flip camera">{Icons.Flip}</IconBtn>
          <IconBtn onClick={enterPiP} title="Picture-in-Picture">{Icons.PiP}</IconBtn>
          <IconBtn onClick={toggleFullscreen} title="Fullscreen">{Icons.Fullscreen}</IconBtn>
        </div>
      </div>
    </div>
  );
};

// Small, dependency-free icon button and SVGs
const IconBtn = ({ active=true, onClick, title, children }) => (
  <button
    onClick={onClick}
    title={title}
    className={`w-11 h-11 md:w-12 md:h-12 rounded-full grid place-items-center transition border ${active? 'bg-white/90 text-gray-900 border-white/40 hover:bg-white': 'bg-white/15 text-white border-white/20 hover:bg-white/25'}`}
  >
    <span className="w-5 h-5 md:w-6 md:h-6 inline-block">{children}</span>
  </button>
);

const Icons = {
  MicOn: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3z"/><path d="M5 11a7 7 0 0 0 14 0h-2a5 5 0 0 1-10 0H5z"/><path d="M11 18h2v3h-2z"/></svg>
  ),
  MicOff: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 11V6a3 3 0 0 0-5.5-1.7l8.2 8.2A3 3 0 0 0 15 11z"/><path d="M5 11a7 7 0 0 0 10.8 5.7l1.5 1.5 1.4-1.4L3.6 3.6 2.2 5l3 3.1V11z"/></svg>
  ),
  CamOn: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 7a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v1l4-2.5V18L16 15v2a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7z"/></svg>
  ),
  CamOff: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.2 3.6 3.6 2.2l18.2 18.2-1.4 1.4-3.4-3.4L16 20H6a3 3 0 0 1-3-3V9l3.4 3.4V7a3 3 0 0 1 .2-1.1L2.2 3.6z"/><path d="M21 7.5 16 10.5V7a3 3 0 0 0-3-3H9.1l9.3 9.3 2.6 1.6V7.5z"/></svg>
  ),
  Flip: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h7v3l5-4-5-4v3H6a4 4 0 0 0-4 4v3h2V9a2 2 0 0 1 2-2z"/><path d="M17 17H10v-3l-5 4 5 4v-3h8a4 4 0 0 0 4-4v-3h-2v3a2 2 0 0 1-2 2z"/></svg>
  ),
  Fullscreen: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 3H3v4h2V5h2V3zM17 3v2h2v2h2V3h-4zM5 17H3v4h4v-2H5v-2zM19 19h-2v2h4v-4h-2v2z"/></svg>
  ),
  PiP: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/><rect x="6" y="7" width="8" height="6" rx="1"/></svg>
  ),
};

export default VideoChat;
import React, { useEffect, useRef, useState } from 'react';

// Props:
// - socket: Your initialized and connected socket.io instance.
// - otherSocketId: The socket ID of the user you want to call.

const VideoChat1 = ({ socket, otherSocketId }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const peerConnectionRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // 1. Get user media on component mount
  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };

    getMedia();
  }, []);

  // 2. Setup signaling listeners
  useEffect(() => {
    if (!socket || !localStream) return;

    // Configuration for the RTCPeerConnection
    const servers = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    };

    // Fired when the other peer adds a track
    const handleTrack = (event) => {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
        }
    };

    // Fired when an ICE candidate is generated
    const handleIceCandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { target: otherSocketId, candidate: event.candidate });
      }
    };
    
    // -- CALLEE: Handles an incoming offer --
    const handleOffer = async (data) => {
      console.log('Received offer...');
      peerConnectionRef.current = new RTCPeerConnection(servers);
      peerConnectionRef.current.ontrack = handleTrack;
      peerConnectionRef.current.onicecandidate = handleIceCandidate;

      // Add local tracks to the connection
      localStream.getTracks().forEach(track => {
        peerConnectionRef.current.addTrack(track, localStream);
      });
      
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
      
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);

      socket.emit('answer', { target: data.from, answer });
    };

    // -- CALLER: Handles the answer from the callee --
    const handleAnswer = (data) => {
        console.log('Received answer...');
        peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
    };

    // -- BOTH: Handle incoming ICE candidates --
    const handleNewIceCandidate = (data) => {
        peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
    };


    // Set up listeners
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleNewIceCandidate);

    // Cleanup function
    return () => {
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice-candidate', handleNewIceCandidate);
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [socket, localStream, otherSocketId]);


  // 3. Function to initiate the call (CALLER's action)
  const callUser = async () => {
    if (!socket || !localStream) {
        alert("Socket or local stream not ready!");
        return;
    }
    console.log(`Calling user: ${otherSocketId}`);
    
    const servers = {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    };
    peerConnectionRef.current = new RTCPeerConnection(servers);

    // Add local tracks
    localStream.getTracks().forEach(track => {
      peerConnectionRef.current.addTrack(track, localStream);
    });

    // Set up event handlers for the connection
    peerConnectionRef.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { target: otherSocketId, candidate: event.candidate });
      }
    };
    
    // Create and send the offer
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
    
    socket.emit('offer', { target: otherSocketId, offer });
  };


  return (
    <div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div>
          <h2>My Video</h2>
          <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '300px', border: '1px solid black' }} />
        </div>
        <div>
          <h2>Remote Video</h2>
          <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '300px', border: '1px solid black' }} />
        </div>
      </div>
      <button onClick={callUser} disabled={!localStream}>
        Call {otherSocketId}
      </button>
    </div>
  );
};

export default VideoChat1;
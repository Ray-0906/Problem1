const activeCalls = new Map();
// Map userId -> verificationId for plantation flow (optional)
const userVerification = new Map();

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    const { userId, role } = socket.handshake.query;
    console.log(`Socket connected: ${socket.id}, Role: ${role}`);

    if (role === "admin") {
      socket.join("admins");
      console.log(`Admin socket joined: ${socket.id}`);
    }

    socket.on("user:callRequest", ({ userId, verificationId }) => {
       console.log('Call revived from user:', userId);
      // If a call is already tracked for this user, ignore duplicate requests
      if (activeCalls.has(userId)) {
        console.log(`Call already in progress for user: ${userId}`);
        return;
      }
      
      activeCalls.set(userId, null);
      if (verificationId) userVerification.set(userId, verificationId);
      const room= io.sockets.adapter.rooms.get("admins") ;
      console.log("Admins in room:", room);
      io.to("admins").emit("admin:callIncoming", {
        userId,
        userSocketId: socket.id,
        verificationId: verificationId || null,
      });
    });

  socket.on("admin:acceptCall", async ({ userId }) => { 
      if (activeCalls.get(userId)) return;

      activeCalls.set(userId, socket.id);

      const userSocket = [...io.sockets.sockets.values()].find(
        (s) => s.handshake.query.userId === userId
      );

      if (userSocket) {
        const verificationId = userVerification.get(userId) || null;
        // Persist socket ids onto verification for later completion end-call
        if (verificationId) {
          try {
            const { default: PlantationVerification } = await import("../models/PlantationVerification.js");
            await PlantationVerification.findByIdAndUpdate(verificationId, {
              callMeta: { userSocketId: userSocket.id, adminSocketId: socket.id },
              status: "in-progress",
              acceptedAt: new Date(),
            });
          } catch (e) {
            console.warn("Failed to persist callMeta:", e?.message);
          }
        }

        io.to(userSocket.id).emit("call:accepted", { adminSocketId: socket.id, verificationId });
        io.to(socket.id).emit("call:accepted", { userSocketId: userSocket.id, verificationId });
      }
    });

    socket.on("webrtc:signal", ({ signal, to }) => {
      io.to(to).emit("webrtc:signal", { signal, from: socket.id });
    });

    // Simple readiness handshake so the first offer isn't lost if the receiver
    // hasn't attached its listener yet; we just relay a one-shot ping.
    socket.on("webrtc:ready", ({ to }) => {
      io.to(to).emit("webrtc:peerReady", { from: socket.id });
    });
    socket.on("call:end", ({ to }) => {
  io.to(to).emit("call:end");
});

socket.on("call:cancelled", ({ userId }) => {
  io.to("admins").emit("call:cancelled", { userId });
});


   socket.on("disconnect", () => {
  console.log(`Socket disconnected: ${socket.id}`);

  // Clean up activeCalls (whether user or admin)
  const leavingUserId = socket.handshake?.query?.userId;
  for (const [userId, adminSocketId] of activeCalls.entries()) {
    // If the disconnecting socket is the tracked admin OR the same user id
    if (socket.id === adminSocketId || userId === leavingUserId) {
      activeCalls.delete(userId);
      userVerification.delete(userId);
      io.to("admins").emit("call:cancelled", { userId });
    }
  }
});

  });
};

export default socketHandler;

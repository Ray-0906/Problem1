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
        activeCalls.delete(userId);
      if (activeCalls.has(userId)){ 
        console.log(`Call already in progress for user: ${userId}`);
        return;}
      
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

    socket.on("admin:acceptCall", ({ userId }) => { 
      if (activeCalls.get(userId)) return;

      activeCalls.set(userId, socket.id);

      const userSocket = [...io.sockets.sockets.values()].find(
        (s) => s.handshake.query.userId === userId
      );

      if (userSocket) {
        const verificationId = userVerification.get(userId) || null;
        io.to(userSocket.id).emit("call:accepted", { adminSocketId: socket.id, verificationId });
        io.to(socket.id).emit("call:accepted", { userSocketId: userSocket.id, verificationId });
      }
    });

    socket.on("webrtc:signal", ({ signal, to }) => {
      io.to(to).emit("webrtc:signal", { signal, from: socket.id });
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
  for (const [userId, adminSocketId] of activeCalls.entries()) {
    if (socket.id === userId || socket.id === adminSocketId) {
      activeCalls.delete(userId);
      userVerification.delete(userId);
      io.to("admins").emit("call:cancelled", { userId });
    }
  }
});

  });
};

export default socketHandler;

const activeCalls = new Map();

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    const { userId, role } = socket.handshake.query;
    console.log(`Socket connected: ${socket.id}, Role: ${role}`);

    if (role === "admin") {
      socket.join("admins");
      console.log(`Admin socket joined: ${socket.id}`);
    }

    socket.on("user:callRequest", ({ userId }) => {
       console.log('Call revived from user:', userId);
        activeCalls.delete(userId);
      if (activeCalls.has(userId)){ 
        console.log(`Call already in progress for user: ${userId}`);
        return;}
      
      activeCalls.set(userId, null);
      const room= io.sockets.adapter.rooms.get("admins") ;
      console.log("Admins in room:", room);
      io.to("admins").emit("admin:callIncoming", {
        userId,
        userSocketId: socket.id,
      });
    });

    socket.on("admin:acceptCall", ({ userId }) => { 
      if (activeCalls.get(userId)) return;

      activeCalls.set(userId, socket.id);

      const userSocket = [...io.sockets.sockets.values()].find(
        (s) => s.handshake.query.userId === userId
      );

      if (userSocket) {
        io.to(userSocket.id).emit("call:accepted", { adminSocketId: socket.id });
        io.to(socket.id).emit("call:accepted", { userSocketId: userSocket.id });
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
      io.to("admins").emit("call:cancelled", { userId });
    }
  }
});

  });
};

export default socketHandler;

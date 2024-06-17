import { Server } from 'socket.io';

let io;
const userSocketMap = {};

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3002'],
      credentials: true,
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined") {
      userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      if (userId && userSocketMap[userId]) {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
      }
    });

    socket.on("sendMessage", (data) => {
      const { receiver, message, sender, _id, time } = data;
      const receiverSocketId = userSocketMap[receiver];
      const newMessage = { _id, message, sender, receiver, createdAt: new Date() };

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newCustomerMessage", newMessage);
      }

      // Emit the message back to the sender for confirmation
      socket.emit("messageSentConfirmation", newMessage);
    });
  });

  return io;
};

export const getReceiverSocketId = (receiver) => {
  return userSocketMap[receiver];
};

export { io };

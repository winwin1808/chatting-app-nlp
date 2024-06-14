import dotenv from 'dotenv';
import { Server } from 'socket.io';

dotenv.config();
const url = process.env.NODE_ENV === 'production' ? process.env.PROD_URL : process.env.DEV_URL;

let io;


const userSocketMap = {}; // {userId: socketId}

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
  });

  return io;
};

export const getReceiverSocketId = (receiver) => {
  return userSocketMap[receiver];
};

export { io };

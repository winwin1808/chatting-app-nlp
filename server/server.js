import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

import dotenv from "dotenv";
dotenv.config();

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URL, {
  useUnifiedTopology: true
}).then(() => {
  console.log('connected to mongoDB successfully');
}).catch((err) => {
  console.log('server error:', err.message);
});

const server = app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"]
  }
})

export const getReceiverSocketId = (receiver) => {
  return userSocketMap[receiver];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  // Emit online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    if (userId && userSocketMap[userId]) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export default app;

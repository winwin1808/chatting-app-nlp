// app.js
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

app.use(cors());
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

const io = new Server(server,{
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST"]
    }
})

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});

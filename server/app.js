import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
const url = process.env.NODE_ENV === 'production' ? process.env.PROD_URL : process.env.DEV_URL;
const app = express();

app.use(cors({
  origin: url, // Replace with your frontend URL
  credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRoutes);

export default app;

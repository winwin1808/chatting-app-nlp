import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import userMessageRoutes from './routes/userMessageRoutes.js';
import customerMessageRoutes from './routes/customerMessageRoutes.js';
import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import customerRoutes from './routes/customerRoute.js';

dotenv.config();
const url = process.env.NODE_ENV === 'production' ? process.env.PROD_URL : process.env.DEV_URL;
const app = express();

app.use(cors({
  origin: "*", // Replace with your frontend URL
  credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/userMessages", userMessageRoutes);
app.use("/api/customerMessages", customerMessageRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);

app.options('*', cors());

export default app;

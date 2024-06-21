import express from 'express';
import { sendCustomerMsg, getAllCustomerMsg } from '../controllers/customerMessageController.js';
import { sendRating } from '../controllers/ratingController.js'; 
import { protectRoute } from "../middleware/protectRoute.js";
import { logRoute } from "../middleware/logRoute.js";

const router = express.Router();

// Handle customer messages
router.post('/sendMessage/:id', sendCustomerMsg);
router.post('/getMessage/:id', logRoute, getAllCustomerMsg);

// Handle rating messages
router.post("/sendRating/:id", logRoute, sendRating);

export default router;

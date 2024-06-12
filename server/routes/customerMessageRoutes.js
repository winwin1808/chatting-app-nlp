import express from 'express';
import { sendCustomerMsg, getAllCustomerMsg } from '../controllers/customerMessageController.js';
import { sendRating, getRatings } from '../controllers/ratingController.js'; 
import { protectRoute } from "../middleware/protectRoute.js";
import { logRoute } from "../middleware/logRoute.js";

const router = express.Router();

// Handle customer messages
router.post('/:id', protectRoute, logRoute, sendCustomerMsg);
router.get('/:id', protectRoute, logRoute, getAllCustomerMsg);

// Handle rating messages
router.post("/sendRating/:id", logRoute, protectRoute, sendRating);
router.post("/getRating/:id", logRoute, protectRoute, getRatings);

export default router;

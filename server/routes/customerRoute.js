import express from 'express';
import { initializeCustomerChat } from '../controllers/customerController.js';

const router = express.Router();

import { protectRoute } from "../middleware/protectRoute.js";
import { logRoute } from "../middleware/logRoute.js";

// Endpoint to initialize the customer chat session
router.post('/initialize', logRoute, initializeCustomerChat);

export default router;
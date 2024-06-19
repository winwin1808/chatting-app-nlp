import express from 'express';
import {
    initializeCustomerChat,
    getAllConversationCustomers,
    markConversationAsDone,
    checkConversationStatus
} from '../controllers/customerController.js';

const router = express.Router();

import { protectRoute } from "../middleware/protectRoute.js";
import { logRoute } from "../middleware/logRoute.js";

// Endpoint to initialize the customer chat session
router.post('/initialize', logRoute, initializeCustomerChat);
router.get('/conversationStatus/:id', logRoute, checkConversationStatus);
router.get('/getConversations/:id', protectRoute, logRoute, getAllConversationCustomers);
router.put('/conversations/:id/done', protectRoute, logRoute,markConversationAsDone);
export default router;

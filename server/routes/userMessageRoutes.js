import { sendMsg, getAllMsg } from "../controllers/userMessageController.js"; 
import express from 'express';
import { protectRoute } from "../middleware/protectRoute.js";
import { logRoute } from "../middleware/logRoute.js";

const router = express.Router();

// Handle text messages
router.post("/sendMessage/:id", logRoute, protectRoute, sendMsg);
router.post("/getMessage/:id", logRoute, protectRoute, getAllMsg);

export default router;

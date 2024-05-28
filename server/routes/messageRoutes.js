import { sendMsg, getAllMsg } from "../controllers/messageController.js"; 
import express from 'express';
import { protectRoute } from "../middleware/protectRoute.js";
const router = express.Router();

router.post("/sendMessage/:id", protectRoute, sendMsg);
router.post("/getMessage/:id", protectRoute, getAllMsg);

export default router;

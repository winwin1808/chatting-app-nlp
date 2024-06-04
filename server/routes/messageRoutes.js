import { sendMsg, getAllMsg } from "../controllers/messageController.js"; 
import { sendRating, getRatings } from "../controllers/ratingController.js"; 
import express from 'express';
import { protectRoute } from "../middleware/protectRoute.js";
const router = express.Router();

//handle text message
router.post("/sendMessage/:id", protectRoute, sendMsg);
router.post("/getMessage/:id", protectRoute, getAllMsg);
//handle rating message
router.post("/sendRating/:id", protectRoute, sendRating);
router.post("/getRating/:id", protectRoute, getRatings);
export default router;

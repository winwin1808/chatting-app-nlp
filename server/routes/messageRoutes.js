import { sendMsg, getAllMsg } from "../controllers/messageController.js"; 
import { sendRating, getRatings } from "../controllers/ratingController.js"; 
import express from 'express';
import { protectRoute } from "../middleware/protectRoute.js";
import { logRoute } from "../middleware/logRoute.js"; // import logRoute
const router = express.Router();

//handle text message
router.post("/sendMessage/:id", logRoute, protectRoute, sendMsg);
router.post("/getMessage/:id", logRoute, protectRoute, getAllMsg);
//handle rating message
router.post("/sendRating/:id", logRoute, protectRoute, sendRating);
router.post("/getRating/:id", logRoute, protectRoute, getRatings);

export default router;
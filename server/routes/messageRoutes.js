import { sendMsg, getAllMsg } from "../controllers/messageController.js"; 
import express from 'express';
const router = express.Router();

router.post("/addmsg", sendMsg);
router.post("/getmsg", getAllMsg);

export default router;

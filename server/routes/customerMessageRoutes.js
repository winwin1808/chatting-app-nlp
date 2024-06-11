import express from 'express';
import { sendCustomerMsg, getAllCustomerMsg } from '../controllers/customerMessageController.js';
import { protectRoute } from "../middleware/protectRoute.js";
import { logRoute } from "../middleware/logRoute.js";
const router = express.Router();

router.post('/:id', protectRoute, logRoute, sendCustomerMsg);
router.get('/:id', protectRoute, logRoute, getAllCustomerMsg);

export default router;

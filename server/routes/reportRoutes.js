import {
    getAllRatings
} from "../controllers/reportController.js";
import { protectRoute, isAdmin } from "../middleware/protectRoute.js";
import { logRoute } from "../middleware/logRoute.js";
import express from 'express';

const router = express.Router();

router.post("/getAllRatings/", logRoute, protectRoute, isAdmin, getAllRatings);

export default router;

import {
    getAllRatings, ratingDownload, getRatings
} from "../controllers/reportController.js";
import { protectRoute, isAdmin } from "../middleware/protectRoute.js";
import { logRoute } from "../middleware/logRoute.js";
import express from 'express';

const router = express.Router();

router.post("/getAllRatings", logRoute, protectRoute, isAdmin, getAllRatings);
router.post("/getRatings", logRoute, protectRoute, isAdmin, getRatings);
router.post("/getAllRatings/download", logRoute, protectRoute, isAdmin, ratingDownload);
export default router;

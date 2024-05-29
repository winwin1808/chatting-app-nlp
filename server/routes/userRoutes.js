import { setAvatar, getAllUsers } from "../controllers/usersController.js"; 
import { protectRoute } from "../middleware/protectRoute.js";
import express from 'express';
const router = express.Router();

router.post("/setavatar/:id", setAvatar);  
router.get("/allusers/:id", protectRoute, getAllUsers);

export default router;

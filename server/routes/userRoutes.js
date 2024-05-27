import { setAvatar, getAllUsers } from "../controllers/usersController.js"; 
import express from 'express';
const router = express.Router();

router.post("/setavatar/:id", setAvatar);  
router.get("/allusers/:id", getAllUsers);

export default router;

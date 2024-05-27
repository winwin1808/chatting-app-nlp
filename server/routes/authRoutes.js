import express from 'express';
const router = express.Router();
import { register, login, logOut } from "../controllers/authController.js"; 

router.post("/register", register);
router.post("/login", login);
router.get("/logout/:id", logOut);

export default router;

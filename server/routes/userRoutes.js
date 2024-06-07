import {
    setAvatar,
    getAllUsers,
    createSubUser,
    getSubUsers,
    updateSubUser,
    deleteSubUser
} from "../controllers/usersController.js";
import { protectRoute, isAdmin } from "../middleware/protectRoute.js";
import express from 'express';
const router = express.Router();

router.post("/setavatar/:id", setAvatar);
router.get("/allusers/:id", protectRoute, getAllUsers);
// Add CRUD operations for sub-users (Create, Read, Update, Delete)
router.post('/sub-users', protectRoute, isAdmin, createSubUser);
router.get('/sub-users', protectRoute, isAdmin, getSubUsers);
router.put('/sub-users/:id', protectRoute, isAdmin, updateSubUser);
router.delete('/sub-users/:id', protectRoute, isAdmin, deleteSubUser);
export default router;

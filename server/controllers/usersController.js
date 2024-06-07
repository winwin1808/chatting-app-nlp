import User from '../models/userModel.js'; 
import bcrypt from 'bcrypt';

export const setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;

        const userData = await User.findByIdAndUpdate(
            userId,
            {
                isAvatarImageSet: true,
                avatarImage,
            },
            { new: true }
        );

        return res.status(200).json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });
    } catch (ex) {
        next(ex);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const loggedInUserId = req.user._id;
        const userRole = req.user.role;

        let filteredUsers;

        if (userRole === 'admin') {
            // If the user is an admin, get all sub-users under this admin and the admin themselves
            filteredUsers = await User.find({ $or: [{ _id: loggedInUserId }, { admin: loggedInUserId }] }).select([
                "email",
                "username",
                "avatarImage",
                "_id",
            ]);
        } else {
            // If the user is a sub-user, get the admin and other sub-users under the same admin
            const adminId = req.user.admin;
            if (!adminId) {
                return res.status(403).json({ message: "Not authorized to view other users" });
            }
            filteredUsers = await User.find({ $or: [{ _id: adminId }, { admin: adminId }] }).select([
                "email",
                "username",
                "avatarImage",
                "_id",
            ]);
        }

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getAllUsers: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};



// Add CRUD operations for sub-users (Create, Read, Update, Delete)
export const createSubUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const encrypted = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: encrypted,
            role: 'user',
            admin: req.user._id
        });
        const userData = newUser.toObject();
        delete userData.password;
        return res.status(201).json({ message: "Sub-user created successfully.", user: userData });
    } catch (error) {
        next(error);
    }
};

export const getSubUsers = async (req, res, next) => {
    try {
        const subUsers = await User.find({ admin: req.user._id });
        return res.status(200).json(subUsers);
    } catch (error) {
        next(error);
    }
};

export const updateSubUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
        const userData = updatedUser.toObject();
        delete userData.password;
        return res.status(200).json({ message: "Sub-user updated successfully.", user: userData });
    } catch (error) {
        next(error);
    }
};

export const deleteSubUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        return res.status(200).json({ message: "Sub-user deleted successfully." });
    } catch (error) {
        next(error);
    }
};

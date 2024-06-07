import User from '../models/userModel.js'; 
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken.js'; 

export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck) {
            return res.status(200).json({ status: 400, message: "Username already used" });
        }
        const emailCheck = await User.findOne({ email });
        if (emailCheck) {
            return res.status(200).json({ status: 400, message: "Email already used" });
        }

        const encrypted = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: encrypted,
            role: 'admin'
        });

        const userData = newUser.toObject();
        delete userData.password;

        if (newUser) {
            const token = generateToken(newUser._id);
            return res.status(200).json({ status: 200, message: "User registered successfully.", user: userData, token });
        }
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const userCount = await User.countDocuments();

        if (userCount === 0) {
            return res.status(200).json({ status: 400, message: "Please create an account" });
        }

        const usernameCheck = await User.findOne({ username });
        if (!usernameCheck) {
            return res.status(200).json({ status: 400, message: "Incorrect username or password" });
        }

        const passwordCheck = await bcrypt.compare(password, usernameCheck.password);

        if (!passwordCheck) {
            return res.status(200).json({ status: 400, message: "Incorrect username or password" });
        }

        const userData = usernameCheck.toObject();
        delete userData.password;

        const token = generateToken(usernameCheck._id);
        return res.status(200).json({ status: 200, message: userData, token });
    } catch (err) {
        next(err);
    }
};

export const logOut = (req, res, next) => {
    try {
        if (!req.params.id) return res.status(200).json({ status: 400, message: "User id is required" });
        return res.status(200).json({ status: 200, message: "User logged out successfully." });
    } catch (ex) {
        next(ex);
    }
};

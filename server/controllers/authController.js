import User from '../models/userModel.js'; 
import bcrypt from 'bcrypt';
import { generateTokenAndSetCookie } from '../utils/generateToken.js'; 

export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck) {
            return res.status(400).json({ message: "Username already used" });
        }
        const emailCheck = await User.findOne({ email });
        if (emailCheck) {
            return res.status(400).json({ message: "Email already used" });
        }
        const encrypted = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: encrypted
        });
        delete newUser.password;
        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
        }
        return res.status(200).json({ message: "User registered successfully.", user: newUser });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const usernameCheck = await User.findOne({ username });
        if (!usernameCheck) {
            return res.status(400).json({ message: "Incorrect username or password" });
        }

        const passwordCheck = await bcrypt.compare(password, usernameCheck.password);

        if (!passwordCheck) {
            return res.status(400).json({ message: "Incorrect username or password" });
        }

        delete usernameCheck.password;

        generateTokenAndSetCookie(usernameCheck._id, res);
        
        return res.status(200).json({ message: usernameCheck });
    } catch (err) {
        next(err);
    }
};

export const logOut = (req, res, next) => {
    try {
        if (!req.params.id) return res.status(404).json({ message: "User id is required" });
        res.cookie("jwt", "", { maxAge: 0 });
        return res.status(200).send();
    } catch (ex) {
        next(ex);
    }
};

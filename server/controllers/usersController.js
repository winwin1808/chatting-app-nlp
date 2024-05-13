const User = require('../model/userModel');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck) {
            console.log('111', usernameCheck)
            return res.json({ message: "Username already used", status: 400 });
        }
        const emailCheck = await User.findOne({ email });
        if (emailCheck) {
            return res.json({ message: "Email already used", status: 400 });
        }
        const encrypted = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: encrypted
        });
        delete newUser.password;
        return res.status(200).json({ message: "User registered successfully." + newUser });
    } catch (err) {
        next(err);
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const usernameCheck = await User.findOne({ username });
        console.log('111', usernameCheck)
        if (!usernameCheck) {
            console.log('222', usernameCheck)
            return res.json({ message: "Inccorect user name or password", status: 400 });
        }

        const passwordCheck = await bcrypt.compare(password, usernameCheck.password);

        if (!passwordCheck) {
            return res.json({ message: "Inccorect user name or password", status: 400 });
        }

        delete usernameCheck.password;

        return res.json({ message: usernameCheck, status: 200 });
    } catch (err) {
        next(err);
    }
};
const User = require('../model/userModel');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res, next) => {
    try{
        const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
        return res.status(400).json({ message: "Username already exists."});
    }
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
        return res.status(400).json({ message: "Email already exists."});
    }
    const encrypted = await  bcrypt.hash(password, 10);
    const newUser = await User.create({
        username,
        email,
        password: encrypted
    });
    delete newUser.password;
    return res.status(200).json({ message: "User registered successfully." + newUser});
}catch(err){
    next(err);
}
};
import User from '../model/userModel.js'; 
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
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);
        res.status(200).json(filteredUsers);
    } catch (ex) {
        console.error("Error in getAllUsers: ", error.message);
		res.status(500).json({ error: "Internal server error" });
    }
};
// export const getAllUsers = async (req, res, next) => {
//     try { 
//         const users = await User.find({ _id: { $ne: req.params.id } }).select([
//             "email",
//             "username",
//             "avatarImage",
//             "_id",
//         ]);
//         return res.json(users);
//     } catch (ex) {
//         next(ex);
//     }
// };

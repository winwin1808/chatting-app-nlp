import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 4,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false
    },
    avatarImage: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
},
{
    timestamps: true,
});

const User = mongoose.model("User", userSchema);
export default User;


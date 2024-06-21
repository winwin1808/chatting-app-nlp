import mongoose from 'mongoose';

const userConversationSchema = new mongoose.Schema(
    {
        participants: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }],
        messages: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: [],
        }],
        isSeen: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

const UserConversations = mongoose.model("UserConversation", userConversationSchema);
export default UserConversations;

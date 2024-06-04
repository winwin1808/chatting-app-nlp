import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
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
        ratings: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Rating",
            default: [],
        }]
    },
    {
        timestamps: true,
    }
);

const Conversations = mongoose.model("Conversation", conversationSchema);
export default Conversations;

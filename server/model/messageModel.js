import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: true
        },
        receiver:  {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;

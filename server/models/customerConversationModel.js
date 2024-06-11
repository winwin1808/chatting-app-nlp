import mongoose from 'mongoose';

const customerConversationSchema = new mongoose.Schema(
    {
        participants: [{
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'participantModel',
            required: true,
        }],
        participantModel: {
            type: String,
            required: true,
            enum: ['Admin', 'Customer'],
        },
        messages: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: [],
        }],
        ratings: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Rating",
            default: [],
        }],
        assignToUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            default: null,
        },
        isDone: {
            type: Boolean,
            default: false,
        },
        isSeen: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

const CustomerConversations = mongoose.model("CustomerConversation", customerConversationSchema);
export default CustomerConversations;
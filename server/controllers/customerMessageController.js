import Messages from '../models/messageModel.js';
import CustomerConversations from '../models/customerConversationModel.js';
import { io, getReceiverSocketId } from "../config/socket.js";

export const sendCustomerMsg = async (req, res, next) => {
    try {
        const { message } = req.body;
        const { id: conversationId } = req.params;
        const sender = req.body.adminId;

        // Fetch the conversation
        let conversation = await CustomerConversations.findOne({
            _id: conversationId,
            isDone: false
        });
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        // Create a new message
        const receiver = conversation.participants.find(participant => participant.toString() !== sender);
        if (!receiver) {
            return res.status(400).json({ error: "Receiver not found in conversation" });
        }

        const newCustomerMessage = new Messages({
            message,
            sender,
            receiver,
        });

        conversation.messages.push(newCustomerMessage._id);

        // Save the conversation and message
        await Promise.all([conversation.save(), newCustomerMessage.save()]);

        const receiverSocketId = getReceiverSocketId(receiver);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newAgentMessage", newCustomerMessage);
        }

        // Send the response back to the client
        res.status(201).json(newCustomerMessage);
    } catch (error) {
        console.log("Error in sendCustomerMsg controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getAllCustomerMsg = async (req, res, next) => {
    try {
        const { id: conversationId } = req.params;

        // Fetch the conversation and populate messages
        const conversation = await CustomerConversations.findById(conversationId).populate("messages");
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        const messages = conversation.messages;

        // Send the messages back to the client
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getAllCustomerMsg controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

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
        const { id } = req.params;
        const { userType } = req.query;
        // Find all conversations for the given customer
        if (userType === "agent") {
            const conversations = await CustomerConversations.find({
                participants: id
            }).populate("messages");

            if (!conversations || conversations.length === 0) {
                return res.status(404).json({ error: "No conversations found for this customer" });
            }

            // Extract messages from all conversations
            const allMessages = conversations.reduce((messages, conversation) => {
                return messages.concat(conversation.messages.map(message => ({
                    ...message.toObject(),
                    conversationId: conversation._id,
                    isDone: conversation.isDone
                })));
            }, []);
            // Send the messages back to the client
            res.status(200).json(allMessages);
        } else if (userType === "customer") {
            const { id } = req.params;

        // Find all conversations for the given customer
        const conversations = await CustomerConversations.find({
            participants: id
        }).populate("messages");

        if (!conversations || conversations.length === 0) {
            return res.status(404).json({ error: "No conversations found for this customer" });
        }

        // Extract messages from all conversations
        const allMessages = conversations.reduce((messages, conversation) => {
            return messages.concat(conversation.messages);
        }, []);

        // Send the messages back to the client
        res.status(200).json(allMessages);
        }
    } catch (error) {
        console.log("Error in getAllCustomerMsg controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

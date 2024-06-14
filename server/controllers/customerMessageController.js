import Messages from '../models/messageModel.js';
import CustomerConversations from '../models/customerConversationModel.js';
// import { getReceiverSocketId, io } from "../config/socket.js";

export const sendCustomerMsg = async (req, res, next) => {
    try {
        const { message } = req.body;
        const { id: conversationId } = req.params;
        const sender = req.body.adminId;
        // Fetch or create a conversation between sender and receiver
        let conversation = await CustomerConversations.findById(conversationId);
        console.log("111",conversation);
        // Create a new message
        const receiver = conversation.participants[0];
        const newMessage = new Messages({
            message,
            sender,
            receiver,
        });
        console.log(newMessage);
        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        // Save the conversation and message
        await Promise.all([conversation.save(), newMessage.save()]);

        // // Get the receiver's socket ID
        // const receiverSocketId = getReceiverSocketId(receiver);
        // if (receiverSocketId) {
        //     // Emit the new message to the receiver if they are connected
        //     io.to(receiverSocketId).emit("newMessage", newMessage);
        //     console.log("Message sent to receiver", receiverSocketId);
        // } else {
        //     console.log("Receiver not connected");
        // }

        // Send the response back to the client
        res.status(201).json(newMessage);
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
        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        // Send the messages back to the client
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getAllCustomerMsg controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
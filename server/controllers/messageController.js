import Messages from '../model/messageModel.js';
import Conversations from '../model/conversationModel.js';
import { getReceiverSocketId, io } from "../server.js";

export const sendMsg = async (req, res, next) => {
    try {
        const { message } = req.body;
        const { id: receiver } = req.params;
        const sender = req.user._id;

        // Fetch or create a conversation between sender and receiver
        let conversation = await Conversations.findOne({
            participants: { $all: [sender, receiver] },
        });

        if (!conversation) {
            conversation = await Conversations.create({
                participants: [sender, receiver],
            });
        }

        // Create a new message
        const newMessage = new Messages({
            message,
            sender,
            receiver,
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        // Save the conversation and message
        await Promise.all([conversation.save(), newMessage.save()]);
        console.log("RECEIVER", receiver)
        // Get the receiver's socket ID
        const receiverSocketId = getReceiverSocketId(receiver);
        console.log("receiverSocketId", receiverSocketId);
        if (receiverSocketId) {
            // Emit the new message to the receiver if they are connected
            io.to(receiverSocketId).emit("newMessage", newMessage);
            console.log("Message sent to receiver", receiverSocketId);
        }

        // Send the response back to the client
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMsg controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getAllMsg = async (req, res, next) => {
    try {
        const { id: userToChatId } = req.params;
        const sender = req.user._id;

        // Fetch the conversation and populate messages
        const conversation = await Conversations.findOne({
            participants: { $all: [sender, userToChatId] },
        }).populate("messages");

        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        // Send the messages back to the client
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getAllMsg controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

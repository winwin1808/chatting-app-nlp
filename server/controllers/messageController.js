import Messages from '../model/messageModel.js';
import Conversations from '../model/conversationModel.js';
import { getReceiverSocketId, io } from "../server.js";

export const sendMsg = async (req, res, next) => {
    try {
        const { message } = req.body;
        const { id: receiver } = req.params;
        const sender = req.user._id;

        let conversation = await Conversations.findOne({
            participants: { $all: [sender, receiver] },
        })

        if (!conversation) {
            conversation = await Conversations.create({
                participants: [sender, receiver],
            });
        }

        const newMessage = new Messages({
            message,
            sender,
            receiver,
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(), newMessage.save()]);

        const receiverSocketId = getReceiverSocketId(receiver);
        if (receiverSocketId) {
            // io.to(<socket_id>).emit() used to send events to specific client
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

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

        const conversation = await Conversations.findOne({
            participants: { $all: [sender, userToChatId] },
        }).populate("messages");
        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getAllMsg controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
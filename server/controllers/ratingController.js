import Ratings from '../models/ratingModel.js';
import Conversations from '../models/conversationModel.js';
import { getReceiverSocketId, io } from "../config/socket.js";

export const sendRating = async (req, res, next) => {
    try {
        const { star,content } = req.body;
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

        // Create a new rating
        const newRating = new Ratings({
            star,
            content,
            receiver,
            sender
        });

        if (newRating) {
            conversation.ratings.push(newRating._id);
        }
        
        // Save the conversation and rating
        await Promise.all([conversation.save(), newRating.save()]);
        
        // Get the receiver's socket ID
        const receiverSocketId = getReceiverSocketId(receiver);
        if (receiverSocketId) {
            // Emit the new rating to the receiver if they are connected
            io.to(receiverSocketId).emit("newRating", newRating);
            console.log("Rating sent to receiver", receiverSocketId);
        }
        
        // Send the response back to the client
        res.status(201).json(newRating);
    } catch (error) {
        console.error("Error in sendRating controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getRatings = async (req, res, next) => {
    try {
        const { id: userToChatId } = req.params;
        const sender = req.user._id;

        // Fetch the conversation and populate ratings
        const conversation = await Conversations.findOne({
            participants: { $all: [sender, userToChatId] },
        }).populate("ratings");

        if (!conversation) return res.status(200).json([]);

        const ratings = conversation.ratings;

        // Send the ratings back to the client
        res.status(200).json(ratings);
    } catch (error) {
        console.error("Error in getRatings controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

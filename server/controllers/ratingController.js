import Ratings from '../models/ratingModel.js';
import CustomerConversations from '../models/customerConversationModel.js';
import { getReceiverSocketId, io } from "../config/socket.js";

export const sendRating = async (req, res, next) => {
    try {
        const { star,content } = req.body;
        const conversationId = req.params.id;

        // Fetch or create a conversation between sender and receiver
        let conversation = await CustomerConversations.findById(conversationId);
        console.log(111,conversation)
        const receiver = conversation.participants[1];
        const sender = conversation.participants[0];

        // Create a new rating
        const newRating = new Ratings({
            star: star,
            content: content,
            receiver: receiver,
            sender: sender,
            isDone: true
        });
        console.log(newRating)

        if (newRating) {
            conversation.ratings.push(newRating._id);
        }
        
        // Save the conversation and rating
        await Promise.all([conversation.save(), newRating.save()]);
        
        res.status(201).json(newRating);
    } catch (error) {
        console.error("Error in sendRating controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


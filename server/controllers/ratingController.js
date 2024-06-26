import axios from 'axios';
import Ratings from '../models/ratingModel.js';
import CustomerConversations from '../models/customerConversationModel.js';
import { getReceiverSocketId, io } from "../config/socket.js";

export const sendRating = async (req, res, next) => {
    try {
        const { star, content } = req.body;
        const conversationId = req.params.id;

        // Fetch or create a conversation between sender and receiver
        let conversation = await CustomerConversations.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        const receiver = conversation.participants[1];
        const sender = conversation.participants[0];

        // Call the sentiment analysis API
        const sentimentResponse = await axios.post(process.env.SENTIMENT_ANALYSIS_API_URL, {
            text: content
        });

        const sentimentResult = sentimentResponse.data.sentiment;

        // Create a new rating
        const newRating = new Ratings({
            star: star,
            content: content,
            receiver: receiver,
            sender: sender,
            isDone: true,
            sentiment: sentimentResult // Use the string directly
        });

        // Save the rating and update the conversation
        await Promise.all([conversation.save(), newRating.save()]);

        res.status(201).json(newRating);
    } catch (error) {
        console.error("Error in sendRating controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

import axios from 'axios';
import Ratings from '../models/ratingModel.js';
import CustomerConversations from '../models/customerConversationModel.js';

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

        // Create a new rating without sentiment initially
        const newRating = new Ratings({
            star: star,
            content: content,
            receiver: receiver,
            sender: sender,
            isDone: true,
            sentiment: null // Initially set to null
        });

        // Save the rating
        await newRating.save();

        // Respond immediately with the new rating
        res.status(201).json(newRating);

        // Perform the sentiment analysis asynchronously
        try {
            const sentimentResponse = await axios.post(process.env.SENTIMENT_ANALYSIS_API_URL, {
                text: content
            }, { timeout: 60000 }); // 60 seconds timeout

            const sentimentResult = sentimentResponse.data.sentiment;

            // Update the rating with the sentiment
            newRating.sentiment = sentimentResult;
            await newRating.save();

            // Optionally, you can notify the client or receiver of the update here
        } catch (error) {
            if (error.code === 'ECONNABORTED') {
                console.error("Sentiment analysis API call timed out");
            } else {
                console.error("Error in sentiment analysis API call: ", error.message);
            }
            // If there was an error with sentiment analysis, log the error
        }
    } catch (error) {
        console.error("Error in sendRating controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

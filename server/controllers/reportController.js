import Ratings from '../models/ratingModel.js';
import { getReceiverSocketId, io } from "../config/socket.js";


export const getAllRatings = async (req, res, next) => {
    try {
        const { star, sender, receiver, start, end } = req.body;

        // Build the query object in the specified format
        let query = {
            star: star || undefined,
            sender: Array.isArray(sender) ? { $in: sender } : undefined,
            start: start || undefined,
            end: end || undefined,
        };
        // Convert the query object to the format required by Mongoose
        let mongooseQuery = {};
        if (query.star) mongooseQuery.star = { $in: query.star.map(Number) };
        if (query.sender) mongooseQuery.sender = query.sender;

        // Handle date range filtering
        if (query.start || query.end) {
            mongooseQuery.createdAt = {};
            if (query.start) mongooseQuery.createdAt.$gte = new Date(query.start);
            if (query.end) mongooseQuery.createdAt.$lte = new Date(query.end);
        } 
       
        // Fetch the ratings based on the Mongoose query
        const ratings = await Ratings.find(mongooseQuery)
            .populate('sender', 'username email')  // Populating sender's details
            .populate('receiver', 'username email');  // Populating receiver's details

        // Send the ratings back to the client
        res.status(200).json(ratings);
    } catch (error) {
        console.error("Error in getAllRatings controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

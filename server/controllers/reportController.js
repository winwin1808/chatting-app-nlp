import Ratings from '../models/ratingModel.js';
import express from 'express';
import { parse } from 'json2csv';

export const getAllRatings = async (req, res, next) => {
    try {
        const { star, receiver, start, end, page = 1, limit = 10 } = req.body;

        // Build the query object in the specified format
        let query = {
            star: star || undefined,
            receiver: Array.isArray(receiver) ? { $in: receiver } : undefined,
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

        // Calculate pagination
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
        };

        // Fetch the ratings based on the Mongoose query with pagination and sorting
        const ratings = await Ratings.find(mongooseQuery)
            .populate('receiver', 'username email')
            .sort({ createdAt: -1 })  // Sort by createdAt in descending order
            .skip((options.page - 1) * options.limit)
            .limit(options.limit);

        // Fetch total count for pagination
        const totalCount = await Ratings.countDocuments(mongooseQuery);

        // Send the ratings and pagination info back to the client
        res.status(200).json({
            ratings,
            currentPage: options.page,
            totalPages: Math.ceil(totalCount / options.limit),
            totalCount,
        });
    } catch (error) {
        console.error("Error in getAllRatings controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const getRatings = async (req, res, next) => {
    try {
        const  receiver  = req.body.sender;
        const ratings = await Ratings.find({ receiver: receiver });

        res.status(200).json({
            ratings
        });
    } catch (error) {
        console.error("Error in getRatings controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const ratingDownload = async (req, res, next) => {
    try {
        const { star, receiver, start, end } = req.body;
        let query = { ...req.body };
        if (star) query.star = { $in: star.map(Number) };
        if (receiver) query.receiver = { $in: receiver };

        if (start || end) {
            query.createdAt = {};
            if (start) query.createdAt.$gte = new Date(start);
            if (end) query.createdAt.$lte = new Date(end);
        }

        const ratings = await Ratings.find(query).populate('receiver', 'username email');
        const csv = parse(ratings, { fields: ['createdAt', 'content', 'star', 'isDone', 'receiver.username', 'sentiment','ratingScore'] });

        res.header('Content-Type', 'text/csv');
        res.attachment('ratings.csv');
        return res.send(csv);
    } catch (error) {
        console.error('Error generating CSV:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
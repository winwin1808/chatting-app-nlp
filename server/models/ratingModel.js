import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
    {
        star: {
            type: Number,
            required: true
        },
        content: {
            type: String,
            default: ''
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const Ratings = mongoose.model("Rating", ratingSchema);
export default Ratings;
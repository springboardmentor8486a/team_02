import mongoose, { Mongoose } from "mongoose";

const complaintSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    photo: {
        type: String,
    },

    locationCoords: {
        type: [Number], 
        required: true
    },

    address: {
        type: [String],
        required: true
    },

    // 💡 FIX: Removed the restrictive 'enum' to allow saving Volunteer Names (strings)
    assignedTo: {
        type: String, // Now accepts any string, including volunteer names or department names
        required: true,
        default: "Ward/zone office and central admin" // Use a valid initial default value
    },

    status: {
        type: String, 
        enum: ["recived", "inReview", "resolved"],
        default: "recived"
    },

    comments: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Comment"
        }
    ],

    createdAt: {
        type: Date,
        default: new Date(Date.now())
    },

    updatedAt: {
        type: Date,
        default: new Date(Date.now())
    },
});

export const Complaint = mongoose.model("Complaint", complaintSchema);
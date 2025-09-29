import mongoose, { Mongoose } from "mongoose";

const complaintSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true, // Id of the user
    },

    title: {
        type: String,
        required: true, // Title about the complaint
    },

    description: {
        type: String,
        required: true, // Tescription about the complaint
    },

    photo: {
        type: String,
        //required: true, // Img url
    },

    locationCoords: {
        type: [Number], // [lng, lat]
        required: true // Complaint geographic area
    },

    address: {
        type: [String],
        required: true // address
    },

    assignedTo: {
        type: String,
        enum: [
            "Municipal sanitation and public health",
            "Roads and street infrastructure",
            "Street lighting and electrical assets",
            "Water, sewerage, and stormwater",
            "Ward/zone office and central admin"
        ],
        required: true
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
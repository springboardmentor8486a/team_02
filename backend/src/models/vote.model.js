// models/vote.model.js
import mongoose, { Schema } from "mongoose";

const voteSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true, // Id of the user who cast the vote
    },

    complaintId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Complaint",
        required: true, // Id of the complaint being voted on
    },

    voteType: {
        type: String,
        enum: ["upvote", "downvote"],
        required: true, // The type of vote cast
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    // CRITICAL: Compound index ensures a user can only have ONE vote entry per complaint
    indexes: [{ unique: true, fields: ['userId', 'complaintId'] }] 
});

export const Vote = mongoose.model("Vote", voteSchema);
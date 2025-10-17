// controllers/vote.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Vote } from "../models/vote.model.js";
import mongoose from "mongoose";

// Assuming you have an existing Complaint model imported elsewhere for context validation, 
// though not strictly necessary for the Vote logic itself.

//=================== Helper: Compute Vote Counts ===============
async function computeCounts(complaintId) {
    const counts = await Vote.aggregate([
        { $match: { complaintId: new mongoose.Types.ObjectId(complaintId) } },
        { 
            $group: {
                _id: '$voteType',
                count: { $sum: 1 }
            }
        }
    ]);

    const upvote = counts.find(c => c._id === 'upvote')?.count || 0;
    const downVote = counts.find(c => c._id === 'downvote')?.count || 0;

    return { upvote, downVote };
}

//=================== Create / Update / Delete Vote ===============
export const vote = asyncHandler(async (req, res) => {
    const { complaintId } = req.params;
    const category = req.query?.category; // Expects 'upvote' or 'downvote'

    if (!["upvote", "downvote"].includes(category)) throw new ApiError(400, "Vote category required: must be 'upvote' or 'downvote'");

    let existingVote = await Vote.findOne({ complaintId, userId: req.user._id });

    if (existingVote) {
        if (existingVote.voteType === category) {
            // Case 1: Same vote type exists -> Toggle off (Delete vote)
            await Vote.findByIdAndDelete(existingVote._id);
        } else {
            // Case 2: Different vote type exists -> Change vote
            existingVote.voteType = category;
            await existingVote.save();
        }
    } else {
        // Case 3: No vote exists -> Create new vote
        await Vote.create({ complaintId, userId: req.user._id, voteType: category });
    }

    const counts = await computeCounts(complaintId);
    return res.status(200).json({ 
        success: true, 
        message: "Vote processed successfully",
        data: { counts } 
    });
});

//=================== Get Vote Counts for a Complaint ===============
export const complaintViseVotes = asyncHandler(async (req, res) => {
    const { complaintId } = req.params;
    const counts = await computeCounts(complaintId);
    return res.status(200).json({ success: true, data: counts });
});

//=================== Get User Votes on Multiple Issues (CORE PERSISTENCE LOGIC) ===================
export const getUserVotes = asyncHandler(async (req, res) => {
    const { issues } = req.query; // e.g., "id1,id2,id3"
    
    if (!issues) return res.status(200).json({ success: true, data: {} });

    // Convert comma-separated string of IDs to an array of Mongoose ObjectIds
    const issueIds = issues.split(",").map(id => {
        return mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
    }).filter(id => id !== null); 

    if (issueIds.length === 0) {
        return res.status(200).json({ success: true, data: {} });
    }

    // Query the database for the current user's votes on the specified complaints
    const votes = await Vote.find({ 
        userId: req.user._id, 
        complaintId: { $in: issueIds } 
    }).select("complaintId voteType -_id"); // Optimized query

    
    // Map the results to the format the frontend expects: { complaintId_string: "upvote" | "downvote" }
    const voteMap = votes.reduce((acc, v) => {
        // Use toString() to ensure the key matches the frontend's issue.id string format
        acc[v.complaintId.toString()] = v.voteType; 
        return acc;
    }, {});

    return res.status(200).json({ success: true, data: voteMap });
});
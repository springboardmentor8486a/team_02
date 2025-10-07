import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Complaint } from "../models/complaint.model.js";
import {Vote} from "../models/vote.model.js"

//====================== create vote ====================
// backend\conteollers\vote.conteoller.js

//====================== create vote ====================
const vote = asyncHandler(async (req, res)=>{
    let complaintId = req.params?.complaintId;
    let category = req.query?.category; // Expected: "upvote" or "downvote"

    if(category !== "upvote" && category !== "downvote"){
        throw new ApiError("User opinion vote required", 400);
    }

    let complaint = await Complaint.findById(complaintId);
    if(!complaint){
        throw new ApiError("Complaint not found while generating vote", 404);
    };

    let existingVote = await Vote.findOne({
        complaintId: complaintId, 
        userId: req.user._id
    });

    if(existingVote){
        if(existingVote.voteType === category){
            // SCENARIO 1: User is clicking the SAME vote type (e.g., upvote again). This means TOGGLE OFF (delete).
            let deletedVote = await Vote.findByIdAndDelete(existingVote._id);
            
            // NOTE: Must also remove the vote reference from the Complaint model 
            // (Your current Complaint model doesn't explicitly store vote references, only comments. 
            // The logic below assumes you want to track the total score correctly via separate counting).

            return res.status(200).json(new ApiResponse(200, deletedVote, "Vote removed successfully (Toggled off)"));
            
        } else {
            // SCENARIO 2: User is clicking the OPPOSITE vote type (e.g., changing from downvote to upvote). This means UPDATE.
            let updatedVote = await Vote.findByIdAndUpdate(
                existingVote._id, 
                { voteType: category }, 
                { new: true }
            );
            return res.status(200).json(new ApiResponse(200, updatedVote, "Vote changed successfully"));
        }
    }

    // SCENARIO 3: No existing vote found. Create a NEW vote.
    let createdVote = await Vote.create({
        complaintId,
        userId: req.user._id,
        voteType: category
    });

    res.status(200).json(new ApiResponse(200, createdVote, "Vote created successfully"));
});

// ... rest of the file (complaintViseVotes, deleteVote, export)

//================ Complaint vise votes ===============
const complaintViseVotes = asyncHandler(async(req, res)=>{
    let complaintId = req.params?.complaintId;   // Required complaint id 

    let complaint = await Complaint.findById(complaintId);
    if(!complaint){
        throw new ApiError(500, "complaint not found while counting vote")
    };

    let votes = await Vote.find({complaintId});
    let upvote = votes.reduce((accu, el)=> {
        if(el.voteType == "upvote"){
            return accu+=1
        }
        else{ return accu}
    }, 0);

    let downVote = votes.reduce((accu, el)=> {
        if(el.voteType == "downvote"){
            return accu+=1
        }
        else{ return accu}
    }, 0);

    res.status(200).json(new ApiResponse(200, {upvote, downVote}, "complaint votes fetched successfully"))
});


//==================== Delete vote =======================
const deleteVote = asyncHandler(async (req, res)=>{
    let complaintId = req.params?.complaintId;   // Required complaint id 

    let complaint = await Complaint.findById(complaintId);
    if(!complaint){
        throw new ApiError(500, "complaint not found while deleting vote")
    };

    let vote = await Vote.findOne({$and: [{complaintId: complaintId}, {userId: req.user._id}]});
    let deletedVote = await Vote.findByIdAndDelete(vote._id, {new: true});

    res.status(200).json(new ApiResponse(200, deletedVote, "vote deleted successfully"));
})


export {vote, complaintViseVotes, deleteVote}
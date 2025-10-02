import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Complaint } from "../models/complaint.model.js";
import {Vote} from "../models/vote.model.js"

//====================== create vote ====================
const vote = asyncHandler(async (req, res)=>{
    let complaintId = req.params?.complaintId;   // Required complaint id 
    let category = req.query?.category;     // Reuired vote up/down

    if(category !== "upvote" && category !== "downvote"){
        throw new ApiError(401, "user openian vote required");
    }

    let complaint = await Complaint.findById(complaintId);
    if(!complaint){
        throw new ApiError(500, "complaint not found while generating vote")
    };

    let vote = await Vote.findOne({$and: [{complaintId: complaintId}, {userId: req.user._id}]});
    if(vote){
        if(vote.voteType !== category){
            let updatedVote = await Vote.findByIdAndUpdate(vote._id, {voteType: category}, {new: true});   // chnage user vote
            return res.status(200).json(new ApiResponse(200, updatedVote, "user voted successfully"))
        }
        throw new ApiError(400, "user all ready voted");
    }

    let createdVote = await Vote.create({
        complaintId,
        userId: req.user._id,
        voteType: category
    });

    res.status(200).json(new ApiResponse(200, createdVote, "user voted successfully"))
});


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
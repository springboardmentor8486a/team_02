import {Comment} from "../models/comment.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {Complaint} from "../models/complaint.model.js"

//===================Create commnet===============
const createComment = asyncHandler(async (req, res)=>{
    let {complaintId} = req.params;
    let {content} = req.body;

    if(!complaintId){
        throw new ApiError(500, "complaint id is required");
    };

    let complaint = await Complaint.findById(complaintId);
    if(!complaint){
        throw new ApiError(404, "complaint not found");
    };

   
    let comment = await Comment.create({
        userId: req.user._id,
        content
    });

    let createdComment = await Comment.findById(comment._id);
    if(!createdComment){
        throw new ApiError(500, "comment not created")
    };

    let updatedComplaint = await Complaint.findByIdAndUpdate(complaintId, {$push: {comments: createdComment._id}}, {new: true});
    res.status(200).json(new ApiResponse(200, createdComment, "comment created success fully"))
    
});

export {createComment}

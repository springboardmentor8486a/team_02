import {Comment} from "../models/comment.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {Complaint} from "../models/complaint.model.js"

//===================Create comment===============
const createComment = asyncHandler(async (req, res)=>{
    let {complaintId} = req.params;
    let content = req.body?.content;

    if(!complaintId){
        throw new ApiError(500, "complaint id is required");
    };

    let complaint = await Complaint.findById(complaintId);
    if(!complaint){
        throw new ApiError(404, "complaint not found");
    };

    if(!content){
        throw new ApiError(401, "comment content is required");
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


//==================== Edit comment ===============
const editComment = asyncHandler(async (req, res)=>{
    let commentId = req.params?.commentId;
    let content = req.body?.content.trim();

    if(!commentId){
        throw new ApiError(400, "commentId is required while updating comment");
    };
    if(!content){
        throw new ApiError(400, "comment content is required while updating comment");
    };

    let comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(404, "comment fot found while updating comment");
    }
    if(comment.userId.toString() !== req.user._id.toString()){
        throw new ApiError(400, "user not authorize for edit this comment");
    };

    let updatedComment = await Comment.findByIdAndUpdate(commentId, {$set: {content: content}}, {new: true});
    res.status(200).json(new ApiResponse(200, updatedComment, "comment updated successfully"));
});


//==================== Delete comment ==================
const deleteComment = asyncHandler(async (req, res)=>{
    let complaintId = req.params?.complaintId;
    let commentId = req.params?.commentId;

    if(!commentId && complaintId){
        throw new ApiError(400, "complaintId and commentId is required while deleting comment");
    };

    let comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(400, "comment fot found while deleting comment");
    }
    if(comment.userId.toString() !== req.user._id.toString()){
        throw new ApiError(400, "user not authorize for delete this comment");
    };

    await Complaint.findByIdAndUpdate(complaintId, {$pull: {comments: commentId}});
    let deletedComment = await Comment.findByIdAndDelete(commentId);
    res.status(200).json(new ApiResponse(200, deletedComment, "comment delete successfully"));
})

export {createComment, editComment, deleteComment}

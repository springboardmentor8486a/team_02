// comments.controller.js
import { Comment } from "../models/comment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Complaint } from "../models/complaint.model.js";

//===================Create comment===============
const createComment = asyncHandler(async (req, res) => {
    const { complaintId } = req.params;
    const text = req.body?.text?.trim() || req.body?.content?.trim(); // ✅ Support both field names

    if (!complaintId) throw new ApiError(400, "Complaint id is required");
    if (!text) throw new ApiError(400, "Comment text is required");

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) throw new ApiError(404, "Complaint not found");

    const comment = await Comment.create({
        userId: req.user._id,
        complaintId,
        text // ✅ Changed from 'content' to 'text'
    });

    await Complaint.findByIdAndUpdate(complaintId, { $push: { comments: comment._id } });

    const createdComment = await Comment.findById(comment._id)
        .populate('userId', 'name')
        .lean();

    res.status(200).json(new ApiResponse(200, createdComment, "Comment created successfully"));
});

//==================== Get comments for a complaint =================
const getCommentsByComplaint = asyncHandler(async (req, res) => {
    const { complaintId } = req.params;

    if (!complaintId) throw new ApiError(400, "Complaint id is required");

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) throw new ApiError(404, "Complaint not found");

    const comments = await Comment.find({ complaintId })
        .sort({ createdAt: -1 })
        .populate('userId', 'name')
        .lean();

    res.status(200).json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

//==================== Edit comment ===============
const editComment = asyncHandler(async (req, res) => {
    const { complaintId, commentId } = req.params;
    let text = req.body?.text?.trim() || req.body?.content?.trim(); // ✅ Support both field names

    if (!commentId) {
        throw new ApiError(400, "commentId is required while updating comment");
    }
    if (!text) {
        throw new ApiError(400, "comment text is required while updating comment");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "comment not found while updating comment");
    }
    if (comment.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "user not authorized to edit this comment");
    }

    comment.text = text; // ✅ Changed from 'content' to 'text'
    comment.updatedAt = new Date();
    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
        .populate('userId', 'name')
        .lean();

    res.status(200).json(new ApiResponse(200, updatedComment, "comment updated successfully"));
});

//==================== Delete comment ==================
const deleteComment = asyncHandler(async (req, res) => {
    const { complaintId, commentId } = req.params;

    if (!complaintId || !commentId) throw new ApiError(400, "ComplaintId and CommentId are required");

    const comment = await Comment.findById(commentId);
    if (!comment) throw new ApiError(404, "Comment not found");
    if (comment.userId.toString() !== req.user._id.toString()) throw new ApiError(403, "Not authorized");

    await Complaint.findByIdAndUpdate(complaintId, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    res.status(200).json(new ApiResponse(200, { _id: commentId }, "Comment deleted successfully"));
});

export { createComment, editComment, deleteComment, getCommentsByComplaint };
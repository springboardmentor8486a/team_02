// controllers/comments.controller.js
import { Comment } from "../models/comment.model.js";
import { Complaint } from "../models/complaint.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//===================Create comment===============
const createComment = asyncHandler(async (req, res) => {
  const { complaintId } = req.params;
  const text = req.body?.text?.trim() || req.body?.content?.trim();

  if (!complaintId) throw new ApiError(400, "Complaint id is required");
  if (!text) throw new ApiError(400, "Comment text is required");

  const complaint = await Complaint.findById(complaintId);
  if (!complaint) throw new ApiError(404, "Complaint not found");

  const comment = await Comment.create({
    userId: req.user._id,
    complaintId,
    text,
  });

  await Complaint.findByIdAndUpdate(complaintId, { $push: { comments: comment._id } });

  const createdComment = await Comment.findById(comment._id)
    .populate("userId", "name _id")
    .lean();

  res.status(200).json(new ApiResponse(200, createdComment, "Comment created successfully"));
});

//====================Get comments=================
const getCommentsByComplaint = asyncHandler(async (req, res) => {
  const { complaintId } = req.params;
  if (!complaintId) throw new ApiError(400, "Complaint id is required");

  const complaint = await Complaint.findById(complaintId);
  if (!complaint) throw new ApiError(404, "Complaint not found");

  const comments = await Comment.find({ complaintId })
    .sort({ createdAt: -1 })
    .populate("userId", "name _id")
    .lean();

  res.status(200).json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

//====================Edit comment=================
const editComment = asyncHandler(async (req, res) => {
  const { complaintId, commentId } = req.params;
  const text = req.body?.text?.trim() || req.body?.content?.trim();

  if (!complaintId || !commentId) throw new ApiError(400, "ComplaintId and CommentId are required");
  if (!text) throw new ApiError(400, "Comment text is required");

  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");
  if (comment.userId.toString() !== req.user._id.toString())
    throw new ApiError(403, "You are not authorized to edit this comment");

  comment.text = text;
  comment.updatedAt = new Date();
  await comment.save();

  const updatedComment = await Comment.findById(comment._id)
    .populate("userId", "name _id")
    .lean();

  res.status(200).json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

//====================Delete comment=================
const deleteComment = asyncHandler(async (req, res) => {
  const { complaintId, commentId } = req.params;
  if (!complaintId || !commentId) throw new ApiError(400, "ComplaintId and CommentId are required");

  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");
  if (comment.userId.toString() !== req.user._id.toString())
    throw new ApiError(403, "You are not authorized to delete this comment");

  await Complaint.findByIdAndUpdate(complaintId, { $pull: { comments: commentId } });
  await Comment.findByIdAndDelete(commentId);

  res.status(200).json(new ApiResponse(200, { _id: commentId }, "Comment deleted successfully"));
});

export { createComment, getCommentsByComplaint, editComment, deleteComment };

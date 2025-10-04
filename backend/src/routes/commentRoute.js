import { Router } from "express";
import { createComment, deleteComment, editComment } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const commentRouter = Router();

commentRouter.route("/:complaintId").post(verifyJWT, createComment);  // Create comment
commentRouter.route("/:commentId").put(verifyJWT, editComment);  // Edit comment
commentRouter.route("/:complaintId/:commentId").delete(verifyJWT, deleteComment)  // Delete comment

export default commentRouter;



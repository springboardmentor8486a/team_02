import { Router } from "express";
import { createComment } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const commentRouter = Router();

commentRouter.route("/:complaintId").post(verifyJWT, createComment);

export default commentRouter;



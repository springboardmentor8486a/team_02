// routes/vote.router.js
import { Router } from "express";
// Assuming verifyJWT is available in your middleware directory
import { verifyJWT } from "../middlewares/auth.middleware.js"; 
import { vote, complaintViseVotes, getUserVotes } from "../controllers/vote.controller.js";

const voteRouter = Router();

// Endpoint for fetching the current user's vote status across multiple issues
// This is the endpoint the frontend calls on load.
voteRouter.route("/user-votes").get(verifyJWT, getUserVotes);

// Endpoint for creating/changing a vote
voteRouter.route("/:complaintId").post(verifyJWT, vote);   

// Endpoint for getting total vote counts for a single complaint
voteRouter.route("/:complaintId").get(verifyJWT, complaintViseVotes); 

export default voteRouter;
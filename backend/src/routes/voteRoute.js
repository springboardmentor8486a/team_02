import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { complaintViseVotes, deleteVote, vote } from "../controllers/vote.controller.js";

let voteRouter = Router();

voteRouter.route("/:complaintId").post(verifyJWT, vote);   //?category=up/down
voteRouter.route("/:complaintId").get(verifyJWT, complaintViseVotes);  // complaint vise votes
voteRouter.route("/:complaintId").delete(verifyJWT, deleteVote)

export default voteRouter;
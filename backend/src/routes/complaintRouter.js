import {Router} from "express";
import { upload } from "../middlewares/multer.middleware.js";

import { registerComplaint, viewComplaint, editComplaint, deleteComplaint } from "../controllers/complaint.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const complaintRouter = Router();

complaintRouter.route("/register").post(verifyJWT, upload.single("complaintPhoto"), registerComplaint);

complaintRouter.route("/dashboard/:userId").get(verifyJWT,viewComplaint);
complaintRouter.route("/:complaintId").put(verifyJWT,upload.single("complaintPhoto"), editComplaint);
complaintRouter.route("/:complaintId").delete(deleteComplaint);

export default complaintRouter;
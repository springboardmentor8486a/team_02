import {Router} from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { registerComplaint, viewComplaint } from "../controllers/complaint.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const complaintRouter = Router();

complaintRouter.route("/register").post(verifyJWT, upload.single("complaintPhoto"), registerComplaint);
complaintRouter.route("/dashboard").get(verifyJWT, viewComplaint);

export default complaintRouter;
import {Router} from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { registerComplaint, viewComplaint } from "../controllers/complaint.controller.js";

const complaintRouter = Router();

complaintRouter.route("/register").post(upload.single("complaintPhoto"),registerComplaint);
complaintRouter.route("/dashboard/:userId").get(viewComplaint);

export default complaintRouter;
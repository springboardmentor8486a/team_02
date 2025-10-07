import {Router} from "express";
import { upload } from "../middlewares/multer.middleware.js";

import { 
    registerComplaint, 
    viewComplaint, 
    editComplaint, 
    deleteComplaint,
    getAllComplaints,
    updateComplaintAssignment // <--- IMPORTED
} from "../controllers/complaint.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const complaintRouter = Router();

complaintRouter.route("/register").post(verifyJWT, upload.single("complaintPhoto"), registerComplaint);

complaintRouter.route("/all").get(verifyJWT, getAllComplaints); 

// Route for admin to assign/reassign a volunteer
complaintRouter.route("/assign/:complaintId").put(verifyJWT, updateComplaintAssignment); // <--- NEW ROUTE

complaintRouter.route("/dashboard/:userId").get(verifyJWT, viewComplaint);
complaintRouter.route("/:complaintId").put(verifyJWT,upload.single("complaintPhoto"), editComplaint);
complaintRouter.route("/:complaintId").delete(deleteComplaint);

export default complaintRouter;
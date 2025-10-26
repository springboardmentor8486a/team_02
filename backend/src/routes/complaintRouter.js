import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
    registerComplaint,
    viewComplaint,
    editComplaint,
    deleteComplaint,
    getAllComplaints,
    updateComplaintAssignment,
    getAssignedIssues,
    volunteerUpdateStatus,
    getPendingRequests,
    getComplaintById
} from "../controllers/complaint.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const complaintRouter = Router();

// --- IMPORTANT: Specific routes MUST come BEFORE parameterized routes ---

// Admin: Fetch all pending volunteer status updates
complaintRouter.route("/pending-requests").get(verifyJWT, getPendingRequests);

// Get all complaints (Browse Issues)
complaintRouter.route("/all").get(verifyJWT, getAllComplaints);

// Volunteer: Get assigned issues
complaintRouter.route("/assigned").get(verifyJWT, getAssignedIssues);

// Register new complaint
complaintRouter.route("/register").post(verifyJWT, upload.single("complaintPhoto"), registerComplaint);

// User's own complaints dashboard
complaintRouter.route("/dashboard/:userId").get(verifyJWT, viewComplaint);

// Admin: Assign/reassign volunteer
complaintRouter.route("/assign/:complaintId").put(verifyJWT, updateComplaintAssignment);

// Volunteer: Update status
complaintRouter.route("/update-status/:complaintId")
    .put(verifyJWT, upload.single("proofPhoto"), volunteerUpdateStatus);

// --- Parameterized routes MUST be at the END ---

// GET single complaint by ID (CRITICAL: This route MUST come last)
complaintRouter.route("/:complaintId").get(verifyJWT, getComplaintById);

// Edit complaint
complaintRouter.route("/:complaintId").put(verifyJWT, upload.single("complaintPhoto"), editComplaint);

// Delete complaint
complaintRouter.route("/:complaintId").delete(verifyJWT, deleteComplaint);

export default complaintRouter;
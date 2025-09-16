import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Complaint } from "../models/complaint.model.js";

// ================= Complaint Registration =================
const registerComplaint = asyncHandler(async (req, res, next)=>{
    const {userId, title, description, address} = req.body;

    if (!userId || !title || !description || !address) {
        throw new ApiError("All required fields must be provided", 400);
    };

    let complaintPhotoUrl = "";
    if (req.file?.path) {
        const uploadResult = await uploadOnCloudinary(req.file.path);
        if (!uploadResult) {
            throw new ApiError("complaint photo upload failed", 500);
        }
        complaintPhotoUrl = uploadResult.secure_url; // Cloudinary hosted URL
    };

    let complaint = await Complaint.create({
        userId,
        title,
        description,
        address,
        photo: complaintPhotoUrl
    });

    const createdComplaint = await Complaint.findById(complaint._id);
    if (!createdComplaint) {
        throw new ApiError("complaint registration failed", 500);
    }

    res.status(201).json(new ApiResponse(201, createdComplaint, "Complaint Registered successfully"));
});

// ================= Complaint List =================
const viewComplaint = asyncHandler(async (req, res, next)=>{
    let allComplaints = await Complaint.find({userId: req.params.userId}).populate("userId");
    res.status(201).json(new ApiResponse(201, allComplaints, "user data fetched successfully"));
});

export {registerComplaint, viewComplaint};
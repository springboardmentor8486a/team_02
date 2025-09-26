import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Complaint } from "../models/complaint.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// ================= Complaint Registration =================
const registerComplaint = asyncHandler(async (req, res, next)=>{
    const {title, description, address, locationCoords, assignedTo} = req.body;

    if ( !title || !description || !address || !locationCoords) {
        throw new ApiError(400, "All required fields must be provided");
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
        userId: req.user._id,
        title,
        description,
        address,
        photo: complaintPhotoUrl,
        locationCoords: locationCoords,
        assignedTo: assignedTo
    });

    const createdComplaint = await Complaint.findById(complaint._id);
    if (!createdComplaint) {
        throw new ApiError("complaint registration failed", 500);
    }

    res.status(201).json(new ApiResponse(200, createdComplaint, "Complaint Registered successfully"));
});

// ================= Complaint List =================
const viewComplaint = asyncHandler(async (req, res)=>{
    let allComplaints = await Complaint.find({userId: req.user._id});
    res.status(201).json(new ApiResponse(201, allComplaints, "user data fetched successfully"));
});

export {registerComplaint, viewComplaint};
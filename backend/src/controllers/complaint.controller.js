import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Complaint } from "../models/complaint.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// ================= Complaint Registration =================
const registerComplaint = asyncHandler(async (req, res, next)=>{

     const userId = req.user?._id;
    const { title, description, address, assignedTo, locationCoords} = req.body;

    if (!userId || !title || !description || !address || !assignedTo || !locationCoords) {
        throw new ApiError(400, "All required fields must be provided");
    }

    // Validate assignedTo field against allowed values
    const allowedDepartments = [
        "Municipal sanitation and public health",
        "Roads and street infrastructure",
        "Street lighting and electrical assets",
        "Water, sewerage, and stormwater",
        "Ward/zone office and central admin"
    ];
    
    if (!allowedDepartments.includes(assignedTo)) {
        throw new ApiError(404,"Invalid department assigned");

    };

    let complaintPhotoUrl = "";
    if (req.file?.path) {
        const uploadResult = await uploadOnCloudinary(req.file.path);
        if (!uploadResult) {
            throw new ApiError(500, "complaint photo upload failed");
        }
        complaintPhotoUrl = uploadResult.secure_url; // Cloudinary hosted URL
    };

    let complaint = await Complaint.create({
        userId: req.user._id,
        title,
        description,
        address,
        photo: complaintPhotoUrl,

        assignedTo,
        locationCoords

    });

    const createdComplaint = await Complaint.findById(complaint._id);
    if (!createdComplaint) {
        throw new ApiError(500, "complaint registration failed");
    }

    res.status(201).json(new ApiResponse(200, createdComplaint, "Complaint Registered successfully"));
});

// ================= Complaint List =================
const viewComplaint = asyncHandler(async (req, res)=>{
    let allComplaints = await Complaint.find({userId: req.user._id});
    res.status(201).json(new ApiResponse(201, allComplaints, "user data fetched successfully"));
});

// ================= Edit Complaint =================
const editComplaint = asyncHandler(async (req, res, next) => {
    const { complaintId } = req.params;
    const { title, description, address, assignedTo, locationCoords, status } = req.body;

    // Find the complaint first
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
        throw new ApiError(404, "Complaint not found");
    }

    // Validate assignedTo if it's being updated
    if (assignedTo) {
        const allowedDepartments = [
            "Municipal sanitation and public health",
            "Roads and street infrastructure",
            "Street lighting and electrical assets",
            "Water, sewerage, and stormwater",
            "Ward/zone office and central admin"
        ];
        
        if (!allowedDepartments.includes(assignedTo)) {
            throw new ApiError(400, "Invalid department assigned");
        }
    }

    // Handle photo upload if new photo is provided
    let complaintPhotoUrl = complaint.photo; // Keep existing photo by default
    if (req.file?.path) {
        const uploadResult = await uploadOnCloudinary(req.file.path);
        if (!uploadResult) {
            throw new ApiError(500,"complaint photo upload failed",);
        }
        complaintPhotoUrl = uploadResult.secure_url;
    }

    // Update the complaint
    const updatedComplaint = await Complaint.findByIdAndUpdate(
        complaintId,
        {
            $set: {
                title: title || complaint.title,
                description: description || complaint.description,
                address: address || complaint.address,
                assignedTo: assignedTo || complaint.assignedTo,
                locationCoords: locationCoords || complaint.locationCoords,
                photo: complaintPhotoUrl,
                status: status || complaint.status,
                updatedAt: new Date(Date.now())
            }
        },
        { new: true }
    ).populate("userId");

    if (!updatedComplaint) {
        throw new ApiError(500, "Error while updating complaint");
    }

    res.status(200).json(new ApiResponse(200, updatedComplaint, "Complaint updated successfully"));
});

// ================= Delete Complaint =================
const deleteComplaint = asyncHandler(async (req, res, next) => {
    const { complaintId } = req.params;

    // Find and delete the complaint
    const deletedComplaint = await Complaint.findByIdAndDelete(complaintId);
    
    if (!deletedComplaint) {
        throw new ApiError(404, "Complaint not found");
    }

    res.status(200).json(new ApiResponse(200, {}, "Complaint deleted successfully"));
});

export {registerComplaint, viewComplaint, editComplaint, deleteComplaint};
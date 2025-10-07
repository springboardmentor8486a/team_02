import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Complaint } from "../models/complaint.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

// --- Department List (Used for registration/editing by user for initial categorization) ---
const allowedDepartments = [
    "Municipal sanitation and public health",
    "Roads and street infrastructure",
    "Street lighting and electrical assets",
    "Water, sewerage, and stormwater",
    "Ward/zone office and central admin"
];
// ------------------------------------------------------------------------------------------

// ================= Complaint Registration =================
const registerComplaint = asyncHandler(async (req, res, next)=>{

    const userId = req.user?._id;
    let { title, description, address, assignedTo, locationCoords} = req.body; 

    // --- CRITICAL FIX: Parse JSON strings for array/number fields sent via FormData ---
    try {
        locationCoords = JSON.parse(locationCoords);
    } catch (e) {
        throw new ApiError("Invalid format for locationCoords", 400);
    }
    
    try {
        address = JSON.parse(address);
    } catch (e) {
        if (typeof address === 'string') {
            address = [address];
        } else {
            throw new ApiError("Invalid format for address", 400);
        }
    }
    // ---------------------------------------------------------------------------------

    // Re-validate required fields after parsing
    if (!userId || !title || !description || !address || address.length === 0 || !assignedTo || !locationCoords || locationCoords.length !== 2) {
        throw new ApiError("All required fields must be provided", 400);
    }

    // Validate assignedTo during initial registration against allowed departments
    if (!allowedDepartments.includes(assignedTo)) {
        throw new ApiError("Invalid department assigned", 400);
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
        assignedTo,
        locationCoords
    });

    const createdComplaint = await Complaint.findById(complaint._id);
    if (!createdComplaint) {
        throw new ApiError("complaint registration failed", 500);
    }

    res.status(201).json(new ApiResponse(200, createdComplaint, "Complaint Registered successfully"));
});

// ================= Update Complaint Assignment (FIXED) =================
const updateComplaintAssignment = asyncHandler(async (req, res) => {
    const { complaintId } = req.params;
    const { assignedTo } = req.body; // Contains the Volunteer Name (string)

    if (!mongoose.Types.ObjectId.isValid(complaintId)) {
        throw new ApiError("Invalid Complaint ID", 400);
    }

    if (!assignedTo) {
        throw new ApiError("Volunteer assignment name is required", 400);
    }
    
    const updatedComplaint = await Complaint.findByIdAndUpdate(
        complaintId,
        {
            $set: {
                assignedTo: assignedTo, // This now successfully stores the Volunteer Name
                updatedAt: new Date(Date.now())
            }
        },
        // Set runValidators to false to prevent the Mongoose schema enum check from failing 
        { new: true, runValidators: false } 
    );

    if (!updatedComplaint) {
        throw new ApiError("Complaint not found or assignment failed", 404);
    }

    res.status(200).json(new ApiResponse(200, updatedComplaint, "Complaint assigned successfully"));
});


// ================= Complaint List =================
const viewComplaint = asyncHandler(async (req, res)=>{
    let allComplaints = await Complaint.find({userId: req.user._id});
    res.status(201).json(new ApiResponse(201, allComplaints, "user data fetched successfully"));
});

// ================= Edit Complaint (for Admin/Full Edit) =================
const editComplaint = asyncHandler(async (req, res, next) => {
    const { complaintId } = req.params;
    let { title, description, address, assignedTo, locationCoords, status } = req.body; 

    // --- CRITICAL FIX: Parse JSON strings for array/number fields ---
    if (locationCoords && typeof locationCoords === 'string') {
        try {
            locationCoords = JSON.parse(locationCoords);
        } catch (e) {
            throw new ApiError("Invalid format for locationCoords update", 400);
        }
    }
    if (address && typeof address === 'string') {
        try {
            address = JSON.parse(address);
        } catch (e) {
            throw new ApiError("Invalid format for address update", 400);
        }
    }
    // -------------------------------------------------------------

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
        throw new ApiError("Complaint not found", 404);
    }

    // Handle photo upload if new photo is provided
    let complaintPhotoUrl = complaint.photo;
    if (req.file?.path) {
        const uploadResult = await uploadOnCloudinary(req.file.path);
        if (!uploadResult) {
            throw new ApiError("complaint photo upload failed", 500);
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
                // Allow assignedTo to be updated with department OR volunteer name
                assignedTo: assignedTo || complaint.assignedTo,
                locationCoords: locationCoords || complaint.locationCoords, 
                photo: complaintPhotoUrl,
                status: status || complaint.status,
                updatedAt: new Date(Date.now())
            }
        },
        { new: true, runValidators: false } // Set runValidators to false
    ).populate("userId");

    if (!updatedComplaint) {
        throw new ApiError("Error while updating complaint", 500);
    }

    res.status(200).json(new ApiResponse(200, updatedComplaint, "Complaint updated successfully"));
});

// ================= Delete Complaint =================
const deleteComplaint = asyncHandler(async (req, res, next) => {
    const { complaintId } = req.params;

    const deletedComplaint = await Complaint.findByIdAndDelete(complaintId);
    
    if (!deletedComplaint) {
        throw new ApiError("Complaint not found", 404);
    }

    res.status(200).json(new ApiResponse(200, {}, "Complaint deleted successfully"));
});

// ================= Get All Complaints (Browse Issues) =================
const getAllComplaints = asyncHandler(async (req, res) => {
    const { search, category, status, sort } = req.query;
    
    let query = {};

    // Filter by Category (assignedTo)
    if (category && category !== 'All Categories') {
        const categoryMap = {
            'Garbage & Waste': 'Municipal sanitation and public health',
            'Potholes': 'Roads and street infrastructure',
            'Street Lights': 'Street lighting and electrical assets',
            'Water Issues': 'Water, sewerage, and stormwater',
            'Vandalism': 'Ward/zone office and central admin',
            'Other': 'Ward/zone office and central admin'
        };
        const assignedToValue = categoryMap[category];
        if (assignedToValue) {
            query.assignedTo = assignedToValue;
        }
    }

    // Filter by Status
    if (status && status !== 'All Statuses') {
        const statusMap = {
            'Pending': 'recived',
            'In Progress': 'inReview',
            'Resolved': 'resolved'
        };
        const statusValue = statusMap[status];
        if (statusValue) {
            query.status = statusValue;
        }
    }

    // Search filter
    if (search) {
        const searchRegex = { $regex: search, $options: 'i' };
        query.$or = [
            { title: searchRegex },
            { description: searchRegex },
            { address: searchRegex } 
        ];
    }
    
    let sortOptions = { createdAt: -1 }; 
    
    if (sort === 'Oldest First') {
        sortOptions = { createdAt: 1 };
    } else {
        sortOptions = { createdAt: -1 };
    }

    const complaints = await Complaint.find(query)
        .populate("userId", "name profilePhoto") 
        .sort(sortOptions);

    res.status(200).json(new ApiResponse(200, complaints, "All complaints fetched successfully"));
});


export {registerComplaint, viewComplaint, editComplaint, deleteComplaint, getAllComplaints, updateComplaintAssignment};
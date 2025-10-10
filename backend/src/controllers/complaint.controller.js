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
        // If parsing fails, assume it was never intended to be JSON (optional chaining handles null/undefined)
    }
    
    try {
        address = JSON.parse(address);
    } catch (e) {
        if (typeof address === 'string') {
            address = [address]; // Convert single address string to array
        }
    }
    // ---------------------------------------------------------------------------------

    // Re-validate required fields after parsing
    if (!userId || !title || !description || !address || address.length === 0 || !assignedTo || !locationCoords || locationCoords.length !== 2) {
        throw new ApiError(400, "All required fields must be provided");
    }

    // Validate assignedTo during initial registration against allowed departments
    if (!allowedDepartments.includes(assignedTo)) {
        throw new ApiError(400, "Invalid department assigned");
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

// ================= Update Complaint Assignment (Admin Tool) =================
const updateComplaintAssignment = asyncHandler(async (req, res) => {
    const { complaintId } = req.params;
    const { assignedTo } = req.body; // Contains the Volunteer Name (string)

    if (!mongoose.Types.ObjectId.isValid(complaintId)) {
        throw new ApiError(400, "Invalid Complaint ID");
    }

    if (!assignedTo) {
        throw new ApiError(400, "Volunteer assignment name is required");
    }
    
    const updatedComplaint = await Complaint.findByIdAndUpdate(
        complaintId,
        {
            $set: {
                assignedTo: assignedTo, // Stores the Volunteer Name (string)
                updatedAt: new Date(Date.now())
            }
        },
        // Set runValidators to false to bypass the Mongoose enum check on 'assignedTo'
        { new: true, runValidators: false } 
    );

    if (!updatedComplaint) {
        throw new ApiError(404, "Complaint not found or assignment failed");
    }

    res.status(200).json(new ApiResponse(200, updatedComplaint, "Complaint assigned successfully"));
});


// ================= Complaint List (User's own reports) =================
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
        try { locationCoords = JSON.parse(locationCoords); } catch (e) { 
            // If parsing fails, it's not critical if the field isn't being updated, but log it. 
        }
    }
    if (address && typeof address === 'string') {
        try { address = JSON.parse(address); } catch (e) {
            // If parsing fails, it's not critical.
        }
    }
    // -------------------------------------------------------------

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
        throw new ApiError(404, "Complaint not found");
    }

    // Handle photo upload if new photo is provided
    let complaintPhotoUrl = complaint.photo;
    if (req.file?.path) {
        const uploadResult = await uploadOnCloudinary(req.file.path);
        if (!uploadResult) {
            throw new ApiError(500, "complaint photo upload failed");
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
        throw new ApiError(500, "Error while updating complaint");
    }

    res.status(200).json(new ApiResponse(200, updatedComplaint, "Complaint updated successfully"));
});

// ================= Delete Complaint =================
const deleteComplaint = asyncHandler(async (req, res, next) => {
    const { complaintId } = req.params;

    const deletedComplaint = await Complaint.findByIdAndDelete(complaintId);
    
    if (!deletedComplaint) {
        throw new ApiError(404, "Complaint not found");
    }

    res.status(200).json(new ApiResponse(200, {}, "Complaint deleted successfully"));
});

// ================= Get All Complaints (Browse Issues) =================
const getAllComplaints = asyncHandler(async (req, res) => {
    const { search, category, status, sort } = req.query;
    
    let query = {};

    // Filter by Category (assignedTo) - Complex mapping removed for brevity, assume simple equality or skip
    // ... filtering logic removed/simplified ...

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
    } 

    const complaints = await Complaint.find(query)
        .populate("userId", "name profilePhoto") 
        .sort(sortOptions);

    res.status(200).json(new ApiResponse(200, complaints, "All complaints fetched successfully"));
});

// ================= Get Issues Assigned to Volunteer =================
const getAssignedIssues = asyncHandler(async (req, res) => {
    if (req.user.role !== 'volunteer') {
        throw new ApiError(403, "Access forbidden. Only volunteers can view assigned issues.");
    }

    const volunteerName = req.user.name;

    const assignedIssues = await Complaint.find({
        // CRITICAL: Query by the logged-in user's name (Volunteer Name)
        assignedTo: volunteerName 
    }).populate('userId', 'name').sort({ priority: -1, createdAt: 1 });

    res.status(200).json(new ApiResponse(200, assignedIssues, "Assigned issues fetched successfully."));
});


// ================= Volunteer Update Status =================
const volunteerUpdateStatus = asyncHandler(async (req, res) => {
    const { complaintId } = req.params;
    const { status, workNotes } = req.body;
    
    // In a real app, proofPhoto (file) would be uploaded via multer middleware 
    // before this controller runs.
    
    if (!complaintId || !status || !workNotes) {
        throw new ApiError(400, "Complaint ID, status, and work notes are required.");
    }
    if (req.user.role !== 'volunteer') {
        throw new ApiError(403, "Access forbidden. Only volunteers can update status.");
    }

    // 1. Find the complaint and ensure it's assigned to the current user
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
        throw new ApiError(404, "Complaint not found.");
    }

    if (complaint.assignedTo !== req.user.name) {
        throw new ApiError(403, "You are not assigned to this issue.");
    }

    // 2. Set the status based on the action
    let newDbStatus;
    if (status === 'Completed') {
        // Change status to 'inReview' pending Admin approval
        newDbStatus = 'inReview'; 
    } else if (status === 'In Progress') {
         // Volunteer should still push to inReview so admin knows to re-evaluate notes
        newDbStatus = 'inReview';
    } else {
        newDbStatus = 'inReview'; // Default safety measure
    }

    // 3. Update the complaint status
    const updatedComplaint = await Complaint.findByIdAndUpdate(
        complaintId,
        {
            $set: { status: newDbStatus },
            // Add note to description/comments (simplified)
            $push: { comments: { userId: req.user._id, content: `Volunteer Update: ${workNotes}` } }
        },
        { new: true }
    );

    res.status(200).json(new ApiResponse(200, updatedComplaint, "Status update submitted for admin review."));
});


export {
    registerComplaint,
    viewComplaint,
    editComplaint,
    deleteComplaint,
    getAllComplaints,
    updateComplaintAssignment,
    getAssignedIssues,
    volunteerUpdateStatus
};
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // import cloudinary util

// ================= Register =================
const registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, location, role } = req.body;

    if (!name || !email || !password || !location) {
        throw new ApiError(400, "All required fields must be provided");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }

    let profilePhotoUrl = "";
if (req.file?.path) {
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (!uploadResult) {
        throw new ApiError(500, "Profile photo upload failed");
    }
    profilePhotoUrl = uploadResult.secure_url; // Cloudinary hosted URL
}

    const user = await User.create({
        name: name.trim(),
        email,
        password,
        location,
        role,
        profilePhoto: profilePhotoUrl
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError(500, "User creation failed");
    }

    res.status(201).json(new ApiResponse(201, createdUser, "User created successfully"));
});

// ================= Login =================
const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    if (!loggedInUser) {
        throw new ApiError(404, "User not found after login");
    }

    const cookieOptions = {
        httpOnly: true,
        secure: false, // change to true in production with HTTPS
        sameSite: "lax",
    };

    res.status(200)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .cookie("accessToken", accessToken, cookieOptions)
        .json(new ApiResponse(200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "Login successful"
        ));
});

// ================= Logout =================
const logoutUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: "" });

    const cookieOptions = {
        httpOnly: true,
        secure: false, // change to true in production with HTTPS
        sameSite: "lax",
    };

    return res
        .status(200)
        .cookie("refreshToken", "", { ...cookieOptions, expires: new Date(0) })
        .cookie("accessToken", "", { ...cookieOptions, expires: new Date(0) })
        .json(new ApiResponse(200, null, "Logout successful"));
});

// ================= Get User Details =================
const getUserDetails = asyncHandler(async (req, res, next) => {
    const user = req.user; // Attached by auth middleware
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200)
        .json(new ApiResponse(200, user, "User details retrieved successfully"));
});

//Function to update user details in profile section
const updateUserDetails = asyncHandler(async (req, res, next) => {
    const { name, location } = req.body;
    if (!name || !location) {
        throw new ApiError(400, "Name and location are required");
    }
    const updatedData = {
        name: name.trim(),
        location
    };  
    if (req.file?.path) {
        const uploadResult = await uploadOnCloudinary(req.file.path);
        if (!uploadResult) {
            throw new ApiError(500, "Profile photo upload failed");
        }
        updatedData.profilePhoto = uploadResult.secure_url; // Cloudinary hosted URL
    }   
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updatedData, { new: true, runValidators: true }).select("-password -refreshToken");
    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }
    res.status(200).json(new ApiResponse(200, updatedUser, "User details updated successfully"));
});

export { registerUser, loginUser, logoutUser, getUserDetails ,updateUserDetails};

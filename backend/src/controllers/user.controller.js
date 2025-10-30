import crypto from 'crypto';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { Complaint } from "../models/complaint.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from 'fs';
import path from 'path';
// ================= Register =================
const registerUser = asyncHandler(async (req, res, next) => {
// ✅ Accept both 'name' and 'fullName' for flexibility
const { name, fullName, email, password, location, role } = req.body;
const userName = fullName || name; // Use fullName if provided, otherwise name

// Validate required fields
if (!userName || !email || !password || !location) {
throw new ApiError(400, "All required fields must be provided");
}

// Check if user already exists
const existingUser = await User.findOne({ email });
if (existingUser) {
throw new ApiError(400, "User already exists");
}

// Handle profile photo upload
let profilePhotoUrl = "";
if (req.file?.path) {
const uploadResult = await uploadOnCloudinary(req.file.path);
if (!uploadResult) {
throw new ApiError(500, "Profile photo upload failed");
}
profilePhotoUrl = uploadResult.secure_url;
}

// Create user with correct field name
const user = await User.create({
fullName: userName.trim(), // ✅ Changed to fullName
email,
password,
location,
role: role || 'user', // ✅ Default to 'user' if not provided
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

user.refreshToken = refreshToken;
await user.save({ validateBeforeSave: false });

const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
if (!loggedInUser) {
throw new ApiError(404, "User not found after login");
}

const cookieOptions = {
httpOnly: true,
secure: false,
sameSite: "lax",
};

res.status(200)
.cookie("refreshToken", refreshToken, cookieOptions)
.cookie("accessToken", accessToken, cookieOptions)
.json(new ApiResponse(200,
{ user: loggedInUser, accessToken, refreshToken },
"Login successful"
));
});

// ================= Logout =================
const logoutUser = asyncHandler(async (req, res, next) => {
// CRITICAL: Ensure req.user._id is used for finding the user to update refreshToken
await User.findByIdAndUpdate(req.user._id, { refreshToken: "" });

const cookieOptions = {
httpOnly: true,
secure: false,
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
const user = req.user;
if (!user) {
throw new ApiError(404, "User not found");
}

res.status(200).json(new ApiResponse(200, user, "User details retrieved successfully"));
});

// ================= Update User Details =================

const updateUserDetails = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized: User not logged in");
    }

    const { fullName, email, location, about: aboutFromBody, aboutMe, removeProfilePhoto } = req.body || {};
    const updateData = {};

    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (location) updateData.location = location;
    const aboutVal = typeof aboutFromBody === 'string' ? aboutFromBody : aboutMe;
    if (typeof aboutVal === 'string') updateData.aboutMe = aboutVal;

    // ✅ Handle Remove Photo
    if (removeProfilePhoto === "true") {
      updateData.profilePhoto = "";
    }

    // ✅ Handle New Photo Upload (Multer -> Temp Folder -> Move)
    if (req.file) {
      const oldPath = req.file.path.replace(/\\/g, "/");
      const newDir = "public/uploads";

      if (!fs.existsSync(newDir)) fs.mkdirSync(newDir, { recursive: true });

      const newPath = path.join(newDir, req.file.filename);
      fs.renameSync(oldPath, newPath);

      // Normalize path separators for cross-platform compatibility
      const normalizedPath = newPath.replace(/\\/g, "/");
      updateData.profilePhoto = normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password -refreshToken");

    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    throw new ApiError(500, "Server error while updating profile");
  }
});


// ================= Get All Users and Stats =================
const getAllUsersAndStats = asyncHandler(async (req, res, next) => {
if (req.user.role === 'user') {
throw new ApiError(403, "Access forbidden. Requires admin or volunteer role.");
}

let complaintStats = [];
let allUsers = [];

try {
allUsers = await User.find({}).select("-password -refreshToken");
complaintStats = await Complaint.aggregate([
{ $group: { _id: "$userId", reportsCount: { $sum: 1 } } }
]);
} catch (dbError) {
console.error("Database Aggregation Error:", dbError);
throw new ApiError(500, "Error running database statistics query.");
}

const responseData = allUsers.map(user => {
const userObj = user.toObject();
const reports = complaintStats.find(s => s._id.toString() === user._id.toString());
userObj.reportsCount = reports ? reports.reportsCount : 0;

if (userObj.role === 'volunteer') {
userObj.assigned = (user.location && user.location.includes('North')) ? 12 : 8;
userObj.resolved = (user.location && user.location.includes('North')) ? 47 : 32;
}

return userObj;
});

res.status(200).json(new ApiResponse(200, responseData, "Users and statistics fetched successfully"));
});

// ================= Forgot Password =================
const forgotPassword = asyncHandler(async (req, res) => {
const { email } = req.body;

// Validate email
if (!email) {
throw new ApiError(400, 'Email is required');
}

// Find user
const user = await User.findOne({ email });

if (!user) {
// Security: Don't reveal if user exists
return res.status(200).json(
new ApiResponse(200, null, 'If an account exists, a password reset link will be sent')
);
}

// Check if user signed up with Google
if (user.googleId) {
throw new ApiError(400, 'This account uses Google Sign-In. Please sign in with Google instead.');
}

// Generate reset token
const resetToken = crypto.randomBytes(32).toString('hex');
// Hash it before saving to database
const resetTokenHash = crypto
.createHash('sha256')
.update(resetToken)
.digest('hex');

// Save to user
user.resetPasswordToken = resetTokenHash;
user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
await user.save({ validateBeforeSave: false });

// Create reset URL (user will click this link)
const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/reset-password/${resetToken}`;

// Log for testing (remove in production)
// console.log('🔗 Reset URL:', resetUrl);

res.status(200).json(
new ApiResponse(
200,
{ resetUrl }, // Remove this in production
'Password reset link generated successfully'
)
);
});

// ================= Reset Password =================
const resetPassword = asyncHandler(async (req, res) => {
const { token } = req.params; // From URL
const { password, confirmPassword } = req.body; // New password

// Validate passwords
if (!password || !confirmPassword) {
throw new ApiError(400, 'Both password fields are required');
}

if (password !== confirmPassword) {
throw new ApiError(400, 'Passwords do not match');
}

if (password.length < 6) {
throw new ApiError(400, 'Password must be at least 6 characters');
}

// Hash the token to match with database
const resetTokenHash = crypto
.createHash('sha256')
.update(token)
.digest('hex');

// Find user with valid token
const user = await User.findOne({
resetPasswordToken: resetTokenHash,
resetPasswordExpires: { $gt: Date.now() } // Token not expired
});

if (!user) {
throw new ApiError(400, 'Invalid or expired token');
}

// Update password
user.password = password;
user.resetPasswordToken = undefined;
user.resetPasswordExpires = undefined;
await user.save();

res.status(200).json(
new ApiResponse(200, null, 'Password reset successful. You can now login with your new password.')
);
});
export {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  updateUserDetails,
  forgotPassword,
  resetPassword,
  getAllUsersAndStats
};
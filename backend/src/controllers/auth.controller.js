import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Helper: build a safe user object with consistent field names
function buildSafeUser(userDoc) {
  const user = userDoc.toObject({ getters: true });
  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    location: user.location || "",
    about: user.about ?? user.aboutMe ?? "",
    profilePhoto: user.profilePhoto || "",
    isVerified: user.isVerified || false,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

// POST /signup
const signup = asyncHandler(async (req, res) => {
  const { fullName, email, password, role, location, about } = req.body || {};
  const emailNormalized = (email || '').toLowerCase().trim();
  const passwordRaw = (password || '').toString();

  if (!fullName || !emailNormalized || !passwordRaw) {
    throw new ApiError(400, "fullName, email and password are required");
  }

  const existing = await User.findOne({ email: emailNormalized });
  if (existing) {
    throw new ApiError(400, "User already exists");
  }

  // Optional profile photo (multer provides req.file)
  let profilePhotoUrl = "";
  if (req.file?.path) {
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (!uploadResult) {
      throw new ApiError(500, "Profile photo upload failed");
    }
    profilePhotoUrl = uploadResult.secure_url;
  }

  const user = await User.create({
    fullName: fullName.trim(),
    email: emailNormalized,
    password: passwordRaw, // hashed by pre-save hook
    role: role || "user",
    location: location || "",
    // Support both about and aboutMe (model may alias)
    about: about || "",
    profilePhoto: profilePhotoUrl
  });

  const created = await User.findById(user._id).select("-password -refreshToken");
  if (!created) {
    throw new ApiError(500, "User creation failed");
  }

  const accessToken = created.generateAccessToken();
  const refreshToken = created.generateRefreshToken();

  created.refreshToken = refreshToken;
  await created.save({ validateBeforeSave: false });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  const safeUser = buildSafeUser(created);

  return res
    .status(201)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(new ApiResponse(201, { user: safeUser, accessToken }, "Signup successful"));
});

// POST /login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  const emailNormalized = (email || '').toLowerCase().trim();
  const passwordRaw = (password || '').toString();
  if (!emailNormalized || !passwordRaw) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: emailNormalized });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // If this account was created via Google, it may not have a password set
  if (user.googleId && !user.password) {
    throw new ApiError(400, 'This account uses Google Sign-In. Please sign in with Google.');
  }

  let isValid = await user.comparePassword(passwordRaw);
  if (!isValid) {
    // Legacy support: migrate old plain-text passwords to bcrypt on-the-fly
    if (user.password && typeof user.password === 'string' && user.password.length > 0 && user.password === passwordRaw) {
      user.password = passwordRaw; // will be hashed by pre-save hook
      await user.save();
      isValid = true;
    }
  }
  if (!isValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  const safeUser = buildSafeUser(user);

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(new ApiResponse(200, { user: safeUser, accessToken }, "Login successful"));
});

export { signup, login };
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import User from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || 
                  req.header("Authorization")?.replace("Bearer ", "");

    // ✅ ADD THESE LOGS
    console.log('🔍 verifyJWT - Checking token...');
    console.log('Cookies:', req.cookies);
    console.log('Authorization header:', req.header("Authorization"));

    if (!token) {
      console.log('❌ No token found');  // ✅ ADD THIS LOG
      throw new ApiError(401, "Unauthorized request");
    }

    console.log('🔑 Token found:', token.substring(0, 20) + "...");  // ✅ ADD THIS LOG

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      console.log('❌ User not found for token');  // ✅ ADD THIS LOG
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    console.log('✅ User authenticated:', user.email);  // ✅ ADD THIS LOG
    next();
  } catch (error) {
    console.error('❌ JWT Verification Error:', error.message);  // ✅ ADD THIS LOG
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import User from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || 
                  req.header("Authorization")?.replace("Bearer ", "");

    // REMOVED: console.log('🔍 verifyJWT - Checking token...');
    // REMOVED: console.log('Cookies:', req.cookies);
    // REMOVED: console.log('Authorization header:', req.header("Authorization"));

    if (!token) {
      // The log below logs when NO token is found, which is informative, so we can keep it for debugging failures.
      console.log('❌ No token found');
      throw new ApiError(401, "Unauthorized request");
    }

    // REMOVED: console.log('🔑 Token found:', token.substring(0, 20) + "..."); 

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      // KEEP: This logs when a token is invalid (points to a non-existent user).
      console.log('❌ User not found for token');
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    
    // IMPLICIT LOG REMOVAL: The "✅ User authenticated: ..." log is likely coming 
    // from a successful path outside of this middleware (e.g., in a request logger 
    // in app.js). You'll need to ensure the request logger in app.js is removed 
    // (as instructed previously).

    next();
  } catch (error) {
    // KEEP: This logs the general error during verification.
    console.error('❌ JWT Verification Error:', error.message);
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
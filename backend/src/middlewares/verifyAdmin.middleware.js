import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Middleware to verify if user is admin
 */
export const verifyAdmin = asyncHandler(async (req, res, next) => {
  // User is already attached to req by verifyJWT middleware
  if (!req.user) {
    throw new ApiError("Unauthorized: User not authenticated", 401);
  }

  if (req.user.role !== 'admin') {
    throw new ApiError("Forbidden: Admin access required", 403);
  }

  next();
});
import { Router } from "express";
import { 
    registerUser,
    loginUser,
    logoutUser,
    getUserDetails,
    updateUserDetails,
    getAllUsersAndStats,
    forgotPassword,
    resetPassword
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = Router();

// Password reset routes (Public)
userRouter.route("/forgot-password").post(forgotPassword);
userRouter.route("/reset-password/:token").post(resetPassword);

// User routes
userRouter.route("/register").post(upload.single("profilePhoto"), registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyJWT, logoutUser);

// ADD THIS - Current user endpoint for OAuth callback
userRouter.route("/current-user").get(verifyJWT, getUserDetails);

userRouter.route("/profile").get(verifyJWT, getUserDetails);
userRouter.route("/profile").put(verifyJWT, upload.single("profilePhoto"), updateUserDetails);

// Admin route
userRouter.route("/list-all").get(verifyJWT, getAllUsersAndStats); 

export default userRouter;
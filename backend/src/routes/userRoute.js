import { Router } from "express";
import path from "path";
import multer from "multer";
import { logoutUser, getUserDetails, updateUserDetails, getAllUsersAndStats, forgotPassword, resetPassword } from "../controllers/user.controller.js";
import { signup as registerUser, login as loginUser } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

/* --------------------------------
   🗂️ MULTER CONFIGURATION
----------------------------------- */

const storage = multer.diskStorage({
  destination: "./public/temp",
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });

/* --------------------------------
   🛠️ AUTH & USER ROUTES
----------------------------------- */

// 🔹 Password reset (Public)
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);

// 🔹 Register new user (with optional profile photo)
userRouter.post("/register", upload.single("profilePhoto"), registerUser);

// 🔹 Login / Logout
userRouter.post("/login", loginUser);
userRouter.post("/logout", verifyJWT, logoutUser);

// 🔹 Get current user details
userRouter.get("/current-user", verifyJWT, getUserDetails);

// 🔹 Get & Update profile (Protected)
userRouter
  .route("/profile")
  .get(verifyJWT, getUserDetails)
  .put(verifyJWT, upload.single("profilePhoto"), updateUserDetails);

// 🔹 Admin: Get all users + stats
userRouter.get("/list-all", verifyJWT, getAllUsersAndStats);

export default userRouter;

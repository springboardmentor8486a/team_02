import dotenv from "dotenv";
import mongoose from "mongoose";
import { app } from "./app.js";

// Load environment variables
dotenv.config();

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(process.env.PORT || 3000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
  });

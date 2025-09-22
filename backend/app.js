import express from 'express';
// import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
// app.use(cors());
import cors from "cors";

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser()); // Middleware to parse cookies


// Import routes
import userRouter from './src/routes/userRoute.js';
import complaintRouter from './src/routes/complaintRouter.js';

// Use routes
app.use('/api/v1/users', userRouter);
app.use("/api/v1/complaints", complaintRouter);


export { app };

// centralized error handler to return JSON instead of HTML
// must be after routes
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({ success: false, message });
});
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from "cors";
import session from 'express-session';
import passport from './src/utils/passport.js';

const app = express();

// CORS Configuration - MUST BE BEFORE OTHER MIDDLEWARE
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const localhostRegex = /^http:\/\/(localhost|127\.0\.0\.1)(:\\d+)?$/;

app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true); // allow non-browser clients
        if (origin === FRONTEND_URL || localhostRegex.test(origin)) {
            return callback(null, true);
        }
        return callback(new Error('CORS not allowed from origin: ' + origin), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}));

// Logging middleware for debugging
app.use((req, res, next) => {
    //console.log(`📍 ${req.method} ${req.url}`);
    // console.log('Headers:', {
    //     authorization: req.headers.authorization,
    //     cookie: req.headers.cookie ? 'Present' : 'Not present'
    // });
    next();
});

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// Session middleware BEFORE passport
app.use(session({
    secret: process.env.SESSION_SECRET || 'sandeep-repala-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Initialize Passport AFTER session
app.use(passport.initialize());
app.use(passport.session());
app.use('/uploads', express.static('public/uploads'));
// Serve the whole public directory at /public to match stored DB paths like /public/uploads/...
app.use('/public', express.static(path.join(process.cwd(), 'public')));

// Import routes AFTER passport is initialized
import userRouter from './src/routes/userRoute.js';
import complaintRouter from './src/routes/complaintRouter.js';
import commentRouter from './src/routes/commentRoute.js';
import voteRouter from './src/routes/voteRoute.js';
import adminRouter from './src/routes/adminRouter.js';
import authRouter from './src/routes/authRouter.js';

// Use routes
app.use('/api/v1/users', userRouter);
app.use("/api/v1/complaints", complaintRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/votes", voteRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/auth', authRouter);

// 404 handler for undefined routes
app.use((req, res, next) => {
    console.log(`❌ 404 - Route not found: ${req.method} ${req.url}`);
    res.status(404).json({
        success: false,
        message: `Cannot ${req.method} ${req.url}`
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('❌ Error caught:', err.message);
    console.error('Stack:', err.stack);
    
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

export { app };
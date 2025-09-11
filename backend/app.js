import express from 'express';
// import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
// app.use(cors());
import cors from "cors";

app.use(cors({
  origin: "*", // your frontend port
  credentials: true               // ✅ allow sending cookies
}));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser()); // Middleware to parse cookies


// Import routes
import userRouter from './src/routes/userRoute.js';

// Use routes
app.use('/api/v1/users', userRouter);


export { app };
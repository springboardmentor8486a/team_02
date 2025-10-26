import dotenv from 'dotenv';
dotenv.config();

// ADD THIS DEBUG CODE RIGHT AFTER dotenv.config()
console.log('=== ENVIRONMENT DEBUG ===');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Set (length: ' + process.env.GOOGLE_CLIENT_SECRET.length + ')' : 'NOT SET');
console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);
console.log('Has "your-actual"?', process.env.GOOGLE_CLIENT_ID?.includes('your-actual'));
console.log('Is placeholder?', process.env.GOOGLE_CLIENT_ID === 'placeholder-client-id');
console.log('========================');

import mongoose from 'mongoose';
import { app } from './app.js';

// Define the root route BEFORE connecting to MongoDB
app.get('/', (req, res) => {
    console.log('Root route accessed!');
    res.json({
        message: 'CleanStreet API is running',
        status: 'OK',
        endpoints: {
            auth: '/api/v1/auth',
            users: '/api/v1/users',
            complaints: '/api/v1/complaints',
            comments: '/api/v1/comments',
            votes: '/api/v1/votes',
            admin: '/api/v1/admin'
        }
    });
});

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Connect to MongoDB and start server
mongoose.connect(`${process.env.MONGODB_URI}`)
    .then(() => {
        console.log("✅ Connected to MongoDB");
        
        const PORT = process.env.PORT || 3000;
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`✅ Server is running on http://localhost:${PORT}`);
            console.log(`✅ Frontend should be at: ${process.env.FRONTEND_URL}`);
            // console.log('\n📋 Available routes:');
            // console.log(`   - Root: http://localhost:${PORT}/`);
            // console.log(`   - Health: http://localhost:${PORT}/health`);
            // console.log(`   - Google Login: http://localhost:${PORT}/api/v1/auth/google`);
            // console.log(`   - Current User: http://localhost:${PORT}/api/v1/auth/current-user`);
        });

        server.on('error', (error) => {
            console.error('❌ Server error:', error);
        });
    })
    .catch((error) => {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    });
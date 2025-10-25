import { Router } from "express";
import axios from "axios";
import User from "../models/user.model.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const authRouter = Router();

// Google OAuth routes - Manual implementation
authRouter.get('/google', (req, res) => {
    console.log('🔍 Starting Google OAuth...');
    console.log('Client ID:', process.env.GOOGLE_CLIENT_ID);
    console.log('Callback URL:', process.env.GOOGLE_CALLBACK_URL);
    
    // Manual OAuth URL construction
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(process.env.GOOGLE_CLIENT_ID)}&` +
        `redirect_uri=${encodeURIComponent(process.env.GOOGLE_CALLBACK_URL)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent('profile email')}&` +
        `access_type=offline&` +
        `prompt=consent`;
    
    console.log('📍 Redirecting to Google...');
    res.redirect(authUrl);
});

authRouter.get('/google/callback', async (req, res) => {
    try {
        console.log('📥 Google callback received');
        console.log('Query params:', req.query);
        
        const { code, error } = req.query;
        
        if (error) {
            console.error('❌ OAuth Error:', error);
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=${error}`);
        }
        
        if (!code) {
            console.error('❌ No authorization code received');
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_code`);
        }
        
        console.log('🔄 Exchanging code for tokens...');
        
        // Exchange code for tokens
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_CALLBACK_URL,
            grant_type: 'authorization_code'
        });
        
        const { access_token } = tokenResponse.data;
        console.log('✅ Token received');
        
        // Get user info from Google
        console.log('👤 Fetching user info...');
        const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        
        const googleUser = userInfoResponse.data;
        console.log('📧 User email:', googleUser.email);
        
        // Find or create user in database
        let user = await User.findOne({ 
            $or: [
                { googleId: googleUser.id },
                { email: googleUser.email }
            ]
        });
        
        if (user) {
            // User exists - link Google account if not already linked
            if (!user.googleId) {
                console.log('🔗 Linking Google account to existing user:', googleUser.email);
                user.googleId = googleUser.id;
                user.isVerified = true;
                await user.save({ validateBeforeSave: false });
            }
            console.log('✅ User logged in:', googleUser.email);
        } else {
            // Create new user
            console.log('🆕 Creating new user:', googleUser.email);
            user = await User.create({
                googleId: googleUser.id,
                email: googleUser.email,
                fullName: googleUser.name,
                avatar: googleUser.picture,
                isVerified: true,
                role: 'user'
            });
            console.log('✅ New user created:', googleUser.email);
        }
        
        // Generate JWT tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        
        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        
        console.log('✅ Tokens generated');
        console.log('Access Token (first 20 chars):', accessToken.substring(0, 20));
        console.log('🎉 Authentication complete! Redirecting to frontend...');
        
        // Redirect to frontend with tokens
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);
        
    } catch (error) {
        console.error('❌ Error in Google OAuth callback:', error.response?.data || error.message);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
});

// Get current user endpoint
authRouter.get('/current-user', verifyJWT, async (req, res) => {
    try {
        console.log('📡 /current-user endpoint called');
        console.log('User from JWT:', req.user);
        
        return res.status(200).json(
            new ApiResponse(200, req.user, "User fetched successfully")
        );
    } catch (error) {
        console.error('❌ Error fetching current user:', error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error fetching user"
        });
    }
});

// Logout endpoint
authRouter.post('/logout', verifyJWT, async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1
                }
            },
            {
                new: true
            }
        );

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        };

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "User logged out successfully"));
    } catch (error) {
        console.error('❌ Error during logout:', error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error during logout"
        });
    }
});

export default authRouter;
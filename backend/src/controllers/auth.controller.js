import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { google } from 'googleapis';

// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
);

// Check if Google OAuth is configured
const isGoogleOAuthEnabled = () => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    
    if (!clientId || !clientSecret || 
        clientId.includes('your-actual') || 
        clientId === 'placeholder-client-id') {
        return false;
    }
    return true;
};

// Initiate Google OAuth
export const googleAuth = asyncHandler(async (req, res) => {
    console.log('🔍 Starting Google OAuth...');
    console.log('Client ID:', process.env.GOOGLE_CLIENT_ID);
    console.log('Callback URL:', process.env.GOOGLE_CALLBACK_URL);

    if (!isGoogleOAuthEnabled()) {
        throw new ApiError(500, "Google OAuth is not properly configured");
    }

    const scopes = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
    ];

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent'
    });

    console.log('📍 Redirecting to Google...');
    res.redirect(authUrl);
});

// Handle Google OAuth callback
export const googleCallback = asyncHandler(async (req, res) => {
    console.log('📥 Google callback received');
    console.log('Query params:', req.query);

    try {
        const { code } = req.query;

        if (!code) {
            throw new ApiError(400, "Authorization code not found");
        }

        console.log('🔄 Exchanging code for tokens...');
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        console.log('✅ Token received');

        console.log('👤 Fetching user info...');
        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const { data } = await oauth2.userinfo.get();

        console.log('📧 User email:', data.email);

        // Find or create user
        let user = await User.findOne({ email: data.email });

        if (!user) {
            console.log('🆕 Creating new user...');
            user = await User.create({
                fullName: data.name,
                email: data.email,
                googleId: data.id,
                avatar: data.picture,
                isVerified: true,
                role: 'user'
            });
        } else {
            console.log('👋 Existing user found');
            // Update Google ID if not set
            if (!user.googleId) {
                user.googleId = data.id;
                await user.save({ validateBeforeSave: false });
            }
        }

        // Generate tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        console.log('✅ User logged in:', user.email);

        // Cookie options
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        };

        // Set cookies AND redirect with tokens in URL
        console.log('🎉 Authentication complete! Redirecting to frontend...');
        res
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .redirect(`http://localhost:5173/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);

    } catch (error) {
        console.error('❌ Google callback error:', error);
        res.redirect('http://localhost:5173/login?error=auth_failed');
    }
});

// Get current user
export const getCurrentUser = asyncHandler(async (req, res) => {
    console.log('📡 getCurrentUser called');
    console.log('User from JWT:', req.user);
    
    return res.status(200).json(
        new ApiResponse(200, req.user, "User fetched successfully")
    );
});

// Logout
export const logout = asyncHandler(async (req, res) => {
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
});
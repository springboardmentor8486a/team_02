import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model.js';

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Local Strategy (username/password)
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// Google OAuth Strategy - Enhanced with account merging
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'placeholder-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder-secret',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/v1/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if credentials are valid
        const isValid = process.env.GOOGLE_CLIENT_ID && 
                       process.env.GOOGLE_CLIENT_SECRET &&
                       !process.env.GOOGLE_CLIENT_ID.includes('your-actual') &&
                       !process.env.GOOGLE_CLIENT_SECRET.includes('your-actual') &&
                       !process.env.GOOGLE_CLIENT_SECRET.includes('YOUR_ACTUAL') &&
                       process.env.GOOGLE_CLIENT_ID !== 'placeholder-client-id' &&
                       process.env.GOOGLE_CLIENT_SECRET !== 'placeholder-secret';
        
        if (!isValid) {
            return done(new Error('Google OAuth is not configured. Please add valid credentials to .env file.'), null);
        }

        const email = profile.emails[0].value;
        const googleId = profile.id;

        // Check if user exists with this Google ID OR email
        let user = await User.findOne({ 
            $or: [
                { googleId: googleId },
                { email: email }
            ]
        });

        if (user) {
            // User exists - check if we need to link Google account
            if (!user.googleId) {
                console.log(`🔗 Linking Google account to existing user: ${email}`);
                user.googleId = googleId;
                user.isVerified = true; // Verify since Google verified them
                await user.save();
            }
            console.log(`✅ User logged in via Google: ${email}`);
            return done(null, user);
        } else {
            // Create new user with Google account
            console.log(`🆕 Creating new user via Google: ${email}`);
            user = await User.create({
                googleId: googleId,
                email: email,
                fullName: profile.displayName,
                avatar: profile.photos?.[0]?.value || null,
                isVerified: true
            });
            console.log(`✅ New user created: ${email}`);
            return done(null, user);
        }
    } catch (error) {
        console.error('❌ Google OAuth Error:', error);
        return done(error, null);
    }
}));

// Log OAuth status - use setTimeout to check after all modules are loaded
setTimeout(() => {
    const isValidGoogleCredentials = 
        process.env.GOOGLE_CLIENT_ID && 
        process.env.GOOGLE_CLIENT_SECRET &&
        !process.env.GOOGLE_CLIENT_ID.includes('your-actual') &&
        !process.env.GOOGLE_CLIENT_SECRET.includes('your-actual') &&
        !process.env.GOOGLE_CLIENT_SECRET.includes('YOUR_ACTUAL') &&
        process.env.GOOGLE_CLIENT_ID !== 'placeholder-client-id' &&
        process.env.GOOGLE_CLIENT_SECRET !== 'placeholder-secret';

    if (isValidGoogleCredentials) {
        console.log('✅ Google OAuth is enabled');
    } else {
        console.log('⚠️  Google OAuth is disabled (invalid or placeholder credentials)');
    }
}, 0);

export default passport;
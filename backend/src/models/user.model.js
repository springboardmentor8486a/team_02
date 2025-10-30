import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId;
        },
        minlength: [6, 'Password must be at least 6 characters']
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'volunteer'],
        default: 'user'
    },

    // ✅ New fields for profile updates
    location: {
        type: String,
        default: ''
    },
    // Primary internal field with alias for external consistency
    aboutMe: {
        type: String,
        default: '',
        alias: 'about'
    },
    profilePhoto: {
        type: String,
        default: ''
    },

    refreshToken: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    }
}, {
    timestamps: true
});


// 🔐 Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


// 🔍 Compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};


// 🔑 Generate Access Token
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET || 'access-token-secret',
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d'
        }
    );
};


// ♻️ Generate Refresh Token
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET || 'refresh-token-secret',
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d'
        }
    );
};


const User = mongoose.model('User', userSchema);

export default User;

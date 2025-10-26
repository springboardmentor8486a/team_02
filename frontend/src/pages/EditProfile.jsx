import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Save, XCircle, Shield } from 'lucide-react';
import './EditProfile.css';

const EditProfile = () => {
    const { user, updateUserContext, signOut } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState(user?.name || '');
    const [location, setLocation] = useState(user?.location || '');
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(user?.profilePhoto || '/images/default-avatar.png');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            setName(user.name || '');
            setLocation(user.location || '');
            setPhotoPreview(user.profilePhoto || '/images/default-avatar.png');
        }
    }, [user, navigate]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePhoto(file);
        if (file) {
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        if (!name || !location) {
            setMessage('Name and location are required fields.');
            setIsError(true);
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('location', location);
        if (profilePhoto) {
            formData.append('profilePhoto', profilePhoto);
        }

        try {
            const res = await axios.put(
                'http://localhost:3000/api/v1/users/profile',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                }
            );

            updateUserContext(res.data.updatedUser);
            setMessage('Profile updated successfully! Redirecting...');
            setIsError(false);
            
            setTimeout(() => {
                navigate('/profile');
            }, 1500);

        } catch (err) {
            let errorMsg = 'Failed to update profile. Please try again.';
            if (err.response) {
                if (err.response.status === 401) {
                    errorMsg = 'Session expired. Please log in again.';
                    signOut();
                    navigate('/login');
                } else {
                    errorMsg = err.response.data?.message || `Error: ${err.response.status}`;
                }
            } else if (err.request) {
                errorMsg = 'Network error: Server is unreachable.';
            }

            setMessage(errorMsg);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    const getUserInitials = (name) => {
        if (!name) return 'S';
        const nameParts = name.split(' ');
        const initials = nameParts.map(part => part[0]).join('');
        return initials.toUpperCase();
    };

    if (!user) {
        return null;
    }

    return (
        // Use the main page wrapper from your new CSS
        <div className="volunteer-edit-page">
            {/* --- Navigation Header --- */}
            <header className="volunteer-header-top">
                <div className="logo-section" onClick={() => navigate('/')}>
                    <img src="/images/logo.png" alt="Clean Street Logo" className="logo-image" />
                    <div className="logo-text">Clean Street</div>
                    <div className="user-badge">
                    <Shield size={18} />
                    <span>User</span>
                    </div>
                </div>
                <div className="back-to-profile">
                    <button onClick={() => navigate('/profile')} className="back-btn">
                        <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} /> Back to Profile
                    </button>
                </div>
            </header>

            {/* --- Main Edit Profile Layout --- */}
            <div className="volunteer-edit-container">
                <div className="volunteer-edit-panel">
                    
                    {/* New panel-header wrapper */}
                    <div className="panel-header">
                        {/* Optional: You had a .header-icon class, you could add an icon here */}
                        <h2>Edit Your Profile</h2>
                        <p className="subtitle">Update your personal information and profile picture.</p>
                    </div>

                    {message && (
                        <p className={`status-message ${isError ? 'error' : 'success'}`}>
                            {message}
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="volunteer-edit-form">
                        
                        {/* Avatar Upload Section - Restructured to match new CSS */}
                        <div className="avatar-section">
                            <label className="avatar-label">Profile Photo</label>
                            
                            {/* Wrapper for the preview/initials */}
                            <div className="avatar-wrapper">
                                <img 
                                    src={photoPreview} 
                                    alt="Profile Preview" 
                                    className="profile-photo-preview" 
                                    onError={(e) => { 
                                        e.target.style.display = 'none'; 
                                        e.target.nextSibling.style.display = 'flex'; 
                                    }}
                                />
                                {/* Updated class for initials fallback */}
                                <div className="volunteer-initials" style={{ display: photoPreview === user?.profilePhoto ? 'none' : 'flex' }}>
                                    <span>{getUserInitials(name)}</span>
                                </div>
                            </div>

                            {/* File input and buttons (as siblings to avatar-wrapper) */}
                            <input
                                type="file"
                                id="profilePhoto"
                                name="profilePhoto"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="file-input" // This class is hidden by your CSS
                            />
                            {/* Updated class for the upload button label */}
                            <label htmlFor="profilePhoto" className="volunteer-upload">
                                Change Photo
                            </label>
                            {profilePhoto && (
                                <button 
                                    type="button" 
                                    className="remove-photo-btn" // Class name was the same
                                    onClick={() => { setProfilePhoto(null); setPhotoPreview(user?.profilePhoto || '/images/default-avatar.png'); }}
                                >
                                    <XCircle size={16} /> Remove Selection
                                </button>
                            )}
                        </div>

                        {/* Name Field */}
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your full name"
                                required
                            />
                        </div>

                        {/* Location Field */}
                        <div className="form-group">
                            <label htmlFor="location">Primary Location</label>
                            <input
                                type="text"
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="City, Country"
                                required
                            />
                        </div>

                        {/* Email and Role (Read-only for context) */}
                        <div className="form-group read-only-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={user.email}
                                readOnly
                                disabled
                            />
                            <small>Email cannot be changed here.</small>
                        </div>
                        
                        <div className="form-group read-only-group">
                            <label htmlFor="role">User Role</label>
                            <input
                                type="text"
                                id="role"
                                value={user.role}
                                readOnly
                                disabled
                            />
                        </div>

                        {/* Submit Button - Updated class */}
                        <button type="submit" disabled={loading} className="volunteer-save">
                            {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                        </button>

                        {/* Optional: Link to change password */}
                        <p className="password-link">
                            <a href="/forgot-password" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }}>
                                Click here to change your password
                            </a>
                        </p>
                    </form>
                </div>
            </div>

            {/* --- Footer (Simplified for Edit Page) --- */}
            <footer className="footer">
                <p>© 2025 Clean Street. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default EditProfile;
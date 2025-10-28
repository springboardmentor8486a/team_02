import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Save, XCircle, Shield } from 'lucide-react';
import './EditProfile.css';

const EditProfile = () => {
    const { user, updateUserContext, signOut } = useAuth();
    const navigate = useNavigate();

    // State Initialization: Use user properties directly
    const [name, setName] = useState(user?.fullName || ''); 
    const [location, setLocation] = useState(user?.location || '');
    const [aboutMe, setAboutMe] = useState(user?.aboutMe || '');
    const [profilePhoto, setProfilePhoto] = useState(null); // File object for new photo
    const [photoPreview, setPhotoPreview] = useState(user?.profilePhoto || '/images/default-avatar.png'); // URL for preview
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            // Re-sync state with context user on mount or user change
            setName(user.fullName || '');
            setLocation(user.location || '');
            setAboutMe(user.aboutMe || '');
            setPhotoPreview(user.profilePhoto || '/images/default-avatar.png');
        }
    }, [user, navigate]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePhoto(file);
        if (file) {
            setPhotoPreview(URL.createObjectURL(file)); // Create local URL for preview
        }
    };
    
    const handleRemoveSelection = () => {
        setProfilePhoto(null); 
        // Revert preview to the *current* saved photo or the default placeholder
        setPhotoPreview(user?.profilePhoto || '/images/default-avatar.png'); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        if (!name || !location) {
            setMessage('Full Name and Location are required fields.');
            setIsError(true);
            return;
        }

        setLoading(true);
        const formData = new FormData();
        // Append all text fields (keys match backend model properties)
        formData.append('fullName', name); 
        formData.append('location', location);
        formData.append('aboutMe', aboutMe);
        
        // Append file only if a new one is selected
        if (profilePhoto) { 
            formData.append('profilePhoto', profilePhoto);
        }

        try {
           const res = await axios.put(
    'http://localhost:3000/api/v1/users/profile',
    formData,
    {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,  // ✅ Required
    }
);

console.log(res.data.data)
            // SUCCESS: Update the Auth Context and redirect
            updateUserContext(res.data.data); 
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
        errorMsg = 'Network error: Server is unreachable...';
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
        return nameParts.map(part => part.charAt(0)).join('').toUpperCase(); 
    };

    if (!user) return null;

    return (
        <div className="volunteer-edit-page">
            <header className="volunteer-header-top">
                <div className="logo-section" onClick={() => navigate('/')}>
                    <img src="/images/logo.png" alt="Clean Street Logo" className="logo-image" />
                    <div className="logo-text">Clean Street</div>
                    <div className="user-badge"><Shield size={18} /> <span>User</span></div>
                </div>
                <div className="back-to-profile">
                    <button onClick={() => navigate('/profile')} className="back-btn">
                        <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} /> Back to Profile
                    </button>
                </div>
            </header>

            <div className="volunteer-edit-container">
                <div className="volunteer-edit-panel">
                    <div className="panel-header">
                        <h2>Edit Your Profile</h2>
                        <p className="subtitle">Update your personal information, profile picture, and about me.</p>
                    </div>

                    {message && (
                        <p className={`status-message ${isError ? 'error' : 'success'}`}>{message}</p>
                    )}

                    <form onSubmit={handleSubmit} className="volunteer-edit-form">
                        <div className="avatar-section">
                            <label className="avatar-label">Profile Photo</label>
                            <div className="avatar-wrapper">
                                <img 
                                    src={photoPreview} 
                                    alt="Profile Preview"
                                    className="profile-photo-preview"
                                    onError={(e) => { 
                                        e.target.style.display='none'; 
                                        e.target.nextSibling.style.display='flex'; 
                                    }}
                                />
                                <div className="volunteer-initials" style={{ 
                                    display: photoPreview === '/images/default-avatar.png' ? 'flex' : 'none' 
                                }}>
                                    <span>{getUserInitials(name)}</span>
                                </div>
                            </div>

                            <input
                                type="file"
                                id="profilePhoto"
                                name="profilePhoto"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="file-input"
                            />
                            <label htmlFor="profilePhoto" className="volunteer-upload">Change Photo</label>
                            
                            {(profilePhoto || user?.profilePhoto) && ( 
                                <button type="button" className="remove-photo-btn" onClick={handleRemoveSelection}>
                                    <XCircle size={16} /> Remove Selection
                                </button>
                            )}
                        </div>

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

                        <div className="form-group">
                            <label htmlFor="aboutMe">About Me</label>
                            <textarea
                                id="aboutMe"
                                value={aboutMe}
                                onChange={(e) => setAboutMe(e.target.value)}
                                placeholder="Tell us something about yourself..."
                                rows={4}
                            />
                        </div>

                        <div className="form-group read-only-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" value={user.email} readOnly disabled />
                        </div>

                        <div className="form-group read-only-group">
                            <label htmlFor="role">User Role</label>
                            <input type="text" id="role" value={user.role} readOnly disabled />
                        </div>

                        <button type="submit" disabled={loading} className="volunteer-save">
                            {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                        </button>

                        <p className="password-link">
                            <a href="/forgot-password" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }}>
                                Click here to change your password
                            </a>
                        </p>
                    </form>
                </div>
            </div>

            <footer className="footer">
                <p>© 2025 Clean Street. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default EditProfile;

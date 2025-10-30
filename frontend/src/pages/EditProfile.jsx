// src/pages/EditProfile.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Save, XCircle, Shield } from 'lucide-react';
import './EditProfile.css'; 

const EditProfile = () => {
    const { user, updateUserContext, signOut } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // State Initialization
    const [fullName, setFullName] = useState(user?.fullName || '');
    const [location, setLocation] = useState(user?.location || '');
    const [aboutMe, setAboutMe] = useState(user?.aboutMe || '');
    const [profilePhoto, setProfilePhoto] = useState(null); // File object
    const [photoPreview, setPhotoPreview] = useState(user?.profilePhoto || '/images/default-avatar.png'); // URL
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [removePhotoFlag, setRemovePhotoFlag] = useState(false); 

    const API_BASE_URL = 'http://localhost:3000/api/v1';

    // Fetch fresh user data from database on page load
    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) {
                navigate('/login');
                return;
            }

            try {
                // Fetch fresh user data from backend
                const response = await axios.get(`${API_BASE_URL}/users/profile`, {
                    withCredentials: true
                });

                const userData = response.data?.data || response.data;
                if (userData) {
                    // Update local state with fresh data
                    setFullName(userData.fullName || '');
                    setLocation(userData.location || '');
                    setAboutMe(userData.aboutMe || '');
                    setPhotoPreview(userData.profilePhoto || '/images/default-avatar.png');
                    setRemovePhotoFlag(false);
                    
                    // Also update context with fresh data
                    updateUserContext(userData);
                }
            } catch (err) {
                console.error('Failed to fetch user data:', err);
                // Fallback to context user data if API fails
                if (user) {
                    setFullName(user.fullName || '');
                    setLocation(user.location || '');
                    setAboutMe(user.aboutMe || '');
                    setPhotoPreview(user.profilePhoto || '/images/default-avatar.png');
                    setRemovePhotoFlag(false);
                }
            }
        };

        fetchUserData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]); // Only run on mount and when navigate changes

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Revoke old URL to prevent memory leaks
            if (photoPreview && photoPreview.startsWith('blob:')) {
                URL.revokeObjectURL(photoPreview);
            }
            setProfilePhoto(file);
            setPhotoPreview(URL.createObjectURL(file)); 
            setRemovePhotoFlag(false); 
        }
    };
    
    const handleRemovePhoto = () => {
        setProfilePhoto(null); 
        setPhotoPreview('/images/default-avatar.png');
        setRemovePhotoFlag(true); 
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        if (!fullName || !location) {
            setMessage('Full Name and Primary Location are required fields.');
            setIsError(true);
            return;
        }

        setLoading(true);
        const formData = new FormData(); 
        
        // 1. Append Text Data
        formData.append('fullName', fullName); 
        formData.append('location', location);
        formData.append('aboutMe', aboutMe); 
        
        // 2. Handle Photo Logic
        if (removePhotoFlag) {
            formData.append('removeProfilePhoto', 'true');
        } else if (profilePhoto) {
            // 'profilePhoto' must match the field name used in the multer middleware in the backend route
            formData.append('profilePhoto', profilePhoto); 
        }
        
        try {
           const res = await axios.put(`${API_BASE_URL}/users/profile`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true  // 👈 critical
});

            // Backend returns ApiResponse format: { statusCode, data, message }
            const updatedUser = res.data?.data || res.data;
            
            if (!updatedUser) {
                throw new Error('No user data returned from server');
            }

            // Update context with fresh user data
            updateUserContext(updatedUser);
            
            // Update local state immediately to reflect changes
            setFullName(updatedUser.fullName || '');
            setLocation(updatedUser.location || '');
            setAboutMe(updatedUser.aboutMe || '');
            
            // Handle profile photo update
            // Revoke old blob URL if it exists
            if (photoPreview && photoPreview.startsWith('blob:')) {
                URL.revokeObjectURL(photoPreview);
            }
            
            if (removePhotoFlag) {
                setPhotoPreview('/images/default-avatar.png');
            } else if (updatedUser.profilePhoto) {
                // Use the new photo from server
                // If it starts with http, it's a full URL, otherwise it's a relative path
                const photoUrl = updatedUser.profilePhoto.startsWith('http') 
                    ? updatedUser.profilePhoto 
                    : `${API_BASE_URL.replace('/api/v1', '')}${updatedUser.profilePhoto}`;
                setPhotoPreview(photoUrl);
            }
            
            // Clear the file input and reset photo state
            setProfilePhoto(null);
            setRemovePhotoFlag(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            setMessage('Profile updated successfully! Redirecting...');
            setIsError(false);

            const redirectMap = {
                admin: '/admin-profile',
                volunteer: '/volunteer-profile',
                user: '/profile'
            };
            const redirectPath = redirectMap[user.role] || '/profile';


            setTimeout(() => {
                navigate(redirectPath);
            }, 1500);

        } catch (err) {
            // Log the error response from the server for debugging
            console.error('Profile Update Failed:', err.response?.data || err.message);
            let errorMsg = 'Failed to update profile. Please try again.';
            
            if (err.response) {
                errorMsg = err.response.data?.message || 
                           `Error ${err.response.status}: ${err.response.statusText}`;
                
                // Handle authentication errors
                if (err.response.status === 401 || err.response.status === 403) {
                    errorMsg = 'Session expired or unauthorized. Please log in again.';
                    setTimeout(() => {
                        signOut();
                        navigate('/login');
                    }, 2000);
                }
            } else if (err.request) {
                errorMsg = 'Network error: Server is unreachable. Check your backend terminal.';
            }
            
            setMessage(errorMsg);
            setIsError(true);


            // let errorMsg = 'Failed to update profile. Please try again.';
            // if (err.response) {
            //     // If the error message is specific from the backend, show it
            //     errorMsg = err.response.data?.message || `Error: ${err.response.status} - Could not update profile.`;
                
            //     if (err.response.status === 401 || err.response.status === 403) {
            //         errorMsg = 'Session expired or unauthorized. Please log in again.';
            //         signOut();
            //         navigate('/login');
            //     }
            // } else if (err.request) {
            //     errorMsg = 'Network error: Server is unreachable. Check your backend terminal.';
            // }
            // setMessage(errorMsg);
            // setIsError(true);

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

    const backPath = user.role === 'admin' ? '/admin-profile' : user.role === 'volunteer' ? '/volunteer-profile' : '/profile';


    return (
        <div className="volunteer-edit-page">
            <header className="volunteer-header-top">
                <div className="logo-section" onClick={() => navigate('/')}>
                    <img src="/images/logo.png" alt="Clean Street Logo" className="logo-image" />
                    <div className="logo-text">Clean Street</div>
                    <div className="user-badge"><Shield size={18} /> <span>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span></div> 
                </div>
                <div className="back-to-profile">
                    <button onClick={() => navigate(backPath)} className="back-btn">
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
                                {(photoPreview && photoPreview !== '/images/default-avatar.png' && !removePhotoFlag) ? (
                                    <img 
                                        src={photoPreview} 
                                        alt="Profile Preview"
                                        className="profile-photo-preview"
                                        onError={(e) => {
                                            const img = e?.currentTarget;
                                            if (!img) return;
                                            img.style.display = 'none';
                                            const sibling = img.nextSibling;
                                            if (sibling && sibling.style) sibling.style.display = 'flex';
                                        }}
                                    />
                                ) : (
                                    <div className="volunteer-initials" style={{display: 'flex'}}>
                                        <span>{getUserInitials(fullName)}</span>
                                    </div>
                                )}
                            </div>

                            <input
                                type="file"
                                id="profilePhoto"
                                name="profilePhoto"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="file-input"
                                ref={fileInputRef}
                            />
                            <label htmlFor="profilePhoto" className="volunteer-upload">Change Photo</label>
                            
                            {(user?.profilePhoto || profilePhoto) && ( 
                                <button type="button" className="remove-photo-btn" onClick={handleRemovePhoto}>
                                    <XCircle size={16} /> Remove Photo
                                </button>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
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

                        {/* Read-only fields */}
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
                            <Link to="/forgot-password">Click here to change your password</Link>
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
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Save, Camera, XCircle, ArrowRight, LogOut, User, Mail, Phone, MapPin, FileText } from 'lucide-react';
import './EditProfile.css';

const EditProfile = () => {
    const { user, updateUserContext, signOut } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        bio: ''
    });
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState('/images/default-avatar.png');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            setFormData({
                name: user?.name || 'John Doe',
                email: user?.email || 'john.doe@example.com',
                phone: '+1 (555) 123-4567',
                location: user?.location || 'Downtown, City Center',
                bio: ''
            });
            setPhotoPreview(user?.profilePhoto || '/images/default-avatar.png');
        }
    }, [user, navigate]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePhoto(file);
        if (file) {
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        if (!formData.name || !formData.location) {
            setMessage('Name and location are required fields.');
            setIsError(true);
            return;
        }

        setLoading(true);
        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('location', formData.location);
        submitData.append('phone', formData.phone);
        submitData.append('bio', formData.bio);
        if (profilePhoto) {
            submitData.append('profilePhoto', profilePhoto);
        }

        try {
            const res = await axios.put(
                'http://localhost:3000/api/v1/users/profile',
                submitData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                }
            );

            updateUserContext(res.data.updatedUser || res.data.user);
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
        if (!name) return 'JD';
        return name.split(' ').map(part => part[0]).join('').toUpperCase();
    };

    const handleCancel = () => {
        navigate('/profile');
    };

    const handleLogout = () => {
        axios.post('http://localhost:3000/api/v1/users/logout', {}, { withCredentials: true })
            .catch((error) => console.error("Logout failed:", error))
            .finally(() => {
                signOut();
                navigate('/');
            });
    };

    if (!user) {
        return null;
    }

    return (
        <div className="edit-profile-page">
            {/* Header - White Background */}
            <header className="header-top white-header">
                <div className="logo-section">
                    <img src="/images/logo.png" alt="Clean Street Logo" className="logo-image" />
                    <div className="logo-text">Clean Street</div>
                </div>
                <nav className="nav-links">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/browse-issues">Browse Issues</Link>
                    <Link to="/report-issue">Report Issue</Link>
                </nav>
                <div className="user-profile">
                    <Link to="/profile" className="profile-link">
                        <div className="user-initials">{getUserInitials(user.name)}</div>
                        <span className="user-name">{user.name}</span>
                    </Link>
                    <button onClick={handleLogout} className="logout-btn-header">
                        <ArrowRight size={20} />
                    </button>
                </div>
            </header>

            {/* Hero Section - Same as ReportIssue Page */}
            <div className="dashboard-hero">
                <div className="hero-content-wrapper">
                    <h2>Manage Your Profile</h2>
                    <p>Update your personal information, profile photo, and preferences to enhance your Clean Street experience and help us serve you better.</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="edit-profile-main">
                <div className="edit-form-container">
                    <div className="form-header">
                        <div className="form-title-section">
                            <h3>Edit Profile Information</h3>
                            <p>Update your personal details and profile settings</p>
                        </div>
                        <button 
                            className="logout-btn-symbol"
                            onClick={handleLogout}
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>

                    <div className="edit-form-panel">
                        {message && (
                            <div className={`status-message ${isError ? 'error' : 'success'}`}>
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="edit-form">
                            {/* Profile Photo Section */}
                            <div className="form-section">
                                <h4 className="section-title">
                                    <User size={18} />
                                    Profile Photo
                                </h4>
                                <div className="avatar-container">
                                    <div className="avatar-preview">
                                        {photoPreview ? (
                                            <img 
                                                src={photoPreview} 
                                                alt="Profile Preview" 
                                                className="profile-photo-preview" 
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    const fallback = e.target.nextElementSibling;
                                                    if (fallback) fallback.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div className="user-initials-fallback">
                                            <span>{getUserInitials(formData.name)}</span>
                                        </div>
                                    </div>
                                    <div className="photo-actions">
                                        <input
                                            type="file"
                                            id="profilePhoto"
                                            name="profilePhoto"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="file-input"
                                        />
                                        <label htmlFor="profilePhoto" className="change-photo-btn">
                                            <Camera size={16} />
                                            Change Photo
                                        </label>
                                        {profilePhoto && (
                                            <button 
                                                type="button" 
                                                className="remove-photo-btn"
                                                onClick={() => { 
                                                    setProfilePhoto(null); 
                                                    setPhotoPreview(user?.profilePhoto || '/images/default-avatar.png'); 
                                                }}
                                            >
                                                <XCircle size={16} />
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Personal Information Section */}
                            <div className="form-section">
                                <h4 className="section-title">
                                    <FileText size={18} />
                                    Personal Information
                                </h4>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="name" className="form-label">
                                            <User size={16} />
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="John Doe"
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label">
                                            <Mail size={16} />
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="john.doe@example.com"
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="phone" className="form-label">
                                            <Phone size={16} />
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+1 (555) 123-4567"
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="location" className="form-label">
                                            <MapPin size={16} />
                                            Location *
                                        </label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            placeholder="Downtown, City Center"
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Bio Section */}
                            <div className="form-section">
                                <h4 className="section-title">About Me</h4>
                                <div className="form-group">
                                    <label htmlFor="bio" className="form-label">Personal Bio</label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        placeholder=""
                                        rows="4"
                                        className="form-textarea bio-textarea"
                                    />
                                    <div className="input-hint">
                                        Tell us about yourself and your commitment to the community
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="form-actions">
                                <button 
                                    type="button" 
                                    className="btn-secondary"
                                    onClick={handleCancel}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={loading} 
                                    className="btn-primary"
                                >
                                    {loading ? (
                                        <>
                                            <div className="loading-spinner-small"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Sidebar with Tips - Similar to ReportIssue Page */}
                <div className="edit-profile-sidebar">
                    <div className="sidebar-panel">
                        <h4>📝 Profile Tips</h4>
                        <ul className="tips-list">
                            <li>Use a clear, recent profile photo</li>
                            <li>Keep your contact information updated</li>
                            <li>Set your correct location for better service</li>
                            <li>Add a bio to help others know you better</li>
                            <li>Review your information regularly</li>
                        </ul>
                    </div>

                    <div className="sidebar-panel">
                        <h4>🔒 Privacy & Security</h4>
                        <ul className="tips-list">
                            <li>Your email is never shared publicly</li>
                            <li>Phone number is optional for contact</li>
                            <li>Location helps with local issue reporting</li>
                            <li>Profile photo is visible to community members</li>
                        </ul>
                    </div>

                    <div className="sidebar-panel">
                        <h4>💡 Benefits of Updated Profile</h4>
                        <div className="process-steps">
                            <div className="process-step">
                                <span className="step-number">1</span>
                                <div className="step-content">
                                    <strong>Better Communication</strong>
                                    <p>Authorities can contact you if needed</p>
                                </div>
                            </div>
                            <div className="process-step">
                                <span className="step-number">2</span>
                                <div className="step-content">
                                    <strong>Localized Service</strong>
                                    <p>Get relevant local updates and alerts</p>
                                </div>
                            </div>
                            <div className="process-step">
                                <span className="step-number">3</span>
                                <div className="step-content">
                                    <strong>Community Trust</strong>
                                    <p>Build credibility with other members</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="sidebar-panel">
                        <h4>📞 Need Help?</h4>
                        <div className="contact-info">
                            <p><Mail size={16} /> <a href="mailto:support@cleanstreet.org">support@cleanstreet.org</a></p>
                            <p><Phone size={16} /> <a href="tel:5551234567">(555) 123-HELP</a></p>
                            <p><User size={16} /> <a href="#">Account Help Center</a></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-column footer-logo-section">
                    <div className="logo-section">
                        <img src="/images/logo.png" alt="Clean Street Logo" className="logo-image" />
                        <div className="logo-text">Clean Street</div>
                    </div>
                    <p className="footer-tagline">Civic Engagement Platform</p>
                    <p>Empowering communities to report, track, and resolve civic issues through collaborative engagement between citizens and local authorities.</p>
                </div>
                <div className="footer-column">
                    <h4>Platform</h4>
                    <ul>
                        <li><a href="/">How it Works</a></li>
                        <li><a href="/">Features</a></li>
                        <li><a href="/">Pricing</a></li>
                        <li><a href="/">Mobile App</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Support</h4>
                    <ul>
                        <li><a href="/">Help Center</a></li>
                        <li><a href="/">Contact Us</a></li>
                        <li><a href="/">User Guide</a></li>
                        <li><a href="/">Community Forum</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="/">About Us</a></li>
                        <li><a href="/">Careers</a></li>
                        <li><a href="/">Press Kit</a></li>
                        <li><a href="/">Blog</a></li>
                    </ul>
                </div>
            </footer>
        </div>
    );
};

export default EditProfile;
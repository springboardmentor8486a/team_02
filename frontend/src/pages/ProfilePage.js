import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, MapPin, Briefcase, Award, Heart, CheckCircle, LogOut, Phone, Globe, ArrowRight, Edit3 } from 'lucide-react'; 
import './ProfilePage.css';

const Profile = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    
    // --- Use 'user' properties directly ---

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        axios.post('http://localhost:3000/api/v1/users/logout', {}, { withCredentials: true })
            .catch(() => {})
            .finally(() => {
                signOut();
                navigate('/'); // Redirects to the homepage after logging out
            });
    };

    const getUserInitials = (name) => {
        // Use user?.fullName instead of user?.name
        if (!name) return 'S'; 
        const nameParts = name.split(' ');
        const initials = nameParts.map(part => part.charAt(0)).join('');
        return initials.toUpperCase();
    };

    const getJoinedDate = (dateString) => {
        if (!dateString) return 'Joined unknown date';
        const date = new Date(dateString);
        if (isNaN(date)) return 'Joined unknown date'; 
        return `Joined ${date.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;
    };

    // Use actual user data with safe fallbacks
    const profileName = user?.fullName || 'Clean Streeter';
    const profileLocation = user?.location || 'Unknown Location';
    const profileAbout = user?.aboutMe || 'No "About Me" provided yet. Click "Edit Profile" to add one!'; // Use 'aboutMe'
    const profilePhoto = user?.profilePhoto || '/images/default-avatar.png';
    const joinedDateText = getJoinedDate(user?.createdAt);
    
    // Derived/Mocked fields
    const username = user?.email ? user.email.split('@')[0] : 'cleanstreeter';
    const mockPhone = '987-654-3210';
    const isPremium = false; // Example mock/default value

    if (!user) {
        return null;
    }
    
    const InfoField = ({ icon: Icon, label, value }) => (
        <div className="info-item">
            <Icon size={20} />
            <div className="info-text-inline">
                <span className="info-label">{label}:</span>
                <strong className="info-value">{value}</strong>
            </div>
        </div>
    );
                            console.log("Context User:", user);


    return (
        <>
            {/* --- Navigation Header --- */}
            <header className="header-top">
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
                    <Link to="/profile" className="profile-link active">
                        {/* Use profilePhoto for the header avatar if available, otherwise initials */}
                        {profilePhoto !== '/images/default-avatar.png' ? (
                            <img src={profilePhoto} alt="Avatar" className="user-initials-img-header" onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='flex';}} />
                        ) : (
                            <div className="user-initials">{getUserInitials(profileName)}</div>
                        )}
                        <span className="user-name">{profileName.split(' ')[0]}</span>
                    </Link>
                    <button onClick={handleLogout} className="logout-btn-header">
                        <ArrowRight size={20} />
                    </button>
                </div>
            </header>

            {/* --- Main Profile Layout --- */}
            <div className="profile-page-container">
                
                {/* --- Sidebar --- */}
                <div className="profile-sidebar">
                    <div className="profile-avatar-large">
                        {profilePhoto !== '/images/default-avatar.png' ? (
                            <img src={profilePhoto} alt="Profile Avatar" className="profile-photo-img-sidebar" />
                        ) : (
                            <span>{getUserInitials(profileName)}</span>
                        )}
                    </div>
                    <h2 className="profile-name">{profileName}</h2>
                    <p className="profile-username">@{username}</p>
                    <p className="profile-joined">{joinedDateText}</p>

                    <div className="profile-actions">
                        <button className="update-profile-btn" onClick={() => navigate('/edit-profile')}>
                            <Edit3 size={16} /> Edit Profile
                        </button>
                        <button className="logout-btn" onClick={handleLogout}>
                            <LogOut size={16} /> Logout
                        </button>
                    </div>

                    <div className="profile-badges">
                        <div className="badge verified">
                            <CheckCircle size={16} /> Verified Member
                        </div>
                        <div className="badge community-helper">
                            <Heart size={16} /> Community Helper
                        </div>
                        <div className="badge local-champion">
                            <Award size={16} /> Local Champion
                        </div>
                    </div>
                </div>

                {/* --- Main Content --- */}
                <div className="profile-main-content">
                    
                    {/* Panel 1: Profile Information */}
                    <div className="profile-panel">
                        <div className="panel-header-details">
                            <div>
                                <h3>Contact Details</h3>
                                <p>Your personal contact and geographic information</p>
                            </div>
                            {isPremium && <span className="premium-badge">Premium Member</span>}
                        </div>
                        <div className="profile-info-grid">
                            <InfoField icon={User} label="Full Name" value={profileName} />
                            <InfoField icon={Briefcase} label="Role" value={user.role} />
                            <InfoField icon={Mail} label="Email Address" value={user.email} />
                            <InfoField icon={Phone} label="Phone Number" value={mockPhone} />
                            <InfoField icon={MapPin} label="Primary Location" value={profileLocation} />
                            <InfoField icon={Globe} label="Member Since" value={joinedDateText.replace('Joined ', '')} />
                        </div>
                    </div>

                    {/* Panel 2: About Me */}
                    <div className="profile-panel about-me-panel">
                        <h3>About Me</h3>
                        <p>{profileAbout}</p>

                    </div>

                </div>
            </div>

            {/* --- Footer --- */}
            <footer className="footer">
                <div className="footer-column footer-logo-section">
                    <div className="logo-section">
                        <img src="/images/logo.png" alt="Clean Street Logo" className="logo-image" />
                        <div className="logo-text">Clean Street</div>
                    </div>
                    <p className="footer-tagline">Civic Engagement Platform</p>
                    <p>Empowering communities to report, track, and resolve civic issues through collaborative engagement between citizens and local authorities.</p>
                    <div className="contact-info">
                        <p><Mail size={16} /> <a href="mailto:hello@cleanstreet.org">hello@cleanstreet.org</a></p>
                        <p><Phone size={16} /> <a href="tel:5551234567">(555) 123-4567</a></p>
                        <p><Globe size={16} /> <a href="http://www.cleanstreet.org" target="_blank" rel="noopener noreferrer">www.cleanstreet.org</a></p>
                    </div>
                </div>
                <div className="footer-column">
                    <h4>Platform</h4>
                    <ul>
                        <li><a href="#">How it Works</a></li>
                        <li><a href="#">Features</a></li>
                        <li><a href="#">Pricing</a></li>
                        <li><a href="#">Mobile App</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Support</h4>
                    <ul>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">User Guide</a></li>
                        <li><a href="#">Community Forum</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Press Kit</a></li>
                        <li><a href="#">Blog</a></li>
                    </ul>
                </div>
            </footer>
        </>
    );
};

export default Profile;

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, MapPin, Briefcase, Award, Heart, CheckCircle, LogOut, Phone, Globe, ArrowRight, Edit3 } from 'lucide-react'; 
import './ProfilePage.css';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';

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
    const rawPhoto = user?.profilePhoto || '';
    const backendOrigin = 'http://localhost:3000';
    const profilePhoto = rawPhoto
        ? (rawPhoto.startsWith('http') ? rawPhoto : `${backendOrigin}${rawPhoto.startsWith('/') ? '' : '/'}${rawPhoto}`)
        : '/images/default-avatar.png';
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
            <AppHeader />

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

            <AppFooter />
        </>
    );
};

export default Profile;

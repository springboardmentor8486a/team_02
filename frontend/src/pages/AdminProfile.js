// src/pages/AdminProfile.jsx

import React, { useEffect } from 'react'; // Removed unused useState
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import AdminHeader from '../components/AdminHeader';
import AdminFooter from '../components/AdminFooter';
// All necessary icons imported
import { 
    User, Mail, MapPin, Briefcase, Award, Heart, CheckCircle, LogOut, Phone, Globe, ArrowRight, Edit3, 
    LayoutDashboard, AlertCircle, Users, FileText, Clock, Loader2 
} from 'lucide-react'; 
import './ProfilePage.css'; // Your custom CSS file

const AdminProfile = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    
    // --- Data Safety Check ---
    const mockUser = {
        name: user?.name || 'Michael Johnson',
        email: user?.email || 'admin@cleanstreet.com',
        role: user?.role || 'admin',
        createdAt: user?.createdAt || new Date().toISOString(),
        phone: user?.phone || '987-654-3210', 
        location: user?.location || 'Maharashtra, India',
        about: user?.about || 'Active community member passionate about improving our neighborhood. I believe in working together to create cleaner, safer streets for everyone.',
        isPremium: true,
        ...user 
    };

    // --- Logout and Redirect Logic ---
    useEffect(() => {
        // Redirect to login if user object is null (unauthenticated)
        if (user === null) { 
            navigate('/login');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        axios.post('http://localhost:3000/api/v1/users/logout', {}, { withCredentials: true })
            .catch(() => {})
            .finally(() => {
                signOut();
                navigate('/'); 
            });
    };

    // --- Utility Functions ---
    const getUserInitials = (name) => {
        if (!name) return 'MJ'; // Default to MJ for Admin Profile
        const nameParts = name.split(' ');
        const initials = nameParts.map(part => part[0]).join('');
        return initials.toUpperCase();
    };

    const getJoinedDate = (dateString) => {
        if (!dateString) return 'Joined unknown date';
        const date = new Date(dateString);
        if (isNaN(date)) return 'Joined unknown date'; 
        return `Joined ${date.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;
    };

    const username = mockUser.email ? mockUser.email.split('@')[0] : 'cleanstreeter';
    
    const InfoField = ({ icon: Icon, label, value }) => (
        <div className="info-item">
            <Icon size={20} />
            <div className="info-text-inline">
                <span className="info-label">{label}:</span>
                <strong className="info-value">{value}</strong>
            </div>
        </div>
    );


    // --- Loading State Render (CRITICAL FIX) ---
    if (user === undefined) { 
        return (
            <div className="loading-state-profile" style={{ 
                minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', 
                flexDirection: 'column', fontSize: '1.2rem', color: '#4c66e4', backgroundColor: '#f7fafc' }}>
                <Loader2 size={36} className="loader-spin" style={{ animation: 'spin 1s linear infinite' }} />
                Authenticating user...
            </div>
        );
    }
    
    return (
        <>
            {/* --- Navigation Header --- */}
                  <AdminHeader />

            {/* --- Main Profile Layout --- */}
            <div className="profile-page-container">
                
                {/* --- Sidebar --- */}
                <div className="profile-sidebar">
                    <div className="profile-avatar-large">
                        <span>{getUserInitials(mockUser.name)}</span>
                    </div>
                    <h2 className="profile-name">{mockUser.name}</h2>
                    <p className="profile-username">@{username}</p>
                    <p className="profile-joined">{getJoinedDate(mockUser.createdAt)}</p>

                    <div className="profile-actions">
                        <button className="update-profile-btn" onClick={() => navigate('/edit-admin-profile')}>
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
                            {/* Changed mockPremium to use actual role check */}
                            {mockUser.role === 'admin' && <span className="premium-badge">Admin Access</span>}
                        </div>
                        <div className="profile-info-grid">
                            <InfoField icon={User} label="Full Name" value={mockUser.name} />
                            <InfoField icon={Briefcase} label="Role" value={mockUser.role.charAt(0).toUpperCase() + mockUser.role.slice(1)} />
                            <InfoField icon={Mail} label="Email Address" value={mockUser.email} />
                            <InfoField icon={Phone} label="Phone Number" value={mockUser.phone} />
                            <InfoField icon={MapPin} label="Primary Location" value={mockUser.location} />
                            <InfoField icon={Globe} label="Member Since" value={getJoinedDate(mockUser.createdAt).replace('Joined ', '')} />
                        </div>
                    </div>

                    {/* Panel 2: About Me */}
                    <div className="profile-panel about-me-panel">
                        <h3>About Me</h3>
                        <p>{mockUser.about}</p>
                    </div>
                </div>
            </div>

            {/* --- Footer --- */}
            <AdminFooter />
        </>
    );
};

export default AdminProfile;
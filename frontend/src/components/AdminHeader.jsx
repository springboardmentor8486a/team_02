import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight } from 'lucide-react'; // Import ArrowRight for the logout button
import './AppHeader.css'; // Assuming AdminHeader relies on the same styles

const AdminHeader = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Since you didn't include the axios logic in the AdminHeader, 
        // we'll stick to local signout and navigation for consistency.
        signOut();
        navigate('/login');
    };

    const getUserInitials = (name) => {
        const safe = (name || '').trim();
        const parts = safe.split(' ').filter(Boolean);
        if (parts.length === 0) return 'A'; // Default for Admin
        return parts.map(p => p[0]).join('').toUpperCase();
    };

    const displayName = user?.fullName || user?.name || user?.username || (user?.email ? user.email.split('@')[0] : '') || 'Admin';

    return (
        <header className="header-top">
            <div className="logo-section" onClick={() => navigate('/admin-dashboard')}>
                <img src="/images/logo.png" alt="Clean Street Logo" className="logo-image" />
                <div className="logo-text">Clean Street</div>
            </div>
            {/* The nav-links will auto-adopt styling from AppHeader.css */}
            <nav className="nav-links">
                <Link to="/admin-dashboard">Dashboard</Link>
                <Link to="/admin-all-issues">All Issues</Link>
                <Link to="/admin-users-volunteers">Users & Volunteers</Link>
                <Link to="/admin-browse-issues">Browse Issues</Link>
                <Link to="/add-admin">Add New Admin</Link>
            </nav>
            <div className="header-right">
                <div className="user-profile">
                    {/* Use profile-link class for hover effect on user name and initials */}
                    <Link to="/admin-profile" className="profile-link">
                        {/* Use user-initials class for styling */}
                        <div className="user-initials">{getUserInitials(displayName)}</div>
                        {/* Use user-name class for styling */}
                        <span className="user-name">{displayName}</span>
                    </Link>
                    {/* Use logout-btn-header class for styling */}
                   
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
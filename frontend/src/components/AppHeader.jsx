import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './AppHeader.css';

const AppHeader = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        signOut();
        navigate('/login');
    };

    const getUserInitials = (name) => {
        const safe = (name || '').trim();
        const parts = safe.split(' ').filter(Boolean);
        if (parts.length === 0) return 'U';
        return parts.map(p => p[0]).join('').toUpperCase();
    };

    const displayName = user?.fullName || user?.name || 'User';

    return (
        <header className="header-top">
            <div className="logo-section" onClick={() => navigate('/')}>
                <img src="/images/logo.png" alt="Clean Street Logo" className="logo-image" />
                <div className="logo-text">Clean Street</div>
            </div>
            <nav className="nav-links">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/browse-issues">Browse Issues</Link>
                <Link to="/report-issue">Report Issue</Link>
            </nav>
            <div className="header-right">
                {user ? (
                    <div className="user-profile">
                        <Link to="/profile" className="profile-link">
                            <div className="user-initials">{getUserInitials(displayName)}</div>
                            <span className="user-name">{displayName}</span>
                        </Link>
                        <button onClick={handleLogout} className="logout-btn-header" title="Logout">
                            <ArrowRight size={20} />
                        </button>
                    </div>
                ) : (
                    <div className="auth-buttons">
                        <button onClick={() => navigate('/login')} className="sign-in-btn">Sign In <ArrowRight size={16} /></button>
                        <button onClick={() => navigate('/signup')} className="get-started-btn">Get Started</button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default AppHeader;






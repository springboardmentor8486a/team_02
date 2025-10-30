import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext'; // Uncomment if you have this context
import { ArrowRight } from 'lucide-react';
import '../pages/Header.css'; // Link to its own CSS

const Header = () => {
    // const { user, signOut } = useAuth(); // Uncomment if using AuthContext
    const user = { name: 'John Doe' }; // MOCK USER for design purposes - remove if using AuthContext
    const navigate = useNavigate();

    const handleLogout = () => {
        // Your actual logout logic here
        // signOut(); // Uncomment if using AuthContext
        navigate('/Home'); // Redirect to login after logout
    };

  const getUserInitials = (name) => {
    const safe = name || '';
    const parts = safe.split(' ').filter(Boolean);
    if (parts.length === 0) return 'JD';
    return parts.map(p => p[0]).join('').toUpperCase();
  };

    return (
        <header className="app-header">
            <div className="logo-section">
                <img src="/images/logo.png" alt="Clean Street Logo" className="logo-image" />
                <div className="logo-text">Clean Street</div>
            </div>
            <nav className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/browse-issues">Browse Issues</Link>
                <Link to="/report-issue" className="active">Report Issue</Link>
            </nav>
            {user && ( // Only show if user is logged in
                <div className="user-profile">
                    <Link to="/profile" className="profile-link">
                        <div className="user-initials">{getUserInitials(user.name)}</div>
                        <span className="user-name">{user.name}</span>
                    </Link>
                    <button onClick={handleLogout} className="logout-btn-header">
                        <ArrowRight size={20} />
                    </button>
                </div>
            )}
        </header>
    );
};

export default Header;
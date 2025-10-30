import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './AppHeader.css';

const VolunteerHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  const getUserInitials = (name) => {
    const safe = (name || '').trim();
    const parts = safe.split(' ').filter(Boolean);
    if (parts.length === 0) return '';
    return parts.map(p => p[0]).join('').toUpperCase();
  };

  const displayName = user?.fullName || user?.name || '';

  return (
    <header className="header-top">
      <div className="logo-section" onClick={() => navigate('/volunteer')}>
        <img src="/images/logo.png" alt="Clean Street Logo" className="logo-image" />
        <div className="logo-text">Clean Street</div>
      </div>
      <nav className="nav-links">
        <Link to="/volunteer">Dashboard</Link>
        <Link to="/my-assigned-issues">My Assigned Issues</Link>
        <Link to="/volunteer-browser-issues">Browse Issues</Link>
      </nav>
      <div className="header-right">
        <div className="user-profile">
          <Link to="/volunteer-profile" className="profile-link">
            <div className="user-initials">{getUserInitials(displayName)}</div>
            <span className="user-name">{displayName}</span>
          </Link>
          <button onClick={handleLogout} className="logout-btn-header" title="Logout">
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default VolunteerHeader;

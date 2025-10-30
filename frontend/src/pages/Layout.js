import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Assuming you have this
import { ArrowRight } from 'lucide-react';
import './Layout.css'; // We'll create this CSS file

const Layout = () => {
  const { user, signOut } = useAuth(); // Example: Get user for the header
  const navigate = useNavigate();

  const handleLogout = () => {
    // Your logout logic here
    signOut();
    navigate('/login');
  };
  
  const getUserInitials = (name) => {
    const safe = name || '';
    const parts = safe.split(' ').filter(Boolean);
    if (parts.length === 0) return '?';
    return parts.map(p => p[0]).join('').toUpperCase();
  };

  return (
    <>
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
        {user && (
          <div className="user-profile">
            <Link to="/profile" className="profile-link">
              <div className="user-initials">{getUserInitials(user?.fullName || user?.name)}</div>
              <span className="user-name">{user?.fullName || user?.name || 'User'}</span>
            </Link>
            <button onClick={handleLogout} className="logout-btn-header">
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </header>
      
      <main className="main-content">
        <Outlet /> {/* Child routes will render here */}
      </main>
      
      <footer className="footer">
        {/* Your full footer JSX here... */}
        <p>&copy; {new Date().getFullYear()} Clean Street. All Rights Reserved.</p>
      </footer>
    </>
  );
};

export default Layout;
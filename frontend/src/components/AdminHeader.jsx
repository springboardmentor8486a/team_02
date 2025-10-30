import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.fullName || user?.name || user?.username || (user?.email ? user.email.split('@')[0] : '') || 'Admin';
  return (
    <header className="header-top">
      <div className="logo-section" onClick={() => navigate('/admin-dashboard')}>
        <img src="/images/logo.png" alt="Clean Street Logo" className="logo-image" />
        <div className="logo-text">Clean Street</div>
      </div>
      <nav className="nav-links">
        <Link to="/admin-dashboard">Dashboard</Link>
        <Link to="/admin-all-issues">All Issues</Link>
        <Link to="/admin-users-volunteers">Users & Volunteers</Link>
        <Link to="/admin-browse-issues">Browse Issues</Link>
        <Link to="/add-admin">Add New Admin</Link>
      </nav>
      <div style={{display:'flex',alignItems:'center'}}>
        <Link to="/admin-profile" className="user-name profile-link" style={{fontWeight:'bold',marginRight:'10px'}}>{displayName}</Link>
        <button onClick={() => {signOut(); navigate('/login')}} className="logout-btn-header">Logout</button>
      </div>
    </header>
  );
};
export default AdminHeader;
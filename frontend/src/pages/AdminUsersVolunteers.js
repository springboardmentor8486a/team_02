import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, AlertCircle, Users, FileText, 
  Clock, Bell, LogOut, Settings, User, UserCheck
} from 'lucide-react';
import './AdminUsersVolunteers.css';

const AdminUsersVolunteers = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      signOut();
      navigate('/login');
    }
  };

  const getUserInitials = (name) => {
    if (!name) return 'MJ';
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };

  // Summary stats
  const stats = [
    { label: 'Total Citizens', value: '2', icon: User, color: '#3b82f6' },
    { label: 'Active Volunteers', value: '2', icon: UserCheck, color: '#22c55e' },
    { label: 'Total Reports', value: '8', icon: AlertCircle, color: '#f59e0b' }
  ];

  // Citizen users data
  const citizenUsers = [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      location: 'Downtown',
      reports: 3
    },
    {
      name: 'Sarah Johnson',
      email: 'sarahj@example.com',
      location: 'North District',
      reports: 5
    }
  ];

  // Volunteers data
  const volunteers = [
    {
      name: 'Sarah Wilson',
      email: 'sarah.wilson@cleanstreet.org',
      area: 'North District',
      assigned: 12,
      resolved: 47
    },
    {
      name: 'Mike Thompson',
      email: 'mike.t@cleanstreet.org',
      area: 'South District',
      assigned: 8,
      resolved: 32
    }
  ];

  return (
    <div className="admin-users-page">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <div className="admin-logo">
            <img src="/images/logo.png" alt="Clean Street" className="admin-logo-img" />
            <div className="admin-logo-text">
              <div className="admin-logo-title">Clean Street</div>
              <div className="admin-logo-subtitle">Civic Platform</div>
            </div>
          </div>
          <nav className="admin-nav">
            <Link to="/admin-dashboard" className="admin-nav-link">
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <Link to="/admin-all-issues" className="admin-nav-link">
              <AlertCircle size={18} />
              All Issues
            </Link>
            <Link to="/admin-users-volunteers" className="admin-nav-link active">
              <Users size={18} />
              Users & Volunteers
            </Link>
            <Link to="/admin-requests" className="admin-nav-link">
              <FileText size={18} />
              Admin Requests
            </Link>
            <Link to="/admin-issues-updates" className="admin-nav-link">
              <Clock size={18} />
              Issue Updates
            </Link>
          </nav>
        </div>
        <div className="admin-header-right">
          <button className="admin-icon-btn">
            <Bell size={20} />
          </button>
          <button className="admin-icon-btn">
            <Settings size={20} />
          </button>
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {getUserInitials(user?.name || 'Michael Johnson')}
            </div>
            <div className="admin-user-details">
              <span className="admin-user-name">{user?.name || 'Michael Johnson'}</span>
              <span className="admin-user-role">(admin)</span>
            </div>
          </div>
          <button className="admin-icon-btn logout" onClick={handleLogout}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="users-hero">
        <div className="users-hero-content">
          <div className="users-hero-icon">
            <Users size={40} />
          </div>
          <div className="users-hero-text">
            <h1>Users & Volunteers</h1>
            <p>Manage and coordinate all users and volunteers in the Clean Street community</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="users-stats-section">
        <div className="users-stats-grid">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="users-stat-card">
                <div className="users-stat-icon" style={{ backgroundColor: stat.color + '20' }}>
                  <Icon size={24} color={stat.color} />
                </div>
                <div className="users-stat-info">
                  <div className="users-stat-label">{stat.label}</div>
                  <div className="users-stat-value">{stat.value}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="users-main-content">
        {/* Citizen Users Section */}
        <div className="users-section">
          <div className="users-section-header">
            <div className="users-section-title">
              <User size={20} />
              <h2>Citizen Users</h2>
            </div>
          </div>
          <p className="users-section-subtitle">Users who report issues in the community</p>

          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Reports</th>
                </tr>
              </thead>
              <tbody>
                {citizenUsers.map((citizen, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-small">
                          {getUserInitials(citizen.name)}
                        </div>
                        <div className="user-info-cell">
                          <div className="user-name-cell">{citizen.name}</div>
                          <div className="user-email-cell">{citizen.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{citizen.location}</td>
                    <td>
                      <span className="reports-badge">{citizen.reports}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Volunteers Section */}
        <div className="users-section">
          <div className="users-section-header">
            <div className="users-section-title">
              <UserCheck size={20} />
              <h2>Volunteers</h2>
            </div>
          </div>
          <p className="users-section-subtitle">Volunteers who resolve community issues</p>

          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Area</th>
                  <th>Assigned</th>
                  <th>Resolved</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map((volunteer, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-small volunteer">
                          {getUserInitials(volunteer.name)}
                        </div>
                        <div className="user-info-cell">
                          <div className="user-name-cell">{volunteer.name}</div>
                          <div className="user-email-cell">{volunteer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{volunteer.area}</td>
                    <td>
                      <span className="assigned-badge">{volunteer.assigned}</span>
                    </td>
                    <td>
                      <span className="resolved-badge">{volunteer.resolved}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersVolunteers;
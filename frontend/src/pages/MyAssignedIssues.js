// MyAssignedIssues.js - Complete with Modal and Profile Navigation
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Calendar, User, Edit, Award, X, CheckCircle, Home, LogOut } from 'lucide-react';
import './MyAssignedIssues.css';

const MyAssignedIssues = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    status: 'In Progress',
    proofPhoto: null,
    workNotes: ''
  });

  const stats = [
    { label: 'Total Assigned', value: '3', color: '#e5e7eb' },
    { label: 'In Progress', value: '1', color: '#fed7aa' },
    { label: 'Completed', value: '47', color: '#86efac' }
  ];

  const assignedIssues = [
    {
      id: 1,
      title: 'Broken streetlight on Main St',
      description: 'Street light has been flickering and now completely out',
      location: 'Main Street & 5th Ave',
      category: 'Infrastructure',
      status: 'in progress',
      priority: 'high',
      reportedDate: '1/20/2024',
      assignedDate: '1/21/2024',
      reportedBy: 'John Doe'
    },
    {
      id: 2,
      title: 'Pothole on Oak Street',
      description: 'Large pothole causing damage to vehicles',
      location: 'Oak Street near City Park',
      category: 'Infrastructure',
      status: 'resolved',
      priority: 'medium',
      reportedDate: '1/22/2024',
      assignedDate: '1/22/2024',
      reportedBy: 'Sarah Johnson'
    },
    {
      id: 3,
      title: 'Vandalism on bus stop',
      description: 'Graffiti and broken glass at bus stop',
      location: 'Pine Street Bus Stop',
      category: 'Vandalism',
      status: 'resolved',
      priority: 'low',
      reportedDate: '1/24/2024',
      assignedDate: '1/24/2024',
      reportedBy: 'Mike Davis'
    }
  ];

  const handleUpdateClick = (issue) => {
    setSelectedIssue(issue);
    setUpdateForm({
      status: issue.status === 'in progress' ? 'In Progress' : 'Completed',
      proofPhoto: null,
      workNotes: ''
    });
    setShowUpdateModal(true);
  };

  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    console.log('Update submitted:', { issue: selectedIssue, update: updateForm });
    alert('Status update submitted for admin approval!');
    setShowUpdateModal(false);
    setUpdateForm({ status: 'In Progress', proofPhoto: null, workNotes: '' });
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      signOut();
      navigate('/');
    }
  };

  const getUserInitials = (name) => {
    if (!name) return 'SW';
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };

  return (
    <div className="my-assigned-container">
      {/* Header */}
      <header className="assigned-header">
        <div className="header-left">
          <div className="logo-section">
            <img src="/images/logo.png" alt="Clean Street" className="logo-image" />
            <div>
              <div className="logo-title">Clean Street</div>
              <div className="logo-subtitle">Civic Platform</div>
            </div>
          </div>
          <nav className="nav-tabs">
            <button className="nav-tab" onClick={() => navigate('/volunteer')}>
              Dashboard
            </button>
            <button className="nav-tab active">My Assigned Issues</button>
            <button className="nav-tab" onClick={() => navigate('/volunteer-browser-issues', { state: { userType: 'volunteer' } })}>
              Browse Issues
            </button>
          </nav>
        </div>
        <div className="header-right">
          {/* Home Button */}
          <button 
            className="header-icon-btn" 
            onClick={() => navigate('/')}
            title="Home"
          >
            <Home size={20} />
          </button>

          {/* Profile Button - Clickable */}
          <div 
            className="user-badge clickable-profile" 
            onClick={() => navigate('/volunteer-profile')}
            title="View Profile"
          >
            <div className="user-avatar">{getUserInitials(user?.name)}</div>
            <span className="user-name">
              {user?.name || 'Sarah Wilson'} 
              <span className="user-role">(volunteer)</span>
            </span>
          </div>

          {/* Logout Button */}
          <button 
            className="header-icon-btn logout-btn" 
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="assigned-hero">
        <div className="hero-content">
          <Award size={32} className="hero-icon" />
          <h1>My Assigned Issues</h1>
          <p>Managing and updating issues in North District</p>
        </div>
        <div className="hero-badge">
          <span className="badge-icon">📍</span>
          <span className="badge-text">Area: North District</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="assigned-stats-container">
        {stats.map((stat, idx) => (
          <div key={idx} className="assigned-stat-card">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value" style={{ color: stat.value === '1' ? '#f97316' : stat.value === '47' ? '#22c55e' : '#6b7280' }}>
              {stat.value}
            </div>
            <div className="stat-indicator" style={{ backgroundColor: stat.color }}></div>
          </div>
        ))}
      </div>

      {/* Active Assignments Section */}
      <div className="assignments-section">
        <div className="section-header">
          <Edit size={20} />
          <h2>Active Assignments</h2>
        </div>
        <p className="section-subtitle">Issues currently assigned to you that need attention</p>

        <div className="assignments-list">
          {assignedIssues.map((issue) => (
            <div key={issue.id} className="assignment-card">
              <div className="assignment-main">
                <div className="assignment-header">
                  <h3>{issue.title}</h3>
                  <span className={`status-badge status-${issue.status.replace(' ', '-')}`}>
                    {issue.status}
                  </span>
                  <span className={`priority-badge priority-${issue.priority}`}>
                    {issue.priority}
                  </span>
                </div>
                <p className="assignment-description">{issue.description}</p>
                <div className="assignment-meta">
                  <div className="meta-item">
                    <MapPin size={14} />
                    <span>{issue.location}</span>
                  </div>
                  <div className="meta-item">
                    <Calendar size={14} />
                    <span>Reported: {issue.reportedDate}</span>
                  </div>
                  <div className="meta-item">
                    <User size={14} />
                    <span>By: {issue.reportedBy}</span>
                  </div>
                </div>
                <div className="assignment-dates">Assigned: {issue.assignedDate}</div>
              </div>
              <button className="update-btn" onClick={() => handleUpdateClick(issue)}>
                <Edit size={16} />
                Update Status
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Update Status Modal */}
      {showUpdateModal && selectedIssue && (
        <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header">
              <div className="modal-title-section">
                <div className="modal-title-row">
                  <Edit size={20} color="#5b6fa8" />
                  <h3>Update Issue Status</h3>
                </div>
                <p className="modal-subtitle">Submit a status update request for admin approval</p>
              </div>
              <button className="modal-close-btn" onClick={() => setShowUpdateModal(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              {/* Issue Information */}
              <div className="modal-section issue-info-section">
                <div className="section-icon-title">
                  <span className="section-icon">ℹ️</span>
                  <h4>Issue Information</h4>
                </div>
                <div className="info-grid">
                  <div className="info-field">
                    <label>Issue Title</label>
                    <div className="info-value">{selectedIssue.title}</div>
                  </div>
                  <div className="info-field">
                    <label>Category</label>
                    <div className="info-value">{selectedIssue.category}</div>
                  </div>
                  <div className="info-field">
                    <label>Volunteer Name</label>
                    <div className="info-value">{user?.name || 'Sarah Wilson'}</div>
                  </div>
                  <div className="info-field">
                    <label>Current Status</label>
                    <div className="info-value">{selectedIssue.status}</div>
                  </div>
                  <div className="info-field full-width">
                    <label>Location</label>
                    <div className="info-value">{selectedIssue.location}</div>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="modal-section status-update-section">
                <div className="section-icon-title">
                  <span className="section-icon">🔄</span>
                  <h4>Status Update</h4>
                </div>
                <div className="form-field">
                  <label>New Status *</label>
                  <select 
                    className="form-select"
                    value={updateForm.status}
                    onChange={(e) => setUpdateForm({...updateForm, status: e.target.value})}
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Needs Review">Needs Review</option>
                  </select>
                  <small>Choose the appropriate status for this issue</small>
                </div>
              </div>

              {/* Documentation */}
              <div className="modal-section documentation-section">
                <div className="section-icon-title">
                  <span className="section-icon">📎</span>
                  <h4>Documentation</h4>
                </div>
                <div className="form-field">
                  <label>Proof Photo</label>
                  <input 
                    type="file"
                    className="form-file-input"
                    accept="image/*"
                    onChange={(e) => setUpdateForm({...updateForm, proofPhoto: e.target.files[0]})}
                  />
                  <small>Upload photo evidence of work completed (recommended)</small>
                </div>
                <div className="form-field">
                  <label>Work Notes *</label>
                  <textarea 
                    className="form-textarea"
                    rows="4"
                    placeholder="Describe the work performed and current status..."
                    value={updateForm.workNotes}
                    onChange={(e) => setUpdateForm({...updateForm, workNotes: e.target.value})}
                  />
                  <small>Provide detailed information about the work completed</small>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="modal-actions">
                <button className="btn-submit" onClick={handleSubmitUpdate}>
                  <CheckCircle size={18} />
                  Submit for Approval
                </button>
                <button className="btn-cancel" onClick={() => setShowUpdateModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAssignedIssues;
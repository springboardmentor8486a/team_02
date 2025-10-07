// AdminIssueUpdates.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, AlertCircle, Users, FileText, 
  Clock, Bell, LogOut, Settings, CheckCircle, XCircle,
  Calendar, User as UserIcon
} from 'lucide-react';
import './AdminIssuesUpdates.css';

const AdminIssueUpdates = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [updates, setUpdates] = useState([
    {
      id: 1,
      issueTitle: 'Broken streetlight on Main St',
      volunteer: 'Sarah Wilson',
      statusChange: { from: 'pending', to: 'resolved' },
      submittedDate: '1/23/2024',
      proofPhoto: null,
      notes: 'Replaced bulb and checked electrical connections. Issue is now fully resolved.',
      resolution: 'This issue has been marked as resolved. Approving will close the issue and notify the reporter.'
    },
    {
      id: 2,
      issueTitle: 'Pothole on Oak Street',
      volunteer: 'Mike Thompson',
      statusChange: { from: 'resolved', to: 'in progress' },
      submittedDate: '1/23/2024',
      proofPhoto: null,
      notes: 'Started pavement, materials ordered. Work will begin next week.',
      resolution: null
    },
    {
      id: 3,
      issueTitle: 'Overflowing garbage bin',
      volunteer: 'Sarah Wilson',
      statusChange: { from: 'pending', to: 'resolved' },
      submittedDate: '1/23/2024',
      proofPhoto: 'Available',
      notes: 'Cleared up area and coordinated with waste management for larger bin.',
      resolution: 'This issue has been marked as resolved. Approving will close the issue and notify the reporter.'
    }
  ]);

  const handleApprove = (updateId) => {
    if (window.confirm('Are you sure you want to approve this status update?')) {
      setUpdates(updates.filter(u => u.id !== updateId));
      alert('Status update approved successfully!');
    }
  };

  const handleReject = (updateId) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (reason) {
      setUpdates(updates.filter(u => u.id !== updateId));
      alert('Status update rejected and volunteer has been notified.');
    }
  };

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

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'pending': 'status-pending',
      'in progress': 'status-progress',
      'resolved': 'status-resolved'
    };
    return statusMap[status] || 'status-pending';
  };

  return (
    <div className="admin-issue-updates">
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
            <Link to="/admin-users-volunteers" className="admin-nav-link">
              <Users size={18} />
              Users & Volunteers
            </Link>
            <Link to="/admin-requests" className="admin-nav-link">
              <FileText size={18} />
              Admin Requests
            </Link>
            <Link to="/admin-issues-updates" className="admin-nav-link active">
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

      {/* Main Content */}
      <div className="updates-container">
        {/* Page Header */}
        <div className="updates-page-header">
          <h1 className="updates-page-title">Issue Updates</h1>
          <p className="updates-page-subtitle">
            Review and approve status updates submitted by volunteers
          </p>
        </div>

        {/* Section Header */}
        <div className="updates-section-header">
          <div className="section-title-wrapper">
            <Clock size={20} className="section-icon" />
            <h2 className="section-title">Pending Issue Updates</h2>
          </div>
          <p className="section-description">
            Review status changes and work progress submitted by field volunteers
          </p>
        </div>

        {/* Updates List */}
        <div className="updates-list">
          {updates.map((update) => (
            <div key={update.id} className="update-card">
              <div className="update-header">
                <div className="update-title-section">
                  <Clock size={16} className="update-icon" />
                  <h3 className="update-title">{update.issueTitle}</h3>
                </div>
                <span className="volunteer-name">Updated by {update.volunteer}</span>
              </div>

              <div className="update-body">
                {/* Status Change */}
                <div className="status-change-section">
                  <div className="label">Status Change:</div>
                  <div className="status-badges">
                    <span className={`status-badge ${getStatusBadgeClass(update.statusChange.from)}`}>
                      {update.statusChange.from}
                    </span>
                    <span className="status-arrow">→</span>
                    <span className={`status-badge ${getStatusBadgeClass(update.statusChange.to)}`}>
                      {update.statusChange.to}
                    </span>
                  </div>
                </div>

                {/* Meta Information */}
                <div className="update-meta">
                  <div className="meta-item">
                    <Calendar size={14} />
                    <span className="meta-label">Submitted</span>
                    <span className="meta-value">{update.submittedDate}</span>
                  </div>
                  <div className="meta-item">
                    <FileText size={14} />
                    <span className="meta-label">Proof Photo</span>
                    <span className="meta-value">{update.proofPhoto || 'None'}</span>
                  </div>
                </div>

                {/* Volunteer Notes */}
                <div className="volunteer-notes-section">
                  <div className="notes-label">Volunteer Notes:</div>
                  <p className="notes-text">{update.notes}</p>
                </div>

                {/* Resolution Update */}
                {update.resolution && (
                  <div className="resolution-section">
                    <div className="resolution-label">Resolution Update:</div>
                    <p className="resolution-text">{update.resolution}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="update-actions">
                <button 
                  className="action-btn approve-btn"
                  onClick={() => handleApprove(update.id)}
                >
                  <CheckCircle size={16} />
                  Approve
                </button>
                <button 
                  className="action-btn reject-btn"
                  onClick={() => handleReject(update.id)}
                >
                  <XCircle size={16} />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Review Guidelines */}
        <div className="guidelines-box">
          <div className="guidelines-header">
            <AlertCircle size={20} />
            <span>Review Guidelines</span>
          </div>
          <ul className="guidelines-list">
            <li>Verify that status changes are appropriate and well-documented</li>
            <li>Check for proof photos when issues are marked as resolved</li>
            <li>Ensure volunteer notes clearly explain the work completed</li>
            <li>Rejected updates will be returned to volunteers with feedback</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminIssueUpdates;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Calendar, User, Edit, Award, X, CheckCircle, Home, LogOut, Loader2, FileText,ArrowRight } from 'lucide-react';
import './MyAssignedIssues.css'; 


const MyAssignedIssues = () => {
    const navigate = useNavigate();
    // Assuming useAuth provides a user object with a 'name' property
    const { user, signOut } = useAuth(); 
    
    // Mock user for UI if auth context is not fully implemented
    const mockUser = { name: user?.name || 'Sarah Wilson', email: user?.email || 'sarah.w@cleanstreet.org' };

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [updateForm, setUpdateForm] = useState({
        status: 'In Progress',
        proofPhoto: null,
        workNotes: ''
    });

    // Mock Data (Placeholder for API Fetch)
    const assignedIssues = [
        {
            id: 1,
            title: 'Broken streetlight on Main St',
            description: 'Street light has been flickering and now completely out. Critical intersection.',
            location: 'Main Street & 5th Ave',
            category: 'Street Lights',
            status: 'in progress',
            priority: 'high',
            reportedDate: '2024-01-20',
            assignedDate: '2024-01-21',
            reportedBy: 'John Doe'
        },
        {
            id: 2,
            title: 'Large Pothole on Oak Street',
            description: 'Large, deep pothole causing vehicle damage. Needs immediate filling.',
            location: 'Oak Street near City Park',
            category: 'Potholes',
            status: 'pending', // Pending update submission
            priority: 'medium',
            reportedDate: '2024-01-22',
            assignedDate: '2024-01-22',
            reportedBy: 'Sarah Johnson'
        },
        {
            id: 3,
            title: 'Vandalism on bus stop shelter',
            description: 'Graffiti and broken glass at Pine Street Bus Stop.',
            location: 'Pine Street Bus Stop',
            category: 'Vandalism',
            status: 'resolved',
            priority: 'low',
            reportedDate: '2024-01-24',
            assignedDate: '2024-01-24',
            reportedBy: 'Mike Davis'
        }
    ];

    const stats = [
        { label: 'Total Assigned', value: assignedIssues.length, color: '#2c5292' },
        { label: 'In Progress', value: assignedIssues.filter(i => i.status === 'in progress').length, color: '#dd6b20' },
        { label: 'Completed (All Time)', value: '47', color: '#38a169' } // Hardcoded completion stat
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

    const handleSubmitUpdate = async (e) => {
        e.preventDefault();
        
        if (!updateForm.workNotes.trim()) {
            alert("Please provide detailed work notes before submitting.");
            return;
        }

        setIsSubmitting(true);
        // Simulate API call for status update
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        console.log('Update submitted:', { issue: selectedIssue.id, update: updateForm });
        
        setIsSubmitting(false);
        alert('Status update submitted successfully for admin approval!');
        
        // In a real app, you would refetch issues here.
        setShowUpdateModal(false);
        setUpdateForm({ status: 'In Progress', proofPhoto: null, workNotes: '' });
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            // Placeholder for real API logout call:
            // axios.post('http://localhost:3000/api/v1/users/logout', {}, { withCredentials: true })
            //     .catch(() => {}) 
            //     .finally(() => {
            //         signOut();
            //         navigate('/');
            //     });
            signOut();
            navigate('/');
        }
    };

    const getUserInitials = (name) => {
        if (!name) return 'V';
        const nameParts = name.split(' ');
        return nameParts.map(part => part[0]).join('').toUpperCase();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'status-pending';
            case 'in progress':
                return 'status-in-progress';
            case 'resolved':
                return 'status-resolved';
            default:
                return 'status-default';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'priority-high';
            case 'medium':
                return 'priority-medium';
            case 'low':
                return 'priority-low';
            default:
                return 'priority-medium';
        }
    };

    return (
        <div className="my-assigned-container">
            {/* 1. Header: Matches VolunteerBrowseIssues structure */}
            <header className="header-top">
                <div className="logo-section">
                    <img src="/images/logo.png" alt="Clean Street Logo" className="logo-image" />
                    <div className="logo-text">Clean Street</div>
                </div>
                <nav className="nav-links">
                    <Link to="/volunteer">Dashboard</Link>
                    <Link to="/MyAssignedIssues" className="active">My Assigned Issues</Link>
                    <Link to="/volunteer-browser-issues">Browse Issues</Link>
                </nav>
                <div className="header-right">
                    {/* Home Button */}


                    {/* Profile Button - Clickable */}
                    <div 
                        className="user-info clickable-profile" 
                        onClick={() => navigate('/volunteer-profile')}
                        title="View Profile"
                    >
                        <div className="user-initials">{getUserInitials(mockUser.name)}</div>
                        <span className="user-name">
                            {mockUser.name}
                        </span>
                    </div>

                    {/* Logout Button */}
                    <button onClick={handleLogout} className="logout-btn-header">
                        <ArrowRight size={20} />
                    </button>
                </div>
            </header>

            {/* 2. Hero Section */}
            <div className="assigned-hero">
                <div className="hero-content">
                    <Award size={32} className="hero-icon" />
                    <h1>My Active Assignments</h1>
                    <p>Issues currently assigned to you and ready for field work.</p>
                </div>
                <div className="hero-badge">
                    <span className="badge-icon">📍</span>
                    <span className="badge-text">Volunteer: {mockUser.name.split(' ')[0]}</span>
                </div>
            </div>

            {/* 3. Stats Cards */}
            <div className="assigned-stats-container">
                {stats.map((stat, idx) => (
                    <div key={idx} className="assigned-stat-card">
                        <div className="stat-label">{stat.label}</div>
                        <div className="stat-value" style={{ color: stat.color }}>
                            {stat.value}
                        </div>
                        <div className="stat-indicator" style={{ backgroundColor: stat.color }}></div>
                    </div>
                ))}
            </div>

            {/* 4. Active Assignments Section */}
            <div className="assignments-section">
                <div className="section-header">
                    <FileText size={20} />
                    <h2>Pending Issues ({assignedIssues.filter(i => i.status !== 'resolved').length})</h2>
                </div>
                <p className="section-subtitle">Issues awaiting your field intervention or status update.</p>

                <div className="assignments-list">
                    {assignedIssues.map((issue) => (
                        <div key={issue.id} className="assignment-card">
                            <div className="assignment-main">
                                <div className="assignment-header">
                                    <h3>{issue.title}</h3>
                                    <span className={`status-badge ${getStatusColor(issue.status)}`}>
                                        {issue.status}
                                    </span>
                                    <span className={`priority-badge ${getPriorityColor(issue.priority)}`}>
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
                            
                            {issue.status !== 'resolved' && (
                                <button className="update-btn" onClick={() => handleUpdateClick(issue)}>
                                    <Edit size={16} />
                                    Update Status
                                </button>
                            )}
                             {issue.status === 'resolved' && (
                                <button className="resolved-btn" disabled>
                                    <CheckCircle size={16} />
                                    Resolved
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* 5. Update Status Modal */}
            {showUpdateModal && selectedIssue && (
                <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                        
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

                        <form className="modal-body" onSubmit={handleSubmitUpdate}>
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
                                        <div className="info-value">{mockUser.name}</div>
                                    </div>
                                    <div className="info-field">
                                        <label>Current Status</label>
                                        <div className="info-value">{selectedIssue.status.toUpperCase()}</div>
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
                                <button type="submit" className="btn-submit" disabled={isSubmitting || !updateForm.workNotes.trim()}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={18} className="spinner" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={18} />
                                            Submit for Approval
                                        </>
                                    )}
                                </button>
                                <button type="button" className="btn-cancel" onClick={() => setShowUpdateModal(false)} disabled={isSubmitting}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyAssignedIssues;
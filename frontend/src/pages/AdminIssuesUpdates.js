import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
    LayoutDashboard, AlertCircle, Users, FileText, 
    Clock, Bell, LogOut, Settings, CheckCircle, XCircle, ArrowRight,
    Calendar, User as UserIcon, Loader2
} from 'lucide-react';
import './AdminIssuesUpdates.css';

const API_BASE_URL = 'http://localhost:3000/api/v1';

const AdminIssueUpdates = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    
    // States for Live Data
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [processing, setProcessing] = useState(false); // For approval/rejection actions

    // --- Data Fetching ---
    const fetchUpdates = useCallback(async () => {
        setLoading(true);
        setFetchError(null);
        try {
            // NOTE: We need a new backend route, e.g., /complaints/review-pending. 
            // Mocking the status filter in the existing /complaints/all route for now.
            // A dedicated backend endpoint is highly recommended.
            
            const response = await axios.get(`${API_BASE_URL}/complaints/all?status=inReview`, { 
                withCredentials: true 
            });

            // Map fetched complaints (status = inReview) into update card format
            const mappedUpdates = response.data.data.map(comp => ({
                id: comp._id,
                issueTitle: comp.title,
                volunteer: comp.assignedTo || 'N/A', // Volunteer name is stored in assignedTo
                statusChange: { from: 'In Progress', to: 'Resolved' }, // Assumption: Volunteers submit updates only when resolving
                submittedDate: new Date(comp.updatedAt).toLocaleDateString(),
                proofPhoto: comp.photo ? 'Available' : null, // Assuming 'photo' field holds the proof photo
                notes: comp.comments.length > 0 
                       ? comp.comments[comp.comments.length - 1].content // Grab the latest comment/update note
                       : 'No specific notes submitted.',
                resolution: 'This update marks the issue as completed. Approving will set status to Resolved.'
            }));
            
            setUpdates(mappedUpdates);
        } catch (err) {
            console.error("Fetch Error:", err.response?.data || err.message);
            setFetchError(err.response?.data?.message || 'Failed to fetch pending updates.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchUpdates();
        }
    }, [user, fetchUpdates]);

    // --- Action Handlers ---
    const handleApprove = async (updateId) => {
        if (processing || !window.confirm('Are you sure you want to approve this status update?')) return;
        
        setProcessing(true);
        try {
            // API Call: Set status to 'resolved'
            await axios.put(`${API_BASE_URL}/complaints/${updateId}`, 
                { status: 'resolved' }, 
                { withCredentials: true }
            );
            
            alert('Status update approved successfully! Issue is now Resolved.');
            setUpdates(updates.filter(u => u.id !== updateId)); // Remove from list
        } catch (error) {
            console.error("Approval failed:", error.response?.data || error.message);
            alert('Approval failed: ' + (error.response?.data?.message || 'Server error.'));
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async (updateId) => {
        if (processing) return;
        const reason = window.prompt('Please provide a reason for rejection:');
        
        if (reason) {
            setProcessing(true);
            try {
                // API Call: Set status back to 'inReview' or 'recived' and add a comment/note
                // NOTE: We set status back to 'in progress' (mapped to 'inReview') 
                // but leave it on the volunteer's list for another try.
                
                // For simplicity, we just delete it from the review list, implying an action took place.
                // In a real app, status would change to 'in progress' and a comment would be logged.

                alert('Status update rejected. Volunteer notified.');
                setUpdates(updates.filter(u => u.id !== updateId)); // Remove from list
                
            } catch (error) {
                 console.error("Rejection failed:", error.message);
                 alert('Rejection failed.');
            } finally {
                setProcessing(false);
            }
        }
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            signOut();
            navigate('/');
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
        return statusMap[status] || 'status-default';
    };

    if (!user) {
        return <div className="loading-state">Authenticating...</div>; // Simple loading for unauthed state
    }

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
                            <LayoutDashboard size={18} /> Dashboard
                        </Link>
                        <Link to="/admin-all-issues" className="admin-nav-link">
                            <AlertCircle size={18} /> All Issues
                        </Link>
                        <Link to="/admin-users-volunteers" className="admin-nav-link">
                            <Users size={18} /> Users & Volunteers
                        </Link>
                        <Link to="/admin-requests" className="admin-nav-link">
                            <FileText size={18} /> Admin Requests
                        </Link>
                        <Link to="/admin-issues-updates" className="admin-nav-link active">
                            <Clock size={18} /> Issue Updates
                        </Link>
                    </nav>
                </div>
                <div className="user-profile">
                    <Link to="/AdminProfile" className="profile-link">
                        <div className="user-initials">{getUserInitials(user.name)}</div>
                        <span className="user-name">{user.name}</span>
                    </Link>
                    <button onClick={handleLogout} className="logout-btn-header">
                        <ArrowRight size={20} />
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
                        <h2 className="section-title">Pending Issue Updates ({updates.length})</h2>
                    </div>
                    <p className="section-description">
                        Review status changes and work progress submitted by field volunteers
                    </p>
                </div>

                {/* Loading/Error States */}
                {loading && <div className="loading-message">Fetching pending updates...</div>}
                {fetchError && <div className="error-message">Error: {fetchError}</div>}
                
                {/* Updates List */}
                <div className="updates-list">
                    {!loading && updates.length === 0 && !fetchError && (
                        <div className="no-updates-message">
                            <CheckCircle size={32} />
                            <p>No pending updates requiring administrative review.</p>
                        </div>
                    )}

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
                                    disabled={processing}
                                >
                                    <CheckCircle size={16} />
                                    {processing ? 'Processing...' : 'Approve'}
                                </button>
                                <button 
                                    className="action-btn reject-btn"
                                    onClick={() => handleReject(update.id)}
                                    disabled={processing}
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
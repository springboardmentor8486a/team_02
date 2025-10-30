// src/pages/MyAssignedIssues.jsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { 
    MapPin, Calendar, User, Edit, Award, X, CheckCircle, ArrowRight, LogOut, Loader2, FileText, AlertCircle 
} from 'lucide-react';
import './MyAssignedIssues.css'; 
import VolunteerHeader from '../components/VolunteerHeader.jsx';
import VolunteerFooter from '../components/VolunteerFooter.jsx';

const API_BASE_URL = 'http://localhost:3000/api/v1'; 

// Utility to safely get initials (Extracted from your general utility logic)
const getUserInitials = (name) => {
    if (!name) return 'V';
    const cleanedName = (name.fullName || name).replace(/[^a-zA-Z\s]/g, '').trim();
    const nameParts = cleanedName.split(/\s+/).filter(Boolean);
    if (nameParts.length === 0) return 'V';
    const firstInitial = nameParts[0][0];
    const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : '';
    return (firstInitial + lastInitial).toUpperCase();
};

const MyAssignedIssues = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    
    const [assignedIssues, setAssignedIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [updateForm, setUpdateForm] = useState({
        status: 'in progress', 
        proofPhoto: null, 
        workNotes: ''
    });

    // --- Data Fetching Logic (FIXED FOR DYNAMIC DATA) ---
    const robustVolunteerName =
  user?.fullName || user?.name || user?.username || (user?.email ? user.email.split('@')[0] : '') || 'Volunteer';

    const fetchAssignedIssues = useCallback(async () => {
        if (!user || user.role !== 'volunteer') return;

        setLoading(true);
        setError(null);
        try {
            // Fetch all complaints, just like admin, then filter on frontend by assignedTo
            const response = await axios.get(`${API_BASE_URL}/complaints/all`, { withCredentials: true });
            const DEPARTMENTS = [
              "Municipal sanitation and public health",
              "Roads and street infrastructure",
              "Street lighting and electrical assets",
              "Water, sewerage, and stormwater",
              "Ward/zone office and central admin"
            ];
            const issues = (response.data.data || []).map(comp => {
              let assignedToName = comp.assignedTo;
              // Mark as unassigned if department
              if (DEPARTMENTS.includes(assignedToName)) assignedToName = null;
              return {
                id: comp._id,
                title: comp.title,
                status: comp.status,
                priority: comp.priority || 'medium',
                assignedTo: assignedToName,
                reportedBy: comp.userId?.name || 'Anonymous Citizen',
                date: new Date(comp.createdAt).toLocaleDateString('en-US'),
                description: comp.description,
                location: Array.isArray(comp.address) ? comp.address[0] : (comp.address || 'Unknown Location'), 
                category: comp.category || '',
              };
            });
            // Only keep issues where assignedTo matches this volunteer
            const matches = issues.filter(i =>
              i.assignedTo && [user.fullName, user.name, user.username, robustVolunteerName].some(n => n && i.assignedTo.toLowerCase() === n.toLowerCase())
            );
            setAssignedIssues(matches);
        } catch (err) {
            setError('Failed to fetch assigned issues.');
            setAssignedIssues([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Initial load and redirect logic
    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.role !== 'volunteer') {
            navigate('/dashboard'); 
        } else {
            fetchAssignedIssues();
        }
    }, [user, navigate, fetchAssignedIssues]);

    // --- UI/Helper Logic (Fixed with correct imports) ---
    const stats = useMemo(() => {
        const total = assignedIssues.length;
        const inProgress = assignedIssues.filter(i => i.status === 'in progress' || i.status === 'inReview' || i.status === 'recived').length;
        const resolved = assignedIssues.filter(i => i.status === 'resolved').length;
        return [
            { label: 'Total Assigned', value: total, color: '#2c5292' },
            { label: 'In Progress', value: inProgress, color: '#dd6b20' },
            { label: 'Resolved', value: resolved, color: '#38a169' }
        ];
    }, [assignedIssues]);

    const handleUpdateClick = (issue) => {
        setSelectedIssue(issue);
        const initialStatus = issue.status === 'resolved' ? 'resolved' : 'in progress';
        setUpdateForm({
            status: initialStatus,
            proofPhoto: null,
            workNotes: ''
        });
        setShowUpdateModal(true);
    };

    const handleFileChange = (e) => {
        setUpdateForm(prev => ({...prev, proofPhoto: e.target.files[0]}));
    };

    const handleSubmitUpdate = async (e) => {
        e.preventDefault();
        
        if (!updateForm.workNotes.trim()) {
            alert("Please provide detailed work notes before submitting.");
            return;
        }

        setIsSubmitting(true);

        const submitData = new FormData();
        let statusToSend = updateForm.status; 
        
        if (statusToSend === 'Completed') {
            statusToSend = 'resolved'; // Final status update to mark as complete
        }
        
        submitData.append('status', statusToSend);
        submitData.append('workNotes', updateForm.workNotes);

        if (updateForm.proofPhoto) {
            // Your backend controller expects the file under the key 'proofPhoto'
            submitData.append('proofPhoto', updateForm.proofPhoto); 
        }

        try {
            await axios.put(
                `${API_BASE_URL}/complaints/update-status/${selectedIssue.id}`,
                submitData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                }
            );
            
            alert(`Status updated to ${statusToSend.toUpperCase()}. Assignments refreshed.`);
            setShowUpdateModal(false);
            fetchAssignedIssues(); 
        } catch (error) {
            console.error('Update Submission Error:', error.response?.data || error.message);
            alert(`Failed to submit update: ${error.response?.data?.message || 'Server error.'}`);
        } finally {
            setIsSubmitting(false);
            setUpdateForm({ status: 'in progress', proofPhoto: null, workNotes: '' });
        }
    };
    
    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            signOut();
            navigate('/');
        }
    };

    const getStatusColor = (status) => {
        const normalizedStatus = (status || '').toLowerCase();
        switch (normalizedStatus) {
            case 'recived': // Typo in database, kept for compatibility
            case 'received':
            case 'pending':
                return 'status-pending';
            case 'inprogress':
            case 'in progress':
            case 'inreview':
            case 'inreview':
                return 'status-in-progress';
            case 'resolved':
                return 'status-resolved';
            default:
                return 'status-default';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'priority-high';
            case 'medium': return 'priority-medium';
            case 'low': return 'priority-low';
            default: return 'priority-medium';
        }
    };

    if (!user || user.role !== 'volunteer') return null;

    return (
        <div className="my-assigned-container">
            <VolunteerHeader />

            <div className="assigned-hero">
                <div className="hero-content">
                    <Award size={32} className="hero-icon" />
                    <h1>My Active Assignments</h1>
                    <p>Issues currently assigned to you and ready for field work.</p>
                </div>
                
            </div>

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

            <div className="assignments-section">
                <div className="section-header">
                    <FileText size={20} />
                    <h2>Pending Issues ({assignedIssues.filter(i => i.status !== 'resolved').length})</h2>
                </div>
                <p className="section-subtitle">Issues awaiting your field intervention or status update.</p>

                <div className="assignments-list">
                    {loading && (
                        <div className="loading-message">
                            <Loader2 size={24} className="spinner" /> Fetching your assignments...
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            <AlertCircle size={24} /> {error}
                        </div>
                    )}

                    {!loading && assignedIssues.length === 0 && !error && (
                        <div className="no-updates-message">
                            <CheckCircle size={32} />
                            <h3>No Issues Assigned Yet</h3>
                            <p>You don't have any complaints assigned to you at the moment. Check back later or contact your administrator.</p>
                        </div>
                    )}

                    {assignedIssues.map((issue) => (
                        <div key={issue.id} className="assignment-card">
                            <div className="assignment-main">
                                <div className="assignment-header">
                                    <h3>{issue.title}</h3>
                                    <span className={`status-badge ${getStatusColor(issue.status)}`}>
                                        {issue.status === 'recived' ? 'Received' : 
                                         issue.status === 'inReview' ? 'In Review' : 
                                         issue.status === 'inProgress' ? 'In Progress' : 
                                         issue.status.replace(/\b\w/g, c => c.toUpperCase())}
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
                                        <span>Reported: {issue.date}</span>
                                    </div>
                                    <div className="meta-item">
                                        <User size={14} />
                                        <span>By: {issue.reportedBy}</span>
                                    </div>
                                </div>
                                <div className="assignment-dates">Assigned: {issue.assignedDate} (Volunteer: {robustVolunteerName})</div>
                            </div>
                            
                            {issue.status !== 'resolved' ? (
                                <button className="update-btn" onClick={() => handleUpdateClick(issue)}>
                                    <Edit size={16} />
                                    Update Status
                                </button>
                            ) : (
                                <button className="resolved-btn" disabled>
                                    <CheckCircle size={16} />
                                    Resolved
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {showUpdateModal && selectedIssue && (
                <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                        
                        <div className="modal-header">
                            <div className="modal-title-section">
                                <div className="modal-title-row">
                                    <Edit size={20} color="#5b6fa8" />
                                    <h3>Update Issue Status</h3>
                                </div>
                                <p className="modal-subtitle">Submit a status update request for admin review</p>
                            </div>
                            <button className="modal-close-btn" onClick={() => setShowUpdateModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form className="modal-body" onSubmit={handleSubmitUpdate}>
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
                                        <label>Current Status</label>
                                        <div className="info-value">{selectedIssue.status.toUpperCase()}</div>
                                    </div>
                                </div>
                            </div>

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
                                        <option value="in progress">In Progress</option>
                                        <option value="Completed">Completed (Request Resolution)</option>
                                    </select>
                                    <small>Select "Completed" to flag the issue for final admin review</small>
                                </div>
                            </div>

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
                                        onChange={handleFileChange}
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
                                            Submit Update
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
            <VolunteerFooter />
        </div>
    );
};

export default MyAssignedIssues;
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
    LayoutDashboard, AlertCircle, Users, FileText, Clock, 
    CheckCircle, BarChart3, Search, Download, UserX, UserCheck, 
    Bell, LogOut, Settings, User as UserIcon
} from 'lucide-react';
import './AdminAllIssues.css';

const API_BASE_URL = 'http://localhost:3000/api/v1';

// --- MOCK VOLUNTEER DATA (Used for assignment dropdown and persistence check) ---
const MOCK_VOLUNTEERS = [
    { id: 'v1', name: 'Sarah Wilson' },
    { id: 'v2', name: 'Mike Thompson' },
    { id: 'v3', name: 'Rajesh Kumar' },
    { id: 'v4', name: 'Amara Singh' },
    { id: 'v5', name: 'Priya Sharma' },
];

// List of standard department strings used during initial complaint registration
const DEPARTMENTS = [
    "Municipal sanitation and public health",
    "Roads and street infrastructure",
    "Street lighting and electrical assets",
    "Water, sewerage, and stormwater",
    "Ward/zone office and central admin"
];
// ------------------------------------------------------------------

// --- Assign/Reassign Button Component ---
const AssignButton = ({ issue, volunteers, onAssign }) => {
    const [isReassigning, setIsReassigning] = useState(false);
    const [selectedVolunteer, setSelectedVolunteer] = useState(issue.assignedTo);
    const [isSaving, setIsSaving] = useState(false);

    // Sync local state with props (important when parent fetches new data)
    useEffect(() => {
        setSelectedVolunteer(issue.assignedTo);
    }, [issue.assignedTo]);

    // Check if the current assignedTo value is a name from the volunteer list
    const isAssigned = volunteers.some(v => v.name === issue.assignedTo);
    const isSameVolunteer = selectedVolunteer === issue.assignedTo;

    const handleAssignment = async () => {
        if (!selectedVolunteer || selectedVolunteer === 'Unassigned' || isSameVolunteer) {
            setIsReassigning(false);
            return;
        }
        
        setIsSaving(true);

        try {
            // API Call to Assign Issue
            await axios.put(`${API_BASE_URL}/complaints/assign/${issue.id}`, 
                { assignedTo: selectedVolunteer }, // Sends the volunteer's name
                { withCredentials: true }
            );

            // Successful Update (update parent state)
            onAssign(issue.id, selectedVolunteer);

            setIsReassigning(false);
            alert(`Issue ${issue.id} successfully assigned to ${selectedVolunteer}.`);

        } catch (error) {
            console.error("Assignment failed:", error.response?.data || error.message);
            alert(`Failed to assign issue: ${error.response?.data?.message || 'Server error.'}`);
            
            // ROLLBACK local select state
            setSelectedVolunteer(issue.assignedTo); 
        } finally {
            setIsSaving(false);
        }
    };

    if (isReassigning) {
        return (
            <div className="reassign-control-inline">
                <select 
                    value={selectedVolunteer} 
                    onChange={(e) => setSelectedVolunteer(e.target.value)}
                    className="volunteer-select-admin"
                    disabled={isSaving}
                >
                    <option value="Unassigned">Select Volunteer</option>
                    {volunteers.map(v => (
                        <option key={v.id} value={v.name}>{v.name}</option>
                    ))}
                </select>
                <div className="reassign-actions-group">
                    <button 
                        className="action-btn assign-confirm-btn"
                        onClick={handleAssignment}
                        disabled={isSaving || !selectedVolunteer || selectedVolunteer === 'Unassigned' || isSameVolunteer}
                    >
                        {isSaving ? 'Saving...' : <><UserCheck size={14} /> Assign</>}
                    </button>
                    <button 
                        className="action-btn assign-cancel-btn"
                        onClick={() => { 
                            setIsReassigning(false); 
                            setSelectedVolunteer(issue.assignedTo); // Reset selection
                        }}
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="assigned-display">
            <span className="assigned-name-display">{isAssigned ? issue.assignedTo : 'Unassigned'}</span>
            <button 
                className={`reassign-btn ${isAssigned ? 'reassign' : 'assign'}`}
                onClick={() => setIsReassigning(true)}
            >
                {isAssigned ? <UserX size={14} /> : <UserIcon size={14} />}
                {isAssigned ? 'Reassign' : 'Assign'}
            </button>
        </div>
    );
};
// ------------------------------------------------------------------

const AllIssuesAdmin = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    
    // --- State for Live Data ---
    const [allIssues, setAllIssues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [authChecked, setAuthChecked] = useState(false); 
    // ----------------------------

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

    const mapStatus = (serverStatus) => {
        switch (serverStatus) {
            case 'recived': return 'Pending';
            case 'inReview': return 'In Progress';
            case 'resolved': return 'Resolved';
            default: return 'Pending';
        }
    };
    
    // --- API Fetch Function ---
    const fetchIssues = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_BASE_URL}/complaints/all`, {
                withCredentials: true
            });
            
            const mappedIssues = response.data.data.map(comp => {
                const statusText = mapStatus(comp.status);
                const mockPriority = ['high', 'medium', 'low'][Math.floor(Math.random() * 3)];
                
                let assignedToName = comp.assignedTo; 
                
                // 💡 FIX 1: Check if assignedTo is a department string. 
                // If it is, treat it as 'Unassigned' for the volunteer logic.
                if (DEPARTMENTS.includes(assignedToName)) {
                    assignedToName = 'Unassigned';
                }

                const mockReportedBy = comp.userId?.name || 'Anonymous User'; 

                return {
                    id: comp._id,
                    title: comp.title,
                    status: statusText.toLowerCase().replace(' ', ''), 
                    priority: mockPriority, 
                    assignedTo: assignedToName, 
                    reportedBy: mockReportedBy,
                    date: new Date(comp.createdAt).toLocaleDateString('en-US'),
                };
            });

            setAllIssues(mappedIssues);
        } catch (err) {
            console.error("Failed to fetch issues:", err.response?.data || err.message);
            setError('Failed to fetch issues data.');
        } finally {
            setLoading(false);
        }
    }, []); 

    // --- Auth Check and Data Fetch Effects (Unchanged) ---
    useEffect(() => {
        const checkAuth = setTimeout(() => {
            setAuthChecked(true);
        }, 50); 
        return () => clearTimeout(checkAuth);
    }, []);

    useEffect(() => {
        if (!authChecked) {
            return;
        }
        if (user) {
            fetchIssues();
        } else {
            navigate('/login');
        }
    }, [user, navigate, fetchIssues, authChecked]);


    // --- Data Aggregation and Filtering (Unchanged) ---
    const filteredIssues = useMemo(() => {
        if (!searchTerm) {
            return allIssues;
        }
        const lowerSearchTerm = searchTerm.toLowerCase();
        return allIssues.filter(issue => 
            issue.title.toLowerCase().includes(lowerSearchTerm) ||
            issue.reportedBy.toLowerCase().includes(lowerSearchTerm) ||
            issue.assignedTo.toLowerCase().includes(lowerSearchTerm) ||
            issue.status.toLowerCase().includes(lowerSearchTerm)
        );
    }, [allIssues, searchTerm]);

    const dynamicStats = useMemo(() => {
        const total = allIssues.length;
        const inProgress = allIssues.filter(i => i.status === 'in progress').length;
        const resolved = allIssues.filter(i => i.status === 'resolved').length;
        const pending = allIssues.filter(i => i.status === 'pending').length;

        return [
            { label: 'Total Issues', value: total, icon: BarChart3, color: '#e5e7eb' },
            { label: 'In Progress', value: inProgress, icon: Clock, color: '#dbeafe' },
            { label: 'Resolved', value: resolved, icon: CheckCircle, color: '#dcfce7' },
            { label: 'Pending', value: pending, icon: AlertCircle, color: '#ffedd5' }
        ];
    }, [allIssues]);


    // --- Assignment Logic (Updates local state, ensuring persistence on next fetch) ---
    const handleAssignIssue = (issueId, newVolunteerName) => {
        // Updates the list locally to reflect the assigned name
        setAllIssues(prevIssues => prevIssues.map(issue => 
            issue.id === issueId ? { ...issue, assignedTo: newVolunteerName } : issue
        ));
    };
    
    const handleViewDetails = (issueId) => {
        navigate(`/admin/issue/${issueId}`);
    };
    // ----------------------------


    if (!user && !authChecked) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>Loading user session...</p>
            </div>
        );
    }
    
    if (!user) {
        return null;
    }

    return (
        <div className="all-issues-admin">
            {/* Header (unchanged) */}
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
                        <Link to="/admin-all-issues" className="admin-nav-link active">
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

            <div className="issues-hero">
                <div className="issues-hero-content">
                    <BarChart3 size={36} />
                    <h1>All Issues Management</h1>
                    <p>Comprehensive oversight and management of all reported issues across the platform</p>
                </div>
            </div>

            <div className="issues-stats-grid">
                {dynamicStats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="issues-stat-card">
                            <div className="issues-stat-content">
                                <div className="issues-stat-info">
                                    <div className="issues-stat-label">{stat.label}</div>
                                    <div className="issues-stat-value">{stat.value}</div>
                                </div>
                                <div className="issues-stat-icon" style={{ backgroundColor: stat.color }}>
                                    <Icon size={24} color="#6b7280" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="issues-table-section">
                <div className="issues-table-header">
                    <div className="issues-table-title">
                        <AlertCircle size={20} />
                        <h2>Issues Overview</h2>
                    </div>
                    <p className="issues-table-subtitle">Complete list of all reported issues with management actions</p>
                </div>

                <div className="table-actions">
                    <div className="search-box">
                        <Search size={18} />
                        <input 
                            type="text" 
                            placeholder="Search issues..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* Export button removed */}
                </div>

                <div className="issues-table-container">
                    {loading ? (
                         <div className="loading-state-admin">
                            <div className="loading-spinner"></div>
                            <p>Loading issues from database...</p>
                        </div>
                    ) : error ? (
                        <div className="error-state-admin">
                            <AlertCircle size={24} color="#ef4444" />
                            <p>{error}</p>
                        </div>
                    ) : filteredIssues.length === 0 ? (
                        <div className="empty-state-admin">
                            <Search size={24} color="#9ca3af" />
                            <p>No issues found matching your search criteria.</p>
                        </div>
                    ) : (
                        <table className="issues-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Priority</th>
                                    <th>Assigned To</th>
                                    <th>Reported By</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredIssues.map((issue) => (
                                    <tr key={issue.id}>
                                        <td className="issue-title-cell">{issue.title}</td>
                                        <td>
                                            <span className={`status-badge status-${issue.status}`}>
                                                {issue.status}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`priority-badge priority-${issue.priority}`}>
                                                {issue.priority}
                                            </span>
                                        </td>
                                        
                                        <td className="assigned-cell-combined">
                                            <AssignButton 
                                                issue={issue}
                                                volunteers={MOCK_VOLUNTEERS}
                                                onAssign={handleAssignIssue}
                                            />
                                        </td>
                                        
                                        <td>{issue.reportedBy}</td>
                                        <td>{issue.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllIssuesAdmin;
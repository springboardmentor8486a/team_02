import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Search, MapPin, Calendar, User, MessageCircle, ThumbsUp, Eye, Filter, Heart, X, Send, Home, LogOut } from 'lucide-react';
import './VolunteerBrowserIssues.css';

const VolunteerBrowseIssues = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [issues, setIssues] = useState([]);
    const [filteredIssues, setFilteredIssues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedStatus, setSelectedStatus] = useState('All Statuses');
    const [sortBy, setSortBy] = useState('Newest First');
    
    // Interactive features states
    const [likedIssues, setLikedIssues] = useState(new Set());
    const [votedIssues, setVotedIssues] = useState(new Set());
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [selectedIssueForComments, setSelectedIssueForComments] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [issueComments, setIssueComments] = useState({});

    const userType = location.state?.userType || (user?.role === 'volunteer' ? 'volunteer' : 'user');
    const isVolunteer = userType === 'volunteer';

    const mockIssues = [
        {
            id: 1,
            title: 'Large pothole causing traffic hazard',
            description: 'Deep pothole on Main Street that\'s getting worse with recent rain. Multiple cars have been damaged.',
            location: 'Main St & 5th Ave, Downtown',
            category: 'Potholes',
            status: 'pending',
            votes: 6,
            comments: 2,
            views: 48,
            likes: 18,
            createdAt: '2024-01-15T10:30:00Z',
            user: 'Sarah Johnson',
            priority: 'high',
            image: '/images/issue1.png'
        },
        {
            id: 2,
            title: 'Overflowing garbage bins attracting pests',
            description: 'The bins haven\'t been emptied in over a week and are attracting rats and flies.',
            location: 'Central Park entrance',
            category: 'Garbage & Waste',
            status: 'inprogress',
            votes: 3,
            comments: 2,
            views: 75,
            likes: 15,
            createdAt: '2024-01-14T14:20:00Z',
            user: 'Mike Chen',
            priority: 'medium',
            image: '/images/issue2.png'
        },
        {
            id: 3,
            title: 'Broken street light creating safety risk',
            description: 'Street light has been out for two weeks, making the area very dark at night.',
            location: 'Oak Avenue and Elm Street',
            category: 'Street Lights',
            status: 'resolved',
            votes: 4,
            comments: 1,
            views: 90,
            likes: 28,
            createdAt: '2024-01-13T18:45:00Z',
            user: 'Jane Beckman',
            priority: 'high',
            image: '/images/issue3.png'
        },
        {
            id: 4,
            title: 'Water main leak flooding sidewalk',
            description: 'Water from underground pipe causing flooding and potential foundation damage.',
            location: '15th Street & 3rd Avenue',
            category: 'Water Issues',
            status: 'urgent',
            votes: 3,
            comments: 1,
            views: 120,
            likes: 40,
            createdAt: '2024-01-12T09:15:00Z',
            user: 'David Thompson',
            priority: 'high',
            image: '/images/issue4.png'
        }
    ];

    // Mock comments data
    const mockCommentsData = {
        1: [
            { id: 1, user: 'John Doe', text: 'This has been a problem for months!', time: '2 hours ago' },
            { id: 2, user: 'Jane Smith', text: 'I almost damaged my car here yesterday', time: '1 hour ago' }
        ],
        2: [
            { id: 3, user: 'Mike Wilson', text: 'This needs urgent attention', time: '3 hours ago' },
            { id: 4, user: 'Sarah Lee', text: 'Health hazard for sure', time: '30 mins ago' }
        ],
        3: [
            { id: 5, user: 'Tom Brown', text: 'Finally getting fixed!', time: '1 day ago' }
        ],
        4: [
            { id: 6, user: 'Emma Davis', text: 'Water is still leaking as of this morning', time: '4 hours ago' }
        ]
    };

    const categories = ['All Categories', 'Potholes', 'Garbage & Waste', 'Street Lights', 'Water Issues', 'Vandalism', 'Other'];
    const statuses = ['All Statuses', 'Pending', 'In Progress', 'Resolved', 'Urgent'];

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            setLoading(true);
            setTimeout(() => {
                setIssues(mockIssues);
                setFilteredIssues(mockIssues);
                setIssueComments(mockCommentsData);
                setLoading(false);
            }, 1000);
        }
    }, [user, navigate]);

    useEffect(() => {
        filterAndSortIssues();
    }, [searchTerm, selectedCategory, selectedStatus, sortBy, issues]);

    const filterAndSortIssues = () => {
        let filtered = [...issues];

        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(issue =>
                issue.title.toLowerCase().includes(searchLower) ||
                issue.description.toLowerCase().includes(searchLower) ||
                issue.location.toLowerCase().includes(searchLower)
            );
        }

        if (selectedCategory !== 'All Categories') {
            filtered = filtered.filter(issue => issue.category === selectedCategory);
        }

        if (selectedStatus !== 'All Statuses') {
            const statusLower = selectedStatus.toLowerCase().replace(' ', '');
            filtered = filtered.filter(issue => issue.status === statusLower);
        }

        switch (sortBy) {
            case 'Oldest First':
                filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'Most Voted':
                filtered.sort((a, b) => b.votes - a.votes);
                break;
            case 'Most Viewed':
                filtered.sort((a, b) => b.views - a.views);
                break;
            default:
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        setFilteredIssues(filtered);
    };

    const handleLike = (issueId) => {
        setLikedIssues(prev => {
            const newSet = new Set(prev);
            if (newSet.has(issueId)) {
                newSet.delete(issueId);
                setIssues(prevIssues => prevIssues.map(issue => 
                    issue.id === issueId ? { ...issue, likes: issue.likes - 1 } : issue
                ));
            } else {
                newSet.add(issueId);
                setIssues(prevIssues => prevIssues.map(issue => 
                    issue.id === issueId ? { ...issue, likes: issue.likes + 1 } : issue
                ));
            }
            return newSet;
        });
    };

    const handleVote = (issueId) => {
        setVotedIssues(prev => {
            const newSet = new Set(prev);
            if (newSet.has(issueId)) {
                newSet.delete(issueId);
                setIssues(prevIssues => prevIssues.map(issue => 
                    issue.id === issueId ? { ...issue, votes: issue.votes - 1 } : issue
                ));
            } else {
                newSet.add(issueId);
                setIssues(prevIssues => prevIssues.map(issue => 
                    issue.id === issueId ? { ...issue, votes: issue.votes + 1 } : issue
                ));
            }
            return newSet;
        });
    };

    const handleOpenComments = (issue) => {
        setSelectedIssueForComments(issue);
        setShowCommentsModal(true);
        setNewComment('');
    };

    const handleCloseComments = () => {
        setShowCommentsModal(false);
        setSelectedIssueForComments(null);
        setNewComment('');
    };

    const handlePostComment = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            const comment = {
                id: Date.now(),
                user: user?.name || 'Anonymous',
                text: newComment,
                time: 'Just now'
            };
            
            setIssueComments(prev => ({
                ...prev,
                [selectedIssueForComments.id]: [
                    ...(prev[selectedIssueForComments.id] || []),
                    comment
                ]
            }));

            setIssues(prevIssues => prevIssues.map(issue => 
                issue.id === selectedIssueForComments.id 
                    ? { ...issue, comments: issue.comments + 1 } 
                    : issue
            ));

            setNewComment('');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'status-pending';
            case 'inprogress': return 'status-progress';
            case 'resolved': return 'status-resolved';
            case 'urgent': return 'status-urgent';
            default: return 'status-pending';
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

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    const handleNavigateDashboard = () => {
        if (isVolunteer) {
            navigate('/volunteer', { state: { userType: 'volunteer' } });
        } else {
            navigate('/volunteer');
        }
    };

    const handleNavigateMyIssues = () => {
        navigate('/MyAssignedIssues', { state: { userType: 'volunteer' } });
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            axios.post('http://localhost:3000/api/v1/users/logout', {}, { withCredentials: true })
                .catch(() => {})
                .finally(() => {
                    signOut();
                    navigate('/');
                });
        }
    };

    const getUserInitials = (name) => {
        if (!name) return 'U';
        const nameParts = name.split(' ');
        return nameParts.map(part => part[0]).join('').toUpperCase();
    };

    if (!user) return null;

    return (
        <div className="volunteer-browse-container">
            {/* Header */}
            <header className="volunteer-header">
                <div className="header-content">
                    <div className="header-left">
                        <div className="logo-section">
                            <img src="/images/logo.png" alt="Clean Street" className="logo-image" />
                            <div>
                                <div className="logo-text">Clean Street</div>
                                <div className="logo-subtitle">Civic Platform</div>
                            </div>
                        </div>
                        <nav className="nav-tabs">
                            <button className="nav-tab" onClick={handleNavigateDashboard}>
                                Dashboard
                            </button>
                            <button className="nav-tab active">
                                Browse Issues
                            </button>
                            <button className="nav-tab" onClick={handleNavigateMyIssues}>
                                My Assigned Issues
                            </button>
                        </nav>
                    </div>
                    <div className="header-right">
                        {/* Home Button */}
                        <button 
                            className="icon-btn" 
                            onClick={() => navigate('/')}
                            title="Home"
                        >
                            <Home size={20} />
                        </button>

                        {/* Profile Button - Clickable */}
                        <div 
                            className="user-info clickable-profile" 
                            onClick={() => navigate('/volunteer-profile')}
                            title="View Profile"
                        >
                            <div className="user-avatar">{getUserInitials(user.name)}</div>
                            <span className="user-name">{user.name}</span>
                        </div>

                        {/* Logout Button */}
                        <button 
                            className="icon-btn logout-btn" 
                            onClick={handleLogout}
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-content">
                    <h1>Community Issues Browser</h1>
                    <p>Browse, vote, and engage with issues reported by community members. Your voice matters!</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Filter Bar */}
                <div className="filter-bar">
                    <div className="filter-section">
                        <Filter size={18} />
                        <div>
                            <div className="filter-title">Filter & Search Issues</div>
                            <p className="filter-subtitle">Find specific issues and engage with your community</p>
                        </div>
                    </div>
                    <div className="view-toggle">
                        <button className="toggle-btn active">
                            <span>☰</span>
                        </button>
                        <button className="toggle-btn">
                            <span>◉</span>
                        </button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="search-filter-container">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search issues..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="filter-select"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <select 
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="filter-select"
                    >
                        {statuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="filter-select"
                    >
                        <option value="Newest First">Newest First</option>
                        <option value="Oldest First">Oldest First</option>
                        <option value="Most Voted">Most Voted</option>
                        <option value="Most Viewed">Most Viewed</option>
                    </select>
                </div>

                {/* Results Header */}
                <div className="results-header">
                    <div className="results-badge">
                        <span className="badge-icon">📋</span>
                        <span className="badge-text">{filteredIssues.length} issues found</span>
                    </div>
                    <span className="results-count">Showing list view</span>
                    <div className="engagement-tag">
                        <span className="pulse-dot"></span>
                        Community engagement: High
                    </div>
                </div>

                {/* Issues List */}
                <div className="issues-list">
                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Loading issues...</p>
                        </div>
                    ) : filteredIssues.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📭</div>
                            <h3>No issues found</h3>
                        </div>
                    ) : (
                        filteredIssues.map(issue => (
                            <div key={issue.id} className="issue-item">
                                <div className="issue-image">
                                    <img src={issue.image} alt={issue.title} />
                                </div>
                                <div className="issue-content">
                                    <div className="issue-header">
                                        <h3 className="issue-title">{issue.title}</h3>
                                        <div className="issue-badges">
                                            <span className={`priority-badge ${getPriorityColor(issue.priority)}`}>
                                                {issue.priority}
                                            </span>
                                            <span className={`status-badge ${getStatusColor(issue.status)}`}>
                                                {issue.status}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="issue-description">{issue.description}</p>
                                    <div className="issue-meta">
                                        <div className="meta-item">
                                            <MapPin size={14} />
                                            <span>{issue.location}</span>
                                        </div>
                                        <div className="meta-item">
                                            <Calendar size={14} />
                                            <span>{getTimeAgo(issue.createdAt)}</span>
                                        </div>
                                    </div>
                                    <div className="issue-footer">
                                        <div className="issue-category">{issue.category}</div>
                                        <div className="issue-stats">
                                            <button 
                                                className={`stat-btn ${likedIssues.has(issue.id) ? 'active' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleLike(issue.id);
                                                }}
                                                title="Like this issue"
                                            >
                                                <Heart size={14} fill={likedIssues.has(issue.id) ? 'currentColor' : 'none'} />
                                                <span>{issue.likes}</span>
                                            </button>
                                            <button 
                                                className={`stat-btn ${votedIssues.has(issue.id) ? 'active' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleVote(issue.id);
                                                }}
                                                title="Vote for this issue"
                                            >
                                                <ThumbsUp size={14} fill={votedIssues.has(issue.id) ? 'currentColor' : 'none'} />
                                                <span>{issue.votes}</span>
                                            </button>
                                            <button 
                                                className="stat-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenComments(issue);
                                                }}
                                                title="View comments"
                                            >
                                                <MessageCircle size={14} />
                                                <span>{issue.comments}</span>
                                            </button>
                                            <div className="stat-item">
                                                <Eye size={14} />
                                                <span>{issue.views}</span>
                                            </div>
                                        </div>
                                        <div className="reported-by">
                                            <User size={14} />
                                            <span>Reported by {issue.user}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Comments Modal */}
            {showCommentsModal && selectedIssueForComments && (
                <div className="modal-overlay" onClick={handleCloseComments}>
                    <div className="comments-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="comments-modal-header">
                            <h3>Comments: {selectedIssueForComments.title}</h3>
                            <button className="modal-close-btn" onClick={handleCloseComments}>
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="comments-list">
                            {issueComments[selectedIssueForComments.id]?.length > 0 ? (
                                issueComments[selectedIssueForComments.id].map(comment => (
                                    <div key={comment.id} className="comment-item">
                                        <div className="comment-avatar">
                                            <User size={16} />
                                        </div>
                                        <div className="comment-content">
                                            <div className="comment-header">
                                                <span className="comment-user">{comment.user}</span>
                                                <span className="comment-time">{comment.time}</span>
                                            </div>
                                            <p className="comment-text">{comment.text}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-comments">No comments yet. Be the first to comment!</p>
                            )}
                        </div>

                        <form className="comment-form" onSubmit={handlePostComment}>
                            <textarea
                                className="comment-input"
                                placeholder="Share your thoughts about this issue..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                rows="3"
                            />
                            <button type="submit" className="comment-submit-btn" disabled={!newComment.trim()}>
                                <Send size={18} />
                                Post Comment
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VolunteerBrowseIssues;
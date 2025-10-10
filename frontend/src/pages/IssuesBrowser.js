import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Search, Filter, MapPin, ArrowRight, BarChart3, Users, FileText, PlusCircle, Heart, MessageSquare, Eye, Clock } from 'lucide-react';
import './IssuesBrowser.css'; 

const API_BASE_URL = 'http://localhost:3000/api/v1'; // Define API URL

// --- 💡 CORRECTED TIME UTILITY FUNCTION ---
const getRelativeTime = (isoDateString) => {
    const reportDate = new Date(isoDateString);
    const today = new Date();
    
    // Normalize today's date to midnight for comparison
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    // Normalize report date to midnight for comparison
    const startOfReportDay = new Date(reportDate.getFullYear(), reportDate.getMonth(), reportDate.getDate());

    // Calculate the difference in milliseconds
    const diffTime = startOfToday.getTime() - startOfReportDay.getTime();
    // Convert milliseconds to days (1000ms * 60s * 60min * 24hr)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Now, diffDays represents the number of calendar days passed.

    if (diffDays === 0) {
        // If it's the same calendar day, check hours for more precision
        const hoursDiff = Math.floor((today.getTime() - reportDate.getTime()) / (1000 * 60 * 60));
        if (hoursDiff === 0) return 'Just now';
        if (hoursDiff < 24) return `${hoursDiff} hours ago`;
        // Should not happen if diffDays is 0, but as a fallback:
        return 'Today'; 
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
};


const UserBrowseIssue = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const [authChecked, setAuthChecked] = useState(false); 
    const [issues, setIssues] = useState([]);
    const [filteredIssues, setFilteredIssues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        category: 'All Categories',
        status: 'All Statuses',
        sort: 'Newest First'
    });
    const [userVotes, setUserVotes] = useState({}); 

    const categories = useMemo(() => [
        'All Categories', 'Garbage & Waste', 'Potholes', 'Water Issues', 'Street Lights', 'Vandalism', 'Other'
    ], []);

    const statusOptions = useMemo(() => [
        'All Statuses', 'Pending', 'In Progress', 'Resolved'
    ], []);

    const sortOptions = useMemo(() => [
        'Newest First', 'Oldest First', 'Most Voted', 'Most Viewed', 'Priority'
    ], []);

    const issueCategories = useMemo(() => [
        { category: 'Garbage & Waste', count: 0, icon: '🗑️', color: '#E53E3E' },
        { category: 'Potholes', count: 0, icon: '🕳️', color: '#DD6B20' },
        { category: 'Water Issues', count: 0, icon: '💧', color: '#3182CE' },
        { category: 'Street Lights', count: 0, icon: '💡', color: '#D69E2E' },
        { category: 'Vandalism', count: 0, icon: '🎨', color: '#805AD5' },
        { category: 'Other', count: 0, icon: '📋', color: '#718096' },
    ], []);
    
    const communityImpact = {
        issuesResolved: '89+',
        responseTime: '2.3 days avg',
        communityScore: '95%',
        activeUsers: '1.2k',
        totalReports: '2.8k'
    };
    

    // --- API Fetch Function ---
    const fetchIssues = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        
        const params = {
            search: searchTerm.trim(),
            category: filters.category,
            status: filters.status,
            sort: filters.sort,
        };
        
        try {
            const response = await axios.get(`${API_BASE_URL}/complaints/all`, {
                params: params,
                withCredentials: true
            });
            
            const fetchedIssues = response.data.data.map(comp => {
                const statusText = comp.status === 'recived' ? 'Pending' : comp.status === 'inReview' ? 'In Progress' : comp.status === 'resolved' ? 'Resolved' : 'Pending';
                const locationText = comp.address?.[0] || 'Unknown Location';
                const userName = comp.userId?.name || 'Anonymous User';
                const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
                
                const reverseCategoryMap = {
                    'Municipal sanitation and public health': 'Garbage & Waste',
                    'Roads and street infrastructure': 'Potholes',
                    'Street lighting and electrical assets': 'Street Lights',
                    'Water, sewerage, and stormwater': 'Water Issues',
                    'Ward/zone office and central admin': 'Vandalism'
                };
                const displayCategory = reverseCategoryMap[comp.assignedTo] || 'Other';
                
                // We no longer calculate daysAgo here, we pass the raw date string 
                // for the more accurate calendar-day calculation in getRelativeTime.
                
                // Mocking UX data that is not in the backend yet
                const mockVotes = Math.floor(Math.random() * 30);
                const mockViews = Math.floor(Math.random() * 200);
                const mockPriority = ['high', 'medium', 'low'][Math.floor(Math.random() * 3)];

                return {
                    id: comp._id,
                    title: comp.title,
                    description: comp.description,
                    location: locationText,
                    category: displayCategory,
                    status: statusText,
                    createdAt: comp.createdAt, // Pass the ISO date string
                    
                    votes: mockVotes, 
                    comments: comp.comments.length || 0, 
                    views: mockViews,
                    priority: mockPriority,
                    urgency: 'Community Concern',
                    
                    user: userName,
                    userAvatar: userInitials,
                };
            });

            setIssues(fetchedIssues);
            setFilteredIssues(fetchedIssues);
            
            const initialUserVotes = {};
            fetchedIssues.forEach(issue => {
                if (Math.random() > 0.8) { 
                    initialUserVotes[issue.id] = 'voted';
                }
            });
            setUserVotes(initialUserVotes);

        } catch (error) {
            console.error("Failed to fetch issues:", error.response?.data || error.message);
            setIssues([]);
            setFilteredIssues([]);
        } finally {
            setLoading(false);
        }
    }, [user, searchTerm, filters]); 

    // --- Auth Check Effect ---
    useEffect(() => {
        // Simulate a check if your AuthContext doesn't provide an isLoading state
        const checkAuthStatus = async () => {
             await new Promise(resolve => setTimeout(resolve, 50)); 
             setAuthChecked(true); 
        };
        checkAuthStatus();
    }, []); 

    // --- Main Fetch/Redirect Effect ---
    useEffect(() => {
        if (!authChecked) {
            return;
        }

        if (!user) {
            navigate('/login');
        } else {
            fetchIssues();
        }
    }, [user, navigate, fetchIssues, authChecked]);
    
// --- VOTE Handler (Integrated with Backend) ---
const handleVote = async (issueId) => {
    const isCurrentlyVoted = userVotes[issueId] === 'voted';
    const endpoint = `${API_BASE_URL}/votes/${issueId}?category=upvote`;
    
    let newVoteStatus;
    let voteChange;
    let originalVotes;

    try {
        const issueToUpdate = issues.find(i => i.id === issueId);
        if (!issueToUpdate) throw new Error("Issue not found for voting.");
        originalVotes = issueToUpdate.votes;
        
        if (!isCurrentlyVoted) {
            // Optimistic update
            newVoteStatus = 'voted';
            voteChange = 1;
            
            await axios.post(endpoint, {}, { withCredentials: true });
        } else {
            // Optimistic update
            newVoteStatus = null;
            voteChange = -1;
            
            await axios.delete(`${API_BASE_URL}/votes/${issueId}`, { withCredentials: true });
        }

        // Apply Optimistic Update to state
        setUserVotes(prev => ({ 
            ...prev, 
            [issueId]: newVoteStatus 
        }));
        
        const updatedIssues = issues.map(issue => {
            if (issue.id === issueId) {
                return {
                    ...issue,
                    votes: issue.votes + voteChange, 
                };
            }
            return issue;
        });
        
        setIssues(updatedIssues);
        setFilteredIssues(updatedIssues.filter(i => filteredIssues.map(f => f.id).includes(i.id)));

    } catch (error) {
        console.error("Vote action failed:", error.response?.data || error.message);
        // Rollback optimistic update 
        setUserVotes(prev => ({ 
            ...prev, 
            [issueId]: isCurrentlyVoted ? 'voted' : null 
        }));
        
        // Also rollback the vote count locally if we successfully found the original issue
        if (originalVotes !== undefined) {
             setIssues(issues.map(i => i.id === issueId ? {...i, votes: originalVotes} : i));
             setFilteredIssues(filteredIssues.map(i => i.id === issueId ? {...i, votes: originalVotes} : i));
        }

        alert(`Vote action failed: ${error.response?.data?.message || 'Check network/server logic.'}`);
    }
};
    
    // --- Other Handlers ---
    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    
    const handleLogout = () => {
        axios.post(`${API_BASE_URL}/users/logout`, {}, { withCredentials: true })
            .catch(() => {})
            .finally(() => {
                signOut();
                navigate('/');
            });
    };

    const getUserInitials = (name) => {
        if (!name) return 'JD';
        const nameParts = name.split(' ');
        const initials = nameParts.map(part => part[0]).join('');
        return initials.toUpperCase();
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilters({
            category: 'All Categories',
            status: 'All Statuses',
            sort: 'Newest First'
        });
    };

    if (!authChecked) {
        return (
            <div className="loading-state full-page-loading">
                <div className="loading-spinner"></div>
                <p>Checking authentication status...</p>
            </div>
        );
    }
    
    if (!user) {
        return null;
    }

    return (
        <>
            {/* Dashboard-style Navigation Bar */}
            <header className="header-top">
                <div className="logo-section">
                    <img src="/images/logo.png" alt="Clean Street Logo" className="logo-image" />
                    <div className="logo-text">Clean Street</div>
                </div>
                <nav className="nav-links">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/browse-issues" className="active">Browse Issues</Link>
                    <Link to="/report-issue">Report Issue</Link>
                </nav>
                <div className="user-profile">
                    <Link to="/profile" className="profile-link">
                        <div className="user-initials">{getUserInitials(user.name)}</div>
                        <span className="user-name">{user.name}</span>
                    </Link>
                    <button onClick={handleLogout} className="logout-btn-header">
                        <ArrowRight size={20} />
                    </button>
                </div>
            </header>

            <div className="dashboard-container">
                {/* Enhanced Hero Section */}
                <div className="dashboard-hero">
                    <div className="hero-background"></div>
                    <div className="hero-content-wrapper">
                        <div className="hero-badge">Community Platform</div>
                        <h1>Discover & Support Local Issues</h1>
                        <p>Join thousands of community members in identifying, voting, and resolving neighborhood concerns. Together we build better communities.</p>
                        <div className="hero-stats">
                            <div className="hero-stat">
                                <strong>{communityImpact.totalReports}</strong>
                                <span>Issues Reported</span>
                            </div>
                            <div className="hero-stat">
                                <strong>{communityImpact.issuesResolved}</strong>
                                <span>Issues Resolved</span>
                            </div>
                            <div className="hero-stat">
                                <strong>{communityImpact.activeUsers}</strong>
                                <span>Active Members</span>
                            </div>
                        </div>
                        <div className="hero-buttons">
                            <button className="hero-btn-primary" onClick={() => navigate('/report-issue')}>
                                <PlusCircle size={18} /> 
                                <span>Report New Issue</span>
                            </button>
                            <button className="hero-btn-secondary" onClick={() => navigate('/dashboard')}>
                                <span>View Dashboard</span>
                            </button>
                        </div>
                    </div>
                </div>
                {/* Main Content */}
                <div className="browse-issues-main">
                    <div className="browse-sidebar">
                        {/* Sidebar content */}
                        <div className="sidebar-panel">
                            <div className="panel-header">
                                <BarChart3 size={20} className="panel-icon" />
                                <h4>Issue Categories</h4>
                            </div>
                            <p className="panel-subtitle">Browse by issue type</p>
                            <div className="categories-list">
                                {issueCategories.map((item, index) => (
                                    <div 
                                        key={index} 
                                        className={`category-item ${filters.category === item.category ? 'active' : ''}`}
                                        onClick={() => handleFilterChange('category', item.category)}
                                    >
                                        <div className="category-icon-title">
                                            <span 
                                                className="category-icon"
                                                style={{ backgroundColor: item.color }}
                                            >
                                                {item.icon}
                                            </span>
                                            <span className="category-title">{item.category}</span>
                                        </div>
                                        <span 
                                            className="category-count"
                                            style={{ backgroundColor: item.color }}
                                        >
                                            {issues.filter(i => i.category === item.category).length}
                                        </span>
                                    </div>
                                ))}
                                <div 
                                    className={`category-item ${filters.category === 'All Categories' ? 'active' : ''}`}
                                    onClick={() => handleFilterChange('category', 'All Categories')}
                                >
                                    <div className="category-icon-title">
                                        <span className="category-title">All Categories</span>
                                    </div>
                                    <span className="category-count">{issues.length}</span>
                                </div>
                            </div>
                        </div>

                        <div className="sidebar-panel">
                            <div className="panel-header">
                                <Users size={20} className="panel-icon" />
                                <h4>Community Impact</h4>
                            </div>
                            <div className="impact-stats">
                                <div className="impact-stat-item">
                                    <div className="impact-icon">✅</div>
                                    <div className="impact-content">
                                        <strong>{communityImpact.issuesResolved}</strong>
                                        <span>Issues Resolved</span>
                                    </div>
                                </div>
                                <div className="impact-stat-item">
                                    <div className="impact-icon">⚡</div>
                                    <div className="impact-content">
                                        <strong>{communityImpact.responseTime}</strong>
                                        <span>Avg Response Time</span>
                                    </div>
                                </div>
                                <div className="impact-stat-item">
                                    <div className="impact-icon">⭐</div>
                                    <div className="impact-content">
                                        <strong>{communityImpact.communityScore}</strong>
                                        <span>Community Score</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                    </div>

                    <div className="browse-content">
                        <div className="content-panel filter-panel">
                            {/* Filter controls JSX */}
                            <div className="panel-header-main">
                                <div className="panel-title">
                                    <Filter size={24} className="title-icon" />
                                    <div>
                                        <h3>Filter & Search Issues</h3>
                                        <p>Find and engage with community concerns</p>
                                    </div>
                                </div>
                                {(searchTerm || filters.category !== 'All Categories' || filters.status !== 'All Statuses') && (
                                    <button onClick={clearFilters} className="clear-filters-btn">
                                        <span>Clear All</span>
                                    </button>
                                )}
                            </div>
                            
                            <div className="search-section">
                                <div className="search-bar">
                                    <Search size={20} className="search-icon" />
                                    <input
                                        type="text"
                                        placeholder="Search issues by title, description, location..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="search-input"
                                    />
                                    {searchTerm && (
                                        <button 
                                            className="clear-search-btn"
                                            onClick={() => setSearchTerm('')}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="filter-controls">
                                <div className="filter-group">
                                    <label className="filter-label">
                                        <span className="filter-label-icon">📁</span>
                                        Category
                                    </label>
                                    <select 
                                        value={filters.category}
                                        onChange={(e) => handleFilterChange('category', e.target.value)}
                                        className="filter-select"
                                    >
                                        {categories.map(category => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="filter-group">
                                    <label className="filter-label">
                                        <span className="filter-label-icon">🔄</span>
                                        Status
                                    </label>
                                    <select 
                                        value={filters.status}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                        className="filter-select"
                                    >
                                        {statusOptions.map(status => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="filter-group">
                                    <label className="filter-label">
                                        <span className="filter-label-icon">📊</span>
                                        Sort By
                                    </label>
                                    <select 
                                        value={filters.sort}
                                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                                        className="filter-select"
                                    >
                                        {sortOptions.map(option => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="results-info">
                                <div className="results-count">
                                    <strong>{filteredIssues.length}</strong>
                                    <span>{filteredIssues.length === 1 ? ' issue' : ' issues'} found</span>
                                </div>
                                <div className="community-engagement">
                                    <div className="engagement-badge">
                                        <span className="engagement-dot"></span>
                                        High Community Engagement
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Issues List */}
                        <div className="content-panel issues-panel">
                            <div className="panel-header-main">
                                <div className="panel-title">
                                    <FileText size={24} className="title-icon" />
                                    <div>
                                        <h3>Community Issues</h3>
                                        <p>Recent reports from your neighborhood</p>
                                    </div>
                                </div>
                                <div className="active-filters">
                                    {filters.category !== 'All Categories' && (
                                        <span className="active-filter-tag">Category: {filters.category}</span>
                                    )}
                                    {filters.status !== 'All Statuses' && (
                                        <span className="active-filter-tag">Status: {filters.status}</span>
                                    )}
                                    {filters.sort !== 'Newest First' && (
                                        <span className="active-filter-tag">Sorted by: {filters.sort}</span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="issues-list-container">
                                {loading ? (
                                    <div className="loading-state">
                                        <div className="loading-spinner"></div>
                                        <p>Loading community issues...</p>
                                        <span className="loading-subtitle">Fetching the latest reports from the server</span>
                                    </div>
                                ) : filteredIssues.length === 0 ? (
                                    <div className="empty-state">
                                        <div className="empty-icon">🔍</div>
                                        <h3>No issues found</h3>
                                        <p>We couldn't find any issues matching your search criteria.</p>
                                        <button onClick={clearFilters} className="clear-filters-btn large">
                                            Clear All Filters
                                        </button>
                                    </div>
                                ) : (
                                    <div className="issues-grid">
                                        {filteredIssues.map(issue => (
                                            <div key={issue.id} className="issue-card">
                                                <div className="issue-header">
                                                    <div className="issue-meta-left">
                                                        <div 
                                                            className="issue-category-tag"
                                                            style={{ 
                                                                backgroundColor: issueCategories.find(c => c.category === issue.category)?.color + '20',
                                                                color: issueCategories.find(c => c.category === issue.category)?.color
                                                            }}
                                                        >
                                                            {issue.category}
                                                        </div>
                                                        <div className={`priority-indicator priority-${issue.priority}`}>
                                                            <div className={`priority-dot priority-${issue.priority}`}></div>
                                                            {issue.priority} priority
                                                        </div>
                                                    </div>
                                                    <div className="issue-urgency">
                                                        {issue.urgency}
                                                    </div>
                                                </div>
                                                
                                                <h4 className="issue-title">{issue.title}</h4>
                                                <p className="issue-description">{issue.description}</p>
                                                
                                                <div className="issue-meta">
                                                    <div className="meta-item">
                                                        <MapPin size={16} />
                                                        <span>{issue.location}</span>
                                                    </div>
                                                    <div className="meta-item">
                                                        <Clock size={16} />
                                                        {/* 💡 Use the new getRelativeTime function */}
                                                        <span>{getRelativeTime(issue.createdAt)}</span>
                                                    </div>
                                                </div>

                                                <div className="issue-footer">
                                                    <div className="user-info">
                                                        <div className="user-avatar-small">
                                                            {issue.userAvatar}
                                                        </div>
                                                        <div className="user-details">
                                                            <span className="user-name">{issue.user}</span>
                                                            {/* 💡 Use the new getRelativeTime function */}
                                                            <span className="report-time">{getRelativeTime(issue.createdAt)}</span>
                                                        </div>
                                                    </div>

                                                    <div className="issue-stats">
                                                        <div className="stat-item">
                                                            <Eye size={14} />
                                                            <span>{issue.views}</span>
                                                        </div>
                                                        <div className="stat-item">
                                                            <MessageSquare size={14} />
                                                            <span>{issue.comments}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="issue-actions">
                                                    <div className="vote-section">
                                                        <button 
                                                            className={`vote-btn upvote ${userVotes[issue.id] === 'voted' ? 'voted' : ''}`}
                                                            onClick={() => handleVote(issue.id)}
                                                            disabled={loading} 
                                                        >
                                                            <Heart size={16} />
                                                            <span>{issue.votes}</span>
                                                        </button>
                                                    </div>
                                                    <div className={`status-badge status-${issue.status.replace(' ', '').toLowerCase()}`}>
                                                        {issue.status}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <div className="footer-logo">
                            <img src="/images/logo.png" alt="Clean Street Logo" className="logo-image" />
                            <div className="logo-text">Clean Street</div>
                        </div>
                        <p className="footer-tagline">Civic Engagement Platform</p>
                        <p>Empowering communities to report, track, and resolve civic issues through collaborative engagement between citizens and local authorities.</p>
                    </div>
                    <div className="footer-section">
                        <h4>Platform</h4>
                        <ul>
                            <li><a href="#">How it Works</a></li>
                            <li><a href="#">Features</a></li>
                            <li><a href="#">Mobile App</a></li>
                            <li><a href="#">Success Stories</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Support</h4>
                        <ul>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Contact Us</a></li>
                            <li><a href="#">Community Guidelines</a></li>
                            <li><a href="#">FAQ</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Community</h4>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Events</a></li>
                            <li><a href="#">Partners</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 Clean Street. All rights reserved. Making neighborhoods better, one issue at a time.</p>
                </div>
            </footer>
        </>
    );
};

export default UserBrowseIssue;
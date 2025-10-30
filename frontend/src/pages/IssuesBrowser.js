import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Search, Filter, MapPin, ArrowRight, BarChart3, Users, FileText, PlusCircle, Heart, MessageSquare, Eye, Clock, ChevronsDown, ThumbsDown, Edit, Save, Trash2 } from 'lucide-react';

// NOTE: Changed imports to match usage in the return block for stability, assuming
// AppHeader and AppFooter are correct components. If you meant VolunteerHeader/Footer,
// you should adjust the import statements above this block.
import VolunteerHeader from '../components/VolunteerHeader.jsx'; 
import VolunteerFooter from '../components/VolunteerFooter.jsx';

// Assuming you have a CSS file for styling:
import './IssuesBrowser.css'; 

// --- Time utility mocks ---
const getRelativeTime = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return past.toLocaleDateString();
};

const getUserInitials = (name) => {
    if (!name) return '??';
    const parts = name.split(' ').filter(p => p.length > 0);
    if (parts.length === 0) return '??';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const API_BASE_URL = 'http://localhost:3000/api/v1'; // Define API URL

const UserBrowseIssue = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    // --- State Declarations ---
    const [authChecked, setAuthChecked] = useState(false);
    // issues: Holds the unfiltered/unsorted data from the last successful API call
    const [issues, setIssues] = useState([]); 
    // filteredIssues: Holds the final list to display after local filtering/sorting
    const [filteredIssues, setFilteredIssues] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        category: 'All Categories',
        status: 'All Statuses',
        sort: 'Newest First'
    });
    const [userVotes, setUserVotes] = useState({});
    const [commentsOpen, setCommentsOpen] = useState({});
    const [commentsStore, setCommentsStore] = useState({});
    const [commentDrafts, setCommentDrafts] = useState({});
    const [busyComments, setBusyComments] = useState({});
    const [busyVotes, setBusyVotes] = useState({});
    const [editingComment, setEditingComment] = useState(null);

    // --- Memoized Data ---
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

    // --- Fetch Issues (To get ALL issues or issues based on backend filter) ---
    const fetchIssues = useCallback(async () => {
        if (!user) return;
        setLoading(true);

        const categoryMap = {
            'Garbage & Waste': 'Municipal sanitation and public health',
            'Potholes': 'Roads and street infrastructure',
            'Street Lights': 'Street lighting and electrical assets',
            'Water Issues': 'Water, sewerage, and stormwater',
            'Vandalism': 'Ward/zone office and central admin', 
            'Other': 'Other', 
            'All Categories': undefined 
        };

        const statusMap = {
            'Pending': 'recived',
            'In Progress': 'inReview',
            'Resolved': 'resolved',
            'All Statuses': undefined
        };

        // Note: We intentionally only send a minimal parameter set to retrieve all or most data 
        // if the client-side filtering is the primary method. If the backend filtering is strong, 
        // you might pass ALL filters here. For safety, let's keep all filters but rely on the backend 
        // to filter correctly and the useEffect below to sort/refine.
        const params = {
            search: searchTerm.trim(),
            category: filters.category !== 'All Categories' ? categoryMap[filters.category] : undefined,
            status: filters.status !== 'All Statuses' ? statusMap[filters.status] : undefined,
            sort: filters.sort,
        };

        try {
            // Fetch issues from the API
            const response = await axios.get(`${API_BASE_URL}/complaints/all`, {
                // Remove most params if only client-side filtering is desired, or keep them if backend filtering is primary
                params: params, 
                withCredentials: true
            });

            const fetchedIssues = response.data.data.map(comp => {
                const statusText = comp.status === 'recived' ? 'Pending' : comp.status === 'inReview' ? 'In Progress' : comp.status === 'resolved' ? 'Resolved' : 'Pending';
                
                const rawLocation = (comp.address && comp.address[0]) || 'Unknown Location';
                const locationText = rawLocation.length > 30 ? rawLocation.substring(0, 27) + '...' : rawLocation;
                
                const userName = typeof comp.userId === 'object' && comp.userId && comp.userId.name ?
                    comp.userId.name :
                    'Anonymous User';

                const reverseCategoryMap = {
                    'Municipal sanitation and public health': 'Garbage & Waste',
                    'Roads and street infrastructure': 'Potholes',
                    'Street lighting and electrical assets': 'Street Lights',
                    'Water, sewerage, and stormwater': 'Water Issues',
                    'Ward/zone office and central admin': 'Vandalism'
                };
                const displayCategory = reverseCategoryMap[comp.assignedTo] || 'Other';
                
                const commentsCount = comp.comments && Array.isArray(comp.comments) ? comp.comments.length : 0;
                
                const rawDescription = comp.description;
                const descriptionText = rawDescription.length > 150 ? rawDescription.substring(0, 147) + '...' : rawDescription;


                return {
                    id: comp._id,
                    title: comp.title,
                    description: descriptionText,
                    location: locationText,
                    category: displayCategory,
                    status: statusText,
                    createdAt: comp.createdAt,
                    votes: 0,
                    comments: commentsCount,
                    views: Math.floor(Math.random() * 200), // Mocked
                    priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)], // Mocked
                    urgency: 'Community Concern', // Mocked
                    user: userName,
                    userAvatar: getUserInitials(userName),
                    counts: { upvote: 0, downVote: 0 }
                };
            });

            // Fetch user-specific vote status and counts (logic retained)
            const issueIds = fetchedIssues.map(i => i.id).join(',');
            let userVotesMap = {};
            if (issueIds.length > 0) {
                try {
                    const userVotesResp = await axios.get(`${API_BASE_URL}/votes/user-votes`, {
                        params: { issues: issueIds },
                        withCredentials: true
                    });
                    userVotesMap = userVotesResp.data.data || {};
                } catch (err) {
                    // console.warn("Failed to fetch user votes on load:", err.response?.data || err.message);
                }
            }
            setUserVotes(userVotesMap);

            const countsPromises = fetchedIssues.map(i =>
                axios.get(`${API_BASE_URL}/votes/${i.id}`, { withCredentials: true })
                .then(r => ({ id: i.id, counts: r.data.data }))
                .catch(() => ({ id: i.id, counts: { upvote: 0, downVote: 0 } }))
            );

            const countsResults = await Promise.all(countsPromises);
            const countsMap = countsResults.reduce((acc, item) => { acc[item.id] = item.counts; return acc; }, {});
            const issuesWithCounts = fetchedIssues.map(i => ({ ...i, counts: countsMap[i.id] || { upvote: 0, downVote: 0 } }));

            setIssues(issuesWithCounts); // Set the unfiltered/unsorted base data
            // setFilteredIssues(issuesWithCounts); // Removed to let the dedicated useEffect handle it

        } catch (error) {
            console.error("Failed to fetch issues:", (error.response && error.response.data) || error.message);
            setIssues([]);
            setFilteredIssues([]);
        } finally {
            setLoading(false);
        }
    }, [user, searchTerm, filters]);

    // --- CLIENT-SIDE FILTERING AND SORTING LOGIC ---
    useEffect(() => {
        let updated = [...issues];

        // 🔹 Filter by category
        if (filters.category && filters.category !== 'All Categories') {
            updated = updated.filter(issue => issue.category === filters.category);
        }

        // 🔹 Filter by status
        if (filters.status && filters.status !== 'All Statuses') {
            updated = updated.filter(issue => issue.status === filters.status);
        }

        // 🔹 Search filter (title, description, or location)
        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase();
            updated = updated.filter(issue =>
                issue.title?.toLowerCase().includes(term) ||
                issue.description?.toLowerCase().includes(term) ||
                issue.location?.toLowerCase().includes(term)
            );
        }

        // 🔹 Sorting logic
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        
        updated.sort((a, b) => {
            switch (filters.sort) {
                case 'Newest First':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'Oldest First':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'Most Voted':
                    // Sort by net votes (upvotes - downvotes)
                    const scoreA = (a.counts?.upvote || 0) - (a.counts?.downVote || 0);
                    const scoreB = (b.counts?.upvote || 0) - (b.counts?.downVote || 0);
                    return scoreB - scoreA; // Descending
                case 'Most Viewed':
                    return (b.views || 0) - (a.views || 0); // Descending
                case 'Priority':
                    return priorityOrder[a.priority] - priorityOrder[b.priority]; // Ascending (high comes first)
                default:
                    return 0; // No sort change
            }
        });

        setFilteredIssues(updated);
    }, [filters, searchTerm, issues]); // Reruns whenever filters/search change or new data is fetched

    // --- Authentication Effects ---

    useEffect(() => {
        const checkAuthStatus = async () => {
            await new Promise(resolve => setTimeout(resolve, 50));
            setAuthChecked(true);
        };
        checkAuthStatus();
    }, []);

    useEffect(() => {
        if (!authChecked) return;

        if (!user) {
            navigate('/login');
        } else {
            // Initial data fetch
            fetchIssues();
        }
    }, [user, navigate, fetchIssues, authChecked]);

    // --- VOTE Handler (Upvote & Downvote) ---
    const handleVote = async (issueId, voteType) => {
        if (!user) {
            alert("Please login to vote.");
            return;
        }

        const currentUserVote = userVotes[issueId];
        if (busyVotes[issueId]) return;

        let endpoint = `${API_BASE_URL}/votes/${issueId}?category=${voteType}`;

        setBusyVotes(prev => ({ ...prev, [issueId]: true }));

        const issueToUpdate = issues.find(issue => issue.id === issueId);
        if (!issueToUpdate) {
            setBusyVotes(prev => ({ ...prev, [issueId]: false }));
            return;
        }

        let newCounts = { ...issueToUpdate.counts };
        let newUserVote;

        if (currentUserVote === voteType) {
            if (voteType === 'upvote') newCounts.upvote = Math.max(0, newCounts.upvote - 1);
            else newCounts.downVote = Math.max(0, newCounts.downVote - 1);
            newUserVote = undefined;
        } else {
            if (currentUserVote === 'upvote') newCounts.upvote = Math.max(0, newCounts.upvote - 1);
            if (currentUserVote === 'downvote') newCounts.downVote = Math.max(0, newCounts.downVote - 1);

            if (voteType === 'upvote') newCounts.upvote = (newCounts.upvote || 0) + 1;
            else newCounts.downVote = (newCounts.downVote || 0) + 1;
            newUserVote = voteType;
        }

        // Optimistic update of the source list (issues), which will trigger the filtering useEffect
        setIssues(prevIssues => prevIssues.map(issue =>
            issue.id === issueId ? { ...issue, counts: newCounts } : issue
        ));

        setUserVotes(prevVotes => ({ ...prevVotes, [issueId]: newUserVote }));

        try {
            const resp = await axios.post(endpoint, {}, { withCredentials: true });

            const returnedCounts = (resp.data.data && resp.data.data.counts) || resp.data.data;

            if (returnedCounts && (returnedCounts.upvote !== newCounts.upvote || returnedCounts.downVote !== newCounts.downVote)) {
                setIssues(prev => prev.map(i => i.id === issueId ? { ...i, counts: returnedCounts } : i));
            }

        } catch (error) {
            console.error("Vote action failed:", (error.response && error.response.data) || error.message);
            fetchIssues();
            alert(`Vote action failed: ${(error.response && error.response.data && error.response.data.message) || 'Check network/server logic.'}`);
        } finally {
            setBusyVotes(prev => ({ ...prev, [issueId]: false }));
        }
    };


    // --- Comments: fetch for a single complaint ---
    const fetchComments = async (complaintId) => {
        setCommentsOpen(prev => ({ ...prev, [complaintId]: true }));
        if (commentsStore[complaintId]) return;

        try {
            const resp = await axios.get(`${API_BASE_URL}/comments/${complaintId}`, { withCredentials: true });
            setCommentsStore(prev => ({ ...prev, [complaintId]: resp.data.data }));
        } catch (err) {
            console.error("Failed to fetch comments", (err.response && err.response.data) || err.message);
            setCommentsStore(prev => ({ ...prev, [complaintId]: [] }));
        }
    };

    const toggleComments = (complaintId) => {
        const isOpen = !!commentsOpen[complaintId];
        if (!isOpen) {
            fetchComments(complaintId);
        } else {
            setCommentsOpen(prev => ({ ...prev, [complaintId]: false }));
        }
    };

    const handleCommentChange = (issueId, value) => {
        setCommentDrafts(prev => ({ ...prev, [issueId]: value }));
    };

    const deleteComment = async (issueId, commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;

        const prevComments = commentsStore[issueId] || [];

        setCommentsStore(prev => ({
            ...prev,
            [issueId]: (prev[issueId] || []).filter(c => c._id !== commentId)
        }));

        // Decrement comment count on issue in the source list
        setIssues(prev => prev.map(i => i.id === issueId ? { ...i, comments: Math.max(0, (i.comments || 1) - 1) } : i));


        try {
            await axios.delete(`${API_BASE_URL}/comments/${issueId}/${commentId}`, { withCredentials: true });
        } catch (err) {
            console.error("Failed to delete comment:", (err.response && err.response.data) || err.message);
            alert("Failed to delete comment");
            
            // Rollback
            setCommentsStore(prev => ({ ...prev, [issueId]: prevComments }));
            setIssues(prev => prev.map(i => i.id === issueId ? { ...i, comments: (i.comments || 0) + 1 } : i));
        }
    };

    // --- Comment Editing Handlers ---
    const startEditComment = (comment) => {
        setEditingComment({
            commentId: comment._id,
            content: comment.content
        });
    };

    const handleEditChange = (e) => {
        setEditingComment(prev => ({ ...prev, content: e.target.value }));
    };

    const updateComment = async (issueId, commentId, newContent) => {
        const trimmedContent = newContent.trim();
        const currentComment = (commentsStore[issueId] || []).find(c => c._id === commentId);

        if (!currentComment || !trimmedContent || trimmedContent === currentComment.content) {
            setEditingComment(null);
            return;
        }

        setBusyComments(prev => ({ ...prev, [commentId]: true }));
        const prevContent = currentComment.content;
        const prevUpdatedAt = currentComment.updatedAt; 

        // 1. Optimistic update
        setCommentsStore(prev => ({
            ...prev,
            [issueId]: prev[issueId].map(c =>
                c._id === commentId ? {
                    ...c,
                    content: trimmedContent,
                    updatedAt: new Date().toISOString(),
                    userId: currentComment.userId
                } :
                c
            )
        }));
        setEditingComment(null); 

        try {
            const resp = await axios.put(`${API_BASE_URL}/comments/${issueId}/${commentId}`, { content: trimmedContent }, { withCredentials: true });
            const updated = resp.data.data;

            // 3. Final update from server response
            setCommentsStore(prev => ({
                ...prev,
                [issueId]: prev[issueId].map(c => c._id === commentId ? updated : c)
            }));
        } catch (err) {
            console.error("Failed to update comment", (err.response && err.response.data) || err.message);
            alert("Failed to update comment. Rolling back.");

            // 4. Rollback on error
            setCommentsStore(prev => ({
                ...prev,
                [issueId]: prev[issueId].map(c =>
                    c._id === commentId ? { ...c, content: prevContent, updatedAt: prevUpdatedAt } : c
                )
            }));

            // 5. Re-open edit state
            setEditingComment({ commentId, content: prevContent });
        } finally {
            setBusyComments(prev => ({ ...prev, [commentId]: false }));
        }
    };


    const postComment = useCallback(async (issueId) => {
        const text = (commentDrafts[issueId] || '').trim();
        if (!text) return alert("Comment can't be empty");

        setBusyComments(prev => ({ ...prev, [issueId]: true }));

        const tempComment = {
            _id: `temp-${Date.now()}`,
            userId: { _id: user._id, name: user.name },
            complaintId: issueId,
            content: text,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Optimistic append and clear draft
        setCommentsStore(prev => ({
            ...prev,
            [issueId]: [tempComment, ...(prev[issueId] || [])]
        }));
        setCommentDrafts(prev => ({ ...prev, [issueId]: "" }));


        try {
            const resp = await axios.post(`${API_BASE_URL}/comments/${issueId}`, { content: text }, { withCredentials: true });
            const created = resp.data.data;

            // Replace temp comment with actual
            setCommentsStore(prev => ({
                ...prev,
                [issueId]: prev[issueId].map(c => c._id === tempComment._id ? created : c)
            }));

            // increment comment count on issue in the source list
            setIssues(prev => prev.map(i => i.id === issueId ? { ...i, comments: (i.comments || 0) + 1 } : i));
        } catch (err) {
            console.error("Failed to post comment", (err.response && err.response.data) || err.message);
            
            // rollback optimistic append
            setCommentsStore(prev => ({ ...prev, [issueId]: (prev[issueId] || []).filter(c => c._id !== tempComment._id) }));
            // Re-populate draft
            setCommentDrafts(prev => ({ ...prev, [issueId]: text }));
            alert("Failed to post comment");
        } finally {
            setBusyComments(prev => ({ ...prev, [issueId]: false }));
        }
    }, [commentDrafts, user]);


    // --- Filter Handlers ---
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

    const clearFilters = () => {
        setSearchTerm('');
        setFilters({
            category: 'All Categories',
            status: 'All Statuses',
            sort: 'Newest First'
        });
    };

    // Helper to get category count from the full issues list
    const getCategoryCount = (categoryName) => {
        if (categoryName === 'All Categories') {
            return issues.length;
        }
        return issues.filter(i => i.category === categoryName).length;
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
        return null; // Should redirect to /login via useEffect
    }

    // Use the locally filtered results for rendering
    const issuesToRender = filteredIssues; 

    return ( 
        <>
            {/* Header: Used VolunteerHeader based on imports. If you meant AppHeader, change the import line. */}
           <VolunteerHeader /> 

            <div className="dashboard-container">
                {/* Hero */}
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
                                {
                                    issueCategories.map((item, index) => (
                                        <div key={index}
                                            className={`category-item ${filters.category === item.category ? 'active' : ''}`}
                                            onClick={() => handleFilterChange('category', item.category)}>
                                            <div className="category-icon-title">
                                                <span className="category-icon"
                                                    style={{
                                                        backgroundColor: item.color,
                                                    }}>
                                                        {item.icon}
                                                </span>
                                                <span className="category-title">{item.category}</span>
                                            </div>
                                            <span className="category-count"
                                                style={{ backgroundColor: item.color }}>
                                                {getCategoryCount(item.category)}
                                            </span>
                                        </div>
                                    ))
                                }
                                <div className={ `category-item ${filters.category === 'All Categories' ? 'active' : ''}` }
                                    onClick={() => handleFilterChange('category', 'All Categories')}>
                                    <div className="category-icon-title">
                                        <span className="category-title">All Categories</span>
                                    </div>
                                    <span className="category-count">{issues.length}</span>
                                </div>
                            </div>
                        </div>

                        
                    </div>

                    <div className="browse-content">
                        <div className="content-panel filter-panel">
                            <div className="panel-header-main">
                                <div className="panel-title">
                                    <Filter size={24} className="title-icon" />
                                    <div>
                                        <h3>Filter & Search Issues</h3>
                                        <p>Find and engage with community concerns</p>
                                    </div>
                                </div>
                                {
                                    (searchTerm || filters.category !== 'All Categories' || filters.status !== 'All Statuses') && (
                                        <button onClick={clearFilters} className="clear-filters-btn">
                                            <span>Clear All</span>
                                        </button>
                                    )
                                }
                            </div>

                            <div className="search-section">
                                <div className="search-bar">
                                    <Search size={20} className="search-icon" />
                                    <input type="text"
                                        placeholder="Search issues by title, description, location..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="search-input"
                                    />
                                    {
                                        searchTerm && (
                                            <button className="clear-search-btn"
                                                onClick={() => setSearchTerm('')}>
                                                ×
                                            </button>
                                        )
                                    }
                                </div>
                            </div>

                            <div className="filter-controls">
                                <div className="filter-group">
                                    <label className="filter-label">
                                        <span className="filter-label-icon">📁</span>
                                        Category
                                    </label>
                                    <select value={filters.category}
                                        onChange={(e) => handleFilterChange('category', e.target.value)}
                                        className="filter-select">
                                        {
                                            categories.map(category => (
                                                <option key={category} value={category}>{category}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className="filter-group">
                                    <label className="filter-label">
                                        <span className="filter-label-icon">🔄</span>
                                        Status
                                    </label>
                                    <select value={filters.status}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                        className="filter-select">
                                        {
                                            statusOptions.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className="filter-group">
                                    <label className="filter-label">
                                        <span className="filter-label-icon">📊</span>
                                        Sort By
                                    </label>
                                    <select value={filters.sort}
                                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                                        className="filter-select">
                                        {
                                            sortOptions.map(option => (
                                                <option key={option} value={option}>{option}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>

                            <div className="results-info">
                                <div className="results-count">
                                    <strong>{issuesToRender.length}</strong>
                                    <span>{issuesToRender.length === 1 ? ' issue' : ' issues'} found</span>
                                </div>
                                <div className="community-engagement">
                                    <div className="engagement-badge">
                                        <span className="engagement-dot"></span>
                                        High Community Engagement
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Issues List */}
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
                                    {
                                        filters.category !== 'All Categories' && (
                                            <span className="active-filter-tag">Category: {filters.category}</span>
                                        )
                                    }
                                    {
                                        filters.status !== 'All Statuses' && (
                                            <span className="active-filter-tag">Status: {filters.status}</span>
                                        )
                                    }
                                    {
                                        filters.sort !== 'Newest First' && (
                                            <span className="active-filter-tag">Sorted by: {filters.sort}</span>
                                        )
                                    }
                                </div>
                            </div>

                            <div className="issues-list-container">
                                {
                                    loading ? (
                                        <div className="loading-state">
                                            <div className="loading-spinner"></div>
                                            <p>Loading community issues...</p>
                                            <span className="loading-subtitle">Fetching the latest reports from the server</span>
                                        </div>
                                    ) : issuesToRender.length === 0 ? (
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
                                            {
                                                issuesToRender.map(issue => (
                                                    <div key={issue.id}
                                                        className="issue-card"
                                                        onClick={() => navigate(`/issue-detail/${issue.id}`)}>
                                                        <div className="issue-header">
                                                            <div className="issue-meta-left">
                                                                <div className="issue-category-tag"
                                                                    style={{
                                                                        backgroundColor: issueCategories.find(c => c.category === issue.category) ? issueCategories.find(c => c.category === issue.category).color + '20' : 'gray',
                                                                        color: issueCategories.find(c => c.category === issue.category) ? issueCategories.find(c => c.category === issue.category).color : 'darkgray'
                                                                    }}>
                                                                    {issue.category}
                                                                </div>
                                                                <div className={`priority-indicator priority-${issue.priority}`}>
                                                                    <div className={`priority-dot priority-${issue.priority}`}></div>
                                                                    {issue.priority} priority
                                                                </div>
                                                            </div>
                                                            <div className="issue-urgency">{issue.urgency}</div>
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
                                                                <span>{getRelativeTime(issue.createdAt)}</span>
                                                            </div>
                                                        </div>

                                                        <div className="issue-footer">
                                                            <div className="user-info">
                                                                <div className="user-avatar-small">{issue.userAvatar}</div>
                                                                <div className="user-details">
                                                                    <span className="user-name">{issue.user}</span>
                                                                    <span className="report-time">{getRelativeTime(issue.createdAt)}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="issue-actions">
                                                            <div className="vote-section">
                                                                {/* Upvote */}
                                                                <button className={`vote-btn upvote ${userVotes[issue.id] === 'upvote' ? 'voted' : ''}`}
                                                                    onClick={(e) => { e.stopPropagation(); handleVote(issue.id, 'upvote'); }}
                                                                    disabled={busyVotes[issue.id]}>
                                                                    <Heart size={16} />
                                                                    <span>{issue.counts && issue.counts.upvote !== undefined ? issue.counts.upvote : 0}</span>
                                                                </button>
                                                                {/* Downvote */}
                                                                <button className={`vote-btn downvote ${userVotes[issue.id] === 'downvote' ? 'voted' : ''}`}
                                                                    onClick={(e) => { e.stopPropagation(); handleVote(issue.id, 'downvote'); }}
                                                                    disabled={busyVotes[issue.id]}>
                                                                    <ThumbsDown size={16} />
                                                                    <span>{issue.counts && issue.counts.downVote !== undefined ? issue.counts.downVote : 0}</span>
                                                                </button>
                                                            </div>

                                                            <div className={`status-badge status-${issue.status.replace(' ', '').toLowerCase()}`}>{issue.status}</div>
                                                        </div>

                                                        {/* Comments toggle */}
                                                        <div className="comments-toggle">
                                                            <button className="comments-open-btn"
                                                                onClick={(e) => { e.stopPropagation(); toggleComments(issue.id); }}>
                                                                <ChevronsDown size={14} /> 
                                                                {commentsOpen[issue.id] ? 'Hide' : 'Show'} Comments ({issue.comments || 0})
                                                            </button>
                                                        </div>

                                                        {/* Comments panel */}
                                                        {
                                                            commentsOpen[issue.id] && (
                                                                <div className="comments-panel" onClick={(e) => e.stopPropagation()}>
                                                                    {/* Add Comment */}
                                                                    <div className="add-comment">
                                                                        <textarea placeholder="Write your comment..."
                                                                            value={commentDrafts[issue.id] || ''}
                                                                            onChange={(e) => handleCommentChange(issue.id, e.target.value)}
                                                                            rows={2}
                                                                        />
                                                                        <div className="comment-actions">
                                                                            <button onClick={() => postComment(issue.id)}
                                                                                disabled={busyComments[issue.id] || (commentDrafts[issue.id] || '').trim().length === 0}>
                                                                                {busyComments[issue.id] ? 'Posting...' : 'Post Comment'}
                                                                            </button>
                                                                        </div>
                                                                    </div>

                                                                    {/* Comments List */}
                                                                    {
                                                                        (commentsStore[issue.id] || []).map(c => {
                                                                            const commenterName = (c.userId && c.userId.name) || 'User';
                                                                            const isOwner = (c.userId && c.userId._id || c.userId) === user._id;
                                                                            const isEditing = editingComment && editingComment.commentId === c._id;

                                                                            return (
                                                                                <div key={c._id} className="comment-item">
                                                                                    <div className="comment-avatar">{getUserInitials(commenterName)}</div>
                                                                                    <div className="comment-body">
                                                                                        {
                                                                                            isEditing ? (
                                                                                                <div className="edit-comment-area">
                                                                                                    <textarea
                                                                                                        value={editingComment.content}
                                                                                                        onChange={handleEditChange}
                                                                                                        rows={3}
                                                                                                    />
                                                                                                    <div className="comment-actions">
                                                                                                        <button
                                                                                                            onClick={() => updateComment(issue.id, c._id, editingComment.content)}
                                                                                                            disabled={busyComments[c._id] || !editingComment.content.trim()}>
                                                                                                            <Save size={14} /> 
                                                                                                            {busyComments[c._id] ? 'Saving...' : 'Save'}
                                                                                                        </button>
                                                                                                        <button className="cancel-edit-btn"
                                                                                                            onClick={() => setEditingComment(null)}>
                                                                                                            Cancel
                                                                                                        </button>
                                                                                                    </div>
                                                                                                </div>
                                                                                            ) : (
                                                                                                <>
                                                                                                    <div className="comment-meta">
                                                                                                        <span className="comment-author">{commenterName}</span>
                                                                                                        <span className="comment-time">
                                                                                                            {getRelativeTime(c.createdAt)} 
                                                                                                            {c.updatedAt && new Date(c.updatedAt) > new Date(c.createdAt) ? ' (edited)' : ''}
                                                                                                        </span>
                                                                                                        {
                                                                                                            isOwner && (
                                                                                                                <div className="comment-owner-actions">
                                                                                                                    <button className="edit-comment-btn"
                                                                                                                        onClick={(e) => { e.stopPropagation(); startEditComment(c); }}>
                                                                                                                        <Edit size={14} />
                                                                                                                    </button>
                                                                                                                    <button className="delete-comment-btn"
                                                                                                                        onClick={(e) => { e.stopPropagation(); deleteComment(issue.id, c._id); }}>
                                                                                                                        <Trash2 size={14} />
                                                                                                                    </button>
                                                                                                                </div>
                                                                                                            )
                                                                                                        }
                                                                                                    </div>
                                                                                                    <div className="comment-content">{c.content}</div>
                                                                                                </>
                                                                                            )
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })
                                                                    }
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <VolunteerFooter /> 
            </div>
        </>
    );
};

export default UserBrowseIssue;
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { 
    MapPin, Clock, Heart, MessageSquare, Eye, Edit, Trash2, Save, X, ThumbsDown, 
    User as UserIcon, AlertCircle, Loader2, FileText, ArrowRight, UserCheck, LogOut
} from 'lucide-react';
import { getRelativeTime, getUserInitials } from '../utils/timeUtils'; 

import './IssueDetailPage.css'; 

const API_BASE_URL = 'http://localhost:3000/api/v1';

const IssueDetailPage = () => {
    const { id: issueId } = useParams();
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Comment States
    const [comments, setComments] = useState([]);
    const [commentDraft, setCommentDraft] = useState('');
    const [busyComments, setBusyComments] = useState(false);
    const [editingComment, setEditingComment] = useState(null);

    // Vote States
    const [userVote, setUserVote] = useState(null);
    const [counts, setCounts] = useState({ upvote: 0, downVote: 0 });
    const [busyVotes, setBusyVotes] = useState(false);

    const getInitials = (name) => name?.split(/\s+/).map(n => n[0]).join('').toUpperCase() || 'U';


    // --- 1. Fetch Issue and Initial Stats ---
    const fetchIssueAndStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // CRITICAL FIX: The primary issue fetching route is now GET /complaints/:issueId
            const issueResp = await axios.get(`${API_BASE_URL}/complaints/${issueId}`, { withCredentials: true });
            
            // Fetch comments and votes in parallel
            const [commentsResp, votesResp, userVoteResp] = await Promise.all([
                axios.get(`${API_BASE_URL}/comments/${issueId}`, { withCredentials: true }), // Route: GET /comments/:complaintId
                axios.get(`${API_BASE_URL}/votes/${issueId}`, { withCredentials: true }), // Route: GET /votes/:complaintId (counts)
                user ? axios.get(`${API_BASE_URL}/votes/user-votes?issues=${issueId}`, { withCredentials: true }) : Promise.resolve({ data: { data: {} } })
            ]);

            setIssue(issueResp.data.data);
            setComments(commentsResp.data.data || []);
            setCounts(votesResp.data.data || { upvote: 0, downVote: 0 });
            
            const voteType = Object.values(userVoteResp.data.data)[0];
            setUserVote(voteType || null);

        } catch (err) {
            console.error("Failed to fetch issue details:", err.response?.data || err.message);
            setError(err.response?.data?.message || 'Issue not found or server error.');
        } finally {
            setLoading(false);
        }
    }, [issueId, user]);

    useEffect(() => {
        if (issueId && user !== undefined) {
            fetchIssueAndStats();
        }
    }, [issueId, fetchIssueAndStats, user]);


    // --- 2. Vote Handler ---
    const handleVote = async (voteType) => {
        if (!user) return alert("Please log in to cast your vote.");
        
        const currentVoteType = userVote;
        const isCurrentlyVoted = currentVoteType === voteType;
        const endpoint = `${API_BASE_URL}/votes/${issueId}?category=${voteType}`;

        const initialCounts = { ...counts };
        const initialUserVote = userVote;
        
        setBusyVotes(issueId); 

        // 1. Optimistic Update 
        setCounts(prevCounts => {
            const newCounts = { ...prevCounts };
            if (currentVoteType && newCounts[currentVoteType]) newCounts[currentVoteType] = Math.max(0, newCounts[currentVoteType] - 1); 
            if (!isCurrentlyVoted) newCounts[voteType] = (newCounts[voteType] || 0) + 1;
            return newCounts;
        });
        setUserVote(isCurrentlyVoted ? null : voteType);

        try {
            await axios.post(endpoint, {}, { withCredentials: true });
            
            const { data: { data: returnedCounts } } = await axios.get(`${API_BASE_URL}/votes/${issueId}`, { withCredentials: true });
            setCounts(returnedCounts);

        } catch (error) {
            console.error("Vote failed:", error.response?.data || error.message);
            setCounts(initialCounts);
            setUserVote(initialUserVote);
            alert(`Vote failed: ${error.response?.data?.message || 'Server error. Rollback complete.'}`);
        } finally {
            setBusyVotes(null); 
        }
    };


    // --- 3. Comment Handlers ---
    const postComment = async () => {
        const text = commentDraft.trim();
        if (!text) return alert("Comment can't be empty");
        if (!user) return alert("Please log in to post a comment.");
        
        setBusyComments(true);
        const tempComment = { _id: `temp-${Date.now()}`, userId: { name: user.name, _id: user._id }, content: text, createdAt: new Date().toISOString() };
        
        setComments(prev => [tempComment, ...prev]);
        setCommentDraft('');

        try {
            await axios.post(`${API_BASE_URL}/comments/${issueId}`, { content: text }, { withCredentials: true });
            
            // Refetch all comments to get the accurate list with populated user data
            const resp = await axios.get(`${API_BASE_URL}/comments/${issueId}`, { withCredentials: true });
            setComments(resp.data.data);

            setIssue(prev => ({...prev, comments: (prev.comments || 0) + 1}));

        } catch (err) {
            console.error("Failed to post comment", err.response?.data || err.message);
            setComments(prev => prev.filter(c => c._id !== tempComment._id)); // Rollback optimistic append
            setCommentDraft(text); // Restore draft
            alert("Failed to post comment.");
        } finally {
            setBusyComments(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        
        const originalComments = comments;
        setComments(prev => prev.filter(c => c._id !== commentId)); 
        
        try {
            await axios.delete(`${API_BASE_URL}/comments/${issueId}/${commentId}`, { withCredentials: true });

            alert("Comment deleted successfully.");
            setIssue(prev => ({...prev, comments: Math.max(0, prev.comments - 1)}));

        } catch (err) {
            console.error("Delete failed", err.response?.data || err.message);
            alert(`Failed to delete comment: ${err.response?.data?.message || 'Server error.'}`);
            setComments(originalComments); // Rollback
        }
    };
    
    const startEditComment = (comment) => {
        setEditingComment({ commentId: comment._id, content: comment.content, originalContent: comment.content });
    };

    const handleEditChange = (e) => {
        setEditingComment(prev => ({ ...prev, content: e.target.value }));
    };

    const updateComment = async () => {
        if (!editingComment || !editingComment.content.trim()) return;

        const { commentId, content: newContent, originalContent } = editingComment;
        if (newContent === originalContent) { setEditingComment(null); return; }

        setBusyComments(true);
        
        const prevContent = comments.find(c => c._id === commentId)?.content;

        // Optimistic update
        setComments(prev => prev.map(c => c._id === commentId ? { ...c, content: newContent, updatedAt: new Date().toISOString() } : c));
        setEditingComment(null);

        try {
            await axios.put(`${API_BASE_URL}/comments/${issueId}/${commentId}`, { content: newContent }, { withCredentials: true });
        } catch (err) {
            console.error("Update failed", err.response?.data || err.message);
            alert("Failed to update comment. Rolling back.");
            // Rollback
            setComments(prev => prev.map(c => c._id === commentId ? { ...c, content: prevContent, updatedAt: new Date().toISOString() } : c));
            setEditingComment({ commentId, content: prevContent, originalContent: prevContent }); // Re-open edit state
        } finally {
            setBusyComments(false);
        }
    };

    const handleLogout = () => {
        signOut();
        navigate('/');
    };


    if (!user || loading) {
        return (
            <div className="loading-state-detail">
                <Loader2 size={40} className="spinner" />
                <p>{loading ? "Loading Issue Details..." : "Authenticating..."}</p>
            </div>
        );
    }
    
    if (error) {
        return <div className="error-state-detail">Error: {error}</div>;
    }

    const reporterName = issue.userId?.name || 'Anonymous User';
    const reporterInitials = getInitials(reporterName);
    const statusClass = issue.status.toLowerCase().replace(' ', '');

    return (
        <div className="detail-page-container">
            {/* Header (Simplified for detail view, using the basic structure) */}
            <header className="detail-header-top">
                <Link to="/browse-issues" className="back-link">
                    <ArrowRight size={20} style={{ transform: 'rotate(180deg)' }} /> Back to Browse
                </Link>
                <div className="header-actions">
                    <Link to="/report-issue" className="report-btn">Report New Issue</Link>
                    <button onClick={handleLogout} className="logout-btn-header-detail"><LogOut size={20} /></button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="detail-main-content">
                
                {/* Panel 1: Issue Details and Status */}
                <div className="issue-panel-grid">
                    <div className="issue-status-box">
                        <span className={`status-tag status-${statusClass}`}>
                            {issue.status}
                        </span>
                        <h1 className="issue-title-detail">{issue.title}</h1>
                        
                        <div className="issue-reporter-meta">
                            <div className="reporter-avatar">{reporterInitials}</div>
                            <div className="reporter-info">
                                <span>Reported by: <strong>{reporterName}</strong></span>
                                <span className="report-time-stamp"><Clock size={12} /> {getRelativeTime(issue.createdAt)}</span>
                            </div>
                        </div>

                        <div className="issue-actions-stats">
                            <div className="vote-section-detail">
                                {/* Upvote Button */}
                                <button 
                                    className={`vote-btn-detail upvote ${userVote === 'upvote' ? 'voted' : ''}`}
                                    onClick={() => handleVote('upvote')} 
                                    disabled={busyVotes} 
                                    title="Upvote"
                                >
                                    <Heart size={18} />
                                    <span>{counts.upvote ?? 0}</span>
                                </button>

                                {/* Downvote Button */}
                                <button 
                                    className={`vote-btn-detail downvote ${userVote === 'downvote' ? 'voted' : ''}`}
                                    onClick={() => handleVote('downvote')} 
                                    disabled={busyVotes} 
                                    title="Downvote"
                                >
                                    <ThumbsDown size={18} />
                                    <span>{counts.downVote ?? 0}</span>
                                </button>
                            </div>
                            <div className="stats-meta-inline">
                                <span title="Comments"><MessageSquare size={14} /> {comments.length}</span>
                                <span title="Views"><Eye size={14} /> {issue.views || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="issue-details-box">
                        <h3 className="details-header"><FileText size={16} /> Details</h3>
                        <p className="issue-description-detail">{issue.description}</p>
                        
                        {issue.photo && (
                            <div className="issue-photo-section">
                                <img src={issue.photo} alt="Issue Proof" className="issue-photo-img" />
                            </div>
                        )}
                        
                        <div className="issue-metadata">
                            <div className="meta-item-detail"><MapPin size={16} /> Location: <strong>{issue.location}</strong></div>
                            <div className="meta-item-detail"><AlertCircle size={16} /> Category: <strong>{issue.category}</strong></div>
                            <div className="meta-item-detail"><UserCheck size={16} /> Assigned To: <strong>{issue.assignedTo || 'Unassigned'}</strong></div>
                        </div>
                    </div>
                </div>

                {/* Panel 2: Comments Section */}
                <div className="comments-section-full">
                    <h3 className="comments-header-title">Comments ({comments.length})</h3>
                    
                    {/* Add Comment Area */}
                    <div className="add-comment-area-full">
                        <textarea
                            placeholder="Share your thoughts about this issue..."
                            value={commentDraft}
                            onChange={(e) => setCommentDraft(e.target.value)}
                            rows={3}
                        />
                        <button 
                            onClick={postComment} 
                            disabled={busyComments || !commentDraft.trim()}
                            className="post-comment-button-full"
                        >
                            {busyComments ? <Loader2 size={18} className="spinner" /> : 'Post Comment'}
                        </button>
                    </div>

                    {/* Comments List */}
                    <div className="comments-list-full">
                        {comments.length === 0 ? (
                            <div className="no-comments-full">No comments yet.</div>
                        ) : (
                            comments.map(c => (
                                <div key={c._id} className="comment-item-full">
                                    <div className="comment-avatar-full">{getInitials(c.userId?.name)}</div>
                                    <div className="comment-body-full">
                                        
                                        {/* Edit/View/Delete Mode */}
                                        {editingComment?.commentId === c._id ? (
                                            <div className="edit-mode-container">
                                                <textarea
                                                    value={editingComment.content}
                                                    onChange={handleEditChange}
                                                    rows={3}
                                                />
                                                <div className="edit-actions">
                                                    <button onClick={() => updateComment(issueId, c._id, editingComment.content)} disabled={busyComments}>
                                                        <Save size={14} /> Save
                                                    </button>
                                                    <button onClick={() => setEditingComment(null)} className="cancel-edit">Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            // View Mode
                                            <>
                                                <div className="comment-meta-full">
                                                    <span className="comment-author-full">{c.userId?.name || 'User'}</span>
                                                    <span className="comment-time-full">{getRelativeTime(c.createdAt)}</span>
                                                    {c.updatedAt && new Date(c.updatedAt) > new Date(c.createdAt) && (
                                                         <span className="comment-edited">(edited)</span>
                                                    )}
                                                    
                                                    {user && c.userId?._id === user._id && (
                                                        <div className="comment-owner-actions">
                                                            <button onClick={() => startEditComment(c)} title="Edit"><Edit size={14} /></button>
                                                            <button onClick={() => handleDeleteComment(issueId, c._id)} title="Delete"><Trash2 size={14} /></button>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="comment-content-full">{c.content}</div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
            
            {/* Minimal Footer */}
            <footer className="detail-footer">
                 <p>&copy; 2024 Clean Street. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default IssueDetailPage;
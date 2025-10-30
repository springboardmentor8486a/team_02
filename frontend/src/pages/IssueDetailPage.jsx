import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'; // 👈 Assuming AuthContext provides user
import { 
    ArrowLeft, MapPin, Calendar, ThumbsUp, ThumbsDown, 
    MessageCircle, User, AlertCircle, Loader, Edit, Trash2, Save
} from 'lucide-react';
import './IssueDetailPage.css';

// Define API_BASE_URL
const API_BASE_URL = 'http://localhost:3000/api/v1';

const IssueDetailPage = () => {
    const { complaintId:id } = useParams();
    const navigate = useNavigate();
    // Assuming useAuth provides { user, signOut }
    const { user } = useAuth(); 

    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    
    // Comments & Votes
    const [newComment, setNewComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [editingComment, setEditingComment] = useState(null); 
    const [busyCommentId, setBusyCommentId] = useState(null); 

    const handleAuthError = (err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
            alert("Your session has expired or you are not logged in. Please log in again.");
            navigate('/login');
            return true;
        }
        return false;
    };

    const fetchIssueDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(`${API_BASE_URL}/complaints/${id}`, { withCredentials: true });
            
            setIssue(response.data.data);
            // Debug: View the real API response for category
            console.log("Fetched issue detail: ", response.data.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching issue details:', err);
            
            if (handleAuthError(err)) {
                setLoading(false);
                return;
            }

            setError(err.response?.data?.message || 'Failed to load issue details');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssueDetails();
    }, [id]);

    const handleVote = async (voteType) => {
        if (!user) {
            alert("Please log in to vote.");
            return;
        }
        try {
            await axios.post(
                `${API_BASE_URL}/votes/${id}?category=${voteType}`,
                {},
                { withCredentials: true }
            );
            fetchIssueDetails();
        } catch (err) {
            console.error('Error voting:', err);
            if (handleAuthError(err)) return;
            alert(err.response?.data?.message || 'Failed to vote');
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        const text = newComment.trim();
        if (!text) return;

        if (!user) {
            alert("Please log in to comment.");
            return;
        }

        try {
            setSubmittingComment(true);
            
            await axios.post(
                `${API_BASE_URL}/comments/${id}`,
                { text },
                { withCredentials: true }
            );

            setNewComment('');
            fetchIssueDetails();
        } catch (err) {
            console.error('Error posting comment:', err);
            if (handleAuthError(err)) return; 
            alert(err.response?.data?.message || 'Failed to post comment');
        } finally {
            setSubmittingComment(false);
        }
    };

    const isCommentOwner = (comment) => {
        return user && comment.user && comment.user._id === user._id;
    };

    const startEditComment = (comment) => {
        setEditingComment({
            commentId: comment._id,
            text: comment.text 
        });
    };

    const handleEditChange = (e) => {
        setEditingComment(prev => ({ ...prev, text: e.target.value }));
    };

    const updateComment = async () => {
        const { commentId, text } = editingComment;
        const trimmedText = text.trim();
        
        if (!trimmedText) return alert("Comment can't be empty.");
        if (!user) return alert("Please log in to edit.");
        
        setBusyCommentId(commentId);
        
        const originalComments = issue.comments;
        const currentComment = originalComments.find(c => c._id === commentId);

        if (trimmedText === currentComment.text) {
             setEditingComment(null);
             setBusyCommentId(null);
             return;
        }

        // 1. Optimistic Update (Visual)
        const updatedComments = originalComments.map(c => 
            c._id === commentId ? { 
                ...c, 
                text: trimmedText, 
                updatedAt: new Date().toISOString()
            } : c
        );
        setIssue(prev => ({ ...prev, comments: updatedComments }));
        setEditingComment(null); 

        try {
            // 2. API Call to update
            await axios.put(
                `${API_BASE_URL}/comments/${id}/${commentId}`,
                { text: trimmedText },
                { withCredentials: true }
            );

            fetchIssueDetails();

        } catch (err) {
            console.error("Failed to update comment", err.response?.data || err.message);
            alert("Failed to update comment. Rolling back.");
            
            // 4. Rollback visual state on error
            setIssue(prev => ({ ...prev, comments: originalComments }));
            setEditingComment({ commentId, text: currentComment.text });

        } finally {
            setBusyCommentId(null);
        }
    };

    const deleteComment = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        if (!user) return alert("Please log in to delete.");

        setBusyCommentId(commentId);

        // 1. Optimistic Update (Visual)
        const originalComments = issue.comments;
        const updatedComments = originalComments.filter(c => c._id !== commentId);
        setIssue(prev => ({ ...prev, comments: updatedComments }));

        try {
            // 2. API Call to delete
            await axios.delete(
                `${API_BASE_URL}/comments/${id}/${commentId}`,
                { withCredentials: true }
            );
            
            fetchIssueDetails(); 

        } catch (err) {
            console.error("Failed to delete comment:", err.response?.data || err.message);
            alert("Failed to delete comment. Rolling back.");
            
            // 4. Rollback visual state on error
            setIssue(prev => ({ ...prev, comments: originalComments }));
        } finally {
            setBusyCommentId(null);
        }
    };

    // --- Utility Functions ---
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // --- Loading, Error, Not Found States ---
    if (loading) {
        return (
            <div className="issue-detail-loading">
                <Loader className="spinner" size={48} />
                <p>Loading issue details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="issue-detail-error">
                <AlertCircle size={48} color="#dc3545" />
                <h2>Error Loading Issue</h2>
                <p>{error}</p>
                <button onClick={() => navigate(-1)} className="back-btn">
                    Go Back
                </button>
            </div>
        );
    }

    if (!issue) {
        return (
            <div className="issue-detail-error">
                <AlertCircle size={48} />
                <h2>Issue Not Found</h2>
                <button onClick={() => navigate(-1)} className="back-btn">
                    Go Back
                </button>
            </div>
        );
    }

    // CATEGORY MAPPING (before return)
    const categoryMap = {
        "Municipal sanitation and public health": "Garbage & Waste",
        "Roads and street infrastructure": "Potholes",
        "Street lighting and electrical assets": "Street Lights",
        "Water, sewerage, and stormwater": "Water Issues",
        "Ward/zone office and central admin": "Vandalism",
        "Other": "Other"
    };
    const displayCategory = categoryMap[issue?.category || issue?.assignedTo] || issue?.category || "None";

    return (
        <div className="issue-detail-page">
            <header className="issue-detail-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <ArrowLeft size={20} />
                    Back to Issues
                </button>
            </header>

            <div className="issue-detail-container">
                {/* Images Section */}
                {issue.images && issue.images.length > 0 && (
                    <div className="images-section">
                        <div className="main-image">
                            <img 
                                src={issue.images[selectedImage]} 
                                alt={`Issue ${selectedImage + 1}`}
                                onError={(e) => {
                                    e.target.src = '/images/placeholder.jpg';
                                }}
                            />
                        </div>
                        
                        {issue.images.length > 1 && (
                            <div className="image-thumbnails">
                                {issue.images.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img 
                                            src={img} 
                                            alt={`Thumbnail ${index + 1}`}
                                            onError={(e) => {
                                                e.target.src = '/images/placeholder.jpg';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                
                {/* Left Column Container */}
                <div className="issue-info-main">
                    {/* Issue Info */}
                    <div className="issue-info-section">
                        <div className="issue-header-info">
                            <span className={`status-badge status-${issue.status?.toLowerCase() || 'pending'}`}>
                                {issue.status || 'Pending'}
                            </span>
                            <span className={`category-badge`}>
                                {issue.assignedTo || 'Unassigned'}
                            </span>
                        </div>

                        <h2 className="issue-title">{issue.title}</h2>
                        
                        <div className="issue-meta">
                            <div className="meta-item">
                                <MapPin size={16} />
                                <span>{Array.isArray(issue.address) ? issue.address.join(', ') : issue.address}</span>
                            </div>
                            <div className="meta-item">
                                <Calendar size={16} />
                                <span>{formatDate(issue.createdAt)}</span>
                            </div>
                            <div className="meta-item">
                                <User size={16} />
                                <span>Reported by: {issue.userId?.name || 'Anonymous'}</span>
                            </div>
                            <div className="meta-item">
                                <User size={16} />
                                <span>Assigned Volunteer: {issue.assignedTo || 'Unassigned'}</span>
                            </div>
                            {/* Category: Use mapped label */}
                            <div className="meta-item">
                                <span>Category: {displayCategory}</span>
                            </div>
                        </div>

                        <div className="issue-description">
                            <h3>Description</h3>
                            {/* The corrected CSS ensures the full description displays */}
                            <p className="comment-text" style={{whiteSpace:'pre-line',overflow:'visible',textOverflow:'unset',maxHeight:'none'}}>{issue.description}</p> 
                        </div>

                        {/* Voting Section */}
                        <div className="voting-section">
                            <button 
                                className={`vote-btn upvote ${issue.userVote === 'upvote' ? 'active' : ''}`}
                                onClick={() => handleVote('upvote')}
                            >
                                <ThumbsUp size={20} />
                                <span>{issue.votesCount?.upvotes || 0}</span>
                            </button>
                            <button 
                                className={`vote-btn downvote ${issue.userVote === 'downvote' ? 'active' : ''}`}
                                onClick={() => handleVote('downvote')}
                            >
                                <ThumbsDown size={20} />
                                <span>{issue.votesCount?.downvotes || 0}</span>
                            </button>
                            <div className="vote-total">
                                Total: {issue.votesCount?.total || 0}
                            </div>
                        </div>
                    </div>
                    
                    {/* Placeholder for Status Updates/Timeline - You might want to implement a dedicated StatusTimeline component here */}
                    {/* <div className="status-updates-section">...</div> */}
                </div>


                {/* Comments Section (Right Column Container) */}
                <div className="comments-section-wrapper">
                    <div className="comments-section">
                        <h3>
                            <MessageCircle size={20} />
                            Comments ({issue.comments?.length || 0})
                        </h3>

                        {/* Add Comment Form */}
                        {user ? (
                            <form onSubmit={handleSubmitComment} className="add-comment-form">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    rows="3"
                                    disabled={submittingComment}
                                />
                                <button 
                                    type="submit" 
                                    disabled={submittingComment || !newComment.trim()}
                                    className="submit-comment-btn"
                                >
                                    {submittingComment ? 'Posting...' : 'Post Comment'}
                                </button>
                            </form>
                        ) : (
                            <p>Please <span onClick={() => navigate('/login')} style={{cursor: 'pointer', color: '#007bff', fontWeight: 'bold'}}>log in</span> to post a comment.</p>
                        )}

                        {/* Comments List */}
                        <div className="comments-list">
                            {issue.comments && issue.comments.length > 0 ? (
                                issue.comments.map((comment) => {
                                    const isEditing = editingComment?.commentId === comment._id;
                                    const isBusy = busyCommentId === comment._id;

                                    return (
                                        <div key={comment._id} className="comment-item">
                                            <div className="comment-avatar">
                                                {comment.user?.profilePhoto ? (
                                                    <img src={comment.user.profilePhoto} alt={comment.user.name} />
                                                ) : (
                                                    // Display User icon if no photo
                                                    <User size={24} /> 
                                                )}
                                            </div>
                                            <div className="comment-content">
                                                {isEditing ? (
                                                    // --- EDIT FORM ---
                                                    <div className="edit-comment-area">
                                                        <textarea
                                                            value={editingComment.text}
                                                            onChange={handleEditChange}
                                                            rows="3"
                                                            disabled={isBusy}
                                                        />
                                                        <div className="edit-comment-actions">
                                                            <button 
                                                                className="save-edit-btn" 
                                                                onClick={updateComment}
                                                                disabled={isBusy || !editingComment.text.trim()}
                                                            >
                                                                <Save size={16} /> {isBusy ? 'Saving...' : 'Save'}
                                                            </button>
                                                            <button 
                                                                className="cancel-edit-btn" 
                                                                onClick={() => setEditingComment(null)}
                                                                disabled={isBusy}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    // --- DISPLAY MODE ---
                                                    <>
                                                        <div className="comment-header">
                                                            <div className="comment-header-info">
                                                                <span className="comment-author">
                                                                    {comment.user?.name || 'Anonymous'}
                                                                </span>
                                                                <span className="comment-date">
                                                                    {formatDate(comment.createdAt)}
                                                                    {comment.updatedAt && new Date(comment.updatedAt) > new Date(comment.createdAt) ? ' (edited)' : ''}
                                                                </span>
                                                            </div>

                                                            {user && isCommentOwner(comment) && (
                                                                <div className="comment-owner-actions">
                                                                    <button
                                                                        className="edit-comment-btn"
                                                                        onClick={(e) => { e.stopPropagation(); startEditComment(comment); }}
                                                                        disabled={isBusy}
                                                                    >
                                                                        <Edit size={16} />
                                                                    </button>
                                                                    <button
                                                                        className="delete-comment-btn"
                                                                        onClick={(e) => { e.stopPropagation(); deleteComment(comment._id); }}
                                                                        disabled={isBusy}
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="comment-text">{comment.text}</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="no-comments">No comments yet. Be the first to comment!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IssueDetailPage;
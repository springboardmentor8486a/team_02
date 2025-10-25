import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    ArrowLeft, 
    MapPin, 
    Calendar, 
    ThumbsUp, 
    ThumbsDown, 
    MessageCircle,
    User,
    AlertCircle,
    Loader
} from 'lucide-react';
import './IssueDetailPage.css';

const IssueDetailPage = () => {
    const { id } = useParams(); // Get ID from URL
    const navigate = useNavigate();
    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    useEffect(() => {
        fetchIssueDetails();
    }, [id]);

    const fetchIssueDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Fetching issue details for ID:', id);

            const response = await axios.get(
                `http://localhost:3000/api/v1/complaints/${id}`, // Use the ID from params
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            console.log('Issue details response:', response.data);
            setIssue(response.data.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching issue details:', err);
            console.error('Error response:', err.response?.data);
            setError(err.response?.data?.message || 'Failed to load issue details');
            setLoading(false);
        }
    };

    const handleVote = async (voteType) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login to vote');
                navigate('/login');
                return;
            }

            await axios.post(
                'http://localhost:3000/api/v1/votes',
                {
                    complaintId: id,
                    voteType
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            fetchIssueDetails();
        } catch (err) {
            console.error('Error voting:', err);
            alert(err.response?.data?.message || 'Failed to vote');
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        
        if (!newComment.trim()) {
            return;
        }

        try {
            setSubmittingComment(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                alert('Please login to comment');
                navigate('/login');
                return;
            }

            await axios.post(
                'http://localhost:3000/api/v1/comments',
                {
                    complaintId: id,
                    text: newComment.trim()
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setNewComment('');
            fetchIssueDetails();
        } catch (err) {
            console.error('Error posting comment:', err);
            alert(err.response?.data?.message || 'Failed to post comment');
        } finally {
            setSubmittingComment(false);
        }
    };

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

    return (
        <div className="issue-detail-page">
            <header className="issue-detail-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <ArrowLeft size={20} />
                    Back
                </button>
                <h1>Issue Details</h1>
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
                    </div>

                    <div className="issue-description">
                        <h3>Description</h3>
                        <p>{issue.description}</p>
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

                {/* Comments Section */}
                <div className="comments-section">
                    <h3>
                        <MessageCircle size={20} />
                        Comments ({issue.comments?.length || 0})
                    </h3>

                    {/* Add Comment Form */}
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

                    {/* Comments List */}
                    <div className="comments-list">
                        {issue.comments && issue.comments.length > 0 ? (
                            issue.comments.map((comment) => (
                                <div key={comment._id} className="comment-item">
                                    <div className="comment-avatar">
                                        {comment.user?.profilePhoto ? (
                                            <img src={comment.user.profilePhoto} alt={comment.user.name} />
                                        ) : (
                                            <User size={24} />
                                        )}
                                    </div>
                                    <div className="comment-content">
                                        <div className="comment-header">
                                            <span className="comment-author">
                                                {comment.user?.name || 'Anonymous'}
                                            </span>
                                            <span className="comment-date">
                                                {formatDate(comment.createdAt)}
                                            </span>
                                        </div>
                                        <p className="comment-text">{comment.text}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-comments">No comments yet. Be the first to comment!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IssueDetailPage;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutModal from './LogoutModal';
import './BrowseIssues.css';

const BrowseIssues = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [sortBy, setSortBy] = useState('Newest First');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const issues = [
    {
      id: 1,
      title: "Large pothole causing traffic hazard",
      description: "Deep pothole on Main Street that's getting worse with recent rain. Multiple cars have been damaged.",
      location: "Main St & 5th Ave, Downtown",
      timeAgo: "246 days ago",
      category: "Potholes",
      reporter: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
      likes: 18,
      dislikes: 5,
      comments: 2,
      status: "pending",
      priority: "high"
    },
    {
      id: 2,
      title: "Overflowing garbage bins attracting pests",
      description: "The bins haven't been emptied in over a week and are attracting rats and flies.",
      location: "Central Park entrance",
      timeAgo: "247 days ago",
      category: "Garbage & Waste",
      reporter: "Mike Chen",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop",
      likes: 15,
      dislikes: 3,
      comments: 1,
      status: "in progress",
      priority: "medium"
    },
    {
      id: 3,
      title: "Broken street light creating safety risk",
      description: "Street light has been out for two weeks, making the area very dark at night.",
      location: "Oak Avenue near bus stop",
      timeAgo: "248 days ago",
      category: "Street Lights",
      reporter: "Lisa Rodriguez",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop",
      likes: 28,
      dislikes: 3,
      comments: 1,
      status: "resolved",
      priority: "high"
    },
    {
      id: 4,
      title: "Water main leak flooding sidewalk",
      description: "Large leak from underground pipe causing flooding and potential foundation damage.",
      location: "Elm Street & 3rd Avenue",
      timeAgo: "249 days ago",
      category: "Water Issues",
      reporter: "David Thompson",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop",
      likes: 40,
      dislikes: 5,
      comments: 2,
      status: "in progress",
      priority: "urgent"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'in progress': return '#3b82f6';
      case 'resolved': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const handleLike = (issueId) => {
    console.log(`Liked issue ${issueId}`);
  };

  const handleDislike = (issueId) => {
    console.log(`Disliked issue ${issueId}`);
  };

  const handleComment = (issueId) => {
    console.log(`Commented on issue ${issueId}`);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    console.log('User logged out');
    
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Redirect to login page
    window.location.href = '/login';
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="browse-issues">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <div className="logo">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z"/>
              </svg>
              <span>Clean Street</span>
            </div>
          </div>
          
          <div className="nav-menu">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/browse" className="nav-link active">Browse Issues</Link>
            <Link to="/report" className="nav-link">Report Issue</Link>
          </div>
          
          <div className="nav-user">
            <Link to="/profile" className="user-info">
              <div className="user-avatar">JD</div>
              <span className="user-name">John Doe</span>
              <button 
                className="logout-btn"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M14.08,15.59L16.67,13H7V11H16.67L14.08,8.41L15.5,7L20.5,12L15.5,17L14.08,15.59M19,3A2,2 0 0,1 21,5V9.67L19,7.67V5H5V19H19V16.33L21,14.33V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19Z"/>
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="browse-content">
        <div className="container">
          {/* Page Header */}
          <div className="page-header">
            <h1 className="page-title">Community Issues</h1>
            <p className="page-description">
              Browse and vote on issues reported by community members
            </p>
          </div>

          {/* Filter & Search Section */}
          <div className="filter-section">
            <div className="search-container">
              <div className="search-input-wrapper">
                <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            
            <div className="filter-controls">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                <option value="All Categories">All Categories</option>
                <option value="Potholes">Potholes</option>
                <option value="Garbage & Waste">Garbage & Waste</option>
                <option value="Street Lights">Street Lights</option>
                <option value="Water Issues">Water Issues</option>
              </select>
              
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="filter-select"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="Newest First">Newest First</option>
                <option value="Oldest First">Oldest First</option>
                <option value="Most Liked">Most Liked</option>
                <option value="Most Comments">Most Comments</option>
              </select>
            </div>
          </div>

          {/* Issues List */}
          <div className="issues-list">
            {issues.map((issue) => (
              <div key={issue.id} className="issue-card">
                <div className="issue-image">
                  <img src={issue.image} alt={issue.title} />
                </div>
                
                <div className="issue-content">
                  <div className="issue-header">
                    <h3 className="issue-title">{issue.title}</h3>
                    <div className="issue-tags">
                      <span 
                        className="status-tag"
                        style={{ backgroundColor: getStatusColor(issue.status) }}
                      >
                        {issue.status}
                      </span>
                      <span 
                        className="priority-tag"
                        style={{ backgroundColor: getPriorityColor(issue.priority) }}
                      >
                        {issue.priority}
                      </span>
                    </div>
                  </div>
                  
                  <p className="issue-description">{issue.description}</p>
                  
                  <div className="issue-meta">
                    <span className="issue-location">{issue.location}</span>
                    <span className="issue-time">{issue.timeAgo}</span>
                  </div>
                  
                  <div className="issue-category">
                    <span className="category-tag">{issue.category}</span>
                  </div>
                  
                  <div className="issue-reporter">
                    Reported by {issue.reporter}
                  </div>
                  
                  <div className="issue-engagement">
                    <button 
                      className="engagement-btn like-btn"
                      onClick={() => handleLike(issue.id)}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
                      </svg>
                      <span>{issue.likes}</span>
                    </button>
                    
                    <button 
                      className="engagement-btn dislike-btn"
                      onClick={() => handleDislike(issue.id)}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M19,15H23V3H19M15,3H9C7.89,3 7,3.89 7,5V19A2,2 0 0,0 9,21H15A2,2 0 0,0 17,19V5C17,3.89 16.1,3 15,3M15,19H9V5H15V19Z"/>
                      </svg>
                      <span>{issue.dislikes}</span>
                    </button>
                    
                    <button 
                      className="engagement-btn comment-btn"
                      onClick={() => handleComment(issue.id)}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9Z"/>
                      </svg>
                      <span>{issue.comments} comments</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </div>
  );
};

export default BrowseIssues;

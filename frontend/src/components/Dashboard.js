import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutModal from './LogoutModal';
import './Dashboard.css';

const Dashboard = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  const metrics = [
    {
      title: "Total Reports",
      value: "2,847",
      change: "+12% from last month",
      isPositive: true
    },
    {
      title: "Active Issues",
      value: "156",
      change: "-8% from last month",
      isPositive: false
    },
    {
      title: "Resolved This Month",
      value: "89",
      change: "+23% from last month",
      isPositive: true
    },
    {
      title: "Pending Issues",
      value: "47",
      change: "+5% from last month",
      isPositive: false
    }
  ];

  const issueCategories = [
    {
      name: "Garbage & Waste",
      count: 45,
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
        </svg>
      )
    },
    {
      name: "Potholes",
      count: 32,
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M4,6H20V8H4M6,2V4H18V2H20V4H22V6H20V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V6H2V4H4V2H6M6,8V20H18V8H6Z"/>
        </svg>
      )
    },
    {
      name: "Water Issues",
      count: 28,
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z"/>
        </svg>
      )
    },
    {
      name: "Street Lights",
      count: 21,
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M12,6A6,6 0 0,1 18,12C18,14.22 16.79,16.16 15,17.2V19A1,1 0 0,1 14,20H10A1,1 0 0,1 9,19V17.2C7.21,16.16 6,14.22 6,12A6,6 0 0,1 12,6M14,21V22A1,1 0 0,1 13,23H11A1,1 0 0,1 10,22V21H14M11,2H13V4H11V2Z"/>
        </svg>
      )
    }
  ];

  const recentReports = [
    {
      title: "Large pothole on Main Street",
      location: "Main St & 5th Ave",
      status: "pending",
      votes: 23,
      time: "2 hours ago"
    },
    {
      title: "Overflowing garbage bin",
      location: "Central Park entrance",
      status: "in progress",
      votes: 18,
      time: "4 hours ago"
    },
    {
      title: "Broken street light",
      location: "Oak Avenue",
      status: "resolved",
      votes: 31,
      time: "1 day ago"
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

  return (
    <div className="dashboard">
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
            <Link to="/dashboard" className="nav-link active">Dashboard</Link>
            <Link to="/browse" className="nav-link">Browse Issues</Link>
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
      <div className="dashboard-content">
        <div className="container">
          {/* Welcome Section */}
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome to Clean Street</h1>
            <p className="welcome-description">
              Together, we're making our community cleaner and safer. Report issues, track progress, and see the impact of your contributions.
            </p>
          </div>

          {/* Metrics Cards */}
          <div className="metrics-grid">
            {metrics.map((metric, index) => (
              <div key={index} className="metric-card">
                <h3 className="metric-title">{metric.title}</h3>
                <div className="metric-value">{metric.value}</div>
                <div className={`metric-change ${metric.isPositive ? 'positive' : 'negative'}`}>
                  {metric.change}
                </div>
              </div>
            ))}
          </div>

          {/* Content Grid */}
          <div className="content-grid">
            {/* Issue Categories */}
            <div className="content-section">
              <div className="section-header">
                <h2 className="section-title">Issue Categories</h2>
                <p className="section-subtitle">Current active issues by type</p>
              </div>
              
              <div className="categories-list">
                {issueCategories.map((category, index) => (
                  <div key={index} className="category-item">
                    <div className="category-icon">
                      {category.icon}
                    </div>
                    <div className="category-info">
                      <span className="category-name">{category.name}</span>
                      <span className="category-count">{category.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Reports */}
            <div className="content-section">
              <div className="section-header">
                <h2 className="section-title">Recent Reports</h2>
                <p className="section-subtitle">Latest issues reported by the community</p>
              </div>
              
              <div className="reports-list">
                {recentReports.map((report, index) => (
                  <div key={index} className="report-card">
                    <h4 className="report-title">{report.title}</h4>
                    <p className="report-location">{report.location}</p>
                    <div className="report-footer">
                      <span 
                        className="report-status"
                        style={{ backgroundColor: getStatusColor(report.status) }}
                      >
                        {report.status}
                      </span>
                      <span className="report-meta">{report.votes} votes • {report.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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

export default Dashboard;

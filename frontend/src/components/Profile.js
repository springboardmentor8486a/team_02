import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutModal from './LogoutModal';
import './Profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    username: 'johndoe2024',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, Cityville, ST 12345',
    about: 'Active community member passionate about improving our neighborhood. I believe in working together to create cleaner, safer streets for everyone.',
    joinDate: 'January 2024'
  });

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Here you would typically save to backend
    console.log('Profile saved:', profileData);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setProfileData({
      ...profileData,
      [field]: value
    });
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
    <div className="profile">
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
            <Link to="/browse" className="nav-link">Browse Issues</Link>
            <Link to="/report" className="nav-link">+ Report Issue</Link>
          </div>
          
          <div className="nav-user">
            <div className="user-info">
              <div className="user-avatar">JD</div>
              <span className="user-name">John Doe</span>
              <button className="logout-btn" onClick={handleLogout}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M14.08,15.59L16.67,13H7V11H16.67L14.08,8.41L15.5,7L20.5,12L15.5,17L14.08,15.59M19,3A2,2 0 0,1 21,5V9.67L19,7.67V5H5V19H19V16.33L21,14.33V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19Z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="profile-content">
        <div className="container">
          {/* User Summary Card */}
          <div className="user-summary-card">
            <div className="user-avatar-large">
              <span>JD</span>
            </div>
            
            <div className="user-details">
              <h1 className="user-name-large">{profileData.name}</h1>
              <p className="user-username">@{profileData.username}</p>
              <p className="user-join-date">Joined {profileData.joinDate}</p>
            </div>
            
            <div className="user-actions">
              <button 
                className="action-btn update-btn"
                onClick={handleEditProfile}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
                </svg>
                Update Profile
              </button>
              
              <button 
                className="action-btn logout-btn-large"
                onClick={handleLogout}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M14.08,15.59L16.67,13H7V11H16.67L14.08,8.41L15.5,7L20.5,12L15.5,17L14.08,15.59M19,3A2,2 0 0,1 21,5V9.67L19,7.67V5H5V19H19V16.33L21,14.33V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19Z"/>
                </svg>
                Logout
              </button>
            </div>
          </div>

          {/* Profile Information Card */}
          <div className="profile-info-card">
            <div className="card-header">
              <h2 className="card-title">Profile Information</h2>
              <p className="card-subtitle">Your personal information</p>
            </div>
            
            <div className="profile-fields">
              <div className="profile-field">
                <div className="field-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12,12C14.21,12 16,10.21 16,8C16,5.79 14.21,4 12,4C9.79,4 8,5.79 8,8C8,10.21 9.79,12 12,12M12,14C9.33,14 4,15.34 4,18V20H20V18C20,15.34 14.67,14 12,14Z"/>
                  </svg>
                </div>
                <div className="field-content">
                  <div className="field-label">Name/Username</div>
                  {isEditing ? (
                    <div className="edit-fields">
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="edit-input"
                      />
                      <input
                        type="text"
                        value={profileData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className="edit-input"
                        placeholder="@username"
                      />
                    </div>
                  ) : (
                    <div className="field-value">
                      {profileData.name} • @{profileData.username}
                    </div>
                  )}
                </div>
              </div>

              <div className="profile-field">
                <div className="field-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C2,4.89 21.1,4 20,4M20,8L12,13L4,8V6L12,11L20,6V8Z"/>
                  </svg>
                </div>
                <div className="field-content">
                  <div className="field-label">Email</div>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    <div className="field-value">{profileData.email}</div>
                  )}
                </div>
              </div>

              <div className="profile-field">
                <div className="field-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
                  </svg>
                </div>
                <div className="field-content">
                  <div className="field-label">Phone Number</div>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    <div className="field-value">{profileData.phone}</div>
                  )}
                </div>
              </div>

              <div className="profile-field">
                <div className="field-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12,2C8.13,2 5,5.13 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9C19,5.13 15.87,2 12,2M12,4A5,5 0 0,1 17,9C17,11.38 15.19,13.5 12,16.5C8.81,13.5 7,11.38 7,9A5,5 0 0,1 12,4M12,6.5A2.5,2.5 0 0,0 9.5,9A2.5,2.5 0 0,0 12,11.5A2.5,2.5 0 0,0 14.5,9A2.5,2.5 0 0,0 12,6.5Z"/>
                  </svg>
                </div>
                <div className="field-content">
                  <div className="field-label">Address</div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    <div className="field-value">{profileData.address}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* About Card */}
          <div className="about-card">
            <div className="card-header">
              <h2 className="card-title">About</h2>
            </div>
            
            <div className="about-content">
              {isEditing ? (
                <textarea
                  value={profileData.about}
                  onChange={(e) => handleInputChange('about', e.target.value)}
                  className="edit-textarea"
                  rows="4"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="about-text">{profileData.about}</p>
              )}
            </div>
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="edit-actions">
              <button 
                className="action-btn save-btn"
                onClick={handleSaveProfile}
              >
                Save Changes
              </button>
              <button 
                className="action-btn cancel-btn"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          )}
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

export default Profile;

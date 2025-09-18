import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutModal from './LogoutModal';
import './ReportIssue.css';

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    priority: 'medium',
    description: '',
    photo: null
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFormData({
        ...formData,
        photo: file
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Report data:', formData);
    // Add your report submission logic here
  };

  const handleSelectOnMap = () => {
    console.log('Select on map clicked');
    // Add map selection logic here
  };

  const handleUseCurrentLocation = () => {
    console.log('Use current location clicked');
    // Add geolocation logic here
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

  const categories = [
    'Potholes',
    'Garbage & Waste',
    'Street Lights',
    'Water Issues',
    'Traffic Signs',
    'Sidewalks',
    'Parks & Recreation',
    'Other'
  ];

  const priorities = [
    { value: 'low', label: 'Low - Minor issue' },
    { value: 'medium', label: 'Medium - Moderate issue' },
    { value: 'high', label: 'High - Serious issue' },
    { value: 'urgent', label: 'Urgent - Immediate attention needed' }
  ];

  return (
    <div className="report-issue">
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
            <Link to="/report" className="nav-link active">+ Report Issue</Link>
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
      <div className="report-content">
        <div className="container">
          {/* Page Header */}
          <div className="page-header">
            <h1 className="page-title">Report a Public Issue</h1>
            <p className="page-description">
              Help improve your community by reporting issues like potholes, broken streetlights, garbage, or water problems.
            </p>
          </div>

          {/* Report Form */}
          <form className="report-form" onSubmit={handleSubmit}>
            {/* Issue Title */}
            <div className="form-group">
              <label htmlFor="title" className="form-label">Issue Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief description of the issue"
                className="form-input"
                required
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category" className="form-label">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select issue category</option>
                {categories.map((category) => (
                  <option key={category} value={category.toLowerCase().replace(' & ', '-').replace(' ', '-')}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="form-group">
              <label htmlFor="location" className="form-label">Location</label>
              <div className="location-input-wrapper">
                <svg className="location-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12,2C8.13,2 5,5.13 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9C19,5.13 15.87,2 12,2M12,4A5,5 0 0,1 17,9C17,11.38 15.19,13.5 12,16.5C8.81,13.5 7,11.38 7,9A5,5 0 0,1 12,4M12,6.5A2.5,2.5 0 0,0 9.5,9A2.5,2.5 0 0,0 12,11.5A2.5,2.5 0 0,0 14.5,9A2.5,2.5 0 0,0 12,6.5Z"/>
                </svg>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Street address or landmark"
                  className="form-input location-input"
                  required
                />
              </div>
              
              <div className="location-buttons">
                <button 
                  type="button" 
                  className="location-btn map-btn"
                  onClick={handleSelectOnMap}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M12,2C8.13,2 5,5.13 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9C19,5.13 15.87,2 12,2M12,4A5,5 0 0,1 17,9C17,11.38 15.19,13.5 12,16.5C8.81,13.5 7,11.38 7,9A5,5 0 0,1 12,4M12,6.5A2.5,2.5 0 0,0 9.5,9A2.5,2.5 0 0,0 12,11.5A2.5,2.5 0 0,0 14.5,9A2.5,2.5 0 0,0 12,6.5Z"/>
                  </svg>
                  Select on Map
                </button>
                
                <button 
                  type="button" 
                  className="location-btn current-btn"
                  onClick={handleUseCurrentLocation}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z"/>
                  </svg>
                  Use Current Location
                </button>
              </div>
            </div>

            {/* Priority Level */}
            <div className="form-group">
              <label htmlFor="priority" className="form-label">Priority Level</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="form-select"
                required
              >
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide more details about the issue..."
                className="form-textarea"
                rows="5"
                required
              />
            </div>

            {/* Photo Evidence */}
            <div className="form-group">
              <label className="form-label">Photo Evidence</label>
              <div className="photo-upload-section">
                <div className="photo-upload-info">
                  <p className="photo-instruction">Add a photo to help authorities understand the issue</p>
                  <p className="photo-restrictions">JPG, PNG up to 10MB</p>
                </div>
                
                <div className="photo-upload-area">
                  <div className="camera-icon">
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                      <path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/>
                    </svg>
                  </div>
                  
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png"
                    className="file-input"
                  />
                  
                  <label htmlFor="photo" className="choose-photo-btn">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                    </svg>
                    Choose Photo
                  </label>
                  
                  {selectedFile && (
                    <p className="selected-file">Selected: {selectedFile.name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                Submit Report
              </button>
            </div>
          </form>
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

export default ReportIssue;

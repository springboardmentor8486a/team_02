import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, Mail, Phone, MapPin, ArrowLeft, Save, Upload, X, Shield
} from 'lucide-react';
import './EditVolunteerProfile.css';

const VolunteerEditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || 'Sarah Wilson',
    username: user?.username || 'sarah.wilson',
    email: user?.email || 'sarah.wilson@cleanstreet.org',
    phone: '+1 (555) 234 5678',
    district: 'North District',
    bio: 'Active community member passionate about improving our neighborhoods.'
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getUserInitials = (name) => {
    if (!name) return 'SW';
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setStatusMessage({ type: 'error', text: 'File size must be less than 5MB' });
        return;
      }
      
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setStatusMessage({ type: '', text: '' });
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    setPhotoPreview(null);
    document.getElementById('photoInput').value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage({ type: '', text: '' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would normally send data to your backend
      console.log('Form Data:', formData);
      console.log('Profile Photo:', profilePhoto);
      
      setStatusMessage({ 
        type: 'success', 
        text: 'Profile updated successfully!' 
      });
      
      // Redirect after success
      setTimeout(() => {
        navigate('/volunteer-profile');
      }, 2000);
      
    } catch (error) {
      setStatusMessage({ 
        type: 'error', 
        text: 'Failed to update profile. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="volunteer-edit-page">
      {/* Header */}
      <header className="volunteer-header-top">
        <div className="logo-section" onClick={() => navigate('/volunteer')}>
          <img src="/images/logo.png" alt="Clean Street" className="logo-image" />
          <span className="logo-text">Clean Street</span>
        </div>
        <div className="volunteer-badge">
          <Shield size={18} />
          <span>Volunteer</span>
        </div>
        <div className="back-to-profile">
          <button className="back-btn" onClick={() => navigate('/volunteer-profile')}>
            <ArrowLeft size={18} />
            Back to Profile
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="volunteer-edit-container">
        <div className="volunteer-edit-panel">
          {/* Panel Header */}
          <div className="panel-header">
            <User size={48} className="header-icon" />
            <h2>Edit Your Profile</h2>
            <p className="subtitle">Update your personal information</p>
          </div>

          {/* Status Message */}
          {statusMessage.text && (
            <div className={`status-message ${statusMessage.type}`}>
              {statusMessage.text}
            </div>
          )}

          {/* Form */}
          <form className="volunteer-edit-form" onSubmit={handleSubmit}>
            {/* Avatar Section */}
            <div className="avatar-section">
              <label className="avatar-label">Profile Photo</label>
              <div className="avatar-wrapper">
                {photoPreview ? (
                  <img 
                    src={photoPreview} 
                    alt="Profile Preview" 
                    className="profile-photo-preview"
                  />
                ) : (
                  <div className="volunteer-initials">
                    <span>{getUserInitials(formData.name)}</span>
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <label htmlFor="photoInput" className="volunteer-upload">
                    <Upload size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Upload Photo
                  </label>
                  <input
                    type="file"
                    id="photoInput"
                    className="file-input"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                  
                  {photoPreview && (
                    <button 
                      type="button" 
                      className="remove-photo-btn"
                      onClick={handleRemovePhoto}
                    >
                      <X size={16} />
                      Remove Photo
                    </button>
                  )}
                </div>
                <small style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                  Max file size: 5MB. Accepted formats: JPG, PNG, GIF
                </small>
              </div>
            </div>

            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name">
                <User size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Username Field (Read-only) */}
            <div className="form-group read-only-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                disabled
              />
              <small>Username cannot be changed</small>
            </div>

            {/* Email Field (Read-only) */}
            <div className="form-group read-only-group">
              <label htmlFor="email">
                <Mail size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
              />
              <small>Email cannot be changed</small>
            </div>

            {/* Phone Field */}
            <div className="form-group">
              <label htmlFor="phone">
                <Phone size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            {/* District Field */}
            <div className="form-group">
              <label htmlFor="district">
                <MapPin size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                District
              </label>
              <input
                type="text"
                id="district"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
              />
            </div>

            {/* Bio Field */}
            <div className="form-group">
              <label htmlFor="bio">About Me</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
                style={{
                  padding: '0.875rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  background: '#f9fafb',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="volunteer-save"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>Saving...</>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>

            {/* Password Link */}
            <div className="password-link">
              <a href="/change-password">Want to change your password?</a>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Clean Street. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default VolunteerEditProfile;
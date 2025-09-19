import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, LogOut, User, Phone, Mail, MapPin, CheckCircle, Star, Trophy, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  const handleUpdateProfile = () => {
    navigate('/update-profile');
  };

  const membershipBadges = [
    { name: 'Verified Member', icon: CheckCircle },
    { name: 'Community Helper', icon: Star },
    { name: 'Local Champion', icon: Trophy }
  ];

  return (
    <div className="user-profile">
      {/* Profile Banner */}
      <div className="profile-banner">
        <div className="banner-content">
          <div className="profile-avatar">
            <div className="avatar-circle">
              <span className="avatar-text">
                {(user?.name || 'John Doe').split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="profile-info">
            <h1 className="profile-name">{user?.name || 'John Doe'}</h1>
            <p className="profile-username">@{user?.username || 'johndoe2024'}</p>
            <p className="profile-join-date">Joined January 2024</p>
          </div>

          <div className="profile-actions">
            <button className="action-btn primary" onClick={handleUpdateProfile}>
              <Edit size={16} />
              Update Profile
            </button>
            <button className="action-btn secondary" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </button>
          </div>

        </div>
      </div>

      {/* Membership Badges */}
      <div className="membership-badges">
        {membershipBadges.map((badge, index) => {
          const IconComponent = badge.icon;
          return (
            <div key={index} className="membership-badge">
              <IconComponent size={16} />
              <span>{badge.name}</span>
            </div>
          );
        })}
      </div>

      {/* Profile Information Card */}
      <div className="profile-card">
        <div className="card-header">
          <div className="card-title-section">
            <h2 className="card-title">Profile Information</h2>
            <p className="card-subtitle">Your personal information and details</p>
          </div>
          <div className="premium-badge">
            <Crown size={16} />
            <span>Premium Member</span>
          </div>
        </div>

        <div className="contact-details-grid">
          <div className="contact-column">
            <div className="detail-item">
              <User size={20} />
              <div className="detail-content">
                <span className="detail-name">{user?.name || 'John Doe'}</span>
                <span className="detail-username">@{user?.username || 'johndoe2024'}</span>
              </div>
            </div>
            <div className="detail-item">
              <Mail size={20} />
              <div className="detail-content">
                <span className="detail-value">{user?.email || 'john.doe@email.com'}</span>
              </div>
            </div>
          </div>
          
          <div className="contact-column">
            <div className="detail-item">
              <Phone size={20} />
              <div className="detail-content">
                <span className="detail-value">+1 (555) 123-4567</span>
              </div>
            </div>
            <div className="detail-item">
              <MapPin size={20} />
              <div className="detail-content">
                <span className="detail-value">123 Main Street, Cityville, ST 12345</span>
              </div>
            </div>
          </div>
        </div>

        <div className="about-section">
          <div className="about-header">
            <User size={20} />
            <h3>About Me</h3>
          </div>
          <p className="about-text">
            Active community member passionate about improving our neighborhood. I believe in working together to create cleaner, safer streets for everyone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
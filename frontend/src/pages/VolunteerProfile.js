import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, Mail, Phone, MapPin, Edit, Award, Heart, Users, LogOut
} from 'lucide-react';
import './VolunteerProfile.css';

const VolunteerProfile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const profileData = {
    name: user?.name || 'Sarah Wilson',
    username: user?.username || 'sarah.wilson',
    email: user?.email || 'sarah.wilson@cleanstreet.org',
    phone: '+1 (555) 234 5678',
    district: 'North District',
    joinDate: '2/17/2024',
    role: 'volunteer',
    bio: 'Active community member passionate about improving our neighborhoods. I believe in working together to create cleaner, safer spaces for everyone.',
    badges: [
      { id: 1, name: 'Verified Member', active: true },
      { id: 2, name: 'Community Helper', active: true },
      { id: 3, name: 'Local Champion', active: false }
    ],
    stats: [
      { icon: Award, label: 'Trusted Member' },
      { icon: Heart, label: 'Community Love' },
      { icon: Users, label: 'Top Contributor' }
    ]
  };

  const getUserInitials = (name) => {
    if (!name) return 'SW';
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  const handleUpdateProfile = () => {
    alert('Update profile functionality coming soon!');
  };

  return (
    <div className="volunteer-profile-page">
      {/* Header */}
      <header className="vp-header">
        <div className="vp-header-content">
          <div className="vp-logo-section">
            <img src="/images/logo.png" alt="Clean Street" className="vp-logo-img" />
            <span className="vp-logo-text">Clean Street</span>
          </div>
          <nav className="vp-nav">
            <button onClick={() => navigate('/volunteer')} className="vp-nav-link">Dashboard</button>
            <button onClick={() => navigate('/MyAssignedIssues')} className="vp-nav-link">My Assigned Issues</button>
            <button onClick={() => navigate('/volunteer-browser-issues')} className="vp-nav-link">Browse Issues</button>
          </nav>
          <div className="vp-user-section">
            <div className="vp-user-avatar">{getUserInitials(profileData.name)}</div>
            <span className="vp-user-name">{profileData.name} <span className="vp-user-role">(volunteer)</span></span>
            <button className="vp-logout-btn" onClick={handleLogout}>⚙️</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="vp-hero">
        <div className="vp-hero-bg"></div>
        <div className="vp-hero-content">
          <div className="vp-avatar-large">{getUserInitials(profileData.name)}</div>
          <h1 className="vp-hero-name">{profileData.name}</h1>
          <p className="vp-hero-username">@{profileData.username}</p>
          <p className="vp-hero-meta">
            <User size={14} />
            Joined {profileData.joinDate} • {profileData.role}
          </p>
          <div className="vp-hero-actions">
            <button className="vp-btn-update" onClick={handleUpdateProfile}>
              <Edit size={16} />
              Update Profile
            </button>
            <button className="vp-btn-logout" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
          <div className="vp-badges">
            {profileData.badges.map(badge => (
              <span key={badge.id} className={`vp-badge ${badge.active ? 'active' : ''}`}>
                {badge.active && '✓'} {badge.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="vp-tabs-container">
        <div className="vp-tabs">
          <button 
            className={`vp-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            Profile Information
          </button>
          <button 
            className={`vp-tab ${activeTab === 'badges' ? 'active' : ''}`}
            onClick={() => setActiveTab('badges')}
          >
            <Award size={18} />
            Verified Volunteer
          </button>
        </div>
        <div className="vp-premium-badge">
          🛡️ Premium Member
        </div>
      </div>

      {/* Main Content */}
      <main className="vp-main">
        {activeTab === 'profile' && (
          <>
            {/* Profile Information Card */}
            <div className="vp-card">
              <div className="vp-card-header">
                <div>
                  <h2 className="vp-card-title">
                    <User size={20} />
                    Profile Information
                  </h2>
                  <p className="vp-card-subtitle">Your personal information and details</p>
                </div>
              </div>
              <div className="vp-info-grid">
                <div className="vp-info-item">
                  <div className="vp-info-icon">
                    <User size={18} />
                  </div>
                  <div className="vp-info-content">
                    <p className="vp-info-label">{profileData.name}</p>
                    <p className="vp-info-sublabel">sarah.wilson</p>
                  </div>
                </div>
                <div className="vp-info-item">
                  <div className="vp-info-icon">
                    <Phone size={18} />
                  </div>
                  <div className="vp-info-content">
                    <p className="vp-info-label">{profileData.phone}</p>
                  </div>
                </div>
                <div className="vp-info-item">
                  <div className="vp-info-icon">
                    <Mail size={18} />
                  </div>
                  <div className="vp-info-content">
                    <p className="vp-info-label">{profileData.email}</p>
                  </div>
                </div>
                <div className="vp-info-item">
                  <div className="vp-info-icon">
                    <MapPin size={18} />
                  </div>
                  <div className="vp-info-content">
                    <p className="vp-info-label">{profileData.district}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* About Me Card */}
            <div className="vp-card">
              <h2 className="vp-card-title">
                <Award size={20} />
                About Me
              </h2>
              <p className="vp-about-text">{profileData.bio}</p>
            </div>

            {/* Stats Cards */}
            <div className="vp-stats-grid">
              {profileData.stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="vp-stat-card">
                    <div className="vp-stat-icon">
                      <Icon size={28} />
                    </div>
                    <p className="vp-stat-label">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {activeTab === 'badges' && (
          <div className="vp-card">
            <h2 className="vp-card-title">
              <Award size={20} />
              Verified Volunteer
            </h2>
            <p className="vp-about-text">Official volunteer helping improve the community</p>
          </div>
        )}

        {/* CTA Banner */}
        <div className="vp-cta-banner">
          <div className="vp-cta-overlay"></div>
          <div className="vp-cta-content">
            <h2>Building Better Communities Together</h2>
            <p>Every report makes our neighborhood cleaner and safer</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VolunteerProfile;
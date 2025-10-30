import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, MapPin, Clock, Briefcase, Award, Heart, CheckCircle, LogOut, Phone, Globe, ArrowRight, Edit3 } from 'lucide-react';
import './VolunteerProfile.css';
import VolunteerHeader from '../components/VolunteerHeader.jsx';
import VolunteerFooter from '../components/VolunteerFooter.jsx';

const VolunteerProfile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Robust fallback chain for display name
  const profileName =
    user?.fullName ||
    user?.name ||
    user?.username ||
    (user?.email ? user.email.split('@')[0] : '') ||
    'Volunteer';
  const profileEmail = user?.email || '';
  const profileUsername = user?.username || (user?.email ? user.email.split('@')[0] : '');
  const profilePhone = user?.phone || '';
  const profileDistrict = user?.location || '';
  const profileJoined = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '';
  const profileRole = user?.role || '';
  const profileBio = user?.bio || 'No bio yet. Click "Edit Profile" to add one!';

  const getUserInitials = (n) => {
    if (!n) return '';
    return n.split(' ').map(part => part[0]).join('').toUpperCase();
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      signOut();
      navigate('/');
    }
  };

  const InfoField = ({ icon: Icon, label, value }) => (
    <div className="info-item">
      <Icon size={20} />
      <div className="info-text-inline">
        <span className="info-label">{label}:</span>
        <strong className="info-value">{value}</strong>
      </div>
    </div>
  );

  return (
    <>
      <VolunteerHeader />
      <div className="profile-page-container">
        <div className="profile-sidebar">
          <div className="profile-avatar-large">
            <span>{getUserInitials(profileName)}</span>
          </div>
          <h2 className="profile-name">{profileName}</h2>
          <p className="profile-username">@{profileUsername}</p>
          <p className="profile-joined">{profileJoined}</p>

          <div className="profile-actions">
            <button className="update-profile-btn" onClick={() => navigate('/edit-volunteer-profile')}>
              <Edit3 size={16} /> Edit Profile
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
          </div>

          <div className="profile-badges">
            <div className="badge verified">
              <CheckCircle size={16} /> Verified Volunteer
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-main-content">
          {/* Contact and Role Information */}
          <div className="profile-panel">
            <div className="panel-header-details">
              <div>
                <h3>Volunteer Contact Details</h3>
                <p>Your primary contact and assigned work area information</p>
              </div>
            </div>
            <div className="profile-info-grid">
              <InfoField icon={User} label="Full Name" value={profileName} />
              <InfoField icon={Briefcase} label="Role" value={profileRole} />
              <InfoField icon={Mail} label="Email Address" value={profileEmail} />
              <InfoField icon={Phone} label="Phone Number" value={profilePhone} />
              <InfoField icon={MapPin} label="Assigned District" value={profileDistrict} />
              <InfoField icon={Globe} label="Member Since" value={profileJoined} />
            </div>
          </div>

          {/* About Me panel */}
          <div className="profile-panel about-me-panel">
            <h3>About Me</h3>
            <p>{profileBio}</p>
          </div>
        </div>
      </div>
      <VolunteerFooter />
    </>
  );
};

export default VolunteerProfile;
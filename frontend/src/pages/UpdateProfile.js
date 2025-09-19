import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Save, 
  X, 
  LogOut,
  Crown,
  CheckCircle,
  Star,
  Trophy
} from 'lucide-react';
import './UpdateProfile.css';

const UpdateProfile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, Cityville, ST 12345',
    role: user?.role || 'Citizen',
    joinDate: 'January 2024'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically save the data to your backend
    alert('Profile updated successfully!');
    navigate('/profile');
  };

  const handleLogout = () => {
    signOut();
    setShowLogoutModal(false);
    navigate('/');
  };

  const membershipBadges = [
    { icon: CheckCircle, label: 'Verified Member', color: '#10b981' },
    { icon: Star, label: 'Community Helper', color: '#f59e0b' },
    { icon: Trophy, label: 'Local Champion', color: '#8b5cf6' }
  ];

  return React.createElement('div', { className: 'update-profile' },
    React.createElement('div', { className: 'profile-banner' },
      React.createElement('div', { className: 'banner-content' },
        React.createElement('h1', { className: 'profile-name' }, user?.name || 'John Doe'),
        React.createElement('p', { className: 'profile-username' }, 
          '@' + (user?.name ? user.name.toLowerCase().replace(/\s+/g, '') + '2024' : 'johndoe2024')
        ),
        React.createElement('p', { className: 'profile-join-date' }, 'Joined January 2024'),
        
        React.createElement('div', { className: 'banner-actions' },
          React.createElement(Link, { to: '/profile', className: 'btn btn-secondary' },
            React.createElement(X, { size: 16 }),
            'Cancel'
          ),
          React.createElement('button', 
            { 
              className: 'btn btn-danger',
              onClick: () => setShowLogoutModal(true)
            },
            React.createElement(LogOut, { size: 16 }),
            'Logout'
          )
        )
      )
    ),

    React.createElement('div', { className: 'profile-card' },
      React.createElement('div', { className: 'card-header' },
        React.createElement('div', { className: 'card-title-section' },
          React.createElement('h2', { className: 'card-title' }, 'Profile Information'),
          React.createElement('p', { className: 'card-subtitle' }, 'Update your personal information and details')
        ),
        React.createElement('div', { className: 'premium-badge' },
          React.createElement(Crown, { size: 16 }),
          'Premium Member'
        )
      ),

      React.createElement('div', { className: 'membership-badges' },
        membershipBadges.map((badge, index) => 
          React.createElement('div', { key: index, className: 'membership-badge' },
            React.createElement(badge.icon, { size: 16, color: badge.color }),
            badge.label
          )
        )
      ),

      React.createElement('div', { className: 'contact-details-grid' },
        React.createElement('div', { className: 'contact-column' },
          React.createElement('div', { className: 'detail-item' },
            React.createElement(User, { size: 20, className: 'detail-icon' }),
            React.createElement('div', { className: 'detail-content' },
              React.createElement('label', { className: 'detail-label' }, 'Full Name'),
              React.createElement('input',
                {
                  type: 'text',
                  name: 'name',
                  value: formData.name,
                  onChange: handleInputChange,
                  className: 'form-input'
                }
              )
            )
          ),
          React.createElement('div', { className: 'detail-item' },
            React.createElement(Mail, { size: 20, className: 'detail-icon' }),
            React.createElement('div', { className: 'detail-content' },
              React.createElement('label', { className: 'detail-label' }, 'Email Address'),
              React.createElement('input',
                {
                  type: 'email',
                  name: 'email',
                  value: formData.email,
                  onChange: handleInputChange,
                  className: 'form-input'
                }
              )
            )
          )
        ),
        React.createElement('div', { className: 'contact-column' },
          React.createElement('div', { className: 'detail-item' },
            React.createElement(Phone, { size: 20, className: 'detail-icon' }),
            React.createElement('div', { className: 'detail-content' },
              React.createElement('label', { className: 'detail-label' }, 'Phone Number'),
              React.createElement('input',
                {
                  type: 'tel',
                  name: 'phone',
                  value: formData.phone,
                  onChange: handleInputChange,
                  className: 'form-input'
                }
              )
            )
          ),
          React.createElement('div', { className: 'detail-item' },
            React.createElement(MapPin, { size: 20, className: 'detail-icon' }),
            React.createElement('div', { className: 'detail-content' },
              React.createElement('label', { className: 'detail-label' }, 'Address'),
              React.createElement('input',
                {
                  type: 'text',
                  name: 'address',
                  value: formData.address,
                  onChange: handleInputChange,
                  className: 'form-input'
                }
              )
            )
          )
        )
      ),

      React.createElement('div', { className: 'about-section' },
        React.createElement('div', { className: 'about-header' },
          React.createElement(User, { size: 20 }),
          React.createElement('h3', null, 'About Me')
        ),
        React.createElement('textarea',
          {
            name: 'about',
            placeholder: 'Tell us about yourself...',
            className: 'form-textarea',
            rows: 4
          }
        )
      ),

      React.createElement('div', { className: 'form-actions' },
        React.createElement('button', 
          { 
            className: 'btn btn-primary',
            onClick: handleSave
          },
          React.createElement(Save, { size: 16 }),
          'Save Changes'
        )
      )
    ),

    // Logout Confirmation Modal
    showLogoutModal && 
    React.createElement('div', { className: 'modal-overlay' },
      React.createElement('div', { className: 'modal-content' },
        React.createElement('div', { className: 'modal-header' },
          React.createElement('h3', null, 'Confirm Logout'),
          React.createElement('button',
            {
              className: 'close-btn',
              onClick: () => setShowLogoutModal(false)
            },
            '×'
          )
        ),
        React.createElement('div', { className: 'modal-body' },
          React.createElement('p', null, 'Are you sure you want to logout?')
        ),
        React.createElement('div', { className: 'modal-footer' },
          React.createElement('button',
            {
              className: 'btn btn-secondary',
              onClick: () => setShowLogoutModal(false)
            },
            'Cancel'
          ),
          React.createElement('button',
            {
              className: 'btn btn-primary',
              onClick: handleLogout
            },
            'OK'
          )
        )
      )
    )
  );
};

export default UpdateProfile;
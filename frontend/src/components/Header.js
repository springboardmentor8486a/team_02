import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Home, ArrowRight, Menu, X, BarChart3, Eye, Plus, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn, signOut, user } = useAuth();

  const handleSignIn = () => {
    navigate('/signin');
  };
  
  return React.createElement('header', { className: 'header' },
    React.createElement('div', { className: 'header-container' },
      // Logo Section
      React.createElement('div', { className: 'header-logo-section' },
        React.createElement('div', { className: 'header-logo-icon' },
          React.createElement('div', { 
            className: 'logo-icon',
            style: { 
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }
          }, 'CS')
        ),
        React.createElement('span', { className: 'header-logo-text' },
          'Clean Street'
        )
      ),

      // Navigation Section
      React.createElement('nav', { className: 'header-nav' },
        isSignedIn ? 
          // Signed In Navigation
          React.createElement(React.Fragment, null,
            React.createElement(Link, { 
              to: '/dashboard', 
              className: `nav-link ${location.pathname === '/dashboard' ? 'active' : ''}` 
            },
              React.createElement(BarChart3, { size: 18 }),
              'Dashboard'
            ),
            React.createElement(Link, { 
              to: '/browse-issues', 
              className: `nav-link ${location.pathname === '/browse-issues' ? 'active' : ''}` 
            },
              React.createElement(Eye, { size: 18 }),
              'Browse Issues'
            ),
            React.createElement(Link, { 
              to: '/report-issue', 
              className: `nav-link ${location.pathname === '/report-issue' ? 'active' : ''}` 
            },
              React.createElement(Plus, { size: 18 }),
              'Report Issue'
            )
          ) :
          // Not Signed In Navigation
          React.createElement(React.Fragment, null,
            React.createElement(Link, { 
              to: '/', 
              className: `nav-link ${location.pathname === '/' ? 'active' : ''}` 
            },
              React.createElement(Home, { size: 18 }),
              'Home'
            ),
            React.createElement(Link, { 
              to: '/help', 
              className: `nav-link ${location.pathname === '/help' ? 'active' : ''}` 
            },
              'Help'
            ),
            React.createElement(Link, { 
              to: '/contact', 
              className: `nav-link ${location.pathname === '/contact' ? 'active' : ''}` 
            },
              'Contact'
            ),
            React.createElement(Link, { 
              to: '/about', 
              className: `nav-link ${location.pathname === '/about' ? 'active' : ''}` 
            },
              'About'
            )
          )
      ),

      // Actions Section
      React.createElement('div', { className: 'header-actions' },
        isSignedIn ? 
          // Signed In - Show User Profile
          React.createElement('div', { 
            className: 'user-profile-bar',
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef',
              cursor: 'pointer',
              textDecoration: 'none',
              color: '#374151'
            },
            onClick: () => navigate('/profile')
          },
            React.createElement('div', { 
              className: 'profile-avatar',
              style: {
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '14px'
              }
            }, 'JD'),
            React.createElement('span', { 
              className: 'profile-name',
              style: {
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }
            }, 'John Doe')
          ) :
          // Not Signed In - Show Sign In Button
          React.createElement('button', { 
            className: 'signin-btn',
            onClick: handleSignIn
          },
            'Sign In',
            React.createElement(ArrowRight, { size: 16 })
          ),

        // Mobile Menu Button
        React.createElement('button', {
          className: 'mobile-menu-btn',
          onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen)
        },
          isMobileMenuOpen ? React.createElement(X, { size: 24 }) : React.createElement(Menu, { size: 24 })
        )
      ),

      // Mobile Menu
      isMobileMenuOpen && React.createElement('div', { className: 'mobile-menu' },
        isSignedIn ? 
          // Signed In Mobile Menu
          React.createElement(React.Fragment, null,
            React.createElement(Link, { 
              to: '/dashboard', 
              className: `mobile-link ${location.pathname === '/dashboard' ? 'active' : ''}`,
              onClick: () => setIsMobileMenuOpen(false)
            },
              React.createElement(BarChart3, { size: 18 }),
              'Dashboard'
            ),
            React.createElement(Link, { 
              to: '/browse-issues', 
              className: `mobile-link ${location.pathname === '/browse-issues' ? 'active' : ''}`,
              onClick: () => setIsMobileMenuOpen(false)
            },
              React.createElement(Eye, { size: 18 }),
              'Browse Issues'
            ),
            React.createElement(Link, { 
              to: '/report-issue', 
              className: `mobile-link ${location.pathname === '/report-issue' ? 'active' : ''}`,
              onClick: () => setIsMobileMenuOpen(false)
            },
              React.createElement(Plus, { size: 18 }),
              'Report Issue'
            ),
            React.createElement('div', { className: 'mobile-actions' },
              React.createElement(Link, { 
                to: '/profile', 
                className: 'mobile-profile-btn',
                onClick: () => setIsMobileMenuOpen(false)
              },
                React.createElement(User, { size: 18 }),
                'Profile'
              )
            )
          ) :
          // Not Signed In Mobile Menu
          React.createElement(React.Fragment, null,
            React.createElement(Link, { 
              to: '/', 
              className: `mobile-link ${location.pathname === '/' ? 'active' : ''}`,
              onClick: () => setIsMobileMenuOpen(false)
            },
              React.createElement(Home, { size: 18 }),
              'Home'
            ),
            React.createElement(Link, { 
              to: '/help', 
              className: `mobile-link ${location.pathname === '/help' ? 'active' : ''}`,
              onClick: () => setIsMobileMenuOpen(false)
            },
              'Help'
            ),
            React.createElement(Link, { 
              to: '/contact', 
              className: `mobile-link ${location.pathname === '/contact' ? 'active' : ''}`,
              onClick: () => setIsMobileMenuOpen(false)
            },
              'Contact'
            ),
            React.createElement(Link, { 
              to: '/about', 
              className: `mobile-link ${location.pathname === '/about' ? 'active' : ''}`,
              onClick: () => setIsMobileMenuOpen(false)
            },
              'About'
            ),
            React.createElement('div', { className: 'mobile-actions' },
              React.createElement('button', { 
                className: 'mobile-signin-btn',
                onClick: () => {
                  handleSignIn();
                  setIsMobileMenuOpen(false);
                }
              },
                'Sign In'
              )
            )
          )
      )
    )
  );
};

export default Header;

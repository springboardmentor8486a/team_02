import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Smartphone, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleGetStarted = () => {
    navigate('/get-started');
  };

  // Force initial state to be not signed in
  console.log('Hero component - isSignedIn:', isSignedIn);
  return React.createElement('div', { className: 'hero-page' },
    // Header Section
    React.createElement('header', { className: 'hero-header' },
      React.createElement('div', { className: 'hero-header-container' },
        // Logo Section
        React.createElement('div', { className: 'hero-logo-section' },
          React.createElement('div', { className: 'hero-logo' },
            React.createElement('div', { className: 'hero-logo-icon' },
              React.createElement('img', {
                src: '/clean-street-logo.svg',
                alt: 'Clean Street Logo',
                style: {
                  width: '40px',
                  height: '40px',
                  objectFit: 'contain'
                }
              })
            ),
            React.createElement('div', { className: 'hero-logo-text' },
              React.createElement('h1', { className: 'hero-logo-title' }, 'Clean Street'),
              React.createElement('p', { className: 'hero-logo-subtitle' }, 'Civic Engagement Platform')
            )
          )
        ),

        // Conditional Navigation based on sign-in state
        isSignedIn ? 
          // Signed In Navigation - Dashboard, Browse Issues, Report Issues
          React.createElement('nav', { className: 'hero-nav' },
            React.createElement('a', { href: '/dashboard', className: 'hero-nav-link active' }, 'Dashboard'),
            React.createElement('a', { href: '/browse-issues', className: 'hero-nav-link' }, 'Browse Issues'),
            React.createElement('a', { href: '/report-issue', className: 'hero-nav-link' }, 'Report Issues')
          ) :
          // Not Signed In - Show basic navigation: Home, Help, Contact, About
          React.createElement('nav', { className: 'hero-nav' },
            React.createElement('a', { href: '/', className: 'hero-nav-link active' }, 'Home'),
            React.createElement('a', { href: '/help', className: 'hero-nav-link' }, 'Help'),
            React.createElement('a', { href: '/contact', className: 'hero-nav-link' }, 'Contact'),
            React.createElement('a', { href: '/about', className: 'hero-nav-link' }, 'About')
          ),

        // Right side - User Profile or Action Buttons
        isSignedIn ? 
          // Signed In - Show User Profile (John Doe) with Profile link
          React.createElement('div', { className: 'hero-right-section' },
            React.createElement('a', { href: '/profile', className: 'hero-user-profile' },
              React.createElement('div', { className: 'hero-user-avatar' }, 'JD'),
              React.createElement('span', { className: 'hero-user-name' }, 'John Doe')
            )
          ) :
          // Not Signed In - Show Sign In and Get Started buttons
          React.createElement('div', { className: 'hero-actions' },
            React.createElement('button', { 
              className: 'hero-btn-signin',
              onClick: handleSignIn
            },
              'Sign In',
              React.createElement(ArrowRight, { size: 16 })
            ),
            React.createElement('button', { 
              className: 'hero-btn-getstarted',
              onClick: handleGetStarted
            },
              'Get Started'
            )
          )
      )
    ),

    // Main Hero Section
    React.createElement('section', { className: 'hero-main' },
      React.createElement('div', { className: 'hero-main-container' },
        // Left Content
        React.createElement('div', { className: 'hero-content' },
          React.createElement('p', { className: 'hero-badge-text' },
            'Empowering Communities Since 2024'
          ),
          
          React.createElement('h1', { className: 'hero-main-title' },
            'Make Your ',
            React.createElement('span', { className: 'hero-title-highlight' }, 'Community'),
            ' Better'
          ),
          
          React.createElement('p', { className: 'hero-main-description' },
            'Clean Street is a smart civic engagement platform that empowers citizens to report local issues, track their resolution, and build stronger communities through collaborative action.'
          ),
          
          React.createElement('div', { className: 'hero-main-buttons' },
            React.createElement('button', { 
              className: 'hero-btn-primary',
              onClick: handleGetStarted
            },
              'Get Started Free',
              React.createElement(ArrowRight, { size: 20 })
            ),
            React.createElement('button', { className: 'hero-btn-secondary' },
              'Learn More'
            )
          )
        ),

        // Right Content - Image
        React.createElement('div', { className: 'hero-image-section' },
          React.createElement('div', { className: 'hero-main-image' },
            // Community meeting image
            React.createElement('div', { className: 'hero-image-content' },
              React.createElement('div', { 
                className: 'hero-community-image',
                style: {
                  width: '100%',
                  height: '300px',
                  background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 50%, #a5d6a7 100%)',
                  borderRadius: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }
              },
                // Outdoor scene with larger community meeting
                React.createElement('div', {
                  style: {
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }
                },
                  // Background trees
                  React.createElement('div', {
                    style: {
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      width: '30px',
                      height: '40px',
                      background: '#4caf50',
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      opacity: 0.7
                    }
                  }),
                  React.createElement('div', {
                    style: {
                      position: 'absolute',
                      top: '15px',
                      left: '8px',
                      width: '20px',
                      height: '25px',
                      background: '#2e7d32',
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      opacity: 0.8
                    }
                  }),
                  
                  React.createElement('div', {
                    style: {
                      position: 'absolute',
                      top: '20px',
                      right: '15px',
                      width: '25px',
                      height: '35px',
                      background: '#66bb6a',
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      opacity: 0.6
                    }
                  }),
                  
                  // Winding path
                  React.createElement('div', {
                    style: {
                      position: 'absolute',
                      bottom: '20px',
                      left: '20px',
                      width: '80px',
                      height: '8px',
                      background: '#8d6e63',
                      borderRadius: '4px',
                      transform: 'rotate(-15deg)',
                      opacity: 0.7
                    }
                  }),
                  React.createElement('div', {
                    style: {
                      position: 'absolute',
                      bottom: '30px',
                      left: '60px',
                      width: '60px',
                      height: '6px',
                      background: '#8d6e63',
                      borderRadius: '3px',
                      transform: 'rotate(10deg)',
                      opacity: 0.6
                    }
                  }),
                  
                  // Park bench
                  React.createElement('div', {
                    style: {
                      position: 'absolute',
                      bottom: '40px',
                      right: '20px',
                      width: '40px',
                      height: '8px',
                      background: '#8d6e63',
                      borderRadius: '2px'
                    }
                  }),
                  React.createElement('div', {
                    style: {
                      position: 'absolute',
                      bottom: '32px',
                      right: '18px',
                      width: '4px',
                      height: '16px',
                      background: '#5d4037'
                    }
                  }),
                  React.createElement('div', {
                    style: {
                      position: 'absolute',
                      bottom: '32px',
                      right: '38px',
                      width: '4px',
                      height: '16px',
                      background: '#5d4037'
                    }
                  }),
                  
                  // Large community circle with 20+ people
                  React.createElement('div', {
                    style: {
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '240px',
                      height: '240px'
                    }
                  },
                    // Generate 24 people in a circle (every 15 degrees)
                    ...Array.from({ length: 24 }, (_, i) => {
                      const angle = (i * 15) * (Math.PI / 180);
                      const radius = 100;
                      const x = Math.cos(angle) * radius;
                      const y = Math.sin(angle) * radius;
                      
                      return React.createElement('div', { key: i },
                        // White chair
                        React.createElement('div', {
                          style: {
                            position: 'absolute',
                            top: `${120 + y - 15}px`,
                            left: `${120 + x - 8}px`,
                            width: '16px',
                            height: '20px',
                            background: 'white',
                            borderRadius: '2px',
                            border: '1px solid #e0e0e0',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }
                        }),
                        // Person head
                        React.createElement('div', {
                          style: {
                            position: 'absolute',
                            top: `${120 + y - 20}px`,
                            left: `${120 + x - 6}px`,
                            width: '12px',
                            height: '12px',
                            background: i % 3 === 0 ? '#ffcdd2' : i % 3 === 1 ? '#f8bbd9' : '#e1bee7',
                            borderRadius: '50%',
                            border: '1px solid #e57373'
                          }
                        }),
                        // Person body
                        React.createElement('div', {
                          style: {
                            position: 'absolute',
                            top: `${120 + y - 8}px`,
                            left: `${120 + x - 5}px`,
                            width: '10px',
                            height: '12px',
                            background: i % 4 === 0 ? '#2196f3' : i % 4 === 1 ? '#4caf50' : i % 4 === 2 ? '#ff9800' : '#9c27b0',
                            borderRadius: '2px'
                          }
                        })
                      );
                    }),
                    
                    // Center meeting area
                    React.createElement('div', {
                      style: {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80px',
                        height: '80px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        border: '3px dashed #4caf50',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }
                    },
                      React.createElement('div', {
                        style: {
                          width: '30px',
                          height: '30px',
                          background: '#4caf50',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }
                      }, 'CS')
                    )
                  ),
                  
                  // Meeting text
                  React.createElement('div', {
                    style: {
                      position: 'absolute',
                      bottom: '15px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      textAlign: 'center',
                      color: '#2e7d32',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: 'rgba(255, 255, 255, 0.9)',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }
                  }, 'Community Meeting')
                )
              )
            ),
            
            // Success Badge
            React.createElement('div', { className: 'hero-success-badge' },
              React.createElement(CheckCircle, { size: 16 }),
              ' Issue Resolved!'
            ),
            
            // Mobile Badge
            React.createElement('div', { className: 'hero-mobile-badge' },
              React.createElement(Smartphone, { size: 16 }),
              ' Mobile Ready'
            )
          )
        )
      )
    ),

    // Stats Section
    React.createElement('section', { className: 'hero-stats-section' },
      React.createElement('div', { className: 'hero-stats-container' },
        React.createElement('div', { className: 'hero-stat-item' },
          React.createElement('h3', { className: 'hero-stat-number hero-stat-blue' },
            '1,500+'
          ),
          React.createElement('p', { className: 'hero-stat-label' },
            'Issues Reported'
          )
        ),
        React.createElement('div', { className: 'hero-stat-item' },
          React.createElement('h3', { className: 'hero-stat-number hero-stat-green' },
            '80%'
          ),
          React.createElement('p', { className: 'hero-stat-label' },
            'Resolution Rate'
          )
        ),
        React.createElement('div', { className: 'hero-stat-item' },
          React.createElement('h3', { className: 'hero-stat-number hero-stat-purple' },
            '50+'
          ),
          React.createElement('p', { className: 'hero-stat-label' },
            'Partner Cities'
          )
        )
      )
    )
  );
};

export default Hero;

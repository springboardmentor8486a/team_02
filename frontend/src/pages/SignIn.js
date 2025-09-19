import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, MapPin, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SignIn = ({ defaultTab = 'signin' }) => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: 'John Doe',
    location: 'City, State',
    role: 'citizen'
  });
  const [showSocialForm, setShowSocialForm] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [socialFormData, setSocialFormData] = useState({
    email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { tab: activeTab, data: formData });
    
    // Check if form is valid (has required fields)
    if (activeTab === 'signin') {
      if (formData.email && formData.password) {
        // Sign in the user with auth context
        signIn({
          name: 'John Doe',
          email: formData.email,
          role: 'citizen'
        });
        // Navigate to dashboard only after successful sign in
        navigate('/dashboard');
      } else {
        alert('Please enter both email and password');
      }
    } else {
      // For sign up, check all required fields
      if (formData.name && formData.email && formData.password && formData.location) {
        // Sign in the user with auth context
        signIn({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          location: formData.location
        });
        navigate('/dashboard');
      } else {
        alert('Please fill in all required fields');
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSocialLogin = (provider) => {
    console.log(`Signing in with ${provider}`);
    setSelectedProvider(provider);
    setShowSocialForm(true);
    
    // Pre-fill email based on provider
    setSocialFormData({
      email: `user@${provider.toLowerCase()}.com`
    });
  };

  const handleSocialFormSubmit = (e) => {
    e.preventDefault();
    
    if (!socialFormData.email) {
      alert('Please enter your email address');
      return;
    }
    
    // Sign in the user with auth context
    signIn({
      name: `${selectedProvider} User`,
      email: socialFormData.email,
      role: 'citizen',
      location: 'City, State',
      provider: selectedProvider
    });
    
    // Show success message
    alert(`Successfully signed in with ${selectedProvider}!`);
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  const handleSocialFormChange = (e) => {
    setSocialFormData({
      ...socialFormData,
      [e.target.name]: e.target.value
    });
  };

  return React.createElement('div', {
    style: {
      minHeight: '100vh',
      display: 'flex',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }
  },
    // Left Panel - Sign In Form
    React.createElement('div', {
      style: {
        flex: 1,
        background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative'
      }
    },
      // Back to Website Button
      React.createElement('button', {
        onClick: () => navigate('/'),
        style: {
          position: 'fixed',
          top: '20px',
          left: '20px',
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          color: '#2563eb',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          padding: '8px 16px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          transition: 'all 0.2s ease'
        },
        onMouseEnter: (e) => {
          e.target.style.background = '#f8fafc';
          e.target.style.borderColor = '#2563eb';
          e.target.style.transform = 'translateY(-1px)';
        },
        onMouseLeave: (e) => {
          e.target.style.background = 'white';
          e.target.style.borderColor = '#e5e7eb';
          e.target.style.transform = 'translateY(0)';
        }
      }, '← Back to Website'),

      // Sign In Form Card
      React.createElement('div', {
        style: {
          width: '100%',
          maxWidth: '400px',
          background: 'white',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }
      },
        // Logo and Title
        React.createElement('div', {
          style: {
            textAlign: 'center',
            marginBottom: '2rem'
          }
        },
          React.createElement('div', {
            style: {
              width: '60px',
              height: '60px',
              background: '#2563eb',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }
          },
            React.createElement(MapPin, { size: 28, color: 'white' })
          ),
          React.createElement('h1', {
            style: {
              fontSize: '28px',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '0.5rem'
            }
          }, 'Welcome Back'),
          React.createElement('p', {
            style: {
              fontSize: '16px',
              color: '#6b7280',
              margin: 0
            }
          }, 'Sign in to continue to CleanStreet')
        ),

        // Form Content
        React.createElement('form', { onSubmit: handleSubmit },
          // Email Field
          React.createElement('div', { style: { marginBottom: '1.5rem' } },
            React.createElement('label', {
              style: { 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500', 
                color: '#374151', 
                fontSize: '14px' 
              }
            }, 'Email Address'),
            React.createElement('div', {
              style: {
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }
            },
              React.createElement(User, {
                size: 20,
                style: {
                  position: 'absolute',
                  left: '12px',
                  color: '#9ca3af',
                  zIndex: 1
                }
              }),
              React.createElement('input', {
                type: 'email',
                name: 'email',
                value: formData.email,
                onChange: handleChange,
                placeholder: 'Enter your email',
                required: true,
                style: {
                  width: '100%',
                  padding: '12px 12px 12px 44px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  background: 'white'
                }
              })
            )
          ),

          // Password Field
          React.createElement('div', { style: { marginBottom: '1.5rem' } },
            React.createElement('label', {
              style: { 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500', 
                color: '#374151', 
                fontSize: '14px' 
              }
            }, 'Password'),
            React.createElement('div', {
              style: {
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }
            },
              React.createElement(Lock, {
                size: 20,
                style: {
                  position: 'absolute',
                  left: '12px',
                  color: '#9ca3af',
                  zIndex: 1
                }
              }),
              React.createElement('input', {
                type: showPassword ? 'text' : 'password',
                name: 'password',
                value: formData.password,
                onChange: handleChange,
                placeholder: 'Enter your password',
                required: true,
                style: {
                  width: '100%',
                  padding: '12px 44px 12px 44px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  background: 'white'
                }
              }),
              React.createElement('button', {
                type: 'button',
                onClick: () => setShowPassword(!showPassword),
                style: {
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }
              },
                showPassword ? React.createElement(EyeOff, { size: 20 }) : React.createElement(Eye, { size: 20 })
              )
            )
          ),

          // Remember Me and Forgot Password
          React.createElement('div', {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }
          },
            React.createElement('label', {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '14px',
                color: '#374151',
                cursor: 'pointer'
              }
            },
              React.createElement('input', {
                type: 'checkbox',
                style: {
                  width: '16px',
                  height: '16px',
                  accentColor: '#2563eb'
                }
              }),
              'Remember me'
            ),
            React.createElement('button', {
              type: 'button',
              onClick: () => navigate('/forgot-password'),
              style: {
                background: 'none',
                border: 'none',
                color: '#2563eb',
                fontSize: '14px',
                cursor: 'pointer',
                textDecoration: 'none'
              }
            }, 'Forgot password?')
          ),

          // Sign In Button
          React.createElement('button', {
            type: 'submit',
            style: {
              width: '100%',
              padding: '12px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '1.5rem',
              transition: 'background-color 0.2s ease'
            }
          }, 'Sign In'),

          // Divider
          React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }
          },
            React.createElement('div', {
              style: {
                flex: 1,
                height: '1px',
                background: '#e5e7eb'
              }
            }),
            React.createElement('span', {
              style: {
                padding: '0 1rem',
                fontSize: '14px',
                color: '#6b7280'
              }
            }, 'or continue with'),
            React.createElement('div', {
              style: {
                flex: 1,
                height: '1px',
                background: '#e5e7eb'
              }
            })
          ),

          // Social Login Buttons
          React.createElement('div', {
            style: {
              display: 'flex',
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }
          },
            React.createElement('button', {
              type: 'button',
              onClick: () => handleSocialLogin('Google'),
              style: {
                flex: 1,
                padding: '10px',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              },
              onMouseEnter: (e) => e.target.style.background = '#b91c1c',
              onMouseLeave: (e) => e.target.style.background = '#dc2626'
            }, 'Google'),
            React.createElement('button', {
              type: 'button',
              onClick: () => handleSocialLogin('Facebook'),
              style: {
                flex: 1,
                padding: '10px',
                background: '#1877f2',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              },
              onMouseEnter: (e) => e.target.style.background = '#166fe5',
              onMouseLeave: (e) => e.target.style.background = '#1877f2'
            }, 'Facebook'),
            React.createElement('button', {
              type: 'button',
              onClick: () => handleSocialLogin('Twitter'),
              style: {
                flex: 1,
                padding: '10px',
                background: '#1da1f2',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              },
              onMouseEnter: (e) => e.target.style.background = '#1a8cd8',
              onMouseLeave: (e) => e.target.style.background = '#1da1f2'
            }, 'Twitter')
          ),

          // Create Account Link
          React.createElement('div', {
            style: {
              textAlign: 'center',
              fontSize: '14px',
              color: '#6b7280'
            }
          },
            "Don't have an account? ",
            React.createElement('button', {
              type: 'button',
              onClick: () => navigate('/signup'),
              style: {
                background: 'none',
                border: 'none',
                color: '#2563eb',
                cursor: 'pointer',
                textDecoration: 'none',
                fontWeight: '500'
              }
            }, 'Create Account')
          )
        )
      )
    ),

    // Right Panel - Informational Content
    React.createElement('div', {
      style: {
        flex: 1,
        background: '#2563eb',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative'
      }
    },
      // Logo
      React.createElement('div', {
        style: {
          width: '80px',
          height: '80px',
          background: 'white',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
        }
      },
        React.createElement(MapPin, { size: 40, color: '#2563eb' })
      ),

      // Welcome Title
      React.createElement('h1', {
        style: {
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '1rem',
          textAlign: 'center'
        }
      }, 'Welcome Back!'),

      // Subtitle
      React.createElement('p', {
        style: {
          fontSize: '18px',
          marginBottom: '3rem',
          textAlign: 'center',
          opacity: 0.9,
          lineHeight: '1.6'
        }
      }, 'Report civic issues, track progress, and help build a better community together.'),

      // Statistics
      React.createElement('div', {
        style: {
          display: 'flex',
          gap: '3rem',
          marginBottom: '3rem'
        }
      },
        React.createElement('div', {
          style: {
            textAlign: 'center'
          }
        },
          React.createElement('div', {
            style: {
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '0.5rem'
            }
          }, '1.2K+'),
          React.createElement('div', {
            style: {
              fontSize: '14px',
              opacity: 0.8
            }
          }, 'Issues Resolved')
        ),
        React.createElement('div', {
          style: {
            textAlign: 'center'
          }
        },
          React.createElement('div', {
            style: {
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '0.5rem'
            }
          }, '850+'),
          React.createElement('div', {
            style: {
              fontSize: '14px',
              opacity: 0.8
            }
          }, 'Active Citizens')
        )
      ),

      // Demo Credentials Card
      React.createElement('div', {
        style: {
          width: '100%',
          maxWidth: '350px',
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          position: 'absolute',
          bottom: '2rem',
          right: '2rem'
        }
      },
        React.createElement('h4', {
          style: {
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '1rem',
            color: '#1f2937',
            textAlign: 'center'
          }
        }, 'Demo Credentials'),
        React.createElement('div', {
          style: {
            fontSize: '14px',
            color: '#374151',
            lineHeight: '1.6'
          }
        },
          React.createElement('div', {
            style: {
              marginBottom: '0.75rem',
              padding: '0.5rem',
              background: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }
          },
            React.createElement('div', {
              style: {
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.25rem'
              }
            }, 'Admin'),
            React.createElement('div', { style: { fontSize: '12px' } }, 'admin@cleanstreet.com'),
            React.createElement('div', { style: { fontSize: '12px' } }, 'password123')
          ),
          React.createElement('div', {
            style: {
              marginBottom: '0.75rem',
              padding: '0.5rem',
              background: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }
          },
            React.createElement('div', {
              style: {
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.25rem'
              }
            }, 'Volunteer'),
            React.createElement('div', { style: { fontSize: '12px' } }, 'volunteer@cleanstreet.com'),
            React.createElement('div', { style: { fontSize: '12px' } }, 'password123')
          ),
          React.createElement('div', {
            style: {
              padding: '0.5rem',
              background: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }
          },
            React.createElement('div', {
              style: {
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.25rem'
              }
            }, 'Citizen'),
            React.createElement('div', { style: { fontSize: '12px' } }, 'citizen@cleanstreet.com'),
            React.createElement('div', { style: { fontSize: '12px' } }, 'password123')
          )
        )
      )
    ),

    // Social Login Form Modal
    showSocialForm && 
    React.createElement('div', {
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '2rem'
      }
    },
      React.createElement('div', {
        style: {
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }
      },
        // Modal Header
        React.createElement('div', {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }
        },
          React.createElement('h3', {
            style: {
              fontSize: '24px',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0
            }
          }, `Sign in with ${selectedProvider}`),
          React.createElement('button', {
            onClick: () => setShowSocialForm(false),
            style: {
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '4px',
              borderRadius: '4px'
            }
          }, '×')
        ),

        // Social Form
        React.createElement('form', {
          onSubmit: handleSocialFormSubmit
        },
          // Email Field
          React.createElement('div', { style: { marginBottom: '1.5rem' } },
            React.createElement('label', {
              style: { 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500', 
                color: '#374151', 
                fontSize: '14px' 
              }
            }, 'Email Address'),
            React.createElement('input', {
              type: 'email',
              name: 'email',
              value: socialFormData.email,
              onChange: handleSocialFormChange,
              placeholder: 'Enter your email address',
              required: true,
              style: {
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }
            })
          ),

          // Submit Button
          React.createElement('button', {
            type: 'submit',
            style: {
              width: '100%',
              padding: '12px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '1rem',
              transition: 'background-color 0.2s ease'
            }
          }, `Continue with ${selectedProvider}`),

          // Cancel Button
          React.createElement('button', {
            type: 'button',
            onClick: () => setShowSocialForm(false),
            style: {
              width: '100%',
              padding: '12px',
              background: 'transparent',
              color: '#6b7280',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }
          }, 'Cancel')
        )
      )
    )
  );
};

export default SignIn;
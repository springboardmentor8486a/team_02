import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, MapPin, Phone, ArrowRight, Users, Eye, EyeOff, Check, Shield, UserCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './SignUp.css';

const SignUp = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: '',
    role: 'citizen'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    // Check if form is valid
    if (formData.fullName && formData.email && formData.password && formData.location) {
      // Sign in the user with auth context
      signIn({
        name: formData.fullName,
        email: formData.email,
        role: formData.role,
        location: formData.location
      });
      navigate('/dashboard');
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getPasswordStrength = (password) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    score = Object.values(checks).filter(Boolean).length;
    
    if (score <= 2) return { strength: 'Weak', color: '#ef4444', width: '33%' };
    if (score <= 3) return { strength: 'Fair', color: '#f59e0b', width: '66%' };
    if (score <= 4) return { strength: 'Good', color: '#10b981', width: '100%' };
    return { strength: 'Strong', color: '#10b981', width: '100%' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          React.createElement(React.Fragment, null,
            // Full Name Field
            React.createElement('div', { style: { marginBottom: '1.5rem' } },
              React.createElement('label', {
                style: { 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500', 
                  color: '#374151', 
                  fontSize: '14px' 
                }
              }, 'Full Name'),
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
                  type: 'text',
                  name: 'fullName',
                  value: formData.fullName,
                  onChange: handleChange,
                  placeholder: 'Enter your full name',
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
                React.createElement(Mail, {
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

            // Phone Field (Optional)
            React.createElement('div', { style: { marginBottom: '2rem' } },
              React.createElement('label', {
                style: { 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500', 
                  color: '#374151', 
                  fontSize: '14px' 
                }
              }, 'Phone Number (optional)'),
              React.createElement('div', {
                style: {
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                }
              },
                React.createElement(Phone, {
                  size: 20,
                  style: {
                    position: 'absolute',
                    left: '12px',
                    color: '#9ca3af',
                    zIndex: 1
                  }
                }),
                React.createElement('input', {
                  type: 'tel',
                  name: 'phone',
                  value: formData.phone,
                  onChange: handleChange,
                  placeholder: 'Enter your phone number',
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

            // Continue Button
            React.createElement('button', {
              type: 'button',
              onClick: handleNextStep,
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }
            }, 'Continue to Security', React.createElement(ArrowRight, { size: 16 }))
          )
        );

      case 2:
        return (
          React.createElement(React.Fragment, null,
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
              }, 'Create Password'),
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
                  placeholder: 'Create a strong password',
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
                    zIndex: 1
                  }
                }, showPassword ? React.createElement(EyeOff, { size: 20 }) : React.createElement(Eye, { size: 20 }))
              ),
              
              // Password Strength Indicator
              formData.password && React.createElement('div', { style: { marginTop: '0.75rem' } },
                React.createElement('div', {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }
                },
                  React.createElement('div', {
                    className: 'password-strength-bar'
                  },
                    React.createElement('div', {
                      className: 'password-strength-fill',
                      style: {
                        width: passwordStrength.width,
                        background: passwordStrength.color
                      }
                    })
                  ),
                  React.createElement('span', {
                    style: {
                      fontSize: '12px',
                      fontWeight: '500',
                      color: passwordStrength.color
                    }
                  }, passwordStrength.strength)
                ),
                
                // Password Requirements
                React.createElement('div', { style: { fontSize: '12px', color: '#6b7280' } },
                  React.createElement('div', {
                    className: 'password-requirement'
                  },
                    React.createElement(Check, {
                      size: 12,
                      color: formData.password.length >= 8 ? '#10b981' : '#d1d5db'
                    }),
                    '8+ characters'
                  ),
                  React.createElement('div', {
                    className: 'password-requirement'
                  },
                    React.createElement(Check, {
                      size: 12,
                      color: /[a-z]/.test(formData.password) ? '#10b981' : '#d1d5db'
                    }),
                    'Lowercase'
                  ),
                  React.createElement('div', {
                    className: 'password-requirement'
                  },
                    React.createElement(Check, {
                      size: 12,
                      color: /[A-Z]/.test(formData.password) ? '#10b981' : '#d1d5db'
                    }),
                    'Uppercase'
                  ),
                  React.createElement('div', {
                    className: 'password-requirement'
                  },
                    React.createElement(Check, {
                      size: 12,
                      color: /\d/.test(formData.password) || /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? '#10b981' : '#d1d5db'
                    }),
                    'Number/Symbol'
                  )
                )
              )
            ),

            // Confirm Password Field
            React.createElement('div', { style: { marginBottom: '2rem' } },
              React.createElement('label', {
                style: { 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500', 
                  color: '#374151', 
                  fontSize: '14px' 
                }
              }, 'Confirm Password'),
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
                  type: showConfirmPassword ? 'text' : 'password',
                  name: 'confirmPassword',
                  value: formData.confirmPassword,
                  onChange: handleChange,
                  placeholder: 'Confirm your password',
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
                  onClick: () => setShowConfirmPassword(!showConfirmPassword),
                  style: {
                    position: 'absolute',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9ca3af',
                    zIndex: 1
                  }
                }, showConfirmPassword ? React.createElement(EyeOff, { size: 20 }) : React.createElement(Eye, { size: 20 }))
              )
            ),

            // Navigation Buttons
            React.createElement('div', {
              style: {
                display: 'flex',
                gap: '1rem'
              }
            },
              React.createElement('button', {
                type: 'button',
                onClick: handlePrevStep,
                style: {
                  flex: 1,
                  padding: '12px',
                  background: 'white',
                  color: '#2563eb',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }
              }, 'Back'),
              React.createElement('button', {
                type: 'button',
                onClick: handleNextStep,
                style: {
                  flex: 1,
                  padding: '12px',
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }
              }, 'Continue to Location', React.createElement(ArrowRight, { size: 16 }))
            )
          )
        );

      case 3:
        return (
          React.createElement(React.Fragment, null,
            // Location Field
            React.createElement('div', { style: { marginBottom: '1.5rem' } },
              React.createElement('label', {
                style: { 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500', 
                  color: '#374151', 
                  fontSize: '14px' 
                }
              }, 'Your City/Location'),
              React.createElement('div', {
                style: {
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                }
              },
                React.createElement(MapPin, {
                  size: 20,
                  style: {
                    position: 'absolute',
                    left: '12px',
                    color: '#9ca3af',
                    zIndex: 1
                  }
                }),
                React.createElement('input', {
                  type: 'text',
                  name: 'location',
                  value: formData.location,
                  onChange: handleChange,
                  placeholder: 'Enter your city, state',
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

            // Role Selection
            React.createElement('div', { style: { marginBottom: '1.5rem' } },
              React.createElement('h3', {
                style: { 
                  fontSize: '16px',
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '1rem'
                }
              }, 'How would you like to participate?'),
              
              // Role Cards
              React.createElement('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }
              },
                // Citizen Card
                React.createElement('div', {
                  onClick: () => setFormData({...formData, role: 'citizen'}),
                  className: `role-card ${formData.role === 'citizen' ? 'selected' : ''}`
                },
                  React.createElement('div', {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }
                  },
                    React.createElement('div', {
                      style: {
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }
                    },
                      React.createElement(User, { size: 20, color: 'white' })
                    ),
                    React.createElement('div', null,
                      React.createElement('div', {
                        style: {
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '0.25rem'
                        }
                      }, 'Citizen'),
                      React.createElement('div', {
                        style: {
                          fontSize: '14px',
                          color: '#6b7280'
                        }
                      }, 'Report issues and vote on community problems.')
                    )
                  ),
                  formData.role === 'citizen' && React.createElement(Check, { size: 20, color: '#2563eb' })
                ),

                // Volunteer Card
                React.createElement('div', {
                  onClick: () => setFormData({...formData, role: 'volunteer'}),
                  className: `role-card ${formData.role === 'volunteer' ? 'selected' : ''}`
                },
                  React.createElement('div', {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }
                  },
                    React.createElement('div', {
                      style: {
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }
                    },
                      React.createElement(Users, { size: 20, color: 'white' })
                    ),
                    React.createElement('div', null,
                      React.createElement('div', {
                        style: {
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '0.25rem'
                        }
                      }, 'Volunteer'),
                      React.createElement('div', {
                        style: {
                          fontSize: '14px',
                          color: '#6b7280'
                        }
                      }, 'Help resolve issues and assist the community.')
                    )
                  ),
                  formData.role === 'volunteer' && React.createElement(Check, { size: 20, color: '#2563eb' })
                ),

                // Administrator Card
                React.createElement('div', {
                  onClick: () => setFormData({...formData, role: 'admin'}),
                  className: `role-card ${formData.role === 'admin' ? 'selected' : ''}`
                },
                  React.createElement('div', {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }
                  },
                    React.createElement('div', {
                      style: {
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: '#f59e0b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }
                    },
                      React.createElement(Shield, { size: 20, color: 'white' })
                    ),
                    React.createElement('div', null,
                      React.createElement('div', {
                        style: {
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '0.25rem'
                        }
                      }, 'Administrator'),
                      React.createElement('div', {
                        style: {
                          fontSize: '14px',
                          color: '#6b7280'
                        }
                      }, 'Manage the platform and oversee operations.')
                    )
                  ),
                  formData.role === 'admin' && React.createElement(Check, { size: 20, color: '#2563eb' })
                )
              )
            ),

            // Terms and Privacy Checkbox
            React.createElement('div', { style: { marginBottom: '2rem' } },
              React.createElement('label', {
                style: {
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151',
                  lineHeight: '1.5'
                }
              },
                React.createElement('input', {
                  type: 'checkbox',
                  checked: agreedToTerms,
                  onChange: (e) => setAgreedToTerms(e.target.checked),
                  style: {
                    marginTop: '2px',
                    width: '16px',
                    height: '16px',
                    accentColor: '#2563eb'
                  }
                }),
                React.createElement('span', null,
                  'I agree to the ',
                  React.createElement('button', {
                    type: 'button',
                    style: {
                      background: 'none',
                      border: 'none',
                      color: '#2563eb',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      padding: 0,
                      fontSize: '14px'
                    }
                  }, 'Terms of Service'),
                  ' and ',
                  React.createElement('button', {
                    type: 'button',
                    style: {
                      background: 'none',
                      border: 'none',
                      color: '#2563eb',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      padding: 0,
                      fontSize: '14px'
                    }
                  }, 'Privacy Policy'),
                  '.'
                )
              )
            ),

            // Navigation Buttons
            React.createElement('div', {
              style: {
                display: 'flex',
                gap: '1rem'
              }
            },
              React.createElement('button', {
                type: 'button',
                onClick: handlePrevStep,
                style: {
                  flex: 1,
                  padding: '12px',
                  background: 'white',
                  color: '#2563eb',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }
              }, 'Back'),
              React.createElement('button', {
                type: 'submit',
                disabled: !agreedToTerms,
                style: {
                  flex: 1,
                  padding: '12px',
                  background: agreedToTerms ? '#2563eb' : '#9ca3af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: agreedToTerms ? 'pointer' : 'not-allowed'
                }
              }, 'Create Account')
            )
          )
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Personal Information';
      case 2: return 'Account Security';
      case 3: return 'Location & Role';
      default: return '';
    }
  };

  return React.createElement('div', {
    className: 'signup-container'
  },
    // Left Panel - Sign Up Form
    React.createElement('div', {
      className: 'signup-left-panel'
    },
      // Back to Website Button
      React.createElement('button', {
        onClick: () => navigate('/'),
        style: {
          position: 'absolute',
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
          zIndex: 1000
        }
      }, '← Back to Website'),

      // Sign Up Form Card
      React.createElement('div', {
        className: 'signup-form-card'
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
          }, 'Join CleanStreet'),
          React.createElement('p', {
            style: {
              fontSize: '16px',
              color: '#6b7280',
              margin: 0
            }
          }, 'Help make your community cleaner and better')
        ),

        // Progress Indicator
        React.createElement('div', {
          style: {
            marginBottom: '2rem'
          }
        },
          React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }
          },
            React.createElement('div', {
              style: {
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: currentStep >= 1 ? '#2563eb' : '#d1d5db'
              }
            }),
            React.createElement('div', {
              style: {
                width: '20px',
                height: '2px',
                background: currentStep >= 2 ? '#2563eb' : '#d1d5db'
              }
            }),
            React.createElement('div', {
              style: {
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: currentStep >= 2 ? '#2563eb' : '#d1d5db'
              }
            }),
            React.createElement('div', {
              style: {
                width: '20px',
                height: '2px',
                background: currentStep >= 3 ? '#2563eb' : '#d1d5db'
              }
            }),
            React.createElement('div', {
              style: {
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: currentStep >= 3 ? '#2563eb' : '#d1d5db'
              }
            })
          ),
          React.createElement('p', {
            style: {
              textAlign: 'center',
              fontSize: '14px',
              color: '#6b7280',
              margin: 0
            }
          }, `Step ${currentStep} of 3: ${getStepTitle()}`)
        ),

        // Form Content
        React.createElement('form', { onSubmit: handleSubmit },
          renderStepContent()
        ),

        // Sign In Link
        React.createElement('div', {
          style: {
            textAlign: 'center',
            marginTop: '2rem',
            fontSize: '14px',
            color: '#6b7280'
          }
        },
          'Already have an account? ',
          React.createElement('button', {
            type: 'button',
            onClick: () => navigate('/signin'),
            style: {
              background: 'none',
              border: 'none',
              color: '#2563eb',
              cursor: 'pointer',
              textDecoration: 'none',
              fontWeight: '500'
            }
          }, 'Sign In')
        )
      )
    ),

    // Right Panel - Informational Content
    React.createElement('div', {
      className: 'signup-right-panel'
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
        React.createElement(Users, { size: 40, color: '#10b981' })
      ),

      // Welcome Title
      React.createElement('h1', {
        style: {
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '1rem',
          textAlign: 'center'
        }
      }, 'Join Our Community!'),

      // Subtitle
      React.createElement('p', {
        style: {
          fontSize: '18px',
          marginBottom: '3rem',
          textAlign: 'center',
          opacity: 0.9,
          lineHeight: '1.6'
        }
      }, 'Sign up today to start reporting issues, tracking progress, and helping your community thrive.'),

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
          }, '15K+'),
          React.createElement('div', {
            style: {
              fontSize: '14px',
              opacity: 0.8
            }
          }, 'Community Members')
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
          }, '3.2K'),
          React.createElement('div', {
            style: {
              fontSize: '14px',
              opacity: 0.8
            }
          }, 'Issues Resolved')
        )
      ),

      // Demo Credentials Card
      React.createElement('div', {
        className: 'demo-credentials-card',
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
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }
        },
          React.createElement(User, { size: 20, color: '#10b981' }),
          'Demo Credentials'
        ),
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
    )
  );
};

export default SignUp;

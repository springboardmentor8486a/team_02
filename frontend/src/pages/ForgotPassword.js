import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      alert('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  const handleBackToSignIn = () => {
    navigate('/signin');
  };

  if (isSubmitted) {
    return React.createElement('div', {
      style: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }
    },
      // Back to Sign In Button
      React.createElement('button', {
        onClick: handleBackToSignIn,
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
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }
      }, 
        React.createElement(ArrowLeft, { size: 16 }),
        'Back to Sign In'
      ),

      // Success Card
      React.createElement('div', {
        style: {
          width: '100%',
          maxWidth: '400px',
          background: 'white',
          borderRadius: '16px',
          padding: '40px 32px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          textAlign: 'center'
        }
      },
        // Success Icon
        React.createElement('div', {
          style: {
            width: '80px',
            height: '80px',
            background: '#10b981',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 8px 16px -4px rgba(16, 185, 129, 0.3)'
          }
        },
          React.createElement(CheckCircle, { size: 40, color: 'white' })
        ),

        // Success Title
        React.createElement('h1', {
          style: {
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '12px'
          }
        }, 'Check Your Email'),

        // Success Message
        React.createElement('p', {
          style: {
            color: '#6b7280',
            marginBottom: '24px',
            lineHeight: '1.6'
          }
        }, 
          'We\'ve sent a password reset link to ',
          React.createElement('strong', { style: { color: '#111827' } }, email),
          '. Please check your email and follow the instructions to reset your password.'
        ),

        // Action Buttons
        React.createElement('div', {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }
        },
          React.createElement('button', {
            onClick: handleBackToSignIn,
            style: {
              width: '100%',
              padding: '12px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }
          }, 'Back to Sign In'),

          React.createElement('button', {
            onClick: () => {
              setEmail('');
              setIsSubmitted(false);
            },
            style: {
              width: '100%',
              padding: '12px',
              background: 'transparent',
              color: '#6b7280',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }
          }, 'Try Different Email')
        )
      )
    );
  }

  return React.createElement('div', {
    style: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }
  },
    // Back to Sign In Button
    React.createElement('button', {
      onClick: handleBackToSignIn,
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
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }
    }, 
      React.createElement(ArrowLeft, { size: 16 }),
      'Back to Sign In'
    ),

    // Logo and Title Section
    React.createElement('div', {
      style: {
        textAlign: 'center',
        marginBottom: '40px',
        position: 'relative',
        zIndex: 100,
        marginTop: '60px'
      }
    },
      React.createElement('div', {
        style: {
          width: '80px',
          height: '80px',
          background: '#2563eb',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.3)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          position: 'relative',
          zIndex: 200,
          transform: 'translateZ(0)'
        }
      },
        React.createElement(Mail, { size: 40, color: 'white' })
      ),
      React.createElement('h1', {
        style: {
          fontSize: '32px',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '8px'
        }
      }, 'Forgot Password'),
      React.createElement('p', {
        style: {
          fontSize: '16px',
          color: '#6b7280',
          margin: 0
        }
      }, 'Enter your email address and we\'ll send you a reset link.')
    ),

    // Main Form Card
    React.createElement('div', {
      style: {
        width: '100%',
        maxWidth: '400px',
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }
    },
      React.createElement('form', { onSubmit: handleSubmit },
        React.createElement('div', { style: { marginBottom: '24px' } },
          React.createElement('label', {
            style: { 
              display: 'block', 
              marginBottom: '6px', 
              fontWeight: '500', 
              color: '#374151', 
              fontSize: '14px' 
            }
          }, 'Email Address'),
          React.createElement('input', {
            type: 'email',
            value: email,
            onChange: (e) => setEmail(e.target.value),
            placeholder: 'your@email.com',
            required: true,
            style: {
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s ease'
            }
          })
        ),

        React.createElement('button', {
          type: 'submit',
          disabled: isLoading,
          style: {
            width: '100%',
            padding: '12px',
            background: isLoading ? '#9ca3af' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            marginBottom: '16px',
            transition: 'background-color 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }
        }, 
          isLoading ? 'Sending...' : 'Send Reset Link'
        ),

        React.createElement('div', { style: { textAlign: 'center' } },
          React.createElement('p', { 
            style: { 
              color: '#6b7280', 
              fontSize: '12px',
              lineHeight: '1.5'
            } 
          }, 
            'Remember your password? ',
            React.createElement('button', {
              onClick: handleBackToSignIn,
              style: {
                background: 'none',
                border: 'none',
                color: '#2563eb',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '12px'
              }
            }, 'Sign in here')
          )
        )
      )
    ),

    // Help Text
    React.createElement('div', {
      style: {
        width: '100%',
        maxWidth: '400px',
        marginTop: '24px',
        padding: '20px',
        background: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
      }
    },
      React.createElement('h4', {
        style: {
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '8px',
          color: '#374151'
        }
      }, 'Need Help?'),
      React.createElement('p', {
        style: {
          fontSize: '12px',
          color: '#6b7280',
          lineHeight: '1.5',
          margin: 0
        }
      }, 
        'If you don\'t receive an email within a few minutes, check your spam folder. ',
        'If you still have trouble, contact our support team.'
      )
    )
  );
};

export default ForgotPassword;

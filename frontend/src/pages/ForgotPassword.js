import React, { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const [manualToken, setManualToken] = useState('');

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.post('/users/forgot-password', { email });
      
      // Enhanced debugging
      console.log('📦 Full Response:', res);
      console.log('📦 Response Data:', res.data);
      console.log('📦 Response Data.data:', res.data?.data);
      console.log('📦 Reset URL:', res.data?.data?.resetUrl);
      
      // Extract resetUrl from response
      const url = res.data?.data?.resetUrl;
      
      if (url) {
        console.log('✅ Reset URL Found:', url);
        setResetUrl(url);
      } else {
        console.warn('⚠️ No resetUrl in response. Full response:', JSON.stringify(res.data, null, 2));
      }
      
      setIsSubmitted(true);
    } catch (err) {
      console.error('❌ Error:', err);
      console.error('❌ Error Response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend email
  const handleResend = async () => {
    setError('');
    setIsLoading(true);

    try {
      const res = await api.post('/users/forgot-password', { email });
      const url = res.data?.data?.resetUrl;
      
      if (url) {
        setResetUrl(url);
        console.log('✅ New Reset URL:', url);
      }
      
      alert('Reset email sent again! Check console for URL.');
    } catch (err) {
      console.error('❌ Resend Error:', err);
      setError(err.response?.data?.message || 'Failed to resend email.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle manual token submission
  const handleManualTokenSubmit = (e) => {
    e.preventDefault();
    if (manualToken.trim()) {
      navigate(`/reset-password/${manualToken.trim()}`);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header Section */}
      <header className="header-top">
  <div className="logo-section">
    <img src="/images/logo.png" alt="Clean Street Logo" className="logo-image" />
    <div className="logo-text">Clean Street</div>
  </div>

  <nav className="nav-links">
    <Link to="/">Home</Link>
    <Link to="/help">Help</Link>
    <Link to="/about">About</Link>
  </nav>

  <div className="auth-buttons">
    <button onClick={() => navigate('/login')} className="sign-in-btn">
      Sign In <ArrowRight size={16} />
    </button>
    <button onClick={() => navigate('/signup')} className="get-started-btn">
      Get Started
    </button>
  </div>
</header>

      

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        minHeight: 'calc(100vh - 81px)'
      }}>
        {/* Left Panel - Form */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '480px',
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Back to Login Link */}
            <Link 
              to="/login" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '14px',
                marginBottom: '24px'
              }}
            >
              <ArrowLeft size={18} />
              Back to Login
            </Link>

            {!isSubmitted ? (
              <>
                {/* Form Header */}
                <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    margin: '0 auto 16px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <Mail size={32} />
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
                    Forgot Password?
                  </h2>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>
                    No worries! Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#fee2e2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    color: '#991b1b',
                    fontSize: '14px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '8px',
                      color: '#374151'
                    }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={20} style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#9ca3af'
                      }} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your registered email"
                        style={{
                          width: '100%',
                          padding: '12px 12px 12px 44px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: 'none',
                      borderRadius: '8px',
                      background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '500',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
              </>
            ) : (
              <>
                {/* Success State */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 24px',
                    borderRadius: '50%',
                    backgroundColor: '#d1fae5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#059669'
                  }}>
                    <CheckCircle size={48} />
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
                    Check Your Email
                  </h2>
                  <p style={{ color: '#6b7280', marginBottom: '8px' }}>
                    We've sent a password reset link to
                  </p>
                  <p style={{ 
                    fontSize: '16px', 
                    fontWeight: '500', 
                    color: '#667eea',
                    marginBottom: '24px'
                  }}>
                    {email}
                  </p>
                  
                  {/* Testing Link (if URL exists) */}
                  {resetUrl && (
                    <div style={{
                      margin: '20px 0',
                      padding: '16px',
                      backgroundColor: '#fff3cd',
                      border: '1px solid #ffc107',
                      borderRadius: '8px',
                      textAlign: 'left'
                    }}>
                      <p style={{ 
                        fontSize: '12px', 
                        fontWeight: '600',
                        marginBottom: '12px', 
                        color: '#856404' 
                      }}>
                        ⚠️ FOR TESTING ONLY (Remove in Production)
                      </p>
                      <p style={{ 
                        fontSize: '10px', 
                        marginBottom: '8px', 
                        color: '#666',
                        wordBreak: 'break-all'
                      }}>
                        Full URL: {resetUrl}
                      </p>
                      <Link 
                        to={resetUrl.replace('http://localhost:3001', '')} 
                        style={{ 
                          color: '#007bff',
                          fontSize: '14px',
                          fontWeight: '500',
                          textDecoration: 'underline'
                        }}
                      >
                        → Click here to reset password
                      </Link>
                    </div>
                  )}

                  {/* Manual Token Input (if no URL) */}
                  {!resetUrl && (
                    <div style={{
                      margin: '20px 0',
                      padding: '16px',
                      backgroundColor: '#f8d7da',
                      border: '1px solid #f5c6cb',
                      borderRadius: '8px'
                    }}>
                      <p style={{ 
                        fontSize: '12px', 
                        color: '#721c24',
                        marginBottom: '12px'
                      }}>
                        ⚠️ Reset URL not received. Check:
                      </p>
                      <ul style={{ 
                        fontSize: '11px', 
                        color: '#721c24',
                        marginBottom: '12px',
                        paddingLeft: '20px',
                        textAlign: 'left'
                      }}>
                        <li>Browser console (F12) for logs</li>
                        <li>Backend terminal for reset URL</li>
                        <li>Network tab for API response</li>
                      </ul>
                      
                      <form onSubmit={handleManualTokenSubmit}>
                        <p style={{ fontSize: '12px', color: '#721c24', marginBottom: '8px' }}>
                          Or paste token from backend logs:
                        </p>
                        <input 
                          type="text" 
                          value={manualToken}
                          onChange={(e) => setManualToken(e.target.value)}
                          placeholder="Paste token here"
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '12px',
                            marginBottom: '8px',
                            boxSizing: 'border-box'
                          }}
                        />
                        <button
                          type="submit"
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: 'none',
                            borderRadius: '4px',
                            background: '#007bff',
                            color: 'white',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Go to Reset Page
                        </button>
                      </form>
                    </div>
                  )}
                  
                  <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
                    Didn't receive the email? Check your spam folder or try again.
                  </p>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button 
                      onClick={handleResend}
                      disabled={isLoading}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        background: 'white',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        color: '#374151'
                      }}
                    >
                      {isLoading ? 'Sending...' : 'Resend Email'}
                    </button>
                    <button 
                      onClick={() => navigate('/login')}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: 'none',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Back to Login
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Panel - Info Section */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ maxWidth: '480px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '16px' }}>
              Need Help?
            </h2>
            <p style={{ fontSize: '16px', marginBottom: '40px', opacity: 0.9 }}>
              If you're having trouble resetting your password, our support team is here to help.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Mail size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>
                    Email Support
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '500' }}>
                    support@cleanstreet.com
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  📞
                </div>
                <div>
                  <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>
                    Call Us
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '500' }}>
                    (555) 123-4567
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              padding: '16px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '20px' }}>🔒</span>
              <span style={{ fontSize: '14px' }}>Your account security is our priority</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
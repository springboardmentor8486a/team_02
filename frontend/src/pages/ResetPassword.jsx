import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams(); // Get token from URL
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error on input change
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await api.post(`/users/reset-password/${token}`, {
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      setIsSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may be expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-page-container">
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
          <Link to="/contactpage">Contact</Link>
        </nav>

        <div className="auth-buttons">
          <button onClick={() => navigate('/login')} className="sign-in-btn">
            Sign In
          </button>
          <button onClick={() => navigate('/signup')} className="get-started-btn">
            Get Started
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="reset-password-main-content">
        {/* Left Panel - Form */}
        <div className="reset-password-panel left-panel">
          <div className="form-card">
            {/* Back to Login Link */}
            <Link to="/login" className="back-to-login">
              <ArrowLeft size={18} />
              Back to Login
            </Link>

            {!isSuccess ? (
              <>
                {/* Form Header */}
                <div className="form-header">
                  <div className="icon-circle">
                    <Lock size={32} />
                  </div>
                  <h2 className="form-title">Reset Your Password</h2>
                  <p className="form-subtitle">
                    Enter your new password below
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="error-message">
                    <span>{error}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  {/* New Password Field */}
                  <div className="form-field-container">
                    <label className="form-label">New Password</label>
                    <div className="input-group">
                      <Lock size={20} className="input-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter new password"
                        className="input-field"
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="toggle-password-btn"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    <p className="field-hint">Minimum 6 characters</p>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="form-field-container">
                    <label className="form-label">Confirm Password</label>
                    <div className="input-group">
                      <Lock size={20} className="input-icon" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Re-enter new password"
                        className="input-field"
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="toggle-password-btn"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="success-state">
                  <div className="success-icon-circle">
                    <CheckCircle size={48} />
                  </div>
                  <h2 className="success-title">Password Reset Successful!</h2>
                  <p className="success-subtitle">
                    Your password has been successfully reset.
                  </p>
                  <p className="success-note">
                    You will be redirected to the login page in a few seconds...
                  </p>

                  {/* Action Button */}
                  <button 
                    onClick={() => navigate('/login')} 
                    className="back-login-btn"
                  >
                    Go to Login
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Panel - Info Section */}
        <div className="reset-password-panel right-panel">
          <div className="right-panel-content">
            <h2 className="right-panel-title">Password Security Tips</h2>
            <p className="right-panel-subtitle">
              Create a strong password to keep your account secure.
            </p>
            
            <div className="security-tips">
              <div className="tip-item">
                <div className="tip-icon">✓</div>
                <div className="tip-text">Use at least 8 characters</div>
              </div>
              
              <div className="tip-item">
                <div className="tip-icon">✓</div>
                <div className="tip-text">Include uppercase and lowercase letters</div>
              </div>
              
              <div className="tip-item">
                <div className="tip-icon">✓</div>
                <div className="tip-text">Add numbers and special characters</div>
              </div>
              
              <div className="tip-item">
                <div className="tip-icon">✓</div>
                <div className="tip-text">Avoid common words or patterns</div>
              </div>
              
              <div className="tip-item">
                <div className="tip-icon">✓</div>
                <div className="tip-text">Don't reuse passwords from other sites</div>
              </div>
            </div>

            <div className="security-note">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span>Your password is encrypted and stored securely</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
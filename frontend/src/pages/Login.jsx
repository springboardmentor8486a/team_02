import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(''); // Clear error when user types
  };

  // Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:3000/api/v1/users/login',
        form,
        { withCredentials: true }
      );

      const user = res.data.data.user;
      localStorage.setItem('token', res.data.data.accessToken);
      
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', form.email);
      }
      
      signIn(user);

      // Redirect based on user role
      if (user.role === 'volunteer') {
        navigate('/volunteer', { state: { userType: 'volunteer' } });
      } else if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth login
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/v1/auth/google';
  };

  return (
    <div className="login-page-container">
      {/* Header Section */}
      <header className="header-top">
        <div className="logo-section" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img src="/images/logo.png" alt="Clean Street Logo" className="logo-image" />
          <div className="logo-text">Clean Street</div>
        </div>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/help">Help</Link>
          <Link to="/about">About</Link>
        </nav>

        <div className="auth-buttons">
          <button onClick={() => navigate('/login')} className="sign-in-btn active-btn">
            Sign In <ArrowRight size={16} />
          </button>
          <button onClick={() => navigate('/signup')} className="get-started-btn">
            Get Started
          </button>
        </div>
      </header>

      {/* Main Login Area */}
      <div className="login-main-content">
        {/* Left Panel - Login Form */}
        <div className="login-panel left-panel">
          <div className="form-card">
            <div className="form-header-section">
              <h2 className="welcome-title">Welcome Back</h2>
              <p className="welcome-subtitle">Sign in to continue to CleanStreet</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-alert">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="form-field-container">
                <label className="form-label">Email Address</label>
                <div className="input-group">
                  <Mail size={20} className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="input-field"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="form-field-container">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <Lock size={20} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="input-field"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-btn"
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot Password */}
              <div className="flex-row justify-between align-center mb-4">
                {/* <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    className="checkbox-input"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label> */}
                <Link to="/forgot-password" className="forgot-password-link">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button type="submit" className="login-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} className="btn-icon" />
                  </>
                )}
              </button>

              {/* Divider */}
              {/* <div className="divider">
                <span>or continue with</span>
              </div> */}

              {/* Google Login */}
              {/* <button
                type="button"
                className="social-google-btn"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <FcGoogle size={22} />
                Sign in with Google
              </button> */}

              {/* Signup Link */}
              <div className="create-account-link-container">
                Don't have an account? <Link to="/signup">Create Account</Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right Panel - Info Section */}
        <div className="login-panel right-panel">
          <div className="right-panel-content">
            <div className="illustration-container">
              <div className="floating-card card-1">
                <div className="card-icon">📍</div>
                <div className="card-text">Report Issues</div>
              </div><br></br>
              <div className="floating-card card-2">
                <div className="card-icon">🤝</div>
                <div className="card-text">Build Community</div>
              </div><br></br>
              <div className="floating-card card-3">
                <div className="card-icon">📊</div>
                <div className="card-text">Track Progress</div>
              </div><br></br>
              <div className="floating-card card-4">
                <div className="card-icon">🔒</div>
                <div className="card-text">Secure Platform</div>
              </div>
            </div>
            <h2 className="right-panel-title">Welcome Back!</h2>
            <p className="right-panel-subtitle">
              Report civic issues, track progress, and help build a better community together.
            </p>
            
            <div className="stats-container">
              <div className="stat-item">
                <div className="stat-value">1.2K+</div>
                <div className="stat-label">Issues Resolved</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-value">850+</div>
                <div className="stat-label">Active Citizens</div>
              </div>
            </div>

            <div className="trust-badges">
              <div className="trust-badge">🔒 Secure Login</div>
              <div className="trust-badge">✓ Verified Platform</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
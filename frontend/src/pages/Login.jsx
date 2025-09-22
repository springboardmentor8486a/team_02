import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/v1/users/login', form, { withCredentials: true });
      localStorage.setItem('token', res.data.data.accessToken);
      signIn(res.data.data.user);
      alert('Login Successful!');
      navigate('/dashboard'); // Redirect after login
    } catch (err) {
      alert(err.response?.data?.message || 'Error occurred');
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth
    window.location.href = 'http://localhost:3000/api/v1/auth/google';
  };

  return (
    <div className="login-page-container">
      {/* Header and Navigation */}
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
          <button onClick={() => navigate('/signup')} className="get-started-btn">Get Started</button>
        </div>
      </header>

      <div className="login-main-content">
        {/* Left Panel - Login Form */}
        <div className="login-panel left-panel">
          <div className="form-card">
            <h2 className="welcome-title">Welcome Back</h2>
            <p className="welcome-subtitle">Sign in to continue to CleanStreet</p>
            
            <form onSubmit={handleSubmit}>
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
                  />
                </div>
              </div>

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
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-btn"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex-row justify-between align-center mb-4">
                <label className="checkbox-label">
                  <input type="checkbox" className="checkbox-input" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="forgot-password-link">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" className="login-btn">
                Sign In
              </button>

              <div className="divider">
                <span>or continue with</span>
              </div>

              <button type="button" className="social-google-btn" onClick={handleGoogleLogin}>
                <FcGoogle size={20} />
                Sign in with Google
              </button>
              
              <div className="create-account-link-container">
                Don't have an account? <Link to="/signup">Create Account</Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right Panel - Info */}
        <div className="login-panel right-panel">
          <div className="right-panel-content">
            <h2 className="right-panel-title">Welcome Back!</h2>
            <p className="right-panel-subtitle">Report civic issues, track progress, and help build a better community together.</p>
            <div className="stats-container">
              <div className="stat-item">
                <div className="stat-value">1.2K+</div>
                <div className="stat-label">Issues Resolved</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">850+</div>
                <div className="stat-label">Active Citizens</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
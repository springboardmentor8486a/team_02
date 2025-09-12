import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login data:', formData);
    
    // For demo purposes, accept any username/password
    // In real app, this would be an API call
    if (formData.username && formData.password) {
      // Store authentication data
      localStorage.setItem('authToken', 'demo-token-123');
      localStorage.setItem('user', JSON.stringify({
        username: formData.username,
        name: 'John Doe',
        email: 'john.doe@email.com'
      }));
      
      // Redirect to dashboard
      navigate('/dashboard');
    } else {
      alert('Please enter both username and password');
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // Add your social login logic here
    // Example: window.location.href = `/auth/${provider}`;
  };

  return (
    <div className="login-container">
      {/* Left Section - Login Form */}
      <div className="login-form-section">
        <div className="login-content">
          <h1 className="login-title">
            LogIn To <span className="brand-name">CleanStreet</span>
          </h1>
        
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-with-icon">
                <svg className="input-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="UserName"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <div className="input-with-icon">
                <svg className="input-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10A2,2 0 0,1 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
                </svg>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Password"
                  required
                />
              </div>
            </div>
            
            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  className="remember-checkbox"
                />
                <label htmlFor="remember" className="remember-label">Remeber Me</label>
              </div>
              <Link to="/forget-password" className="forgot-link">
                Forget Password?
              </Link>
            </div>
          
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        
          <div className="social-section">
            <p className="social-text">or Sign Up Using</p>
            <div className="social-icons">
              <button 
                type="button"
                className="social-icon-button"
                onClick={() => handleSocialLogin('Facebook')}
              >
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              
              <button 
                type="button"
                className="social-icon-button"
                onClick={() => handleSocialLogin('Google')}
              >
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
              
              <button 
                type="button"
                className="social-icon-button"
                onClick={() => handleSocialLogin('Twitter')}
              >
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="#1DA1F2" d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="login-footer">
            <span className="footer-text">
              Don't have a <span className="highlight-text">ACCOUNT</span>? <Link to="/register" className="register-link">Register</Link>
            </span>
          </div>
        </div>
      </div>
      
      {/* Right Section - Welcome Message */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h2 className="welcome-title">Welcome Back!</h2>
          <p className="welcome-message">
            Report civic issues, track progress, and help build a better community together.
          </p>
        </div>
        <div className="welcome-shape"></div>
      </div>
    </div>
  );
};

export default Login;

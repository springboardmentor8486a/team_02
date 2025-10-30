import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Mail, Lock, Key, Shield } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import "./ForgetPassword.css";
import axios from "axios";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // Step 1: enter email, Step 2: enter new password
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSendEmail = async () => {
    if (!email) {
      setMessage("Please enter your email.");
      setIsError(true);
      return;
    }
    
    setLoading(true);
    setMessage("");
    setIsError(false);
    
    try {
      const res = await axios.post(`${process.env.REACT_APP_API}/user/forgot-password`, { email });
      setMessage(res.data.message);
      setIsError(false);
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending reset link. Please try again.");
      setIsError(true);
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setMessage("Please enter both password fields.");
      setIsError(true);
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setIsError(true);
      return;
    }
    if (!token) {
      setMessage("Please enter the reset token from your email.");
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage("");
    setIsError(false);
    
    try {
      const res = await axios.post(`${process.env.REACT_APP_API}/user/reset-password/${token}`, { 
        password, 
        confirmPassword 
      });
      setMessage(res.data.message);
      setIsError(false);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error resetting password. Please try again.");
      setIsError(true);
    }
    setLoading(false);
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="forget-password-page">
      {/* Hero Section - Same as EditProfile Page */}
      <div className="forget-hero">
        <div className="hero-content-wrapper">
          <h2>Reset Your Password</h2>
          <p>Enter your email address and we'll send you instructions to reset your password.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="forget-main-content">
        <div className="forget-form-container">
          <div className="form-header">
            <div className="form-title-section">
              <h3>
                {step === 1 ? "Forgot Password" : "Create New Password"}
              </h3>
              <p>
                {step === 1 
                  ? "Enter your email to receive a password reset link" 
                  : "Enter the token from your email and create a new password"
                }
              </p>
            </div>
            <button 
              className="back-to-login-btn"
              onClick={handleBackToLogin}
              title="Back to Login"
            >
              Back to Login
            </button>
          </div>

          <div className="forget-form-panel">
            {message && (
              <div className={`status-message ${isError ? 'error' : 'success'}`}>
                {message}
              </div>
            )}

            {step === 1 ? (
              <div className="forget-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    <Mail size={18} />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your registered email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                  <div className="input-hint">
                    We'll send a reset link to this email
                  </div>
                </div>

                <button 
                  onClick={handleSendEmail} 
                  disabled={loading}
                  className="submit-btn primary"
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner-small"></div>
                      Sending Reset Link...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="forget-form">
                <div className="form-group">
                  <label htmlFor="token" className="form-label">
                    <Key size={18} />
                    Reset Token *
                  </label>
                  <input
                    type="text"
                    id="token"
                    placeholder="Enter the token from your email"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="form-input"
                  />
                  <div className="input-hint">
                    Check your email for the 6-digit reset token
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    <Lock size={18} />
                    New Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    <Shield size={18} />
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input"
                  />
                  <div className="input-hint">
                    Make sure both passwords match
                  </div>
                </div>

                <button 
                  onClick={handleResetPassword} 
                  disabled={loading}
                  className="submit-btn primary"
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner-small"></div>
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar with Help Information */}
        <div className="forget-sidebar">
          <div className="sidebar-panel">
            <h4>🔐 Password Requirements</h4>
            <ul className="tips-list">
              <li>Minimum 8 characters long</li>
              <li>Include uppercase and lowercase letters</li>
              <li>Include at least one number</li>
              <li>Include special characters (!@#$%^&*)</li>
              <li>Avoid common words or patterns</li>
            </ul>
          </div>

          <div className="sidebar-panel">
            <h4>📧 Email Not Received?</h4>
            <ul className="tips-list">
              <li>Check your spam or junk folder</li>
              <li>Verify you entered the correct email</li>
              <li>Wait a few minutes and try again</li>
              <li>Contact support if issues persist</li>
            </ul>
          </div>

          <div className="sidebar-panel">
            <h4>🛡️ Security Tips</h4>
            <ul className="tips-list">
              <li>Never share your password</li>
              <li>Use a unique password for this account</li>
              <li>Update your password regularly</li>
              <li>Enable two-factor authentication if available</li>
            </ul>
          </div>

          <div className="sidebar-panel">
            <h4>📞 Need Help?</h4>
            <div className="contact-info">
              <p><Mail size={16} /> <a href="mailto:support@cleanstreet.org">support@cleanstreet.org</a></p>
              <p><Shield size={16} /> <a href="#">Security Help Center</a></p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-column footer-logo-section">
          <div className="logo-section">
            <img src="/images/logo.png" alt="Clean Street Logo" className="logo-image" />
            <div className="logo-text">Clean Street</div>
          </div>
          <p className="footer-tagline">Civic Engagement Platform</p>
          <p>Empowering communities to report, track, and resolve civic issues through collaborative engagement between citizens and local authorities.</p>
        </div>
        <div className="footer-column">
          <h4>Platform</h4>
          <ul>
            <li><a href="/">How it Works</a></li>
            <li><a href="/">Features</a></li>
            <li><a href="/">Pricing</a></li>
            <li><a href="/">Mobile App</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Support</h4>
          <ul>
            <li><a href="/">Help Center</a></li>
            <li><a href="/">Contact Us</a></li>
            <li><a href="/">User Guide</a></li>
            <li><a href="/">Community Forum</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Company</h4>
          <ul>
            <li><a href="/">About Us</a></li>
            <li><a href="/">Careers</a></li>
            <li><a href="/">Press Kit</a></li>
            <li><a href="/">Blog</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default ForgetPassword;
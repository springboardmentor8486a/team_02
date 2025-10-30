import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css';
import AdminHeader from '../components/AdminHeader';
import AdminFooter from '../components/AdminFooter';

const AddNewAdmin = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false, uppercase: false, lowercase: false, number: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'password') validatePassword(value);
  };

  const validatePassword = (password) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (form.fullName && form.email) setStep(2);
      else alert('Please fill in all required fields.');
    } else if (step === 2) {
      if (
        form.password === form.confirmPassword &&
        passwordStrength.length && passwordStrength.uppercase &&
        passwordStrength.lowercase && passwordStrength.number
      ) setStep(3);
      else alert('Passwords must match and meet strength requirements.');
    } else if (step === 3) {
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('fullName', form.fullName); // **CRITICAL**
      formData.append('email', form.email);
      formData.append('password', form.password);
      formData.append('location', form.location);
      formData.append('role', 'admin');
      const res = await axios.post(
        'http://localhost:3000/api/v1/users/register',
        formData,
        { withCredentials: true }
      );
      alert(res.data.message || 'Admin registration successful!');
      navigate('/login');
    } catch (err) {
      const serverData = err.response?.data;
      const serverMessage = typeof serverData === 'string' ? serverData : serverData?.message;
      alert(serverMessage || err.message || 'Error occurred during admin registration');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="form-step">
              <div className="input-group">
                <i className="input-icon">👤</i>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="input-field"
                />
              </div>
              <div className="input-group">
                <i className="input-icon">✉️</i>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="input-field"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleNextStep}
              className="button-primary"
            >
              Continue to Security
            </button>
          </>
        );
      case 2:
        const progress = (Object.values(passwordStrength).filter(Boolean).length / 4) * 100;
        let label = 'Weak';
        if (progress > 25) label = 'Fair';
        if (progress > 75) label = 'Strong';
        return (
          <>
            <div className="form-step">
              <div className="input-group">
                <i className="input-icon">🔐</i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create Password"
                  required
                  className="input-field"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '🔒'}
                </button>
              </div>
              <div className="password-strength-container">
                <div className="strength-bar-label">Password Strength</div>
                <div className="strength-bar">
                  <div className="strength-bar-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="strength-label" style={{ color: progress < 50 ? '#e53e3e' : '#38a169' }}>{label}</div>
              </div>
              <div className="password-strength-checks">
                <p className={passwordStrength.length ? 'met' : 'unmet'}><i className="check-icon">{passwordStrength.length ? '✔' : '⚪'}</i>8+ characters</p>
                <p className={passwordStrength.uppercase ? 'met' : 'unmet'}><i className="check-icon">{passwordStrength.uppercase ? '✔' : '⚪'}</i>Uppercase</p>
                <p className={passwordStrength.lowercase ? 'met' : 'unmet'}><i className="check-icon">{passwordStrength.lowercase ? '✔' : '⚪'}</i>Lowercase</p>
                <p className={passwordStrength.number ? 'met' : 'unmet'}><i className="check-icon">{passwordStrength.number ? '✔' : '⚪'}</i>Number/Symbol</p>
              </div>
              <div className="input-group">
                <i className="input-icon">🔐</i>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                  className="input-field"
                />
              </div>
            </div>
            <div className="button-group">
              <button type="button" onClick={() => setStep(1)} className="button-secondary">Back</button>
              <button type="button" onClick={handleNextStep} className="button-primary">Continue to Details</button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="form-step">
              <div className="input-group">
                <i className="input-icon">📍</i>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Admin Location"
                  required
                  className="input-field"
                />
              </div>
              <div className="terms-checkbox">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">
                  I agree to the <a href="/">Terms of Service</a> and <a href="/">Privacy Policy</a>
                </label>
              </div>
            </div>
            <div className="button-group">
              <button type="button" onClick={() => setStep(2)} className="button-secondary">Back</button>
              <button type="submit" onClick={handleNextStep} className="button-primary">Register Admin</button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <AdminHeader />
      <div className="signup-page">
        <div className="signup-panel-left">
          <div className="form-card">
            <h1 className="form-title">Add New Admin</h1>
            <p className="form-subtitle">Create a new platform administrator account</p>
            <div className="progress-bar-container">
              <div className="progress-line-fill" style={{ width: `${(step - 1) * 50}%` }}></div>
              <div className={`progress-step ${step >= 1 ? 'active' : ''}`}></div>
              <div className={`progress-step ${step >= 2 ? 'active' : ''}`}></div>
              <div className={`progress-step ${step >= 3 ? 'active' : ''}`}></div>
            </div>
            <p className="step-label">Step {step} of 3: {step === 1 ? 'Personal Information' : step === 2 ? 'Account Security' : 'Details'}</p>
            <form onSubmit={handleSubmit}>{renderStep()}</form>
          </div>
        </div>
        <div className="signup-panel-right">
          <div className="right-panel-content">
            <h2 className="right-panel-title">Admin Onboarding</h2>
            <p className="right-panel-subtitle">Register a new admin to manage your community platform.</p>
          </div>
        </div>
      </div>
      <AdminFooter />
    </>
  );
};

export default AddNewAdmin;

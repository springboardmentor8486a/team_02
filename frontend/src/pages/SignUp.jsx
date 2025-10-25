import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css';
import { ArrowRight, User, Mail, Phone, Lock, MapPin, AlertCircle, CheckCircle } from "lucide-react";

const SignUp = () => {
    const navigate = useNavigate();

    const handleSignIn = () => navigate("/login");
    const handleGetStarted = () => navigate("/signup");

    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        location: '',
        role: null,
        profilePhoto: null,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        if (error) setError('');

        if (name === 'profilePhoto') {
            const file = files[0];
            if (file) {
                const renamedFile = new File(
                    [file],
                    `user-${Date.now()}.${file.name.split('.').pop()}`,
                    { type: file.type }
                );
                setForm((prev) => ({ ...prev, profilePhoto: renamedFile }));
            }
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
            if (name === 'password') validatePassword(value);
        }
    };

    // Validate password strength
    const validatePassword = (password) => {
        setPasswordStrength({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
        });
    };

    // Step navigation
    const handleNextStep = (e) => {
        e.preventDefault();
        setError('');
        
        if (step === 1) {
            if (!form.name || !form.email) {
                setError('Please fill in all required fields.');
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (form.password !== form.confirmPassword) {
                setError('Passwords do not match.');
                return;
            }
            if (!passwordStrength.length || !passwordStrength.uppercase || 
                !passwordStrength.lowercase || !passwordStrength.number) {
                setError('Password must meet all strength requirements.');
                return;
            }
            setStep(3);
        } else if (step === 3) {
            if (!form.role) {
                setError('Please select a role.');
                return;
            }
            handleSubmit(e);
        }
    };

    // Submit registration with role-based redirect
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('email', form.email);
            formData.append('password', form.password);
            formData.append('location', form.location);
            formData.append('role', form.role);
            if (form.phone) formData.append('phone', form.phone);
            if (form.profilePhoto) formData.append('profilePhoto', form.profilePhoto);

            const res = await axios.post(
                'http://localhost:3000/api/v1/users/register',
                formData,
                { withCredentials: true }
            );
            
            // Store user data in localStorage
            localStorage.setItem('userRole', form.role);
            localStorage.setItem('userName', form.name);
            localStorage.setItem('userEmail', form.email);
            localStorage.setItem('userLocation', form.location);
            
            if (res.data.token) {
                localStorage.setItem('authToken', res.data.token);
            }
            
            // Redirect based on role
            if (form.role === 'volunteer') {
                navigate('/volunteer');
            } else if (form.role === 'admin') {
                navigate('/admin');
            } else if (form.role === 'user') {
                navigate('/dashboard');
            } else {
                navigate('/dashboard');
            }
            
        } catch (err) {
            const serverData = err.response?.data;
            const serverMessage = typeof serverData === 'string' ? serverData : serverData?.message;
            setError(serverMessage || err.message || 'Error occurred during registration');
        } finally {
            setIsLoading(false);
        }
    };

    // Render steps
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <div className="form-step">
                            <div className="input-group">
                                <User size={20} className="input-icon" />
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    required
                                    className="input-field"
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="input-group">
                                <Mail size={20} className="input-icon" />
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Email Address"
                                    required
                                    className="input-field"
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="input-group">
                                <Phone size={20} className="input-icon" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="Phone Number (Optional)"
                                    className="input-field"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleNextStep}
                            className="button-primary"
                            disabled={isLoading}
                        >
                            Continue to Security
                            <ArrowRight size={18} />
                        </button>
                    </>
                );
            case 2:
                const passwordStrengthProgress = (Object.values(passwordStrength).filter(Boolean).length / 4) * 100;
                let strengthLabel = 'Weak';
                let strengthColor = '#ef4444';
                if (passwordStrengthProgress >= 50) {
                    strengthLabel = 'Fair';
                    strengthColor = '#f59e0b';
                }
                if (passwordStrengthProgress >= 75) {
                    strengthLabel = 'Good';
                    strengthColor = '#10b981';
                }
                if (passwordStrengthProgress === 100) {
                    strengthLabel = 'Strong';
                    strengthColor = '#10b981';
                }
                
                return (
                    <>
                        <div className="form-step">
                            <div className="input-group">
                                <Lock size={20} className="input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Create Password"
                                    required
                                    className="input-field"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex="-1"
                                >
                                    {showPassword ? '👁️' : '🔒'}
                                </button>
                            </div>
                            <div className="password-strength-container">
                                <div className="strength-bar">
                                    <div 
                                        className="strength-bar-fill" 
                                        style={{ 
                                            width: `${passwordStrengthProgress}%`,
                                            backgroundColor: strengthColor
                                        }}
                                    ></div>
                                </div>
                                <div className="strength-info">
                                    <span className="strength-label">Password Strength</span>
                                    <span className="strength-value" style={{ color: strengthColor }}>
                                        {strengthLabel}
                                    </span>
                                </div>
                            </div>
                            <div className="password-strength-checks">
                                <div className={`check-item ${passwordStrength.length ? 'met' : ''}`}>
                                    <CheckCircle size={16} className="check-icon" />
                                    <span>8+ characters</span>
                                </div>
                                <div className={`check-item ${passwordStrength.uppercase ? 'met' : ''}`}>
                                    <CheckCircle size={16} className="check-icon" />
                                    <span>Uppercase letter</span>
                                </div>
                                <div className={`check-item ${passwordStrength.lowercase ? 'met' : ''}`}>
                                    <CheckCircle size={16} className="check-icon" />
                                    <span>Lowercase letter</span>
                                </div>
                                <div className={`check-item ${passwordStrength.number ? 'met' : ''}`}>
                                    <CheckCircle size={16} className="check-icon" />
                                    <span>Number or symbol</span>
                                </div>
                            </div>
                            <div className="input-group">
                                <Lock size={20} className="input-icon" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm Password"
                                    required
                                    className="input-field"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    tabIndex="-1"
                                >
                                    {showConfirmPassword ? '👁️' : '🔒'}
                                </button>
                            </div>
                        </div>
                        <div className="button-group">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="button-secondary"
                                disabled={isLoading}
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="button-primary"
                                disabled={isLoading}
                            >
                                Continue to Location
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </>
                );
            case 3:
                return (
                    <>
                        <div className="form-step">
                            <div className="input-group">
                                <MapPin size={20} className="input-icon" />
                                <input
                                    type="text"
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    placeholder="Your City/Location"
                                    required
                                    className="input-field"
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="role-label">Select Your Role</div>
                            <div className="role-container">
                                <div
                                    className={`role-option ${form.role === 'user' ? 'active' : ''}`}
                                    onClick={() => !isLoading && setForm((prev) => ({ ...prev, role: 'user' }))}
                                >
                                    <div className="role-info">
                                        <div className="role-icon">👤</div>
                                        <div className="role-text">
                                            <h3>Citizen</h3>
                                            <p>Report issues and vote on community problems</p>
                                        </div>
                                    </div>
                                    {form.role === 'user' && <CheckCircle size={24} className="check-icon-active" />}
                                </div>

                                <div
                                    className={`role-option ${form.role === 'volunteer' ? 'active' : ''}`}
                                    onClick={() => !isLoading && setForm((prev) => ({ ...prev, role: 'volunteer' }))}
                                >
                                    <div className="role-info">
                                        <div className="role-icon">💪</div>
                                        <div className="role-text">
                                            <h3>Volunteer</h3>
                                            <p>Help resolve issues and assist the community</p>
                                        </div>
                                    </div>
                                    {form.role === 'volunteer' && <CheckCircle size={24} className="check-icon-active" />}
                                </div>
                                
                                <div
                                    className={`role-option ${form.role === 'admin' ? 'active' : ''}`}
                                    onClick={() => !isLoading && setForm((prev) => ({ ...prev, role: 'admin' }))}
                                >
                                    <div className="role-info">
                                        <div className="role-icon">👑</div>
                                        <div className="role-text">
                                            <h3>Administrator</h3>
                                            <p>Manage the platform and oversee operations</p>
                                        </div>
                                    </div>
                                    {form.role === 'admin' && <CheckCircle size={24} className="check-icon-active" />}
                                </div>
                            </div>
                            <div className="terms-checkbox">
                                <input type="checkbox" id="terms" required />
                                <label htmlFor="terms">
                                    I agree to the <a href="/">Terms of Service</a> and{' '}
                                    <a href="/">Privacy Policy</a>
                                </label>
                            </div>
                        </div>
                        <div className="button-group">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="button-secondary"
                                disabled={isLoading}
                            >
                                Back
                            </button>
                            <button 
                                type="submit" 
                                onClick={handleNextStep} 
                                className="button-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="spinner"></div>
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <CheckCircle size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className="header-top">
                <div className="logo-section" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <img src="/images/logo.png" alt="Clean Street Logo" className="logo-image" />
                    <span className="logo-text">Clean Street</span>
                </div>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/help">Help</Link>
                    <Link to="/about">About</Link>
                    <Link to="/contactpage">Contact</Link>
                </div>
                <div className="auth-buttons">
                    <button onClick={handleSignIn} className="sign-in-btn">
                        Sign In <ArrowRight size={16} />
                    </button>
                    <button onClick={handleGetStarted} className="get-started-btn active-btn">
                        Get Started
                    </button>
                </div>
            </div>
            <div className="signup-page">
                <div className="signup-panel-left">
                    <div className="form-card">
                        <div className="form-header-section">
                            <h1 className="form-title">Join CleanStreet</h1>
                            <p className="form-subtitle">Help make your community cleaner and better</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="error-alert">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="progress-bar-container">
                            <div className="progress-line-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
                            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                                <span className="step-number">1</span>
                            </div>
                            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                                <span className="step-number">2</span>
                            </div>
                            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                                <span className="step-number">3</span>
                            </div>
                        </div>
                        <p className="step-label">
                            Step {step} of 3: {step === 1 ? 'Personal Information' : step === 2 ? 'Account Security' : 'Location & Role'}
                        </p>
                        <form onSubmit={handleSubmit}>
                            {renderStep()}
                        </form>
                        <div className="login-link">
                            Already have an account? <Link to="/login">Sign In</Link>
                        </div>
                    </div>
                </div>
                <div className="signup-panel-right">
                    <div className="right-panel-content">
                        <div className="illustration-container">
                            <div className="floating-card card-1">
                                <div className="card-icon">📍</div>
                                <div className="card-text">Report Issues</div>
                            </div>
                            <div className="floating-card card-2">
                                <div className="card-icon">📊</div>
                                <div className="card-text">Track Progress</div>
                            </div>
                            <div className="floating-card card-3">
                                <div className="card-icon">🤝</div>
                                <div className="card-text">Join Community</div>
                            </div>
                        </div>
                        
                        <h2 className="right-panel-title">Join Our Community!</h2>
                        <p className="right-panel-subtitle">
                            Sign up today to start reporting issues, tracking progress, and helping
                            your community thrive.
                        </p>
                        
                        <div className="stats-container">
                            <div className="stat-item">
                                <div className="stat-value">15K+</div>
                                <div className="stat-label">Community Members</div>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <div className="stat-value">3.2K+</div>
                                <div className="stat-label">Issues Resolved</div>
                            </div>
                        </div>

                        <div className="trust-badges">
                            <div className="trust-badge">✓ Free Forever</div>
                            <div className="trust-badge">🔒 Secure & Private</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUp;

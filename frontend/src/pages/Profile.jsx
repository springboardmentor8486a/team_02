import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
// Added Globe and Phone to the import statement
import { User, Mail, MapPin, Briefcase, Award, Heart, CheckCircle, LogOut, Phone, Globe, ArrowRight } from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        axios.post('http://localhost:3000/api/v1/users/logout', {}, { withCredentials: true })
            .catch(() => {})
            .finally(() => {
                signOut();
                navigate('/'); // Redirects to the homepage after logging out
            });
    };

    if (!user) {
        return null;
    }

    const getUserInitials = (name) => {
        if (!name) return 'S'; // Default initial
        const nameParts = name.split(' ');
        const initials = nameParts.map(part => part[0]).join('');
        return initials.toUpperCase();
    };

    const getJoinedDate = (dateString) => {
        if (!dateString) return 'Joined unknown date';
        const date = new Date(dateString);
        return `Joined ${date.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;
    };

    const username = user.email ? user.email.split('@')[0] : 'sakupatil2004';

    return (
        <>
            <header className="header-top">
                <div className="logo-section">
                    <img src="/images/logo.png" alt="Clean Street Logo" className="logo-image" />
                    <div className="logo-text">Clean Street</div>
                </div>
                <nav className="nav-links">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/browse-issues">Browse Issues</Link>
                    <Link to="/report-issue">Report Issue</Link>
                </nav>
                <div className="user-profile">
                    <Link to="/profile" className="profile-link active">
                        <div className="user-initials">{getUserInitials(user.name)}</div>
                        <span className="user-name">{user.name}</span>
                    </Link>
                    <button onClick={handleLogout} className="logout-btn-header">
                        <ArrowRight size={20} />
                    </button>
                </div>
            </header>

            <div className="profile-page-container">
                <div className="profile-sidebar">
                    <div className="profile-avatar-large">
                        <span>{getUserInitials(user.name)}</span>
                    </div>
                    <h2 className="profile-name">{user.name}</h2>
                    <p className="profile-username">@{username}</p>
                    <p className="profile-joined">{getJoinedDate(user.createdAt)}</p>

                    <div className="profile-actions">
                        <button className="update-profile-btn" onClick={() => navigate('/edit-profile')}>Update Profile</button>
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </div>

                    <div className="profile-badges">
                        <div className="badge verified">
                            <CheckCircle size={16} /> Verified Member
                        </div>
                        <div className="badge community-helper">
                            <Heart size={16} /> Community Helper
                        </div>
                        <div className="badge local-champion">
                            <Award size={16} /> Local Champion
                        </div>
                    </div>
                </div>

                <div className="profile-main-content">
                    <div className="profile-panel">
                        <div className="panel-header-details">
                            <h3>Profile Information</h3>
                            <p>Your personal information and details</p>
                            <span className="premium-badge">Premium Member</span>
                        </div>
                        <div className="profile-info-grid">
                            <div className="info-item">
                                <User size={20} />
                                <div className="info-text">
                                    <strong>{user.name}</strong>
                                    <span>@{username}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <Phone size={20} />
                                <strong>Not provided</strong>
                            </div>
                            <div className="info-item">
                                <Mail size={20} />
                                <strong>{user.email}</strong>
                            </div>
                            <div className="info-item">
                                <MapPin size={20} />
                                <strong>{user.location || 'Not provided'}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="profile-panel about-me-panel">
                        <h3>About Me</h3>
                        <p>{user.about || 'Active community member passionate about improving our neighborhood. I believe in working together to create cleaner, safer streets for everyone.'}</p>
                    </div>

                    <div className="profile-panel contributor-badges-panel">
                        <h3>Contributor Badges</h3>
                        <div className="badges-grid">
                            <span className="badge-card trusted-member">Trusted Member</span>
                            <span className="badge-card community-love">Community Love</span>
                            <span className="badge-card top-contributor">Top Contributor</span>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="footer">
                <div className="footer-column footer-logo-section">
                    <div className="logo-section">
                        <img src="/images/logo.png" alt="Clean Street Logo" className="logo-image" />
                        <div className="logo-text">Clean Street</div>
                    </div>
                    <p className="footer-tagline">Civic Engagement Platform</p>
                    <p>Empowering communities to report, track, and resolve civic issues through collaborative engagement between citizens and local authorities.</p>
                    <div className="contact-info">
                        <p><Mail size={16} /> <a href="mailto:hello@cleanstreet.org">hello@cleanstreet.org</a></p>
                        <p><Phone size={16} /> <a href="tel:5551234567">(555) 123-4567</a></p>
                        <p><Globe size={16} /> <a href="http://www.cleanstreet.org" target="_blank" rel="noopener noreferrer">www.cleanstreet.org</a></p>
                    </div>
                </div>
                <div className="footer-column">
                    <h4>Platform</h4>
                    <ul>
                        <li><a href="#">How it Works</a></li>
                        <li><a href="#">Features</a></li>
                        <li><a href="#">Pricing</a></li>
                        <li><a href="#">Mobile App</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Support</h4>
                    <ul>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">User Guide</a></li>
                        <li><a href="#">Community Forum</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Press Kit</a></li>
                        <li><a href="#">Blog</a></li>
                    </ul>
                </div>
            </footer>
        </>
    );
};

export default Profile;
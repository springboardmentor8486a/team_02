import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { PlusCircle, MapPin, Loader2, FileText, User, ArrowRight, BarChart3, Users, Mail, Phone, Globe, Trash2, Lightbulb, Droplet, Wrench } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Placeholder data for dashboard sections
    const communityImpact = {
        issuesResolved: 89,
        responseTime: '2.3 days avg',
        communityScore: '95%',
    };

    const recentReports = [
        { title: 'Large pothole on Main Street', location: 'Main St & 5th Ave', status: 'pending', votes: 23, time: '2 hours ago' },
        { title: 'Overflowing garbage bin', location: 'Central Park entrance', status: 'in progress', votes: 18, time: '4 hours ago' },
        { title: 'Broken street light', location: 'Oak Avenue', status: 'resolved', votes: 31, time: '1 day ago' },
    ];
    
    const issueCategories = [
        { category: 'Garbage & Waste', count: 45, icon: <Trash2 size={24} /> },
        { category: 'Potholes', count: 32, icon: <Wrench size={24} /> },
        { category: 'Water Issues', count: 28, icon: <Droplet size={24} /> },
        { category: 'Street Lights', count: 21, icon: <Lightbulb size={24} /> },
    ];

    const fetchComplaints = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:3000/api/v1/complaints/dashboard/${user._id}`, {
                withCredentials: true,
            });
            setComplaints(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch complaints');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetchComplaints();
        }
    }, [user, navigate, fetchComplaints]);

    const handleLogout = () => {
        axios.post('http://localhost:3000/api/v1/users/logout', {}, { withCredentials: true })
            .catch(() => {})
            .finally(() => {
                signOut();
                navigate('/login');
            });
    };

    if (!user) {
        return null;
    }
    
    const getUserInitials = (name) => {
        if (!name) return 'JD';
        const nameParts = name.split(' ');
        const initials = nameParts.map(part => part[0]).join('');
        return initials.toUpperCase();
    };

    return (
        <>
            <header className="header-top">
                <div className="logo-section">
                    <img src="/images/logo.png" alt="Clean Street Logo" className="logo-image" />
                    <div className="logo-text">Clean Street</div>
                </div>
                <nav className="nav-links">
                    <Link to="/dashboard" className="active">Dashboard</Link>
                    <Link to="/browse-issues">Browse Issues</Link>
                    <Link to="/report-issue">Report Issue</Link>
                </nav>
                <div className="user-profile">
                    <Link to="/profile" className="profile-link">
                        <div className="user-initials">{getUserInitials(user.name)}</div>
                        <span className="user-name">{user.name}</span>
                    </Link>
                    <button onClick={handleLogout} className="logout-btn-header">
                        <ArrowRight size={20} />
                    </button>
                </div>
            </header>

            <div className="dashboard-container">
                <div className="dashboard-hero">
                    <div className="hero-content-wrapper">
                        <h2>Welcome to Clean Street Dashboard</h2>
                        <p>Together, we're making our community cleaner and safer. Monitor progress, track impact, and see how your contributions make a difference.</p>
                        <div className="hero-buttons">
                            <button className="hero-btn-primary"><PlusCircle size={16} /> Report New Issue</button>
                            <button className="hero-btn-secondary"><Link to="/browse-issues">Browse Issues</Link></button>
                        </div>
                    </div>
                </div>

                <div className="dashboard-stats-row">
                    <div className="stat-card total-reports-card">
                        <div className="stat-icon-container">
                            <span className="stat-icon">📈</span>
                        </div>
                        <h3 className="stat-value">2,847</h3>
                        <p className="stat-label">Total Reports</p>
                    </div>
                    <div className="stat-card active-issues-card">
                        <div className="stat-icon-container">
                            <span className="stat-icon">🔥</span>
                        </div>
                        <h3 className="stat-value">156</h3>
                        <p className="stat-label">Active Issues</p>
                    </div>
                    <div className="stat-card resolved-card">
                        <div className="stat-icon-container">
                            <span className="stat-icon">✅</span>
                        </div>
                        <h3 className="stat-value">89</h3>
                        <p className="stat-label">Resolved This Month</p>
                    </div>
                    <div className="stat-card pending-card">
                        <div className="stat-icon-container">
                            <span className="stat-icon">⏳</span>
                        </div>
                        <h3 className="stat-value">47</h3>
                        <p className="stat-label">Pending Issues</p>
                    </div>
                </div>
                
                <div className="dashboard-main">
                    <aside className="dashboard-sidebar-panels">
                        <div className="panel issue-categories-panel">
                            <div className="panel-header">
                                <h3><BarChart3 size={20} /> Issue Categories</h3>
                            </div>
                            <p className="panel-subtitle">Current active issues by type</p>
                            <div className="categories-list">
                                {issueCategories.map((item, index) => (
                                    <div key={index} className="category-item">
                                        <div className="category-icon-title">
                                            <span className="category-icon">{item.icon}</span>
                                            <span className="category-title">{item.category}</span>
                                        </div>
                                        <span className="category-count">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="panel community-impact-panel">
                            <h3><Users size={20} /> Community Impact</h3>
                            <div className="impact-stats">
                                <div className="impact-stat-item">
                                    <span>Issues Resolved</span>
                                    <strong>{communityImpact.issuesResolved} <small>this month</small></strong>
                                </div>
                                <div className="impact-stat-item">
                                    <span>Response Time</span>
                                    <strong>{communityImpact.responseTime}</strong>
                                </div>
                                <div className="impact-stat-item">
                                    <span>Community Score</span>
                                    <strong>{communityImpact.communityScore}</strong>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <main className="dashboard-content-panels">
                        <div className="panel recent-reports-panel">
                            <div className="panel-header">
                                <h3><FileText size={20} /> Recent Reports</h3>
                                <Link to="/browse-issues" className="view-all">View All <ArrowRight size={16} /></Link>
                            </div>
                            <p className="panel-subtitle">Latest issues reported by the community</p>
                            <div className="reports-list">
                                {recentReports.map((report, index) => (
                                    <div key={index} className="report-card">
                                        <div className="report-details">
                                            <h4 className="report-title">{report.title}</h4>
                                            <div className="report-meta">
                                                <MapPin size={16} /> {report.location}
                                            </div>
                                            <div className="report-info">
                                                <span className={`status-label status-${report.status.replace(/\s/g, '').toLowerCase()}`}>{report.status}</span>
                                                <span className="report-votes">{report.votes} votes</span>
                                                <span className="report-time">{report.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="panel quick-actions-panel">
                            <h3><PlusCircle size={20} /> Quick Actions</h3>
                            <div className="actions-grid">
                                <div className="action-card primary">
                                    <button onClick={() => navigate('/report-issue')}>
                                        <h4>Report Issue</h4>
                                        <p>Help improve your community</p>
                                    </button>
                                </div>
                                <div className="action-card secondary">
                                    <button onClick={() => navigate('/browse-issues')}>
                                        <h4>Browse Issues</h4>
                                        <p>See what others reported</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>
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

export default Dashboard;
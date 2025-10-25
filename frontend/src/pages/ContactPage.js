import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Phone, Mail, MessageSquare, ArrowRight, Globe } from 'lucide-react';
import './ContactPage.css';
import MapComponent from './MapPage';

export default function ContactPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    inquiryType: '',
    subject: '',
    message: ''
  });

  // State for selected office location
  const [selectedOffice, setSelectedOffice] = useState({
    lat: 37.7749,
    lng: -122.4194,
    name: 'San Francisco'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Message sent successfully!');
    setFormData({
      name: '',
      email: '',
      organization: '',
      inquiryType: '',
      subject: '',
      message: ''
    });
  };

  const handleSignIn = () => navigate("/login");
  const handleGetStarted = () => navigate("/signup");
  
  // Role-based dashboard navigation
  const handleDashboard = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role === 'volunteer') {
      navigate('/volunteer', { state: { userType: 'volunteer' } });
    } else if (user.role === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/dashboard');
    }
  };
  
  // Logout with confirmation
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      signOut();
      navigate("/");
    }
  };

  // Handle office selection for map
  const handleOfficeSelect = (lat, lng, name) => {
    setSelectedOffice({ lat, lng, name });
  };

  return (
    <div className="contact-page">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo-section">
            <img src="/images/logo.png" alt="Clean Street Logo" className="logo-image" />
            <div className="logo-text">
              <h1>Clean Street</h1>
            </div>
          </div>
          <nav className="nav">
            <Link to="/" className="nav-link">
              <MapPin className="nav-icon" /> Home
            </Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/help" className="nav-link">Help</Link>
            <Link to="/contactpage" className="nav-link active">Contact</Link>
          </nav>
          <div className="header-buttons">
            {user ? (
              <>
                <button onClick={handleDashboard} className="btn-signin">
                  Dashboard <ArrowRight size={16} />
                </button>
                <button onClick={handleLogout} className="btn-primary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={handleSignIn} className="btn-signin">
                  Sign In
                </button>
                <button onClick={handleGetStarted} className="btn-primary">
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <MessageSquare className="hero-icon" />
          <h2>Get in Touch</h2>
          <p>We're here to help you make the most of Clean Street. Reach out with questions, feedback, or partnership inquiries.</p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="contact-methods">
        <div className="container">
          <div className="methods-grid">
            <div className="method-card">
              <div className="method-icon">
                <Mail />
              </div>
              <h3>Email Support</h3>
              <p>24/7 Help Available</p>
              <a href="mailto:support@cleanstreet.com">support@cleanstreet.com</a>
              <small>Get a response within 24 hours</small>
            </div>

            <div className="method-card">
              <div className="method-icon">
                <Phone />
              </div>
              <h3>Phone Support</h3>
              <p>Available 24/7</p>
              <a href="tel:+18005551234">1-800-555-1234</a>
              <small>Mon - Fri, 9AM-6PM PST</small>
            </div>

            <div className="method-card">
              <div className="method-icon">
                <MessageSquare />
              </div>
              <h3>Live Chat</h3>
              <p>Available 24/7</p>
              <a href="#chat">Start Chat</a>
              <small>Mon - Fri, 9AM-6PM PST</small>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="contact-content">
        <div className="container">
          <div className="content-grid">
            {/* Contact Form */}
            <div className="form-section">
              <h3>Send Us a Message</h3>
              <p className="form-subtitle">Have a question or feedback? Fill out the form below and we'll get back to you as soon as possible.</p>
              
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input 
                      type="text" 
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input 
                      type="email" 
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Organization (optional)</label>
                  <input 
                    type="text" 
                    name="organization"
                    placeholder="Your company or organization"
                    value={formData.organization}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Inquiry Type *</label>
                  <select 
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select inquiry type</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <input 
                    type="text" 
                    name="subject"
                    placeholder="Brief description of your inquiry"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Message *</label>
                  <textarea 
                    name="message"
                    rows="5"
                    placeholder="Please provide as much detail about your inquiry as possible..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn-submit">
                  Send Message
                </button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="sidebar">
              <div className="info-card">
                <h4>Response Time</h4>
                <div className="info-item">
                  <strong>Email:</strong> <span>24 hours</span>
                </div>
                <div className="info-item">
                  <strong>Phone:</strong> <span>Immediate</span>
                </div>
                <div className="info-item">
                  <strong>Live Chat:</strong> <span>5 minutes</span>
                </div>
              </div>

              <div className="info-card">
                <h4>Business Hours</h4>
                <div className="info-item">
                  <strong>Monday - Friday:</strong> <span>9AM - 6PM PST</span>
                </div>
                <div className="info-item">
                  <strong>Weekend:</strong> <span>10AM - 4PM PST</span>
                </div>
                <div className="info-item">
                  <strong>Support:</strong> <span>24/7 Available</span>
                </div>
              </div>

              <div className="info-card">
                <h4>Follow us</h4>
                <div className="social-links">
                  <label className="checkbox-label">
                    <input type="checkbox" /> Twitter
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" /> Facebook
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" /> Instagram
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" /> LinkedIn
                  </label>
                </div>
                <p className="info-note">Stay connected and get the latest updates from Clean Street</p>
              </div>

              <div className="info-card">
                <h4>Emergency Issue?</h4>
                <p className="info-note">For urgent safety issues, local emergencies or immediate assistance, please contact:</p>
                <button className="btn-emergency" onClick={() => navigate('/report-issue')}>
                  Report an Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offices Section with Interactive Map */}
      <section className="offices-section">
        <div className="container">
          <h2>Our Offices</h2>
          
          {/* Interactive Map */}
          <div className="map-container">
            <h3>Location: {selectedOffice.name}</h3>
            <MapComponent 
              initialCenter={{ lat: selectedOffice.lat, lng: selectedOffice.lng }}
              onLocationSelect={(lat, lng) => console.log('Map clicked:', lat, lng)}
            />
          </div>

          <div className="offices-grid">
            <div 
              className="office-card" 
              onClick={() => handleOfficeSelect(37.7749, -122.4194, 'San Francisco')}
              style={{ cursor: 'pointer' }}
            >
              <div className="office-header">
                <MapPin className="office-icon" />
                <span>San Francisco</span>
              </div>
              <div className="office-details">
                <p>123 Market Street, Suite 100</p>
                <p>San Francisco, CA 94105</p>
                <p className="office-phone">+1 (415) 555-0100</p>
              </div>
              <button className="btn-map">View on Map</button>
            </div>

            <div 
              className="office-card"
              onClick={() => handleOfficeSelect(30.2672, -97.7431, 'Austin')}
              style={{ cursor: 'pointer' }}
            >
              <div className="office-header">
                <MapPin className="office-icon" />
                <span>Austin</span>
              </div>
              <div className="office-details">
                <p>456 Congress Avenue, Floor 12</p>
                <p>Austin, TX 78701</p>
                <p className="office-phone">+1 (512) 555-0100</p>
              </div>
              <button className="btn-map">View on Map</button>
            </div>

            <div 
              className="office-card"
              onClick={() => handleOfficeSelect(42.3601, -71.0589, 'Boston')}
              style={{ cursor: 'pointer' }}
            >
              <div className="office-header">
                <MapPin className="office-icon" />
                <span>Boston</span>
              </div>
              <div className="office-details">
                <p>789 Commonwealth Ave, Suite 200</p>
                <p>Boston, MA 02215</p>
                <p className="office-phone">+1 (617) 555-0100</p>
              </div>
              <button className="btn-map">View on Map</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
            <li><Link to="/how-it-works">How it Works</Link></li>
            <li><Link to="/features">Features</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/mobile-app">Mobile App</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Support</h4>
          <ul>
            <li><Link to="/help">Help Center</Link></li>
            <li><Link to="/contactpage">Contact Us</Link></li>
            <li><Link to="/user-guide">User Guide</Link></li>
            <li><Link to="/community-forum">Community Forum</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/press">Press Kit</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
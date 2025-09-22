import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Target, Globe, Heart, Shield, Users, Lightbulb, ArrowRight, Mail, Phone } from 'lucide-react';
import './About.css';

const About = () => {
  const navigate = useNavigate();
  const isSignedIn = false; // Placeholder for authentication state

  const coreValues = [
    {
      icon: Heart,
      title: 'Community First',
      description: 'We believe that strong communities are built when citizens actively participate in making their neighborhoods better.',
      color: '#ef4444'
    },
    {
      icon: Shield,
      title: 'Transparency',
      description: 'Every report, vote, and resolution is tracked openly, ensuring accountability from submission to completion.',
      color: '#2563eb'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'We foster partnerships between citizens, local government, and organizations to create lasting positive change.',
      color: '#10b981'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We leverage technology to make civic engagement accessible, efficient, and impactful for everyone.',
      color: '#f59e0b'
    }
  ];

  const handleSignIn = () => navigate("/login");
  const handleGetStarted = () => navigate("/signup");

  return (
    <div className="about-container">
      {/* Header and Navigation */}
      <header className="header-top">
        <div className="logo-section">
          <img src="/images/logo.png" alt="Clean Street Logo" className="logo-image" />
          <div className="logo-text">Clean Street</div>
        </div>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/help">Help</Link>
          <Link to="/about" className="active">About</Link>
        </nav>
        <div className="auth-buttons">
          <button onClick={handleSignIn} className="sign-in-btn">
            Sign In <ArrowRight size={16} />
          </button>
          <button onClick={handleGetStarted} className="get-started-btn">Get Started</button>
        </div>
      </header>
      
      {/* Main Content */}
      <main>
        {/* Our Mission Section */}
        <section className="mission-section">
          <div className="container">
            <div className="mission-section-content">
              <div className="mission-text-container">
                <Target size={40} color="#2c5292" />
                <h2>Our Mission</h2>
                <p>To bridge the gap between citizens and local government by providing a transparent, efficient, and engaging platform for reporting and resolving community issues.</p>
              </div>
              {/* Note: The mission image is not in your provided image, so I'll assume you still want it. */}
              {/* To remove it, simply delete the following div. */}
              <div className="mission-image-container">
                <img src="/images/mission-image.png" alt="Mission" className="mission-image" />
              </div>
            </div>
          </div>
        </section>

        {/* Our Core Values Section */}
        <section className="values-section">
          <div className="container text-center">
            <h2>Our Core Values</h2>
            <p className="subtitle">The principles that guide everything we do.</p>
            <div className="values-grid">
              {coreValues.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div key={index} className="value-card">
                    <div className="value-icon-container" style={{ backgroundColor: `${value.color}15` }}>
                      <IconComponent size={40} color={value.color} />
                    </div>
                    <h3>{value.title}</h3>
                    <p>{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our Impact Section */}
        <section className="impact-section">
          <div className="container text-center">
            <h2>Our Impact</h2>
            <p className="subtitle">Making a real difference in communities across the country.</p>
            <div className="impact-grid">
              <div className="impact-item">
                <h3>1,500+</h3>
                <p>Issues Resolved</p>
              </div>
              <div className="impact-item">
                <h3>5,000+</h3>
                <p>Active Citizens</p>
              </div>
              <div className="impact-item">
                <h3>50+</h3>
                <p>Partner Cities</p>
              </div>
            </div>
          </div>
        </section>
      </main>

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
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Mobile App</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><a href="#">User Guide</a></li>
            <li><a href="#">Community Forum</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press Kit</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default About;
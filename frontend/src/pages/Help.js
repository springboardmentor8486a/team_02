import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ChevronDown, ChevronUp, Search, BookOpen, MessageCircle, Phone, ArrowRight, Mail, Globe } from 'lucide-react';
import './Help.css';

const Help = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const faqs = [
    {
      question: "How do I report an issue?",
      answer: "To report an issue, click the 'Report Issue' button on the map, take a photo, add a description, and submit. The issue will be reviewed by local authorities."
    },
    {
      question: "How long does it take to resolve an issue?",
      answer: "Resolution times vary depending on the type and severity of the issue. Simple issues like potholes may be fixed within a week, while larger infrastructure projects may take several months."
    },
    {
      question: "Can I track the progress of my reports?",
      answer: "Yes! You can track all your reports in your dashboard. You'll receive notifications when the status changes from 'Reported' to 'In Progress' to 'Completed'."
    },
    {
      question: "Is my personal information safe?",
      answer: "Absolutely. We take privacy seriously and only share necessary information with local authorities. Your personal details are never made public."
    },
    {
      question: "How do I vote on community issues?",
      answer: "Browse issues in your area and click the vote button. Your vote helps prioritize which issues get addressed first by local authorities."
    },
    {
      question: "What if I disagree with how an issue was resolved?",
      answer: "You can comment on resolved issues or report new issues if the problem persists. Community feedback helps improve future responses."
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleSignIn = () => navigate("/login");
  const handleGetStarted = () => navigate("/signup");
  
  // Role-based dashboard navigation - CORRECTED
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
  
  // Fixed logout with confirmation - CORRECTED
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      signOut();
      navigate("/");
    }
  };

  return (
    <div className="help-container">
      <header className="header-top">
        <div className="logo-section">
          <img src="/images/logo.png" alt="Clean Street Logo" className="logo-image" />
          <div className="logo-text">Clean Street</div>
        </div>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/help" className="active">Help</Link>
          <Link to="/about">About</Link>
        </nav>
        <div className="auth-buttons">
          {user ? (
            <>
              <button onClick={handleDashboard} className="sign-in-btn">
                Dashboard <ArrowRight size={16} />
              </button>
              <button onClick={handleLogout} className="get-started-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={handleSignIn} className="sign-in-btn">
                Sign In <ArrowRight size={16} />
              </button>
              <button onClick={handleGetStarted} className="get-started-btn">
                Get Started
              </button>
            </>
          )}
        </div>
      </header>

      <main>
        {/* Help Banner Section */}
        <section className="help-banner-section">
          <div className="banner-content">
            <h1 className="banner-title">How can we help?</h1>
            <p className="banner-subtitle">Find answers to your questions, connect with the community, or contact our support team.</p>
          </div>
          <div className="search-bar-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="text-center">
            <h2>Frequently Asked Questions</h2>
            <p className="subtitle">Find quick answers to the most common questions about Clean Street.</p>
          </div>
          <div className="faq-list">
            {filteredFAQs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button className="faq-question-btn" onClick={() => toggleFAQ(index)}>
                  <span>{faq.question}</span>
                  {openFAQ === index ? <ChevronUp size={24} color="#2c5292" /> : <ChevronDown size={24} color="#718096" />}
                </button>
                {openFAQ === index && (
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Additional Resources Section */}
        <section className="resources-section">
          <div className="text-center">
            <h2>Additional Resources</h2>
            <p className="subtitle">More ways to get help and learn about Clean Street.</p>
          </div>
          <div className="resources-grid">
            <div className="resource-card">
              <div className="resource-icon-container" style={{ backgroundColor: '#e2f0ff' }}>
                <BookOpen size={40} color="#2c5292" />
              </div>
              <h3>User Guide</h3>
              <p>Comprehensive guide to using all features of Clean Street.</p>
              <button className="btn btn-primary">Read Guide</button>
            </div>
            <div className="resource-card">
              <div className="resource-icon-container" style={{ backgroundColor: '#d1fae5' }}>
                <MessageCircle size={40} color="#10b981" />
              </div>
              <h3>Community Forum</h3>
              <p>Connect with other users and share experiences.</p>
              <button className="btn btn-primary">Join Forum</button>
            </div>
            <div className="resource-card">
              <div className="resource-icon-container" style={{ backgroundColor: '#f3e8ff' }}>
                <Phone size={40} color="#8b5cf6" />
              </div>
              <h3>Contact Support</h3>
              <p>Still need help? Our support team is here for you.</p>
              <button className="btn btn-primary" onClick={() => navigate('/contactpage')}>Contact Us</button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer class="simple-footer">
  © 2025 Clean Street | Civic Engagement Platform | 
  <a href="mailto:hello@cleanstreet.org">hello@cleanstreet.org</a>
</footer>

    </div>
  );
};

export default Help;
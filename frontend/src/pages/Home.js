import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ArrowRight, Camera, MapPin, Users, Clock, MessageCircle, BarChart3, Shield, CheckCircle, Mail, Phone, Globe } from "lucide-react";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

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
  
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      signOut();
      navigate("/");
    }
  };

  const features = [
    { icon: Camera, title: "Photo Reports", description: "Upload photos to document issues clearly and help authorities understand the problem." },
    { icon: MapPin, title: "GPS Location", description: "Automatically capture precise location data to ensure issues are addressed at the right spot." },
    { icon: Users, title: "Community Voting", description: "Let the community vote on issues to prioritize the most important problems." },
    { icon: Clock, title: "Real-time Tracking", description: "Track the status of your reports in real-time." },
    { icon: MessageCircle, title: "Community Discussion", description: "Engage with neighbors and officials to build a collaborative solution." },
    { icon: BarChart3, title: "Analytics Dashboard", description: "Local authorities can monitor trends and generate reports for strategic planning." },
  ];

  return (
    <div className="home-container">
      <header className="header-top">
        <div className="logo-section">
          <img src="/images/logo.png" alt="Clean Street Logo" className="logo-image" />
          <div className="logo-text">Clean Street</div>
        </div>
        <nav className="nav-links">
          <Link to="/" className="active">Home</Link>
          <Link to="/help">Help</Link>
          <Link to="/about">About</Link>
          <Link to="/contactpage">Contact</Link>
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
        {/* Hero Section */}
        <section className="hero-main">
          <div className="hero-content">
            <p className="hero-badge-small">Empowering Communities Since 2024</p>
            <h1 className="hero-titleeee">Make Your <span className="highlight-text">Community</span> Better</h1>
            <p className="hero-description">
              Clean Street is a smart civic engagement platform that empowers citizens to report local issues, track their resolution, and build stronger communities through collaborative action.
            </p>
            <div className="hero-action-buttons-alt">
              {user ? (
                <button onClick={handleDashboard} className="get-started-free-btn">
                  Go to Dashboard <ArrowRight size={20} />
                </button>
              ) : (
                <>
                  <button onClick={handleGetStarted} className="get-started-free-btn">
                    Get Started Free <ArrowRight size={20} />
                  </button>
                  <button className="learn-more-btn">Learn More</button>
                </>
              )}
            </div>
          </div>
          <div className="hero-image-section">
            <div className="image-container">
              <img src="/images/landing-page-image.jpg" alt="Community" className="hero-image" />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-strip">
          <div className="stat-item">
            <h3>1,500+</h3>
            <p>Issues Reported</p>
          </div>
          <div className="stat-item">
            <h3>80%</h3>
            <p>Resolution Rate</p>
          </div>
          <div className="stat-item">
            <h3>50+</h3>
            <p>Partner Cities</p>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works-section">
          <h2>How It Works</h2>
          <p className="subtitle">Simple steps to make your community better.</p>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-icon-container">
                <div className="step-icon">
                  <Camera size={32} color="#2c5292" />
                </div>
                <div className="step-number">1</div>
              </div>
              <h3>Report an Issue</h3>
              <p>Take a photo and describe the civic issue you've encountered in your neighborhood.</p>
            </div>
            <div className="step-card">
              <div className="step-icon-container">
                <div className="step-icon">
                  <Users size={32} color="#2c5292" />
                </div>
                <div className="step-number">2</div>
              </div>
              <h3>Community Engagement</h3>
              <p>Other residents can vote and comment on your report to show community support.</p>
            </div>
            <div className="step-card">
              <div className="step-icon-container">
                <div className="step-icon">
                  <Shield size={32} color="#2c5292" />
                </div>
                <div className="step-number">3</div>
              </div>
              <h3>Official Review</h3>
              <p>Local authorities review and prioritize issues based on community input and severity.</p>
            </div>
            <div className="step-card">
              <div className="step-icon-container">
                <div className="step-icon">
                  <CheckCircle size={32} color="#2c5292" />
                </div>
                <div className="step-number">4</div>
              </div>
              <h3>Resolution & Updates</h3>
              <p>Track the progress of your report and get notified when the issue is resolved.</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2>Powerful Features for Civic Engagement</h2>
          <p className="subtitle">Everything you need to report, track, and resolve community issues effectively.</p>
          <div className="features-grid">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={idx} className="feature-card-item">
                  <div className="feature-icon-container" style={{ backgroundColor: "#e2e8f0" }}>
                    <Icon size={28} color="#2c5292" />
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <h2>What People Are Saying</h2>
          <p className="subtitle">Real stories from real people making a difference in their communities.</p>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p>"Clean Street made it so easy to report the pothole on my street. It was fixed within a week!"</p>
              <h4>Sarah Johnson</h4>
              <p className="role">Resident</p>
            </div>
            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p>"I love how I can track all the issues in my neighborhood and help coordinate with city officials."</p>
              <h4>Mike Chen</h4>
              <p className="role">Community Volunteer</p>
            </div>
            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p>"The analytics dashboard gives us invaluable insights into community needs and helps us prioritize resources."</p>
              <h4>Dr. Emily Rodriguez</h4>
              <p className="role">City Administrator</p>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="final-cta-section">
          <h2>Ready to Make a Difference?</h2>
          <p>
            Join your community in building a better neighborhood. Report issues, track progress, and see real change happen.
          </p>
          <div className="hero-action-buttons">
            {user ? (
              <button onClick={handleDashboard} className="sign-up-btn">
                Go to Dashboard <ArrowRight size={20} />
              </button>
            ) : (
              <>
                <button onClick={handleGetStarted} className="sign-up-btn">
                  Sign Up Now <ArrowRight size={20} />
                </button>
                <span className="no-credit-text">Free to use • No credit card required</span>
              </>
            )}
          </div>
        </section>
      </main>

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
};

export default Home;
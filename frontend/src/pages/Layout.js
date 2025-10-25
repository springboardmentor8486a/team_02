// Layout.jsx
import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Menu, X } from 'lucide-react';
import './Layout.css';

const Layout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/browse-issues', label: 'Browse Issues' },
    { path: '/report-issue', label: 'Report Issue' }
  ];

  return (
    <div className="layout-wrapper">
      <header className="app-header">
        <div className="header-container">
          <div className="logo-section">
            <Link to="/" className="logo-link">
              <img
                src="/images/logo.png"
                alt="Clean Street Logo"
                className="logo-image"
                onError={(e) => {
                  e.target.src = "https://api.dicebear.com/7.x/shapes/svg?seed=cleanstreet&backgroundColor=2c5292";
                }}
              />
              <span className="logo-text">Clean Street</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="nav-links desktop-nav">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={isActive(item.path) ? 'active' : ''}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Section */}
          {user && (
            <div className="user-section">
              <Link to="/profile" className="profile-link">
                <div className="user-initials">{getUserInitials(user.name)}</div>
                <span className="user-name">{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="logout-btn-header"
                aria-label="Logout"
                title="Logout"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="mobile-nav">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={isActive(item.path) ? 'active' : ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <button onClick={handleLogout} className="mobile-logout-btn">
                <ArrowRight size={18} />
                <span>Logout</span>
              </button>
            )}
          </nav>
        )}
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-column footer-logo-section">
              <div className="logo-section">
                <img
                  src="/images/logo.png"
                  alt="Clean Street Logo"
                  className="logo-image"
                  onError={(e) => {
                    e.target.src = "https://api.dicebear.com/7.x/shapes/svg?seed=cleanstreet&backgroundColor=ffffff";
                  }}
                />
                <span className="logo-text">Clean Street</span>
              </div>
              <p className="footer-tagline">Making our streets cleaner, together.</p>
              <p className="footer-copyright">
                &copy; {new Date().getFullYear()} Clean Street. All Rights Reserved.
              </p>
            </div>

            <div className="footer-column">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/browse-issues">Browse Issues</Link></li>
                <li><Link to="/report-issue">Report Issue</Link></li>
                <li><Link to="/about">About Us</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Support</h4>
              <ul>
                <li><Link to="/help">Help Center</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Connect</h4>
              <div className="contact-info">
                <p>📧 support@cleanstreet.com</p>
                <p>📞 +1 (555) 123-4567</p>
                <p>📍 123 Main Street, City, State</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

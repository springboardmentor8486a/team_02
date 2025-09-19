import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Help from './pages/Help';
import Contact from './pages/Contact';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import GetStarted from './pages/GetStarted';
import MapPage from './pages/MapPage';
import Dashboard from './pages/Dashboard';
import BrowseIssues from './pages/BrowseIssues';
import ReportIssue from './pages/ReportIssue';
import UserProfile from './pages/UserProfile';
import UpdateProfile from './pages/UpdateProfile';

const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return React.createElement('div', { className: 'App' },
    // Only show main Header on non-home pages
    !isHomePage && React.createElement(Header),
    React.createElement(Routes, null,
      React.createElement(Route, { path: '/', element: React.createElement(Home) }),
      React.createElement(Route, { path: '/about', element: React.createElement(About) }),
      React.createElement(Route, { path: '/help', element: React.createElement(Help) }),
      React.createElement(Route, { path: '/contact', element: React.createElement(Contact) }),
      React.createElement(Route, { path: '/signin', element: React.createElement(SignIn) }),
      React.createElement(Route, { path: '/signup', element: React.createElement(SignUp) }),
      React.createElement(Route, { path: '/forgot-password', element: React.createElement(ForgotPassword) }),
      React.createElement(Route, { path: '/get-started', element: React.createElement(GetStarted) }),
      React.createElement(Route, { path: '/map', element: React.createElement(MapPage) }),
      React.createElement(Route, { path: '/dashboard', element: React.createElement(Dashboard) }),
      React.createElement(Route, { path: '/browse-issues', element: React.createElement(BrowseIssues) }),
      React.createElement(Route, { path: '/report-issue', element: React.createElement(ReportIssue) }),
      React.createElement(Route, { path: '/profile', element: React.createElement(UserProfile) }),
      React.createElement(Route, { path: '/update-profile', element: React.createElement(UpdateProfile) })
    ),
    React.createElement(Footer)
  );
};

function App() {
  return React.createElement(AuthProvider, null,
    React.createElement(Router, null,
      React.createElement(AppContent)
    )
  );
}

export default App;

import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Clock, Eye, BarChart3, RefreshCw, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  
  const metrics = [
    { title: 'Total Issues', value: '2', description: 'Community-wide reports', icon: BarChart3, color: 'blue' },
    { title: 'Resolved', value: '0', description: '0% resolution rate', icon: CheckCircle, color: 'green' },
    { title: 'Pending', value: '2', description: 'Awaiting resolution', icon: Clock, color: 'yellow' },
    { title: 'My Reports', value: '2', description: '17 total votes received', icon: Eye, color: 'blue' }
  ];

  const recentIssues = [
    {
      id: 1,
      title: 'Pothole on Main Street',
      address: '123 Main Street, Demo City',
      status: 'received',
      votes: 5,
      comments: 4,
      date: '9/17/2025'
    },
    {
      id: 2,
      title: 'Broken Streetlight',
      address: '456 Oak Avenue, Demo City',
      status: 'in review',
      votes: 12,
      comments: 7,
      date: '9/16/2025'
    }
  ];

  const myReports = [
    {
      id: 1,
      title: 'Pothole on Main Street',
      address: '123 Main Street, Demo City',
      status: 'received',
      votes: 5,
      date: '9/17/2025'
    },
    {
      id: 2,
      title: 'Broken Streetlight',
      address: '456 Oak Avenue, Demo City',
      status: 'in review',
      votes: 12,
      date: '9/16/2025'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'received': return '#fbbf24';
      case 'in review': return '#3b82f6';
      case 'resolved': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'received': return 'received';
      case 'in review': return 'in review';
      case 'resolved': return 'resolved';
      default: return status;
    }
  };

  return React.createElement('div', { className: 'dashboard' },
    // Page Header
    React.createElement('div', { className: 'page-header' },
      React.createElement('div', { className: 'page-header-content' },
        React.createElement('div', { className: 'page-title-section' },
          React.createElement('h1', { className: 'page-title' }, `Welcome back, ${user?.name || 'Demo User'}!`),
          React.createElement('p', { className: 'page-subtitle' }, 'Track your reports and community progress'),
          React.createElement('div', { className: 'location-info' },
            React.createElement(MapPin, { size: 16 }),
            React.createElement('span', null, 'Demo City')
          )
        )
      )
    ),

    // Metrics Cards
    React.createElement('div', { className: 'metrics-grid' },
      metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return React.createElement('div', { key: index, className: 'metric-card' },
          React.createElement('div', { className: 'metric-header' },
            React.createElement('h3', { className: 'metric-title' }, metric.title),
            React.createElement('div', { className: 'metric-icon' },
              React.createElement(IconComponent, { size: 20 })
            )
          ),
          React.createElement('div', { className: 'metric-content' },
            React.createElement('h2', { className: 'metric-value' }, metric.value),
            React.createElement('p', { className: 'metric-description' }, metric.description)
          )
        );
      })
    ),

    // Community Progress
    React.createElement('div', { className: 'community-progress' },
      React.createElement('div', { className: 'progress-header' },
        React.createElement('div', { className: 'progress-title-section' },
          React.createElement(BarChart3, { size: 20 }),
          React.createElement('h3', { className: 'progress-title' }, 'Community Progress')
        )
      ),
      React.createElement('p', { className: 'progress-description' }, 'Track how well your community is resolving issues'),
      React.createElement('div', { className: 'progress-bar-section' },
        React.createElement('span', { className: 'progress-label' }, 'Resolution Rate'),
        React.createElement('div', { className: 'progress-bar' },
          React.createElement('div', { className: 'progress-fill', style: { width: '0%' } })
        ),
        React.createElement('span', { className: 'progress-percentage' }, '0%')
      )
    ),

    // Recent Issues and My Reports
    React.createElement('div', { className: 'reports-grid' },
      // Recent Community Issues
      React.createElement('div', { className: 'reports-card' },
        React.createElement('div', { className: 'card-header' },
          React.createElement('div', { className: 'card-title-section' },
            React.createElement(BarChart3, { size: 20 }),
            React.createElement('h3', { className: 'card-title' }, 'Recent Community Issues')
          ),
          React.createElement('button', { className: 'refresh-btn' },
            React.createElement(RefreshCw, { size: 16 }),
            'Refresh'
          )
        ),
        React.createElement('p', { className: 'card-description' }, 'Latest issues reported in your community'),
        React.createElement('div', { className: 'issues-list' },
          recentIssues.map((issue) => 
            React.createElement('div', { key: issue.id, className: 'issue-item' },
              React.createElement('div', { className: 'issue-content' },
                React.createElement('div', { className: 'issue-header' },
                  React.createElement(Clock, { size: 16 }),
                  React.createElement('h4', { className: 'issue-title' }, issue.title)
                ),
                React.createElement('p', { className: 'issue-address' }, issue.address),
                React.createElement('div', { className: 'issue-stats' },
                  React.createElement('span', { className: 'issue-votes' }, `Net Votes: ${issue.votes} Comments: ${issue.comments}`)
                )
              ),
              React.createElement('div', { className: 'issue-status' },
                React.createElement('span', { 
                  className: 'status-badge',
                  style: { backgroundColor: getStatusColor(issue.status) }
                }, getStatusText(issue.status)),
                React.createElement('div', { className: 'issue-date' }, issue.date)
              )
            )
          )
        )
      ),

      // My Recent Reports
      React.createElement('div', { className: 'reports-card' },
        React.createElement('div', { className: 'card-header' },
          React.createElement('div', { className: 'card-title-section' },
            React.createElement(Eye, { size: 20 }),
            React.createElement('h3', { className: 'card-title' }, 'My Recent Reports')
          )
        ),
        React.createElement('p', { className: 'card-description' }, 'Your latest issue reports and their status'),
        React.createElement('div', { className: 'issues-list' },
          myReports.map((report) => 
            React.createElement('div', { key: report.id, className: 'issue-item' },
              React.createElement('div', { className: 'issue-content' },
                React.createElement('div', { className: 'issue-header' },
                  React.createElement(Clock, { size: 16 }),
                  React.createElement('h4', { className: 'issue-title' }, report.title)
                ),
                React.createElement('p', { className: 'issue-address' }, report.address),
                React.createElement('div', { className: 'issue-stats' },
                  React.createElement('span', { className: 'issue-votes' }, `${report.votes} votes`)
                )
              ),
              React.createElement('div', { className: 'issue-status' },
                React.createElement('span', { 
                  className: 'status-badge',
                  style: { backgroundColor: getStatusColor(report.status) }
                }, getStatusText(report.status)),
                React.createElement('div', { className: 'issue-date' }, report.date)
              )
            )
          )
        )
      )
    )
  );
};

export default Dashboard;

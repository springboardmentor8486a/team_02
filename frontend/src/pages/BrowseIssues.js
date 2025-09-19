import React, { useState } from 'react';
import { Search, Filter, List, Grid, Heart, MessageCircle, Share, TrendingUp, MapPin, Clock, User } from 'lucide-react';
import './BrowseIssues.css';

const BrowseIssues = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [sortBy, setSortBy] = useState('Newest First');
  const [viewMode, setViewMode] = useState('list');

  const categories = [
    'All Categories',
    'Garbage & Waste',
    'Potholes',
    'Water Issues',
    'Street Lights',
    'Vandalism',
    'Other'
  ];

  const statuses = [
    'All Statuses',
    'Pending',
    'In Progress',
    'Resolved'
  ];

  const sortOptions = [
    'Newest First',
    'Oldest First',
    'Most Voted',
    'Priority'
  ];

  const issues = [
    {
      id: 1,
      title: 'Large pothole causing traffic hazard',
      description: 'Deep pothole on Main Street that\'s getting worse with recent rain. Multiple cars have been damaged.',
      location: 'Main St & 5th Ave, Downtown',
      timeReported: '250 days ago',
      category: 'Potholes',
      status: 'pending',
      priority: 'high',
      likes: 18,
      dislikes: 5,
      comments: 2,
      reporter: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'Overflowing garbage bins attracting pests',
      description: 'The bins haven\'t been emptied in over a week and are attracting rats and flies.',
      location: 'Central Park entrance',
      timeReported: '251 days ago',
      category: 'Garbage & Waste',
      status: 'in progress',
      priority: 'medium',
      likes: 15,
      dislikes: 3,
      comments: 1,
      reporter: 'Mike Chen',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      title: 'Broken street light creating safety risk',
      description: 'Street light has been out for two weeks, making the area very dark at night.',
      location: 'Oak Avenue near bus stop',
      timeReported: '253 days ago',
      category: 'Street Lights',
      status: 'resolved',
      priority: 'high',
      likes: 28,
      dislikes: 3,
      comments: 1,
      reporter: 'Lisa Rodriguez',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      title: 'Water main leak flooding sidewalk',
      description: 'Large leak from underground pipe causing flooding and potential foundation damage.',
      location: 'Elm Street & 3rd Avenue',
      timeReported: '253 days ago',
      category: 'Water Issues',
      status: 'in progress',
      priority: 'urgent',
      likes: 40,
      dislikes: 5,
      comments: 2,
      reporter: 'David Thompson',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'in progress': return 'status-progress';
      case 'resolved': return 'status-resolved';
      default: return 'status-pending';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'priority-urgent';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || issue.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All Statuses' || issue.status === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return React.createElement('div', { className: 'browse-issues' },
    // Header Banner
    React.createElement('div', { className: 'browse-header' },
      React.createElement('div', { className: 'header-content' },
        React.createElement('h1', { className: 'browse-title' }, 'Community Issues Browser'),
        React.createElement('p', { className: 'browse-subtitle' }, 
          'Browse, vote, and engage with issues reported by community members. Your voice matters!'
        )
      )
    ),

    // Filter and Search Section
    React.createElement('div', { className: 'filter-section' },
      React.createElement('div', { className: 'filter-header' },
        React.createElement(Filter, { size: 20 }),
        React.createElement('h3', null, 'Filter & Search Issues'),
        React.createElement('p', null, 'Find specific issues and engage with your community')
      ),
      
      React.createElement('div', { className: 'filter-controls' },
        // Search Bar
        React.createElement('div', { className: 'search-container' },
          React.createElement(Search, { size: 20, className: 'search-icon' }),
          React.createElement('input',
            {
              type: 'text',
              placeholder: 'Search issues...',
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: 'search-input'
            }
          )
        ),

        // Filter Dropdowns
        React.createElement('div', { className: 'filter-dropdowns' },
          React.createElement('div', { className: 'dropdown-container' },
            React.createElement('select',
              {
                value: selectedCategory,
                onChange: (e) => setSelectedCategory(e.target.value),
                className: 'filter-dropdown'
              },
              categories.map(category => 
                React.createElement('option', { key: category, value: category }, category)
              )
            )
          ),

          React.createElement('div', { className: 'dropdown-container' },
            React.createElement('select',
              {
                value: selectedStatus,
                onChange: (e) => setSelectedStatus(e.target.value),
                className: 'filter-dropdown'
              },
              statuses.map(status => 
                React.createElement('option', { key: status, value: status }, status)
              )
            )
          ),

          React.createElement('div', { className: 'dropdown-container' },
            React.createElement('select',
              {
                value: sortBy,
                onChange: (e) => setSortBy(e.target.value),
                className: 'filter-dropdown'
              },
              sortOptions.map(option => 
                React.createElement('option', { key: option, value: option }, option)
              )
            )
          )
        ),

        // View Mode Toggle
        React.createElement('div', { className: 'view-toggle' },
          React.createElement('button',
            {
              className: `view-btn ${viewMode === 'list' ? 'active' : ''}`,
              onClick: () => setViewMode('list')
            },
            React.createElement(List, { size: 20 })
          ),
          React.createElement('button',
            {
              className: `view-btn ${viewMode === 'grid' ? 'active' : ''}`,
              onClick: () => setViewMode('grid')
            },
            React.createElement(Grid, { size: 20 })
          )
        )
      )
    ),

    // Results Header
    React.createElement('div', { className: 'results-header' },
      React.createElement('div', { className: 'results-info' },
        React.createElement('span', { className: 'results-count' }, `${filteredIssues.length} issues found`),
        React.createElement('span', { className: 'view-mode' }, `Showing ${viewMode} view`)
      ),
      React.createElement('div', { className: 'engagement-info' },
        React.createElement(TrendingUp, { size: 16 }),
        React.createElement('span', null, 'Community engagement: High')
      )
    ),

    // Issues List/Grid
    React.createElement('div', { className: `issues-container ${viewMode}` },
      filteredIssues.map(issue => 
        React.createElement('div', { key: issue.id, className: 'issue-card' },
          React.createElement('div', { className: 'issue-image' },
            React.createElement('img', { src: issue.image, alt: issue.title })
          ),
          
          React.createElement('div', { className: 'issue-content' },
            React.createElement('h3', { className: 'issue-title' }, issue.title),
            React.createElement('p', { className: 'issue-description' }, issue.description),
            
            React.createElement('div', { className: 'issue-meta' },
              React.createElement('div', { className: 'meta-item' },
                React.createElement(MapPin, { size: 16 }),
                React.createElement('span', null, issue.location)
              ),
              React.createElement('div', { className: 'meta-item' },
                React.createElement(Clock, { size: 16 }),
                React.createElement('span', null, issue.timeReported)
              )
            ),
            
            React.createElement('div', { className: 'issue-tags' },
              React.createElement('span', { className: 'category-tag' }, issue.category),
              React.createElement('span', { className: `status-badge ${getStatusColor(issue.status)}` }, issue.status),
              React.createElement('span', { className: `priority-badge ${getPriorityColor(issue.priority)}` }, issue.priority)
            ),
            
            React.createElement('div', { className: 'issue-engagement' },
              React.createElement('div', { className: 'engagement-item' },
                React.createElement(Heart, { size: 16 }),
                React.createElement('span', null, issue.likes)
              ),
              React.createElement('div', { className: 'engagement-item' },
                React.createElement(MessageCircle, { size: 16 }),
                React.createElement('span', null, issue.comments)
              ),
              React.createElement('div', { className: 'engagement-item' },
                React.createElement(Share, { size: 16 }),
                React.createElement('span', null, '1')
              )
            ),
            
            React.createElement('div', { className: 'issue-reporter' },
              React.createElement(User, { size: 16 }),
              React.createElement('span', null, `Reported by ${issue.reporter}`)
            )
          )
        )
      )
    ),

    // Empty State
    filteredIssues.length === 0 && 
    React.createElement('div', { className: 'empty-state' },
      React.createElement('div', { className: 'empty-content' },
        React.createElement('h3', null, 'No issues found'),
        React.createElement('p', null, 'Try adjusting your search criteria or filters'),
        React.createElement('button',
          {
            className: 'clear-filters-btn',
            onClick: () => {
              setSearchTerm('');
              setSelectedCategory('All Categories');
              setSelectedStatus('All Statuses');
            }
          },
          'Clear Filters'
        )
      )
    )
  );
};

export default BrowseIssues;

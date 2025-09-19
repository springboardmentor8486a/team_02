import React, { useState } from 'react';
import { MapPin, Navigation, Camera, Upload, Star, AlertCircle, Send, Zap } from 'lucide-react';
import './ReportIssue.css';

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    priority: 'medium',
    description: '',
    photo: null
  });

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const categories = [
    { value: 'garbage', label: 'Garbage & Waste', icon: '🗑️' },
    { value: 'potholes', label: 'Potholes & Road Damage', icon: '🛣️' },
    { value: 'water', label: 'Water Leaks & Drainage', icon: '💧' },
    { value: 'lights', label: 'Street Lights', icon: '💡' },
    { value: 'vandalism', label: 'Vandalism', icon: '🎨' },
    { value: 'other', label: 'Other', icon: '⭐' }
  ];

  const priorities = [
    { value: 'low', label: 'Low - Minor issue', description: 'Low priority - expected response within 7-10 days' },
    { value: 'medium', label: 'Medium - Moderate issue', description: 'Normal priority - expected response within 3-5 days' },
    { value: 'high', label: 'High - Serious issue', description: 'High priority - expected response within 1-2 days' },
    { value: 'urgent', label: 'Urgent - Critical issue', description: 'Urgent priority - expected response within 24 hours' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    alert('Issue reported successfully! Thank you for helping improve our community.');
  };

  const getSelectedCategory = () => {
    return categories.find(cat => cat.value === formData.category);
  };

  const getSelectedPriority = () => {
    return priorities.find(pri => pri.value === formData.priority);
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

  return React.createElement('div', { className: 'report-issue' },
    // Header Banner
    React.createElement('div', { className: 'report-header' },
      React.createElement('div', { className: 'header-content' },
        React.createElement('h1', { className: 'report-title' }, 'Report a Public Issue'),
        React.createElement('p', { className: 'report-subtitle' }, 
          'Help improve your community by reporting issues like potholes, broken streetlights, garbage, or water problems. Your voice makes a difference!'
        )
      )
    ),

    // Main Form
    React.createElement('div', { className: 'report-form-container' },
      React.createElement('form', { className: 'report-form', onSubmit: handleSubmit },
        React.createElement('div', { className: 'form-header' },
          React.createElement('div', { className: 'form-title-section' },
            React.createElement(Zap, { size: 24, className: 'form-title-icon' }),
            React.createElement('h2', { className: 'form-title' }, 'Submit Your Report')
          ),
          React.createElement('p', { className: 'form-subtitle' }, 
            'Provide detailed information to help authorities address the issue quickly and effectively.'
          )
        ),

        // Issue Title
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { className: 'form-label' }, 'Issue Title'),
          React.createElement('input',
            {
              type: 'text',
              placeholder: 'Brief, clear description of the issue',
              value: formData.title,
              onChange: (e) => handleInputChange('title', e.target.value),
              className: 'form-input',
              required: true
            }
          )
        ),

        // Category Selection
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { className: 'form-label' }, 'Category'),
          React.createElement('div', { className: 'dropdown-container' },
            React.createElement('button',
              {
                type: 'button',
                className: 'dropdown-button',
                onClick: () => setShowCategoryDropdown(!showCategoryDropdown)
              },
              React.createElement('span', { className: 'dropdown-text' },
                getSelectedCategory() ? 
                  React.createElement('span', { className: 'selected-option' },
                    React.createElement('span', { className: 'option-icon' }, getSelectedCategory().icon),
                    getSelectedCategory().label
                  ) : 
                  'Select issue category'
              ),
              React.createElement('span', { className: 'dropdown-arrow' }, '▼')
            ),
            showCategoryDropdown && 
            React.createElement('div', { className: 'dropdown-menu' },
              categories.map(category => 
                React.createElement('button',
                  {
                    key: category.value,
                    type: 'button',
                    className: 'dropdown-item',
                    onClick: () => {
                      handleInputChange('category', category.value);
                      setShowCategoryDropdown(false);
                    }
                  },
                  React.createElement('span', { className: 'option-icon' }, category.icon),
                  category.label
                )
              )
            )
          )
        ),

        // Location
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { className: 'form-label' }, 'Location'),
          React.createElement('input',
            {
              type: 'text',
              placeholder: 'Street address or landmark',
              value: formData.location,
              onChange: (e) => handleInputChange('location', e.target.value),
              className: 'form-input',
              required: true
            }
          ),
          React.createElement('div', { className: 'location-actions' },
            React.createElement('button',
              {
                type: 'button',
                className: 'location-btn',
                onClick: () => setShowLocationModal(true)
              },
              React.createElement(MapPin, { size: 16 }),
              'Select on Map'
            ),
            React.createElement('button',
              {
                type: 'button',
                className: 'location-btn',
                onClick: () => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
                      const { latitude, longitude } = position.coords;
                      handleInputChange('location', `${latitude}, ${longitude}`);
                    });
                  }
                }
              },
              React.createElement(Navigation, { size: 16 }),
              'Use GPS Location'
            )
          )
        ),

        // Priority Level
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { className: 'form-label' }, 'Priority Level'),
          React.createElement('select',
            {
              value: formData.priority,
              onChange: (e) => handleInputChange('priority', e.target.value),
              className: 'form-select'
            },
            priorities.map(priority => 
              React.createElement('option', { key: priority.value, value: priority.value }, priority.label)
            )
          ),
          React.createElement('div', { className: `priority-info ${getPriorityColor(formData.priority)}` },
            React.createElement(AlertCircle, { size: 16 }),
            React.createElement('span', null, getSelectedPriority()?.description)
          )
        ),

        // Detailed Description
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { className: 'form-label' }, 'Detailed Description'),
          React.createElement('textarea',
            {
              placeholder: 'Provide more details about the issue, when you noticed it, any safety concerns, etc...',
              value: formData.description,
              onChange: (e) => handleInputChange('description', e.target.value),
              className: 'form-textarea',
              rows: 4,
              required: true
            }
          )
        ),

        // Photo Evidence
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { className: 'form-label' }, 'Photo Evidence'),
          React.createElement('div', { className: 'photo-upload' },
            React.createElement('div', { className: 'upload-area' },
              React.createElement('input',
                {
                  type: 'file',
                  accept: 'image/*',
                  onChange: handleFileUpload,
                  className: 'file-input',
                  id: 'photo-upload'
                }
              ),
              React.createElement('label', { htmlFor: 'photo-upload', className: 'upload-label' },
                React.createElement('div', { className: 'upload-content' },
                  React.createElement(Camera, { size: 48, className: 'upload-icon' }),
                  React.createElement('p', { className: 'upload-text' }, 'Add a photo to help authorities understand the issue'),
                  React.createElement('p', { className: 'upload-hint' }, 'JPG, PNG up to 10MB • Photos help get faster responses')
                )
              ),
              formData.photo && 
              React.createElement('div', { className: 'uploaded-file' },
                React.createElement('span', { className: 'file-name' }, formData.photo.name),
                React.createElement('button',
                  {
                    type: 'button',
                    className: 'remove-file',
                    onClick: () => handleInputChange('photo', null)
                  },
                  '×'
                )
              )
            ),
            React.createElement('button',
              {
                type: 'button',
                className: 'choose-photo-btn',
                onClick: () => document.getElementById('photo-upload').click()
              },
              React.createElement(Upload, { size: 16 }),
              'Choose Photo'
            )
          )
        ),

        // Submit Button
        React.createElement('div', { className: 'form-actions' },
          React.createElement('button',
            {
              type: 'submit',
              className: 'submit-btn'
            },
            React.createElement(Send, { size: 20 }),
            'Submit Report'
          ),
          React.createElement('div', { className: 'submit-info' },
            React.createElement(Star, { size: 16 }),
            React.createElement('span', null, 'Reporting issues helps improve our community and earns you points!')
          )
        )
      )
    ),

    // Location Selection Modal
    showLocationModal && 
    React.createElement('div', { className: 'modal-overlay' },
      React.createElement('div', { className: 'modal-content' },
        React.createElement('div', { className: 'modal-header' },
          React.createElement('h3', null, 'Select Location on Map'),
          React.createElement('button',
            {
              className: 'close-btn',
              onClick: () => setShowLocationModal(false)
            },
            '×'
          )
        ),
        React.createElement('div', { className: 'modal-body' },
          React.createElement('div', { className: 'map-placeholder' },
            React.createElement(MapPin, { size: 48 }),
            React.createElement('p', null, 'Interactive map would be displayed here'),
            React.createElement('p', { className: 'map-hint' }, 'Click on the map to select the exact location')
          )
        ),
        React.createElement('div', { className: 'modal-footer' },
          React.createElement('button',
            {
              className: 'btn btn-secondary',
              onClick: () => setShowLocationModal(false)
            },
            'Cancel'
          ),
          React.createElement('button',
            {
              className: 'btn btn-primary',
              onClick: () => {
                handleInputChange('location', 'Selected location from map');
                setShowLocationModal(false);
              }
            },
            'Confirm Location'
          )
        )
      )
    )
  );
};

export default ReportIssue;

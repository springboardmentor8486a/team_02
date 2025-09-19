import React from 'react';
import { Camera, MapPin, Users, Clock, MessageCircle, BarChart3 } from 'lucide-react';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: Camera,
      title: 'Photo Reports',
      description: 'Upload photos to document issues clearly and help authorities understand the problem.',
      color: '#2563eb',
      iconClass: 'blue'
    },
    {
      icon: MapPin,
      title: 'GPS Location',
      description: 'Automatically capture precise location data to ensure issues are addressed at the right spot.',
      color: '#10b981',
      iconClass: 'green'
    },
    {
      icon: Users,
      title: 'Community Voting',
      description: 'Let the community vote on issues to prioritize the most important problems.',
      color: '#8b5cf6',
      iconClass: 'purple'
    },
    {
      icon: Clock,
      title: 'Real-time Tracking',
      description: 'Track the status of your reports from submission to resolution in real-time.',
      color: '#f59e0b',
      iconClass: 'orange'
    },
    {
      icon: MessageCircle,
      title: 'Community Discussion',
      description: 'Engage with neighbors and officials through comments and discussions on issues.',
      color: '#06b6d4',
      iconClass: 'cyan'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Administrators can monitor trends and generate reports for better city management.',
      color: '#ef4444',
      iconClass: 'red'
    }
  ];

  return React.createElement('section', { className: 'section features-section' },
    React.createElement('div', { className: 'container' },
      React.createElement('div', { className: 'features-header' },
        React.createElement('h2', { className: 'features-title' },
          'Powerful Features for Civic Engagement'
        ),
        React.createElement('p', { className: 'features-description' },
          'Everything you need to report, track, and resolve community issues effectively.'
        )
      ),

      React.createElement('div', { className: 'features-grid' },
        ...features.map((feature, index) => {
          const IconComponent = feature.icon;
          return React.createElement('div', { 
            key: index,
            className: 'feature-card' 
          },
            React.createElement('div', { className: `feature-icon-container ${feature.iconClass}` },
              React.createElement(IconComponent, { size: 28, color: feature.color })
            ),
            
            React.createElement('h3', { className: 'feature-title' },
              feature.title
            ),
            
            React.createElement('p', { className: 'feature-description' },
              feature.description
            )
          );
        })
      )
    )
  );
};

export default Features;

import React from 'react';
import { Target, Globe, Heart, Shield, Users, Lightbulb, Award, MapPin, CheckCircle } from 'lucide-react';
import './About.css';

const About = () => {
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

  return React.createElement('div', { className: 'about-page' },

    // Mission Section
    React.createElement('section', { className: 'section' },
      React.createElement('div', { className: 'container' },
        React.createElement('div', { className: 'text-center', style: { marginBottom: '60px' } },
          React.createElement('h2', { style: { fontSize: '40px', fontWeight: '700', marginBottom: '16px' } },
            'Our Mission'
          ),
          React.createElement('p', { style: { fontSize: '18px', color: '#6b7280', maxWidth: '800px', margin: '0 auto' } },
            'To bridge the gap between citizens and local government by providing a transparent, efficient, and engaging platform for reporting and resolving community issues.'
          )
        )
      )
    ),

    // Values Section
    React.createElement('section', { className: 'section', style: { background: '#f8fafc' } },
      React.createElement('div', { className: 'container' },
        React.createElement('div', { className: 'text-center', style: { marginBottom: '60px' } },
          React.createElement('h2', { style: { fontSize: '40px', fontWeight: '700', marginBottom: '16px' } },
            'Our Core Values'
          ),
          React.createElement('p', { style: { fontSize: '18px', color: '#6b7280', maxWidth: '600px', margin: '0 auto' } },
            'The principles that guide everything we do.'
          )
        ),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' } },
          ...coreValues.map((value, index) => {
            const IconComponent = value.icon;
            return React.createElement('div', {
              key: index,
              style: {
                background: 'white',
                padding: '40px',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }
            },
              React.createElement('div', {
                style: {
                  width: '80px',
                  height: '80px',
                  background: `${value.color}15`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px auto'
                }
              },
                React.createElement(IconComponent, { size: 40, color: value.color })
              ),
              React.createElement('h3', { style: { fontSize: '24px', fontWeight: '700', marginBottom: '16px' } },
                value.title
              ),
              React.createElement('p', { style: { color: '#6b7280', lineHeight: '1.6' } },
                value.description
              )
            );
          })
        )
      )
    ),

    // Impact Section
    React.createElement('section', { className: 'section' },
      React.createElement('div', { className: 'container' },
        React.createElement('div', { className: 'text-center', style: { marginBottom: '60px' } },
          React.createElement('h2', { style: { fontSize: '40px', fontWeight: '700', marginBottom: '16px' } },
            'Our Impact'
          ),
          React.createElement('p', { style: { fontSize: '18px', color: '#6b7280', maxWidth: '600px', margin: '0 auto' } },
            'Making a real difference in communities across the country.'
          )
        ),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', textAlign: 'center' } },
          React.createElement('div', null,
            React.createElement('h3', { style: { fontSize: '48px', fontWeight: '800', color: '#2563eb', marginBottom: '8px' } },
              '1,500+'
            ),
            React.createElement('p', { style: { fontSize: '18px', color: '#6b7280', fontWeight: '500' } },
              'Issues Resolved'
            )
          ),
          React.createElement('div', null,
            React.createElement('h3', { style: { fontSize: '48px', fontWeight: '800', color: '#10b981', marginBottom: '8px' } },
              '5,000+'
            ),
            React.createElement('p', { style: { fontSize: '18px', color: '#6b7280', fontWeight: '500' } },
              'Active Citizens'
            )
          ),
          React.createElement('div', null,
            React.createElement('h3', { style: { fontSize: '48px', fontWeight: '800', color: '#8b5cf6', marginBottom: '8px' } },
              '50+'
            ),
            React.createElement('p', { style: { fontSize: '18px', color: '#6b7280', fontWeight: '500' } },
              'Partner Cities'
            )
          )
        )
      )
    )
  );
};

export default About;

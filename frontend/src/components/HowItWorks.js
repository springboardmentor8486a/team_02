import React from 'react';
import { Camera, Users, Shield, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      icon: Camera,
      title: 'Report an Issue',
      description: 'Take a photo and describe the civic issue you\'ve encountered in your neighborhood.'
    },
    {
      number: 2,
      icon: Users,
      title: 'Community Engagement',
      description: 'Other residents can vote and comment on your report to show community support.'
    },
    {
      number: 3,
      icon: Shield,
      title: 'Official Review',
      description: 'Local authorities review and prioritize issues based on community input and severity.'
    },
    {
      number: 4,
      icon: CheckCircle,
      title: 'Resolution & Updates',
      description: 'Track the progress of your report and get notified when the issue is resolved.'
    }
  ];

  return React.createElement('section', { className: 'section', style: { background: '#f8fafc' } },
    React.createElement('div', { className: 'container' },
      React.createElement('div', { className: 'text-center', style: { marginBottom: '60px' } },
        React.createElement('h2', { style: { fontSize: '48px', fontWeight: '800', color: '#111827', marginBottom: '16px' } },
          'How It Works'
        ),
        React.createElement('p', { style: { fontSize: '20px', color: '#6b7280', maxWidth: '600px', margin: '0 auto' } },
          'Simple steps to make your community better.'
        )
      ),

      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' } },
        ...steps.map((step, index) => {
          const IconComponent = step.icon;
          return React.createElement('div', {
            key: index,
            style: {
              textAlign: 'center',
              position: 'relative'
            }
          },
            React.createElement('div', {
              style: {
                width: '80px',
                height: '80px',
                background: '#2563eb',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto',
                position: 'relative'
              }
            },
              React.createElement(IconComponent, { size: 40, color: 'white' }),
              React.createElement('div', {
                style: {
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  width: '30px',
                  height: '30px',
                  background: '#10b981',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }
              }, step.number)
            ),
            React.createElement('h3', { style: { fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#111827' } },
              step.title
            ),
            React.createElement('p', { style: { color: '#6b7280', lineHeight: '1.6' } },
              step.description
            )
          );
        })
      )
    )
  );
};

export default HowItWorks;

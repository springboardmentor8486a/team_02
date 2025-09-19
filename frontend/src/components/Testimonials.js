import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Clean Street made it so easy to report the pothole on my street. It was fixed within a week!",
      author: "Sarah Johnson",
      role: "Resident"
    },
    {
      quote: "I love how I can track all the issues in my neighborhood and help coordinate with city officials.",
      author: "Mike Chen",
      role: "Community Volunteer"
    },
    {
      quote: "The analytics dashboard gives us invaluable insights into community needs and helps us prioritize resources.",
      author: "Dr. Emily Rodriguez",
      role: "City Administrator"
    }
  ];

  return React.createElement('section', { className: 'section', style: { background: 'white' } },
    React.createElement('div', { className: 'container' },
      React.createElement('div', { className: 'text-center', style: { marginBottom: '60px' } },
        React.createElement('h2', { style: { fontSize: '48px', fontWeight: '800', color: '#111827', marginBottom: '16px' } },
          'What People Are Saying'
        ),
        React.createElement('p', { style: { fontSize: '20px', color: '#6b7280', maxWidth: '600px', margin: '0 auto' } },
          'Real stories from real people making a difference in their communities.'
        )
      ),

      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' } },
        ...testimonials.map((testimonial, index) =>
          React.createElement('div', {
            key: index,
            style: {
              background: '#f8fafc',
              padding: '40px',
              borderRadius: '16px',
              textAlign: 'center',
              border: '1px solid #e5e7eb'
            }
          },
            React.createElement('div', { style: { marginBottom: '24px' } },
              ...Array.from({ length: 5 }, (_, i) =>
                React.createElement(Star, { key: i, size: 20, color: '#fbbf24', fill: '#fbbf24' })
              )
            ),
            React.createElement('blockquote', {
              style: {
                fontSize: '18px',
                color: '#374151',
                lineHeight: '1.6',
                marginBottom: '24px',
                fontStyle: 'italic'
              }
            }, `"${testimonial.quote}"`),
            React.createElement('div', null,
              React.createElement('p', { style: { fontWeight: '600', color: '#111827', marginBottom: '4px' } },
                testimonial.author
              ),
              React.createElement('p', { style: { color: '#6b7280', fontSize: '14px' } },
                testimonial.role
              )
            )
          )
        )
      )
    )
  );
};

export default Testimonials;

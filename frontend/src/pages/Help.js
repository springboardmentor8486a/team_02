import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, BookOpen, MessageCircle, Phone, CheckCircle } from 'lucide-react';
import './Help.css';

const Help = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      question: "How do I report an issue?",
      answer: "To report an issue, click the 'Report Issue' button on the map, take a photo, add a description, and submit. The issue will be reviewed by local authorities."
    },
    {
      question: "How long does it take to resolve an issue?",
      answer: "Resolution times vary depending on the type and severity of the issue. Simple issues like potholes may be fixed within a week, while larger infrastructure projects may take several months."
    },
    {
      question: "Can I track the progress of my reports?",
      answer: "Yes! You can track all your reports in your dashboard. You'll receive notifications when the status changes from 'Reported' to 'In Progress' to 'Completed'."
    },
    {
      question: "Is my personal information safe?",
      answer: "Absolutely. We take privacy seriously and only share necessary information with local authorities. Your personal details are never made public."
    },
    {
      question: "How do I vote on community issues?",
      answer: "Browse issues in your area and click the vote button. Your vote helps prioritize which issues get addressed first by local authorities."
    },
    {
      question: "What if I disagree with how an issue was resolved?",
      answer: "You can comment on resolved issues or report new issues if the problem persists. Community feedback helps improve future responses."
    }
  ];

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return React.createElement('div', { className: 'help-page' },

    // Search Section
    React.createElement('section', { className: 'section' },
      React.createElement('div', { className: 'container' },
        React.createElement('div', { 
          style: { 
            maxWidth: '600px', 
            margin: '0 auto', 
            position: 'relative' 
          } 
        },
          React.createElement('div', { 
            style: { 
              position: 'relative', 
              display: 'flex', 
              alignItems: 'center' 
            } 
          },
            React.createElement(Search, { 
              size: 20, 
              style: { 
                position: 'absolute', 
                left: '16px', 
                color: '#6b7280' 
              } 
            }),
            React.createElement('input', {
              type: 'text',
              placeholder: 'Search for help...',
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              style: {
                width: '100%',
                padding: '16px 16px 16px 48px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '16px',
                outline: 'none'
              }
            })
          )
        )
      )
    ),

    // FAQ Section
    React.createElement('section', { className: 'section', style: { background: '#f8fafc' } },
      React.createElement('div', { className: 'container' },
        React.createElement('div', { className: 'text-center', style: { marginBottom: '60px' } },
          React.createElement('h2', { style: { fontSize: '40px', fontWeight: '700', marginBottom: '16px' } },
            'Frequently Asked Questions'
          ),
          React.createElement('p', { style: { fontSize: '18px', color: '#6b7280', maxWidth: '600px', margin: '0 auto' } },
            'Find quick answers to the most common questions about Clean Street.'
          )
        ),

        React.createElement('div', { style: { maxWidth: '800px', margin: '0 auto' } },
          ...filteredFAQs.map((faq, index) =>
            React.createElement('div', {
              key: index,
              style: {
                background: 'white',
                borderRadius: '12px',
                marginBottom: '16px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
              }
            },
              React.createElement('button', {
                onClick: () => toggleFAQ(index),
                style: {
                  width: '100%',
                  padding: '24px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '18px',
                  fontWeight: '600'
                }
              },
                React.createElement('span', null, faq.question),
                openFAQ === index ? 
                  React.createElement(ChevronUp, { size: 24, color: '#2563eb' }) :
                  React.createElement(ChevronDown, { size: 24, color: '#6b7280' })
              ),
              openFAQ === index && React.createElement('div', {
                style: {
                  padding: '0 24px 24px 24px',
                  color: '#6b7280',
                  lineHeight: '1.6'
                }
              }, faq.answer)
            )
          )
        )
      )
    ),

    // Additional Resources Section
    React.createElement('section', { className: 'section' },
      React.createElement('div', { className: 'container' },
        React.createElement('div', { className: 'text-center', style: { marginBottom: '60px' } },
          React.createElement('h2', { style: { fontSize: '40px', fontWeight: '700', marginBottom: '16px' } },
            'Additional Resources'
          ),
          React.createElement('p', { style: { fontSize: '18px', color: '#6b7280', maxWidth: '600px', margin: '0 auto' } },
            'More ways to get help and learn about Clean Street.'
          )
        ),

        React.createElement('div', { 
          style: { 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '40px' 
          } 
        },
          React.createElement('div', {
            style: {
              background: 'white',
              padding: '40px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
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
                margin: '0 auto 24px auto'
              }
            },
              React.createElement(BookOpen, { size: 40, color: 'white' })
            ),
            React.createElement('h3', { style: { fontSize: '24px', fontWeight: '700', marginBottom: '16px' } },
              'User Guide'
            ),
            React.createElement('p', { style: { color: '#6b7280', marginBottom: '24px' } },
              'Comprehensive guide to using all features of Clean Street.'
            ),
            React.createElement('button', { className: 'btn btn-primary' },
              'Read Guide'
            )
          ),

          React.createElement('div', {
            style: {
              background: 'white',
              padding: '40px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }
          },
            React.createElement('div', {
              style: {
                width: '80px',
                height: '80px',
                background: '#10b981',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto'
              }
            },
              React.createElement(MessageCircle, { size: 40, color: 'white' })
            ),
            React.createElement('h3', { style: { fontSize: '24px', fontWeight: '700', marginBottom: '16px' } },
              'Community Forum'
            ),
            React.createElement('p', { style: { color: '#6b7280', marginBottom: '24px' } },
              'Connect with other users and share experiences.'
            ),
            React.createElement('button', { className: 'btn btn-primary' },
              'Join Forum'
            )
          ),

          React.createElement('div', {
            style: {
              background: 'white',
              padding: '40px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }
          },
            React.createElement('div', {
              style: {
                width: '80px',
                height: '80px',
                background: '#8b5cf6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto'
              }
            },
              React.createElement(Phone, { size: 40, color: 'white' })
            ),
            React.createElement('h3', { style: { fontSize: '24px', fontWeight: '700', marginBottom: '16px' } },
              'Contact Support'
            ),
            React.createElement('p', { style: { color: '#6b7280', marginBottom: '24px' } },
              'Still need help? Our support team is here for you.'
            ),
            React.createElement('button', { className: 'btn btn-primary' },
              'Contact Us'
            )
          )
        )
      )
    )
  );
};

export default Help;

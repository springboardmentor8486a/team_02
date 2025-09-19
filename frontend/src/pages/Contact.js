import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return React.createElement('div', { className: 'contact-page' },

    // Contact Form and Info Section
    React.createElement('section', { className: 'section' },
      React.createElement('div', { className: 'container' },
        React.createElement('div', { 
          style: { 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '60px', 
            alignItems: 'start' 
          } 
        },
          // Contact Form
          React.createElement('div', { style: { background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' } },
            React.createElement('h2', { style: { fontSize: '32px', fontWeight: '700', marginBottom: '24px' } },
              'Send us a Message'
            ),
            React.createElement('form', { onSubmit: handleSubmit },
              React.createElement('div', { style: { marginBottom: '20px' } },
                React.createElement('label', { 
                  style: { display: 'block', marginBottom: '8px', fontWeight: '500' } 
                }, 'Name'),
                React.createElement('input', {
                  type: 'text',
                  name: 'name',
                  value: formData.name,
                  onChange: handleChange,
                  required: true,
                  style: {
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }
                })
              ),
              React.createElement('div', { style: { marginBottom: '20px' } },
                React.createElement('label', { 
                  style: { display: 'block', marginBottom: '8px', fontWeight: '500' } 
                }, 'Email'),
                React.createElement('input', {
                  type: 'email',
                  name: 'email',
                  value: formData.email,
                  onChange: handleChange,
                  required: true,
                  style: {
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }
                })
              ),
              React.createElement('div', { style: { marginBottom: '20px' } },
                React.createElement('label', { 
                  style: { display: 'block', marginBottom: '8px', fontWeight: '500' } 
                }, 'Subject'),
                React.createElement('input', {
                  type: 'text',
                  name: 'subject',
                  value: formData.subject,
                  onChange: handleChange,
                  required: true,
                  style: {
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }
                })
              ),
              React.createElement('div', { style: { marginBottom: '24px' } },
                React.createElement('label', { 
                  style: { display: 'block', marginBottom: '8px', fontWeight: '500' } 
                }, 'Message'),
                React.createElement('textarea', {
                  name: 'message',
                  value: formData.message,
                  onChange: handleChange,
                  required: true,
                  rows: 5,
                  style: {
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    resize: 'vertical'
                  }
                })
              ),
              React.createElement('button', {
                type: 'submit',
                className: 'btn btn-primary',
                style: { display: 'flex', alignItems: 'center', gap: '8px' }
              },
                React.createElement(Send, { size: 20 }),
                'Send Message'
              )
            )
          ),

          // Contact Information
          React.createElement('div', null,
            React.createElement('h2', { style: { fontSize: '32px', fontWeight: '700', marginBottom: '24px' } },
              'Get in Touch'
            ),
            React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '24px' } },
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
                React.createElement('div', { 
                  style: { 
                    width: '50px', 
                    height: '50px', 
                    background: '#2563eb', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  } 
                },
                  React.createElement(Mail, { size: 24, color: 'white' })
                ),
                React.createElement('div', null,
                  React.createElement('h3', { style: { fontSize: '18px', fontWeight: '600', marginBottom: '4px' } },
                    'Email Us'
                  ),
                  React.createElement('p', { style: { color: '#6b7280' } },
                    'hello@cleanstreet.org'
                  )
                )
              ),
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
                React.createElement('div', { 
                  style: { 
                    width: '50px', 
                    height: '50px', 
                    background: '#10b981', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  } 
                },
                  React.createElement(Phone, { size: 24, color: 'white' })
                ),
                React.createElement('div', null,
                  React.createElement('h3', { style: { fontSize: '18px', fontWeight: '600', marginBottom: '4px' } },
                    'Call Us'
                  ),
                  React.createElement('p', { style: { color: '#6b7280' } },
                    '(555) 123-4567'
                  )
                )
              ),
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
                React.createElement('div', { 
                  style: { 
                    width: '50px', 
                    height: '50px', 
                    background: '#8b5cf6', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  } 
                },
                  React.createElement(MapPin, { size: 24, color: 'white' })
                ),
                React.createElement('div', null,
                  React.createElement('h3', { style: { fontSize: '18px', fontWeight: '600', marginBottom: '4px' } },
                    'Visit Us'
                  ),
                  React.createElement('p', { style: { color: '#6b7280' } },
                    '123 Civic Center, City, State 12345'
                  )
                )
              ),
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
                React.createElement('div', { 
                  style: { 
                    width: '50px', 
                    height: '50px', 
                    background: '#f59e0b', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  } 
                },
                  React.createElement(Clock, { size: 24, color: 'white' })
                ),
                React.createElement('div', null,
                  React.createElement('h3', { style: { fontSize: '18px', fontWeight: '600', marginBottom: '4px' } },
                    'Office Hours'
                  ),
                  React.createElement('p', { style: { color: '#6b7280' } },
                    'Monday - Friday: 9:00 AM - 6:00 PM'
                  )
                )
              )
            )
          )
        )
      )
    )
  );
};

export default Contact;

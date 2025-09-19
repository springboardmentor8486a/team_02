import React from 'react';
import { MapPin, Mail, Phone, Globe } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const platformLinks = ['How it Works', 'Features', 'Pricing', 'Mobile App'];
  const supportLinks = ['Help Center', 'Contact Us', 'User Guide', 'Community Forum'];
  const companyLinks = ['About Us', 'Careers', 'Press Kit', 'Blog'];
  const partnerLinks = ['Government Solutions', 'API Documentation', 'Integration Guide', 'Partner Program'];

  return React.createElement('footer', { className: 'footer' },
    React.createElement('div', { className: 'container' },
      React.createElement('div', { className: 'footer-grid' },
        // Brand Column
        React.createElement('div', null,
          React.createElement('div', { className: 'footer-brand' },
            React.createElement('div', { className: 'footer-logo' },
              React.createElement(MapPin, { size: 20, color: 'white' })
            ),
            React.createElement('h3', { className: 'footer-brand-title' },
              'Clean Street'
            )
          ),
          
          React.createElement('p', { className: 'footer-tagline' },
            'Civic Engagement Platform'
          ),
          
          React.createElement('p', { className: 'footer-description' },
            'Empowering communities to report, track, and resolve civic issues through collaborative engagement between citizens and local authorities.'
          ),
          
          // Contact Info
          React.createElement('div', { className: 'footer-contact' },
            React.createElement('div', { className: 'footer-contact-item' },
              React.createElement(Mail, { size: 16, color: '#9ca3af' }),
              React.createElement('span', { className: 'footer-contact-text' },
                'hello@cleanstreet.org'
              )
            ),
            React.createElement('div', { className: 'footer-contact-item' },
              React.createElement(Phone, { size: 16, color: '#9ca3af' }),
              React.createElement('span', { className: 'footer-contact-text' },
                '(555) 123-4567'
              )
            ),
            React.createElement('div', { className: 'footer-contact-item' },
              React.createElement(Globe, { size: 16, color: '#9ca3af' }),
              React.createElement('span', { className: 'footer-contact-text' },
                'www.cleanstreet.org'
              )
            )
          )
        ),

        // Platform Column
        React.createElement('div', null,
          React.createElement('h4', { className: 'footer-column-title' },
            'Platform'
          ),
          React.createElement('div', { className: 'footer-links' },
            ...platformLinks.map((link, index) =>
              React.createElement('a', {
                key: index,
                href: '#',
                className: 'footer-link'
              }, link)
            )
          )
        ),

        // Support Column
        React.createElement('div', null,
          React.createElement('h4', { className: 'footer-column-title' },
            'Support'
          ),
          React.createElement('div', { className: 'footer-links' },
            ...supportLinks.map((link, index) =>
              React.createElement('a', {
                key: index,
                href: '#',
                className: 'footer-link'
              }, link)
            )
          )
        ),

        // Company Column
        React.createElement('div', null,
          React.createElement('h4', { className: 'footer-column-title' },
            'Company'
          ),
          React.createElement('div', { className: 'footer-links' },
            ...companyLinks.map((link, index) =>
              React.createElement('a', {
                key: index,
                href: '#',
                className: 'footer-link'
              }, link)
            )
          )
        ),

        // Partners Column
        React.createElement('div', null,
          React.createElement('h4', { className: 'footer-column-title' },
            'Partners'
          ),
          React.createElement('div', { className: 'footer-links' },
            ...partnerLinks.map((link, index) =>
              React.createElement('a', {
                key: index,
                href: '#',
                className: 'footer-link'
              }, link)
            )
          )
        )
      ),

      // Bottom Bar
      React.createElement('div', { className: 'footer-bottom' },
        React.createElement('p', { className: 'footer-copyright' },
          '© 2024 Clean Street. All rights reserved. Empowering communities since 2024.'
        )
      )
    )
  );
};

export default Footer;

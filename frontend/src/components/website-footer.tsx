import React from 'react';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Globe,
  Twitter,
  Facebook,
  Linkedin,
  Github,
  Heart
} from 'lucide-react';

interface WebsiteFooterProps {
  onNavigate: (page: string) => void;
}

export function WebsiteFooter({ onNavigate }: WebsiteFooterProps) {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { name: 'How it Works', action: () => onNavigate('home') },
        { name: 'Features', action: () => onNavigate('home') },
        { name: 'Pricing', action: () => onNavigate('home') },
        { name: 'Mobile App', action: () => {} },
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', action: () => onNavigate('help') },
        { name: 'Contact Us', action: () => onNavigate('contact') },
        { name: 'User Guide', action: () => onNavigate('help') },
        { name: 'Community Forum', action: () => {} },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', action: () => onNavigate('about') },
        { name: 'Careers', action: () => {} },
        { name: 'Press Kit', action: () => {} },
        { name: 'Blog', action: () => {} },
      ]
    },
    {
      title: 'Partners',
      links: [
        { name: 'Government Solutions', action: () => onNavigate('contact') },
        { name: 'API Documentation', action: () => {} },
        { name: 'Integration Guide', action: () => {} },
        { name: 'Partner Program', action: () => {} },
      ]
    }
  ];

  const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
    { icon: <Facebook className="w-5 h-5" />, href: '#', label: 'Facebook' },
    { icon: <Linkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn' },
    { icon: <Github className="w-5 h-5" />, href: '#', label: 'GitHub' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Clean Street</h3>
                <p className="text-sm text-gray-400">Civic Engagement Platform</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering communities to report, track, and resolve civic issues through 
              collaborative engagement between citizens and local authorities.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>hello@cleanstreet.org</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>www.cleanstreet.org</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <button
                      onClick={link.action}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>


    </footer>
  );
}
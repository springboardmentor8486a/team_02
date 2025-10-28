import React from 'react';
import { Mail, Phone, Globe } from 'lucide-react';
import { Link } from 'react-router-dom'; // Assuming react-router-dom is used for footer links
import '../pages/Footer.css'; // Link to its own CSS

const Footer = () => {
    return (
        <footer class="simple-footer">
  © 2025 Clean Street | Civic Engagement Platform | 
  <a href="mailto:hello@cleanstreet.org">hello@cleanstreet.org</a>
</footer>

    );
};

export default Footer;
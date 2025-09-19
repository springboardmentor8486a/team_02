import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './CallToAction.css';

const CallToAction = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/get-started');
  };

  return React.createElement('section', { className: 'section cta-section' },
    React.createElement('div', { className: 'container' },
      React.createElement('div', { className: 'cta-content' },
        React.createElement('h2', { className: 'cta-title' },
          'Ready to Make a Difference?'
        ),
        
        React.createElement('p', { className: 'cta-description' },
          'Join your community in building a better neighborhood. Report issues, track progress, and see real change happen.'
        ),
        
        React.createElement('div', { className: 'cta-actions' },
          React.createElement('button', { 
            className: 'btn btn-dark cta-button',
            onClick: handleSignUp
          },
            'Sign Up Now',
            React.createElement(ArrowRight, { size: 20 })
          ),
          
          React.createElement('p', { className: 'cta-note' },
            'Free to use • No credit card required'
          )
        )
      )
    )
  );
};

export default CallToAction;

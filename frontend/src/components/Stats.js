import React from 'react';
import './Stats.css';

const Stats = () => {
  const stats = [
    { number: '1,500+', label: 'Issues Reported' },
    { number: '1,200+', label: 'Issues Resolved' },
    { number: '5,000+', label: 'Active Citizens' },
    { number: '50+', label: 'Partner Cities' }
  ];

  return React.createElement('section', { className: 'stats-section' },
    React.createElement('div', { className: 'container' },
      React.createElement('div', { className: 'stats-header' },
        React.createElement('h2', { className: 'stats-title' },
          'Making a Real Impact'
        ),
        React.createElement('p', { className: 'stats-description' },
          'Join thousands of citizens who are already making their communities better.'
        )
      ),

      React.createElement('div', { className: 'stats-grid' },
        ...stats.map((stat, index) =>
          React.createElement('div', { key: index, className: 'stat-item' },
            React.createElement('h3', { className: 'stat-number' },
              stat.number
            ),
            React.createElement('p', { className: 'stat-label' },
              stat.label
            )
          )
        )
      )
    )
  );
};

export default Stats;

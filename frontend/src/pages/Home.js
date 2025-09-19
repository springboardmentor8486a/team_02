import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import CallToAction from '../components/CallToAction';

const Home = () => {
  return React.createElement('div', null,
    React.createElement(Hero),
    React.createElement(Features),
    React.createElement(HowItWorks),
    React.createElement(Stats),
    React.createElement(Testimonials),
    React.createElement(CallToAction)
  );
};

export default Home;

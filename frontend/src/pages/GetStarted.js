import React from 'react';
import SignIn from './SignIn';

const GetStarted = () => {
  return React.createElement(SignIn, { defaultTab: 'signup' });
};

export default GetStarted;

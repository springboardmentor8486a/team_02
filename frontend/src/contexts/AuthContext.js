import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@email.com',
    role: 'Citizen'
  });

  const signIn = (userData) => {
    setIsSignedIn(true);
    setUser(userData);
  };

  const signOut = () => {
    setIsSignedIn(false);
    setUser(null);
  };

  const value = {
    isSignedIn,
    user,
    signIn,
    signOut
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};


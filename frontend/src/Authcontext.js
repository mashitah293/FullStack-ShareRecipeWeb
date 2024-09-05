import React, { createContext, useState, useContext } from 'react';

// Create the Auth Context
const AuthContext = createContext();

// Provide the Auth Context to the components
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Manage authentication state
  const [user, setUser] = useState(null);  // Store user data

  const login = (userData) => {
    console.log('Login function called with:', userData);  // Debugging line
    setIsAuthenticated(true);
    setUser(userData);
  };
  
  const logout = () => {
    console.log('Logout function called');  // Debugging line
    setIsAuthenticated(false);
    setUser(null);
  };
  

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth Context
export const useAuth = () => useContext(AuthContext);

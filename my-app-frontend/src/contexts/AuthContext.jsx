import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on app load
    const checkAuthStatus = () => {
      try {
        const userProfile = localStorage.getItem('user_profile');
        const onboardingProgress = localStorage.getItem('onboarding_progress');
        
        if (userProfile) {
          const profileData = JSON.parse(userProfile);
          setUser(profileData);
          setIsAuthenticated(true);
        } else if (onboardingProgress) {
          const progressData = JSON.parse(onboardingProgress);
          if (progressData.profileData && progressData.profileData.firstName) {
            setUser(progressData.profileData);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    // Store user data in localStorage for persistence
    localStorage.setItem('user_profile', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Clear authentication data
    localStorage.removeItem('isAuthenticated');
    // Keep user profile data for next login
  };

  const updateUser = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    setUser(newUserData);
    localStorage.setItem('user_profile', JSON.stringify(newUserData));
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

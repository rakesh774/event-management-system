import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo && userInfo !== 'undefined') {
        setUser(JSON.parse(userInfo));
      }
    } catch (error) {
      console.error('Failed to parse user info from local storage', error);
      localStorage.removeItem('userInfo');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    toast.success(`Welcome back, ${userData.name}!`);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedData) => {
    setUser(prev => {
      const merged = prev ? { ...prev, ...updatedData } : updatedData;
      localStorage.setItem('userInfo', JSON.stringify(merged));
      return merged;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

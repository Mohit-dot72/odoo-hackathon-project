import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Configure global axios headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    const verifySession = async () => {
      if (token) {
        try {
          // If we had a verify session route we could check, or simple validation
          // For now we assume token cached is valid until requests throw 401
          // We can also call a dummy GET /api/auth/profile if needed, but since it's mock/real hybrid
          // we will keep it simple and just set loading false
          setLoading(false);
        } catch (err) {
          logout();
        }
      } else {
        setLoading(false);
      }
    };
    verifySession();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      if (response.data.success) {
        const { user: userData, token: userToken, refreshToken } = response.data;
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('refreshToken', refreshToken);
        toast.success(`Welcome back, ${userData.name}!`);
        return true;
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Login failed. Please check credentials.';
      toast.error(errorMsg);
      return false;
    }
  };

  const register = async (name, email, password, role, phone) => {
    try {
      const response = await axios.post('/api/auth/register', { name, email, password, role, phone });
      if (response.data.success) {
        const { user: userData, token: userToken, refreshToken } = response.data;
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('refreshToken', refreshToken);
        toast.success('Registration successful!');
        return true;
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Registration failed.';
      toast.error(errorMsg);
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error on backend:', err.message);
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    toast.success('Logged out successfully.');
  };

  const updateProfile = (updatedFields) => {
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useEffect, useState } from 'react';
import { login as loginApi, register as registerApi, getProfile as getProfileApi, updateProfile as updateProfileApi } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check token and fetch user profile on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getProfileApi();
        if (userData) {
          setUser(userData);
        } else {
          // If no user data is returned, clear the token
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Clear invalid token
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await loginApi(credentials);
      const { data, token } = response;
      if (!token) {
        throw new Error('No token received from server');
      }
      localStorage.setItem('token', token);
      setUser(data);
      toast.success('Successfully logged in!');
      return data;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const { data, token } = await registerApi(userData);
      if (!token) {
        throw new Error('No token received from server');
      }
      localStorage.setItem('token', token);
      setUser(data);
      toast.success('Account created successfully!');
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (userData) => {
    try {
      const { data, token } = await updateProfileApi(userData);
      if (token) {
        localStorage.setItem('token', token);
      }
      setUser(data);
      toast.success('Profile updated successfully');
      return data;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Profile update failed');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
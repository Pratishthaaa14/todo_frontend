import { createContext, useContext, useEffect, useState, useCallback } from 'react';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to update auth state
  const updateAuthState = useCallback((userData, token) => {
    console.log('Updating auth state with:', { userData, token });
    if (token) {
      localStorage.setItem('token', token);
    }
    setUser(userData);
    setIsAuthenticated(!!userData);
    console.log('Auth state updated:', { isAuthenticated: !!userData, user: userData });
  }, []);

  // Check token and fetch user profile on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      console.log('Initializing auth with token:', token ? 'exists' : 'none');
      
      if (!token) {
        console.log('No token found, setting auth state to false');
        updateAuthState(null);
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching user profile with token');
        const userData = await getProfileApi();
        console.log('User profile data:', userData);
        
        if (userData) {
          console.log('Setting user data and auth state to true');
          updateAuthState(userData, token);
        } else {
          console.log('No user data returned, clearing auth state');
          updateAuthState(null);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        updateAuthState(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [updateAuthState]);

  const login = async (credentials) => {
    try {
      console.log('Login attempt with credentials:', credentials);
      const response = await loginApi(credentials);
      console.log('Login API response:', response);
      
      const { data, token } = response;
      if (!token) {
        throw new Error('No token received from server');
      }
      
      console.log('Storing token and user data:', { data, token });
      updateAuthState(data, token);
      
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
      console.log('Registration attempt with data:', userData);
      const response = await registerApi(userData);
      console.log('Registration response:', response);
      
      const { data, token } = response;
      if (!token) {
        throw new Error('No token received from server');
      }
      
      console.log('Storing token and user data:', { data, token });
      updateAuthState(data, token);
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('token');
    updateAuthState(null);
    console.log('Auth state after logout:', { isAuthenticated: false, user: null });
    toast.success('Logged out successfully');
  };

  const updateProfile = async (userData) => {
    try {
      console.log('Updating profile with data:', userData);
      const response = await updateProfileApi(userData);
      console.log('Profile update response:', response);
      
      const { data, token } = response;
      updateAuthState(data, token);
      
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
    isAuthenticated,
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
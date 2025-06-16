// frontend/src/services/api.js
import axios from 'axios';

// Force production URL in production environment
const isProduction = import.meta.env.PROD;
const BASE_URL = isProduction 
  ? 'https://todo-backend-p970.onrender.com/'
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/');

console.log('Environment:', import.meta.env.MODE);
console.log('API Base URL:', BASE_URL);
console.log('Is Production:', isProduction);

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://todo-backend-p970.onrender.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      return Promise.reject({ message: 'No response from server' });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
      return Promise.reject({ message: 'Request setup failed' });
    }
  }
);

// Task API endpoints
export const getTasks = async () => {
  const response = await api.get('api/v1/tasks');
  return response.data.data;
};

export const getTasksByStatus = async (status) => {
  const response = await api.get(`api/v1/tasks/status/${status}`);
  return response.data.data;
};

export const getTasksByPriority = async (priority) => {
  const response = await api.get(`api/v1/tasks/priority/${priority}`);
  return response.data.data;
};

export const getTask = async (id) => {
  const response = await api.get(`api/v1/tasks/${id}`);
  return response.data.data;
};

export const createTask = async (taskData) => {
  const response = await api.post('api/v1/tasks', taskData);
  return response.data.data;
};

export const updateTask = async (id, taskData) => {
  const response = await api.put(`api/v1/tasks/${id}`, taskData);
  return response.data.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`api/v1/tasks/${id}`);
  return response.data;
};

// Auth API endpoints
export const login = async (credentials) => {
  try {
    console.log('Login API call with credentials:', credentials);
  const response = await api.post('api/v1/auth/login', credentials);
  console.log('Login API response:', response);
    
    // Extract data from response
    const { data } = response;
    console.log('Login response data:', data);
    
    // Return the data in the expected format
    return {
      data: {
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin
      },
      token: data.token
    };
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    console.log('Register API call with data:', userData);
  const response = await api.post('api/v1/auth/register', userData);
    console.log('Register API response:', response);
    
    // Extract data from response
    const { data } = response;
    console.log('Register response data:', data);
    
    // Return the data in the expected format
    return {
      data: {
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin
      },
      token: data.token
    };
  } catch (error) {
    console.error('Register API error:', error);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    console.log('Get profile API call');
  const response = await api.get('api/v1/auth/me');
    console.log('Get profile API response:', response);
    
    // Extract data from response
    const { data } = response;
    console.log('Profile response data:', data);
    
    // Return the data in the expected format
    return {
      _id: data._id,
      name: data.name,
      email: data.email,
      isAdmin: data.isAdmin
    };
  } catch (error) {
    console.error('Get profile API error:', error);
    throw error;
  }
};

export const updateProfile = async (userData) => {
  try {
    console.log('Update profile API call with data:', userData);
  const response = await api.put('api/v1/auth/profile', userData);
    console.log('Update profile API response:', response);
    
    // Extract data from response
    const { data } = response;
    console.log('Update profile response data:', data);
    
    // Return the data in the expected format
  return {
      data: {
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin
      },
      token: data.token
    };
  } catch (error) {
    console.error('Update profile API error:', error);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    console.log('Forgot password API call with email:', email);
    const response = await api.post('api/v1/auth/forgot-password', { email });
    console.log('Forgot password API response:', response);
    return response.data;
  } catch (error) {
    console.error('Forgot password API error:', error);
    throw error;
  }
};

export const resetPassword = async (resetToken, password) => {
  try {
    console.log('Reset password API call with token:', resetToken);
    const response = await api.post(`api/v1/auth/reset-password/${resetToken}`, { password });
    console.log('Reset password API response:', response);
    return response.data;
  } catch (error) {
    console.error('Reset password API error:', error);
    throw error;
  }
};

export const changePassword = async (passwords) => {
  try {
    console.log('Change password API call');
    const response = await api.put('api/v1/auth/change-password', passwords);
    console.log('Change password API response:', response);
    return response.data;
  } catch (error) {
    console.error('Change password API error:', error);
    throw error;
  }
};

// Search API endpoint
export const searchTasks = async (query) => {
  const response = await api.get(`api/v1/tasks/search?q=${encodeURIComponent(query)}`);
  return response.data.data;
};

// Notification API endpoints
export const getNotifications = async () => {
  try {
    console.log('Fetching notifications...');
  const response = await api.get('api/v1/notifications');
    console.log('Notifications response:', response.data);
  return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    console.log('Marking all notifications as read...');
  const response = await api.patch('api/v1/notifications/read-all');
    console.log('Mark all read response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw new Error(error.response?.data?.message || 'Failed to mark notifications as read');
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    console.log('Marking notification as read:', notificationId);
    const response = await api.patch(`api/v1/notifications/${notificationId}/read`);
    console.log('Mark read response:', response.data);
  return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
  }
};

export const sendInvitation = async (inviteData) => {
  const response = await api.post('api/v1/invitations/send', inviteData);
  return response.data;
};

export default api;
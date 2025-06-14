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
  baseURL: BASE_URL,
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
  (response) => response,
  (error) => {
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
  const response = await api.post('api/v1/auth/login', credentials);
  console.log('Login API response:', response);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('api/v1/auth/register', userData);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('api/v1/auth/me');
  return response.data.data;
};

export const updateProfile = async (userData) => {
  const response = await api.put('api/v1/auth/profile', userData);
  return {
    data: response.data.data,
    token: response.data.token
  };
};

// Search API endpoint
export const searchTasks = async (query) => {
  const response = await api.get(`api/v1/tasks/search?q=${encodeURIComponent(query)}`);
  return response.data.data;
};

// Notification API endpoints
export const getNotifications = async () => {
  const response = await api.get('api/v1/notifications');
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await api.patch('api/v1/notifications/read-all');
  return response.data;
};

export const sendInvitation = async (inviteData) => {
  const response = await api.post('api/v1/invitations/send', inviteData);
  return response.data;
};

export default api;
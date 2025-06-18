import axios from 'axios';

const api = axios.create({
  baseURL: 'https://todo-backend-p970.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000 // 10 seconds timeout
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.url) {
      config.url = config.url.replace(/([^:]\/)\/+/g, "$1");
    }
    console.log('Making request to:', config.url);
    console.log('Request config:', {
      method: config.method,
      url: config.url,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  async (error) => {
    console.error('Response error:', error.response || error);
    
    if (error.response) {
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
      
      if (error.response.status === 404 && error.config.method === 'post') {
        const originalUrl = error.config.url;
        if (originalUrl.startsWith('/api/auth/')) {
          try {
            const newConfig = {
              ...error.config,
              url: originalUrl.replace('/api/auth/', '/api/v1/auth/')
            };
            console.log('Retrying request with new URL:', newConfig.url);
            return api(newConfig);
          } catch (retryError) {
            console.error('Retry failed:', retryError);
          }
        }
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api; 
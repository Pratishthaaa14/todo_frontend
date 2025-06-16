import axios from 'axios';

const api = axios.create({
  baseURL: 'https://todo-backend-p970.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000 // 10 seconds timeout
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Remove any double slashes in the URL
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

// Add a response interceptor for better error handling
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
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
      
      // If the error is 404 and it's a POST request, try the request with /api/v1
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
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api; 
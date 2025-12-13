import axios, { AxiosInstance } from 'axios';

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://market.bery.in/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token and optional zone/module headers
apiClient.interceptors.request.use(
  (config) => {
    // Log the request URL for debugging
    console.log('API Request:', config.method?.toUpperCase(), config.baseURL + config.url);

    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add zoneId header - handle both single ID and array
    const zoneId = localStorage.getItem('zoneId');
    if (zoneId) {
      // If it's already a JSON string (array), use it as-is
      // Otherwise, just use the single value
      try {
        const parsed = JSON.parse(zoneId);
        if (Array.isArray(parsed)) {
          config.headers.zoneId = JSON.stringify(parsed);
        } else {
          config.headers.zoneId = zoneId;
        }
      } catch {
        // Not JSON, use as-is
        config.headers.zoneId = zoneId;
      }
      console.log('Adding zoneId header:', config.headers.zoneId);
    } else {
      console.warn('No zoneId in localStorage!');
    }

    // Add moduleId header
    const moduleId = localStorage.getItem('moduleId');
    if (moduleId) {
      config.headers.moduleId = moduleId;
      console.log('Adding moduleId header:', moduleId);
    } else {
      console.warn('No moduleId in localStorage!');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common error cases
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, 'Status:', response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.url, error.message);
    if (error.response) {
      console.error('Error Response:', error.response.data);
    }
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      // Redirect to login or emit event
    }
    return Promise.reject(error);
  }
);

export default apiClient;
import axios, { AxiosInstance } from 'axios';

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_BASE_URL || 'https://market.bery.in/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token and optional zone/module headers
apiClient.interceptors.request.use(
  (config) => {
    const isDev = !!(import.meta as any).env?.DEV;
    if (isDev) {
      console.log('API Request:', config.method?.toUpperCase(), (config.baseURL || '') + (config.url || ''));
    }

    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers['X-localization'] = localStorage.getItem('language') || 'en';

    const zoneId = localStorage.getItem('zoneId');
    if (zoneId) {
      try {
        const parsed = JSON.parse(zoneId);
        if (Array.isArray(parsed)) {
          config.headers.zoneId = JSON.stringify(parsed);
        } else {
          config.headers.zoneId = zoneId;
        }
      } catch {
        config.headers.zoneId = zoneId;
      }
    }

    const moduleId = localStorage.getItem('moduleId');
    if (moduleId) {
      config.headers.moduleId = moduleId;
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
    const isDev = !!(import.meta as any).env?.DEV;
    if (isDev) {
      console.log('API Response:', response.config.url, 'Status:', response.status);
    }
    return response;
  },
  (error) => {
    const normalize = (err: any): Error => {
      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;
        const msg = (data && (data.message || data.error || data.errors?.[0]?.message)) || err.message || 'Request failed';
        switch (status) {
          case 400:
            return new Error(msg || 'Bad Request');
          case 401:
            try { localStorage.removeItem('authToken'); } catch {}
            return new Error('Unauthorized');
          case 403:
            return new Error('Forbidden');
          case 404:
            return new Error('Not Found');
          case 429:
            return new Error('Too Many Requests');
          case 500:
            return new Error('Server Error');
          default:
            return new Error(msg);
        }
      } else if (err.request) {
        return new Error('Network Error');
      } else {
        return new Error(err.message || 'Unknown Error');
      }
    };
    return Promise.reject(normalize(error));
  }
);

export default apiClient;

import axios from 'axios';

// API base URL - will use environment variable in production
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:3001' 
    : 'https://geop-backend.onrender.com');

console.log('🔍 API Configuration Debug:');
console.log('Current hostname:', window.location.hostname);
console.log('Environment API URL:', process.env.REACT_APP_API_URL);
console.log('Final API Base URL:', API_BASE_URL);

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased to 30 seconds for first request
  headers: {
    'Content-Type': 'application/json',
  },
});

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // Start with 1 second
  maxRetryDelay: 10000, // Max 10 seconds
};

// Retry logic with exponential backoff
const retryRequest = async (requestFn, retryCount = 0) => {
  try {
    return await requestFn();
  } catch (error) {
    if (retryCount >= RETRY_CONFIG.maxRetries) {
      throw error;
    }

    // Only retry on network errors or 5xx server errors
    if (error.code === 'ECONNABORTED' || 
        error.message.includes('timeout') ||
        (error.response && error.response.status >= 500)) {
      
      const delay = Math.min(
        RETRY_CONFIG.retryDelay * Math.pow(2, retryCount),
        RETRY_CONFIG.maxRetryDelay
      );
      
      console.log(`Retrying request in ${delay}ms (attempt ${retryCount + 1}/${RETRY_CONFIG.maxRetries})`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(requestFn, retryCount + 1);
    }
    
    throw error;
  }
};

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    
    // Provide more specific error messages
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timed out. The server may be starting up. Please try again.';
    } else if (error.message.includes('timeout')) {
      error.message = 'Request timed out. Please try again.';
    } else if (!error.response) {
      error.message = 'Network error. Please check your internet connection.';
    }
    
    return Promise.reject(error);
  }
);

// Health check function
const checkServerHealth = async () => {
  try {
    const response = await api.get('/health', { timeout: 5000 });
    return response.data.status === 'ok';
  } catch (error) {
    console.log('Health check failed:', error.message);
    return false;
  }
};

// User Profile API calls
export const userProfileAPI = {
  // Create or update user profile
  createProfile: async (profileData) => {
    const requestFn = () => api.post('/api/user-profile', profileData);
    const response = await retryRequest(requestFn);
    return response.data;
  },

  // Get user profile by ID
  getProfile: async (profileId) => {
    const requestFn = () => api.get(`/api/user-profile/${profileId}`);
    const response = await retryRequest(requestFn);
    return response.data;
  },

  // Get relevant events for a user profile
  getRelevantEvents: async (profileId) => {
    const requestFn = () => api.get(`/api/user-profile/${profileId}/relevant-events`);
    const response = await retryRequest(requestFn);
    return response.data;
  },
};

// Geopolitical Events API calls
export const eventsAPI = {
  // Create a new geopolitical event
  createEvent: async (eventData) => {
    const requestFn = () => api.post('/api/events', eventData);
    const response = await retryRequest(requestFn);
    return response.data;
  },

  // Get all geopolitical events
  getAllEvents: async () => {
    const requestFn = () => api.get('/api/events');
    const response = await retryRequest(requestFn);
    return response.data;
  },
};

// Health check
export const healthAPI = {
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },
  
  // Enhanced health check with retry
  checkHealthWithRetry: async () => {
    const requestFn = () => api.get('/health');
    const response = await retryRequest(requestFn);
    return response.data;
  },
};

export default api; 
import axios from 'axios';

// API base URL - will use environment variable in production
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    return Promise.reject(error);
  }
);

// User Profile API calls
export const userProfileAPI = {
  // Create or update user profile
  createProfile: async (profileData) => {
    const response = await api.post('/api/user-profile', profileData);
    return response.data;
  },

  // Get user profile by ID
  getProfile: async (profileId) => {
    const response = await api.get(`/api/user-profile/${profileId}`);
    return response.data;
  },

  // Get relevant events for a user profile
  getRelevantEvents: async (profileId) => {
    const response = await api.get(`/api/user-profile/${profileId}/relevant-events`);
    return response.data;
  },
};

// Geopolitical Events API calls
export const eventsAPI = {
  // Create a new geopolitical event
  createEvent: async (eventData) => {
    const response = await api.post('/api/events', eventData);
    return response.data;
  },

  // Get all geopolitical events
  getAllEvents: async () => {
    const response = await api.get('/api/events');
    return response.data;
  },
};

// Health check
export const healthAPI = {
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api; 
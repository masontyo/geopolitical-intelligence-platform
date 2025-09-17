// AI Service for frontend integration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://geopolitical-intelligence-platform.onrender.com';

class AIService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get onboarding status for a user
  async getOnboardingStatus(userId = 'demo-user') {
    try {
      const response = await fetch(`${this.baseURL}/api/onboarding/status/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting onboarding status:', error);
      return {
        status: 'not_started',
        completionPercentage: 0,
        progress: {
          phase1: { name: 'Essential Business Profile', completed: 0, total: 10 },
          phase2: { name: 'Geographic Footprint', completed: 0, total: 4 },
          phase3: { name: 'Key Dependencies', completed: 0, total: 4 },
          phase4: { name: 'Enhanced Data', completed: 0, total: 6 }
        },
        recommendations: [],
        insights: []
      };
    }
  }

  // Start onboarding process
  async startOnboarding(userId, data) {
    try {
      const response = await fetch(`${this.baseURL}/api/onboarding/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...data
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error starting onboarding:', error);
      throw error;
    }
  }

  // Update onboarding data
  async updateOnboarding(userId, updates) {
    try {
      const response = await fetch(`${this.baseURL}/api/onboarding/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          updates
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating onboarding:', error);
      throw error;
    }
  }

  // Complete onboarding
  async completeOnboarding(userId) {
    try {
      const response = await fetch(`${this.baseURL}/api/onboarding/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  }

  // Get personalized recommendations
  async getPersonalizedRecommendations(userId, limit = 10) {
    try {
      const response = await fetch(`${this.baseURL}/api/onboarding/recommendations/${userId}?limit=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      return { recommendations: [] };
    }
  }

  // Get AI insights
  async getAIInsights(userId) {
    try {
      const response = await fetch(`${this.baseURL}/api/onboarding/insights/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting AI insights:', error);
      return { insights: [] };
    }
  }

  // Submit user feedback
  async submitFeedback(userId, eventId, action, feedback) {
    try {
      const response = await fetch(`${this.baseURL}/api/onboarding/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          eventId,
          action,
          feedback
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }

  // Get field definitions
  async getFieldDefinitions() {
    try {
      const response = await fetch(`${this.baseURL}/api/onboarding/fields`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting field definitions:', error);
      return { fieldDefinitions: {} };
    }
  }

  // Get enhanced news with AI analysis
  async getEnhancedNews() {
    try {
      const response = await fetch(`${this.baseURL}/api/enhanced-news/process`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting enhanced news:', error);
      return { events: [] };
    }
  }

  // Test AI intelligence service
  async testAIIntelligence() {
    try {
      const response = await fetch(`${this.baseURL}/api/enhanced-news/test`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error testing AI intelligence:', error);
      return { status: 'error', message: 'AI service unavailable' };
    }
  }
}

export default new AIService();

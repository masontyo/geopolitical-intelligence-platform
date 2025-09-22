// Mock AI Intelligence Service for development without full dependencies
class MockAIIntelligenceService {
  constructor() {
    console.log('🤖 Mock AI Intelligence Service initialized for development');
  }

  async initializeIntelligence() {
    console.log('🤖 Mock AI: Intelligence initialized');
    return Promise.resolve();
  }

  async getPersonalizedRecommendations(userId, limit = 5) {
    console.log(`🤖 Mock AI: Getting ${limit} recommendations for user ${userId}`);
    
    // Return mock recommendations
    const mockRecommendations = [
      {
        id: 'rec1',
        title: 'Supply Chain Risk Assessment',
        description: 'Monitor supply chain vulnerabilities in your key markets',
        priority: 'high',
        category: 'supply-chain',
        confidence: 0.85
      },
      {
        id: 'rec2',
        title: 'Geopolitical Tension Monitoring',
        description: 'Track political developments in your operating regions',
        priority: 'medium',
        category: 'political',
        confidence: 0.78
      },
      {
        id: 'rec3',
        title: 'Economic Indicator Tracking',
        description: 'Monitor economic indicators that could impact your business',
        priority: 'medium',
        category: 'economic',
        confidence: 0.72
      }
    ];

    return mockRecommendations.slice(0, limit);
  }

  async updateUserBehavior(userId, eventId, action) {
    console.log(`🤖 Mock AI: Recording user ${userId} behavior - ${action} on event ${eventId}`);
    return Promise.resolve();
  }

  async analyzeUserProfile(profileData) {
    console.log('🤖 Mock AI: Analyzing user profile');
    return {
      riskProfile: 'moderate',
      keyInterests: ['supply-chain', 'political-stability'],
      recommendedAlerts: ['high', 'critical']
    };
  }

  async generateInsights(userId) {
    console.log(`🤖 Mock AI: Generating insights for user ${userId}`);
    
    return [
      {
        type: 'trend',
        title: 'Increasing Supply Chain Risks',
        description: 'Based on your profile, supply chain risks in your key markets have increased by 15% this month.',
        confidence: 0.82,
        actionable: true
      },
      {
        type: 'opportunity',
        title: 'Market Expansion Opportunity',
        description: 'Political stability in Southeast Asia suggests good expansion opportunities for your industry.',
        confidence: 0.75,
        actionable: true
      }
    ];
  }
}

module.exports = MockAIIntelligenceService;


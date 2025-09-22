const express = require('express');
const router = express.Router();

// Simple in-memory storage for development
const onboardingData = new Map();

// GET /api/onboarding/status/:userId - Get onboarding status
router.get('/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`📊 Getting onboarding status for user: ${userId}`);
    
    const userData = onboardingData.get(userId);
    
    if (!userData) {
      return res.json({
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
      });
    }

    res.json(userData);
  } catch (error) {
    console.error('❌ Error getting onboarding status:', error);
    res.status(500).json({ 
      error: 'Failed to get onboarding status',
      message: error.message 
    });
  }
});

// POST /api/onboarding/start - Start onboarding process
router.post('/start', async (req, res) => {
  try {
    const { userId, profileData } = req.body;
    console.log(`🚀 Starting onboarding for user: ${userId}`);

    const newOnboarding = {
      userId,
      status: 'in_progress',
      profileData: profileData || {},
      progress: {
        phase1: { name: 'Essential Business Profile', completed: 0, total: 10 },
        phase2: { name: 'Geographic Footprint', completed: 0, total: 4 },
        phase3: { name: 'Key Dependencies', completed: 0, total: 4 },
        phase4: { name: 'Enhanced Data', completed: 0, total: 6 }
      },
      completionPercentage: 0,
      recommendations: [],
      insights: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    onboardingData.set(userId, newOnboarding);
    console.log(`✅ Onboarding started for user: ${userId}`);

    res.json(newOnboarding);
  } catch (error) {
    console.error('❌ Error starting onboarding:', error);
    res.status(500).json({ 
      error: 'Failed to start onboarding',
      message: error.message 
    });
  }
});

// PUT /api/onboarding/update - Update onboarding progress
router.put('/update', async (req, res) => {
  try {
    const { userId, profileData, progress, completionPercentage } = req.body;
    console.log(`📝 Updating onboarding for user: ${userId}`);

    let userData = onboardingData.get(userId);
    
    if (!userData) {
      // Create if doesn't exist
      userData = {
        userId,
        status: 'in_progress',
        profileData: {},
        progress: {
          phase1: { name: 'Essential Business Profile', completed: 0, total: 10 },
          phase2: { name: 'Geographic Footprint', completed: 0, total: 4 },
          phase3: { name: 'Key Dependencies', completed: 0, total: 4 },
          phase4: { name: 'Enhanced Data', completed: 0, total: 6 }
        },
        completionPercentage: 0,
        recommendations: [],
        insights: [],
        createdAt: new Date()
      };
    }

    // Update the data
    if (profileData) userData.profileData = { ...userData.profileData, ...profileData };
    if (progress) userData.progress = { ...userData.progress, ...progress };
    if (completionPercentage !== undefined) userData.completionPercentage = completionPercentage;
    userData.updatedAt = new Date();

    onboardingData.set(userId, userData);
    console.log(`✅ Onboarding updated for user: ${userId}`);

    res.json(userData);
  } catch (error) {
    console.error('❌ Error updating onboarding:', error);
    res.status(500).json({ 
      error: 'Failed to update onboarding',
      message: error.message 
    });
  }
});

// POST /api/onboarding/complete - Complete onboarding
router.post('/complete', async (req, res) => {
  try {
    const { userId, profileData } = req.body;
    console.log(`🎉 Completing onboarding for user: ${userId}`);

    let userData = onboardingData.get(userId) || {
      userId,
      profileData: {},
      progress: {},
      recommendations: [],
      insights: []
    };

    // Update final data
    userData.status = 'completed';
    userData.completionPercentage = 100;
    if (profileData) userData.profileData = { ...userData.profileData, ...profileData };
    userData.updatedAt = new Date();

    // Add some mock recommendations and insights
    userData.recommendations = [
      {
        id: 'rec1',
        title: 'Monitor Supply Chain Risks',
        description: 'Track supply chain vulnerabilities in your key markets',
        priority: 'high'
      },
      {
        id: 'rec2',
        title: 'Political Risk Assessment',
        description: 'Monitor political developments in your operating regions',
        priority: 'medium'
      }
    ];

    userData.insights = [
      {
        type: 'trend',
        title: 'Market Opportunity',
        description: 'Based on your profile, there are expansion opportunities in your industry'
      }
    ];

    onboardingData.set(userId, userData);
    console.log(`✅ Onboarding completed for user: ${userId}`);

    res.json({
      success: true,
      message: 'Onboarding completed successfully',
      data: userData
    });
  } catch (error) {
    console.error('❌ Error completing onboarding:', error);
    res.status(500).json({ 
      error: 'Failed to complete onboarding',
      message: error.message 
    });
  }
});

// GET /api/onboarding/recommendations/:userId - Get AI recommendations
router.get('/recommendations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 5;
    console.log(`🤖 Getting ${limit} recommendations for user: ${userId}`);

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
      }
    ];

    res.json(mockRecommendations.slice(0, limit));
  } catch (error) {
    console.error('❌ Error getting recommendations:', error);
    res.status(500).json({ 
      error: 'Failed to get recommendations',
      message: error.message 
    });
  }
});

// GET /api/onboarding/insights/:userId - Get AI insights
router.get('/insights/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`💡 Getting insights for user: ${userId}`);

    const mockInsights = [
      {
        type: 'trend',
        title: 'Increasing Supply Chain Risks',
        description: 'Supply chain risks in your key markets have increased recently',
        confidence: 0.82
      },
      {
        type: 'opportunity',
        title: 'Market Expansion Opportunity',
        description: 'Political stability suggests good expansion opportunities',
        confidence: 0.75
      }
    ];

    res.json(mockInsights);
  } catch (error) {
    console.error('❌ Error getting insights:', error);
    res.status(500).json({ 
      error: 'Failed to get insights',
      message: error.message 
    });
  }
});

module.exports = router;


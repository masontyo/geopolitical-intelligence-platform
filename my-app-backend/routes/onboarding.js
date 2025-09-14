const express = require('express');
const router = express.Router();
const UserOnboarding = require('../models/UserOnboarding');
const AIIntelligenceService = require('../services/aiIntelligenceService');

// Initialize AI Intelligence Service
const aiIntelligence = new AIIntelligenceService();

// GET /api/onboarding/status/:userId - Get onboarding status
router.get('/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    let onboarding = await UserOnboarding.findOne({ userId });
    
    if (!onboarding) {
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

    const progress = onboarding.getOnboardingProgress();
    const recommendations = onboarding.getNextRecommendedFields();
    const insights = onboarding.getAIInsights();

    res.json({
      status: onboarding.onboardingStatus,
      completionPercentage: onboarding.completionPercentage,
      progress,
      recommendations,
      insights,
      lastUpdated: onboarding.lastUpdated
    });

  } catch (error) {
    console.error('Error getting onboarding status:', error);
    res.status(500).json({ error: 'Failed to get onboarding status' });
  }
});

// POST /api/onboarding/start - Start onboarding process
router.post('/start', async (req, res) => {
  try {
    const { userId, companyName, industry, primaryBusiness, headquarters } = req.body;

    // Validate required fields
    if (!userId || !companyName || !industry || !primaryBusiness || !headquarters) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId, companyName, industry, primaryBusiness, headquarters' 
      });
    }

    // Check if onboarding already exists
    let onboarding = await UserOnboarding.findOne({ userId });
    
    if (onboarding) {
      return res.json({
        message: 'Onboarding already exists',
        onboarding,
        progress: onboarding.getOnboardingProgress(),
        recommendations: onboarding.getNextRecommendedFields()
      });
    }

    // Create new onboarding
    onboarding = new UserOnboarding({
      userId,
      companyName,
      industry,
      primaryBusiness,
      headquarters,
      onboardingStatus: 'in_progress'
    });

    await onboarding.save();

    res.status(201).json({
      message: 'Onboarding started successfully',
      onboarding,
      progress: onboarding.getOnboardingProgress(),
      recommendations: onboarding.getNextRecommendedFields(),
      insights: onboarding.getAIInsights()
    });

  } catch (error) {
    console.error('Error starting onboarding:', error);
    res.status(500).json({ error: 'Failed to start onboarding' });
  }
});

// PUT /api/onboarding/update - Update onboarding data
router.put('/update', async (req, res) => {
  try {
    const { userId, updates } = req.body;

    if (!userId || !updates) {
      return res.status(400).json({ error: 'Missing userId or updates' });
    }

    let onboarding = await UserOnboarding.findOne({ userId });
    
    if (!onboarding) {
      return res.status(404).json({ error: 'Onboarding not found' });
    }

    // Update fields
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        onboarding[key] = updates[key];
      }
    });

    onboarding.lastUpdated = new Date();
    await onboarding.save();

    // Get updated progress and recommendations
    const progress = onboarding.getOnboardingProgress();
    const recommendations = onboarding.getNextRecommendedFields();
    const insights = onboarding.getAIInsights();

    // Check if onboarding is complete
    if (progress.phase1.completed === progress.phase1.total && 
        progress.phase2.completed === progress.phase2.total && 
        progress.phase3.completed === progress.phase3.total) {
      onboarding.onboardingStatus = 'completed';
      onboarding.completionPercentage = 100;
      await onboarding.save();
    }

    res.json({
      message: 'Onboarding updated successfully',
      onboarding,
      progress,
      recommendations,
      insights,
      isComplete: onboarding.onboardingStatus === 'completed'
    });

  } catch (error) {
    console.error('Error updating onboarding:', error);
    res.status(500).json({ error: 'Failed to update onboarding' });
  }
});

// POST /api/onboarding/complete - Complete onboarding
router.post('/complete', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    let onboarding = await UserOnboarding.findOne({ userId });
    
    if (!onboarding) {
      return res.status(404).json({ error: 'Onboarding not found' });
    }

    // Validate required fields
    const errors = onboarding.validateRequiredFields();
    if (errors.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot complete onboarding. Missing required fields:',
        missingFields: errors
      });
    }

    // Mark as completed
    onboarding.onboardingStatus = 'completed';
    onboarding.completionPercentage = 100;
    onboarding.lastUpdated = new Date();
    await onboarding.save();

    // Initialize AI intelligence for this user
    await aiIntelligence.initializeIntelligence();

    res.json({
      message: 'Onboarding completed successfully',
      onboarding,
      progress: onboarding.getOnboardingProgress(),
      insights: onboarding.getAIInsights()
    });

  } catch (error) {
    console.error('Error completing onboarding:', error);
    res.status(500).json({ error: 'Failed to complete onboarding' });
  }
});

// GET /api/onboarding/recommendations/:userId - Get personalized recommendations
router.get('/recommendations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10 } = req.query;

    const onboarding = await UserOnboarding.findOne({ userId });
    
    if (!onboarding) {
      return res.status(404).json({ error: 'Onboarding not found' });
    }

    if (onboarding.onboardingStatus !== 'completed') {
      return res.status(400).json({ 
        error: 'Onboarding must be completed to get recommendations' 
      });
    }

    // Get personalized recommendations from AI
    const recommendations = await aiIntelligence.getPersonalizedRecommendations(userId, parseInt(limit));

    res.json({
      recommendations,
      userProfile: {
        industry: onboarding.industry,
        riskTolerance: onboarding.riskTolerance,
        priorityRegions: onboarding.priorityRegions,
        concernAreas: onboarding.concernAreas
      }
    });

  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// GET /api/onboarding/insights/:userId - Get AI insights
router.get('/insights/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const onboarding = await UserOnboarding.findOne({ userId });
    
    if (!onboarding) {
      return res.status(404).json({ error: 'Onboarding not found' });
    }

    const insights = onboarding.getAIInsights();
    const progress = onboarding.getOnboardingProgress();
    const recommendations = onboarding.getNextRecommendedFields();

    res.json({
      insights,
      progress,
      recommendations,
      completionPercentage: onboarding.completionPercentage,
      status: onboarding.onboardingStatus
    });

  } catch (error) {
    console.error('Error getting insights:', error);
    res.status(500).json({ error: 'Failed to get insights' });
  }
});

// POST /api/onboarding/feedback - Submit user feedback
router.post('/feedback', async (req, res) => {
  try {
    const { userId, eventId, action, feedback } = req.body;

    if (!userId || !eventId || !action) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Update user behavior in AI intelligence service
    await aiIntelligence.updateUserBehavior(userId, eventId, action);

    // Store feedback if provided
    if (feedback) {
      // This could be stored in a separate feedback collection
      console.log(`User ${userId} feedback for event ${eventId}: ${feedback}`);
    }

    res.json({ message: 'Feedback recorded successfully' });

  } catch (error) {
    console.error('Error recording feedback:', error);
    res.status(500).json({ error: 'Failed to record feedback' });
  }
});

// GET /api/onboarding/fields - Get field definitions and options
router.get('/fields', (req, res) => {
  const fieldDefinitions = {
    industry: {
      type: 'select',
      options: ['Manufacturing', 'Technology', 'Financial Services', 'Healthcare', 'Retail', 'Energy', 'Other'],
      required: true,
      description: 'Your industry sector for relevant risk patterns'
    },
    companySize: {
      type: 'select',
      options: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+'],
      required: true,
      description: 'Number of employees for risk scaling'
    },
    riskTolerance: {
      type: 'select',
      options: ['Low', 'Medium', 'High'],
      required: true,
      description: 'Your comfort level with different risk levels'
    },
    alertFrequency: {
      type: 'select',
      options: ['Real-time', 'Hourly', 'Daily', 'Weekly'],
      required: true,
      description: 'How often you want to receive alerts'
    },
    concernAreas: {
      type: 'multi-select',
      options: ['Supply Chain', 'Trade Policy', 'Labor Issues', 'Regulatory Changes', 'Cyber Security', 'Natural Disasters', 'Political Instability', 'Economic Instability'],
      required: true,
      description: 'Types of risks you want to track'
    },
    keyMarkets: {
      type: 'multi-select',
      options: ['North America', 'Europe', 'Asia', 'Southeast Asia', 'Eastern Europe', 'Latin America', 'Middle East', 'Africa'],
      required: true,
      description: 'Regions where you operate or sell'
    },
    priorityRegions: {
      type: 'multi-select',
      options: ['North America', 'Europe', 'Asia', 'Southeast Asia', 'Eastern Europe', 'Latin America', 'Middle East', 'Africa'],
      required: true,
      description: 'Regions you want to monitor most closely'
    }
  };

  res.json({ fieldDefinitions });
});

// DELETE /api/onboarding/:userId - Delete onboarding data
router.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await UserOnboarding.deleteOne({ userId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Onboarding not found' });
    }

    res.json({ message: 'Onboarding data deleted successfully' });

  } catch (error) {
    console.error('Error deleting onboarding:', error);
    res.status(500).json({ error: 'Failed to delete onboarding data' });
  }
});

module.exports = router;
// Simple server for development testing
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 Starting simple development server...');

// Middleware
app.use(cors());
app.use(express.json());

// Simple onboarding routes
const simpleOnboarding = new Map();

// GET /api/onboarding/status/:userId
app.get('/api/onboarding/status/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`📊 Getting status for user: ${userId}`);
    
    const userData = simpleOnboarding.get(userId);
    
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
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Failed to get status', message: error.message });
  }
});

// POST /api/onboarding/start
app.post('/api/onboarding/start', (req, res) => {
  try {
    const { userId, profileData } = req.body;
    console.log(`🚀 Starting onboarding for: ${userId}`);

    const newData = {
      userId,
      status: 'in_progress',
      profileData: profileData || {},
      completionPercentage: 0,
      recommendations: [],
      insights: [],
      createdAt: new Date()
    };

    simpleOnboarding.set(userId, newData);
    res.json(newData);
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Failed to start', message: error.message });
  }
});

// PUT /api/onboarding/update
app.put('/api/onboarding/update', (req, res) => {
  try {
    const { userId, profileData, completionPercentage } = req.body;
    console.log(`📝 Updating onboarding for: ${userId}`);

    let userData = simpleOnboarding.get(userId) || {
      userId,
      status: 'in_progress',
      profileData: {},
      completionPercentage: 0,
      recommendations: [],
      insights: []
    };

    if (profileData) userData.profileData = { ...userData.profileData, ...profileData };
    if (completionPercentage !== undefined) userData.completionPercentage = completionPercentage;
    userData.updatedAt = new Date();

    simpleOnboarding.set(userId, userData);
    res.json(userData);
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Failed to update', message: error.message });
  }
});

// POST /api/onboarding/complete
app.post('/api/onboarding/complete', (req, res) => {
  try {
    const { userId, profileData } = req.body;
    console.log(`🎉 Completing onboarding for: ${userId}`);

    let userData = simpleOnboarding.get(userId) || { userId, profileData: {} };
    
    userData.status = 'completed';
    userData.completionPercentage = 100;
    if (profileData) userData.profileData = { ...userData.profileData, ...profileData };
    userData.updatedAt = new Date();

    simpleOnboarding.set(userId, userData);
    
    res.json({
      success: true,
      message: 'Onboarding completed successfully',
      data: userData
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Failed to complete', message: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Simple server running' });
});

// Basic user profile endpoint
app.post('/api/user-profile', (req, res) => {
  try {
    console.log('👤 Creating user profile');
    res.json({ success: true, message: 'Profile created', data: req.body });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create profile', message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Simple development server running on port ${PORT}`);
  console.log(`🌐 Frontend should connect to: http://localhost:${PORT}`);
});

module.exports = app;


/**
 * Simplified server test to debug route registration
 */

const express = require('express');
const app = express();

// Basic middleware
app.use(express.json());

// Test loading routes
console.log('🔍 Loading routes...');

try {
  const onboardingRoutes = require('./routes/onboarding');
  const userProfileRoutes = require('./routes/userProfile');
  const newsRoutes = require('./routes/news');
  
  console.log('✅ Routes loaded successfully');
  
  // Register routes
  app.use('/api', onboardingRoutes);
  app.use('/api', userProfileRoutes);
  app.use('/api', newsRoutes);
  
  console.log('✅ Routes registered successfully');
  
  // Add a test route
  app.get('/test', (req, res) => {
    res.json({ message: 'Test route working' });
  });
  
  // Start server
  const PORT = 5001;
  app.listen(PORT, () => {
    console.log(`✅ Test server running on http://localhost:${PORT}`);
    console.log('🎯 Ready to test routes!');
  });
  
} catch (error) {
  console.error('❌ Error during setup:', error);
} 
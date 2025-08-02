/**
 * Debug script to test route registration
 */

const express = require('express');
const app = express();

// Test loading routes
console.log('🔍 Testing route loading...');

try {
  console.log('Loading onboarding routes...');
  const onboardingRoutes = require('./routes/onboarding');
  console.log('✅ Onboarding routes loaded');
  
  console.log('Loading userProfile routes...');
  const userProfileRoutes = require('./routes/userProfile');
  console.log('✅ UserProfile routes loaded');
  
  console.log('Loading news routes...');
  const newsRoutes = require('./routes/news');
  console.log('✅ News routes loaded');
  
  // Register routes
  app.use('/api', onboardingRoutes);
  app.use('/api', userProfileRoutes);
  app.use('/api', newsRoutes);
  
  console.log('✅ All routes registered');
  
  // Test route matching
  console.log('\n🔍 Testing route matching...');
  
  const testRoutes = [
    '/api/submit-cro-intake',
    '/api/user-profile',
    '/api/news/status',
    '/api/news/fetch-test',
    '/api/news/latest'
  ];
  
  testRoutes.forEach(route => {
    const layer = app._router.stack.find(layer => {
      if (layer.route) {
        return layer.route.path === route;
      }
      if (layer.name === 'router') {
        return layer.regexp.test(route);
      }
      return false;
    });
    
    if (layer) {
      console.log(`✅ Route found: ${route}`);
    } else {
      console.log(`❌ Route not found: ${route}`);
    }
  });
  
} catch (error) {
  console.error('❌ Error loading routes:', error);
}

console.log('\n�� Debug complete!'); 
const express = require('express');
require('dotenv').config();

async function testRouteLoading() {
  try {
    console.log('Testing route loading...');
    
    // Try to require the route file
    const userProfileRoutes = require('./routes/userProfile');
    console.log('✅ userProfile routes loaded successfully');
    
    // Create a test app
    const app = express();
    app.use('/api', userProfileRoutes);
    
    console.log('✅ Routes mounted successfully');
    
    // List all routes
    console.log('\nRoutes in userProfile:');
    userProfileRoutes.stack.forEach((middleware) => {
      if (middleware.route) {
        const methods = Object.keys(middleware.route.methods);
        console.log(`  ${methods.join(',').toUpperCase()} ${middleware.route.path}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error loading routes:', error);
  }
}

testRouteLoading(); 
/**
 * Test news routes registration
 */

const express = require('express');
const app = express();

console.log('🔍 Testing news routes registration...');

try {
  const newsRoutes = require('./routes/news');
  console.log('✅ News routes loaded');
  
  // Register routes
  app.use('/api', newsRoutes);
  console.log('✅ News routes registered');
  
  // Check what routes are registered
  console.log('\n📋 Registered routes:');
  app._router.stack.forEach(layer => {
    if (layer.route) {
      console.log(`  ${Object.keys(layer.route.methods).join(',').toUpperCase()} ${layer.route.path}`);
    } else if (layer.name === 'router') {
      console.log(`  Router: ${layer.regexp}`);
    }
  });
  
  // Test a simple route
  app.get('/test', (req, res) => {
    res.json({ message: 'Test working' });
  });
  
  // Start server
  const PORT = 5002;
  app.listen(PORT, () => {
    console.log(`\n✅ Test server running on http://localhost:${PORT}`);
    console.log('🎯 Ready to test news routes!');
  });
  
} catch (error) {
  console.error('❌ Error:', error);
} 
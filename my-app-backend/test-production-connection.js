const axios = require('axios');

// Test your production backend
const BACKEND_URL = 'https://contextual-info-backend.onrender.com';

async function testProductionBackend() {
  console.log('🔍 Testing Production Backend Connection...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BACKEND_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test profile creation
    console.log('\n2. Testing profile creation...');
    const profileData = {
      name: 'Test Company',
      company: 'Test Corp',
      businessUnits: ['Test Unit'],
      areasOfConcern: ['Shipping Disruption'],
      regions: ['North America'],
      riskTolerance: 'medium'
    };
    
    const createResponse = await axios.post(`${BACKEND_URL}/api/user-profile`, profileData);
    console.log('✅ Profile creation passed:', createResponse.data);
    
    console.log('\n🎉 Production backend is working!');
    console.log('Your Vercel frontend should now be able to connect.');
    
  } catch (error) {
    console.log('❌ Production backend test failed:', error.message);
    console.log('\n🔧 To fix this:');
    console.log('1. Deploy your backend to Render.com');
    console.log('2. Set up MongoDB Atlas database');
    console.log('3. Configure environment variables in Render');
    console.log('4. Update your Vercel app with the correct backend URL');
  }
}

testProductionBackend(); 
const axios = require('axios');

async function testCurrentStatus() {
  console.log('🔍 Testing Current Status...\n');
  
  const BACKEND_URL = 'https://geop-backend.onrender.com';
  
  try {
    // Test 1: Backend health
    console.log('1. Testing backend health...');
    const healthResponse = await axios.get(`${BACKEND_URL}/health`, { timeout: 10000 });
    console.log('✅ Backend is healthy:', healthResponse.data);
    
    // Test 2: Try profile creation with the exact data structure the frontend sends
    console.log('\n2. Testing profile creation with frontend data structure...');
    const frontendData = {
      name: 'Test Company',
      title: 'CRO',
      company: 'Test Company',
      industry: 'Technology',
      businessUnits: [
        {
          name: 'Manufacturing',
          description: 'Manufacturing business unit',
          regions: [],
          products: []
        }
      ],
      areasOfConcern: [
        {
          category: 'Shipping Disruption',
          description: 'Shipping Disruption related concerns',
          priority: 'medium'
        }
      ],
      regions: ['North America'],
      riskTolerance: 'medium',
      additionalInfo: {
        hqLocation: 'New York',
        supplyChainNodes: 'China, Mexico',
        pastDisruptions: 'COVID-19',
        stakeholders: 'Board, Investors',
        deliveryPreference: 'dashboard'
      }
    };
    
    const createResponse = await axios.post(`${BACKEND_URL}/api/user-profile`, frontendData, { timeout: 10000 });
    console.log('✅ Profile creation successful:', createResponse.data);
    
    console.log('\n🎉 Backend is working correctly!');
    console.log('The issue might be:');
    console.log('1. Vercel deployment still in progress');
    console.log('2. CORS issues');
    console.log('3. Frontend not using the updated code');
    
  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);
    console.log('Status:', error.response?.status);
    
    if (error.response?.status === 500) {
      console.log('\n🔧 The backend is still having issues.');
      console.log('Check your Render deployment logs for more details.');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Backend is not accessible.');
      console.log('Check if your Render service is running.');
    }
  }
}

testCurrentStatus(); 
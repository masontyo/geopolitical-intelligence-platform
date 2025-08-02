const axios = require('axios');

const BASE_URL = process.env.BACKEND_URL || 'http://localhost:3001';

async function testNotificationSystem() {
  console.log('🧪 Testing Notification System & News Integration\n');
  
  try {
    // Test 1: Check server health
    console.log('1. Testing server health...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is healthy:', healthResponse.data.status);
    
    // Test 2: Check news service status
    console.log('\n2. Testing news service status...');
    const statusResponse = await axios.get(`${BASE_URL}/api/news/status`);
    console.log('✅ News service status:', statusResponse.data.status);
    
    // Test 3: Test news service (without API keys)
    console.log('\n3. Testing news service functionality...');
    const testResponse = await axios.get(`${BASE_URL}/api/news/test`);
    console.log('✅ News service test result:', testResponse.data.result);
    
    // Test 4: Get available news sources
    console.log('\n4. Checking available news sources...');
    const sourcesResponse = await axios.get(`${BASE_URL}/api/news/sources`);
    console.log('✅ Available sources:', sourcesResponse.data.sources);
    
    // Test 5: Test notification system
    console.log('\n5. Testing notification system...');
    const notificationTestResponse = await axios.post(`${BASE_URL}/api/news/test-notification`, {
      userProfileId: 'test-profile-id',
      testEvent: {
        title: 'Test Geopolitical Event',
        description: 'This is a test event for notification verification',
        location: 'Test Region',
        category: 'Test Category',
        severity: 'Medium',
        date: new Date()
      }
    });
    console.log('✅ Notification test result:', notificationTestResponse.data);
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Get a free API key from NewsAPI.org (https://newsapi.org/)');
    console.log('2. Add the API key to your .env file as NEWSAPI_KEY');
    console.log('3. Configure email settings in .env file for notifications');
    console.log('4. Test the full end-to-end system with real news data');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the backend server is running');
    console.log('2. Check that all dependencies are installed');
    console.log('3. Verify the BASE_URL is correct');
  }
}

// Run the test
testNotificationSystem(); 
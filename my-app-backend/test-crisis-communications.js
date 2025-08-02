const mongoose = require('mongoose');
const CrisisCommunication = require('./models/CrisisCommunication');
const GeopoliticalEvent = require('./models/GeopoliticalEvent');
const UserProfile = require('./models/UserProfile');
const crisisCommunicationService = require('./services/crisisCommunicationService');
require('dotenv').config();

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/risk-intelligence');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Create test data
async function createTestData() {
  console.log('Creating test data...');

  // Create a test user profile
  const userProfile = new UserProfile({
    name: 'John Doe',
    title: 'Risk Manager',
    company: 'Test Corp',
    email: 'john.doe@testcorp.com',
    industry: 'technology',
    businessUnits: [{
      name: 'Supply Chain',
      description: 'Global supply chain operations',
      regions: ['Asia', 'Europe'],
      products: ['Electronics', 'Components']
    }],
    areasOfConcern: [{
      category: 'supply chain disruption',
      description: 'Supply chain risks in Asia',
      priority: 'high'
    }],
    regions: ['Asia', 'Europe'],
    riskTolerance: 'medium',
    notificationPreferences: {
      email: true,
      frequency: 'immediate'
    }
  });

  await userProfile.save();
  console.log('Created test user profile:', userProfile._id);

  // Create a test geopolitical event
  const event = new GeopoliticalEvent({
    title: 'Supply Chain Disruption in Taiwan',
    description: 'Major semiconductor manufacturing disruption due to geopolitical tensions',
    summary: 'Taiwan semiconductor production affected by regional tensions',
    eventDate: new Date(),
    categories: ['supply chain', 'geopolitical', 'technology'],
    regions: ['Asia', 'Taiwan'],
    countries: ['Taiwan', 'China'],
    severity: 'high',
    impact: {
      economic: 'negative',
      political: 'negative',
      social: 'neutral'
    },
    source: {
      name: 'Reuters',
      url: 'https://reuters.com/test',
      reliability: 'high'
    },
    status: 'active'
  });

  await event.save();
  console.log('Created test event:', event._id);

  return { userProfile, event };
}

// Test crisis room creation
async function testCrisisRoomCreation(eventId) {
  console.log('\nTesting crisis room creation...');

  const crisisData = {
    title: 'Crisis: Supply Chain Disruption',
    description: 'Managing supply chain disruption in Taiwan',
    createdBy: 'Test System',
    stakeholders: [
      {
        name: 'Jane Smith',
        email: 'jane.smith@testcorp.com',
        phone: '+1234567890',
        role: 'executive',
        organization: 'Test Corp',
        notificationChannels: ['email', 'sms'],
        escalationLevel: 2
      },
      {
        name: 'Bob Johnson',
        email: 'bob.johnson@testcorp.com',
        phone: '+1234567891',
        role: 'manager',
        organization: 'Test Corp',
        notificationChannels: ['email', 'slack'],
        escalationLevel: 1
      }
    ],
    assignedTeam: [
      {
        userId: null, // Will be set when we have user profiles
        role: 'incident_commander'
      }
    ]
  };

  try {
    const crisisRoom = await crisisCommunicationService.createCrisisRoom(eventId, crisisData);
    console.log('✅ Crisis room created successfully:', crisisRoom._id);
    console.log('   - Title:', crisisRoom.crisisRoom.title);
    console.log('   - Severity:', crisisRoom.crisisRoom.severity);
    console.log('   - Stakeholders:', crisisRoom.stakeholders.length);
    console.log('   - Templates:', crisisRoom.templates.length);
    
    return crisisRoom;
  } catch (error) {
    console.error('❌ Failed to create crisis room:', error.message);
    throw error;
  }
}

// Test communication sending
async function testCommunicationSending(crisisRoomId) {
  console.log('\nTesting communication sending...');

  const communicationData = {
    type: 'alert',
    channel: 'email',
    recipients: [
      {
        stakeholderId: null,
        name: 'Jane Smith',
        email: 'jane.smith@testcorp.com',
        role: 'executive'
      }
    ],
    subject: 'URGENT: Supply Chain Crisis Alert',
    content: 'This is a test communication for the supply chain disruption crisis.',
    sentBy: 'Test System'
  };

  try {
    const communication = await crisisCommunicationService.sendCrisisCommunication(
      crisisRoomId,
      communicationData
    );
    console.log('✅ Communication sent successfully');
    console.log('   - Type:', communication.type);
    console.log('   - Channel:', communication.channel);
    console.log('   - Recipients:', communication.recipients.length);
    console.log('   - Status:', communication.deliveryStatus);
    
    return communication;
  } catch (error) {
    console.error('❌ Failed to send communication:', error.message);
    throw error;
  }
}

// Test stakeholder response
async function testStakeholderResponse(crisisRoomId) {
  console.log('\nTesting stakeholder response...');

  const responseData = {
    stakeholderId: null,
    stakeholderName: 'Jane Smith',
    responseType: 'acknowledgement',
    content: 'Received and acknowledged. Will review supply chain impact immediately.',
    actionItems: [
      {
        description: 'Review supplier status in Taiwan',
        assignedTo: 'Supply Chain Team',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        status: 'pending'
      }
    ],
    followUpRequired: true,
    followUpDate: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
  };

  try {
    const response = await crisisCommunicationService.processStakeholderResponse(
      crisisRoomId,
      responseData
    );
    console.log('✅ Stakeholder response processed successfully');
    console.log('   - Response type:', response.responseType);
    console.log('   - Action items:', response.actionItems.length);
    console.log('   - Follow-up required:', response.followUpRequired);
    
    return response;
  } catch (error) {
    console.error('❌ Failed to process stakeholder response:', error.message);
    throw error;
  }
}

// Test escalation
async function testEscalation(crisisRoomId) {
  console.log('\nTesting escalation...');

  const escalationData = {
    reason: 'No response from key stakeholders within 30 minutes',
    triggeredBy: 'Test System'
  };

  try {
    const escalation = await crisisCommunicationService.triggerEscalation(
      crisisRoomId,
      escalationData
    );
    console.log('✅ Escalation triggered successfully');
    console.log('   - Level:', escalation.level);
    console.log('   - Reason:', escalation.reason);
    console.log('   - Escalated to:', escalation.escalatedTo.length, 'stakeholders');
    
    return escalation;
  } catch (error) {
    console.error('❌ Failed to trigger escalation:', error.message);
    throw error;
  }
}

// Test analytics
async function testAnalytics(crisisRoomId) {
  console.log('\nTesting analytics...');

  try {
    const analytics = await crisisCommunicationService.getCrisisRoomAnalytics(crisisRoomId);
    console.log('✅ Analytics retrieved successfully');
    console.log('   - Total communications:', analytics.basic.totalCommunications);
    console.log('   - Response rate:', analytics.basic.responseRate.toFixed(1) + '%');
    console.log('   - Average response time:', analytics.basic.averageResponseTime.toFixed(1) + ' minutes');
    console.log('   - Escalation count:', analytics.basic.escalationCount);
    
    return analytics;
  } catch (error) {
    console.error('❌ Failed to get analytics:', error.message);
    throw error;
  }
}

// Main test function
async function runTests() {
  try {
    await connectDB();
    
    // Create test data
    const { userProfile, event } = await createTestData();
    
    // Test crisis room creation
    const crisisRoom = await testCrisisRoomCreation(event._id);
    
    // Test communication sending
    await testCommunicationSending(crisisRoom._id);
    
    // Test stakeholder response
    await testStakeholderResponse(crisisRoom._id);
    
    // Test escalation
    await testEscalation(crisisRoom._id);
    
    // Test analytics
    await testAnalytics(crisisRoom._id);
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('\nTest data created:');
    console.log('- User Profile ID:', userProfile._id);
    console.log('- Event ID:', event._id);
    console.log('- Crisis Room ID:', crisisRoom._id);
    console.log('\nYou can now test the frontend with these IDs.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests }; 
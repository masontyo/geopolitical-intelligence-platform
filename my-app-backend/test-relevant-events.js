const mongoose = require('mongoose');
const UserProfile = require('./models/UserProfile');
const GeopoliticalEvent = require('./models/GeopoliticalEvent');
require('dotenv').config();

async function testRelevantEvents() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the test profile ID from the previous test
    const testProfile = await UserProfile.findOne({ name: 'Test User' });
    if (!testProfile) {
      console.log('No test profile found, creating one...');
      const newProfile = await UserProfile.create({
        name: 'Test User',
        title: 'Risk Manager',
        company: 'Test Company',
        email: 'test@example.com',
        industry: 'Technology',
        regions: ['North America', 'Europe'],
        areasOfConcern: [
          {
            category: 'Supply Chain',
            description: 'Supply chain disruptions',
            priority: 'high'
          },
          {
            category: 'Regulatory',
            description: 'Regulatory changes',
            priority: 'medium'
          }
        ],
        riskTolerance: 'medium',
        notificationPreferences: {
          email: true,
          frequency: 'daily'
        }
      });
      console.log('Created test profile:', newProfile._id);
    } else {
      console.log('Found test profile:', testProfile._id);
    }

    // Check if we have events
    const events = await GeopoliticalEvent.find();
    console.log(`Found ${events.length} events in database`);

    if (events.length === 0) {
      console.log('Creating sample events...');
      await GeopoliticalEvent.create([
        {
          title: 'Supply Chain Disruption in Asia',
          description: 'Major supply chain disruption affecting technology manufacturing',
          eventDate: new Date(),
          severity: 'high',
          categories: ['Supply Chain', 'Manufacturing'],
          regions: ['Asia', 'North America'],
          status: 'active'
        },
        {
          title: 'New Regulatory Requirements in EU',
          description: 'New data protection regulations affecting tech companies',
          eventDate: new Date(),
          severity: 'medium',
          categories: ['Regulatory', 'Data Protection'],
          regions: ['Europe'],
          status: 'active'
        }
      ]);
      console.log('Created sample events');
    }

    // Test the relevant events endpoint logic
    const profile = testProfile || await UserProfile.findOne({ name: 'Test User' });
    const allEvents = await GeopoliticalEvent.find({ status: 'active' });
    
    console.log(`Testing with profile: ${profile._id}`);
    console.log(`Testing with ${allEvents.length} events`);

    // Import the scoring function
    const { scoreEvents } = require('./utils/advancedScoring');
    
    // Test the scoring
    const scoredEvents = scoreEvents(profile, allEvents);
    console.log(`Scored ${scoredEvents.length} events`);
    
    // Show top 3 events
    const topEvents = scoredEvents
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3);
    
    console.log('\nTop 3 relevant events:');
    topEvents.forEach((scoredEvent, index) => {
      console.log(`${index + 1}. ${scoredEvent.event.title} (Score: ${scoredEvent.relevanceScore.toFixed(3)})`);
    });

    console.log('\n✅ Relevant events test completed successfully');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testRelevantEvents(); 
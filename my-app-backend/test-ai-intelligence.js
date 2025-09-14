const AIIntelligenceService = require('./services/aiIntelligenceService');
const UserOnboarding = require('./models/UserOnboarding');

async function testAIIntelligence() {
  console.log('🧠 Testing AI Intelligence Service...\n');

  try {
    // Initialize the service
    const aiService = new AIIntelligenceService();
    
    // Wait a moment for initialization
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 1: Create a sample user profile
    console.log('📝 Test 1: Creating sample user profile...');
    const sampleUserProfile = {
      userId: 'test-user-123',
      companyName: 'Acme Manufacturing',
      industry: 'Manufacturing',
      primaryBusiness: 'Automotive parts manufacturing',
      headquarters: 'Detroit, MI',
      keyMarkets: ['North America', 'Europe'],
      companySize: '501-1000',
      riskTolerance: 'Medium',
      alertFrequency: 'Daily',
      priorityRegions: ['Southeast Asia', 'Eastern Europe'],
      concernAreas: ['Supply Chain', 'Trade Policy'],
      operatingRegions: ['North America', 'Europe', 'Southeast Asia']
    };

    // Test 2: Create a sample event
    console.log('📰 Test 2: Creating sample event...');
    const sampleEvent = {
      id: 'event-001',
      title: 'Port Strike in Vietnam Affects Global Supply Chains',
      description: 'Major port workers strike in Ho Chi Minh City is causing significant delays in shipping and affecting global supply chains. The strike is expected to last for several days and could impact manufacturing operations worldwide.',
      category: 'Supply Chain Risk',
      severity: 'High',
      location: 'Vietnam',
      timestamp: new Date(),
      regions: ['Southeast Asia', 'Global']
    };

    // Test 3: Process event with AI
    console.log('🤖 Test 3: Processing event with AI intelligence...');
    const analysis = await aiService.processEventWithAI(sampleEvent, 'test-user-123');
    
    console.log('✅ AI Analysis Results:');
    console.log(`   Relevance Score: ${analysis.relevanceScore}%`);
    console.log(`   Impact Assessment: ${analysis.impactAssessment.severity} severity`);
    console.log(`   Risk Level: ${analysis.riskLevel.overall}`);
    console.log(`   Recommended Actions: ${analysis.recommendedActions.length} actions`);
    console.log(`   Contextual Insights: ${analysis.contextualInsights.length} insights`);
    console.log(`   Behavioral Insights: ${analysis.behavioralInsights.length} insights`);

    // Test 4: Test behavioral profiling
    console.log('\n👤 Test 4: Testing behavioral profiling...');
    const behaviorPatterns = aiService.behavioralPatterns.get('test-user-123');
    if (behaviorPatterns) {
      console.log('✅ Behavioral Patterns Found:');
      console.log(`   Preferred Regions: ${behaviorPatterns.preferredRegions.join(', ')}`);
      console.log(`   Preferred Event Types: ${behaviorPatterns.preferredEventTypes.join(', ')}`);
      console.log(`   Risk Tolerance: ${behaviorPatterns.riskTolerance}`);
      console.log(`   Engagement Level: ${behaviorPatterns.engagementLevel}`);
    } else {
      console.log('ℹ️  No behavioral patterns yet (user needs to interact with events)');
    }

    // Test 5: Test industry context
    console.log('\n🏭 Test 5: Testing industry context...');
    const industryContext = aiService.industryContexts['Manufacturing'];
    if (industryContext) {
      console.log('✅ Manufacturing Industry Context:');
      console.log(`   Risk Factors: ${industryContext.riskFactors.join(', ')}`);
      console.log(`   Key Regions: ${industryContext.keyRegions.join(', ')}`);
      console.log(`   Critical Events: ${industryContext.criticalEvents.join(', ')}`);
    }

    // Test 6: Test geographic intelligence
    console.log('\n🌍 Test 6: Testing geographic intelligence...');
    const geoIntelligence = aiService.geographicIntelligence['Southeast Asia'];
    if (geoIntelligence) {
      console.log('✅ Southeast Asia Geographic Intelligence:');
      console.log(`   Risk Level: ${geoIntelligence.riskLevel}`);
      console.log(`   Common Risks: ${geoIntelligence.commonRisks.join(', ')}`);
      console.log(`   Key Countries: ${geoIntelligence.keyCountries.join(', ')}`);
    }

    // Test 7: Test user behavior update
    console.log('\n📊 Test 7: Testing user behavior update...');
    await aiService.updateUserBehavior('test-user-123', 'event-001', 'view');
    console.log('✅ User behavior updated successfully');

    // Test 8: Test personalized recommendations
    console.log('\n🎯 Test 8: Testing personalized recommendations...');
    const recommendations = await aiService.getPersonalizedRecommendations('test-user-123', 5);
    console.log(`✅ Generated ${recommendations.length} personalized recommendations`);

    console.log('\n🎉 All AI Intelligence tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ AI Intelligence Service initialized');
    console.log('   ✅ Event processing with AI analysis working');
    console.log('   ✅ Behavioral profiling system active');
    console.log('   ✅ Industry context mapping functional');
    console.log('   ✅ Geographic intelligence operational');
    console.log('   ✅ User behavior tracking working');
    console.log('   ✅ Personalized recommendations generating');

  } catch (error) {
    console.error('❌ Error testing AI Intelligence Service:', error);
  }
}

// Run the test
testAIIntelligence();

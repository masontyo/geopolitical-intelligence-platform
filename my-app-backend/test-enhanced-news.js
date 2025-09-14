#!/usr/bin/env node

/**
 * Test script for Enhanced News Service
 * This script demonstrates the new social media integration capabilities
 */

const enhancedNewsService = require('./services/enhancedNewsService');

async function testEnhancedNewsService() {
  console.log('🚀 Testing Enhanced News Service with Social Media Integration\n');
  
  try {
    // Test 1: Check source status
    console.log('📊 Checking source configuration...');
    const newsSources = Object.keys(enhancedNewsService.newsSources);
    const socialSources = Object.keys(enhancedNewsService.socialSources);
    
    console.log(`News sources configured: ${newsSources.length}`);
    newsSources.forEach(source => {
      const enabled = enhancedNewsService.newsSources[source].enabled;
      console.log(`  - ${source}: ${enabled ? '✅ Enabled' : '❌ Disabled'}`);
    });
    
    console.log(`\nSocial media sources configured: ${socialSources.length}`);
    socialSources.forEach(source => {
      const enabled = enhancedNewsService.socialSources[source].enabled;
      console.log(`  - ${source}: ${enabled ? '✅ Enabled' : '❌ Disabled'}`);
    });
    
    // Test 2: Fetch from news sources
    console.log('\n📰 Testing news sources...');
    try {
      const newsContent = await enhancedNewsService.fetchLatestNews();
      console.log(`✅ Fetched ${newsContent.length} news items`);
      
      if (newsContent.length > 0) {
        console.log('Sample news item:');
        console.log(`  Title: ${newsContent[0].title?.substring(0, 100)}...`);
        console.log(`  Source: ${newsContent[0].source?.name}`);
        console.log(`  Published: ${newsContent[0].publishedAt}`);
      }
    } catch (error) {
      console.log(`❌ News fetch failed: ${error.message}`);
    }
    
    // Test 3: Fetch from social media sources
    console.log('\n📱 Testing social media sources...');
    try {
      const socialContent = await enhancedNewsService.fetchSocialMediaContent();
      console.log(`✅ Fetched ${socialContent.length} social media items`);
      
      if (socialContent.length > 0) {
        console.log('Sample social media item:');
        console.log(`  Title: ${socialContent[0].title?.substring(0, 100)}...`);
        console.log(`  Platform: ${socialContent[0].platform}`);
        console.log(`  Published: ${socialContent[0].publishedAt}`);
        if (socialContent[0].socialMetrics) {
          console.log(`  Engagement: ${JSON.stringify(socialContent[0].socialMetrics)}`);
        }
      }
    } catch (error) {
      console.log(`❌ Social media fetch failed: ${error.message}`);
    }
    
    // Test 4: Fetch from all sources
    console.log('\n🌐 Testing all sources combined...');
    try {
      const allContent = await enhancedNewsService.fetchAllSources();
      console.log(`✅ Fetched ${allContent.length} total content items`);
      
      // Group by platform
      const platformCounts = allContent.reduce((acc, item) => {
        const platform = item.platform || 'news';
        acc[platform] = (acc[platform] || 0) + 1;
        return acc;
      }, {});
      
      console.log('Content by platform:');
      Object.entries(platformCounts).forEach(([platform, count]) => {
        console.log(`  - ${platform}: ${count} items`);
      });
    } catch (error) {
      console.log(`❌ All sources fetch failed: ${error.message}`);
    }
    
    // Test 5: Process content into events
    console.log('\n🔄 Testing event processing...');
    try {
      const allContent = await enhancedNewsService.fetchAllSources();
      const events = await enhancedNewsService.processAllContentIntoEvents(allContent.slice(0, 5));
      console.log(`✅ Processed ${events.length} events from ${allContent.length} content items`);
      
      if (events.length > 0) {
        console.log('Sample event:');
        console.log(`  Title: ${events[0].title?.substring(0, 100)}...`);
        console.log(`  Category: ${events[0].category}`);
        console.log(`  Severity: ${events[0].severity}`);
        console.log(`  Platform: ${events[0].platform}`);
        console.log(`  Relevance Score: ${events[0].relevanceScore}`);
        if (events[0].engagement) {
          console.log(`  Engagement: ${events[0].engagement}`);
        }
      }
    } catch (error) {
      console.log(`❌ Event processing failed: ${error.message}`);
    }
    
    // Test 6: Test individual social media platforms
    console.log('\n🔍 Testing individual social media platforms...');
    
    // Test Twitter
    if (enhancedNewsService.socialSources.twitter.enabled) {
      try {
        const twitterContent = await enhancedNewsService.fetchFromTwitter();
        console.log(`✅ Twitter: ${twitterContent.length} tweets`);
      } catch (error) {
        console.log(`❌ Twitter failed: ${error.message}`);
      }
    } else {
      console.log('❌ Twitter: Not configured');
    }
    
    // Test Reddit
    if (enhancedNewsService.socialSources.reddit.enabled) {
      try {
        const redditContent = await enhancedNewsService.fetchFromReddit();
        console.log(`✅ Reddit: ${redditContent.length} posts`);
      } catch (error) {
        console.log(`❌ Reddit failed: ${error.message}`);
      }
    } else {
      console.log('❌ Reddit: Not configured');
    }
    
    
    console.log('\n🎉 Enhanced News Service test completed!');
    console.log('\n📋 Next Steps:');
    console.log('1. Set up API keys in your .env file');
    console.log('2. Start with Reddit (easiest to configure)');
    console.log('3. Add Twitter for real-time updates');
    console.log('4. Consider LinkedIn for professional insights (optional)');
    console.log('5. Deploy to Render with working APIs');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
if (require.main === module) {
  testEnhancedNewsService();
}

module.exports = testEnhancedNewsService;

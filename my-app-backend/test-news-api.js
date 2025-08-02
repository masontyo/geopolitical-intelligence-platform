/**
 * Test script for News API functionality
 * Run this to test your news API setup
 */

require('dotenv').config();
const newsService = require('./services/newsService');

async function testNewsAPI() {
  console.log('🔍 Testing News API Setup...\n');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log(`NEWSAPI_KEY: ${process.env.NEWSAPI_KEY ? '✅ Set' : '❌ Not set'}`);
  console.log(`GNEWS_API_KEY: ${process.env.GNEWS_API_KEY ? '✅ Set' : '❌ Not set'}`);
  console.log(`ALPHA_VANTAGE_API_KEY: ${process.env.ALPHA_VANTAGE_API_KEY ? '✅ Set' : '❌ Not set'}`);
  
  // Check which services are enabled
  console.log('\n🔧 Enabled News Services:');
  console.log(`NewsAPI: ${newsService.newsSources.newsapi.enabled ? '✅ Enabled' : '❌ Disabled'}`);
  console.log(`GNews: ${newsService.newsSources.gnews.enabled ? '✅ Enabled' : '❌ Disabled'}`);
  console.log(`Alpha Vantage: ${newsService.newsSources.alphavantage.enabled ? '✅ Enabled' : '❌ Disabled'}`);
  
  if (!newsService.newsSources.newsapi.enabled && 
      !newsService.newsSources.gnews.enabled && 
      !newsService.newsSources.alphavantage.enabled) {
    console.log('\n❌ No news services are enabled!');
    console.log('Please set at least one API key in your .env file:');
    console.log('- NEWSAPI_KEY (recommended)');
    console.log('- GNEWS_API_KEY');
    console.log('- ALPHA_VANTAGE_API_KEY');
    return;
  }
  
  console.log('\n🚀 Testing News Fetch...');
  
  try {
    // Test fetching latest news
    const newsArticles = await newsService.fetchLatestNews();
    
    console.log(`✅ Successfully fetched ${newsArticles.length} news articles`);
    
    if (newsArticles.length > 0) {
      console.log('\n📰 Sample Articles:');
      newsArticles.slice(0, 3).forEach((article, index) => {
        console.log(`\n${index + 1}. ${article.title}`);
        console.log(`   Source: ${article.source}`);
        console.log(`   Published: ${article.publishedAt}`);
        console.log(`   URL: ${article.url}`);
      });
    }
    
    // Test processing news into events
    console.log('\n🔄 Testing News Processing...');
    const events = await newsService.processNewsIntoEvents(newsArticles.slice(0, 5));
    
    console.log(`✅ Successfully processed ${events.length} events`);
    
    if (events.length > 0) {
      console.log('\n📊 Sample Processed Events:');
      events.slice(0, 2).forEach((event, index) => {
        console.log(`\n${index + 1}. ${event.title}`);
        console.log(`   Category: ${event.category}`);
        console.log(`   Severity: ${event.severity}`);
        console.log(`   Location: ${event.location}`);
        console.log(`   Relevance Score: ${event.relevanceScore}`);
      });
    }
    
    console.log('\n🎉 News API test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ News API test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your API keys are correct');
    console.log('2. Verify your internet connection');
    console.log('3. Check if you have exceeded API rate limits');
  }
}

// Run the test
testNewsAPI().catch(console.error); 
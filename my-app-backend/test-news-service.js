/**
 * Test newsService loading
 */

console.log('🔍 Testing newsService loading...');

try {
  console.log('Loading newsService...');
  const newsService = require('./services/newsService');
  console.log('✅ newsService loaded successfully');
  
  console.log('News sources:', Object.keys(newsService.newsSources));
  console.log('NewsAPI enabled:', newsService.newsSources.newsapi.enabled);
  console.log('GNews enabled:', newsService.newsSources.gnews.enabled);
  console.log('Alpha Vantage enabled:', newsService.newsSources.alphavantage.enabled);
  
} catch (error) {
  console.error('❌ Error loading newsService:', error);
} 
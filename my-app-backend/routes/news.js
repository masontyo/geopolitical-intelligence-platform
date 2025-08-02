const express = require('express');
const router = express.Router();
const newsService = require('../services/newsService');
const notificationService = require('../services/notificationService');

/**
 * GET /api/news/update
 * Manually trigger news update and notification process
 */
router.get('/update', async (req, res) => {
  try {
    console.log('Manual news update triggered');
    
    const savedEvents = await newsService.updateNewsAndNotify();
    
    res.json({
      success: true,
      message: 'News update completed successfully',
      eventsProcessed: savedEvents.length,
      events: savedEvents.map(event => ({
        id: event._id,
        title: event.title,
        category: event.category,
        severity: event.severity,
        location: event.location,
        date: event.date
      }))
    });
    
  } catch (error) {
    console.error('News update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update news',
      error: error.message
    });
  }
});

/**
 * GET /api/news/test
 * Test the news service without saving events
 */
router.get('/test', async (req, res) => {
  try {
    console.log('Testing news service...');
    
    const testResult = await newsService.testNewsService();
    
    res.json({
      success: true,
      message: 'News service test completed',
      result: testResult
    });
    
  } catch (error) {
    console.error('News service test error:', error);
    res.status(500).json({
      success: false,
      message: 'News service test failed',
      error: error.message
    });
  }
});

/**
 * GET /api/news/latest
 * Get the latest news articles (without processing)
 */
router.get('/latest', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    const newsArticles = await newsService.fetchLatestNews();
    const limitedNews = newsArticles.slice(0, limit);
    
    res.json({
      success: true,
      message: 'Latest news fetched successfully',
      count: limitedNews.length,
      articles: limitedNews.map(article => ({
        title: article.title,
        description: article.description,
        source: article.source,
        publishedAt: article.publishedAt,
        url: article.url
      }))
    });
    
  } catch (error) {
    console.error('Fetch latest news error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch latest news',
      error: error.message
    });
  }
});

/**
 * POST /api/news/process
 * Process specific news articles into events
 */
router.post('/process', async (req, res) => {
  try {
    const { articles } = req.body;
    
    if (!articles || !Array.isArray(articles)) {
      return res.status(400).json({
        success: false,
        message: 'Articles array is required'
      });
    }
    
    const events = await newsService.processNewsIntoEvents(articles);
    const savedEvents = await newsService.saveEventsAndNotify(events);
    
    res.json({
      success: true,
      message: 'Articles processed successfully',
      articlesProcessed: articles.length,
      eventsCreated: savedEvents.length,
      events: savedEvents.map(event => ({
        id: event._id,
        title: event.title,
        category: event.category,
        severity: event.severity,
        location: event.location
      }))
    });
    
  } catch (error) {
    console.error('Process articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process articles',
      error: error.message
    });
  }
});

/**
 * GET /api/news/sources
 * Get available news sources and their status
 */
router.get('/sources', (req, res) => {
  const sources = Object.keys(newsService.newsSources).map(key => ({
    name: key,
    enabled: newsService.newsSources[key].enabled,
    configured: !!newsService.newsSources[key].apiKey
  }));
  
  res.json({
    success: true,
    sources
  });
});

/**
 * POST /api/news/test-notification
 * Test notification system with a sample event
 */
router.post('/test-notification', async (req, res) => {
  try {
    const { userProfileId, testEvent } = req.body;
    
    if (!userProfileId) {
      return res.status(400).json({
        success: false,
        message: 'User profile ID is required'
      });
    }
    
    // Use provided test event or create a sample one
    const event = testEvent || {
      title: 'Test Geopolitical Event',
      description: 'This is a test event to verify the notification system',
      location: 'Test Region',
      category: 'Test Category',
      severity: 'Medium',
      date: new Date()
    };
    
    // Test notification service
    const testResult = await notificationService.testEmailConfiguration();
    
    res.json({
      success: true,
      message: 'Notification test completed',
      emailTestResult: testResult,
      testEvent: event
    });
    
  } catch (error) {
    console.error('Test notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Notification test failed',
      error: error.message
    });
  }
});

/**
 * GET /api/news/status
 * Get overall news service status
 */
router.get('/status', async (req, res) => {
  try {
    const sources = Object.keys(newsService.newsSources).map(key => ({
      name: key,
      enabled: newsService.newsSources[key].enabled,
      configured: !!newsService.newsSources[key].apiKey
    }));
    
    const configuredSources = sources.filter(s => s.configured).length;
    const enabledSources = sources.filter(s => s.enabled).length;
    
    res.json({
      success: true,
      status: {
        sources,
        configuredSources,
        enabledSources,
        hasConfiguredSources: configuredSources > 0,
        hasEnabledSources: enabledSources > 0
      }
    });
    
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get status',
      error: error.message
    });
  }
});

/**
 * GET /api/news/fetch-test
 * Test news fetching without database operations
 */
router.get('/fetch-test', async (req, res) => {
  try {
    console.log('Testing news fetching...');
    
    // Check if any news services are enabled
    const enabledServices = Object.entries(newsService.newsSources)
      .filter(([key, service]) => service.enabled)
      .map(([key]) => key);
    
    if (enabledServices.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No news services are enabled. Please set API keys in your .env file.',
        requiredKeys: ['NEWSAPI_KEY', 'GNEWS_API_KEY', 'ALPHA_VANTAGE_API_KEY']
      });
    }
    
    // Fetch latest news
    const newsArticles = await newsService.fetchLatestNews();
    
    // Process a few articles into events (without saving to database)
    const sampleArticles = newsArticles.slice(0, 5);
    const processedEvents = await newsService.processNewsIntoEvents(sampleArticles);
    
    res.json({
      success: true,
      message: 'News fetch test completed successfully',
      enabledServices,
      newsFetched: newsArticles.length,
      eventsProcessed: processedEvents.length,
      sampleArticles: sampleArticles.map(article => ({
        title: article.title,
        description: article.description,
        source: article.source,
        publishedAt: article.publishedAt,
        url: article.url
      })),
      sampleEvents: processedEvents.map(event => ({
        title: event.title,
        category: event.category,
        severity: event.severity,
        location: event.location,
        relevanceScore: event.relevanceScore
      }))
    });
    
  } catch (error) {
    console.error('News fetch test error:', error);
    res.status(500).json({
      success: false,
      message: 'News fetch test failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router; 
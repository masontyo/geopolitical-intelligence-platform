const express = require('express');
const router = express.Router();
const enhancedNewsService = require('../services/enhancedNewsService');
const notificationService = require('../services/notificationService');

/**
 * GET /api/enhanced-news/update
 * Manually trigger enhanced news update (news + social media)
 */
router.get('/update', async (req, res) => {
  try {
    console.log('Enhanced news update triggered');
    
    const savedEvents = await enhancedNewsService.updateAllContentAndNotify();
    
    res.json({
      success: true,
      message: 'Enhanced news update completed successfully',
      eventsProcessed: savedEvents.length,
      events: savedEvents.map(event => ({
        id: event._id,
        title: event.title,
        category: event.category,
        severity: event.severity,
        location: event.location,
        platform: event.platform,
        engagement: event.engagement,
        date: event.date
      }))
    });
    
  } catch (error) {
    console.error('Enhanced news update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update enhanced news',
      error: error.message
    });
  }
});

/**
 * GET /api/enhanced-news/social
 * Get social media content only
 */
router.get('/social', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    
    const socialContent = await enhancedNewsService.fetchSocialMediaContent();
    const limitedContent = socialContent.slice(0, limit);
    
    res.json({
      success: true,
      message: 'Social media content fetched successfully',
      count: limitedContent.length,
      content: limitedContent.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        platform: item.platform,
        source: item.source,
        publishedAt: item.publishedAt,
        socialMetrics: item.socialMetrics,
        url: item.url
      }))
    });
    
  } catch (error) {
    console.error('Social media fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch social media content',
      error: error.message
    });
  }
});

/**
 * GET /api/enhanced-news/twitter
 * Get Twitter content only
 */
router.get('/twitter', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 25;
    
    const twitterContent = await enhancedNewsService.fetchFromTwitter();
    const limitedContent = twitterContent.slice(0, limit);
    
    res.json({
      success: true,
      message: 'Twitter content fetched successfully',
      count: limitedContent.length,
      tweets: limitedContent.map(tweet => ({
        id: tweet.id,
        text: tweet.description,
        author: tweet.author,
        publishedAt: tweet.publishedAt,
        socialMetrics: tweet.socialMetrics,
        url: tweet.url
      }))
    });
    
  } catch (error) {
    console.error('Twitter fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Twitter content',
      error: error.message
    });
  }
});

/**
 * GET /api/enhanced-news/reddit
 * Get Reddit content only
 */
router.get('/reddit', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 25;
    
    const redditContent = await enhancedNewsService.fetchFromReddit();
    const limitedContent = redditContent.slice(0, limit);
    
    res.json({
      success: true,
      message: 'Reddit content fetched successfully',
      count: limitedContent.length,
      posts: limitedContent.map(post => ({
        id: post.id,
        title: post.title,
        content: post.description,
        subreddit: post.subreddit,
        author: post.author,
        publishedAt: post.publishedAt,
        socialMetrics: post.socialMetrics,
        url: post.url
      }))
    });
    
  } catch (error) {
    console.error('Reddit fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Reddit content',
      error: error.message
    });
  }
});


/**
 * GET /api/enhanced-news/sources
 * Get available sources and their status
 */
router.get('/sources', (req, res) => {
  const newsSources = Object.keys(enhancedNewsService.newsSources).map(key => ({
    name: key,
    type: 'news',
    enabled: enhancedNewsService.newsSources[key].enabled,
    configured: !!enhancedNewsService.newsSources[key].apiKey
  }));

  const socialSources = Object.keys(enhancedNewsService.socialSources).map(key => ({
    name: key,
    type: 'social',
    enabled: enhancedNewsService.socialSources[key].enabled,
    configured: !!(enhancedNewsService.socialSources[key].apiKey || 
                   enhancedNewsService.socialSources[key].clientId)
  }));

  res.json({
    success: true,
    sources: [...newsSources, ...socialSources],
    totalSources: newsSources.length + socialSources.length,
    enabledSources: [...newsSources, ...socialSources].filter(s => s.enabled).length
  });
});

/**
 * GET /api/enhanced-news/status
 * Get overall enhanced news service status
 */
router.get('/status', async (req, res) => {
  try {
    const newsSources = Object.keys(enhancedNewsService.newsSources).map(key => ({
      name: key,
      enabled: enhancedNewsService.newsSources[key].enabled,
      configured: !!enhancedNewsService.newsSources[key].apiKey
    }));

    const socialSources = Object.keys(enhancedNewsService.socialSources).map(key => ({
      name: key,
      enabled: enhancedNewsService.socialSources[key].enabled,
      configured: !!(enhancedNewsService.socialSources[key].apiKey || 
                     enhancedNewsService.socialSources[key].clientId)
    }));

    const configuredNewsSources = newsSources.filter(s => s.configured).length;
    const configuredSocialSources = socialSources.filter(s => s.configured).length;
    const enabledNewsSources = newsSources.filter(s => s.enabled).length;
    const enabledSocialSources = socialSources.filter(s => s.enabled).length;
    
    res.json({
      success: true,
      status: {
        newsSources,
        socialSources,
        configuredNewsSources,
        configuredSocialSources,
        enabledNewsSources,
        enabledSocialSources,
        totalConfigured: configuredNewsSources + configuredSocialSources,
        totalEnabled: enabledNewsSources + enabledSocialSources,
        hasConfiguredSources: (configuredNewsSources + configuredSocialSources) > 0,
        hasEnabledSources: (enabledNewsSources + enabledSocialSources) > 0
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
 * GET /api/enhanced-news/test
 * Test the enhanced news service
 */
router.get('/test', async (req, res) => {
  try {
    console.log('Testing enhanced news service...');
    
    // Test news sources
    const newsContent = await enhancedNewsService.fetchLatestNews();
    console.log(`News sources: ${newsContent.length} items`);
    
    // Test social media sources
    const socialContent = await enhancedNewsService.fetchSocialMediaContent();
    console.log(`Social media sources: ${socialContent.length} items`);
    
    // Test all sources
    const allContent = await enhancedNewsService.fetchAllSources();
    console.log(`All sources: ${allContent.length} items`);
    
    // Test event processing
    const events = await enhancedNewsService.processAllContentIntoEvents(allContent.slice(0, 10));
    console.log(`Processed events: ${events.length} items`);
    
    res.json({
      success: true,
      message: 'Enhanced news service test completed',
      results: {
        newsContent: newsContent.length,
        socialContent: socialContent.length,
        totalContent: allContent.length,
        processedEvents: events.length,
        newsSources: Object.keys(enhancedNewsService.newsSources).length,
        socialSources: Object.keys(enhancedNewsService.socialSources).length
      }
    });
    
  } catch (error) {
    console.error('Enhanced news service test error:', error);
    res.status(500).json({
      success: false,
      message: 'Enhanced news service test failed',
      error: error.message
    });
  }
});

/**
 * POST /api/enhanced-news/process
 * Process specific content into events
 */
router.post('/process', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || !Array.isArray(content)) {
      return res.status(400).json({
        success: false,
        message: 'Content array is required'
      });
    }
    
    const events = await enhancedNewsService.processAllContentIntoEvents(content);
    const savedEvents = await enhancedNewsService.saveEventsAndNotify(events);
    
    res.json({
      success: true,
      message: 'Content processed successfully',
      contentProcessed: content.length,
      eventsCreated: savedEvents.length,
      events: savedEvents.map(event => ({
        id: event._id,
        title: event.title,
        category: event.category,
        severity: event.severity,
        location: event.location,
        platform: event.platform,
        engagement: event.engagement
      }))
    });
    
  } catch (error) {
    console.error('Process content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process content',
      error: error.message
    });
  }
});

module.exports = router;

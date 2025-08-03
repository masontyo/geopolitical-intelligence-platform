const express = require('express');
const mongoose = require('mongoose');
const { validateUserProfile, calculateRelevanceScore } = require('../utils/userProfile');
const { scoreEvents, getScoringAnalytics } = require('../utils/advancedScoring');
const LLMScoringEngine = require('../utils/llmScoring');
const UserProfile = require('../models/UserProfile');
const GeopoliticalEvent = require('../models/GeopoliticalEvent');

const router = express.Router();



/**
 * POST /api/user-profile
 * Create or update a user profile
 */
router.post('/user-profile', async (req, res) => {
  try {
    const profile = req.body;
    
    // Validate the profile first (this should work regardless of database connection)
    const validation = validateUserProfile(profile);
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors
      });
    }

    // Check if MongoDB is connected (only for database operations)
    if (mongoose.connection.readyState !== 1) {
      console.error('MongoDB not connected. ReadyState:', mongoose.connection.readyState);
      return res.status(503).json({
        success: false,
        message: 'Database connection not available. Please try again.'
      });
    }
    
    // Check if profile already exists (by name and company)
    const existingProfile = await UserProfile.findOne({ 
      name: profile.name, 
      company: profile.company 
    });
    
    let savedProfile;
    
    if (existingProfile) {
      // Update existing profile
      savedProfile = await UserProfile.findByIdAndUpdate(
        existingProfile._id,
        profile,
        { new: true, runValidators: true }
      );
    } else {
      // Create new profile
      savedProfile = await UserProfile.create(profile);
    }
    
    res.status(200).json({
      success: true,
      message: existingProfile ? 'Profile updated successfully' : 'Profile created successfully',
      profile: savedProfile
    });
    
  } catch (error) {
    console.error('Error creating user profile:', error);
    
    // Provide more specific error messages
    if (error.name === 'MongoNotConnectedError') {
      return res.status(503).json({
        success: false,
        message: 'Database connection lost. Please try again.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/user-profile/:id
 * Get a specific user profile
 */
router.get('/user-profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if the ID is a valid ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    const profile = await UserProfile.findById(id);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    res.status(200).json({
      success: true,
      profile
    });
    
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * GET /api/user-profile/:id/relevant-events
 * Get relevant geopolitical events for a user profile by fetching real-time news and scoring
 */
router.get('/user-profile/:id/relevant-events', async (req, res) => {
  try {
    const { id } = req.params;
    const { threshold = 0.005, includeAnalytics = false } = req.query;
    
    // Check if the ID is a valid ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    const profile = await UserProfile.findById(id);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    // Fetch real-time news from News API
    const axios = require('axios');
    const NEWSAPI_KEY = process.env.NEWSAPI_KEY || '00a28673b0414caabfadd792f7d0b7f8';
    
    console.log(`📰 Fetching real-time news for user ${profile.name}...`);
    
    // Build search query based on user's areas of concern and regions
    const userKeywords = profile.areasOfConcern.map(concern => concern.category.toLowerCase());
    const userRegions = profile.regions.map(region => region.toLowerCase());
    
         // Create a broader, more inclusive search query
     let searchQuery = 'geopolitical OR international OR business OR economy OR trade OR security OR technology OR government OR policy';
     
     // Add user-specific keywords with broader terms
     if (userKeywords.length > 0) {
       const expandedKeywords = userKeywords.map(keyword => {
         // Map specific concerns to broader search terms
         switch (keyword.toLowerCase()) {
           case 'supply chain disruption':
             return 'supply chain OR logistics OR manufacturing OR shipping OR trade';
           case 'cybersecurity threats':
             return 'cybersecurity OR cyber OR security OR technology OR digital';
           case 'regulatory changes':
             return 'regulation OR policy OR law OR government OR compliance';
           case 'geopolitical tensions':
             return 'geopolitical OR international OR diplomacy OR conflict OR tension';
           default:
             return keyword;
         }
       });
       const keywordQuery = expandedKeywords.slice(0, 2).join(' OR '); // Limit to avoid query length issues
       searchQuery += ` OR ${keywordQuery}`;
     }
     
     // Add user-specific regions with broader coverage
     if (userRegions.length > 0) {
       const regionQuery = userRegions.slice(0, 2).join(' OR '); // Limit to avoid query length issues
       searchQuery += ` OR ${regionQuery}`;
     }
    
    // Fetch news articles
    const newsResponse = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: searchQuery,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 100, // Get more articles to have better selection
        apiKey: NEWSAPI_KEY
      }
    });
    
    console.log(`📊 Fetched ${newsResponse.data.articles.length} articles for scoring`);
    
         // Convert news articles to event format and use LLM for intelligent scoring
     console.log('🧠 Using LLM for intelligent event scoring...');
     
     const llmEngine = new LLMScoringEngine();
     const events = [];
     
     // Convert articles to event format with basic categorization
     for (const article of newsResponse.data.articles) {
       try {
         const content = `${article.title} ${article.description || ''} ${article.content || ''}`.toLowerCase();
         
         // Basic categorization (simplified for LLM processing)
         const categories = [];
         if (content.includes('supply') || content.includes('logistics') || content.includes('manufacturing')) {
           categories.push('Supply Chain');
         }
         if (content.includes('cyber') || content.includes('hack') || content.includes('security')) {
           categories.push('Cybersecurity');
         }
         if (content.includes('regulation') || content.includes('policy') || content.includes('law')) {
           categories.push('Regulatory');
         }
         if (content.includes('geopolitical') || content.includes('international') || content.includes('diplomatic')) {
           categories.push('Geopolitical');
         }
         if (categories.length === 0) {
           categories.push('General');
         }
         
         // Basic region detection
         const regions = [];
         if (content.includes('china') || content.includes('asia')) {
           regions.push('Asia-Pacific');
         }
         if (content.includes('europe') || content.includes('eu')) {
           regions.push('Europe');
         }
         if (content.includes('united states') || content.includes('us') || content.includes('america')) {
           regions.push('North America');
         }
         if (regions.length === 0) {
           regions.push('Global');
         }
         
         // Basic severity detection (will be overridden by LLM analysis)
         let severity = 'low';
         
         const event = {
           title: article.title,
           description: article.description || article.content?.substring(0, 500) || '',
           summary: article.description?.substring(0, 200) || article.title,
           eventDate: new Date(article.publishedAt),
           categories: categories,
           regions: regions,
           countries: [],
           severity: severity,
           impact: { economic: 'neutral', political: 'neutral', social: 'neutral' },
           source: {
             name: article.source?.name || 'Unknown Source',
             url: article.url,
             reliability: 'medium'
           },
           tags: [],
           status: 'active'
         };
         
         events.push(event);
       } catch (error) {
         console.error(`Error processing article "${article.title}":`, error.message);
       }
     }
     
     // Use LLM to intelligently score events
     console.log(`🤖 Analyzing ${events.length} events with LLM...`);
     const llmResults = await llmEngine.batchAnalyzeEvents(profile, events, 3); // Process 3 at a time
     
     // Filter and format results
     const scoredEvents = [];
     for (const result of llmResults) {
       const { event, analysis } = result;
       
       if (analysis.relevanceScore >= parseFloat(threshold) && analysis.isRelevant && analysis.isDevelopingEvent) {
         // Apply severity-based scoring boost
         let finalScore = analysis.relevanceScore;
         const severityMultipliers = {
           'critical': 1.5,  // 50% boost for critical events
           'high': 1.3,      // 30% boost for high severity
           'medium': 1.0,    // No boost for medium
           'low': 0.7        // 30% penalty for low severity
         };
         
         if (severityMultipliers[analysis.severity]) {
           finalScore *= severityMultipliers[analysis.severity];
           // Cap the score at 1.0
           finalScore = Math.min(finalScore, 1.0);
         }
         
         scoredEvents.push({
           ...event,
           severity: analysis.severity, // Use LLM-determined severity
           relevanceScore: finalScore,
           rationale: analysis.reasoning,
           contributingFactors: analysis.keyFactors.map(factor => ({
             factor: factor,
             weight: analysis.relevanceScore,
             description: analysis.reasoning
           })),
           confidenceLevel: analysis.confidence,
           isDevelopingEvent: analysis.isDevelopingEvent,
           llmAnalysis: analysis // Include full LLM analysis for debugging
         });
       }
     }
    
         // Sort by relevance score (highest first) and limit results
     const relevantEvents = scoredEvents
       .sort((a, b) => b.relevanceScore - a.relevanceScore)
       .slice(0, 50); // Increased limit to show more relevant events
    
    console.log(`✅ Found ${relevantEvents.length} relevant events for user ${profile.name}`);
    
    const response = {
      success: true,
      events: relevantEvents,
      total: relevantEvents.length,
      scoringMetadata: {
        totalArticlesFetched: newsResponse.data.articles.length,
        totalEventsProcessed: scoredEvents.length,
        eventsAboveThreshold: relevantEvents.length,
        threshold: parseFloat(threshold),
        searchQuery: searchQuery
      }
    };
    
    // Include analytics if requested
    if (includeAnalytics === 'true') {
      response.analytics = getScoringAnalytics(scoredEvents);
    }
    
    res.status(200).json(response);
    
  } catch (error) {
    console.error('Error fetching relevant events:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/events
 * Add a geopolitical event (for testing/manual input)
 */
router.post('/events', async (req, res) => {
  try {
    const event = req.body;
    
    // Basic validation
    if (!event.title || !event.description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }
    
    // Set default event date if not provided
    if (!event.eventDate) {
      event.eventDate = new Date();
    }
    
    const newEvent = await GeopoliticalEvent.create(event);
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event: newEvent
    });
    
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * GET /api/events
 * Get all geopolitical events
 */
router.get('/events', async (req, res) => {
  try {
    console.log('📊 Fetching geopolitical events...');
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.error('MongoDB not connected. ReadyState:', mongoose.connection.readyState);
      return res.status(503).json({
        success: false,
        message: 'Database connection not available. Please try again.'
      });
    }
    
    const events = await GeopoliticalEvent.find().sort({ eventDate: -1 });
    
    console.log(`✅ Found ${events.length} events`);
    
    res.status(200).json({
      success: true,
      events,
      total: events.length
    });
    
  } catch (error) {
    console.error('❌ Error fetching events:', error);
    
    // Provide more specific error messages
    if (error.name === 'MongoNotConnectedError') {
      return res.status(503).json({
        success: false,
        message: 'Database connection lost. Please try again.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/seed-database
 * Seed the database with sample data (for production setup)
 */
router.post('/seed-database', async (req, res) => {
  try {
    console.log('🌱 Starting database seeding...');
    
    const { main } = require('../scripts/seedDatabase');
    await main();
    
    console.log('✅ Database seeding completed successfully');
    
    res.status(200).json({
      success: true,
      message: 'Database seeded successfully with sample data'
    });
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error.message
    });
  }
});

/**
 * GET /api/scoring-analytics/:profileId
 * Get detailed scoring analytics for a user profile
 */
router.get('/scoring-analytics/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;
    const { threshold = 0.05 } = req.query;
    
    const profile = await UserProfile.findById(profileId);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    // Get all events from database
    const allEvents = await GeopoliticalEvent.find({ status: 'active' });
    
    // Use advanced scoring algorithm
    const scoredEvents = scoreEvents(profile, allEvents);
    
    // Get analytics
    const analytics = getScoringAnalytics(scoredEvents);
    
    // Get top scoring events for analysis
    const topEvents = scoredEvents
      .slice(0, 10)
      .map(scoredEvent => ({
        title: scoredEvent.event.title,
        relevanceScore: scoredEvent.relevanceScore,
        rationale: scoredEvent.rationale,
        confidenceLevel: scoredEvent.confidenceLevel,
        topFactors: scoredEvent.contributingFactors
          .sort((a, b) => b.weight - a.weight)
          .slice(0, 3)
      }));
    
    res.status(200).json({
      success: true,
      profile: {
        name: profile.name,
        company: profile.company,
        industry: profile.industry
      },
      analytics,
      topEvents,
      scoringMetadata: {
        totalEventsProcessed: allEvents.length,
        eventsAboveThreshold: scoredEvents.filter(e => e.relevanceScore >= parseFloat(threshold)).length,
        threshold: parseFloat(threshold)
      }
    });
    
  } catch (error) {
    console.error('Error fetching scoring analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * POST /api/test-scoring
 * Test the scoring algorithm with custom profile and events
 */
router.post('/test-scoring', async (req, res) => {
  try {
    const { profile, events, threshold = 0.05 } = req.body;
    
    if (!profile || !events || !Array.isArray(events)) {
      return res.status(400).json({
        success: false,
        message: 'Profile and events array are required'
      });
    }
    
    // Use advanced scoring algorithm
    const scoredEvents = scoreEvents(profile, events);
    
    // Filter by threshold
    const relevantEvents = scoredEvents
      .filter(scoredEvent => scoredEvent.relevanceScore >= parseFloat(threshold))
      .map(scoredEvent => ({
        title: scoredEvent.event.title,
        relevanceScore: scoredEvent.relevanceScore,
        rationale: scoredEvent.rationale,
        confidenceLevel: scoredEvent.confidenceLevel,
        contributingFactors: scoredEvent.contributingFactors
      }));
    
    // Get analytics
    const analytics = getScoringAnalytics(scoredEvents);
    
    res.status(200).json({
      success: true,
      scoredEvents: relevantEvents,
      analytics,
      metadata: {
        totalEventsProcessed: events.length,
        eventsAboveThreshold: relevantEvents.length,
        threshold: parseFloat(threshold)
      }
    });
    
  } catch (error) {
    console.error('Error testing scoring algorithm:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 
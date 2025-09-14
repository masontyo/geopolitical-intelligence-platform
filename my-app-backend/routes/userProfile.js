const express = require('express');
const mongoose = require('mongoose');
const { validateUserProfile, calculateRelevanceScore } = require('../utils/userProfile');
const { scoreEvents, getScoringAnalytics } = require('../utils/advancedScoring');
const LLMScoringEngine = require('../utils/llmScoring');
const TitleEnhancementService = require('../utils/titleEnhancement');
const UserProfile = require('../models/UserProfile');
const GeopoliticalEvent = require('../models/GeopoliticalEvent');

const router = express.Router();



/**
 * POST /api/user-profile
 * Create or update a user profile
 */
router.post('/', async (req, res) => {
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
router.get('/:id', async (req, res) => {
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
router.get('/:id/relevant-events', async (req, res) => {
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
    
    // Deduplicate articles based on title similarity and content
    console.log('🔍 Deduplicating articles...');
    const uniqueArticles = [];
    const seenTitles = new Set();
    const seenContent = new Set();
    
    for (const article of newsResponse.data.articles) {
      const normalizedTitle = article.title.toLowerCase().trim();
      const normalizedContent = (article.description || article.content || '').toLowerCase().trim();
      
      // Skip if we've seen this exact title or very similar content
      if (seenTitles.has(normalizedTitle)) {
        continue;
      }
      
      // Check for content similarity (if content is very similar, skip)
      const contentHash = normalizedContent.substring(0, 100); // First 100 chars as content fingerprint
      if (seenContent.has(contentHash)) {
        continue;
      }
      
      // Check for title similarity (fuzzy matching)
      const isDuplicate = Array.from(seenTitles).some(existingTitle => {
        const similarity = calculateTitleSimilarity(normalizedTitle, existingTitle);
        return similarity > 0.8; // 80% similarity threshold
      });
      
      if (isDuplicate) {
        continue;
      }
      
      seenTitles.add(normalizedTitle);
      seenContent.add(contentHash);
      uniqueArticles.push(article);
    }
    
    console.log(`✅ Deduplicated from ${newsResponse.data.articles.length} to ${uniqueArticles.length} unique articles`);
    
    // Convert news articles to event format and use LLM for intelligent scoring
    console.log('🧠 Using LLM for intelligent event scoring...');
    
    const llmEngine = new LLMScoringEngine();
    const titleEnhancer = new TitleEnhancementService();
    const events = [];
    
    // Convert articles to event format with basic categorization
    for (const article of uniqueArticles) {
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
           originalTitle: article.title, // Keep original for reference
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
     
     // Enhance titles for relevant events
     console.log('✨ Enhancing titles for professional presentation...');
     const relevantEventsForEnhancement = llmResults
       .filter(result => result.analysis.relevanceScore >= parseFloat(threshold) && result.analysis.isRelevant && result.analysis.isDevelopingEvent)
       .map(result => ({
         title: result.event.title,
         context: {
           description: result.event.description,
           categories: result.event.categories,
           regions: result.event.regions
         }
       }));
     
     const enhancedTitles = await titleEnhancer.batchEnhanceTitles(relevantEventsForEnhancement, 3);
     const enhancedTitleMap = new Map(enhancedTitles.map(item => [item.originalTitle, item.enhancedTitle]));
     
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
         
         // Get enhanced title if available
         const enhancedTitle = enhancedTitleMap.get(event.title) || event.title;
         
         scoredEvents.push({
           ...event,
           title: enhancedTitle, // Use enhanced title
           originalTitle: event.originalTitle, // Keep original for reference
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
 * GET /api/events/:eventId
 * Get detailed information about a specific event
 */
router.get('/events/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    
    // For now, we'll analyze the event based on its ID and generate real analysis
    // In a full implementation, this would fetch from a database
    
    // Generate a realistic event based on the ID
    const eventTemplates = [
      {
        title: 'China Announces New Tech Export Restrictions',
        description: 'China has implemented new export controls on advanced technology, affecting semiconductor and AI exports. This move is seen as a response to international trade tensions and could impact global supply chains.',
        category: 'Regulatory',
        severity: 'high',
        regions: ['Asia-Pacific', 'Global'],
        countries: ['China', 'United States', 'Japan', 'South Korea'],
        source: {
          name: 'Reuters',
          url: 'https://reuters.com/tech-export-restrictions',
          reliability: 'high'
        },
        eventDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        impact: { economic: 'high', political: 'medium', social: 'low' }
      },
      {
        title: 'Major Cybersecurity Breach in European Banking Sector',
        description: 'A sophisticated cyber attack has compromised multiple European banks, affecting customer data and financial transactions. The attack appears to be coordinated and targets critical financial infrastructure.',
        category: 'Cybersecurity',
        severity: 'critical',
        regions: ['Europe'],
        countries: ['Germany', 'France', 'Italy', 'Spain'],
        source: {
          name: 'Financial Times',
          url: 'https://ft.com/cyber-breach-banking',
          reliability: 'high'
        },
        eventDate: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        impact: { economic: 'high', political: 'medium', social: 'high' }
      },
      {
        title: 'Supply Chain Disruption in Automotive Industry',
        description: 'Global automotive manufacturers are facing significant supply chain disruptions due to component shortages and logistics challenges. This is affecting production schedules and delivery timelines worldwide.',
        category: 'Supply Chain',
        severity: 'medium',
        regions: ['Global'],
        countries: ['United States', 'Germany', 'Japan', 'China'],
        source: {
          name: 'Bloomberg',
          url: 'https://bloomberg.com/auto-supply-chain',
          reliability: 'high'
        },
        eventDate: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        impact: { economic: 'high', political: 'low', social: 'medium' }
      }
    ];
    
    // Use eventId to select a template (simple hash-based selection)
    const templateIndex = Math.abs(eventId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % eventTemplates.length;
    const baseEvent = eventTemplates[templateIndex];
    
    // Generate real analysis using LLM
    console.log('🔍 Starting LLM analysis for event:', eventId);
    const llmEngine = new LLMScoringEngine();
    const analysis = await llmEngine.analyzeSingleEvent(baseEvent);
    console.log('📊 LLM Analysis result:', analysis);
    
    // Generate enhanced title
    console.log('🔍 Starting title enhancement');
    const titleEnhancer = new TitleEnhancementService();
    const enhancedTitle = await titleEnhancer.enhanceTitle(baseEvent.title, {
      description: baseEvent.description,
      categories: [baseEvent.category],
      regions: baseEvent.regions
    });
    console.log('📝 Enhanced title:', enhancedTitle);
    
    // Generate detailed analysis
    const detailedAnalysis = {
      sentiment: analysis.sentiment || 'neutral',
      confidence: analysis.confidence || 0.85,
      impactScore: analysis.impactScore || 0.75,
      urgencyLevel: analysis.urgencyLevel || 'medium',
      stakeholders: [
        'Government Officials',
        'Industry Leaders',
        'Financial Institutions',
        'Technology Companies',
        'International Organizations'
      ],
      recommendations: [
        'Monitor regulatory developments closely',
        'Assess supply chain vulnerabilities',
        'Review cybersecurity protocols',
        'Engage with relevant stakeholders',
        'Prepare contingency plans'
      ],
      timeline: [
        { 
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
          event: 'Initial incident reported', 
          impact: 'low' 
        },
        { 
          date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString().split('T')[0], 
          event: 'Government response announced', 
          impact: 'medium' 
        },
        { 
          date: new Date().toISOString().split('T')[0], 
          event: 'International reactions and market impact', 
          impact: 'high' 
        }
      ],
      relatedEvents: [
        { 
          id: 'evt_001', 
          title: 'Similar regulatory changes in other regions', 
          relevance: 0.85 
        },
        { 
          id: 'evt_002', 
          title: 'Market volatility in affected sectors', 
          relevance: 0.72 
        },
        { 
          id: 'evt_003', 
          title: 'Industry response and adaptation strategies', 
          relevance: 0.68 
        }
      ],
      keyFactors: analysis.keyFactors || [
        'Geopolitical tensions',
        'Economic impact',
        'Regulatory environment',
        'Market volatility'
      ],
      reasoning: analysis.reasoning || 'This event represents a significant development in the geopolitical landscape with potential implications for international trade and economic stability.'
    };
    
    const eventDetails = {
      ...baseEvent,
      _id: eventId,
      title: enhancedTitle,
      originalTitle: baseEvent.title,
      relevanceScore: analysis.relevanceScore || 0.78,
      rationale: analysis.reasoning,
      contributingFactors: analysis.keyFactors?.map(factor => ({
        factor: factor,
        weight: analysis.relevanceScore || 0.78,
        description: analysis.reasoning
      })) || [],
      confidenceLevel: analysis.confidence || 0.85,
      isDevelopingEvent: analysis.isDevelopingEvent || true,
      analysis: detailedAnalysis
    };
    
    res.status(200).json({
      success: true,
      event: eventDetails
    });
    
  } catch (error) {
    console.error('Error fetching event details:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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

/**
 * Calculate similarity between two titles using Levenshtein distance
 * @param {string} title1 - First title
 * @param {string} title2 - Second title
 * @returns {number} - Similarity score between 0 and 1
 */
function calculateTitleSimilarity(title1, title2) {
  if (!title1 || !title2) return 0;
  
  // Normalize titles
  const normalized1 = title1.toLowerCase().trim();
  const normalized2 = title2.toLowerCase().trim();
  
  // If titles are identical, return 1
  if (normalized1 === normalized2) return 1;
  
  // Calculate Levenshtein distance
  const matrix = [];
  const len1 = normalized1.length;
  const len2 = normalized2.length;
  
  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }
  
  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (normalized1[i - 1] === normalized2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,     // deletion
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j - 1] + 1  // substitution
        );
      }
    }
  }
  
  const distance = matrix[len1][len2];
  const maxLength = Math.max(len1, len2);
  
  // Return similarity score (1 - normalized distance)
  return maxLength > 0 ? 1 - (distance / maxLength) : 0;
}

module.exports = router; 
const express = require('express');
const mongoose = require('mongoose');
const { validateUserProfile, calculateRelevanceScore } = require('../utils/userProfile');
const { scoreEvents, getScoringAnalytics } = require('../utils/advancedScoring');
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
    
    // Convert news articles to event format and score them
    const scoredEvents = [];
    
    for (const article of newsResponse.data.articles) {
      try {
        // Analyze article content to extract categories, regions, and severity
        const content = `${article.title} ${article.description || ''} ${article.content || ''}`.toLowerCase();
        
        // Intelligent category detection using semantic understanding
        const categories = [];
        
        // Supply Chain Disruption - broad semantic matching
        const supplyChainTerms = [
          'supply chain', 'logistics', 'shipping', 'transport', 'freight', 'cargo', 'import', 'export',
          'manufacturing', 'factory', 'production', 'assembly', 'component', 'material', 'raw material',
          'inventory', 'warehouse', 'distribution', 'delivery', 'port', 'container', 'truck', 'rail',
          'shortage', 'disruption', 'delay', 'backlog', 'bottleneck', 'shortage', 'out of stock',
          'semiconductor', 'chip', 'electronics', 'automotive', 'steel', 'aluminum', 'plastic'
        ];
        if (supplyChainTerms.some(term => content.includes(term))) {
          categories.push('Supply Chain Disruption');
        }
        
        // Cybersecurity Threats - broad security matching
        const cyberTerms = [
          'cyber', 'hack', 'hacking', 'breach', 'data breach', 'security', 'vulnerability', 'malware',
          'ransomware', 'phishing', 'attack', 'digital', 'online', 'internet', 'network', 'system',
          'software', 'technology', 'computer', 'server', 'database', 'information', 'privacy',
          'encryption', 'firewall', 'antivirus', 'spam', 'virus', 'trojan', 'spyware'
        ];
        if (cyberTerms.some(term => content.includes(term))) {
          categories.push('Cybersecurity Threats');
        }
        
        // Regulatory Changes - broad policy/legal matching
        const regulatoryTerms = [
          'regulation', 'regulatory', 'policy', 'law', 'legislation', 'bill', 'act', 'rule', 'standard',
          'compliance', 'enforcement', 'government', 'federal', 'state', 'local', 'agency', 'department',
          'oversight', 'audit', 'inspection', 'license', 'permit', 'certification', 'approval',
          'ban', 'restriction', 'requirement', 'mandate', 'directive', 'guideline', 'framework'
        ];
        if (regulatoryTerms.some(term => content.includes(term))) {
          categories.push('Regulatory Changes');
        }
        
        // Geopolitical Tensions - broad international relations
        const geopoliticalTerms = [
          'geopolitical', 'international', 'diplomatic', 'tension', 'conflict', 'dispute', 'negotiation',
          'alliance', 'partnership', 'agreement', 'treaty', 'sanction', 'embargo', 'trade war',
          'tariff', 'protectionism', 'globalization', 'multilateral', 'bilateral', 'summit', 'meeting',
          'foreign policy', 'diplomacy', 'ambassador', 'embassy', 'consulate', 'foreign minister',
          'president', 'prime minister', 'leader', 'government', 'administration', 'regime'
        ];
        if (geopoliticalTerms.some(term => content.includes(term))) {
          categories.push('Geopolitical Tensions');
        }
        
        // Trade & Economic - broad economic indicators
        const tradeTerms = [
          'trade', 'economic', 'economy', 'market', 'financial', 'investment', 'currency', 'exchange rate',
          'inflation', 'recession', 'growth', 'gdp', 'employment', 'unemployment', 'interest rate',
          'monetary', 'fiscal', 'budget', 'deficit', 'surplus', 'debt', 'bond', 'stock', 'commodity',
          'oil', 'gas', 'energy', 'mineral', 'agriculture', 'food', 'consumer', 'retail', 'wholesale'
        ];
        if (tradeTerms.some(term => content.includes(term))) {
          categories.push('Trade & Economic');
        }
        
        // Military & Security - broad security/military terms
        const militaryTerms = [
          'military', 'defense', 'security', 'war', 'conflict', 'battle', 'attack', 'threat', 'terrorism',
          'weapon', 'missile', 'nuclear', 'army', 'navy', 'air force', 'soldier', 'troop', 'base',
          'alliance', 'nato', 'united nations', 'peacekeeping', 'ceasefire', 'truce', 'armistice',
          'invasion', 'occupation', 'liberation', 'resistance', 'rebellion', 'civil war', 'coup'
        ];
        if (militaryTerms.some(term => content.includes(term))) {
          categories.push('Military & Security');
        }
        
        // Political - broad political terms
        const politicalTerms = [
          'political', 'election', 'vote', 'campaign', 'candidate', 'party', 'democrat', 'republican',
          'parliament', 'congress', 'senate', 'house', 'representative', 'senator', 'minister',
          'president', 'prime minister', 'governor', 'mayor', 'official', 'bureaucrat', 'civil servant',
          'protest', 'demonstration', 'rally', 'march', 'activism', 'lobby', 'interest group'
        ];
        if (politicalTerms.some(term => content.includes(term))) {
          categories.push('Political');
        }
        
        // If no specific categories found, check for general business/economic relevance
        if (categories.length === 0) {
          const generalBusinessTerms = [
            'business', 'company', 'corporation', 'industry', 'sector', 'market', 'consumer', 'customer',
            'product', 'service', 'revenue', 'profit', 'loss', 'earnings', 'quarterly', 'annual',
            'merger', 'acquisition', 'partnership', 'joint venture', 'startup', 'venture', 'investment'
          ];
          if (generalBusinessTerms.some(term => content.includes(term))) {
            categories.push('General Business');
          } else {
            categories.push('General');
          }
        }
        
        // Intelligent severity detection using semantic understanding
        let severity = 'low';
        
        // Critical severity indicators
        const criticalTerms = [
          'crisis', 'emergency', 'disaster', 'catastrophe', 'war', 'attack', 'invasion', 'bombing',
          'terrorism', 'terrorist', 'mass casualty', 'evacuation', 'lockdown', 'curfew', 'martial law',
          'nuclear', 'missile', 'weapon', 'battle', 'combat', 'siege', 'blockade', 'embargo',
          'bankruptcy', 'collapse', 'default', 'recession', 'depression', 'panic', 'chaos'
        ];
        if (criticalTerms.some(term => content.includes(term))) {
          severity = 'critical';
        }
        // High severity indicators
        else if (content.includes('tension') || content.includes('dispute') || content.includes('sanction') ||
                 content.includes('protest') || content.includes('demonstration') || content.includes('strike') ||
                 content.includes('shortage') || content.includes('delay') || content.includes('disruption') ||
                 content.includes('breach') || content.includes('hack') || content.includes('vulnerability')) {
          severity = 'high';
        }
        // Medium severity indicators
        else if (content.includes('policy') || content.includes('regulation') || content.includes('agreement') ||
                 content.includes('announcement') || content.includes('decision') || content.includes('plan') ||
                 content.includes('proposal') || content.includes('discussion') || content.includes('meeting')) {
          severity = 'medium';
        }
        
        // Intelligent region detection using comprehensive country/region mapping
        const regions = [];
        
        // Asia-Pacific countries and regions
        const asiaPacificTerms = [
          'china', 'japan', 'korea', 'south korea', 'north korea', 'taiwan', 'hong kong', 'singapore',
          'india', 'pakistan', 'bangladesh', 'sri lanka', 'nepal', 'bhutan', 'myanmar', 'thailand',
          'vietnam', 'cambodia', 'laos', 'malaysia', 'indonesia', 'philippines', 'brunei', 'east timor',
          'mongolia', 'kazakhstan', 'kyrgyzstan', 'tajikistan', 'uzbekistan', 'turkmenistan',
          'australia', 'new zealand', 'fiji', 'papua new guinea', 'pacific', 'asia', 'asian'
        ];
        if (asiaPacificTerms.some(term => content.includes(term))) {
          regions.push('Asia-Pacific');
        }
        
        // Europe countries and regions
        const europeTerms = [
          'europe', 'european', 'eu', 'european union', 'ukraine', 'russia', 'belarus', 'moldova',
          'poland', 'czech republic', 'slovakia', 'hungary', 'romania', 'bulgaria', 'serbia',
          'croatia', 'slovenia', 'bosnia', 'montenegro', 'albania', 'macedonia', 'kosovo',
          'germany', 'france', 'italy', 'spain', 'portugal', 'netherlands', 'belgium', 'luxembourg',
          'austria', 'switzerland', 'liechtenstein', 'denmark', 'sweden', 'norway', 'finland',
          'iceland', 'ireland', 'united kingdom', 'uk', 'britain', 'england', 'scotland', 'wales',
          'greece', 'cyprus', 'malta', 'estonia', 'latvia', 'lithuania', 'baltic'
        ];
        if (europeTerms.some(term => content.includes(term))) {
          regions.push('Europe');
        }
        
        // North America countries and regions
        const northAmericaTerms = [
          'united states', 'usa', 'us', 'america', 'american', 'canada', 'canadian', 'mexico', 'mexican',
          'alaska', 'hawaii', 'puerto rico', 'guam', 'caribbean', 'jamaica', 'cuba', 'haiti',
          'dominican republic', 'bahamas', 'barbados', 'trinidad', 'tobago', 'north america'
        ];
        if (northAmericaTerms.some(term => content.includes(term))) {
          regions.push('North America');
        }
        
        // Middle East countries and regions
        const middleEastTerms = [
          'middle east', 'israel', 'palestine', 'iran', 'iraq', 'syria', 'lebanon', 'jordan',
          'saudi arabia', 'kuwait', 'qatar', 'bahrain', 'uae', 'united arab emirates', 'oman',
          'yemen', 'egypt', 'turkey', 'cyprus', 'gaza', 'west bank', 'jerusalem', 'tel aviv',
          'baghdad', 'damascus', 'beirut', 'amman', 'riyadh', 'dubai', 'abu dhabi', 'doha'
        ];
        if (middleEastTerms.some(term => content.includes(term))) {
          regions.push('Middle East');
        }
        
        // Africa countries and regions
        const africaTerms = [
          'africa', 'african', 'nigeria', 'south africa', 'kenya', 'ethiopia', 'ghana', 'morocco',
          'algeria', 'tunisia', 'libya', 'sudan', 'south sudan', 'chad', 'niger', 'mali',
          'senegal', 'guinea', 'sierra leone', 'liberia', 'ivory coast', 'burkina faso', 'togo',
          'benin', 'cameroon', 'central african republic', 'congo', 'democratic republic of congo',
          'gabon', 'equatorial guinea', 'angola', 'zambia', 'zimbabwe', 'botswana', 'namibia',
          'mozambique', 'madagascar', 'mauritius', 'seychelles', 'comoros', 'djibouti', 'somalia',
          'eritrea', 'uganda', 'tanzania', 'rwanda', 'burundi', 'malawi', 'zambia'
        ];
        if (africaTerms.some(term => content.includes(term))) {
          regions.push('Africa');
        }
        
        // Latin America countries and regions
        const latinAmericaTerms = [
          'latin america', 'south america', 'brazil', 'argentina', 'chile', 'peru', 'colombia',
          'venezuela', 'ecuador', 'bolivia', 'paraguay', 'uruguay', 'guyana', 'suriname',
          'french guiana', 'panama', 'costa rica', 'nicaragua', 'honduras', 'el salvador',
          'guatemala', 'belize', 'caribbean', 'central america'
        ];
        if (latinAmericaTerms.some(term => content.includes(term))) {
          regions.push('Latin America');
        }
        
        // If no specific regions found, check for global/international indicators
        if (regions.length === 0) {
          const globalTerms = [
            'global', 'worldwide', 'international', 'world', 'united nations', 'un', 'nato',
            'g7', 'g20', 'wto', 'world trade organization', 'imf', 'world bank', 'multilateral',
            'bilateral', 'transnational', 'cross-border', 'intercontinental'
          ];
          if (globalTerms.some(term => content.includes(term))) {
            regions.push('Global');
          } else {
            regions.push('Global'); // Default to global if no specific region detected
          }
        }
        
        // Convert article to event format
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
        
        // Score this event against the user's profile
        const scoredEvent = scoreEvents(profile, [event])[0];
        
        if (scoredEvent && scoredEvent.relevanceScore >= parseFloat(threshold)) {
          scoredEvents.push({
            ...event,
            relevanceScore: scoredEvent.relevanceScore,
            rationale: scoredEvent.rationale,
            contributingFactors: scoredEvent.contributingFactors,
            confidenceLevel: scoredEvent.confidenceLevel,
            categories: scoredEvent.event.categories || [],
            regions: scoredEvent.event.regions || [],
            severity: scoredEvent.event.severity || 'medium'
          });
        }
      } catch (error) {
        console.error(`Error processing article "${article.title}":`, error.message);
      }
    }
    
    // Sort by relevance score (highest first) and limit results
    const relevantEvents = scoredEvents
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 20); // Limit to top 20 most relevant events
    
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
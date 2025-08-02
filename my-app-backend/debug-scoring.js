const mongoose = require('mongoose');
const axios = require('axios');
const { scoreEvents } = require('./utils/advancedScoring');
const UserProfile = require('./models/UserProfile');

const NEWSAPI_KEY = '00a28673b0414caabfadd792f7d0b7f8';

async function debugScoring() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://masonthomas00:Mohamilton1@geopcluster.xwxx76q.mongodb.net/?retryWrites=true&w=majority&appName=geopcluster');
    console.log('✅ Connected to MongoDB');
    
    // Get the user profile
    const profile = await UserProfile.findById('688cc58d2bf6fd05d88af31f');
    console.log('📋 User Profile:', {
      name: profile.name,
      areasOfConcern: profile.areasOfConcern.map(c => c.category),
      regions: profile.regions,
      businessUnits: profile.businessUnits.map(b => b.name)
    });
    
    // Fetch some news articles
    console.log('📰 Fetching news articles...');
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'geopolitical OR sanctions OR trade war OR military conflict',
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 5,
        apiKey: NEWSAPI_KEY
      }
    });
    
    console.log(`📊 Fetched ${response.data.articles.length} articles`);
    
    // Convert first article to event format
    const article = response.data.articles[0];
    console.log('📄 Sample article:', article.title);
    
    // Analyze article content to extract categories, regions, and severity
    const content = `${article.title} ${article.description || ''} ${article.content || ''}`.toLowerCase();
    
    // Determine categories based on content
    const categories = [];
    if (content.includes('trade') || content.includes('tariff') || content.includes('sanction')) {
      categories.push('Trade & Economic');
    }
    if (content.includes('military') || content.includes('conflict') || content.includes('war')) {
      categories.push('Military & Security');
    }
    if (content.includes('election') || content.includes('political') || content.includes('regime')) {
      categories.push('Political');
    }
    if (content.includes('cyber') || content.includes('hack') || content.includes('digital')) {
      categories.push('Cybersecurity');
    }
    if (content.includes('supply chain') || content.includes('logistics')) {
      categories.push('Supply Chain');
    }
    if (categories.length === 0) {
      categories.push('General');
    }
    
    // Determine severity based on keywords
    let severity = 'low';
    if (content.includes('crisis') || content.includes('war') || content.includes('attack') || content.includes('conflict')) {
      severity = 'critical';
    } else if (content.includes('tension') || content.includes('dispute') || content.includes('sanction')) {
      severity = 'high';
    } else if (content.includes('policy') || content.includes('regulation') || content.includes('agreement')) {
      severity = 'medium';
    }
    
    // Extract regions based on content
    const regions = [];
    if (content.includes('china') || content.includes('asia') || content.includes('japan') || content.includes('korea')) {
      regions.push('Asia-Pacific');
    }
    if (content.includes('europe') || content.includes('eu') || content.includes('ukraine') || content.includes('russia')) {
      regions.push('Europe');
    }
    if (content.includes('united states') || content.includes('us') || content.includes('usa') || content.includes('canada')) {
      regions.push('North America');
    }
    if (content.includes('middle east') || content.includes('iran') || content.includes('israel')) {
      regions.push('Middle East');
    }
    if (content.includes('africa') || content.includes('nigeria') || content.includes('south africa')) {
      regions.push('Africa');
    }
    if (regions.length === 0) {
      regions.push('Global');
    }
    
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
    
    console.log('🔄 Testing scoring algorithm...');
    console.log('Event to score:', {
      title: event.title,
      description: event.description.substring(0, 100) + '...',
      categories: event.categories,
      regions: event.regions,
      severity: event.severity
    });
    
    // Test the scoring with a very low threshold
    console.log('🔍 Testing scoring with low threshold...');
    
    // Temporarily modify the scoring config to see what's happening
    const { scoreEvents, SCORING_CONFIG } = require('./utils/advancedScoring');
    
    // Test with a much lower threshold
    const originalThreshold = SCORING_CONFIG.thresholds.minimumScore;
    SCORING_CONFIG.thresholds.minimumScore = 0.001; // Very low threshold
    
    const scoredEvents = scoreEvents(profile, [event]);
    console.log('📊 Scoring results with low threshold:', scoredEvents);
    
    // Restore original threshold
    SCORING_CONFIG.thresholds.minimumScore = originalThreshold;
    
    if (scoredEvents.length > 0) {
      const scoredEvent = scoredEvents[0];
      console.log('✅ Scoring successful!');
      console.log('Relevance Score:', scoredEvent.relevanceScore);
      console.log('Rationale:', scoredEvent.rationale);
      console.log('Contributing Factors:', scoredEvent.contributingFactors);
    } else {
      console.log('❌ Scoring failed - no results returned');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('API Error:', error.response.data);
    }
  } finally {
    await mongoose.disconnect();
  }
}

debugScoring(); 
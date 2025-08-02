const mongoose = require('mongoose');
const axios = require('axios');
const GeopoliticalEvent = require('./models/GeopoliticalEvent');
require('dotenv').config();

const NEWSAPI_KEY = '00a28673b0414caabfadd792f7d0b7f8';

// Geopolitical keywords to search for
const geopoliticalKeywords = [
  'sanctions', 'trade war', 'tariffs', 'embargo', 'political instability',
  'regime change', 'election', 'protest', 'civil unrest', 'military conflict',
  'border dispute', 'territorial', 'diplomatic', 'treaty', 'alliance',
  'nuclear', 'missile', 'cyber attack', 'hacking', 'espionage',
  'supply chain', 'logistics', 'shipping', 'ports', 'trade route',
  'currency', 'inflation', 'economic crisis', 'recession', 'market crash',
  'regulation', 'policy change', 'legislation', 'compliance', 'enforcement',
  'geopolitical', 'international relations', 'foreign policy', 'trade dispute'
];

async function connectToDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://masonthomas00:Mohamilton1@geopcluster.xwxx76q.mongodb.net/?retryWrites=true&w=majority&appName=geopcluster';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

async function fetchRealNews() {
  try {
    console.log('📰 Fetching real news from News API...');
    
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'geopolitical OR sanctions OR trade war OR military conflict OR cyber attack',
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 50,
        apiKey: NEWSAPI_KEY
      }
    });
    
    console.log(`✅ Fetched ${response.data.articles.length} articles`);
    return response.data.articles;
    
  } catch (error) {
    console.error('❌ Error fetching news:', error.response?.data || error.message);
    return [];
  }
}

function analyzeArticle(article) {
  const content = `${article.title} ${article.description || ''} ${article.content || ''}`.toLowerCase();
  
  // Determine category based on content
  let category = 'General';
  if (content.includes('trade') || content.includes('tariff') || content.includes('sanction')) {
    category = 'Trade & Economic';
  } else if (content.includes('military') || content.includes('conflict') || content.includes('war')) {
    category = 'Military & Security';
  } else if (content.includes('election') || content.includes('political') || content.includes('regime')) {
    category = 'Political';
  } else if (content.includes('cyber') || content.includes('hack') || content.includes('digital')) {
    category = 'Cybersecurity';
  } else if (content.includes('supply chain') || content.includes('logistics')) {
    category = 'Supply Chain';
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
  
  // Extract location/regions
  const regions = [];
  const locationKeywords = {
    'Asia-Pacific': ['china', 'japan', 'korea', 'india', 'southeast asia', 'asia'],
    'Europe': ['europe', 'eu', 'ukraine', 'russia', 'germany', 'france'],
    'North America': ['united states', 'us', 'usa', 'canada', 'mexico'],
    'Middle East': ['middle east', 'iran', 'israel', 'saudi arabia', 'syria'],
    'Africa': ['africa', 'nigeria', 'south africa', 'kenya'],
    'South America': ['south america', 'brazil', 'argentina', 'chile']
  };
  
  Object.entries(locationKeywords).forEach(([region, keywords]) => {
    if (keywords.some(keyword => content.includes(keyword))) {
      regions.push(region);
    }
  });
  
  if (regions.length === 0) {
    regions.push('Global');
  }
  
  // Calculate relevance score (simple algorithm)
  let relevanceScore = 0.3; // Base score
  if (severity === 'critical') relevanceScore += 0.4;
  if (severity === 'high') relevanceScore += 0.3;
  if (severity === 'medium') relevanceScore += 0.2;
  
  // Boost score for geopolitical keywords
  const geopoliticalMatches = geopoliticalKeywords.filter(keyword => 
    content.includes(keyword)
  ).length;
  relevanceScore += Math.min(geopoliticalMatches * 0.1, 0.3);
  
  // Ensure relevanceScore is a valid number
  if (isNaN(relevanceScore)) {
    relevanceScore = 0.3; // Default fallback
  }
  
  return {
    category,
    severity,
    regions,
    relevanceScore: Math.min(Math.max(relevanceScore, 0), 1.0)
  };
}

async function convertArticleToEvent(article) {
  const analysis = analyzeArticle(article);
  
  return {
    title: article.title,
    description: article.description || article.content?.substring(0, 500) || '',
    summary: article.description?.substring(0, 200) || article.title,
    eventDate: new Date(article.publishedAt),
    categories: [analysis.category],
    regions: analysis.regions,
    countries: [], // Could be extracted with more sophisticated NLP
    severity: analysis.severity,
    impact: {
      economic: 'neutral',
      political: 'neutral', 
      social: 'neutral'
    },
    source: {
      name: article.source?.name || 'Unknown Source',
      url: article.url,
      reliability: 'medium'
    },
    tags: geopoliticalKeywords.filter(keyword => 
      `${article.title} ${article.description || ''}`.toLowerCase().includes(keyword)
    ).slice(0, 5),
    status: 'active',
    relevanceScore: analysis.relevanceScore
  };
}

async function clearAndPopulateWithRealNews() {
  try {
    console.log('🗑️  Clearing existing events...');
    await GeopoliticalEvent.deleteMany({});
    
    console.log('📰 Fetching real news...');
    const articles = await fetchRealNews();
    
    if (articles.length === 0) {
      console.log('❌ No articles found');
      return;
    }
    
    console.log('🔄 Converting articles to events...');
    const events = [];
    
    for (const article of articles) {
      try {
        const event = await convertArticleToEvent(article);
        events.push(event);
      } catch (error) {
        console.error(`Error converting article "${article.title}":`, error.message);
      }
    }
    
    console.log(`📝 Creating ${events.length} events in database...`);
    const savedEvents = await GeopoliticalEvent.insertMany(events);
    
    console.log(`✅ Successfully created ${savedEvents.length} real events!`);
    
    // Show sample events
    console.log('\n📊 Sample Events Created:');
    savedEvents.slice(0, 5).forEach((event, index) => {
      console.log(`${index + 1}. ${event.title}`);
      console.log(`   Category: ${event.categories.join(', ')}`);
      console.log(`   Severity: ${event.severity}`);
      console.log(`   Regions: ${event.regions.join(', ')}`);
      console.log(`   Source: ${event.source.name}`);
      console.log(`   Relevance Score: ${(event.relevanceScore * 100).toFixed(1)}%`);
      console.log('---');
    });
    
    return savedEvents;
    
  } catch (error) {
    console.error('❌ Error populating with real news:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting real news population...');
  
  try {
    await connectToDatabase();
    await clearAndPopulateWithRealNews();
    
    console.log('\n✅ Database populated with REAL news events!');
    console.log('🎯 These are actual geopolitical events from the News API.');
    
  } catch (error) {
    console.error('❌ Population failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, fetchRealNews, convertArticleToEvent }; 
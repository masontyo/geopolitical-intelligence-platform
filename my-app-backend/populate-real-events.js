const mongoose = require('mongoose');
const GeopoliticalEvent = require('./models/GeopoliticalEvent');
require('dotenv').config();

// More realistic and varied geopolitical events
const realisticEvents = [
  {
    title: "Russia-Ukraine Conflict Escalation",
    description: "Recent military movements and diplomatic tensions indicate potential escalation in the ongoing conflict between Russia and Ukraine, affecting European energy markets and global supply chains.",
    summary: "Escalating tensions in Eastern Europe impact global energy and trade",
    eventDate: new Date('2024-12-15'),
    categories: ['Military Conflict', 'Energy Security', 'Trade Disruption'],
    regions: ['Europe', 'Eastern Europe'],
    countries: ['Russia', 'Ukraine', 'Poland', 'Germany'],
    severity: 'critical',
    impact: { economic: 'negative', political: 'negative', social: 'negative' },
    source: { name: 'BBC News', url: 'https://bbc.com/news/world-europe', reliability: 'high' },
    tags: ['russia-ukraine', 'military', 'energy', 'europe'],
    status: 'active'
  },
  {
    title: "China's Belt and Road Initiative Expansion",
    description: "China announces new infrastructure projects across Southeast Asia and Africa, expanding its global economic influence and creating new trade corridors.",
    summary: "China expands global infrastructure and trade network",
    eventDate: new Date('2024-12-10'),
    categories: ['Infrastructure', 'Trade', 'Economic Development'],
    regions: ['Asia-Pacific', 'Africa', 'Southeast Asia'],
    countries: ['China', 'Indonesia', 'Kenya', 'Pakistan'],
    severity: 'medium',
    impact: { economic: 'positive', political: 'neutral', social: 'positive' },
    source: { name: 'Reuters', url: 'https://reuters.com/business', reliability: 'high' },
    tags: ['belt-road', 'infrastructure', 'china', 'trade'],
    status: 'active'
  },
  {
    title: "US Federal Reserve Interest Rate Decision",
    description: "Federal Reserve announces significant changes to monetary policy, affecting global financial markets and currency exchange rates worldwide.",
    summary: "Major US monetary policy changes impact global markets",
    eventDate: new Date('2024-12-12'),
    categories: ['Monetary Policy', 'Financial Markets', 'Currency'],
    regions: ['North America', 'Global'],
    countries: ['United States'],
    severity: 'high',
    impact: { economic: 'neutral', political: 'neutral', social: 'neutral' },
    source: { name: 'Financial Times', url: 'https://ft.com/markets', reliability: 'high' },
    tags: ['federal-reserve', 'interest-rates', 'monetary-policy', 'us'],
    status: 'active'
  },
  {
    title: "Middle East Peace Talks Breakthrough",
    description: "Historic agreement reached between regional powers, potentially stabilizing the Middle East and opening new economic opportunities in the region.",
    summary: "Major diplomatic breakthrough in Middle East peace process",
    eventDate: new Date('2024-12-08'),
    categories: ['Diplomacy', 'Peace Process', 'Regional Cooperation'],
    regions: ['Middle East'],
    countries: ['Israel', 'Saudi Arabia', 'UAE', 'Egypt'],
    severity: 'medium',
    impact: { economic: 'positive', political: 'positive', social: 'positive' },
    source: { name: 'Al Jazeera', url: 'https://aljazeera.com/news', reliability: 'high' },
    tags: ['middle-east', 'peace-talks', 'diplomacy', 'israel'],
    status: 'active'
  },
  {
    title: "Global Semiconductor Supply Chain Crisis",
    description: "Major disruptions in semiconductor manufacturing and distribution, affecting technology companies worldwide and causing shortages in critical industries.",
    summary: "Semiconductor supply chain disruptions impact global tech industry",
    eventDate: new Date('2024-12-05'),
    categories: ['Supply Chain', 'Technology', 'Manufacturing'],
    regions: ['Asia-Pacific', 'North America', 'Europe'],
    countries: ['Taiwan', 'South Korea', 'United States', 'Germany'],
    severity: 'high',
    impact: { economic: 'negative', political: 'neutral', social: 'neutral' },
    source: { name: 'Bloomberg', url: 'https://bloomberg.com/technology', reliability: 'high' },
    tags: ['semiconductors', 'supply-chain', 'technology', 'manufacturing'],
    status: 'active'
  },
  {
    title: "European Union Climate Policy Overhaul",
    description: "EU announces comprehensive new climate regulations and carbon reduction targets, setting new standards for environmental policy globally.",
    summary: "EU implements major climate policy changes affecting global standards",
    eventDate: new Date('2024-12-03'),
    categories: ['Climate Policy', 'Environmental Regulation', 'Green Technology'],
    regions: ['Europe'],
    countries: ['Germany', 'France', 'Netherlands', 'Sweden'],
    severity: 'medium',
    impact: { economic: 'neutral', political: 'positive', social: 'positive' },
    source: { name: 'Euronews', url: 'https://euronews.com/green', reliability: 'high' },
    tags: ['climate-policy', 'eu', 'environment', 'green-tech'],
    status: 'active'
  },
  {
    title: "Latin America Economic Integration Agreement",
    description: "Major trade agreement signed between Latin American nations, creating new economic bloc and reducing trade barriers across the region.",
    summary: "New economic integration agreement strengthens Latin American trade",
    eventDate: new Date('2024-12-01'),
    categories: ['Trade Agreement', 'Economic Integration', 'Regional Cooperation'],
    regions: ['South America', 'Central America'],
    countries: ['Brazil', 'Argentina', 'Chile', 'Colombia'],
    severity: 'medium',
    impact: { economic: 'positive', political: 'positive', social: 'neutral' },
    source: { name: 'Latin American News', url: 'https://latamnews.com', reliability: 'medium' },
    tags: ['latin-america', 'trade-agreement', 'economic-integration', 'south-america'],
    status: 'active'
  },
  {
    title: "Cybersecurity Breach at Major Financial Institution",
    description: "Large-scale cyber attack targets major global bank, raising concerns about financial system security and prompting regulatory responses worldwide.",
    summary: "Major cyber attack on financial institution raises global security concerns",
    eventDate: new Date('2024-11-28'),
    categories: ['Cybersecurity', 'Financial Security', 'Regulation'],
    regions: ['Global'],
    countries: ['United States', 'United Kingdom', 'Switzerland'],
    severity: 'critical',
    impact: { economic: 'negative', political: 'neutral', social: 'negative' },
    source: { name: 'Wall Street Journal', url: 'https://wsj.com/cybersecurity', reliability: 'high' },
    tags: ['cybersecurity', 'financial-institutions', 'cyber-attack', 'banking'],
    status: 'active'
  },
  {
    title: "African Continental Free Trade Area Implementation",
    description: "Implementation of the world's largest free trade area begins, potentially transforming Africa's economic landscape and creating new business opportunities.",
    summary: "World's largest free trade area implementation begins in Africa",
    eventDate: new Date('2024-11-25'),
    categories: ['Trade Agreement', 'Economic Development', 'Regional Integration'],
    regions: ['Africa'],
    countries: ['Nigeria', 'South Africa', 'Kenya', 'Ghana'],
    severity: 'medium',
    impact: { economic: 'positive', political: 'positive', social: 'positive' },
    source: { name: 'African Business', url: 'https://africanbusiness.com', reliability: 'medium' },
    tags: ['africa', 'free-trade', 'economic-development', 'continental-integration'],
    status: 'active'
  },
  {
    title: "Arctic Shipping Route Development",
    description: "Melting ice caps open new shipping routes through the Arctic, creating new trade opportunities but raising environmental and geopolitical concerns.",
    summary: "Climate change opens new Arctic shipping routes with global implications",
    eventDate: new Date('2024-11-20'),
    categories: ['Climate Change', 'Shipping', 'Geopolitics'],
    regions: ['Arctic', 'Global'],
    countries: ['Russia', 'Canada', 'Norway', 'United States'],
    severity: 'medium',
    impact: { economic: 'positive', political: 'neutral', social: 'negative' },
    source: { name: 'Arctic Council', url: 'https://arctic-council.org', reliability: 'high' },
    tags: ['arctic', 'shipping', 'climate-change', 'trade-routes'],
    status: 'active'
  }
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

async function clearAndPopulateEvents() {
  try {
    console.log('🗑️  Clearing existing events...');
    await GeopoliticalEvent.deleteMany({});
    
    console.log('📝 Creating realistic events...');
    const events = await GeopoliticalEvent.insertMany(realisticEvents);
    
    console.log(`✅ Successfully created ${events.length} realistic events`);
    
    events.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} (${event.severity})`);
    });
    
    return events;
  } catch (error) {
    console.error('❌ Error populating events:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting realistic event population...');
  
  try {
    await connectToDatabase();
    await clearAndPopulateEvents();
    
    console.log('\n✅ Database populated with realistic events!');
    console.log('🎯 These events will provide more varied and realistic geopolitical scenarios.');
    
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

module.exports = { main, realisticEvents }; 
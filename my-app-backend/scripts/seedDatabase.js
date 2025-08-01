const mongoose = require('mongoose');
const GeopoliticalEvent = require('../models/GeopoliticalEvent');
const UserProfile = require('../models/UserProfile');
const sampleEvents = require('../data/sampleEvents');
require('dotenv').config();

// Sample user profiles for testing
const sampleProfiles = [
  {
    name: "Sarah Johnson",
    company: "TechCorp Global",
    title: "Chief Risk Officer",
    industry: "Technology",
    businessUnits: [
      { name: "Semiconductor Division", regions: ["Asia-Pacific", "North America"] },
      { name: "Cloud Services", regions: ["Global"] },
      { name: "AI Research", regions: ["Europe", "North America"] }
    ],
    areasOfConcern: [
      { category: "Supply Chain Disruption", priority: "high" },
      { category: "Cybersecurity Threats", priority: "critical" },
      { category: "Regulatory Changes", priority: "medium" },
      { category: "Geopolitical Tensions", priority: "high" }
    ],
    riskTolerance: "medium",
    regions: ["North America", "Europe", "Asia-Pacific"],
    notificationPreferences: {
      email: true,
      frequency: "daily"
    }
  },
  {
    name: "Marcus Chen",
    company: "Global Energy Solutions",
    title: "Strategic Planning Director",
    industry: "Energy",
    businessUnits: [
      { name: "Renewable Energy", regions: ["Europe", "Middle East"] },
      { name: "Oil & Gas", regions: ["Middle East", "North America"] },
      { name: "Infrastructure Development", regions: ["Global"] }
    ],
    areasOfConcern: [
      { category: "Energy Transition", priority: "high" },
      { category: "Climate Policy", priority: "medium" },
      { category: "Resource Security", priority: "high" },
      { category: "Infrastructure Investment", priority: "medium" }
    ],
    riskTolerance: "low",
    regions: ["Middle East", "Europe", "North America"],
    notificationPreferences: {
      email: true,
      frequency: "weekly"
    }
  },
  {
    name: "Elena Rodriguez",
    company: "International Trade Partners",
    title: "Trade Compliance Manager",
    industry: "Trade",
    businessUnits: [
      { name: "Import/Export Operations", regions: ["Global"] },
      { name: "Supply Chain Management", regions: ["Asia-Pacific", "Europe"] },
      { name: "Regulatory Affairs", regions: ["North America", "Europe"] }
    ],
    areasOfConcern: [
      { category: "Trade Regulations", priority: "high" },
      { category: "Supply Chain Disruption", priority: "critical" },
      { category: "Economic Sanctions", priority: "high" },
      { category: "Market Access", priority: "medium" }
    ],
    riskTolerance: "high",
    regions: ["Global"],
    notificationPreferences: {
      email: true,
      frequency: "daily"
    }
  },
  {
    name: "David Thompson",
    company: "Financial Services International",
    title: "Head of Risk Management",
    industry: "Financial Services",
    businessUnits: [
      { name: "Investment Banking", regions: ["Global"] },
      { name: "Digital Banking", regions: ["Europe", "Southeast Asia"] },
      { name: "Compliance & Security", regions: ["Global"] }
    ],
    areasOfConcern: [
      { category: "Cybersecurity Threats", priority: "critical" },
      { category: "Financial Regulations", priority: "high" },
      { category: "Digital Transformation", priority: "medium" },
      { category: "Market Volatility", priority: "high" }
    ],
    riskTolerance: "low",
    regions: ["Global"],
    notificationPreferences: {
      email: true,
      frequency: "daily"
    }
  },
  {
    name: "Aisha Patel",
    company: "Sustainable Development Corp",
    title: "Environmental Impact Director",
    industry: "Environmental Services",
    businessUnits: [
      { name: "Green Technology", regions: ["Europe", "North America"] },
      { name: "Environmental Consulting", regions: ["Global"] },
      { name: "Carbon Trading", regions: ["Europe", "Asia-Pacific"] }
    ],
    areasOfConcern: [
      { category: "Climate Policy", priority: "high" },
      { category: "Environmental Regulations", priority: "medium" },
      { category: "Sustainable Development", priority: "high" },
      { category: "Resource Management", priority: "medium" }
    ],
    riskTolerance: "medium",
    regions: ["Europe", "North America", "Asia-Pacific"],
    notificationPreferences: {
      email: true,
      frequency: "weekly"
    }
  }
];

async function connectToDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/geopolitical-intelligence';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

async function clearDatabase() {
  try {
    await GeopoliticalEvent.deleteMany({});
    await UserProfile.deleteMany({});
    console.log('🗑️  Cleared existing data');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  }
}

async function seedEvents() {
  try {
    const events = await GeopoliticalEvent.insertMany(sampleEvents);
    console.log(`✅ Seeded ${events.length} geopolitical events`);
    return events;
  } catch (error) {
    console.error('❌ Error seeding events:', error);
    throw error;
  }
}

async function seedProfiles() {
  try {
    const profiles = await UserProfile.insertMany(sampleProfiles);
    console.log(`✅ Seeded ${profiles.length} user profiles`);
    return profiles;
  } catch (error) {
    console.error('❌ Error seeding profiles:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting database seeding...');
  
  try {
    await connectToDatabase();
    await clearDatabase();
    
    const [events, profiles] = await Promise.all([
      seedEvents(),
      seedProfiles()
    ]);
    
    console.log('\n📊 Seeding Summary:');
    console.log(`   • ${events.length} geopolitical events created`);
    console.log(`   • ${profiles.length} user profiles created`);
    
    console.log('\n🎯 Sample Profile IDs for testing:');
    profiles.forEach((profile, index) => {
      console.log(`   ${index + 1}. ${profile.name} (${profile.company}): ${profile._id}`);
    });
    
    console.log('\n✅ Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seeding script
if (require.main === module) {
  main();
}

module.exports = { main, sampleEvents, sampleProfiles }; 
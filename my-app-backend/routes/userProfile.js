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
 * Get relevant geopolitical events for a user profile using advanced scoring
 */
router.get('/user-profile/:id/relevant-events', async (req, res) => {
  try {
    const { id } = req.params;
    const { threshold = 0.05, includeAnalytics = false } = req.query; // Use advanced scoring threshold
    
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
    
    // Get all events from database
    const allEvents = await GeopoliticalEvent.find({ status: 'active' });
    
    // Use advanced scoring algorithm
    const scoredEvents = scoreEvents(profile, allEvents);
    
    // Filter by threshold and convert to response format
    const relevantEvents = scoredEvents
      .filter(scoredEvent => scoredEvent.relevanceScore >= parseFloat(threshold))
      .map(scoredEvent => ({
        ...scoredEvent.event.toObject(),
        relevanceScore: scoredEvent.relevanceScore,
        rationale: scoredEvent.rationale,
        contributingFactors: scoredEvent.contributingFactors,
        confidenceLevel: scoredEvent.confidenceLevel
      }));
    
    const response = {
      success: true,
      events: relevantEvents,
      total: relevantEvents.length,
      scoringMetadata: {
        totalEventsProcessed: allEvents.length,
        eventsAboveThreshold: relevantEvents.length,
        threshold: parseFloat(threshold)
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
      message: 'Internal server error'
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
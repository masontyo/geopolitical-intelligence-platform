const express = require('express');
const { validateUserProfile, calculateRelevanceScore } = require('../utils/userProfile');
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
    
    // Validate the profile
    const validation = validateUserProfile(profile);
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors
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
    res.status(500).json({
      success: false,
      message: 'Internal server error'
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
 * Get relevant geopolitical events for a user profile
 */
router.get('/user-profile/:id/relevant-events', async (req, res) => {
  try {
    const { id } = req.params;
    const { threshold = 0.5 } = req.query; // Minimum relevance score
    
    const profile = await UserProfile.findById(id);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    // Get all events from database
    const allEvents = await GeopoliticalEvent.find({ status: 'active' });
    
    // Calculate relevance scores for all events
    const relevantEvents = allEvents
      .map(event => ({
        ...event.toObject(),
        relevanceScore: calculateRelevanceScore(profile, event)
      }))
      .filter(event => event.relevanceScore >= parseFloat(threshold))
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    res.status(200).json({
      success: true,
      events: relevantEvents,
      total: relevantEvents.length
    });
    
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
    const events = await GeopoliticalEvent.find().sort({ eventDate: -1 });
    
    res.status(200).json({
      success: true,
      events,
      total: events.length
    });
    
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * POST /api/seed-database
 * Seed the database with sample data (for production setup)
 */
router.post('/seed-database', async (req, res) => {
  try {
    // Only allow seeding in development or with a secret key
    if (process.env.NODE_ENV === 'production' && !req.headers['x-seed-key']) {
      return res.status(403).json({
        success: false,
        message: 'Seeding requires authorization in production'
      });
    }

    const { main } = require('../scripts/seedDatabase');
    await main();
    
    res.status(200).json({
      success: true,
      message: 'Database seeded successfully'
    });
    
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed database'
    });
  }
});

module.exports = router; 
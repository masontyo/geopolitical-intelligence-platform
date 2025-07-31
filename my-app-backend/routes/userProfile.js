const express = require('express');
const { validateUserProfile, calculateRelevanceScore } = require('../utils/userProfile');

const router = express.Router();

// In-memory storage for MVP (will be replaced with database)
let userProfiles = [];
let geopoliticalEvents = [];

/**
 * POST /api/user-profile
 * Create or update a user profile
 */
router.post('/user-profile', (req, res) => {
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
    
    // Check if profile already exists (by name for MVP)
    const existingIndex = userProfiles.findIndex(p => p.name === profile.name);
    
    if (existingIndex >= 0) {
      // Update existing profile
      userProfiles[existingIndex] = {
        ...profile,
        id: userProfiles[existingIndex].id,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Create new profile
      const newProfile = {
        ...profile,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      userProfiles.push(newProfile);
    }
    
    res.status(200).json({
      success: true,
      message: existingIndex >= 0 ? 'Profile updated successfully' : 'Profile created successfully',
      profile: existingIndex >= 0 ? userProfiles[existingIndex] : userProfiles[userProfiles.length - 1]
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
router.get('/user-profile/:id', (req, res) => {
  try {
    const { id } = req.params;
    const profile = userProfiles.find(p => p.id === id);
    
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
router.get('/user-profile/:id/relevant-events', (req, res) => {
  try {
    const { id } = req.params;
    const { threshold = 0.5 } = req.query; // Minimum relevance score
    
    const profile = userProfiles.find(p => p.id === id);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    // Calculate relevance scores for all events
    const relevantEvents = geopoliticalEvents
      .map(event => ({
        ...event,
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
router.post('/events', (req, res) => {
  try {
    const event = req.body;
    
    // Basic validation
    if (!event.title || !event.description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }
    
    const newEvent = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      categories: event.categories || [],
      regions: event.regions || []
    };
    
    geopoliticalEvents.push(newEvent);
    
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
router.get('/events', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      events: geopoliticalEvents,
      total: geopoliticalEvents.length
    });
    
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 
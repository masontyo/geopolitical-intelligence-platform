const express = require('express');
const mongoose = require('mongoose');
const GeopoliticalEvent = require('../models/GeopoliticalEvent');

const router = express.Router();

/**
 * GET /api/events
 * Get all geopolitical events
 */
router.get('/', async (req, res) => {
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
 * POST /api/events
 * Add a geopolitical event (for testing/manual input)
 */
router.post('/', async (req, res) => {
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
 * GET /api/events/:id
 * Get a specific geopolitical event by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if the ID is a valid ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    const event = await GeopoliticalEvent.findById(id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      event
    });
    
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * PUT /api/events/:id
 * Update a geopolitical event
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Check if the ID is a valid ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    const updatedEvent = await GeopoliticalEvent.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent
    });
    
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * DELETE /api/events/:id
 * Delete a geopolitical event
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if the ID is a valid ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    const deletedEvent = await GeopoliticalEvent.findByIdAndDelete(id);
    
    if (!deletedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      event: deletedEvent
    });
    
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * GET /api/events/search
 * Search geopolitical events
 */
router.get('/search', async (req, res) => {
  try {
    const { q, category, severity, region } = req.query;
    
    const filter = {};
    
    if (q) {
      filter.$text = { $search: q };
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (severity) {
      filter.severity = severity;
    }
    
    if (region) {
      filter.regions = region;
    }
    
    const events = await GeopoliticalEvent.find(filter).sort({ eventDate: -1 });
    
    res.status(200).json({
      success: true,
      events,
      total: events.length
    });
    
  } catch (error) {
    console.error('Error searching events:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * GET /api/events/analytics
 * Get event analytics
 */
router.get('/analytics', async (req, res) => {
  try {
    const totalEvents = await GeopoliticalEvent.countDocuments();
    const eventsByCategory = await GeopoliticalEvent.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const eventsBySeverity = await GeopoliticalEvent.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);
    
    res.status(200).json({
      success: true,
      analytics: {
        totalEvents,
        eventsByCategory,
        eventsBySeverity
      }
    });
    
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * POST /api/events/batch
 * Create multiple events in batch
 */
router.post('/batch', async (req, res) => {
  try {
    const { events } = req.body;
    
    if (!Array.isArray(events)) {
      return res.status(400).json({
        success: false,
        message: 'Events must be an array'
      });
    }
    
    const createdEvents = await GeopoliticalEvent.insertMany(events);
    
    res.status(201).json({
      success: true,
      message: `${createdEvents.length} events created successfully`,
      events: createdEvents
    });
    
  } catch (error) {
    console.error('Error creating batch events:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * GET /api/events/categories
 * Get available event categories
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await GeopoliticalEvent.distinct('category');
    
    res.status(200).json({
      success: true,
      categories
    });
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * GET /api/events/regions
 * Get available event regions
 */
router.get('/regions', async (req, res) => {
  try {
    const regions = await GeopoliticalEvent.distinct('regions');
    
    res.status(200).json({
      success: true,
      regions
    });
    
  } catch (error) {
    console.error('Error fetching regions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * POST /api/events/import
 * Import events from external source
 */
router.post('/import', async (req, res) => {
  try {
    const { source, events } = req.body;
    
    if (!source || !Array.isArray(events)) {
      return res.status(400).json({
        success: false,
        message: 'Source and events array are required'
      });
    }
    
    // Add source information to events
    const eventsWithSource = events.map(event => ({
      ...event,
      source: { ...event.source, importedFrom: source }
    }));
    
    const createdEvents = await GeopoliticalEvent.insertMany(eventsWithSource);
    
    res.status(201).json({
      success: true,
      message: `${createdEvents.length} events imported successfully`,
      events: createdEvents
    });
    
  } catch (error) {
    console.error('Error importing events:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * GET /api/events/export
 * Export events in specified format
 */
router.get('/export', async (req, res) => {
  try {
    const { format = 'json', category, severity, region } = req.query;
    
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (severity) {
      filter.severity = severity;
    }
    
    if (region) {
      filter.regions = region;
    }
    
    const events = await GeopoliticalEvent.find(filter).sort({ eventDate: -1 });
    
    if (format === 'csv') {
      // Convert to CSV format
      const csv = events.map(event => 
        `${event.title},${event.description},${event.category},${event.severity},${event.regions.join(';')}`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=events.csv');
      res.send(csv);
    } else {
      // Default JSON format
      res.status(200).json({
        success: true,
        events,
        total: events.length
      });
    }
    
  } catch (error) {
    console.error('Error exporting events:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 
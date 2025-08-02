const express = require('express');
const router = express.Router();
const crisisCommunicationService = require('../services/crisisCommunicationService');
const CrisisCommunication = require('../models/CrisisCommunication');
const GeopoliticalEvent = require('../models/GeopoliticalEvent');

// Validation middleware
const validateCrisisRoomData = (req, res, next) => {
  const { eventId, title, stakeholders } = req.body;
  
  if (!eventId) {
    return res.status(400).json({ success: false, message: 'Event ID is required' });
  }
  
  if (!title) {
    return res.status(400).json({ success: false, message: 'Crisis room title is required' });
  }
  
  if (stakeholders && !Array.isArray(stakeholders)) {
    return res.status(400).json({ success: false, message: 'Stakeholders must be an array' });
  }
  
  next();
};

const validateCommunicationData = (req, res, next) => {
  const { type, channel, recipients, subject, content } = req.body;
  
  if (!type || !channel || !recipients || !subject || !content) {
    return res.status(400).json({ 
      success: false, 
      message: 'Type, channel, recipients, subject, and content are required' 
    });
  }
  
  if (!Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ success: false, message: 'At least one recipient is required' });
  }
  
  next();
};

/**
 * CRISIS ROOM MANAGEMENT
 */

// Create a new crisis room
router.post('/crisis-rooms', validateCrisisRoomData, async (req, res) => {
  try {
    const crisisRoom = await crisisCommunicationService.createCrisisRoom(
      req.body.eventId,
      req.body
    );
    
    res.status(201).json({
      success: true,
      message: 'Crisis room created successfully',
      data: crisisRoom
    });
  } catch (error) {
    console.error('Error creating crisis room:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create crisis room',
      error: error.message
    });
  }
});

// Get all crisis rooms
router.get('/crisis-rooms', async (req, res) => {
  try {
    const { status, severity, limit = 20, page = 1 } = req.query;
    
    const filter = {};
    if (status) filter['crisisRoom.status'] = status;
    if (severity) filter['crisisRoom.severity'] = severity;
    
    const crisisRooms = await CrisisCommunication.find(filter)
      .populate('eventId', 'title description eventDate severity')
      .populate('stakeholders')
      .sort({ 'crisisRoom.createdAt': -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await CrisisCommunication.countDocuments(filter);
    
    res.json({
      success: true,
      data: crisisRooms,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching crisis rooms:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crisis rooms',
      error: error.message
    });
  }
});

// Get specific crisis room
router.get('/crisis-rooms/:id', async (req, res) => {
  try {
    const crisisRoom = await CrisisCommunication.findById(req.params.id)
      .populate('eventId', 'title description eventDate severity categories regions')
      .populate('stakeholders')
      .populate('communications.sentBy', 'name email')
      .populate('responses.stakeholderId', 'name email role');
    
    if (!crisisRoom) {
      return res.status(404).json({
        success: false,
        message: 'Crisis room not found'
      });
    }
    
    res.json({
      success: true,
      data: crisisRoom
    });
  } catch (error) {
    console.error('Error fetching crisis room:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crisis room',
      error: error.message
    });
  }
});

// Update crisis room
router.put('/crisis-rooms/:id', async (req, res) => {
  try {
    const { title, description, status, assignedTeam, settings } = req.body;
    
    const updateData = {};
    if (title) updateData['crisisRoom.title'] = title;
    if (description) updateData['crisisRoom.description'] = description;
    if (status) updateData['crisisRoom.status'] = status;
    if (assignedTeam) updateData['crisisRoom.assignedTeam'] = assignedTeam;
    if (settings) updateData.settings = settings;
    
    // Add timeline entry for updates
    updateData.$push = {
      timeline: {
        event: 'crisis_room_updated',
        description: 'Crisis room details updated',
        actorName: req.body.updatedBy || 'System',
        metadata: { updatedFields: Object.keys(updateData) }
      }
    };
    
    const crisisRoom = await CrisisCommunication.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('eventId stakeholders');
    
    if (!crisisRoom) {
      return res.status(404).json({
        success: false,
        message: 'Crisis room not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Crisis room updated successfully',
      data: crisisRoom
    });
  } catch (error) {
    console.error('Error updating crisis room:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update crisis room',
      error: error.message
    });
  }
});

// Resolve crisis room
router.post('/crisis-rooms/:id/resolve', async (req, res) => {
  try {
    const crisisRoom = await crisisCommunicationService.resolveCrisisRoom(
      req.params.id,
      req.body
    );
    
    res.json({
      success: true,
      message: 'Crisis room resolved successfully',
      data: crisisRoom
    });
  } catch (error) {
    console.error('Error resolving crisis room:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resolve crisis room',
      error: error.message
    });
  }
});

/**
 * STAKEHOLDER MANAGEMENT
 */

// Add stakeholders to crisis room
router.post('/crisis-rooms/:id/stakeholders', async (req, res) => {
  try {
    const { stakeholders } = req.body;
    
    if (!Array.isArray(stakeholders)) {
      return res.status(400).json({
        success: false,
        message: 'Stakeholders must be an array'
      });
    }
    
    const crisisRoom = await CrisisCommunication.findByIdAndUpdate(
      req.params.id,
      {
        $push: { stakeholders: { $each: stakeholders } },
        $push: {
          timeline: {
            event: 'stakeholders_added',
            description: `Added ${stakeholders.length} stakeholders`,
            actorName: req.body.addedBy || 'System',
            metadata: { stakeholderCount: stakeholders.length }
          }
        }
      },
      { new: true }
    ).populate('stakeholders');
    
    if (!crisisRoom) {
      return res.status(404).json({
        success: false,
        message: 'Crisis room not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Stakeholders added successfully',
      data: crisisRoom.stakeholders
    });
  } catch (error) {
    console.error('Error adding stakeholders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add stakeholders',
      error: error.message
    });
  }
});

// Update stakeholder
router.put('/crisis-rooms/:id/stakeholders/:stakeholderId', async (req, res) => {
  try {
    const crisisRoom = await CrisisCommunication.findById(req.params.id);
    
    if (!crisisRoom) {
      return res.status(404).json({
        success: false,
        message: 'Crisis room not found'
      });
    }
    
    const stakeholderIndex = crisisRoom.stakeholders.findIndex(
      s => s._id.toString() === req.params.stakeholderId
    );
    
    if (stakeholderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Stakeholder not found'
      });
    }
    
    // Update stakeholder fields
    Object.keys(req.body).forEach(key => {
      if (key !== '_id') {
        crisisRoom.stakeholders[stakeholderIndex][key] = req.body[key];
      }
    });
    
    crisisRoom.timeline.push({
      event: 'stakeholder_updated',
      description: `Updated stakeholder: ${crisisRoom.stakeholders[stakeholderIndex].name}`,
      actorName: req.body.updatedBy || 'System'
    });
    
    await crisisRoom.save();
    
    res.json({
      success: true,
      message: 'Stakeholder updated successfully',
      data: crisisRoom.stakeholders[stakeholderIndex]
    });
  } catch (error) {
    console.error('Error updating stakeholder:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update stakeholder',
      error: error.message
    });
  }
});

/**
 * COMMUNICATION MANAGEMENT
 */

// Send communication
router.post('/crisis-rooms/:id/communications', validateCommunicationData, async (req, res) => {
  try {
    const communication = await crisisCommunicationService.sendCrisisCommunication(
      req.params.id,
      req.body
    );
    
    res.status(201).json({
      success: true,
      message: 'Communication sent successfully',
      data: communication
    });
  } catch (error) {
    console.error('Error sending communication:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send communication',
      error: error.message
    });
  }
});

// Get communications for crisis room
router.get('/crisis-rooms/:id/communications', async (req, res) => {
  try {
    const crisisRoom = await CrisisCommunication.findById(req.params.id)
      .populate('communications.sentBy', 'name email')
      .populate('communications.recipients.stakeholderId', 'name email role');
    
    if (!crisisRoom) {
      return res.status(404).json({
        success: false,
        message: 'Crisis room not found'
      });
    }
    
    const { type, channel, limit = 50, page = 1 } = req.query;
    
    let communications = crisisRoom.communications;
    
    // Apply filters
    if (type) {
      communications = communications.filter(c => c.type === type);
    }
    if (channel) {
      communications = communications.filter(c => c.channel === channel);
    }
    
    // Sort by sent date (newest first)
    communications.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
    
    // Apply pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedCommunications = communications.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedCommunications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: communications.length,
        pages: Math.ceil(communications.length / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching communications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch communications',
      error: error.message
    });
  }
});

/**
 * RESPONSE MANAGEMENT
 */

// Process stakeholder response
router.post('/crisis-rooms/:id/responses', async (req, res) => {
  try {
    const response = await crisisCommunicationService.processStakeholderResponse(
      req.params.id,
      req.body
    );
    
    res.status(201).json({
      success: true,
      message: 'Response processed successfully',
      data: response
    });
  } catch (error) {
    console.error('Error processing response:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process response',
      error: error.message
    });
  }
});

// Get responses for crisis room
router.get('/crisis-rooms/:id/responses', async (req, res) => {
  try {
    const crisisRoom = await CrisisCommunication.findById(req.params.id)
      .populate('responses.stakeholderId', 'name email role');
    
    if (!crisisRoom) {
      return res.status(404).json({
        success: false,
        message: 'Crisis room not found'
      });
    }
    
    const { responseType, limit = 50, page = 1 } = req.query;
    
    let responses = crisisRoom.responses;
    
    // Apply filters
    if (responseType) {
      responses = responses.filter(r => r.responseType === responseType);
    }
    
    // Sort by received date (newest first)
    responses.sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt));
    
    // Apply pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedResponses = responses.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedResponses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: responses.length,
        pages: Math.ceil(responses.length / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch responses',
      error: error.message
    });
  }
});

/**
 * ESCALATION MANAGEMENT
 */

// Trigger escalation
router.post('/crisis-rooms/:id/escalations', async (req, res) => {
  try {
    const escalation = await crisisCommunicationService.triggerEscalation(
      req.params.id,
      req.body
    );
    
    res.status(201).json({
      success: true,
      message: 'Escalation triggered successfully',
      data: escalation
    });
  } catch (error) {
    console.error('Error triggering escalation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to trigger escalation',
      error: error.message
    });
  }
});

// Get escalations for crisis room
router.get('/crisis-rooms/:id/escalations', async (req, res) => {
  try {
    const crisisRoom = await CrisisCommunication.findById(req.params.id)
      .populate('escalations.triggeredBy', 'name email')
      .populate('escalations.escalatedTo.stakeholderId', 'name email role');
    
    if (!crisisRoom) {
      return res.status(404).json({
        success: false,
        message: 'Crisis room not found'
      });
    }
    
    res.json({
      success: true,
      data: crisisRoom.escalations
    });
  } catch (error) {
    console.error('Error fetching escalations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch escalations',
      error: error.message
    });
  }
});

/**
 * TEMPLATE MANAGEMENT
 */

// Get communication templates
router.get('/crisis-rooms/:id/templates', async (req, res) => {
  try {
    const crisisRoom = await CrisisCommunication.findById(req.params.id);
    
    if (!crisisRoom) {
      return res.status(404).json({
        success: false,
        message: 'Crisis room not found'
      });
    }
    
    res.json({
      success: true,
      data: crisisRoom.templates
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch templates',
      error: error.message
    });
  }
});

// Add communication template
router.post('/crisis-rooms/:id/templates', async (req, res) => {
  try {
    const { name, type, subject, content, variables } = req.body;
    
    if (!name || !type || !subject || !content) {
      return res.status(400).json({
        success: false,
        message: 'Name, type, subject, and content are required'
      });
    }
    
    const crisisRoom = await CrisisCommunication.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          templates: {
            name,
            type,
            subject,
            content,
            variables: variables || [],
            createdBy: req.body.createdBy
          }
        }
      },
      { new: true }
    );
    
    if (!crisisRoom) {
      return res.status(404).json({
        success: false,
        message: 'Crisis room not found'
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Template added successfully',
      data: crisisRoom.templates[crisisRoom.templates.length - 1]
    });
  } catch (error) {
    console.error('Error adding template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add template',
      error: error.message
    });
  }
});

/**
 * ANALYTICS
 */

// Get crisis room analytics
router.get('/crisis-rooms/:id/analytics', async (req, res) => {
  try {
    const analytics = await crisisCommunicationService.getCrisisRoomAnalytics(req.params.id);
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
});

/**
 * TIMELINE
 */

// Get crisis room timeline
router.get('/crisis-rooms/:id/timeline', async (req, res) => {
  try {
    const crisisRoom = await CrisisCommunication.findById(req.params.id)
      .populate('timeline.actor', 'name email');
    
    if (!crisisRoom) {
      return res.status(404).json({
        success: false,
        message: 'Crisis room not found'
      });
    }
    
    const { limit = 100, page = 1 } = req.query;
    
    // Sort timeline by timestamp (newest first)
    const timeline = crisisRoom.timeline.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    // Apply pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedTimeline = timeline.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedTimeline,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: timeline.length,
        pages: Math.ceil(timeline.length / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching timeline:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch timeline',
      error: error.message
    });
  }
});

// Get crisis rooms by profile ID
router.get('/crisis-rooms/profile/:profileId', async (req, res) => {
  try {
    const crisisRooms = await CrisisCommunication.find({
      'stakeholders.email': { $exists: true }
    }).populate('eventId').sort({ 'crisisRoom.createdAt': -1 });
    
    res.json({ 
      success: true,
      crisisRooms 
    });
  } catch (error) {
    console.error('Error getting crisis rooms by profile:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

module.exports = router; 
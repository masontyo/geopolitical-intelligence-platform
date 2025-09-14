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
router.post('/', validateCrisisRoomData, async (req, res) => {
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
router.get('/', async (req, res) => {
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

// Get a specific crisis room
router.get('/:id', async (req, res) => {
  try {
    const crisisRoom = await CrisisCommunication.findById(req.params.id)
      .populate('eventId', 'title description eventDate severity categories regions')
      .populate('stakeholders', 'name email role organization')
      .populate('communications.actor', 'name email role')
      .populate('responses.actor', 'name email role')
      .populate('escalations.actor', 'name email role');
    
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

// Update a crisis room
router.put('/:id', async (req, res) => {
  try {
    const crisisRoom = await CrisisCommunication.findByIdAndUpdate(
      req.params.id,
      { $set: { 'crisisRoom': { ...req.body, updatedAt: new Date() } } },
      { new: true, runValidators: true }
    );
    
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

// Delete a crisis room
router.delete('/:id', async (req, res) => {
  try {
    const crisisRoom = await CrisisCommunication.findByIdAndDelete(req.params.id);
    
    if (!crisisRoom) {
      return res.status(404).json({
        success: false,
        message: 'Crisis room not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Crisis room deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting crisis room:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete crisis room',
      error: error.message
    });
  }
});

// Add communication to crisis room
router.post('/:id/communications', validateCommunicationData, async (req, res) => {
  try {
    const crisisRoom = await CrisisCommunication.findById(req.params.id);
    
    if (!crisisRoom) {
      return res.status(404).json({
        success: false,
        message: 'Crisis room not found'
      });
    }
    
    const communication = {
      type: req.body.type,
      channel: req.body.channel,
      recipients: req.body.recipients,
      subject: req.body.subject,
      content: req.body.content,
      timestamp: new Date(),
      actor: req.body.actor || 'system'
    };
    
    crisisRoom.communications.push(communication);
    await crisisRoom.save();
    
    res.status(201).json({
      success: true,
      message: 'Communication added successfully',
      data: communication
    });
  } catch (error) {
    console.error('Error adding communication:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add communication',
      error: error.message
    });
  }
});

// Update crisis room status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['active', 'resolved', 'escalated', 'monitoring'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (active, resolved, escalated, monitoring)'
      });
    }
    
    const crisisRoom = await CrisisCommunication.findByIdAndUpdate(
      req.params.id,
      { $set: { 'crisisRoom.status': status, 'crisisRoom.updatedAt': new Date() } },
      { new: true }
    );
    
    if (!crisisRoom) {
      return res.status(404).json({
        success: false,
        message: 'Crisis room not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Status updated successfully',
      data: crisisRoom
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
      error: error.message
    });
  }
});

// Get crisis room notifications
router.get('/:id/notifications', async (req, res) => {
  try {
    const crisisRoom = await CrisisCommunication.findById(req.params.id)
      .select('notifications');
    
    if (!crisisRoom) {
      return res.status(404).json({
        success: false,
        message: 'Crisis room not found'
      });
    }
    
    res.json({
      success: true,
      data: crisisRoom.notifications || []
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
});

// Send crisis notifications
router.post('/:id/notifications', async (req, res) => {
  try {
    const crisisRoom = await CrisisCommunication.findById(req.params.id);
    
    if (!crisisRoom) {
      return res.status(404).json({
        success: false,
        message: 'Crisis room not found'
      });
    }
    
    const notification = {
      type: req.body.type,
      message: req.body.message,
      recipients: req.body.recipients,
      timestamp: new Date(),
      priority: req.body.priority || 'medium'
    };
    
    crisisRoom.notifications.push(notification);
    await crisisRoom.save();
    
    res.status(201).json({
      success: true,
      message: 'Notification sent successfully',
      data: notification
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification',
      error: error.message
    });
  }
});

// Get crisis room analytics
router.get('/:id/analytics', async (req, res) => {
  try {
    const crisisRoom = await CrisisCommunication.findById(req.params.id)
      .select('metrics communications responses escalations');
    
    if (!crisisRoom) {
      return res.status(404).json({
        success: false,
        message: 'Crisis room not found'
      });
    }
    
    // Calculate analytics
    const analytics = {
      totalCommunications: crisisRoom.communications.length,
      totalResponses: crisisRoom.responses.length,
      totalEscalations: crisisRoom.escalations.length,
      responseTime: crisisRoom.metrics?.averageResponseTime || 0,
      resolutionTime: crisisRoom.metrics?.resolutionTime || 0,
      stakeholderEngagement: crisisRoom.metrics?.stakeholderEngagement || 0
    };
    
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

// Escalate crisis room
router.post('/:id/escalate', async (req, res) => {
  try {
    const crisisRoom = await CrisisCommunication.findById(req.params.id);
    
    if (!crisisRoom) {
      return res.status(404).json({
        success: false,
        message: 'Crisis room not found'
      });
    }
    
    const escalation = {
      reason: req.body.reason,
      level: req.body.level || 'medium',
      timestamp: new Date(),
      actor: req.body.actor || 'system'
    };
    
    crisisRoom.escalations.push(escalation);
    crisisRoom.crisisRoom.status = 'escalated';
    crisisRoom.crisisRoom.updatedAt = new Date();
    
    await crisisRoom.save();
    
    res.json({
      success: true,
      message: 'Crisis room escalated successfully',
      data: escalation
    });
  } catch (error) {
    console.error('Error escalating crisis room:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to escalate crisis room',
      error: error.message
    });
  }
});

module.exports = router; 
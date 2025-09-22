const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const eventsRouter = require('../../routes/events');
const GeopoliticalEvent = require('../../models/GeopoliticalEvent');

// Mock dependencies
jest.mock('../../models/GeopoliticalEvent');
jest.mock('mongoose');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/events', eventsRouter);

describe('Events Routes - Comprehensive Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock mongoose connection
    mongoose.connection = {
      readyState: 1 // Connected
    };
  });

  describe('GET /api/events', () => {
    it('should return all events successfully', async () => {
      const mockEvents = [
        {
          _id: 'event1',
          title: 'Trade War Update',
          category: 'trade',
          severity: 'high',
          eventDate: new Date()
        },
        {
          _id: 'event2',
          title: 'Political Development',
          category: 'politics',
          severity: 'medium',
          eventDate: new Date()
        }
      ];

      GeopoliticalEvent.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockEvents)
      });

      const response = await request(app)
        .get('/api/events')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.events).toHaveLength(2);
      expect(response.body.total).toBe(2);
      expect(GeopoliticalEvent.find).toHaveBeenCalled();
    });

    it('should handle database connection error', async () => {
      mongoose.connection.readyState = 0; // Disconnected

      const response = await request(app)
        .get('/api/events')
        .expect(503);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Database connection not available');
    });

    it('should handle database errors gracefully', async () => {
      GeopoliticalEvent.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      const response = await request(app)
        .get('/api/events')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Internal server error');
    });

    it('should filter events by category', async () => {
      const mockEvents = [
        {
          _id: 'event1',
          title: 'Trade War Update',
          category: 'trade',
          severity: 'high'
        }
      ];

      GeopoliticalEvent.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockEvents)
      });

      const response = await request(app)
        .get('/api/events?category=trade')
        .expect(200);

      expect(GeopoliticalEvent.find).toHaveBeenCalled();
      expect(response.body.events).toHaveLength(1);
    });

    it('should filter events by severity', async () => {
      const mockEvents = [
        {
          _id: 'event1',
          title: 'Critical Event',
          category: 'security',
          severity: 'high'
        }
      ];

      GeopoliticalEvent.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockEvents)
      });

      const response = await request(app)
        .get('/api/events?severity=high')
        .expect(200);

      expect(GeopoliticalEvent.find).toHaveBeenCalled();
      expect(response.body.events).toHaveLength(1);
    });

    it('should filter events by region', async () => {
      const mockEvents = [
        {
          _id: 'event1',
          title: 'Asia Pacific Event',
          category: 'trade',
          regions: 'Asia Pacific'
        }
      ];

      GeopoliticalEvent.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockEvents)
      });

      const response = await request(app)
        .get('/api/events?region=Asia Pacific')
        .expect(200);

      expect(GeopoliticalEvent.find).toHaveBeenCalled();
      expect(response.body.events).toHaveLength(1);
    });

    it('should apply limit parameter', async () => {
      const mockEvents = [
        { _id: 'event1', title: 'Event 1' },
        { _id: 'event2', title: 'Event 2' }
      ];

      GeopoliticalEvent.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockEvents.slice(0, 1))
        })
      });

      const response = await request(app)
        .get('/api/events?limit=1')
        .expect(200);

      expect(response.body.events).toHaveLength(1);
    });
  });

  describe('GET /api/events/:id', () => {
    it('should return specific event successfully', async () => {
      const mockEvent = {
        _id: 'event123',
        title: 'Specific Event',
        category: 'trade',
        severity: 'medium'
      };

      GeopoliticalEvent.findById = jest.fn().mockResolvedValue(mockEvent);

      const response = await request(app)
        .get('/api/events/event123')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.event).toEqual(mockEvent);
      expect(GeopoliticalEvent.findById).toHaveBeenCalledWith('event123');
    });

    it('should return 404 for non-existent event', async () => {
      GeopoliticalEvent.findById = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .get('/api/events/nonexistent')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Event not found');
    });

    it('should handle database errors', async () => {
      GeopoliticalEvent.findById = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/events/event123')
        .expect(500);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/events', () => {
    it('should create new event successfully', async () => {
      const newEvent = {
        title: 'New Event',
        description: 'Event description',
        category: 'trade',
        severity: 'medium',
        regions: ['North America']
      };

      const mockSavedEvent = {
        _id: 'new-event-id',
        ...newEvent,
        eventDate: new Date()
      };

      GeopoliticalEvent.create = jest.fn().mockResolvedValue(mockSavedEvent);

      const response = await request(app)
        .post('/api/events')
        .send(newEvent)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.event.title).toBe('New Event');
    });

    it('should handle validation errors', async () => {
      const invalidEvent = {
        // Missing required fields
        description: 'Event without title'
      };

      GeopoliticalEvent.create = jest.fn().mockRejectedValue({
        name: 'ValidationError',
        message: 'Title is required'
      });

      const response = await request(app)
        .post('/api/events')
        .send(invalidEvent)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Title and description are required');
    });

    it('should handle database errors', async () => {
      const newEvent = {
        title: 'New Event',
        description: 'Event description',
        category: 'trade'
      };

      GeopoliticalEvent.create = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/events')
        .send(newEvent)
        .expect(500);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/events/:id', () => {
    it('should update event successfully', async () => {
      const updateData = {
        title: 'Updated Event',
        severity: 'high'
      };

      const mockUpdatedEvent = {
        _id: 'event123',
        title: 'Updated Event',
        severity: 'high',
        category: 'trade'
      };

      GeopoliticalEvent.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedEvent);

      const response = await request(app)
        .put('/api/events/event123')
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.event.title).toBe('Updated Event');
      expect(GeopoliticalEvent.findByIdAndUpdate).toHaveBeenCalledWith(
        'event123',
        expect.objectContaining(updateData),
        { new: true, runValidators: true }
      );
    });

    it('should return 404 for non-existent event', async () => {
      GeopoliticalEvent.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .put('/api/events/nonexistent')
        .send({ title: 'Updated' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Event not found');
    });
  });

  describe('DELETE /api/events/:id', () => {
    it('should delete event successfully', async () => {
      const mockDeletedEvent = {
        _id: 'event123',
        title: 'Deleted Event'
      };

      GeopoliticalEvent.findByIdAndDelete = jest.fn().mockResolvedValue(mockDeletedEvent);

      const response = await request(app)
        .delete('/api/events/event123')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Event deleted successfully');
      expect(GeopoliticalEvent.findByIdAndDelete).toHaveBeenCalledWith('event123');
    });

    it('should return 404 for non-existent event', async () => {
      GeopoliticalEvent.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/events/nonexistent')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Event not found');
    });
  });

  describe('GET /api/events/regions', () => {
    it('should return distinct regions successfully', async () => {
      const mockRegions = ['North America', 'Europe', 'Asia Pacific'];

      GeopoliticalEvent.distinct = jest.fn().mockResolvedValue(mockRegions);

      const response = await request(app)
        .get('/api/events/regions')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.regions).toEqual(mockRegions);
      expect(GeopoliticalEvent.distinct).toHaveBeenCalledWith('regions');
    });

    it('should handle database errors', async () => {
      GeopoliticalEvent.distinct = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/events/regions')
        .expect(500);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/events/import', () => {
    it('should import events successfully', async () => {
      const importData = {
        source: 'external-api',
        data: [
          {
            title: 'Imported Event 1',
            description: 'First imported event',
            category: 'trade'
          },
          {
            title: 'Imported Event 2',
            description: 'Second imported event',
            category: 'politics'
          }
        ]
      };

      const mockCreatedEvents = [
        { _id: 'imported1', ...importData.data[0] },
        { _id: 'imported2', ...importData.data[1] }
      ];

      GeopoliticalEvent.create = jest.fn().mockResolvedValue(mockCreatedEvents);

      const response = await request(app)
        .post('/api/events/import')
        .send(importData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('2 events imported successfully');
      expect(GeopoliticalEvent.create).toHaveBeenCalled();
    });

    it('should handle missing import data', async () => {
      const response = await request(app)
        .post('/api/events/import')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Source and events array are required');
    });
  });

  describe('GET /api/events/export', () => {
    it('should export events in JSON format', async () => {
      const mockEvents = [
        {
          title: 'Event 1',
          description: 'Description 1',
          category: 'trade',
          severity: 'high',
          regions: ['North America']
        }
      ];

      GeopoliticalEvent.find = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockEvents)
      });

      const response = await request(app)
        .get('/api/events/export?format=json')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockEvents);
    });

    it('should export events in CSV format', async () => {
      const mockEvents = [
        {
          title: 'Event 1',
          description: 'Description 1',
          category: 'trade',
          severity: 'high',
          regions: ['North America']
        }
      ];

      GeopoliticalEvent.find = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockEvents)
      });

      const response = await request(app)
        .get('/api/events/export?format=csv')
        .expect(200);

      expect(response.headers['content-type']).toBe('text/csv');
      expect(response.text).toContain('Event 1,Description 1,trade,high,North America');
    });

    it('should filter exported events by category', async () => {
      const mockEvents = [
        {
          title: 'Trade Event',
          category: 'trade'
        }
      ];

      GeopoliticalEvent.find = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockEvents)
      });

      const response = await request(app)
        .get('/api/events/export?format=json&category=trade')
        .expect(200);

      expect(GeopoliticalEvent.find).toHaveBeenCalled();
    });
  });
});

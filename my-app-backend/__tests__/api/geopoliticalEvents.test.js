const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('@shelf/jest-mongodb');
const app = require('../../server');
const GeopoliticalEvent = require('../../models/GeopoliticalEvent');
const { sampleEvents } = require('../../scripts/seedDatabase');

let mongoServer;

describe('Geopolitical Events API', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await GeopoliticalEvent.deleteMany({});
  });

  describe('GET /api/events', () => {
    it('should return empty array when no events exist', async () => {
      const response = await request(app)
        .get('/api/events')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.events).toEqual([]);
      expect(response.body.total).toBe(0);
    });

    it('should return all events when they exist', async () => {
      // Create test events
      const testEvents = await GeopoliticalEvent.insertMany([
        {
          title: 'Test Event 1',
          description: 'Test description 1',
          eventDate: new Date(),
          categories: ['Test'],
          regions: ['Test Region'],
          severity: 'medium'
        },
        {
          title: 'Test Event 2',
          description: 'Test description 2',
          eventDate: new Date(),
          categories: ['Test'],
          regions: ['Test Region'],
          severity: 'high'
        }
      ]);

      const response = await request(app)
        .get('/api/events')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.events).toHaveLength(2);
      expect(response.body.total).toBe(2);
      expect(response.body.events[0].title).toBe('Test Event 2'); // Should be sorted by date desc
    });

    it('should handle database errors gracefully', async () => {
      // Mock database error
      jest.spyOn(GeopoliticalEvent, 'find').mockImplementationOnce(() => {
        throw new Error('Database connection failed');
      });

      const response = await request(app)
        .get('/api/events')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Internal server error');
    });
  });

  describe('POST /api/events', () => {
    it('should create a new event with valid data', async () => {
      const newEvent = {
        title: 'New Test Event',
        description: 'New test description',
        eventDate: new Date().toISOString(),
        categories: ['Technology', 'Trade'],
        regions: ['Asia-Pacific'],
        countries: ['China', 'Japan'],
        severity: 'medium',
        impact: {
          economic: 'negative',
          political: 'neutral',
          social: 'neutral'
        }
      };

      const response = await request(app)
        .post('/api/events')
        .send(newEvent)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Event created successfully');
      expect(response.body.event.title).toBe(newEvent.title);
      expect(response.body.event.description).toBe(newEvent.description);
      expect(response.body.event._id).toBeDefined();
    });

    it('should set default event date if not provided', async () => {
      const newEvent = {
        title: 'Event without date',
        description: 'Test description',
        categories: ['Test'],
        regions: ['Test Region'],
        severity: 'low'
      };

      const response = await request(app)
        .post('/api/events')
        .send(newEvent)
        .expect(201);

      expect(response.body.event.eventDate).toBeDefined();
      expect(new Date(response.body.event.eventDate)).toBeInstanceOf(Date);
    });

    it('should reject event without required fields', async () => {
      const invalidEvent = {
        description: 'Missing title',
        categories: ['Test']
      };

      const response = await request(app)
        .post('/api/events')
        .send(invalidEvent)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Title and description are required');
    });

    it('should reject event with empty title', async () => {
      const invalidEvent = {
        title: '',
        description: 'Valid description',
        categories: ['Test']
      };

      const response = await request(app)
        .post('/api/events')
        .send(invalidEvent)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Title and description are required');
    });

    it('should handle complex event data with all fields', async () => {
      const complexEvent = {
        title: 'Complex Test Event',
        description: 'A comprehensive test event with all fields',
        summary: 'Test summary',
        eventDate: new Date().toISOString(),
        categories: ['Technology', 'Trade', 'Cybersecurity'],
        regions: ['Global'],
        countries: ['United States', 'China', 'Germany'],
        severity: 'high',
        impact: {
          economic: 'negative',
          political: 'negative',
          social: 'neutral'
        },
        source: {
          name: 'Test Source',
          url: 'https://test.com',
          reliability: 'high'
        },
        historicalContext: {
          hasHappenedBefore: true,
          previousOccurrences: [
            {
              date: new Date('2020-01-01'),
              description: 'Previous occurrence',
              outcome: 'Resolved'
            }
          ]
        },
        predictiveAnalytics: {
          likelihood: 0.8,
          timeframe: 'short-term',
          scenarios: [
            {
              scenario: 'Test scenario',
              probability: 0.6,
              impact: 'Test impact'
            }
          ]
        },
        actionableInsights: [
          {
            insight: 'Test insight',
            action: 'Test action',
            priority: 'high'
          }
        ],
        tags: ['test', 'api', 'validation'],
        status: 'active'
      };

      const response = await request(app)
        .post('/api/events')
        .send(complexEvent)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.event.title).toBe(complexEvent.title);
      expect(response.body.event.categories).toEqual(complexEvent.categories);
      expect(response.body.event.impact.economic).toBe(complexEvent.impact.economic);
      expect(response.body.event.actionableInsights).toHaveLength(1);
      expect(response.body.event.tags).toEqual(complexEvent.tags);
    });

    it('should handle database errors during creation', async () => {
      // Mock database error
      jest.spyOn(GeopoliticalEvent, 'create').mockImplementationOnce(() => {
        throw new Error('Database creation failed');
      });

      const newEvent = {
        title: 'Test Event',
        description: 'Test description',
        categories: ['Test']
      };

      const response = await request(app)
        .post('/api/events')
        .send(newEvent)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Internal server error');
    });
  });

  describe('Event Validation', () => {
    it('should validate severity enum values', async () => {
      const invalidEvent = {
        title: 'Test Event',
        description: 'Test description',
        severity: 'invalid-severity',
        categories: ['Test']
      };

      const response = await request(app)
        .post('/api/events')
        .send(invalidEvent)
        .expect(500); // Should fail due to mongoose validation

      expect(response.body.success).toBe(false);
    });

    it('should validate impact enum values', async () => {
      const invalidEvent = {
        title: 'Test Event',
        description: 'Test description',
        impact: {
          economic: 'invalid-impact',
          political: 'positive',
          social: 'neutral'
        },
        categories: ['Test']
      };

      const response = await request(app)
        .post('/api/events')
        .send(invalidEvent)
        .expect(500);

      expect(response.body.success).toBe(false);
    });

    it('should validate source reliability enum values', async () => {
      const invalidEvent = {
        title: 'Test Event',
        description: 'Test description',
        source: {
          name: 'Test Source',
          reliability: 'invalid-reliability'
        },
        categories: ['Test']
      };

      const response = await request(app)
        .post('/api/events')
        .send(invalidEvent)
        .expect(500);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Event Data Integrity', () => {
    it('should trim string fields', async () => {
      const eventWithWhitespace = {
        title: '  Test Event  ',
        description: '  Test description  ',
        categories: ['  Test  '],
        regions: ['  Test Region  '],
        severity: 'medium'
      };

      const response = await request(app)
        .post('/api/events')
        .send(eventWithWhitespace)
        .expect(201);

      expect(response.body.event.title).toBe('Test Event');
      expect(response.body.event.description).toBe('Test description');
      expect(response.body.event.categories[0]).toBe('Test');
      expect(response.body.event.regions[0]).toBe('Test Region');
    });

    it('should handle arrays properly', async () => {
      const eventWithArrays = {
        title: 'Array Test Event',
        description: 'Test description',
        categories: ['Category1', 'Category2', 'Category3'],
        regions: ['Region1', 'Region2'],
        countries: ['Country1', 'Country2', 'Country3'],
        tags: ['tag1', 'tag2'],
        severity: 'medium'
      };

      const response = await request(app)
        .post('/api/events')
        .send(eventWithArrays)
        .expect(201);

      expect(response.body.event.categories).toHaveLength(3);
      expect(response.body.event.regions).toHaveLength(2);
      expect(response.body.event.countries).toHaveLength(3);
      expect(response.body.event.tags).toHaveLength(2);
    });
  });
}); 
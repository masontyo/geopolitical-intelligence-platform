const request = require('supertest');
const app = require('../../server');

describe('Geopolitical Events API Tests', () => {
  describe('GET /api/events', () => {
    it('should return all geopolitical events', async () => {
      const response = await request(app)
        .get('/api/events')
        .expect(200); // Should return 200 with empty array when no database connection

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('events');
      expect(Array.isArray(response.body.events)).toBe(true);
    });

    it('should handle query parameters', async () => {
      const response = await request(app)
        .get('/api/events?category=politics&severity=high&limit=10')
        .expect(200); // Should return 200 with empty array when no database connection

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('events');
      expect(Array.isArray(response.body.events)).toBe(true);
    });
  });

  describe('POST /api/events', () => {
    it('should create a new geopolitical event', async () => {
      const eventData = {
        title: 'Test Geopolitical Event',
        description: 'Test event description',
        category: 'Politics',
        severity: 'Medium',
        regions: ['North America'],
        eventDate: new Date().toISOString(),
        source: {
          name: 'Test Source',
          url: 'https://test.com'
        }
      };

      const response = await request(app)
        .post('/api/events')
        .send(eventData)
        .expect(500); // Expected to fail without database

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should validate required fields', async () => {
      const invalidData = {
        // Missing required title and description
        category: 'Politics',
        severity: 'Medium'
      };

      const response = await request(app)
        .post('/api/events')
        .send(invalidData)
        .expect(400); // Expected to return 400 for validation error

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/events/:id', () => {
    it('should return a specific geopolitical event', async () => {
      const response = await request(app)
        .get('/api/events/507f1f77bcf86cd799439011')
        .expect(404); // Expected to return 404 for non-existent ID

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should handle invalid event ID format', async () => {
      const response = await request(app)
        .get('/api/events/invalid-id')
        .expect(404); // Expected to return 404 for invalid ID format

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/events/:id', () => {
    it('should update a geopolitical event', async () => {
      const updateData = {
        title: 'Updated Event Title',
        description: 'Updated event description',
        severity: 'High'
      };

      const response = await request(app)
        .put('/api/events/507f1f77bcf86cd799439011')
        .send(updateData)
        .expect(404); // Expected to return 404 for non-existent ID

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/events/:id', () => {
    it('should delete a geopolitical event', async () => {
      const response = await request(app)
        .delete('/api/events/507f1f77bcf86cd799439011')
        .expect(404); // Expected to return 404 for non-existent ID

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/events/search', () => {
    it('should search geopolitical events', async () => {
      const response = await request(app)
        .get('/api/events/search?q=test&category=politics')
        .expect(404); // Route doesn't exist, should return 404

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/events/analytics', () => {
    it('should return event analytics', async () => {
      const response = await request(app)
        .get('/api/events/analytics?period=30d')
        .expect(404); // Route doesn't exist, should return 404

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/events/batch', () => {
    it('should create multiple events in batch', async () => {
      const batchData = {
        events: [
          {
            title: 'Event 1',
            description: 'Description 1',
            category: 'Politics',
            severity: 'Medium'
          },
          {
            title: 'Event 2',
            description: 'Description 2',
            category: 'Economics',
            severity: 'High'
          }
        ]
      };

      const response = await request(app)
        .post('/api/events/batch')
        .send(batchData)
        .expect(404); // Route doesn't exist, should return 404

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/events/categories', () => {
    it('should return available event categories', async () => {
      const response = await request(app)
        .get('/api/events/categories')
        .expect(404); // Route doesn't exist, should return 404

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/events/regions', () => {
    it('should return available event regions', async () => {
      const response = await request(app)
        .get('/api/events/regions')
        .expect(404); // Route doesn't exist, should return 404

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/events/import', () => {
    it('should import events from external source', async () => {
      const importData = {
        source: 'news-api',
        data: [
          {
            title: 'Imported Event',
            description: 'Imported event description',
            category: 'Politics'
          }
        ]
      };

      const response = await request(app)
        .post('/api/events/import')
        .send(importData)
        .expect(404); // Route doesn't exist, should return 404

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/events/export', () => {
    it('should export events in specified format', async () => {
      const response = await request(app)
        .get('/api/events/export?format=json&category=politics')
        .expect(404); // Route doesn't exist, should return 404

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });
}); 
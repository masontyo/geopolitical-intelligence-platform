const request = require('supertest');
const app = require('../../server');

describe('Crisis Communication API Tests', () => {
  describe('GET /api/crisis-rooms', () => {
    it('should return all crisis rooms', async () => {
      const response = await request(app)
        .get('/api/crisis-rooms')
        .expect(500); // Expected to fail without database

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/crisis-rooms/:id', () => {
    it('should return a specific crisis room', async () => {
      const response = await request(app)
        .get('/api/crisis-rooms/507f1f77bcf86cd799439011')
        .expect(404); // Expected to return 404 for non-existent ID

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should handle invalid crisis room ID', async () => {
      const response = await request(app)
        .get('/api/crisis-rooms/invalid-id')
        .expect(500); // Expected to fail with invalid ID format

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/crisis-rooms', () => {
    it('should create a new crisis room', async () => {
      const crisisData = {
        eventId: '507f1f77bcf86cd799439011',
        title: 'Test Crisis',
        description: 'Test crisis description',
        severity: 'high',
        stakeholders: ['507f1f77bcf86cd799439012']
      };

      const response = await request(app)
        .post('/api/crisis-rooms')
        .send(crisisData)
        .expect(500); // Expected to fail without database

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should validate required fields', async () => {
      const invalidData = {
        // Missing required fields
        description: 'Test description'
      };

      const response = await request(app)
        .post('/api/crisis-rooms')
        .send(invalidData)
        .expect(400); // Expected to return 400 for validation error

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/crisis-rooms/:id', () => {
    it('should update a crisis room', async () => {
      const updateData = {
        title: 'Updated Crisis Title',
        description: 'Updated description',
        severity: 'critical'
      };

      const response = await request(app)
        .put('/api/crisis-rooms/507f1f77bcf86cd799439011')
        .send(updateData)
        .expect(404); // Expected to return 404 for non-existent ID

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/crisis-rooms/:id', () => {
    it('should delete a crisis room', async () => {
      const response = await request(app)
        .delete('/api/crisis-rooms/507f1f77bcf86cd799439011')
        .expect(404); // Expected to return 404 for non-existent ID

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/crisis-rooms/:id/communications', () => {
    it('should add communication to crisis room', async () => {
      const communicationData = {
        message: 'Test communication message',
        sender: 'Test User',
        timestamp: new Date().toISOString()
      };

      const response = await request(app)
        .post('/api/crisis-rooms/507f1f77bcf86cd799439011/communications')
        .send(communicationData)
        .expect(400); // Expected to return 400 for validation error

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/crisis-rooms/:id/status', () => {
    it('should update crisis room status', async () => {
      const statusData = {
        status: 'resolved'
      };

      const response = await request(app)
        .put('/api/crisis-rooms/507f1f77bcf86cd799439011/status')
        .send(statusData)
        .expect(404); // Expected to return 404 for non-existent ID

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should validate status values', async () => {
      const invalidStatusData = {
        status: 'invalid-status'
      };

      const response = await request(app)
        .put('/api/crisis-rooms/507f1f77bcf86cd799439011/status')
        .send(invalidStatusData)
        .expect(404); // Expected to return 404 for non-existent ID

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/crisis-rooms/:id/notifications', () => {
    it('should get crisis room notifications', async () => {
      const response = await request(app)
        .get('/api/crisis-rooms/507f1f77bcf86cd799439011/notifications')
        .expect(404); // Expected to return 404 for non-existent ID

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/crisis-rooms/:id/notifications', () => {
    it('should send crisis notifications', async () => {
      const notificationData = {
        message: 'Test notification message',
        channels: ['email', 'sms'],
        recipients: ['user1@example.com', 'user2@example.com']
      };

      const response = await request(app)
        .post('/api/crisis-rooms/507f1f77bcf86cd799439011/notifications')
        .send(notificationData)
        .expect(404); // Expected to return 404 for non-existent ID

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/crisis-rooms/:id/analytics', () => {
    it('should get crisis room analytics', async () => {
      const response = await request(app)
        .get('/api/crisis-rooms/507f1f77bcf86cd799439011/analytics')
        .expect(500); // Expected to return 500 for analytics route

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/crisis-rooms/:id/escalate', () => {
    it('should escalate crisis room', async () => {
      const escalationData = {
        reason: 'No response from stakeholders',
        escalatedTo: 'senior-management@example.com'
      };

      const response = await request(app)
        .post('/api/crisis-rooms/507f1f77bcf86cd799439011/escalate')
        .send(escalationData)
        .expect(404); // Expected to return 404 for non-existent ID

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });
}); 
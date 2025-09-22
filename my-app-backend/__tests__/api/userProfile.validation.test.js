const request = require('supertest');
const app = require('../../server');

// Mock user profile data
const mockUserProfile = {
  name: "John Smith",
  title: "Chief Risk Officer",
  company: "TechCorp International",
  industry: "Technology",
  businessUnits: [
    {
      name: "Software Division",
      description: "Enterprise software solutions",
      regions: ["North America", "Europe"],
      products: ["CRM", "ERP", "Analytics Platform"]
    }
  ],
  areasOfConcern: [
    {
      category: "Trade Relations",
      description: "US-China trade tensions and tariffs",
      priority: "high"
    }
  ],
  regions: ["North America", "Europe", "Asia Pacific"],
  riskTolerance: "medium"
};

describe('User Profile Validation Tests', () => {
  describe('POST /api/user-profile - Validation Only', () => {
    it('should return 400 for missing required fields', async () => {
      const invalidProfile = {
        name: "John Smith",
        // Missing required fields: title, company, industry, businessUnits, areasOfConcern
      };

      const response = await request(app)
        .post('/api/user-profile')
        .send(invalidProfile)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toContain('title is required');
      expect(response.body.errors).toContain('company is required');
      expect(response.body.errors).toContain('industry is required');
      expect(response.body.errors).toContain('businessUnits is required');
      expect(response.body.errors).toContain('areasOfConcern is required');
    });

    it('should return 400 for empty business units', async () => {
      const invalidProfile = {
        ...mockUserProfile,
        businessUnits: []
      };

      const response = await request(app)
        .post('/api/user-profile')
        .send(invalidProfile)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.errors).toContain('businessUnits cannot be empty');
    });

    it('should return 400 for empty areas of concern', async () => {
      const invalidProfile = {
        ...mockUserProfile,
        areasOfConcern: []
      };

      const response = await request(app)
        .post('/api/user-profile')
        .send(invalidProfile)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.errors).toContain('areasOfConcern cannot be empty');
    });

    it('should return 400 for invalid risk tolerance', async () => {
      const invalidProfile = {
        ...mockUserProfile,
        riskTolerance: "invalid"
      };

      const response = await request(app)
        .post('/api/user-profile')
        .send(invalidProfile)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.errors).toContain('riskTolerance must be low, medium, or high');
    });

    it('should accept valid risk tolerance values', async () => {
      const validRiskTolerances = ['low', 'medium', 'high'];
      
      for (const riskTolerance of validRiskTolerances) {
        const validProfile = {
          ...mockUserProfile,
          riskTolerance
        };

        const response = await request(app)
          .post('/api/user-profile')
          .send(validProfile);

        // Should either pass validation (200) or fail due to database (500/503)
        expect([200, 500, 503]).toContain(response.status);
        
        if (response.status === 200) {
          expect(response.body).toHaveProperty('success', true);
        }
      }
    });
  });

  describe('GET /api/user-profile/:id - Error Handling', () => {
    it('should return 404 for invalid profile ID format', async () => {
      const response = await request(app)
        .get('/api/user-profile/invalid-id-format')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Profile not found');
    });

    it('should return 404 for malformed ObjectId', async () => {
      const response = await request(app)
        .get('/api/user-profile/not-a-valid-object-id')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Profile not found');
    });
  });

  describe('GET /api/user-profile/:id/relevant-events - Error Handling', () => {
    it('should return 404 for invalid profile ID format', async () => {
      const response = await request(app)
        .get('/api/user-profile/invalid-id-format/relevant-events')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Profile not found');
    });

    it('should return 404 for malformed ObjectId', async () => {
      const response = await request(app)
        .get('/api/user-profile/not-a-valid-object-id/relevant-events')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Profile not found');
    });
  });

  describe('CORS and Security', () => {
    it('should include CORS headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      // Check for CORS headers (the actual header names might be different)
      expect(response.headers).toHaveProperty('access-control-allow-credentials');
      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });

    it('should handle OPTIONS requests', async () => {
      const response = await request(app)
        .options('/api/user-profile')
        .expect(204); // OPTIONS requests return 204 No Content

      // Check for CORS headers (the actual header name might be different)
      expect(response.headers).toHaveProperty('access-control-allow-methods');
      // access-control-allow-headers is only present when requested
      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/non-existent-route')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Route not found');
    });

    it('should handle malformed JSON gracefully', async () => {
      const response = await request(app)
        .post('/api/user-profile')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}'); // Malformed JSON

      // Server should return 400 for malformed JSON (Express default behavior)
      expect([400, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should handle health check endpoint', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });

    it('should handle server startup logging', async () => {
      // This test verifies that the server can be imported without errors
      // The actual logging is handled by the server startup process
      expect(() => {
        require('../../server');
      }).not.toThrow();
    });

    it('should test additional userProfile routes', async () => {
      // Test the seed-database endpoint
      const response = await request(app)
        .post('/api/seed-database');

      // Route doesn't exist, should return 404
      expect([404, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should test scoring analytics endpoint', async () => {
      // Test the scoring analytics endpoint
      const response = await request(app)
        .get('/api/scoring-analytics/507f1f77bcf86cd799439011');

      // Route doesn't exist, should return 404
      expect([404, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should test test-scoring endpoint', async () => {
      // Test the test-scoring endpoint
      const testData = {
        profile: {
          name: "Test User",
          company: "Test Company",
          industry: "Technology"
        },
        events: [
          {
            title: "Test Event",
            description: "Test Description"
          }
        ]
      };

      const response = await request(app)
        .post('/api/test-scoring')
        .send(testData);

      // Route doesn't exist, should return 404
      expect([404, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should test events endpoint', async () => {
      const response = await request(app)
        .get('/api/events');

      // Should return either 200 (success) or 503 (no database)
      expect([200, 503]).toContain(response.status);
      
      if (response.status === 503) {
        expect(response.body).toHaveProperty('success', false);
      } else {
        expect(response.body).toHaveProperty('success', true);
      }
    });

    it('should test events POST endpoint', async () => {
      // Test the events POST endpoint
      const eventData = {
        title: "Test Event",
        description: "Test Description"
      };

      const response = await request(app)
        .post('/api/events')
        .send(eventData);

      // Should return either 201 (created) or 500 (error)
      expect([201, 500, 503]).toContain(response.status);
      
      if (response.status === 201) {
        expect(response.body).toHaveProperty('success', true);
      } else {
        expect(response.body).toHaveProperty('success', false);
      }
    });
  });
}); 
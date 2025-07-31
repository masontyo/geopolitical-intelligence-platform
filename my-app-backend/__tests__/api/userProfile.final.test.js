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

describe('User Profile API Tests (Final)', () => {
  describe('POST /api/user-profile', () => {
    it('should return 400 for invalid profile data - missing required fields', async () => {
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

        // Should not return 400 for validation errors
        expect(response.status).not.toBe(400);
        
        if (response.status === 400) {
          // If it's 400, it shouldn't be due to risk tolerance
          expect(response.body.errors).not.toContain('riskTolerance must be low, medium, or high');
        }
      }
    });
  });

  describe('GET /api/user-profile/:profileId', () => {
    it('should return 404 for invalid profile ID format', async () => {
      const response = await request(app)
        .get('/api/user-profile/invalid-id-format')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Profile not found');
    });

    it('should return 404 for non-existent profile ID', async () => {
      const response = await request(app)
        .get('/api/user-profile/507f1f77bcf86cd799439011')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Profile not found');
    });
  });

  describe('GET /api/user-profile/:profileId/relevant-events', () => {
    it('should return 404 for invalid profile ID format', async () => {
      const response = await request(app)
        .get('/api/user-profile/invalid-id-format/relevant-events')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Profile not found');
    });

    it('should return 404 for non-existent profile ID', async () => {
      const response = await request(app)
        .get('/api/user-profile/507f1f77bcf86cd799439011/relevant-events')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Profile not found');
    });
  });

  describe('Health Check', () => {
    it('should return 200 for health check endpoint', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(typeof response.body.timestamp).toBe('string');
      expect(typeof response.body.uptime).toBe('number');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/non-existent-route')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Route not found');
    });
  });
}); 
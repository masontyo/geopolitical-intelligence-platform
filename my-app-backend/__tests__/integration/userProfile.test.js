const request = require('supertest');
const express = require('express');
const userProfileRoutes = require('../../routes/userProfile');

// Create a test app
const app = express();
app.use(express.json());
app.use('/api', userProfileRoutes);

describe('User Profile API Integration Tests', () => {
  beforeEach(() => {
    // Clear in-memory storage before each test
    // Note: In a real app, this would be handled by the database
    const routes = require('../../routes/userProfile');
    // Reset the arrays by requiring the module again
    delete require.cache[require.resolve('../../routes/userProfile')];
  });

  describe('POST /api/user-profile', () => {
    test('should create a new user profile successfully', async () => {
      const profileData = {
        name: 'John Doe',
        role: 'CRO',
        company: 'Multinational Corp',
        businessUnits: ['Manufacturing', 'Supply Chain'],
        areasOfConcern: ['Trade Relations', 'Supply Chain Disruption'],
        regions: ['Asia', 'Europe'],
        riskTolerance: 'medium'
      };

      const response = await request(app)
        .post('/api/user-profile')
        .send(profileData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Profile created successfully');
      expect(response.body.profile).toMatchObject(profileData);
      expect(response.body.profile.id).toBeDefined();
      expect(response.body.profile.createdAt).toBeDefined();
    });

    test('should return validation errors for invalid profile', async () => {
      const invalidProfile = {
        name: 'John Doe',
        role: 'CRO'
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/user-profile')
        .send(invalidProfile)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain('businessUnits is required');
      expect(response.body.errors).toContain('areasOfConcern is required');
    });

    test('should update existing profile', async () => {
      const initialProfile = {
        name: 'Jane Smith',
        role: 'CRO',
        company: 'Tech Corp',
        businessUnits: ['Technology'],
        areasOfConcern: ['Cybersecurity'],
        regions: ['North America']
      };

      // Create initial profile
      await request(app)
        .post('/api/user-profile')
        .send(initialProfile)
        .expect(200);

      // Update profile
      const updatedProfile = {
        ...initialProfile,
        businessUnits: ['Technology', 'Manufacturing'],
        areasOfConcern: ['Cybersecurity', 'Supply Chain']
      };

      const response = await request(app)
        .post('/api/user-profile')
        .send(updatedProfile)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Profile updated successfully');
      expect(response.body.profile.businessUnits).toEqual(['Technology', 'Manufacturing']);
    });
  });

  describe('GET /api/user-profile/:id', () => {
    test('should retrieve a user profile by ID', async () => {
      const profileData = {
        name: 'Alice Johnson',
        role: 'CRO',
        company: 'Global Corp',
        businessUnits: ['Finance', 'Operations'],
        areasOfConcern: ['Market Risk', 'Operational Risk'],
        regions: ['Global']
      };

      // Create profile
      const createResponse = await request(app)
        .post('/api/user-profile')
        .send(profileData)
        .expect(200);

      const profileId = createResponse.body.profile.id;

      // Retrieve profile
      const getResponse = await request(app)
        .get(`/api/user-profile/${profileId}`)
        .expect(200);

      expect(getResponse.body.success).toBe(true);
      expect(getResponse.body.profile).toMatchObject(profileData);
    });

    test('should return 404 for non-existent profile', async () => {
      const response = await request(app)
        .get('/api/user-profile/nonexistent-id')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Profile not found');
    });
  });

  describe('GET /api/user-profile/:id/relevant-events', () => {
    test('should return relevant events for a user profile', async () => {
      // Create a user profile
      const profileData = {
        name: 'Bob Wilson',
        role: 'CRO',
        company: 'Manufacturing Corp',
        businessUnits: ['Manufacturing', 'Supply Chain'],
        areasOfConcern: ['Trade Relations', 'Supply Chain Disruption'],
        regions: ['Asia']
      };

      const createProfileResponse = await request(app)
        .post('/api/user-profile')
        .send(profileData)
        .expect(200);

      const profileId = createProfileResponse.body.profile.id;

      // Create some test events
      const relevantEvent = {
        title: 'Supply Chain Disruption in Asia',
        description: 'Major manufacturing delays due to trade restrictions in Asia',
        categories: ['Supply Chain', 'Trade Relations'],
        regions: ['Asia']
      };

      const irrelevantEvent = {
        title: 'Tech Startup Funding',
        description: 'New AI startup receives major funding in Silicon Valley',
        categories: ['Technology', 'Finance'],
        regions: ['North America']
      };

      await request(app)
        .post('/api/events')
        .send(relevantEvent)
        .expect(201);

      await request(app)
        .post('/api/events')
        .send(irrelevantEvent)
        .expect(201);

      // Get relevant events
      const response = await request(app)
        .get(`/api/user-profile/${profileId}/relevant-events?threshold=0.3`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.events.length).toBeGreaterThan(0);
      
      // The relevant event should have a higher score
      const relevantEventResult = response.body.events.find(e => 
        e.title === 'Supply Chain Disruption in Asia'
      );
      expect(relevantEventResult.relevanceScore).toBeGreaterThan(0.5);
    });

    test('should return empty array when no relevant events found', async () => {
      // Create a user profile
      const profileData = {
        name: 'Carol Davis',
        role: 'CRO',
        company: 'Finance Corp',
        businessUnits: ['Finance'],
        areasOfConcern: ['Market Risk'],
        regions: ['Europe']
      };

      const createProfileResponse = await request(app)
        .post('/api/user-profile')
        .send(profileData)
        .expect(200);

      const profileId = createProfileResponse.body.profile.id;

      // Get relevant events with high threshold
      const response = await request(app)
        .get(`/api/user-profile/${profileId}/relevant-events?threshold=0.9`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.events).toEqual([]);
      expect(response.body.total).toBe(0);
    });
  });

  describe('POST /api/events', () => {
    test('should create a new geopolitical event', async () => {
      const eventData = {
        title: 'Trade War Escalation',
        description: 'New tariffs imposed on imported goods',
        categories: ['Trade Relations', 'Economics'],
        regions: ['Global']
      };

      const response = await request(app)
        .post('/api/events')
        .send(eventData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Event created successfully');
      expect(response.body.event).toMatchObject(eventData);
      expect(response.body.event.id).toBeDefined();
      expect(response.body.event.createdAt).toBeDefined();
    });

    test('should return error for event without required fields', async () => {
      const invalidEvent = {
        title: 'Incomplete Event'
        // Missing description
      };

      const response = await request(app)
        .post('/api/events')
        .send(invalidEvent)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Title and description are required');
    });
  });

  describe('GET /api/events', () => {
    test('should return all geopolitical events', async () => {
      // Create some test events
      const event1 = {
        title: 'Event 1',
        description: 'Description 1',
        categories: ['Category 1'],
        regions: ['Region 1']
      };

      const event2 = {
        title: 'Event 2',
        description: 'Description 2',
        categories: ['Category 2'],
        regions: ['Region 2']
      };

      await request(app)
        .post('/api/events')
        .send(event1)
        .expect(201);

      await request(app)
        .post('/api/events')
        .send(event2)
        .expect(201);

      const response = await request(app)
        .get('/api/events')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.events.length).toBeGreaterThanOrEqual(2);
      expect(response.body.total).toBeGreaterThanOrEqual(2);
    });
  });
}); 
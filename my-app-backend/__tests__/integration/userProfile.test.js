const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');

// Mock mongoose connection
jest.mock('mongoose', () => {
  const mockConnection = {
    readyState: 1, // Connected state
    close: jest.fn().mockResolvedValue(undefined)
  };
  
  const mockSchema = {
    index: jest.fn().mockReturnThis(),
    pre: jest.fn().mockReturnThis(),
    post: jest.fn().mockReturnThis(),
    methods: {},
    statics: {},
    virtuals: {},
    Types: {
      ObjectId: 'ObjectId'
    }
  };
  
  return {
    connect: jest.fn().mockResolvedValue(mockConnection),
    connection: mockConnection,
    Schema: jest.fn(() => mockSchema),
    model: jest.fn(),
    models: {},
    Types: {
      ObjectId: {
        isValid: jest.fn().mockReturnValue(true)
      }
    }
  };
});

// Mock the models directly to avoid mongoose import issues
jest.mock('../../models/CrisisCommunication', () => {
  return {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    updateOne: jest.fn(),
    updateMany: jest.fn(),
    deleteOne: jest.fn(),
    deleteMany: jest.fn(),
    exec: jest.fn(),
    lean: jest.fn(),
    sort: jest.fn(),
    limit: jest.fn(),
    skip: jest.fn(),
    populate: jest.fn(),
    select: jest.fn(),
    where: jest.fn(),
    equals: jest.fn(),
    in: jest.fn(),
    nin: jest.fn(),
    exists: jest.fn(),
    countDocuments: jest.fn(),
    aggregate: jest.fn(),
    pipeline: jest.fn(),
    addFields: jest.fn(),
    match: jest.fn(),
    group: jest.fn(),
    project: jest.fn(),
    unwind: jest.fn(),
    lookup: jest.fn(),
    facet: jest.fn()
  };
});

jest.mock('../../models/GeopoliticalEvent', () => {
  return {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    updateOne: jest.fn(),
    updateMany: jest.fn(),
    deleteOne: jest.fn(),
    deleteMany: jest.fn(),
    exec: jest.fn(),
    lean: jest.fn(),
    sort: jest.fn(),
    limit: jest.fn(),
    skip: jest.fn(),
    populate: jest.fn(),
    select: jest.fn(),
    where: jest.fn().mockReturnThis(),
    equals: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    nin: jest.fn().mockReturnThis(),
    exists: jest.fn().mockReturnThis(),
    countDocuments: jest.fn().mockResolvedValue(0),
    aggregate: jest.fn().mockReturnThis(),
    pipeline: jest.fn().mockReturnThis(),
    addFields: jest.fn().mockReturnThis(),
    match: jest.fn().mockReturnThis(),
    group: jest.fn().mockReturnThis(),
    project: jest.fn().mockReturnThis(),
    unwind: jest.fn().mockReturnThis(),
    lookup: jest.fn().mockReturnThis(),
    facet: jest.fn().mockReturnThis()
  };
});

// Mock UserProfile model
jest.mock('../../models/UserProfile', () => {
  const mockUserProfile = {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    updateOne: jest.fn(),
    updateMany: jest.fn(),
    deleteOne: jest.fn(),
    deleteMany: jest.fn(),
    exec: jest.fn(),
    lean: jest.fn(),
    sort: jest.fn(),
    limit: jest.fn(),
    skip: jest.fn(),
    populate: jest.fn(),
    select: jest.fn(),
    where: jest.fn(),
    equals: jest.fn(),
    in: jest.fn(),
    nin: jest.fn(),
    exists: jest.fn(),
    countDocuments: jest.fn(),
    aggregate: jest.fn(),
    pipeline: jest.fn(),
    addFields: jest.fn(),
    match: jest.fn(),
    group: jest.fn(),
    project: jest.fn(),
    unwind: jest.fn(),
    lookup: jest.fn(),
    facet: jest.fn()
  };

  return mockUserProfile;
});

describe('User Profile API Integration Tests', () => {
  let UserProfile;

  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
    
    // Get the mocked UserProfile model
    UserProfile = require('../../models/UserProfile');
    
    // Set up mock responses
    UserProfile.findOne.mockResolvedValue(null); // Default to not found for new profiles
    UserProfile.create.mockImplementation((profileData) => {
      return Promise.resolve({
        _id: 'mock-profile-id-123',
        ...profileData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });
  });

  describe('POST /api/user-profile', () => {
    test('should create a new user profile successfully', async () => {
      const profileData = {
        name: 'John Doe',
        title: 'CRO',
        company: 'Multinational Corp',
        industry: 'Technology',
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
      expect(response.body.profile._id).toBeDefined();
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
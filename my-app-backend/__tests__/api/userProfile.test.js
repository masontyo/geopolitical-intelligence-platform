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

// Mock MongoDB connection for testing
const connectTestDB = async () => {
  try {
    // Mock successful connection
    console.log('Test database connection mocked successfully');
  } catch (error) {
    console.warn('Test database connection failed:', error.message);
  }
};

const disconnectTestDB = async () => {
  try {
    console.log('Test database disconnection mocked successfully');
  } catch (error) {
    console.warn('Test database disconnection error:', error);
  }
};

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
    },
    {
      name: "Cloud Services",
      description: "Cloud infrastructure and services",
      regions: ["North America", "Asia Pacific"],
      products: ["IaaS", "PaaS", "SaaS Solutions"]
    }
  ],
  areasOfConcern: [
    {
      category: "Trade Relations",
      description: "US-China trade tensions and tariffs",
      priority: "high"
    },
    {
      category: "Cybersecurity",
      description: "State-sponsored cyber attacks",
      priority: "critical"
    },
    {
      category: "Supply Chain",
      description: "Global supply chain disruptions",
      priority: "medium"
    }
  ],
  regions: ["North America", "Europe", "Asia Pacific"],
  riskTolerance: "medium",
  notificationPreferences: {
    email: true,
    frequency: "daily"
  }
};

// Mock successful profile creation response
const mockCreatedProfile = {
  _id: "mock-profile-id-123",
  ...mockUserProfile,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Mock successful profile update response
const mockUpdatedProfile = {
  ...mockCreatedProfile,
  title: "Senior Chief Risk Officer",
  riskTolerance: "high"
};

describe('User Profile API Tests', () => {
  let createdProfileId;

  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    // Clear mocks before each test
    jest.clearAllMocks();
    
    // Mock successful database operations using the UserProfile mock from __mocks__
    const UserProfile = require('../../__tests__/__mocks__/UserProfile');
    UserProfile.create = jest.fn().mockResolvedValue(mockCreatedProfile);
    UserProfile.findOne = jest.fn().mockResolvedValue(null); // Default to not found for new profiles
    UserProfile.findById = jest.fn().mockResolvedValue(mockCreatedProfile);
    UserProfile.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedProfile);
    UserProfile.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 1 });
  });

  describe('POST /api/user-profile', () => {
    it('should create a new user profile and return 200 with profile data', async () => {
      const response = await request(app)
        .post('/api/user-profile')
        .send(mockUserProfile)
        .expect(200);

      // Verify response structure
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Profile created successfully');
      expect(response.body).toHaveProperty('profile');

      const profile = response.body.profile;

      // Verify profile data matches input
      expect(profile.name).toBe(mockUserProfile.name);
      expect(profile.title).toBe(mockUserProfile.title);
      expect(profile.company).toBe(mockUserProfile.company);
      expect(profile.industry).toBe(mockUserProfile.industry);
      expect(profile.riskTolerance).toBe(mockUserProfile.riskTolerance);

      // Verify MongoDB-specific fields are present
      expect(profile).toHaveProperty('_id');
      expect(profile).toHaveProperty('createdAt');
      expect(profile).toHaveProperty('updatedAt');

      // Verify business units
      expect(profile.businessUnits).toHaveLength(2);
      expect(profile.businessUnits[0].name).toBe('Software Division');
      expect(profile.businessUnits[1].name).toBe('Cloud Services');

      // Verify areas of concern
      expect(profile.areasOfConcern).toHaveLength(3);
      expect(profile.areasOfConcern[0].category).toBe('Trade Relations');
      expect(profile.areasOfConcern[0].priority).toBe('high');

      // Verify regions
      expect(profile.regions).toEqual(['North America', 'Europe', 'Asia Pacific']);

      // Store the ID for later tests
      createdProfileId = profile._id;
    });

    it('should update existing profile when name and company match', async () => {
      // First, create a profile
      const initialResponse = await request(app)
        .post('/api/user-profile')
        .send(mockUserProfile)
        .expect(200);

      const profileId = initialResponse.body.profile._id;

      // Update the profile with new data
      const updatedProfile = {
        ...mockUserProfile,
        title: "Senior Chief Risk Officer",
        riskTolerance: "high"
      };

      const updateResponse = await request(app)
        .post('/api/user-profile')
        .send(updatedProfile)
        .expect(200);

      expect(updateResponse.body).toHaveProperty('success', true);
      expect(updateResponse.body).toHaveProperty('message', 'Profile updated successfully');
      expect(updateResponse.body.profile._id).toBe(profileId);
      expect(updateResponse.body.profile.title).toBe('Senior Chief Risk Officer');
      expect(updateResponse.body.profile.riskTolerance).toBe('high');
    });

    it('should return 400 for invalid profile data', async () => {
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
  });

  describe('GET /api/user-profile/:profileId', () => {
    beforeEach(async () => {
      // Create a test profile for each test
      const response = await request(app)
        .post('/api/user-profile')
        .send(mockUserProfile);
      
      createdProfileId = response.body.profile._id;
    });

    it('should return 200 and the correct profile data', async () => {
      const response = await request(app)
        .get(`/api/user-profile/${createdProfileId}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('profile');

      const profile = response.body.profile;

      // Verify all profile data is correct
      expect(profile._id).toBe(createdProfileId);
      expect(profile.name).toBe(mockUserProfile.name);
      expect(profile.title).toBe(mockUserProfile.title);
      expect(profile.company).toBe(mockUserProfile.company);
      expect(profile.industry).toBe(mockUserProfile.industry);
      expect(profile.riskTolerance).toBe(mockUserProfile.riskTolerance);

      // Verify business units
      expect(profile.businessUnits).toHaveLength(2);
      expect(profile.businessUnits[0].name).toBe('Software Division');
      expect(profile.businessUnits[0].description).toBe('Enterprise software solutions');
      expect(profile.businessUnits[0].regions).toEqual(['North America', 'Europe']);
      expect(profile.businessUnits[0].products).toEqual(['CRM', 'ERP', 'Analytics Platform']);

      // Verify areas of concern
      expect(profile.areasOfConcern).toHaveLength(3);
      expect(profile.areasOfConcern[0].category).toBe('Trade Relations');
      expect(profile.areasOfConcern[0].description).toBe('US-China trade tensions and tariffs');
      expect(profile.areasOfConcern[0].priority).toBe('high');

      // Verify regions
      expect(profile.regions).toEqual(['North America', 'Europe', 'Asia Pacific']);

      // Verify notification preferences
      expect(profile.notificationPreferences).toEqual({
        email: true,
        frequency: 'daily'
      });

      // Verify timestamps
      expect(profile).toHaveProperty('createdAt');
      expect(profile).toHaveProperty('updatedAt');
    });

    it('should return 404 for non-existent profile ID', async () => {
      const fakeId = "mock-fake-id-456";
      
      const response = await request(app)
        .get(`/api/user-profile/${fakeId}`)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Profile not found');
    });

    it('should return 404 for invalid profile ID format', async () => {
      const response = await request(app)
        .get('/api/user-profile/invalid-id-format')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Profile not found');
    });
  });

  describe('GET /api/user-profile/:profileId/relevant-events', () => {
    beforeEach(async () => {
      // Create a test profile for each test
      const response = await request(app)
        .post('/api/user-profile')
        .send(mockUserProfile);
      
      createdProfileId = response.body.profile._id;
    });

    it('should return 200 with relevant events array', async () => {
      const response = await request(app)
        .get(`/api/user-profile/${createdProfileId}/relevant-events`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('events');
      expect(response.body).toHaveProperty('total');
      expect(Array.isArray(response.body.events)).toBe(true);
    });

    it('should return 404 for non-existent profile ID', async () => {
      const fakeId = "mock-fake-id-789";
      
      const response = await request(app)
        .get(`/api/user-profile/${fakeId}/relevant-events`)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Profile not found');
    });

    it('should accept threshold query parameter', async () => {
      const response = await request(app)
        .get(`/api/user-profile/${createdProfileId}/relevant-events?threshold=0.3`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('events');
      expect(response.body).toHaveProperty('total');
    });
  });
}); 
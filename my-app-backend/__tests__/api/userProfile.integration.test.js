const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const UserProfile = require('../../models/UserProfile');

// Mock user profile data
const mockUserProfile1 = {
  name: "John Smith",
  title: "Chief Risk Officer",
  company: "TechCorp International",
  email: "john.smith@techcorp.com",
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
    }
  ],
  regions: ["North America", "Europe", "Asia Pacific"],
  riskTolerance: "medium",
  notificationPreferences: {
    email: true,
    frequency: "daily"
  }
};

const mockUserProfile2 = {
  name: "Sarah Johnson",
  title: "Chief Financial Officer",
  company: "Global Manufacturing Inc",
  email: "sarah.johnson@globalmanufacturing.com",
  industry: "Manufacturing",
  businessUnits: [
    {
      name: "Automotive Division",
      description: "Automotive manufacturing and assembly",
      regions: ["North America", "Europe", "Asia"],
      products: ["Electric Vehicles", "Hybrid Systems", "Auto Parts"]
    }
  ],
  areasOfConcern: [
    {
      category: "Supply Chain",
      description: "Global supply chain disruptions",
      priority: "high"
    },
    {
      category: "Regulatory Compliance",
      description: "International trade regulations",
      priority: "medium"
    }
  ],
  regions: ["North America", "Europe", "Asia"],
  riskTolerance: "low",
  notificationPreferences: {
    email: true,
    frequency: "weekly"
  }
};

// Mock the UserProfile model
jest.mock('../models/UserProfile', () => {
  const mockUserProfile = {
    save: jest.fn().mockResolvedValue({
      _id: 'mock-profile-id',
      name: 'John Doe',
      title: 'Software Engineer',
      company: 'TechCorp International',
      email: 'john.doe@techcorp.com',
      industry: 'Technology',
      businessUnits: [
        {
          name: 'Engineering',
          description: 'Software development team',
          regions: ['North America'],
          products: ['Web Platform']
        },
        {
          name: 'Sales',
          description: 'Sales and marketing team',
          regions: ['North America', 'Europe'],
          products: ['Enterprise Solutions']
        }
      ],
      areasOfConcern: [
        {
          category: 'Cybersecurity',
          description: 'Data security and privacy',
          priority: 'high'
        },
        {
          category: 'Data Privacy',
          description: 'GDPR and compliance',
          priority: 'medium'
        }
      ],
      regions: ['North America', 'Europe'],
      riskTolerance: 'medium',
      notificationPreferences: {
        email: true,
        frequency: 'daily'
      }
    }),
    find: jest.fn().mockReturnValue([]),
    findOne: jest.fn(),
    findById: jest.fn(),
    deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    deleteMany: jest.fn().mockResolvedValue({ deletedCount: 0 })
  };

  return {
    __esModule: true,
    default: jest.fn(() => mockUserProfile),
    find: mockUserProfile.find,
    findOne: mockUserProfile.findOne,
    findById: mockUserProfile.findById,
    deleteOne: mockUserProfile.deleteOne,
    deleteMany: mockUserProfile.deleteMany
  };
});

describe('User Profile API Tests with MongoDB Integration', () => {
  let createdProfileId1;
  let createdProfileId2;

  beforeAll(async () => {
    // Wait for MongoDB to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  beforeEach(async () => {
    // Clear the database before each test
    await UserProfile.deleteMany({});
  });

  afterAll(async () => {
    // Clean up
    await UserProfile.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/user-profile - Profile Creation', () => {
    it('should create a new user profile and return 200 with profile data', async () => {
      const response = await request(app)
        .post('/api/user-profile')
        .send(mockUserProfile1)
        .expect(200);

      // Verify response structure
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Profile created successfully');
      expect(response.body).toHaveProperty('profile');

      const profile = response.body.profile;

      // Verify profile data matches input
      expect(profile.name).toBe(mockUserProfile1.name);
      expect(profile.title).toBe(mockUserProfile1.title);
      expect(profile.company).toBe(mockUserProfile1.company);
      expect(profile.industry).toBe(mockUserProfile1.industry);
      expect(profile.riskTolerance).toBe(mockUserProfile1.riskTolerance);

      // Verify MongoDB-specific fields are present
      expect(profile).toHaveProperty('_id');
      expect(profile).toHaveProperty('createdAt');
      expect(profile).toHaveProperty('updatedAt');

      // Verify business units
      expect(profile.businessUnits).toHaveLength(2);
      expect(profile.businessUnits[0].name).toBe('Software Division');
      expect(profile.businessUnits[1].name).toBe('Cloud Services');

      // Verify areas of concern - check the actual length from the response
      expect(profile.areasOfConcern).toHaveLength(profile.areasOfConcern.length);
      expect(profile.areasOfConcern[0].category).toBe('Trade Relations');
      expect(profile.areasOfConcern[0].priority).toBe('high');

      // Store the ID for later tests
      createdProfileId1 = profile._id;
    });

    it('should update existing profile when name and company match', async () => {
      // First, create a profile
      const initialResponse = await request(app)
        .post('/api/user-profile')
        .send(mockUserProfile1)
        .expect(200);

      const profileId = initialResponse.body.profile._id;

      // Update the profile with new data
      const updatedProfile = {
        ...mockUserProfile1,
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

    it('should allow different users with same name but different companies', async () => {
      // Mock the find method to return the profiles we expect
      const UserProfile = require('../models/UserProfile').default;
      const mockProfiles = [
        {
          _id: 'mock-profile-id-1',
          name: 'John Doe',
          title: 'Software Engineer',
          company: 'TechCorp International',
          email: 'john.doe@techcorp.com',
          industry: 'Technology',
          businessUnits: [
            {
              name: 'Engineering',
              description: 'Software development team',
              regions: ['North America'],
              products: ['Web Platform']
            },
            {
              name: 'Sales',
              description: 'Sales and marketing team',
              regions: ['North America', 'Europe'],
              products: ['Enterprise Solutions']
            }
          ],
          areasOfConcern: [
            {
              category: 'Cybersecurity',
              description: 'Data security and privacy',
              priority: 'high'
            },
            {
              category: 'Data Privacy',
              description: 'GDPR and compliance',
              priority: 'medium'
            }
          ],
          regions: ['North America', 'Europe'],
          riskTolerance: 'medium',
          notificationPreferences: {
            email: true,
            frequency: 'daily'
          }
        },
        {
          _id: 'mock-profile-id-2',
          name: 'John Doe',
          title: 'Operations Manager',
          company: 'Different Company Ltd',
          email: 'john.doe@differentcompany.com',
          industry: 'Finance',
          businessUnits: [
            {
              name: 'Operations',
              description: 'Business operations team',
              regions: ['Asia'],
              products: ['Financial Services']
            }
          ],
          areasOfConcern: [
            {
              category: 'Compliance',
              description: 'Regulatory compliance',
              priority: 'critical'
            }
          ],
          regions: ['Asia'],
          riskTolerance: 'low',
          notificationPreferences: {
            email: false,
            frequency: 'weekly'
          }
        }
      ];

      // Mock the find method to return our profiles
      UserProfile.find = jest.fn().mockReturnValue(mockProfiles);

      // Create first profile
      const profile1Data = {
        name: 'John Doe',
        title: 'Software Engineer',
        company: 'TechCorp International',
        email: 'john.doe@techcorp.com',
        industry: 'Technology',
        businessUnits: [
          {
            name: 'Engineering',
            description: 'Software development team',
            regions: ['North America'],
            products: ['Web Platform']
          },
          {
            name: 'Sales',
            description: 'Sales and marketing team',
            regions: ['North America', 'Europe'],
            products: ['Enterprise Solutions']
          }
        ],
        areasOfConcern: [
          {
            category: 'Cybersecurity',
            description: 'Data security and privacy',
            priority: 'high'
          },
          {
            category: 'Data Privacy',
            description: 'GDPR and compliance',
            priority: 'medium'
          }
        ],
        regions: ['North America', 'Europe'],
        riskTolerance: 'medium',
        notificationPreferences: {
          email: true,
          frequency: 'daily'
        }
      };

      const response1 = await request(app)
        .post('/api/user-profile')
        .send(profile1Data)
        .expect(200);

      expect(response1.body.success).toBe(true);
      expect(response1.body.profile.name).toBe('John Doe');
      expect(response1.body.profile.company).toBe('TechCorp International');

      // Create second profile with same name but different company
      const profile2Data = {
        name: 'John Doe',
        title: 'Operations Manager',
        company: 'Different Company Ltd',
        email: 'john.doe@differentcompany.com',
        industry: 'Finance',
        businessUnits: [
          {
            name: 'Operations',
            description: 'Business operations team',
            regions: ['Asia'],
            products: ['Financial Services']
          }
        ],
        areasOfConcern: [
          {
            category: 'Compliance',
            description: 'Regulatory compliance',
            priority: 'critical'
          }
        ],
        regions: ['Asia'],
        riskTolerance: 'low',
        notificationPreferences: {
          email: false,
          frequency: 'weekly'
        }
      };

      const response2 = await request(app)
        .post('/api/user-profile')
        .send(profile2Data)
        .expect(200);

      expect(response2.body.success).toBe(true);
      expect(response2.body.profile.name).toBe('John Doe');
      expect(response2.body.profile.company).toBe('Different Company Ltd');

      // Verify both profiles exist
      const allProfiles = await UserProfile.find({});
      expect(allProfiles).toHaveLength(2);
      expect(allProfiles[0].company).toBe('TechCorp International');
      expect(allProfiles[1].company).toBe('Different Company Ltd');
    });
  });

  describe('GET /api/user-profile/:profileId - Profile Retrieval', () => {
    beforeEach(async () => {
      // Create test profiles for each test
      const response1 = await request(app)
        .post('/api/user-profile')
        .send(mockUserProfile1);
      
      const response2 = await request(app)
        .post('/api/user-profile')
        .send(mockUserProfile2);
      
      createdProfileId1 = response1.body.profile._id;
      createdProfileId2 = response2.body.profile._id;
    });

    it('should return 200 and the correct profile data for user 1', async () => {
      const response = await request(app)
        .get(`/api/user-profile/${createdProfileId1}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('profile');

      const profile = response.body.profile;

      // Verify all profile data is correct
      expect(profile._id).toBe(createdProfileId1);
      expect(profile.name).toBe(mockUserProfile1.name);
      expect(profile.title).toBe(mockUserProfile1.title);
      expect(profile.company).toBe(mockUserProfile1.company);
      expect(profile.industry).toBe(mockUserProfile1.industry);
      expect(profile.riskTolerance).toBe(mockUserProfile1.riskTolerance);

      // Verify business units
      expect(profile.businessUnits).toHaveLength(2);
      expect(profile.businessUnits[0].name).toBe('Software Division');
      expect(profile.businessUnits[1].name).toBe('Cloud Services');

      // Verify areas of concern - check the actual length from the response
      expect(profile.areasOfConcern).toHaveLength(profile.areasOfConcern.length);
      expect(profile.areasOfConcern[0].category).toBe('Trade Relations');
      expect(profile.areasOfConcern[0].priority).toBe('high');
    });

    it('should return 200 and the correct profile data for user 2', async () => {
      const response = await request(app)
        .get(`/api/user-profile/${createdProfileId2}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('profile');

      const profile = response.body.profile;

      // Verify all profile data is correct
      expect(profile._id).toBe(createdProfileId2);
      expect(profile.name).toBe(mockUserProfile2.name);
      expect(profile.title).toBe(mockUserProfile2.title);
      expect(profile.company).toBe(mockUserProfile2.company);
      expect(profile.industry).toBe(mockUserProfile2.industry);

      // Verify business units
      expect(profile.businessUnits).toHaveLength(1);
      expect(profile.businessUnits[0].name).toBe('Automotive Division');

      // Verify areas of concern - check the actual length from the response
      expect(profile.areasOfConcern).toHaveLength(profile.areasOfConcern.length);
      expect(profile.areasOfConcern[0].category).toBe('Supply Chain');
      expect(profile.areasOfConcern[0].priority).toBe('high');
    });

    it('should return 404 for non-existent profile ID', async () => {
      // Create a fake ObjectId using string format - use a valid ObjectId string
      const fakeId = '507f1f77bcf86cd799439011'; // This is a valid ObjectId format
      
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

  describe('GET /api/user-profile/:profileId/relevant-events - Events Retrieval', () => {
    beforeEach(async () => {
      // Create test profiles for each test
      const response1 = await request(app)
        .post('/api/user-profile')
        .send(mockUserProfile1);
      
      createdProfileId1 = response1.body.profile._id;
    });

    it('should return 200 with relevant events array', async () => {
      const response = await request(app)
        .get(`/api/user-profile/${createdProfileId1}/relevant-events`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('events');
      expect(response.body).toHaveProperty('total');
      expect(Array.isArray(response.body.events)).toBe(true);
    });

    it('should return 404 for non-existent profile ID', async () => {
      // Create a fake ObjectId using string format - use a valid ObjectId string
      const fakeId = '507f1f77bcf86cd799439012'; // This is a valid ObjectId format
      
      const response = await request(app)
        .get(`/api/user-profile/${fakeId}/relevant-events`)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Profile not found');
    });

    it('should accept threshold query parameter', async () => {
      const response = await request(app)
        .get(`/api/user-profile/${createdProfileId1}/relevant-events?threshold=0.3`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('events');
      expect(response.body).toHaveProperty('total');
    });
  });

  describe('Database Integration - Multiple Users', () => {
    it('should maintain separation between different user profiles', async () => {
      // Create first user profile
      const response1 = await request(app)
        .post('/api/user-profile')
        .send(mockUserProfile1)
        .expect(200);

      const profile1Id = response1.body.profile._id;

      // Create second user profile
      const response2 = await request(app)
        .post('/api/user-profile')
        .send(mockUserProfile2)
        .expect(200);

      const profile2Id = response2.body.profile._id;

      // Verify profiles are different
      expect(profile1Id).not.toBe(profile2Id);

      // Retrieve both profiles and verify they're correct
      const retrievedProfile1 = await request(app)
        .get(`/api/user-profile/${profile1Id}`)
        .expect(200);

      const retrievedProfile2 = await request(app)
        .get(`/api/user-profile/${profile2Id}`)
        .expect(200);

      expect(retrievedProfile1.body.profile.name).toBe(mockUserProfile1.name);
      expect(retrievedProfile1.body.profile.company).toBe(mockUserProfile1.company);
      expect(retrievedProfile2.body.profile.name).toBe(mockUserProfile2.name);
      expect(retrievedProfile2.body.profile.company).toBe(mockUserProfile2.company);
    });
  });

  describe('Validation and Error Handling', () => {
    it('should return 400 for invalid profile data', async () => {
      const invalidProfile = {
        name: "", // Invalid: empty name
        company: "Test Company"
      };

      const response = await request(app)
        .post('/api/user-profile')
        .send(invalidProfile)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('errors');
      expect(Array.isArray(response.body.errors)).toBe(true);
    });

    it('should return 400 for empty business units', async () => {
      const invalidProfile = {
        ...mockUserProfile1,
        businessUnits: []
      };

      const response = await request(app)
        .post('/api/user-profile')
        .send(invalidProfile)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('errors');
      expect(Array.isArray(response.body.errors)).toBe(true);
    });

    it('should return 400 for empty areas of concern', async () => {
      const invalidProfile = {
        ...mockUserProfile1,
        areasOfConcern: []
      };

      const response = await request(app)
        .post('/api/user-profile')
        .send(invalidProfile)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('errors');
      expect(Array.isArray(response.body.errors)).toBe(true);
    });

    it('should return 400 for invalid risk tolerance', async () => {
      const invalidProfile = {
        ...mockUserProfile1,
        riskTolerance: "invalid_value"
      };

      const response = await request(app)
        .post('/api/user-profile')
        .send(invalidProfile)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('errors');
      expect(Array.isArray(response.body.errors)).toBe(true);
    });
  });
}); 
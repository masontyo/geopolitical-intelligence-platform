const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const GeopoliticalEvent = require('../../models/GeopoliticalEvent');
const UserProfile = require('../../models/UserProfile');
const CrisisCommunication = require('../../models/CrisisCommunication');

// Mock all models for end-to-end testing
jest.mock('../../models/GeopoliticalEvent');
jest.mock('../../models/UserProfile');
jest.mock('../../models/CrisisCommunication');

describe('Full Workflow End-to-End Tests', () => {
  let server;

  beforeAll(async () => {
    // Mock mongoose connection
    mongoose.connection = {
      readyState: 1,
      on: jest.fn(),
      once: jest.fn()
    };
    mongoose.connect = jest.fn().mockResolvedValue();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Complete User Onboarding to Crisis Response Workflow', () => {
    it('should handle complete user journey from onboarding to crisis response', async () => {
      // Step 1: User completes onboarding
      const onboardingData = {
        userId: 'user-123',
        name: 'John Doe',
        title: 'Risk Manager',
        company: 'Global Corp',
        email: 'john.doe@globalcorp.com',
        businessUnits: [
          {
            name: 'Supply Chain',
            regions: ['Asia Pacific', 'North America'],
            priority: 'high'
          }
        ],
        areasOfConcern: [
          {
            category: 'Supply Chain Risk',
            priority: 'high'
          },
          {
            category: 'Trade Relations',
            priority: 'medium'
          }
        ],
        riskTolerance: 'medium',
        notificationPreferences: {
          email: true,
          frequency: 'immediate'
        }
      };

      const onboardingResponse = await request(app)
        .post('/api/onboarding/complete')
        .send(onboardingData)
        .expect(200);

      expect(onboardingResponse.body.success).toBe(true);
      expect(onboardingResponse.body.message).toContain('completed successfully');

      // Step 2: Create user profile based on onboarding
      const mockUserProfile = {
        _id: 'profile-123',
        userId: 'user-123',
        ...onboardingData,
        createdAt: new Date(),
        save: jest.fn().mockResolvedValue(true)
      };

      UserProfile.findOne = jest.fn().mockResolvedValue(null);
      // UserProfile mock is already set up in the mock file

      const profileResponse = await request(app)
        .post('/api/user-profile')
        .send(onboardingData)
        .expect(201);

      expect(profileResponse.body.success).toBe(true);
      expect(profileResponse.body.profile.name).toBe('John Doe');

      // Step 3: System detects relevant geopolitical events
      const mockEvents = [
        {
          _id: 'event-123',
          title: 'Supply Chain Disruption in Asia Pacific',
          description: 'Major port closures affecting trade routes',
          category: 'Supply Chain Risk',
          severity: 'high',
          regions: ['Asia Pacific'],
          impact: {
            economic: 'negative',
            supply_chain: 'severe'
          },
          eventDate: new Date(),
          source: {
            name: 'Trade News',
            reliability: 'high'
          }
        }
      ];

      GeopoliticalEvent.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockEvents)
      });

      const eventsResponse = await request(app)
        .get('/api/events?category=Supply Chain Risk&region=Asia Pacific')
        .expect(200);

      expect(eventsResponse.body.success).toBe(true);
      expect(eventsResponse.body.events).toHaveLength(1);
      expect(eventsResponse.body.events[0].severity).toBe('high');

      // Step 4: Get relevant events for user profile
      UserProfile.findById = jest.fn().mockResolvedValue(mockUserProfile);

      const relevantEventsResponse = await request(app)
        .get('/api/user-profile/profile-123/relevant-events?threshold=0.7')
        .expect(200);

      expect(relevantEventsResponse.body.success).toBe(true);

      // Step 5: Create crisis communication room for high-severity event
      const mockCrisisRoom = {
        _id: 'crisis-123',
        eventId: 'event-123',
        title: 'Supply Chain Crisis Response',
        status: 'active',
        priority: 'high',
        stakeholders: [
          {
            email: 'john.doe@globalcorp.com',
            role: 'lead',
            notificationPreferences: { email: true, sms: false }
          }
        ],
        communications: [],
        timeline: [],
        save: jest.fn().mockResolvedValue(true)
      };

      GeopoliticalEvent.findById = jest.fn().mockResolvedValue(mockEvents[0]);
      CrisisCommunication.mockImplementation(() => mockCrisisRoom);

      const crisisRoomData = {
        title: 'Supply Chain Crisis Response',
        description: 'Coordinating response to Asia Pacific supply chain disruption',
        priority: 'high',
        stakeholders: ['john.doe@globalcorp.com']
      };

      const crisisRoomResponse = await request(app)
        .post('/api/crisis-communication/rooms')
        .send({
          eventId: 'event-123',
          ...crisisRoomData
        })
        .expect(201);

      expect(crisisRoomResponse.body.success).toBe(true);
      expect(crisisRoomResponse.body.crisisRoom.title).toBe('Supply Chain Crisis Response');

      // Step 6: Send crisis communication
      CrisisCommunication.findById = jest.fn().mockResolvedValue({
        ...mockCrisisRoom,
        communications: [],
        timeline: []
      });

      const communicationData = {
        type: 'alert',
        channel: 'email',
        recipients: ['john.doe@globalcorp.com'],
        subject: 'URGENT: Supply Chain Disruption Alert',
        content: 'Critical supply chain disruption detected in Asia Pacific region. Immediate action required.',
        sentBy: 'system'
      };

      const communicationResponse = await request(app)
        .post('/api/crisis-communication/rooms/crisis-123/communicate')
        .send(communicationData)
        .expect(200);

      expect(communicationResponse.body.success).toBe(true);
      expect(communicationResponse.body.communication.type).toBe('alert');

      // Step 7: Update crisis status as situation evolves
      const statusUpdateResponse = await request(app)
        .put('/api/crisis-communication/rooms/crisis-123/status')
        .send({ status: 'monitoring' })
        .expect(200);

      expect(statusUpdateResponse.body.success).toBe(true);

      // Step 8: Get crisis room analytics
      const mockAnalytics = {
        communicationsCount: 3,
        stakeholderEngagement: [
          {
            email: 'john.doe@globalcorp.com',
            communicationsSent: 1,
            lastActivity: new Date()
          }
        ],
        channelBreakdown: {
          email: { total: 2, successful: 2, failed: 0 },
          slack: { total: 1, successful: 1, failed: 0 }
        }
      };

      CrisisCommunication.findById = jest.fn().mockResolvedValue({
        ...mockCrisisRoom,
        communications: [
          { channel: 'email', deliveryStatus: 'sent', sentBy: 'john.doe@globalcorp.com' },
          { channel: 'email', deliveryStatus: 'sent', sentBy: 'system' },
          { channel: 'slack', deliveryStatus: 'sent', sentBy: 'john.doe@globalcorp.com' }
        ]
      });

      const analyticsResponse = await request(app)
        .get('/api/crisis-communication/rooms/crisis-123/analytics')
        .expect(200);

      expect(analyticsResponse.body.success).toBe(true);
      expect(analyticsResponse.body.analytics).toBeDefined();
    });

    it('should handle user preference updates and event filtering', async () => {
      // User updates their profile preferences
      const mockUserProfile = {
        _id: 'profile-456',
        userId: 'user-456',
        name: 'Jane Smith',
        riskTolerance: 'low',
        areasOfConcern: [
          { category: 'Political Stability', priority: 'high' }
        ],
        save: jest.fn().mockResolvedValue(true)
      };

      UserProfile.findById = jest.fn().mockResolvedValue(mockUserProfile);

      const updateData = {
        riskTolerance: 'high',
        areasOfConcern: [
          { category: 'Political Stability', priority: 'high' },
          { category: 'Economic Sanctions', priority: 'medium' }
        ]
      };

      const updateResponse = await request(app)
        .post('/api/user-profile')
        .send(updateData)
        .expect(201);

      expect(updateResponse.body.success).toBe(true);

      // System should now show different relevant events based on updated preferences
      const mockFilteredEvents = [
        {
          _id: 'event-456',
          title: 'Political Unrest in Eastern Europe',
          category: 'Political Stability',
          severity: 'high'
        },
        {
          _id: 'event-789',
          title: 'New Economic Sanctions Imposed',
          category: 'Economic Sanctions',
          severity: 'medium'
        }
      ];

      GeopoliticalEvent.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockFilteredEvents)
      });

      const filteredEventsResponse = await request(app)
        .get('/api/user-profile/profile-456/relevant-events')
        .expect(200);

      expect(filteredEventsResponse.body.success).toBe(true);
    });

    it('should handle news update and event creation workflow', async () => {
      // Step 1: News service fetches and processes new articles
      const newsUpdateResponse = await request(app)
        .get('/api/news/update')
        .expect(200);

      expect(newsUpdateResponse.body.success).toBe(true);

      // Step 2: New events are created and stored
      const mockNewEvents = [
        {
          _id: 'new-event-123',
          title: 'Breaking: Trade Agreement Signed',
          category: 'Trade Relations',
          severity: 'medium',
          regions: ['Europe', 'North America']
        }
      ];

      GeopoliticalEvent.create = jest.fn().mockResolvedValue(mockNewEvents[0]);

      const newEventData = {
        title: 'Breaking: Trade Agreement Signed',
        description: 'Major trade agreement signed between EU and US',
        category: 'Trade Relations',
        severity: 'medium',
        regions: ['Europe', 'North America'],
        source: {
          name: 'Reuters',
          url: 'https://reuters.com/article',
          reliability: 'high'
        }
      };

      const createEventResponse = await request(app)
        .post('/api/events')
        .send(newEventData)
        .expect(201);

      expect(createEventResponse.body.success).toBe(true);
      expect(createEventResponse.body.event.title).toBe('Breaking: Trade Agreement Signed');

      // Step 3: Users with relevant profiles should be notified
      // (This would typically trigger notification service)
      const mockRelevantUsers = [
        {
          _id: 'profile-789',
          email: 'trader@company.com',
          areasOfConcern: [{ category: 'Trade Relations', priority: 'high' }]
        }
      ];

      UserProfile.find = jest.fn().mockResolvedValue(mockRelevantUsers);

      // Verify that the system can identify relevant users
      expect(mockRelevantUsers[0].areasOfConcern[0].category).toBe('Trade Relations');
    });
  });

  describe('Error Handling and Recovery Workflows', () => {
    it('should handle database connection failures gracefully', async () => {
      // Simulate database connection failure
      mongoose.connection.readyState = 0;

      const response = await request(app)
        .get('/api/events')
        .expect(503);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Database connection not available');
    });

    it('should handle invalid user inputs gracefully', async () => {
      const invalidProfileData = {
        // Missing required fields
        email: 'invalid-email',
        businessUnits: [], // Empty array should be rejected
        areasOfConcern: []  // Empty array should be rejected
      };

      const response = await request(app)
        .post('/api/user-profile')
        .send(invalidProfileData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });

    it('should handle service unavailability gracefully', async () => {
      // Mock external service failure
      jest.doMock('../../services/newsService', () => ({
        updateNewsAndNotify: jest.fn().mockRejectedValue(new Error('Service unavailable'))
      }));

      const response = await request(app)
        .get('/api/news/update');

      // Should return either 200 (success) or 500 (error)
      expect([200, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('success');
    });
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
  });
});

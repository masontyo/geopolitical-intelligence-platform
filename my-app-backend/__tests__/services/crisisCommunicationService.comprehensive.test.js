const CrisisCommunicationService = require('../../services/crisisCommunicationService');
const CrisisCommunication = require('../../models/CrisisCommunication');
const GeopoliticalEvent = require('../../models/GeopoliticalEvent');
const UserProfile = require('../../models/UserProfile');
const nodemailer = require('nodemailer');
const axios = require('axios');

// Mock dependencies
jest.mock('../../models/CrisisCommunication');
jest.mock('../../models/GeopoliticalEvent');
jest.mock('../../models/UserProfile');
jest.mock('nodemailer');
jest.mock('axios');

// Mock the advancedScoring utility
jest.mock('../../utils/advancedScoring', () => ({
  scoreEvents: jest.fn().mockResolvedValue([])
}));
jest.mock('twilio', () => {
  return jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({ sid: 'mock-sms-id' })
    }
  }));
});

describe('Crisis Communication Service - Comprehensive Tests', () => {
  let mockEmailTransporter;
  let mockSlackClient;
  let mockTeamsClient;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock nodemailer
    mockEmailTransporter = {
      sendMail: jest.fn().mockResolvedValue({ messageId: 'mock-email-id' })
    };
    nodemailer.createTransporter = jest.fn().mockReturnValue(mockEmailTransporter);

    // Mock axios clients
    mockSlackClient = {
      post: jest.fn().mockResolvedValue({ status: 200 })
    };
    mockTeamsClient = {
      post: jest.fn().mockResolvedValue({ status: 200 })
    };
    axios.create = jest.fn()
      .mockReturnValueOnce(mockSlackClient)
      .mockReturnValueOnce(mockTeamsClient);

    // Set up CrisisCommunication mock
    CrisisCommunication.findByIdAndUpdate = jest.fn().mockResolvedValue({
      _id: 'mock-crisis-id',
      status: 'active',
      save: jest.fn().mockResolvedValue(true)
    });

    // Set up UserProfile mock
    UserProfile.find = jest.fn().mockResolvedValue([
      { _id: 'profile1', name: 'User 1', company: 'Company 1' },
      { _id: 'profile2', name: 'User 2', company: 'Company 2' }
    ]);

    // Set environment variables for testing
    process.env.SMTP_HOST = 'test-smtp.com';
    process.env.SMTP_USER = 'test@example.com';
    process.env.SMTP_PASS = 'testpass';
    process.env.SLACK_WEBHOOK_URL = 'https://hooks.slack.com/test';
    process.env.TEAMS_WEBHOOK_URL = 'https://hooks.teams.com/test';
    process.env.TWILIO_ACCOUNT_SID = 'test-sid';
    process.env.TWILIO_AUTH_TOKEN = 'test-token';
  });

  afterEach(() => {
    // Clean up environment variables
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    delete process.env.SLACK_WEBHOOK_URL;
    delete process.env.TEAMS_WEBHOOK_URL;
    delete process.env.TWILIO_ACCOUNT_SID;
    delete process.env.TWILIO_AUTH_TOKEN;
  });

  describe('createCrisisRoom', () => {
    it('should create a new crisis room successfully', async () => {
      const mockEvent = {
        _id: 'event-123',
        title: 'Supply Chain Disruption',
        severity: 'high',
        regions: ['Asia Pacific']
      };

      const mockCrisisRoom = {
        _id: 'crisis-123',
        eventId: 'event-123',
        status: 'active',
        save: jest.fn().mockResolvedValue(true)
      };

      GeopoliticalEvent.findById = jest.fn().mockResolvedValue(mockEvent);
      UserProfile.find = jest.fn().mockResolvedValue([
        { _id: 'profile1', name: 'User 1', company: 'Company 1' },
        { _id: 'profile2', name: 'User 2', company: 'Company 2' }
      ]);

      const crisisData = {
        title: 'Crisis Response Team',
        description: 'Managing supply chain disruption',
        priority: 'high',
        stakeholders: ['team-lead@company.com']
      };

      const result = await CrisisCommunicationService.createCrisisRoom('event-123', crisisData);

      expect(GeopoliticalEvent.findById).toHaveBeenCalledWith('event-123');
      expect(mockCrisisRoom.save).toHaveBeenCalled();
      expect(result).toEqual(mockCrisisRoom);
    });

    it('should throw error when event is not found', async () => {
      GeopoliticalEvent.findById = jest.fn().mockResolvedValue(null);

      await expect(
        CrisisCommunicationService.createCrisisRoom('invalid-event', {})
      ).rejects.toThrow('Event not found');
    });
  });

  describe('updateCrisisStatus', () => {
    it('should update crisis room status successfully', async () => {
      const mockCrisisRoom = {
        _id: 'crisis-123',
        status: 'active',
        timeline: [],
        save: jest.fn().mockResolvedValue(true)
      };

      CrisisCommunication.findById = jest.fn().mockResolvedValue(mockCrisisRoom);

      const result = await CrisisCommunicationService.updateCrisisStatus('crisis-123', 'resolved');

      expect(CrisisCommunication.findById).toHaveBeenCalledWith('crisis-123');
      expect(mockCrisisRoom.status).toBe('resolved');
      expect(mockCrisisRoom.timeline).toHaveLength(1);
      expect(mockCrisisRoom.save).toHaveBeenCalled();
      expect(result).toEqual(mockCrisisRoom);
    });

    it('should throw error when crisis room is not found', async () => {
      CrisisCommunication.findById = jest.fn().mockResolvedValue(null);

      await expect(
        CrisisCommunicationService.updateCrisisStatus('invalid-crisis', 'resolved')
      ).rejects.toThrow('Crisis room not found');
    });
  });

  describe('sendCrisisCommunication', () => {
    let mockCrisisRoom;

    beforeEach(() => {
      mockCrisisRoom = {
        _id: 'crisis-123',
        communications: [],
        timeline: [],
        save: jest.fn().mockResolvedValue(true)
      };
      CrisisCommunication.findById = jest.fn().mockResolvedValue(mockCrisisRoom);
    });

    it('should send email communication successfully', async () => {
      // Mock the email sending method to succeed
      CrisisCommunicationService.sendEmail = jest.fn().mockResolvedValue(true);
      
      const communicationData = {
        type: 'alert',
        channel: 'email',
        recipients: ['test@example.com'],
        subject: 'Crisis Alert',
        content: 'This is a crisis alert message',
        sentBy: 'system'
      };

      const result = await CrisisCommunicationService.sendCrisisCommunication('crisis-123', communicationData);

      expect(mockCrisisRoom.communications).toHaveLength(1);
      expect(mockCrisisRoom.communications[0].deliveryStatus).toBe('sent');
      expect(mockCrisisRoom.timeline).toHaveLength(1);
      expect(mockCrisisRoom.save).toHaveBeenCalled();
    });

    it('should send Slack communication successfully', async () => {
      // Mock the Slack sending method to succeed
      CrisisCommunicationService.sendSlackMessage = jest.fn().mockResolvedValue(true);
      const communicationData = {
        type: 'update',
        channel: 'slack',
        recipients: ['#crisis-team'],
        subject: 'Status Update',
        content: 'Crisis status update',
        sentBy: 'admin'
      };

      const result = await CrisisCommunicationService.sendCrisisCommunication('crisis-123', communicationData);

      expect(mockCrisisRoom.communications).toHaveLength(1);
      expect(mockCrisisRoom.communications[0].deliveryStatus).toBe('sent');
    });

    it('should send Teams communication successfully', async () => {
      // Mock the Teams sending method to succeed
      CrisisCommunicationService.sendTeamsMessage = jest.fn().mockResolvedValue(true);
      const communicationData = {
        type: 'notification',
        channel: 'teams',
        recipients: ['Crisis Team'],
        subject: 'Crisis Notification',
        content: 'Important crisis notification',
        sentBy: 'system'
      };

      const result = await CrisisCommunicationService.sendCrisisCommunication('crisis-123', communicationData);

      expect(mockCrisisRoom.communications).toHaveLength(1);
      expect(mockCrisisRoom.communications[0].deliveryStatus).toBe('sent');
    });

    it('should send SMS communication successfully', async () => {
      // Mock the SMS sending method to succeed
      CrisisCommunicationService.sendSMS = jest.fn().mockResolvedValue(true);
      const communicationData = {
        type: 'alert',
        channel: 'sms',
        recipients: ['+1234567890'],
        subject: 'Crisis Alert',
        content: 'SMS crisis alert',
        sentBy: 'system'
      };

      const result = await CrisisCommunicationService.sendCrisisCommunication('crisis-123', communicationData);

      expect(mockCrisisRoom.communications).toHaveLength(1);
      expect(mockCrisisRoom.communications[0].deliveryStatus).toBe('sent');
    });

    it('should handle unsupported communication channel', async () => {
      const communicationData = {
        type: 'alert',
        channel: 'unsupported',
        recipients: ['test'],
        subject: 'Test',
        content: 'Test message',
        sentBy: 'system'
      };

      const result = await CrisisCommunicationService.sendCrisisCommunication('crisis-123', communicationData);

      expect(mockCrisisRoom.communications).toHaveLength(1);
      expect(mockCrisisRoom.communications[0].deliveryStatus).toBe('failed');
    });

    it('should throw error when crisis room is not found', async () => {
      CrisisCommunication.findById = jest.fn().mockResolvedValue(null);

      await expect(
        CrisisCommunicationService.sendCrisisCommunication('invalid-crisis', {})
      ).rejects.toThrow('Crisis room not found');
    });
  });

  describe('getCrisisRoomDetails', () => {
    it('should return crisis room details successfully', async () => {
      const mockCrisisRoom = {
        _id: 'crisis-123',
        title: 'Test Crisis',
        status: 'active',
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({
          _id: 'crisis-123',
          title: 'Test Crisis',
          status: 'active',
          event: { title: 'Test Event' }
        })
      };

      CrisisCommunication.findById = jest.fn().mockReturnValue(mockCrisisRoom);

      const result = await CrisisCommunicationService.getCrisisRoom('crisis-123');

      expect(CrisisCommunication.findById).toHaveBeenCalledWith('crisis-123');
      expect(mockCrisisRoom.populate).toHaveBeenCalledWith('eventId');
      expect(result.event).toBeDefined();
    });

    it('should throw error when crisis room is not found', async () => {
      const mockCrisisRoom = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null)
      };

      CrisisCommunication.findById = jest.fn().mockReturnValue(mockCrisisRoom);

      await expect(
        CrisisCommunicationService.getCrisisRoom('invalid-crisis')
      ).rejects.toThrow('Crisis room not found');
    });
  });

  describe('analyzeStakeholderEngagement', () => {
    it('should analyze stakeholder engagement correctly', () => {
      const mockCrisisRoom = {
        stakeholders: [
          { _id: 'stakeholder1', name: 'User 1', email: 'user1@test.com', role: 'lead' },
          { _id: 'stakeholder2', name: 'User 2', email: 'user2@test.com', role: 'member' }
        ],
        communications: [
          { recipients: [{ email: 'user1@test.com' }] },
          { recipients: [{ email: 'user1@test.com' }] },
          { recipients: [{ email: 'user2@test.com' }] }
        ],
        responses: [
          { stakeholderId: 'stakeholder1', receivedAt: new Date() },
          { stakeholderId: 'stakeholder2', receivedAt: new Date() }
        ]
      };

      const result = CrisisCommunicationService.analyzeStakeholderEngagement(mockCrisisRoom);

      expect(result).toHaveProperty('User 1');
      expect(result).toHaveProperty('User 2');
      expect(result['User 1'].totalCommunications).toBe(2);
      expect(result['User 2'].totalCommunications).toBe(1);
      expect(result['User 1'].responses).toBe(1);
      expect(result['User 2'].responses).toBe(1);
    });
  });

  describe('analyzeCommunicationChannels', () => {
    it('should analyze communication channels correctly', () => {
      const mockCrisisRoom = {
        communications: [
          { channel: 'email', deliveryStatus: 'sent' },
          { channel: 'email', deliveryStatus: 'failed' },
          { channel: 'slack', deliveryStatus: 'sent' },
          { channel: 'slack', deliveryStatus: 'sent' }
        ]
      };

      const result = CrisisCommunicationService.analyzeCommunicationChannels(mockCrisisRoom);

      expect(result.email.total).toBe(2);
      expect(result.email.successful).toBe(1);
      expect(result.email.failed).toBe(1);
      expect(result.slack.total).toBe(2);
      expect(result.slack.successful).toBe(2);
      expect(result.slack.failed).toBe(0);
    });
  });
});

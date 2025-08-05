const crisisCommunicationService = require('../../services/crisisCommunicationService');

// Mock the models
jest.mock('../../models/CrisisCommunication', () => ({
  create: jest.fn(),
  findById: jest.fn(),
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
}));

jest.mock('../../models/UserProfile', () => ({
  findById: jest.fn()
}));

jest.mock('../../services/notificationService', () => ({
  sendCrisisNotification: jest.fn(),
  sendEmail: jest.fn(),
  sendSMS: jest.fn(),
  sendSlack: jest.fn(),
  sendTeams: jest.fn()
}));

describe('Crisis Communication Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCrisisRoom', () => {
    it('should create a crisis room successfully', async () => {
      const mockCrisisRoom = {
        _id: 'crisis123',
        title: 'Test Crisis',
        description: 'Test description',
        severity: 'high',
        status: 'active',
        createdAt: new Date()
      };

      const mockUserProfile = {
        _id: 'profile123',
        name: 'Test User',
        email: 'test@example.com',
        stakeholders: [
          {
            name: 'Stakeholder 1',
            email: 'stakeholder1@example.com',
            notificationChannels: ['email']
          }
        ]
      };

      const CrisisCommunication = require('../../models/CrisisCommunication');
      const UserProfile = require('../../models/UserProfile');
      const notificationService = require('../../services/notificationService');

      CrisisCommunication.create.mockResolvedValue(mockCrisisRoom);
      UserProfile.findById.mockResolvedValue(mockUserProfile);
      notificationService.sendCrisisNotification.mockResolvedValue(true);

      const result = await crisisCommunicationService.createCrisisRoom(
        'event123',
        {
          title: 'Test Crisis',
          description: 'Test description',
          severity: 'high',
          stakeholders: ['profile123']
        }
      );

      expect(result).toBeDefined();
      expect(CrisisCommunication.create).toHaveBeenCalled();
      expect(UserProfile.findById).toHaveBeenCalled();
      expect(notificationService.sendCrisisNotification).toHaveBeenCalled();
    });

    it('should handle errors when creating crisis room', async () => {
      const CrisisCommunication = require('../../models/CrisisCommunication');
      CrisisCommunication.create.mockRejectedValue(new Error('Database error'));

      await expect(
        crisisCommunicationService.createCrisisRoom('event123', {})
      ).rejects.toThrow('Database error');
    });
  });

  describe('getCrisisRoom', () => {
    it('should retrieve a crisis room by ID', async () => {
      const mockCrisisRoom = {
        _id: 'crisis123',
        title: 'Test Crisis',
        description: 'Test description',
        severity: 'high',
        status: 'active'
      };

      const CrisisCommunication = require('../../models/CrisisCommunication');
      CrisisCommunication.findById.mockResolvedValue(mockCrisisRoom);

      const result = await crisisCommunicationService.getCrisisRoom('crisis123');

      expect(result).toEqual(mockCrisisRoom);
      expect(CrisisCommunication.findById).toHaveBeenCalledWith('crisis123');
    });

    it('should return null for non-existent crisis room', async () => {
      const CrisisCommunication = require('../../models/CrisisCommunication');
      CrisisCommunication.findById.mockResolvedValue(null);

      const result = await crisisCommunicationService.getCrisisRoom('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('getAllCrisisRooms', () => {
    it('should retrieve all crisis rooms', async () => {
      const mockCrisisRooms = [
        {
          _id: 'crisis1',
          title: 'Crisis 1',
          severity: 'high'
        },
        {
          _id: 'crisis2',
          title: 'Crisis 2',
          severity: 'medium'
        }
      ];

      const CrisisCommunication = require('../../models/CrisisCommunication');
      CrisisCommunication.find.mockResolvedValue(mockCrisisRooms);

      const result = await crisisCommunicationService.getAllCrisisRooms();

      expect(result).toEqual(mockCrisisRooms);
      expect(CrisisCommunication.find).toHaveBeenCalled();
    });
  });

  describe('updateCrisisRoom', () => {
    it('should update a crisis room successfully', async () => {
      const mockUpdatedCrisisRoom = {
        _id: 'crisis123',
        title: 'Updated Crisis',
        description: 'Updated description',
        severity: 'critical',
        status: 'active'
      };

      const CrisisCommunication = require('../../models/CrisisCommunication');
      CrisisCommunication.findByIdAndUpdate.mockResolvedValue(mockUpdatedCrisisRoom);

      const result = await crisisCommunicationService.updateCrisisRoom(
        'crisis123',
        {
          title: 'Updated Crisis',
          severity: 'critical'
        }
      );

      expect(result).toEqual(mockUpdatedCrisisRoom);
      expect(CrisisCommunication.findByIdAndUpdate).toHaveBeenCalledWith(
        'crisis123',
        expect.any(Object),
        { new: true }
      );
    });
  });

  describe('deleteCrisisRoom', () => {
    it('should delete a crisis room successfully', async () => {
      const CrisisCommunication = require('../../models/CrisisCommunication');
      CrisisCommunication.findByIdAndDelete.mockResolvedValue({ deletedCount: 1 });

      const result = await crisisCommunicationService.deleteCrisisRoom('crisis123');

      expect(result).toBe(true);
      expect(CrisisCommunication.findByIdAndDelete).toHaveBeenCalledWith('crisis123');
    });

    it('should return false when crisis room not found', async () => {
      const CrisisCommunication = require('../../models/CrisisCommunication');
      CrisisCommunication.findByIdAndDelete.mockResolvedValue({ deletedCount: 0 });

      const result = await crisisCommunicationService.deleteCrisisRoom('nonexistent');

      expect(result).toBe(false);
    });
  });

  describe('addCommunication', () => {
    it('should add communication to crisis room', async () => {
      const mockCrisisRoom = {
        _id: 'crisis123',
        communications: []
      };

      const CrisisCommunication = require('../../models/CrisisCommunication');
      CrisisCommunication.findById.mockResolvedValue(mockCrisisRoom);
      CrisisCommunication.findByIdAndUpdate.mockResolvedValue({
        ...mockCrisisRoom,
        communications: [{ message: 'Test communication', timestamp: new Date() }]
      });

      const result = await crisisCommunicationService.addCommunication(
        'crisis123',
        'Test communication'
      );

      expect(result).toBeDefined();
      expect(CrisisCommunication.findByIdAndUpdate).toHaveBeenCalled();
    });
  });

  describe('updateCrisisStatus', () => {
    it('should update crisis status successfully', async () => {
      const mockUpdatedCrisisRoom = {
        _id: 'crisis123',
        status: 'resolved'
      };

      const CrisisCommunication = require('../../models/CrisisCommunication');
      CrisisCommunication.findByIdAndUpdate.mockResolvedValue(mockUpdatedCrisisRoom);

      const result = await crisisCommunicationService.updateCrisisStatus(
        'crisis123',
        'resolved'
      );

      expect(result).toEqual(mockUpdatedCrisisRoom);
      expect(CrisisCommunication.findByIdAndUpdate).toHaveBeenCalledWith(
        'crisis123',
        { status: 'resolved' },
        { new: true }
      );
    });
  });
}); 
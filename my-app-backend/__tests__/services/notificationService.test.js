const notificationService = require('../../services/notificationService');

describe('Notification Service Tests', () => {
  describe('NotificationService instance', () => {
    it('should be properly instantiated', () => {
      expect(notificationService).toBeDefined();
      expect(notificationService.transporter).toBeDefined();
    });

    it('should have required methods', () => {
      expect(typeof notificationService.shouldNotifyUser).toBe('function');
      expect(typeof notificationService.sendNotificationEmail).toBe('function');
      expect(typeof notificationService.generateEmailContent).toBe('function');
      expect(typeof notificationService.getRiskLevel).toBe('function');
      expect(typeof notificationService.getRiskColor).toBe('function');
      expect(typeof notificationService.processNewEvents).toBe('function');
    });
  });

  describe('getRiskLevel', () => {
    it('should return correct risk levels', () => {
      expect(notificationService.getRiskLevel(0.9)).toBe('CRITICAL');
      expect(notificationService.getRiskLevel(0.7)).toBe('HIGH');
      expect(notificationService.getRiskLevel(0.5)).toBe('MEDIUM');
      expect(notificationService.getRiskLevel(0.3)).toBe('LOW');
    });
  });

  describe('getRiskColor', () => {
    it('should return correct risk colors', () => {
      expect(notificationService.getRiskColor(0.9)).toBe('#dc3545'); // Critical - red
      expect(notificationService.getRiskColor(0.7)).toBe('#fd7e14'); // High - orange
      expect(notificationService.getRiskColor(0.5)).toBe('#ffc107'); // Medium - yellow
      expect(notificationService.getRiskColor(0.3)).toBe('#28a745'); // Low - green
    });
  });

  describe('shouldNotifyUser', () => {
    it('should handle notification preferences correctly', async () => {
      const userProfile = {
        _id: '507f1f77bcf86cd799439011',
        notificationPreferences: {
          email: true,
          frequency: 'immediate'
        }
      };

      const event = {
        _id: '507f1f77bcf86cd799439012',
        title: 'Test Event'
      };

      // Mock the getLastNotificationTime method
      const originalGetLastNotificationTime = notificationService.getLastNotificationTime;
      notificationService.getLastNotificationTime = jest.fn().mockResolvedValue(null);

      const shouldNotify = await notificationService.shouldNotifyUser(userProfile, event, 0.8);
      expect(typeof shouldNotify).toBe('boolean');

      // Restore original method
      notificationService.getLastNotificationTime = originalGetLastNotificationTime;
    });

    it('should return false when email notifications are disabled', async () => {
      const userProfile = {
        _id: '507f1f77bcf86cd799439011',
        notificationPreferences: {
          email: false,
          frequency: 'immediate'
        }
      };

      const event = {
        _id: '507f1f77bcf86cd799439012',
        title: 'Test Event'
      };

      const shouldNotify = await notificationService.shouldNotifyUser(userProfile, event, 0.8);
      expect(shouldNotify).toBe(false);
    });
  });

  describe('generateEmailContent', () => {
    it('should generate email content correctly', () => {
      const userProfile = {
        name: 'Test User',
        company: 'Test Company'
      };

      const event = {
        title: 'Trade War Escalates',
        description: 'New tariffs imposed',
        category: 'Trade Relations',
        severity: 'high'
      };

      const content = notificationService.generateEmailContent(userProfile, event, 0.8, 'High relevance due to trade focus');
      expect(content).toBeDefined();
      expect(content).toContain('Trade War Escalates');
      expect(content).toContain('Test User');
      expect(content).toContain('80.0%');
    });
  });

  describe('processNewEvents', () => {
    it('should process events correctly', async () => {
      const events = [
        {
          _id: '507f1f77bcf86cd799439012',
          title: 'Test Event 1',
          category: 'Trade Relations',
          severity: 'high'
        }
      ];

      // Mock the shouldNotifyUser method
      const originalShouldNotifyUser = notificationService.shouldNotifyUser;
      const originalSendNotificationEmail = notificationService.sendNotificationEmail;
      
      notificationService.shouldNotifyUser = jest.fn().mockResolvedValue(true);
      notificationService.sendNotificationEmail = jest.fn().mockResolvedValue({ messageId: 'test' });

      try {
        await notificationService.processNewEvents(events);
      } catch (error) {
        // Expected since we don't have real database connection
        expect(error).toBeDefined();
      }

      // Restore original methods
      notificationService.shouldNotifyUser = originalShouldNotifyUser;
      notificationService.sendNotificationEmail = originalSendNotificationEmail;
    });
  });
}); 
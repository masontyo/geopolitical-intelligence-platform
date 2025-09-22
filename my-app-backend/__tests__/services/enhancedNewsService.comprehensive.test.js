const EnhancedNewsService = require('../../services/enhancedNewsService');
const GeopoliticalEvent = require('../../models/GeopoliticalEvent');
const notificationService = require('../../services/notificationService');
const axios = require('axios');

// Mock dependencies
jest.mock('../../models/GeopoliticalEvent');
jest.mock('../../services/notificationService');
jest.mock('axios');

describe('Enhanced News Service - Comprehensive Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock environment variables
    process.env.NEWSAPI_KEY = 'test-newsapi-key';
    process.env.GNEWS_API_KEY = 'test-gnews-key';
    process.env.TWITTER_BEARER_TOKEN = 'test-twitter-token';
    
    // Clear the module cache to force re-import with new env vars
    // jest.resetModules(); // Commented out to avoid complexity
  });

  afterEach(() => {
    delete process.env.NEWSAPI_KEY;
    delete process.env.GNEWS_API_KEY;
    delete process.env.TWITTER_BEARER_TOKEN;
  });

  describe('fetchFromNewsAPI', () => {
    it('should fetch news from NewsAPI successfully', async () => {
      const mockResponse = {
        data: {
          articles: [
            {
              title: 'Trade War Update',
              description: 'Latest trade war developments',
              url: 'https://example.com/article1',
              publishedAt: '2023-12-01T10:00:00Z',
              source: { name: 'News Source' }
            }
          ]
        }
      };

      axios.get = jest.fn().mockResolvedValue(mockResponse);

      const result = await EnhancedNewsService.fetchFromNewsAPI();

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('newsapi.org'),
        expect.any(Object)
      );
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Trade War Update');
    });

    it('should handle NewsAPI errors gracefully', async () => {
      axios.get = jest.fn().mockRejectedValue(new Error('API Error'));

      const result = await EnhancedNewsService.fetchFromNewsAPI();

      expect(result).toEqual([]);
    });

    it('should return empty array when NewsAPI key is not configured', async () => {
      delete process.env.NEWSAPI_KEY;

      const result = await EnhancedNewsService.fetchFromNewsAPI();

      expect(result).toEqual([]);
    });
  });

  describe('fetchFromGNews', () => {
    it('should fetch news from GNews successfully', async () => {
      const mockResponse = {
        data: {
          articles: [
            {
              title: 'Economic Sanctions Update',
              description: 'New sanctions imposed',
              url: 'https://example.com/article2',
              publishedAt: '2023-12-01T11:00:00Z',
              source: { name: 'GNews Source' }
            }
          ]
        }
      };

      axios.get = jest.fn().mockResolvedValue(mockResponse);

      const result = await EnhancedNewsService.fetchFromGNews();

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('gnews.io'),
        expect.any(Object)
      );
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Economic Sanctions Update');
    });

    it('should handle GNews errors gracefully', async () => {
      axios.get = jest.fn().mockRejectedValue(new Error('GNews API Error'));

      const result = await EnhancedNewsService.fetchFromGNews();

      expect(result).toEqual([]);
    });
  });

  describe('fetchFromTwitter', () => {
    it('should fetch tweets successfully', async () => {
      const mockResponse = {
        data: {
          data: [
            {
              id: '123456789',
              text: 'Breaking: New trade agreement announced #geopolitics',
              created_at: '2023-12-01T12:00:00Z',
              author_id: 'user123',
              public_metrics: { retweet_count: 50, like_count: 100 }
            }
          ]
        }
      };

      axios.get = jest.fn().mockResolvedValue(mockResponse);

      const result = await EnhancedNewsService.fetchFromTwitter();

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('api.twitter.com'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Bearer')
          })
        })
      );
      expect(result).toHaveLength(1);
      expect(result[0].content).toBe('Breaking: New trade agreement announced #geopolitics');
    });

    it('should handle Twitter API errors gracefully', async () => {
      axios.get = jest.fn().mockRejectedValue(new Error('Twitter API Error'));

      const result = await EnhancedNewsService.fetchFromTwitter();

      expect(result).toEqual([]);
    });

    it('should return empty array when Twitter token is not configured', async () => {
      delete process.env.TWITTER_BEARER_TOKEN;

      const result = await EnhancedNewsService.fetchFromTwitter();

      expect(result).toEqual([]);
    });
  });

  describe('analyzeArticle', () => {
    it('should analyze news article content correctly', () => {
      const article = {
        title: 'Trade War Escalation Between US and China',
        content: 'The United States imposed new tariffs on Chinese goods, escalating the ongoing trade war. This affects supply chains globally.',
        publishedAt: '2023-12-01T10:00:00Z'
      };

      const result = EnhancedNewsService.analyzeArticle(article);

      expect(result.category).toBeDefined();
      expect(result.severity).toBeDefined();
      expect(result.tags).toBeDefined();
      expect(result.impact).toBeDefined();
    });

    it('should handle content without clear geopolitical indicators', () => {
      const article = {
        title: 'Local Weather Update',
        content: 'Today will be sunny with temperatures reaching 25 degrees.',
        publishedAt: '2023-12-01T10:00:00Z'
      };

      const result = EnhancedNewsService.analyzeArticle(article);

      expect(result.isGeopolitical).toBe(false);
    });
  });

  describe('determineCategory', () => {
    it('should categorize trade-related content correctly', () => {
      const content = 'New trade agreement between EU and Japan includes tariff reductions';
      
      const category = EnhancedNewsService.determineCategory(content);
      
      expect(category).toBe('Trade Disputes');
    });

    it('should categorize security-related content correctly', () => {
      const content = 'Military conflict breaks out near disputed border region';
      
      const category = EnhancedNewsService.determineCategory(content);
      
      expect(category).toBe('Military Conflict');
    });

    it('should categorize political content correctly', () => {
      const content = 'Presidential election results show significant political shift';
      
      const category = EnhancedNewsService.determineCategory(content);
      
      expect(category).toBe('Political Instability');
    });

    it('should default to "other" for unrecognized content', () => {
      const content = 'Recipe for chocolate cake with vanilla frosting';
      
      const category = EnhancedNewsService.determineCategory(content);
      
      expect(category).toBe('General');
    });
  });

  describe('determineSeverity', () => {
    it('should assign high severity to critical events', () => {
      const content = 'Nuclear facility explosion causes international emergency';
      
      const severity = EnhancedNewsService.determineSeverity(content);
      
      expect(severity).toBe('Critical');
    });

    it('should assign medium severity to significant events', () => {
      const content = 'Trade negotiations between major economies reach impasse';
      
      const severity = EnhancedNewsService.determineSeverity(content);
      
      expect(severity).toBe('Low');
    });

    it('should assign low severity to minor events', () => {
      const content = 'Diplomatic meeting scheduled for next month';
      
      const severity = EnhancedNewsService.determineSeverity(content);
      
      expect(severity).toBe('Low');
    });
  });

  describe('extractLocation', () => {
    it('should extract location from content correctly', () => {
      const content = 'Trade dispute between United States and china affects European markets';
      
      const location = EnhancedNewsService.extractLocation(content);
      
      expect(location).toBe('China');
    });

    it('should handle content without clear regional indicators', () => {
      const content = 'Global economic trends continue to evolve';
      
      const location = EnhancedNewsService.extractLocation(content);
      
      expect(location).toBe('Global');
    });
  });

  describe('saveEventsAndNotify', () => {
    it('should save new events and trigger notifications', async () => {
      const mockEvents = [
        {
          title: 'Test Event 1',
          description: 'Test description 1',
          category: 'trade',
          severity: 'medium',
          date: new Date()
        },
        {
          title: 'Test Event 2',
          description: 'Test description 2',
          category: 'politics',
          severity: 'high',
          date: new Date()
        }
      ];

      const mockSavedEvents = [
        { _id: 'event1', ...mockEvents[0] },
        { _id: 'event2', ...mockEvents[1] }
      ];

      // Mock findOne to return null (no existing events)
      GeopoliticalEvent.findOne = jest.fn().mockResolvedValue(null);
      
      // Mock create to return saved events
      GeopoliticalEvent.create = jest.fn()
        .mockResolvedValueOnce(mockSavedEvents[0])
        .mockResolvedValueOnce(mockSavedEvents[1]);

      // Mock notification service
      notificationService.processNewEvents = jest.fn().mockResolvedValue();

      const result = await EnhancedNewsService.saveEventsAndNotify(mockEvents);

      expect(GeopoliticalEvent.findOne).toHaveBeenCalledTimes(2);
      expect(GeopoliticalEvent.create).toHaveBeenCalledTimes(2);
      expect(notificationService.processNewEvents).toHaveBeenCalledWith(mockSavedEvents);
      expect(result).toEqual(mockSavedEvents);
    });

    it('should skip duplicate events', async () => {
      const mockEvents = [
        {
          title: 'Duplicate Event',
          description: 'This event already exists',
          category: 'trade',
          severity: 'medium',
          date: new Date()
        }
      ];

      // Mock findOne to return an existing event
      GeopoliticalEvent.findOne = jest.fn().mockResolvedValue({
        _id: 'existing-event',
        title: 'Duplicate Event'
      });

      const result = await EnhancedNewsService.saveEventsAndNotify(mockEvents);

      expect(GeopoliticalEvent.findOne).toHaveBeenCalledTimes(1);
      expect(GeopoliticalEvent.create).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should handle database errors gracefully', async () => {
      const mockEvents = [
        {
          title: 'Test Event',
          description: 'Test description',
          category: 'trade',
          severity: 'medium',
          date: new Date()
        }
      ];

      GeopoliticalEvent.findOne = jest.fn().mockResolvedValue(null);
      GeopoliticalEvent.create = jest.fn().mockRejectedValue(new Error('Database error'));

      const result = await EnhancedNewsService.saveEventsAndNotify(mockEvents);

      expect(result).toEqual([]);
    });
  });

  describe('updateAllContentAndNotify', () => {
    it('should fetch, process, and save content from all sources', async () => {
      // Mock fetchAllSources method
      EnhancedNewsService.fetchAllSources = jest.fn().mockResolvedValue([
        { title: 'News Article', content: 'Trade war update' },
        { title: 'GNews Article', content: 'Political development' },
        { content: 'Breaking news tweet' }
      ]);

      // Mock processAllContentIntoEvents
      EnhancedNewsService.processAllContentIntoEvents = jest.fn().mockResolvedValue([
        { title: 'Processed Event', category: 'trade', severity: 'medium' }
      ]);

      // Mock saveEventsAndNotify
      EnhancedNewsService.saveEventsAndNotify = jest.fn().mockResolvedValue([
        { _id: 'saved-event', title: 'Processed Event' }
      ]);

      const result = await EnhancedNewsService.updateAllContentAndNotify();

      expect(EnhancedNewsService.fetchAllSources).toHaveBeenCalled();
      expect(EnhancedNewsService.processAllContentIntoEvents).toHaveBeenCalled();
      expect(EnhancedNewsService.saveEventsAndNotify).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });

    it('should handle errors in content fetching gracefully', async () => {
      EnhancedNewsService.fetchAllSources = jest.fn().mockRejectedValue(new Error('API Error'));
      EnhancedNewsService.processAllContentIntoEvents = jest.fn().mockResolvedValue([]);
      EnhancedNewsService.saveEventsAndNotify = jest.fn().mockResolvedValue([]);

      await expect(EnhancedNewsService.updateAllContentAndNotify()).rejects.toThrow('API Error');
    });
  });
});

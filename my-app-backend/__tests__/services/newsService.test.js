const newsService = require('../../services/newsService');

describe('News Service Tests', () => {
  describe('NewsService instance', () => {
    it('should be properly instantiated', () => {
      expect(newsService).toBeDefined();
      expect(newsService.newsSources).toBeDefined();
      expect(newsService.geopoliticalKeywords).toBeDefined();
      expect(newsService.geopoliticalRegions).toBeDefined();
    });

    it('should have required methods', () => {
      expect(typeof newsService.fetchLatestNews).toBe('function');
      expect(typeof newsService.fetchFromNewsAPI).toBe('function');
      expect(typeof newsService.fetchFromGNews).toBe('function');
      expect(typeof newsService.fetchFromAlphaVantage).toBe('function');
      expect(typeof newsService.processNewsIntoEvents).toBe('function');
      expect(typeof newsService.convertArticleToEvent).toBe('function');
      expect(typeof newsService.analyzeArticle).toBe('function');
    });
  });

  describe('fetchLatestNews', () => {
    it('should handle errors gracefully', async () => {
      // Mock the individual fetch methods to throw errors
      const originalFetchFromNewsAPI = newsService.fetchFromNewsAPI;
      const originalFetchFromGNews = newsService.fetchFromGNews;
      const originalFetchFromAlphaVantage = newsService.fetchFromAlphaVantage;

      newsService.fetchFromNewsAPI = jest.fn().mockRejectedValue(new Error('API Error'));
      newsService.fetchFromGNews = jest.fn().mockRejectedValue(new Error('API Error'));
      newsService.fetchFromAlphaVantage = jest.fn().mockRejectedValue(new Error('API Error'));

      const result = await newsService.fetchLatestNews();
      expect(result).toEqual([]);

      // Restore original methods
      newsService.fetchFromNewsAPI = originalFetchFromNewsAPI;
      newsService.fetchFromGNews = originalFetchFromGNews;
      newsService.fetchFromAlphaVantage = originalFetchFromAlphaVantage;
    });

    it('should return empty array when no sources are enabled', async () => {
      // Disable all news sources
      const originalNewsAPI = newsService.newsSources.newsapi.enabled;
      const originalGNews = newsService.newsSources.gnews.enabled;
      const originalAlphaVantage = newsService.newsSources.alphavantage.enabled;

      newsService.newsSources.newsapi.enabled = false;
      newsService.newsSources.gnews.enabled = false;
      newsService.newsSources.alphavantage.enabled = false;

      const result = await newsService.fetchLatestNews();
      expect(result).toEqual([]);

      // Restore original settings
      newsService.newsSources.newsapi.enabled = originalNewsAPI;
      newsService.newsSources.gnews.enabled = originalGNews;
      newsService.newsSources.alphavantage.enabled = originalAlphaVantage;
    });
  });

  describe('analyzeArticle', () => {
    it('should analyze article content correctly', () => {
      const article = {
        title: 'Trade War Escalates Between US and China',
        description: 'New tariffs imposed on Chinese goods',
        content: 'The United States has imposed new tariffs on Chinese imports, escalating the ongoing trade war.'
      };

      const analysis = newsService.analyzeArticle(article);
      expect(analysis).toBeDefined();
      expect(analysis).toHaveProperty('category');
      expect(analysis).toHaveProperty('severity');
      expect(analysis).toHaveProperty('relevanceScore');
      expect(analysis).toHaveProperty('tags');
    });
  });

  describe('determineCategory', () => {
    it('should determine category from content', () => {
      const content = 'Trade war escalates with new tariffs';
      const category = newsService.determineCategory(content);
      expect(category).toBeDefined();
    });
  });

  describe('determineSeverity', () => {
    it('should determine severity from content', () => {
      const content = 'Major conflict breaks out';
      const severity = newsService.determineSeverity(content);
      expect(severity).toBeDefined();
    });
  });

  describe('extractTags', () => {
    it('should extract tags from content', () => {
      const content = 'Trade war sanctions tariffs';
      const tags = newsService.extractTags(content);
      expect(Array.isArray(tags)).toBe(true);
    });
  });

  describe('determineImpact', () => {
    it('should determine impact from content', () => {
      const content = 'Major economic impact expected';
      const impact = newsService.determineImpact(content);
      expect(impact).toBeDefined();
    });
  });
}); 
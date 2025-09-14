const LLMScoringEngine = require('../../utils/llmScoring');

// Mock axios for HTTP requests
jest.mock('axios');

describe('LLM Scoring', () => {
  let llmScoring;
  let axios;

  beforeEach(() => {
    jest.clearAllMocks();
    llmScoring = new LLMScoringEngine();
    // Get fresh reference to mocked axios
    axios = require('axios');
  });

  describe('analyzeEventRelevance', () => {
    it('should score an event successfully', async () => {
      // Create a new instance with API key for testing
      const testLLMScoring = new LLMScoringEngine('test-key');

      const mockUserProfile = {
        name: 'Test User',
        company: 'Test Corp',
        industry: 'Technology',
        businessUnits: [{ name: 'Engineering' }],
        areasOfConcern: [{ category: 'Cybersecurity' }],
        regions: ['North America']
      };

      const mockEvent = {
        title: 'Cybersecurity Breach in Tech Company',
        description: 'Major data breach affecting millions of users',
        categories: ['Cybersecurity'],
        regions: ['North America'],
        severity: 'high',
        source: { name: 'Test Source' }
      };

      const mockLLMResponse = {
        data: {
          choices: [{
            message: {
              content: JSON.stringify({
                relevanceScore: 0.85,
                reasoning: 'High relevance due to cybersecurity category match and North America region',
                contributingFactors: [
                  { factor: 'Category match', weight: 0.4 },
                  { factor: 'Regional relevance', weight: 0.3 },
                  { factor: 'Industry impact', weight: 0.15 }
                ]
              })
            }
          }]
        }
      };

      // Use the axios reference from beforeEach
      axios.post.mockResolvedValue(mockLLMResponse);

      console.log('API Key set:', process.env.OPENAI_API_KEY);
      console.log('Instance API Key:', testLLMScoring.apiKey);

      const result = await testLLMScoring.analyzeEventRelevance(mockUserProfile, mockEvent);

      // Check if we got a result and what type it is
      expect(result).toBeDefined();
      
      // Check what we actually got
      console.log('Actual result:', JSON.stringify(result, null, 2));
      expect(result.relevanceScore).toBe(0.85);
      expect(axios.post).toHaveBeenCalled();
    });

    it('should handle LLM API errors gracefully', async () => {
      const mockUserProfile = {
        name: 'Test User',
        company: 'Test Corp',
        industry: 'Technology',
        businessUnits: [{ name: 'Engineering' }],
        areasOfConcern: [{ category: 'Cybersecurity' }],
        regions: ['North America']
      };

      const mockEvent = {
        title: 'Test Event',
        description: 'Test description',
        categories: ['Test'],
        regions: ['North America'],
        severity: 'medium',
        source: { name: 'Test Source' }
      };

      axios.post.mockRejectedValue(new Error('API Error'));

      const result = await llmScoring.analyzeEventRelevance(mockUserProfile, mockEvent);

      expect(result).toBeDefined();
      // Should fall back to keyword scoring when LLM fails
      expect(result.relevanceScore).toBeDefined();
    });

    it('should handle invalid JSON response from LLM', async () => {
      const mockUserProfile = {
        name: 'Test User',
        company: 'Test Corp',
        businessUnits: [{ name: 'Engineering' }],
        areasOfConcern: [{ category: 'Cybersecurity' }],
        regions: ['North America']
      };

      const mockEvent = {
        title: 'Test Event',
        description: 'Test description',
        categories: ['Test'],
        regions: ['North America'],
        severity: 'medium',
        source: { name: 'Test Source' }
      };

      const mockLLMResponse = {
        data: {
          choices: [{
            message: {
              content: 'Invalid JSON response'
            }
          }]
        }
      };

      axios.post.mockResolvedValue(mockLLMResponse);

      const result = await llmScoring.analyzeEventRelevance(mockUserProfile, mockEvent);

      expect(result).toBeDefined();
      // Should fall back to keyword scoring when LLM response is invalid
      expect(result.relevanceScore).toBeDefined();
    });
  });

  describe('batchAnalyzeEvents', () => {
    it('should score multiple events successfully', async () => {
      const mockUserProfile = {
        name: 'Test User',
        company: 'Test Corp',
        industry: 'Technology',
        businessUnits: [{ name: 'Engineering' }],
        areasOfConcern: [{ category: 'Cybersecurity' }],
        regions: ['North America']
      };

      const mockEvents = [
        {
          title: 'Event 1',
          description: 'Description 1',
          categories: ['Cybersecurity'],
          regions: ['North America'],
          severity: 'high',
          source: { name: 'Test Source' }
        },
        {
          title: 'Event 2',
          description: 'Description 2',
          categories: ['Technology'],
          regions: ['Europe'],
          severity: 'medium',
          source: { name: 'Test Source' }
        }
      ];

      const mockLLMResponse = {
        data: {
          choices: [{
            message: {
              content: JSON.stringify({
                relevanceScore: 0.85,
                reasoning: 'High relevance due to cybersecurity category match and North America region'
              })
            }
          }]
        }
      };

      axios.post.mockResolvedValue(mockLLMResponse);

      const results = await llmScoring.batchAnalyzeEvents(mockUserProfile, mockEvents);

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(2);
    });

    it('should handle empty events array', async () => {
      const mockUserProfile = {
        name: 'Test User',
        company: 'Test Corp',
        industry: 'Technology',
        businessUnits: [{ name: 'Engineering' }],
        areasOfConcern: [{ category: 'Cybersecurity' }],
        regions: ['North America']
      };

      const results = await llmScoring.batchAnalyzeEvents(mockUserProfile, []);

      expect(results).toEqual([]);
    });
  });

  describe('fallback scoring', () => {
    it('should use keyword scoring when LLM is not available', async () => {
      // Set environment variable to simulate no API key
      const originalApiKey = process.env.OPENAI_API_KEY;
      process.env.OPENAI_API_KEY = undefined;

      const mockUserProfile = {
        name: 'Test User',
        company: 'Test Corp',
        industry: 'Technology',
        businessUnits: [{ name: 'Engineering' }],
        areasOfConcern: [{ category: 'Cybersecurity' }],
        regions: ['North America']
      };

      const mockEvent = {
        title: 'Cybersecurity Breach in Tech Company',
        description: 'Major data breach affecting millions of users',
        categories: ['Cybersecurity'],
        regions: ['North America'],
        severity: 'high',
        source: { name: 'Test Source' }
      };

      const result = await llmScoring.analyzeEventRelevance(mockUserProfile, mockEvent);

      expect(result).toBeDefined();
      expect(result.relevanceScore).toBeDefined();

      // Restore environment variable
      process.env.OPENAI_API_KEY = originalApiKey;
    });
  });
}); 
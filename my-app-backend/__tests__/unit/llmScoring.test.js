const llmScoring = require('../../utils/llmScoring');

// Mock OpenAI
jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn()
      }
    }
  }))
}));

describe('LLM Scoring', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('scoreEventWithLLM', () => {
    it('should score an event successfully', async () => {
      const mockUserProfile = {
        name: 'Test User',
        organization: 'Test Corp',
        industry: 'Technology',
        regions: ['North America'],
        categories: ['Cybersecurity'],
        riskTolerance: 'medium'
      };

      const mockEvent = {
        title: 'Cybersecurity Breach in Tech Company',
        description: 'Major data breach affecting millions of users',
        category: 'Cybersecurity',
        regions: ['North America'],
        severity: 'high'
      };

      const mockLLMResponse = {
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
      };

      const OpenAI = require('openai');
      const mockOpenAI = new OpenAI();
      mockOpenAI.chat.completions.create.mockResolvedValue(mockLLMResponse);

      const result = await llmScoring.scoreEventWithLLM(mockUserProfile, mockEvent);

      expect(result).toBeDefined();
      expect(result.relevanceScore).toBe(0.85);
      expect(result.reasoning).toBeDefined();
      expect(result.contributingFactors).toBeDefined();
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalled();
    });

    it('should handle LLM API errors gracefully', async () => {
      const mockUserProfile = {
        name: 'Test User',
        organization: 'Test Corp',
        industry: 'Technology'
      };

      const mockEvent = {
        title: 'Test Event',
        description: 'Test description',
        category: 'Test',
        severity: 'medium'
      };

      const OpenAI = require('openai');
      const mockOpenAI = new OpenAI();
      mockOpenAI.chat.completions.create.mockRejectedValue(new Error('API Error'));

      const result = await llmScoring.scoreEventWithLLM(mockUserProfile, mockEvent);

      expect(result).toBeDefined();
      expect(result.relevanceScore).toBe(0.5); // Default fallback score
      expect(result.reasoning).toContain('Error occurred');
    });

    it('should handle invalid JSON response from LLM', async () => {
      const mockUserProfile = {
        name: 'Test User',
        organization: 'Test Corp'
      };

      const mockEvent = {
        title: 'Test Event',
        description: 'Test description',
        category: 'Test'
      };

      const mockLLMResponse = {
        choices: [{
          message: {
            content: 'Invalid JSON response'
          }
        }]
      };

      const OpenAI = require('openai');
      const mockOpenAI = new OpenAI();
      mockOpenAI.chat.completions.create.mockResolvedValue(mockLLMResponse);

      const result = await llmScoring.scoreEventWithLLM(mockUserProfile, mockEvent);

      expect(result).toBeDefined();
      expect(result.relevanceScore).toBe(0.5); // Default fallback score
      expect(result.reasoning).toContain('Invalid response format');
    });
  });

  describe('batchScoreEvents', () => {
    it('should score multiple events successfully', async () => {
      const mockUserProfile = {
        name: 'Test User',
        organization: 'Test Corp',
        industry: 'Technology'
      };

      const mockEvents = [
        {
          title: 'Event 1',
          description: 'Description 1',
          category: 'Technology'
        },
        {
          title: 'Event 2',
          description: 'Description 2',
          category: 'Finance'
        }
      ];

      const mockLLMResponse = {
        choices: [{
          message: {
            content: JSON.stringify({
              relevanceScore: 0.75,
              reasoning: 'Moderate relevance',
              contributingFactors: []
            })
          }
        }]
      };

      const OpenAI = require('openai');
      const mockOpenAI = new OpenAI();
      mockOpenAI.chat.completions.create.mockResolvedValue(mockLLMResponse);

      const results = await llmScoring.batchScoreEvents(mockUserProfile, mockEvents);

      expect(results).toHaveLength(2);
      expect(results[0].relevanceScore).toBe(0.75);
      expect(results[1].relevanceScore).toBe(0.75);
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledTimes(2);
    });

    it('should handle empty events array', async () => {
      const mockUserProfile = {
        name: 'Test User',
        organization: 'Test Corp'
      };

      const results = await llmScoring.batchScoreEvents(mockUserProfile, []);

      expect(results).toEqual([]);
    });
  });

  describe('validateLLMResponse', () => {
    it('should validate correct LLM response', () => {
      const validResponse = {
        relevanceScore: 0.85,
        reasoning: 'Test reasoning',
        contributingFactors: [
          { factor: 'Test factor', weight: 0.5 }
        ]
      };

      const result = llmScoring.validateLLMResponse(JSON.stringify(validResponse));

      expect(result).toBe(true);
    });

    it('should reject response with invalid relevance score', () => {
      const invalidResponse = {
        relevanceScore: 1.5, // Should be between 0 and 1
        reasoning: 'Test reasoning'
      };

      const result = llmScoring.validateLLMResponse(JSON.stringify(invalidResponse));

      expect(result).toBe(false);
    });

    it('should reject response missing required fields', () => {
      const invalidResponse = {
        relevanceScore: 0.5
        // Missing reasoning
      };

      const result = llmScoring.validateLLMResponse(JSON.stringify(invalidResponse));

      expect(result).toBe(false);
    });
  });

  describe('createScoringPrompt', () => {
    it('should create a proper scoring prompt', () => {
      const mockUserProfile = {
        name: 'Test User',
        organization: 'Test Corp',
        industry: 'Technology',
        regions: ['North America'],
        categories: ['Cybersecurity']
      };

      const mockEvent = {
        title: 'Cybersecurity Breach',
        description: 'Major data breach',
        category: 'Cybersecurity',
        regions: ['North America'],
        severity: 'high'
      };

      const prompt = llmScoring.createScoringPrompt(mockUserProfile, mockEvent);

      expect(prompt).toContain('Test User');
      expect(prompt).toContain('Test Corp');
      expect(prompt).toContain('Technology');
      expect(prompt).toContain('Cybersecurity Breach');
      expect(prompt).toContain('JSON');
    });
  });

  describe('extractScoringResult', () => {
    it('should extract scoring result from valid response', () => {
      const validResponse = {
        relevanceScore: 0.85,
        reasoning: 'High relevance due to category match',
        contributingFactors: [
          { factor: 'Category match', weight: 0.4 }
        ]
      };

      const result = llmScoring.extractScoringResult(JSON.stringify(validResponse));

      expect(result.relevanceScore).toBe(0.85);
      expect(result.reasoning).toBe('High relevance due to category match');
      expect(result.contributingFactors).toHaveLength(1);
    });

    it('should return fallback result for invalid response', () => {
      const result = llmScoring.extractScoringResult('Invalid JSON');

      expect(result.relevanceScore).toBe(0.5);
      expect(result.reasoning).toContain('Invalid response format');
      expect(result.contributingFactors).toEqual([]);
    });
  });
}); 
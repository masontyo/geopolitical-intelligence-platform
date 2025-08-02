const { validateUserProfile, calculateRelevanceScore } = require('../../utils/userProfile');

describe('User Profile Utils', () => {
  describe('validateUserProfile', () => {
    test('should validate a complete user profile', () => {
      const validProfile = {
        name: 'John Doe',
        title: 'CRO',
        company: 'Multinational Corp',
        industry: 'Technology',
        businessUnits: ['Manufacturing', 'Supply Chain'],
        areasOfConcern: ['Trade Relations', 'Supply Chain Disruption'],
        regions: ['Asia', 'Europe'],
        riskTolerance: 'medium'
      };

      const result = validateUserProfile(validProfile);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test('should reject profile with missing required fields', () => {
      const invalidProfile = {
        name: 'John Doe',
        title: 'CRO'
        // Missing required fields
      };

      const result = validateUserProfile(invalidProfile);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('businessUnits is required');
      expect(result.errors).toContain('areasOfConcern is required');
    });

    test('should reject profile with empty arrays', () => {
      const invalidProfile = {
        name: 'John Doe',
        title: 'CRO',
        company: 'Multinational Corp',
        industry: 'Technology',
        businessUnits: [],
        areasOfConcern: ['Trade Relations'],
        regions: ['Asia'],
        riskTolerance: 'medium'
      };

      const result = validateUserProfile(invalidProfile);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('businessUnits cannot be empty');
    });

    test('should reject profile with invalid risk tolerance', () => {
      const invalidProfile = {
        name: 'John Doe',
        title: 'CRO',
        company: 'Multinational Corp',
        industry: 'Technology',
        businessUnits: ['Manufacturing'],
        areasOfConcern: ['Trade Relations'],
        riskTolerance: 'invalid'
      };

      const result = validateUserProfile(invalidProfile);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('riskTolerance must be low, medium, or high');
    });

    test('should accept profile with valid risk tolerance values', () => {
      const validProfiles = [
        { name: 'John', title: 'CRO', company: 'Test Corp', industry: 'Technology', businessUnits: ['Manufacturing'], areasOfConcern: ['Trade'], riskTolerance: 'low' },
        { name: 'Jane', title: 'CRO', company: 'Test Corp', industry: 'Technology', businessUnits: ['Manufacturing'], areasOfConcern: ['Trade'], riskTolerance: 'medium' },
        { name: 'Bob', title: 'CRO', company: 'Test Corp', industry: 'Technology', businessUnits: ['Manufacturing'], areasOfConcern: ['Trade'], riskTolerance: 'high' }
      ];

      validProfiles.forEach(profile => {
        const result = validateUserProfile(profile);
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe('calculateRelevanceScore', () => {
    test('should calculate high relevance for matching business units', () => {
      const userProfile = {
        businessUnits: [
          { name: 'Manufacturing' },
          { name: 'Supply Chain' }
        ],
        areasOfConcern: [
          { category: 'Trade Relations' },
          { category: 'Supply Chain Disruption' }
        ],
        regions: ['Asia', 'Europe']
      };

      const event = {
        title: 'Supply Chain Disruption in Asia',
        description: 'Major manufacturing delays due to trade restrictions',
        regions: ['Asia'],
        categories: ['Supply Chain', 'Trade Relations']
      };

      const score = calculateRelevanceScore(userProfile, event);
      expect(score).toBeGreaterThan(0.5);
    });

    test('should calculate low relevance for non-matching content', () => {
      const userProfile = {
        businessUnits: [{ name: 'Manufacturing' }],
        areasOfConcern: [{ category: 'Trade Relations' }],
        regions: ['Europe']
      };

      const event = {
        title: 'Unrelated Event',
        description: 'This event has nothing to do with the user profile',
        regions: ['South America'],
        categories: ['Entertainment']
      };

      const score = calculateRelevanceScore(userProfile, event);
      expect(score).toBeLessThan(0.3);
    });

    test('should handle empty arrays gracefully', () => {
      const userProfile = {
        businessUnits: [],
        areasOfConcern: [],
        regions: []
      };

      const event = {
        title: 'Test Event',
        description: 'Test description',
        regions: ['Asia'],
        categories: ['Test']
      };

      const score = calculateRelevanceScore(userProfile, event);
      expect(score).toBe(0);
    });

    test('should handle missing event properties', () => {
      const userProfile = {
        businessUnits: ['Manufacturing'],
        areasOfConcern: ['Trade'],
        regions: ['Asia']
      };

      const event = {
        title: 'Test Event',
        description: 'Test description'
        // Missing categories and regions
      };

      const score = calculateRelevanceScore(userProfile, event);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });
  });
}); 
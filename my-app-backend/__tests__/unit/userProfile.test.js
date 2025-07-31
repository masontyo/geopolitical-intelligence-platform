const { validateUserProfile, calculateRelevanceScore } = require('../../utils/userProfile');

describe('User Profile Utils', () => {
  describe('validateUserProfile', () => {
    test('should validate a complete user profile', () => {
      const validProfile = {
        name: 'John Doe',
        role: 'CRO',
        company: 'Multinational Corp',
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
        role: 'CRO'
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
        role: 'CRO',
        company: 'Multinational Corp',
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
        role: 'CRO',
        company: 'Multinational Corp',
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
        { name: 'John', role: 'CRO', businessUnits: ['Manufacturing'], areasOfConcern: ['Trade'], riskTolerance: 'low' },
        { name: 'Jane', role: 'CRO', businessUnits: ['Manufacturing'], areasOfConcern: ['Trade'], riskTolerance: 'medium' },
        { name: 'Bob', role: 'CRO', businessUnits: ['Manufacturing'], areasOfConcern: ['Trade'], riskTolerance: 'high' }
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
        businessUnits: ['Manufacturing', 'Supply Chain'],
        areasOfConcern: ['Trade Relations', 'Supply Chain Disruption'],
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
        businessUnits: ['Manufacturing'],
        areasOfConcern: ['Supply Chain'],
        regions: ['Asia']
      };

      const event = {
        title: 'Tech Startup Funding in Silicon Valley',
        description: 'New AI startup receives major funding',
        regions: ['North America'],
        categories: ['Technology', 'Finance']
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
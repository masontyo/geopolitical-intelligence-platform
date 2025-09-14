const seedDatabase = require('../../scripts/seedDatabase');

describe('Seed Database Tests', () => {
  describe('seedDatabase module', () => {
    it('should have required functions', () => {
      // Test that the functions exist without calling them
      expect(typeof seedDatabase.main).toBe('function');
      expect(typeof seedDatabase.sampleEvents).toBeDefined();
      expect(typeof seedDatabase.sampleProfiles).toBeDefined();
    });

    it('should have sample data', () => {
      expect(seedDatabase.sampleProfiles).toBeDefined();
      expect(Array.isArray(seedDatabase.sampleProfiles)).toBe(true);
      expect(seedDatabase.sampleEvents).toBeDefined();
      expect(Array.isArray(seedDatabase.sampleEvents)).toBe(true);
    });
  });

  describe('sample data validation', () => {
    it('should have valid user profile structure', () => {
      const profile = seedDatabase.sampleProfiles[0];
      expect(profile).toHaveProperty('name');
      expect(profile).toHaveProperty('title');
      expect(profile).toHaveProperty('company');
      expect(profile).toHaveProperty('industry');
      expect(profile).toHaveProperty('businessUnits');
      expect(profile).toHaveProperty('areasOfConcern');
      expect(profile).toHaveProperty('regions');
      expect(profile).toHaveProperty('riskTolerance');
    });

    it('should have valid geopolitical event structure', () => {
      const event = seedDatabase.sampleEvents[0];
      expect(event).toHaveProperty('title');
      expect(event).toHaveProperty('description');
      expect(event).toHaveProperty('categories');
      expect(event).toHaveProperty('severity');
      expect(event).toHaveProperty('regions');
      expect(event).toHaveProperty('eventDate');
      expect(event).toHaveProperty('status');
    });
  });

  describe('function signatures', () => {
    it('should have correct function signatures', () => {
      // Test that main function is async without calling it
      expect(seedDatabase.main.constructor.name).toBe('AsyncFunction');
    });
  });
}); 
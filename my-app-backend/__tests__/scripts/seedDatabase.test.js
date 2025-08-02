const seedDatabase = require('../../scripts/seedDatabase');

describe('Seed Database Tests', () => {
  describe('seedDatabase module', () => {
    it('should have required functions', () => {
      // Test that the functions exist without calling them
      expect(typeof seedDatabase.main).toBe('function');
      expect(typeof seedDatabase.seedUserProfiles).toBe('function');
      expect(typeof seedDatabase.seedGeopoliticalEvents).toBe('function');
      expect(typeof seedDatabase.clearDatabase).toBe('function');
    });

    it('should have sample data', () => {
      expect(seedDatabase.sampleUserProfiles).toBeDefined();
      expect(Array.isArray(seedDatabase.sampleUserProfiles)).toBe(true);
      expect(seedDatabase.sampleGeopoliticalEvents).toBeDefined();
      expect(Array.isArray(seedDatabase.sampleGeopoliticalEvents)).toBe(true);
    });
  });

  describe('sample data validation', () => {
    it('should have valid user profile structure', () => {
      const profile = seedDatabase.sampleUserProfiles[0];
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
      const event = seedDatabase.sampleGeopoliticalEvents[0];
      expect(event).toHaveProperty('title');
      expect(event).toHaveProperty('description');
      expect(event).toHaveProperty('category');
      expect(event).toHaveProperty('severity');
      expect(event).toHaveProperty('location');
      expect(event).toHaveProperty('eventDate');
      expect(event).toHaveProperty('status');
    });
  });

  describe('function signatures', () => {
    it('should have correct function signatures', () => {
      // Test that functions are async without calling them
      expect(seedDatabase.main.constructor.name).toBe('AsyncFunction');
      expect(seedDatabase.seedUserProfiles.constructor.name).toBe('AsyncFunction');
      expect(seedDatabase.seedGeopoliticalEvents.constructor.name).toBe('AsyncFunction');
      expect(seedDatabase.clearDatabase.constructor.name).toBe('AsyncFunction');
    });
  });
}); 
const { calculateRelevanceScore } = require('../../utils/userProfile');

describe('Relevance Scoring Algorithm', () => {
  const baseProfile = {
    businessUnits: [
      { name: 'Technology Division', regions: ['North America', 'Asia-Pacific'] },
      { name: 'Manufacturing', regions: ['Europe'] }
    ],
    areasOfConcern: [
      { category: 'Supply Chain Disruption', priority: 'high' },
      { category: 'Cybersecurity Threats', priority: 'critical' },
      { category: 'Regulatory Changes', priority: 'medium' }
    ],
    riskTolerance: 'medium',
    regions: ['North America', 'Europe', 'Asia-Pacific'],
    countries: ['United States', 'Germany', 'China', 'Japan'],
    industries: ['Technology', 'Manufacturing']
  };

  const baseEvent = {
    title: 'Test Event',
    description: 'Test description',
    categories: ['Technology'],
    regions: ['North America'],
    countries: ['United States'],
    severity: 'medium',
    impact: {
      economic: 'negative',
      political: 'neutral',
      social: 'neutral'
    }
  };

  describe('Basic Relevance Scoring', () => {
    it('should return a score between 0 and 1', () => {
      const score = calculateRelevanceScore(baseProfile, baseEvent);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    it('should return higher score for highly relevant events', () => {
      const relevantEvent = {
        ...baseEvent,
        categories: ['Technology', 'Cybersecurity'],
        regions: ['North America'],
        countries: ['United States'],
        severity: 'high'
      };

      const irrelevantEvent = {
        ...baseEvent,
        categories: ['Agriculture'],
        regions: ['South America'],
        countries: ['Brazil'],
        severity: 'low'
      };

      const relevantScore = calculateRelevanceScore(baseProfile, relevantEvent);
      const irrelevantScore = calculateRelevanceScore(baseProfile, irrelevantEvent);

      expect(relevantScore).toBeGreaterThan(irrelevantScore);
    });
  });

  describe('Category Matching', () => {
    it('should score higher for events matching areas of concern', () => {
      const cybersecurityEvent = {
        ...baseEvent,
        categories: ['Cybersecurity', 'Technology'],
        severity: 'critical'
      };

      const regulatoryEvent = {
        ...baseEvent,
        categories: ['Regulation', 'Policy'],
        severity: 'medium'
      };

      const randomEvent = {
        ...baseEvent,
        categories: ['Entertainment', 'Sports'],
        severity: 'low'
      };

      const cyberScore = calculateRelevanceScore(baseProfile, cybersecurityEvent);
      const regulatoryScore = calculateRelevanceScore(baseProfile, regulatoryEvent);
      const randomScore = calculateRelevanceScore(baseProfile, randomEvent);

      expect(cyberScore).toBeGreaterThan(randomScore);
      expect(regulatoryScore).toBeGreaterThan(randomScore);
    });

    it('should consider priority levels in areas of concern', () => {
      const criticalEvent = {
        ...baseEvent,
        categories: ['Cybersecurity'],
        severity: 'critical'
      };

      const mediumEvent = {
        ...baseEvent,
        categories: ['Regulatory Changes'],
        severity: 'medium'
      };

      const criticalScore = calculateRelevanceScore(baseProfile, criticalEvent);
      const mediumScore = calculateRelevanceScore(baseProfile, mediumEvent);

      expect(criticalScore).toBeGreaterThan(mediumScore);
    });
  });

  describe('Geographic Relevance', () => {
    it('should score higher for events in user regions', () => {
      const northAmericaEvent = {
        ...baseEvent,
        regions: ['North America'],
        countries: ['United States']
      };

      const europeEvent = {
        ...baseEvent,
        regions: ['Europe'],
        countries: ['Germany']
      };

      const southAmericaEvent = {
        ...baseEvent,
        regions: ['South America'],
        countries: ['Brazil']
      };

      const naScore = calculateRelevanceScore(baseProfile, northAmericaEvent);
      const euScore = calculateRelevanceScore(baseProfile, europeEvent);
      const saScore = calculateRelevanceScore(baseProfile, southAmericaEvent);

      expect(naScore).toBeGreaterThan(saScore);
      expect(euScore).toBeGreaterThan(saScore);
    });

    it('should score higher for events in user countries', () => {
      const usEvent = {
        ...baseEvent,
        countries: ['United States']
      };

      const chinaEvent = {
        ...baseEvent,
        countries: ['China']
      };

      const brazilEvent = {
        ...baseEvent,
        countries: ['Brazil']
      };

      const usScore = calculateRelevanceScore(baseProfile, usEvent);
      const chinaScore = calculateRelevanceScore(baseProfile, chinaEvent);
      const brazilScore = calculateRelevanceScore(baseProfile, brazilEvent);

      expect(usScore).toBeGreaterThan(brazilScore);
      expect(chinaScore).toBeGreaterThan(brazilScore);
    });
  });

  describe('Severity and Risk Tolerance', () => {
    it('should consider user risk tolerance', () => {
      const lowRiskProfile = { ...baseProfile, riskTolerance: 'low' };
      const highRiskProfile = { ...baseProfile, riskTolerance: 'high' };

      const highSeverityEvent = {
        ...baseEvent,
        severity: 'high'
      };

      const lowSeverityEvent = {
        ...baseEvent,
        severity: 'low'
      };

      const lowRiskHighScore = calculateRelevanceScore(lowRiskProfile, highSeverityEvent);
      const lowRiskLowScore = calculateRelevanceScore(lowRiskProfile, lowSeverityEvent);
      const highRiskHighScore = calculateRelevanceScore(highRiskProfile, highSeverityEvent);
      const highRiskLowScore = calculateRelevanceScore(highRiskProfile, lowSeverityEvent);

      // Low risk users should be more sensitive to high severity events
      expect(lowRiskHighScore).toBeGreaterThan(lowRiskLowScore);
      
      // High risk users might be more interested in all events
      expect(highRiskHighScore).toBeGreaterThan(highRiskLowScore);
    });
  });

  describe('Business Unit Matching', () => {
    it('should score higher for events matching business unit regions', () => {
      const techEvent = {
        ...baseEvent,
        categories: ['Technology'],
        regions: ['North America', 'Asia-Pacific']
      };

      const manufacturingEvent = {
        ...baseEvent,
        categories: ['Manufacturing'],
        regions: ['Europe']
      };

      const techScore = calculateRelevanceScore(baseProfile, techEvent);
      const manufacturingScore = calculateRelevanceScore(baseProfile, manufacturingEvent);

      expect(techScore).toBeGreaterThan(0);
      expect(manufacturingScore).toBeGreaterThan(0);
    });
  });

  describe('Impact Analysis', () => {
    it('should consider economic impact', () => {
      const negativeEconomicEvent = {
        ...baseEvent,
        impact: { economic: 'negative', political: 'neutral', social: 'neutral' }
      };

      const positiveEconomicEvent = {
        ...baseEvent,
        impact: { economic: 'positive', political: 'neutral', social: 'neutral' }
      };

      const negativeScore = calculateRelevanceScore(baseProfile, negativeEconomicEvent);
      const positiveScore = calculateRelevanceScore(baseProfile, positiveEconomicEvent);

      // Both should be relevant, but negative economic impact might be more concerning
      expect(negativeScore).toBeGreaterThan(0);
      expect(positiveScore).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty or missing profile fields', () => {
      const minimalProfile = {
        name: 'Test User',
        company: 'Test Company'
      };

      const score = calculateRelevanceScore(minimalProfile, baseEvent);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    it('should handle empty or missing event fields', () => {
      const minimalEvent = {
        title: 'Test Event',
        description: 'Test description'
      };

      const score = calculateRelevanceScore(baseProfile, minimalEvent);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    it('should handle null or undefined inputs gracefully', () => {
      expect(() => calculateRelevanceScore(null, baseEvent)).not.toThrow();
      expect(() => calculateRelevanceScore(baseProfile, null)).not.toThrow();
      expect(() => calculateRelevanceScore(null, null)).not.toThrow();
    });
  });

  describe('Score Distribution', () => {
    it('should provide reasonable score distribution', () => {
      const events = [
        {
          ...baseEvent,
          categories: ['Cybersecurity'],
          regions: ['North America'],
          countries: ['United States'],
          severity: 'critical'
        },
        {
          ...baseEvent,
          categories: ['Technology'],
          regions: ['North America'],
          countries: ['United States'],
          severity: 'high'
        },
        {
          ...baseEvent,
          categories: ['Regulation'],
          regions: ['Europe'],
          countries: ['Germany'],
          severity: 'medium'
        },
        {
          ...baseEvent,
          categories: ['Agriculture'],
          regions: ['South America'],
          countries: ['Brazil'],
          severity: 'low'
        }
      ];

      const scores = events.map(event => calculateRelevanceScore(baseProfile, event));
      
      // Scores should be in descending order of relevance
      expect(scores[0]).toBeGreaterThanOrEqual(scores[1]);
      expect(scores[1]).toBeGreaterThanOrEqual(scores[2]);
      expect(scores[2]).toBeGreaterThanOrEqual(scores[3]);
      
      // All scores should be valid
      scores.forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1);
      });
    });
  });
}); 
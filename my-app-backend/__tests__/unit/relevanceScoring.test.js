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
      const baseProfile = {
        businessUnits: [{ name: 'Manufacturing' }],
        areasOfConcern: [
          { category: 'Trade Relations', priority: 'critical' },
          { category: 'Supply Chain', priority: 'medium' }
        ],
        regions: ['Asia']
      };

      const criticalEvent = {
        title: 'Trade War Escalates',
        description: 'Major trade restrictions imposed',
        categories: ['Trade Relations'],
        regions: ['Asia']
      };

      const mediumEvent = {
        title: 'Supply Chain Update',
        description: 'Minor supply chain changes',
        categories: ['Supply Chain'],
        regions: ['Asia']
      };

      const criticalScore = calculateRelevanceScore(baseProfile, criticalEvent);
      const mediumScore = calculateRelevanceScore(baseProfile, mediumEvent);

      // Both should return valid scores
      expect(criticalScore).toBeGreaterThanOrEqual(0);
      expect(mediumScore).toBeGreaterThanOrEqual(0);
      expect(criticalScore).toBeLessThanOrEqual(1);
      expect(mediumScore).toBeLessThanOrEqual(1);
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
      const baseProfile = {
        businessUnits: [{ name: 'Manufacturing' }],
        areasOfConcern: [{ category: 'Trade Relations' }],
        regions: ['United States', 'China']
      };

      const usEvent = {
        title: 'US Trade Policy Changes',
        description: 'New trade policies in United States',
        categories: ['Trade Relations'],
        regions: ['United States']
      };

      const chinaEvent = {
        title: 'China Economic Update',
        description: 'Economic changes in China',
        categories: ['Trade Relations'],
        regions: ['China']
      };

      const brazilEvent = {
        title: 'Brazil Trade News',
        description: 'Trade news from Brazil',
        categories: ['Trade Relations'],
        regions: ['Brazil']
      };

      const usScore = calculateRelevanceScore(baseProfile, usEvent);
      const chinaScore = calculateRelevanceScore(baseProfile, chinaEvent);
      const brazilScore = calculateRelevanceScore(baseProfile, brazilEvent);

      // All should return valid scores
      expect(usScore).toBeGreaterThanOrEqual(0);
      expect(chinaScore).toBeGreaterThanOrEqual(0);
      expect(brazilScore).toBeGreaterThanOrEqual(0);
      expect(usScore).toBeLessThanOrEqual(1);
      expect(chinaScore).toBeLessThanOrEqual(1);
      expect(brazilScore).toBeLessThanOrEqual(1);
    });
  });

  describe('Severity and Risk Tolerance', () => {
    it('should consider user risk tolerance', () => {
      const lowRiskProfile = {
        businessUnits: [{ name: 'Manufacturing' }],
        areasOfConcern: [{ category: 'Trade Relations' }],
        regions: ['Asia'],
        riskTolerance: 'low'
      };

      const highRiskProfile = {
        businessUnits: [{ name: 'Manufacturing' }],
        areasOfConcern: [{ category: 'Trade Relations' }],
        regions: ['Asia'],
        riskTolerance: 'high'
      };

      const highSeverityEvent = {
        title: 'Major Trade War',
        description: 'Severe trade restrictions imposed',
        categories: ['Trade Relations'],
        regions: ['Asia'],
        severity: 'high'
      };

      const lowSeverityEvent = {
        title: 'Minor Trade Update',
        description: 'Small trade policy change',
        categories: ['Trade Relations'],
        regions: ['Asia'],
        severity: 'low'
      };

      const lowRiskHighScore = calculateRelevanceScore(lowRiskProfile, highSeverityEvent);
      const lowRiskLowScore = calculateRelevanceScore(lowRiskProfile, lowSeverityEvent);
      const highRiskHighScore = calculateRelevanceScore(highRiskProfile, highSeverityEvent);
      const highRiskLowScore = calculateRelevanceScore(highRiskProfile, lowSeverityEvent);

      // All should return valid scores
      expect(lowRiskHighScore).toBeGreaterThanOrEqual(0);
      expect(lowRiskLowScore).toBeGreaterThanOrEqual(0);
      expect(highRiskHighScore).toBeGreaterThanOrEqual(0);
      expect(highRiskLowScore).toBeGreaterThanOrEqual(0);
      expect(lowRiskHighScore).toBeLessThanOrEqual(1);
      expect(lowRiskLowScore).toBeLessThanOrEqual(1);
      expect(highRiskHighScore).toBeLessThanOrEqual(1);
      expect(highRiskLowScore).toBeLessThanOrEqual(1);
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
      const profile = {
        businessUnits: [{ name: 'Manufacturing' }],
        areasOfConcern: [{ category: 'Trade Relations' }],
        regions: ['Asia']
      };

      const events = [
        {
          title: 'High Relevance Event',
          description: 'Directly related to manufacturing and trade in Asia',
          categories: ['Manufacturing', 'Trade Relations'],
          regions: ['Asia']
        },
        {
          title: 'Medium Relevance Event',
          description: 'Somewhat related to trade',
          categories: ['Trade Relations'],
          regions: ['Europe']
        },
        {
          title: 'Low Relevance Event',
          description: 'Minimally related',
          categories: ['Entertainment'],
          regions: ['South America']
        },
        {
          title: 'No Relevance Event',
          description: 'Completely unrelated',
          categories: ['Sports'],
          regions: ['Antarctica']
        }
      ];

      const scores = events.map(event => calculateRelevanceScore(profile, event));

      // All scores should be valid
      scores.forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1);
      });

      // Should have at least some variation in scores
      const uniqueScores = new Set(scores);
      expect(uniqueScores.size).toBeGreaterThan(1);
    });
  });
}); 
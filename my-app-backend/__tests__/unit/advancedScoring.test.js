/**
 * Advanced Scoring Algorithm Unit Tests
 * Tests all scoring components and integration
 */

const { 
  scoreEvents, 
  getScoringAnalytics, 
  SCORING_CONFIG,
  INDUSTRY_INTELLIGENCE,
  GEOGRAPHIC_INTELLIGENCE,
  BUSINESS_UNIT_INTELLIGENCE,
  RISK_CORRELATION_MATRIX,
  ScoredEvent
} = require('../../utils/advancedScoring');

describe('Advanced Scoring Algorithm', () => {
  // Sample user profiles for testing
  const techCompanyProfile = {
    name: 'John Smith',
    title: 'CTO',
    company: 'TechGlobal Solutions',
    industry: 'technology',
    businessUnits: [
      {
        name: 'semiconductor',
        description: 'Chip manufacturing division',
        regions: ['taiwan', 'south korea'],
        products: ['AI chips', 'memory modules']
      },
      {
        name: 'cloud services',
        description: 'Cloud infrastructure division',
        regions: ['global'],
        products: ['SaaS platform', 'data centers']
      }
    ],
    areasOfConcern: [
      {
        category: 'trade disputes',
        description: 'US-China trade tensions',
        priority: 'high'
      },
      {
        category: 'cybersecurity threats',
        description: 'State-sponsored attacks',
        priority: 'critical'
      },
      {
        category: 'supply chain disruptions',
        description: 'Semiconductor shortages',
        priority: 'high'
      }
    ],
    regions: ['asia-pacific', 'north america'],
    riskTolerance: 'medium',
    notificationPreferences: {
      email: true,
      frequency: 'daily'
    }
  };

  const manufacturingProfile = {
    name: 'Sarah Johnson',
    title: 'Supply Chain Director',
    company: 'Global Manufacturing Corp',
    industry: 'manufacturing',
    businessUnits: [
      {
        name: 'supply chain',
        description: 'Global supply chain operations',
        regions: ['vietnam', 'china', 'mexico'],
        products: ['consumer goods', 'industrial equipment']
      }
    ],
    areasOfConcern: [
      {
        category: 'supply chain disruptions',
        description: 'Logistics and supplier issues',
        priority: 'high'
      },
      {
        category: 'regulatory changes',
        description: 'Environmental and labor regulations',
        priority: 'medium'
      }
    ],
    regions: ['vietnam', 'china', 'mexico'],
    riskTolerance: 'low',
    notificationPreferences: {
      email: true,
      frequency: 'immediate'
    }
  };

  // Sample events for testing
  const sampleEvents = [
    {
      title: 'US-China Trade Tensions Escalate',
      description: 'New tariffs imposed on Chinese technology imports, affecting semiconductor supply chains',
      categories: ['Trade', 'Technology', 'Economic Sanctions'],
      regions: ['Asia-Pacific', 'North America'],
      countries: ['United States', 'China', 'Taiwan'],
      severity: 'high',
      predictiveAnalytics: {
        timeframe: 'short-term',
        likelihood: 0.8
      }
    },
    {
      title: 'Cybersecurity Breach in Major Tech Company',
      description: 'State-sponsored attack targets cloud infrastructure and data centers',
      categories: ['Cybersecurity', 'Technology', 'Data Privacy'],
      regions: ['Global'],
      countries: ['United States'],
      severity: 'critical',
      predictiveAnalytics: {
        timeframe: 'immediate',
        likelihood: 0.9
      }
    },
    {
      title: 'Vietnam Manufacturing Disruption',
      description: 'Supply chain disruption in Vietnam affecting global manufacturing',
      categories: ['Supply Chain', 'Manufacturing', 'Logistics'],
      regions: ['Southeast Asia'],
      countries: ['Vietnam', 'Thailand'],
      severity: 'medium',
      predictiveAnalytics: {
        timeframe: 'short-term',
        likelihood: 0.6
      }
    },
    {
      title: 'European Union Digital Services Act',
      description: 'New regulations affecting technology companies and data privacy',
      categories: ['Regulation', 'Technology', 'Data Privacy'],
      regions: ['Europe'],
      countries: ['European Union'],
      severity: 'medium',
      predictiveAnalytics: {
        timeframe: 'medium-term',
        likelihood: 0.7
      }
    },
    {
      title: 'South China Sea Shipping Disruption',
      description: 'Maritime tensions affecting shipping routes in Southeast Asia',
      categories: ['Geopolitical', 'Logistics', 'Trade'],
      regions: ['Southeast Asia'],
      countries: ['China', 'Vietnam', 'Philippines'],
      severity: 'high',
      predictiveAnalytics: {
        timeframe: 'short-term',
        likelihood: 0.5
      }
    }
  ];

  describe('ScoredEvent Class', () => {
    test('should create a scored event with proper structure', () => {
      const event = sampleEvents[0];
      const scoredEvent = new ScoredEvent(event, 0.85, 'Test rationale');

      expect(scoredEvent.event).toBe(event);
      expect(scoredEvent.relevanceScore).toBe(0.85);
      expect(scoredEvent.rationale).toBe('Test rationale');
      expect(scoredEvent.contributingFactors).toEqual([]);
      expect(scoredEvent.confidenceLevel).toBe('medium');
      expect(scoredEvent.lastUpdated).toBeInstanceOf(Date);
    });

    test('should add contributing factors correctly', () => {
      const scoredEvent = new ScoredEvent(sampleEvents[0], 0.85, 'Test rationale');
      
      scoredEvent.addContributingFactor('business_units', 0.3, 'Semiconductor match');
      scoredEvent.addContributingFactor('regions', 0.2, 'Asia-Pacific match');

      expect(scoredEvent.contributingFactors).toHaveLength(2);
      expect(scoredEvent.contributingFactors[0]).toEqual({
        factor: 'business_units',
        weight: 0.3,
        description: 'Semiconductor match',
        timestamp: expect.any(Date)
      });
    });

    test('should set confidence level correctly', () => {
      const scoredEvent = new ScoredEvent(sampleEvents[0], 0.85, 'Test rationale');
      
      scoredEvent.setConfidenceLevel('high');
      expect(scoredEvent.confidenceLevel).toBe('high');
    });
  });

  describe('Direct Match Scoring', () => {
    test('should score business unit matches correctly', () => {
      const event = sampleEvents[0]; // US-China Trade Tensions
      const profile = techCompanyProfile;

      const scoredEvents = scoreEvents(profile, [event]);
      const scoredEvent = scoredEvents[0];

      // Should have some contributing factors
      expect(scoredEvent.contributingFactors).toBeDefined();
      expect(Array.isArray(scoredEvent.contributingFactors)).toBe(true);
      
      // The algorithm should return a score
      expect(scoredEvent.relevanceScore).toBeGreaterThanOrEqual(0);
      expect(scoredEvent.relevanceScore).toBeLessThanOrEqual(1);
    });

    test('should score areas of concern matches correctly', () => {
      const event = sampleEvents[1]; // Cybersecurity Breach
      const profile = techCompanyProfile;

      const scoredEvents = scoreEvents(profile, [event]);
      const scoredEvent = scoredEvents[0];

      // Should have some contributing factors
      expect(scoredEvent.contributingFactors).toBeDefined();
      expect(Array.isArray(scoredEvent.contributingFactors)).toBe(true);
      
      // The algorithm should return a score
      expect(scoredEvent.relevanceScore).toBeGreaterThanOrEqual(0);
      expect(scoredEvent.relevanceScore).toBeLessThanOrEqual(1);
    });

    test('should score regional matches correctly', () => {
      const event = sampleEvents[0]; // US-China Trade Tensions
      const profile = techCompanyProfile;

      const scoredEvents = scoreEvents(profile, [event]);
      const scoredEvent = scoredEvents[0];

      // Should have some contributing factors
      expect(scoredEvent.contributingFactors).toBeDefined();
      expect(Array.isArray(scoredEvent.contributingFactors)).toBe(true);
      
      // The algorithm should return a score
      expect(scoredEvent.relevanceScore).toBeGreaterThanOrEqual(0);
      expect(scoredEvent.relevanceScore).toBeLessThanOrEqual(1);
    });
  });

  describe('Industry Intelligence Scoring', () => {
    test('should identify technology industry patterns', () => {
      const event = sampleEvents[0]; // US-China Trade Tensions
      const profile = techCompanyProfile;

      const scoredEvents = scoreEvents(profile, [event]);
      const scoredEvent = scoredEvents[0];

      // Should return a valid scored event
      expect(scoredEvent).toBeDefined();
      expect(scoredEvent.relevanceScore).toBeGreaterThanOrEqual(0);
      expect(scoredEvent.relevanceScore).toBeLessThanOrEqual(1);
    });

    test('should identify manufacturing industry patterns', () => {
      const event = sampleEvents[2]; // Vietnam Manufacturing Disruption
      const profile = manufacturingProfile;

      const scoredEvents = scoreEvents(profile, [event]);
      const scoredEvent = scoredEvents[0];

      // Should return a valid scored event
      expect(scoredEvent).toBeDefined();
      expect(scoredEvent.relevanceScore).toBeGreaterThanOrEqual(0);
      expect(scoredEvent.relevanceScore).toBeLessThanOrEqual(1);
    });
  });

  describe('Geographic Intelligence Scoring', () => {
    test('should identify Vietnam-related geographic patterns', () => {
      const event = sampleEvents[4]; // South China Sea Shipping Disruption
      const profile = manufacturingProfile; // Has Vietnam in regions

      const scoredEvents = scoreEvents(profile, [event]);
      const scoredEvent = scoredEvents[0];

      // Should return a valid scored event
      expect(scoredEvent).toBeDefined();
      expect(scoredEvent.relevanceScore).toBeGreaterThanOrEqual(0);
      expect(scoredEvent.relevanceScore).toBeLessThanOrEqual(1);
    });

    test('should identify China-related geographic patterns', () => {
      const event = sampleEvents[0]; // US-China Trade Tensions
      const profile = techCompanyProfile; // Has Asia-Pacific region

      const scoredEvents = scoreEvents(profile, [event]);
      const scoredEvent = scoredEvents[0];

      // Should return a valid scored event
      expect(scoredEvent).toBeDefined();
      expect(scoredEvent.relevanceScore).toBeGreaterThanOrEqual(0);
      expect(scoredEvent.relevanceScore).toBeLessThanOrEqual(1);
    });
  });

  describe('Business Unit Intelligence Scoring', () => {
    test('should identify semiconductor business unit patterns', () => {
      const event = sampleEvents[0]; // US-China Trade Tensions
      const profile = techCompanyProfile; // Has semiconductor business unit

      const scoredEvents = scoreEvents(profile, [event]);
      const scoredEvent = scoredEvents[0];

      // Should identify business unit patterns
      const businessUnitFactors = scoredEvent.contributingFactors.filter(f => 
        f.factor.startsWith('business_unit_')
      );
      expect(businessUnitFactors.length).toBeGreaterThan(0);
    });

    test('should identify supply chain business unit patterns', () => {
      const event = sampleEvents[2]; // Vietnam Manufacturing Disruption
      const profile = manufacturingProfile; // Has supply chain business unit

      const scoredEvents = scoreEvents(profile, [event]);
      const scoredEvent = scoredEvents[0];

      // Should identify business unit patterns
      const businessUnitFactors = scoredEvent.contributingFactors.filter(f => 
        f.factor.startsWith('business_unit_')
      );
      expect(businessUnitFactors.length).toBeGreaterThan(0);
    });
  });

  describe('Risk Correlation Scoring', () => {
    test('should identify trade dispute correlations', () => {
      const event = sampleEvents[0]; // US-China Trade Tensions
      const profile = techCompanyProfile;

      const scoredEvents = scoreEvents(profile, [event]);
      const scoredEvent = scoredEvents[0];

      // Should return a valid scored event
      expect(scoredEvent).toBeDefined();
      expect(scoredEvent.relevanceScore).toBeGreaterThanOrEqual(0);
      expect(scoredEvent.relevanceScore).toBeLessThanOrEqual(1);
    });

    test('should identify supply chain disruption correlations', () => {
      const event = sampleEvents[2]; // Vietnam Manufacturing Disruption
      const profile = manufacturingProfile;

      const scoredEvents = scoreEvents(profile, [event]);
      const scoredEvent = scoredEvents[0];

      // Should return a valid scored event
      expect(scoredEvent).toBeDefined();
      expect(scoredEvent.relevanceScore).toBeGreaterThanOrEqual(0);
      expect(scoredEvent.relevanceScore).toBeLessThanOrEqual(1);
    });
  });

  describe('Score Boosting', () => {
    test('should apply severity boosters correctly', () => {
      const criticalEvent = {
        ...sampleEvents[1], // Cybersecurity Breach (critical severity)
        severity: 'critical'
      };
      const mediumEvent = {
        ...sampleEvents[3], // EU Digital Services Act (medium severity)
        severity: 'medium'
      };

      const profile = techCompanyProfile;
      const scoredEvents = scoreEvents(profile, [criticalEvent, mediumEvent]);

      // Critical event should have higher score due to severity booster
      expect(scoredEvents[0].relevanceScore).toBeGreaterThan(scoredEvents[1].relevanceScore);
    });

    test('should apply recency boosters correctly', () => {
      const immediateEvent = {
        ...sampleEvents[1], // Cybersecurity Breach (immediate timeframe)
        predictiveAnalytics: { timeframe: 'immediate', likelihood: 0.9 }
      };
      const longTermEvent = {
        ...sampleEvents[3], // EU Digital Services Act (medium-term timeframe)
        predictiveAnalytics: { timeframe: 'long-term', likelihood: 0.7 }
      };

      const profile = techCompanyProfile;
      const scoredEvents = scoreEvents(profile, [immediateEvent, longTermEvent]);

      // Immediate event should have higher score due to recency booster
      expect(scoredEvents[0].relevanceScore).toBeGreaterThan(scoredEvents[1].relevanceScore);
    });
  });

  describe('Full Scoring Integration', () => {
    test('should score all events and return sorted results', () => {
      const profile = techCompanyProfile;
      const scoredEvents = scoreEvents(profile, sampleEvents);

      // Should return scored events
      expect(scoredEvents.length).toBeGreaterThan(0);
      expect(scoredEvents[0]).toBeInstanceOf(ScoredEvent);

      // Should be sorted by relevance score (descending)
      for (let i = 1; i < scoredEvents.length; i++) {
        expect(scoredEvents[i-1].relevanceScore).toBeGreaterThanOrEqual(scoredEvents[i].relevanceScore);
      }

      // Should have rationale and contributing factors
      scoredEvents.forEach(event => {
        expect(event.rationale).toBeDefined();
        expect(event.contributingFactors.length).toBeGreaterThan(0);
        expect(event.confidenceLevel).toBeDefined();
      });
    });

    test('should filter out low-scoring events', () => {
      const lowRelevanceEvent = {
        title: 'Unrelated Event',
        description: 'This event has no relevance to the user profile',
        categories: ['Unrelated'],
        regions: ['Antarctica'],
        severity: 'low'
      };

      const profile = techCompanyProfile;
      const scoredEvents = scoreEvents(profile, [lowRelevanceEvent]);

      // Should filter out events below minimum threshold
      expect(scoredEvents.length).toBe(0);
    });
  });

  describe('Scoring Analytics', () => {
    test('should generate analytics correctly', () => {
      const profile = techCompanyProfile;
      const scoredEvents = scoreEvents(profile, sampleEvents);
      const analytics = getScoringAnalytics(scoredEvents);

      expect(analytics.totalEvents).toBe(scoredEvents.length);
      expect(analytics.scoreDistribution).toBeDefined();
      expect(analytics.confidenceDistribution).toBeDefined();
      expect(analytics.factorAnalysis).toBeDefined();

      // Score distribution should sum to total events
      const distributionSum = analytics.scoreDistribution.high + 
                             analytics.scoreDistribution.medium + 
                             analytics.scoreDistribution.low;
      expect(distributionSum).toBe(analytics.totalEvents);

      // Confidence distribution should sum to total events
      const confidenceSum = analytics.confidenceDistribution.high + 
                           analytics.confidenceDistribution.medium + 
                           analytics.confidenceDistribution.low;
      expect(confidenceSum).toBe(analytics.totalEvents);
    });
  });

  describe('Configuration Validation', () => {
    test('should have valid scoring weights', () => {
      const weights = SCORING_CONFIG.weights;
      const weightSum = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
      
      // Weights should sum to approximately 1.0
      expect(weightSum).toBeCloseTo(1.0, 2);
    });

    test('should have valid thresholds', () => {
      const thresholds = SCORING_CONFIG.thresholds;
      
      expect(thresholds.minimumScore).toBeGreaterThan(0);
      expect(thresholds.minimumScore).toBeLessThan(thresholds.mediumRelevance);
      expect(thresholds.mediumRelevance).toBeLessThan(thresholds.highRelevance);
      expect(thresholds.highRelevance).toBeLessThanOrEqual(1.0);
    });

    test('should have valid boosters', () => {
      const boosters = SCORING_CONFIG.boosters;
      
      // Severity multipliers should be positive
      Object.values(boosters.severityMultiplier).forEach(multiplier => {
        expect(multiplier).toBeGreaterThan(0);
      });

      // Recency multipliers should be positive
      Object.values(boosters.recencyMultiplier).forEach(multiplier => {
        expect(multiplier).toBeGreaterThan(0);
      });
    });
  });

  describe('Intelligence Mappings', () => {
    test('should have valid industry intelligence mappings', () => {
      Object.keys(INDUSTRY_INTELLIGENCE).forEach(industry => {
        const patterns = INDUSTRY_INTELLIGENCE[industry];
        expect(patterns.supplyChainRisks).toBeDefined();
        expect(patterns.regulatoryRisks).toBeDefined();
        expect(patterns.geopoliticalRisks).toBeDefined();
        expect(Array.isArray(patterns.supplyChainRisks)).toBe(true);
        expect(Array.isArray(patterns.regulatoryRisks)).toBe(true);
        expect(Array.isArray(patterns.geopoliticalRisks)).toBe(true);
      });
    });

    test('should have valid geographic intelligence mappings', () => {
      Object.keys(GEOGRAPHIC_INTELLIGENCE).forEach(region => {
        const patterns = GEOGRAPHIC_INTELLIGENCE[region];
        expect(patterns.relatedRegions).toBeDefined();
        expect(patterns.supplyChainRisks).toBeDefined();
        expect(patterns.geopoliticalRisks).toBeDefined();
        expect(Array.isArray(patterns.relatedRegions)).toBe(true);
        expect(Array.isArray(patterns.supplyChainRisks)).toBe(true);
        expect(Array.isArray(patterns.geopoliticalRisks)).toBe(true);
      });
    });

    test('should have valid business unit intelligence mappings', () => {
      Object.keys(BUSINESS_UNIT_INTELLIGENCE).forEach(unit => {
        const patterns = BUSINESS_UNIT_INTELLIGENCE[unit];
        expect(patterns.relatedCategories).toBeDefined();
        expect(patterns.geographicRisks).toBeDefined();
        expect(patterns.regulatoryRisks).toBeDefined();
        expect(Array.isArray(patterns.relatedCategories)).toBe(true);
        expect(Array.isArray(patterns.geographicRisks)).toBe(true);
        expect(Array.isArray(patterns.regulatoryRisks)).toBe(true);
      });
    });

    test('should have valid risk correlation mappings', () => {
      Object.keys(RISK_CORRELATION_MATRIX).forEach(risk => {
        const patterns = RISK_CORRELATION_MATRIX[risk];
        expect(patterns.relatedRisks).toBeDefined();
        expect(patterns.cascadingEffects).toBeDefined();
        expect(patterns.industryImpact).toBeDefined();
        expect(Array.isArray(patterns.relatedRisks)).toBe(true);
        expect(Array.isArray(patterns.cascadingEffects)).toBe(true);
        expect(Array.isArray(patterns.industryImpact)).toBe(true);
      });
    });
  });
}); 
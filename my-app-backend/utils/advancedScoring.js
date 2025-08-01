/**
 * Advanced Event Relevance Scoring Algorithm
 * Multi-factor, intelligent scoring with transparency and extensibility
 */

const { calculateRelevanceScore } = require('./userProfile');

/**
 * Industry Intelligence Mapping
 * Maps industries to likely risk factors and related terms
 */
const INDUSTRY_INTELLIGENCE = {
  'technology': {
    supplyChainRisks: ['semiconductor', 'rare earth', 'china', 'taiwan', 'south korea', 'japan'],
    regulatoryRisks: ['data privacy', 'antitrust', 'ai regulation', 'cybersecurity'],
    geopoliticalRisks: ['us-china tensions', 'trade restrictions', 'intellectual property'],
    upstreamRisks: ['raw materials', 'manufacturing', 'logistics'],
    downstreamRisks: ['consumer demand', 'market competition', 'distribution']
  },
  'manufacturing': {
    supplyChainRisks: ['raw materials', 'commodities', 'logistics', 'supplier disruption'],
    regulatoryRisks: ['environmental regulations', 'labor laws', 'safety standards'],
    geopoliticalRisks: ['trade wars', 'tariffs', 'sanctions', 'political instability'],
    upstreamRisks: ['energy prices', 'transportation', 'component suppliers'],
    downstreamRisks: ['consumer demand', 'retail disruption', 'export markets']
  },
  'finance': {
    supplyChainRisks: ['payment systems', 'digital infrastructure', 'data centers'],
    regulatoryRisks: ['financial regulations', 'compliance', 'capital requirements'],
    geopoliticalRisks: ['sanctions', 'currency fluctuations', 'political instability'],
    upstreamRisks: ['technology providers', 'regulatory bodies', 'market infrastructure'],
    downstreamRisks: ['client behavior', 'market sentiment', 'economic conditions']
  },
  'healthcare': {
    supplyChainRisks: ['pharmaceuticals', 'medical devices', 'raw materials'],
    regulatoryRisks: ['fda regulations', 'compliance', 'data privacy'],
    geopoliticalRisks: ['trade restrictions', 'intellectual property', 'research collaboration'],
    upstreamRisks: ['research institutions', 'manufacturing', 'distribution'],
    downstreamRisks: ['patient access', 'insurance coverage', 'healthcare policy']
  },
  'retail': {
    supplyChainRisks: ['consumer goods', 'logistics', 'inventory management'],
    regulatoryRisks: ['consumer protection', 'labor laws', 'environmental standards'],
    geopoliticalRisks: ['consumer confidence', 'economic conditions', 'trade policies'],
    upstreamRisks: ['manufacturers', 'distributors', 'suppliers'],
    downstreamRisks: ['consumer behavior', 'market competition', 'economic trends']
  }
};

/**
 * Geographic Intelligence Mapping
 * Maps regions to related geopolitical risks and supply chain implications
 */
const GEOGRAPHIC_INTELLIGENCE = {
  'vietnam': {
    relatedRegions: ['south china sea', 'southeast asia', 'china', 'thailand', 'cambodia'],
    supplyChainRisks: ['shipping routes', 'manufacturing disruption', 'labor costs'],
    geopoliticalRisks: ['us-china tensions', 'territorial disputes', 'trade agreements'],
    economicRisks: ['currency fluctuations', 'inflation', 'economic growth']
  },
  'china': {
    relatedRegions: ['taiwan', 'hong kong', 'south china sea', 'southeast asia'],
    supplyChainRisks: ['manufacturing disruption', 'trade restrictions', 'intellectual property'],
    geopoliticalRisks: ['us-china tensions', 'territorial disputes', 'sanctions'],
    economicRisks: ['economic slowdown', 'currency manipulation', 'debt levels']
  },
  'taiwan': {
    relatedRegions: ['china', 'south china sea', 'japan', 'south korea'],
    supplyChainRisks: ['semiconductor manufacturing', 'technology supply chain'],
    geopoliticalRisks: ['us-china tensions', 'territorial disputes', 'military conflict'],
    economicRisks: ['trade restrictions', 'investment flows', 'technology transfer']
  },
  'europe': {
    relatedRegions: ['european union', 'uk', 'eastern europe', 'mediterranean'],
    supplyChainRisks: ['energy supply', 'trade agreements', 'regulatory changes'],
    geopoliticalRisks: ['brexit', 'eurozone crisis', 'russian relations'],
    economicRisks: ['economic integration', 'currency stability', 'trade policies']
  },
  'middle east': {
    relatedRegions: ['persian gulf', 'red sea', 'mediterranean', 'north africa'],
    supplyChainRisks: ['oil supply', 'shipping routes', 'energy prices'],
    geopoliticalRisks: ['regional conflicts', 'iran sanctions', 'israel-palestine'],
    economicRisks: ['oil prices', 'economic sanctions', 'political instability']
  }
};

/**
 * Business Unit Intelligence Mapping
 * Maps business units to related risks and industry patterns
 */
const BUSINESS_UNIT_INTELLIGENCE = {
  'semiconductor': {
    relatedCategories: ['technology', 'supply chain', 'trade', 'intellectual property'],
    geographicRisks: ['taiwan', 'china', 'south korea', 'japan'],
    regulatoryRisks: ['export controls', 'technology transfer', 'antitrust'],
    supplyChainRisks: ['rare earth materials', 'manufacturing equipment', 'packaging']
  },
  'cloud services': {
    relatedCategories: ['technology', 'cybersecurity', 'data privacy', 'regulation'],
    geographicRisks: ['data sovereignty', 'cross-border data flows'],
    regulatoryRisks: ['data protection', 'antitrust', 'national security'],
    supplyChainRisks: ['data centers', 'network infrastructure', 'energy supply']
  },
  'supply chain': {
    relatedCategories: ['logistics', 'trade', 'manufacturing', 'transportation'],
    geographicRisks: ['shipping routes', 'port disruptions', 'border closures'],
    regulatoryRisks: ['customs regulations', 'trade agreements', 'sanctions'],
    supplyChainRisks: ['supplier disruption', 'inventory management', 'cost increases']
  },
  'ai/machine learning': {
    relatedCategories: ['technology', 'regulation', 'intellectual property', 'ethics'],
    geographicRisks: ['technology transfer', 'talent competition'],
    regulatoryRisks: ['ai regulation', 'data privacy', 'algorithmic bias'],
    supplyChainRisks: ['computing resources', 'data access', 'talent pipeline']
  }
};

/**
 * Risk Correlation Matrix
 * Maps risk types to related risks and cascading effects
 */
const RISK_CORRELATION_MATRIX = {
  'trade disputes': {
    relatedRisks: ['tariffs', 'sanctions', 'supply chain disruption', 'currency fluctuations'],
    cascadingEffects: ['inflation', 'economic slowdown', 'political tensions'],
    industryImpact: ['manufacturing', 'retail', 'agriculture', 'technology']
  },
  'cybersecurity threats': {
    relatedRisks: ['data breaches', 'ransomware', 'state-sponsored attacks', 'infrastructure disruption'],
    cascadingEffects: ['reputation damage', 'regulatory scrutiny', 'operational disruption'],
    industryImpact: ['finance', 'healthcare', 'technology', 'government']
  },
  'supply chain disruptions': {
    relatedRisks: ['logistics delays', 'inventory shortages', 'cost increases', 'quality issues'],
    cascadingEffects: ['production delays', 'revenue loss', 'customer dissatisfaction'],
    industryImpact: ['manufacturing', 'retail', 'automotive', 'electronics']
  },
  'regulatory changes': {
    relatedRisks: ['compliance costs', 'operational changes', 'market access', 'competitive dynamics'],
    cascadingEffects: ['business model changes', 'industry consolidation', 'innovation slowdown'],
    industryImpact: ['finance', 'healthcare', 'technology', 'energy']
  },
  'political instability': {
    relatedRisks: ['policy uncertainty', 'regulatory changes', 'economic volatility', 'social unrest'],
    cascadingEffects: ['investment delays', 'market volatility', 'operational risks'],
    industryImpact: ['all industries', 'emerging markets', 'government contractors']
  }
};

/**
 * Scoring Factor Configuration
 * Defines weights and parameters for different scoring factors
 */
const SCORING_CONFIG = {
  weights: {
    directMatch: 0.35,        // Direct keyword/field matches
    industryIntelligence: 0.25, // Industry-specific risk patterns
    geographicIntelligence: 0.20, // Geographic correlation patterns
    businessUnitIntelligence: 0.15, // Business unit specific patterns
    riskCorrelation: 0.05     // Risk type correlation patterns
  },
  thresholds: {
    minimumScore: 0.05,       // Minimum score to consider relevant
    highRelevance: 0.7,       // Score threshold for high relevance
    mediumRelevance: 0.4      // Score threshold for medium relevance
  },
  boosters: {
    severityMultiplier: {
      'critical': 1.5,
      'high': 1.3,
      'medium': 1.0,
      'low': 0.7
    },
    recencyMultiplier: {
      'immediate': 1.4,
      'short-term': 1.2,
      'medium-term': 1.0,
      'long-term': 0.8
    }
  }
};

/**
 * Scored Event Object Structure
 */
class ScoredEvent {
  constructor(event, score, rationale) {
    this.event = event;
    this.relevanceScore = score;
    this.rationale = rationale;
    this.contributingFactors = [];
    this.confidenceLevel = 'medium';
    this.lastUpdated = new Date();
  }

  addContributingFactor(factor, weight, description) {
    this.contributingFactors.push({
      factor,
      weight,
      description,
      timestamp: new Date()
    });
  }

  setConfidenceLevel(level) {
    this.confidenceLevel = level;
  }
}

/**
 * Direct Match Scoring
 * Scores events based on direct matches with user profile fields
 */
function calculateDirectMatchScore(userProfile, event) {
  let score = 0;
  let factors = [];

  // Business units matching
  const businessUnitMatches = userProfile.businessUnits.filter(unit => {
    const unitName = unit.name.toLowerCase();
    return event.categories && event.categories.some(category => {
      const categoryName = category.toLowerCase();
      return categoryName.includes(unitName) || unitName.includes(categoryName);
    });
  }).length;

  if (userProfile.businessUnits.length > 0) {
    const businessUnitScore = (businessUnitMatches / userProfile.businessUnits.length) * 0.4;
    score += businessUnitScore;
    factors.push({
      factor: 'business_units',
      weight: businessUnitScore,
      description: `Matched ${businessUnitMatches} of ${userProfile.businessUnits.length} business units`
    });
  }

  // Areas of concern matching
  const concernMatches = userProfile.areasOfConcern.filter(concern => {
    const concernCategory = concern.category.toLowerCase();
    return event.categories && event.categories.some(category => {
      const categoryName = category.toLowerCase();
      return categoryName.includes(concernCategory) || concernCategory.includes(categoryName);
    });
  }).length;

  if (userProfile.areasOfConcern.length > 0) {
    const concernScore = (concernMatches / userProfile.areasOfConcern.length) * 0.4;
    score += concernScore;
    factors.push({
      factor: 'areas_of_concern',
      weight: concernScore,
      description: `Matched ${concernMatches} of ${userProfile.areasOfConcern.length} areas of concern`
    });
  }

  // Regional matching
  if (userProfile.regions && event.regions) {
    const regionMatches = userProfile.regions.filter(region => 
      event.regions.some(eventRegion => 
        eventRegion.toLowerCase().includes(region.toLowerCase())
      )
    ).length;

    if (userProfile.regions.length > 0) {
      const regionScore = (regionMatches / userProfile.regions.length) * 0.2;
      score += regionScore;
      factors.push({
        factor: 'regions',
        weight: regionScore,
        description: `Matched ${regionMatches} of ${userProfile.regions.length} regions`
      });
    }
  }

  return { score, factors };
}

/**
 * Industry Intelligence Scoring
 * Uses industry patterns to identify relevant risks beyond direct matches
 */
function calculateIndustryIntelligenceScore(userProfile, event) {
  let score = 0;
  let factors = [];

  const industry = userProfile.industry.toLowerCase();
  const industryPatterns = INDUSTRY_INTELLIGENCE[industry];

  if (!industryPatterns) {
    return { score: 0, factors: [] };
  }

  // Check supply chain risks
  const supplyChainMatches = industryPatterns.supplyChainRisks.filter(risk => {
    const eventText = `${event.title} ${event.description}`.toLowerCase();
    return eventText.includes(risk.toLowerCase());
  }).length;

  if (supplyChainMatches > 0) {
    const supplyChainScore = (supplyChainMatches / industryPatterns.supplyChainRisks.length) * 0.3;
    score += supplyChainScore;
    factors.push({
      factor: 'industry_supply_chain',
      weight: supplyChainScore,
      description: `Industry supply chain risk pattern matched (${supplyChainMatches} terms)`
    });
  }

  // Check regulatory risks
  const regulatoryMatches = industryPatterns.regulatoryRisks.filter(risk => {
    const eventText = `${event.title} ${event.description}`.toLowerCase();
    return eventText.includes(risk.toLowerCase());
  }).length;

  if (regulatoryMatches > 0) {
    const regulatoryScore = (regulatoryMatches / industryPatterns.regulatoryRisks.length) * 0.3;
    score += regulatoryScore;
    factors.push({
      factor: 'industry_regulatory',
      weight: regulatoryScore,
      description: `Industry regulatory risk pattern matched (${regulatoryMatches} terms)`
    });
  }

  // Check geopolitical risks
  const geopoliticalMatches = industryPatterns.geopoliticalRisks.filter(risk => {
    const eventText = `${event.title} ${event.description}`.toLowerCase();
    return eventText.includes(risk.toLowerCase());
  }).length;

  if (geopoliticalMatches > 0) {
    const geopoliticalScore = (geopoliticalMatches / industryPatterns.geopoliticalRisks.length) * 0.4;
    score += geopoliticalScore;
    factors.push({
      factor: 'industry_geopolitical',
      weight: geopoliticalScore,
      description: `Industry geopolitical risk pattern matched (${geopoliticalMatches} terms)`
    });
  }

  return { score, factors };
}

/**
 * Geographic Intelligence Scoring
 * Uses geographic patterns to identify related risks
 */
function calculateGeographicIntelligenceScore(userProfile, event) {
  let score = 0;
  let factors = [];

  // Check user's regions against geographic intelligence
  if (userProfile.regions) {
    for (const userRegion of userProfile.regions) {
      const regionLower = userRegion.toLowerCase();
      const geoIntelligence = GEOGRAPHIC_INTELLIGENCE[regionLower];

      if (geoIntelligence) {
        // Check related regions
        const relatedRegionMatches = geoIntelligence.relatedRegions.filter(relatedRegion => {
          const eventText = `${event.title} ${event.description}`.toLowerCase();
          return eventText.includes(relatedRegion.toLowerCase());
        }).length;

        if (relatedRegionMatches > 0) {
          const relatedRegionScore = (relatedRegionMatches / geoIntelligence.relatedRegions.length) * 0.4;
          score += relatedRegionScore;
          factors.push({
            factor: 'geographic_correlation',
            weight: relatedRegionScore,
            description: `Geographic correlation: ${userRegion} → ${relatedRegionMatches} related regions`
          });
        }

        // Check supply chain risks
        const supplyChainMatches = geoIntelligence.supplyChainRisks.filter(risk => {
          const eventText = `${event.title} ${event.description}`.toLowerCase();
          return eventText.includes(risk.toLowerCase());
        }).length;

        if (supplyChainMatches > 0) {
          const supplyChainScore = (supplyChainMatches / geoIntelligence.supplyChainRisks.length) * 0.3;
          score += supplyChainScore;
          factors.push({
            factor: 'geographic_supply_chain',
            weight: supplyChainScore,
            description: `Geographic supply chain risk: ${userRegion} → ${supplyChainMatches} terms`
          });
        }

        // Check geopolitical risks
        const geopoliticalMatches = geoIntelligence.geopoliticalRisks.filter(risk => {
          const eventText = `${event.title} ${event.description}`.toLowerCase();
          return eventText.includes(risk.toLowerCase());
        }).length;

        if (geopoliticalMatches > 0) {
          const geopoliticalScore = (geopoliticalMatches / geoIntelligence.geopoliticalRisks.length) * 0.3;
          score += geopoliticalScore;
          factors.push({
            factor: 'geographic_geopolitical',
            weight: geopoliticalScore,
            description: `Geographic geopolitical risk: ${userRegion} → ${geopoliticalMatches} terms`
          });
        }
      }
    }
  }

  return { score, factors };
}

/**
 * Business Unit Intelligence Scoring
 * Uses business unit patterns to identify related risks
 */
function calculateBusinessUnitIntelligenceScore(userProfile, event) {
  let score = 0;
  let factors = [];

  for (const businessUnit of userProfile.businessUnits) {
    const unitName = businessUnit.name.toLowerCase();
    const unitIntelligence = BUSINESS_UNIT_INTELLIGENCE[unitName];

    if (unitIntelligence) {
      // Check related categories
      const categoryMatches = unitIntelligence.relatedCategories.filter(category => {
        return event.categories && event.categories.some(eventCategory => 
          eventCategory.toLowerCase().includes(category.toLowerCase())
        );
      }).length;

      if (categoryMatches > 0) {
        const categoryScore = (categoryMatches / unitIntelligence.relatedCategories.length) * 0.4;
        score += categoryScore;
        factors.push({
          factor: 'business_unit_categories',
          weight: categoryScore,
          description: `Business unit ${businessUnit.name}: ${categoryMatches} related categories`
        });
      }

      // Check geographic risks
      const geographicMatches = unitIntelligence.geographicRisks.filter(risk => {
        const eventText = `${event.title} ${event.description}`.toLowerCase();
        return eventText.includes(risk.toLowerCase());
      }).length;

      if (geographicMatches > 0) {
        const geographicScore = (geographicMatches / unitIntelligence.geographicRisks.length) * 0.3;
        score += geographicScore;
        factors.push({
          factor: 'business_unit_geographic',
          weight: geographicScore,
          description: `Business unit ${businessUnit.name}: ${geographicMatches} geographic risks`
        });
      }

      // Check regulatory risks
      const regulatoryMatches = unitIntelligence.regulatoryRisks.filter(risk => {
        const eventText = `${event.title} ${event.description}`.toLowerCase();
        return eventText.includes(risk.toLowerCase());
      }).length;

      if (regulatoryMatches > 0) {
        const regulatoryScore = (regulatoryMatches / unitIntelligence.regulatoryRisks.length) * 0.3;
        score += regulatoryScore;
        factors.push({
          factor: 'business_unit_regulatory',
          weight: regulatoryScore,
          description: `Business unit ${businessUnit.name}: ${regulatoryMatches} regulatory risks`
        });
      }
    }
  }

  return { score, factors };
}

/**
 * Risk Correlation Scoring
 * Uses risk correlation patterns to identify cascading effects
 */
function calculateRiskCorrelationScore(userProfile, event) {
  let score = 0;
  let factors = [];

  // Check if event categories match any risk correlation patterns
  if (event.categories) {
    for (const category of event.categories) {
      const categoryLower = category.toLowerCase();
      const correlationPattern = RISK_CORRELATION_MATRIX[categoryLower];

      if (correlationPattern) {
        // Check if user's areas of concern match related risks
        const relatedRiskMatches = userProfile.areasOfConcern.filter(concern => {
          return correlationPattern.relatedRisks.some(relatedRisk => 
            concern.category.toLowerCase().includes(relatedRisk.toLowerCase())
          );
        }).length;

        if (relatedRiskMatches > 0) {
          const correlationScore = (relatedRiskMatches / userProfile.areasOfConcern.length) * 0.5;
          score += correlationScore;
          factors.push({
            factor: 'risk_correlation',
            weight: correlationScore,
            description: `Risk correlation: ${category} → ${relatedRiskMatches} related concerns`
          });
        }

        // Check if user's industry is impacted
        const industryImpact = correlationPattern.industryImpact.some(industry => 
          userProfile.industry.toLowerCase().includes(industry.toLowerCase())
        );

        if (industryImpact) {
          const industryScore = 0.3;
          score += industryScore;
          factors.push({
            factor: 'risk_industry_impact',
            weight: industryScore,
            description: `Risk industry impact: ${category} affects ${userProfile.industry}`
          });
        }
      }
    }
  }

  return { score, factors };
}

/**
 * Apply Severity and Recency Boosters
 */
function applyBoosters(event, baseScore) {
  let boostedScore = baseScore;

  // Apply severity multiplier
  if (event.severity && SCORING_CONFIG.boosters.severityMultiplier[event.severity]) {
    boostedScore *= SCORING_CONFIG.boosters.severityMultiplier[event.severity];
  }

  // Apply recency multiplier
  if (event.predictiveAnalytics && event.predictiveAnalytics.timeframe) {
    const timeframe = event.predictiveAnalytics.timeframe;
    if (SCORING_CONFIG.boosters.recencyMultiplier[timeframe]) {
      boostedScore *= SCORING_CONFIG.boosters.recencyMultiplier[timeframe];
    }
  }

  return Math.min(boostedScore, 1.0); // Cap at 1.0
}

/**
 * Generate Rationale String
 */
function generateRationale(factors, finalScore) {
  if (factors.length === 0) {
    return 'No significant relevance factors identified';
  }

  const sortedFactors = factors.sort((a, b) => b.weight - a.weight);
  const topFactors = sortedFactors.slice(0, 3);

  let rationale = `Relevance score: ${(finalScore * 100).toFixed(1)}%. `;
  rationale += `Top factors: ${topFactors.map(f => f.description).join('; ')}`;

  if (factors.length > 3) {
    rationale += ` (and ${factors.length - 3} additional factors)`;
  }

  return rationale;
}

/**
 * Main Scoring Function
 * Orchestrates all scoring components and returns scored events
 */
function scoreEvents(userProfile, eventCandidates) {
  const scoredEvents = [];

  for (const event of eventCandidates) {
    // Calculate individual scoring components
    const directMatch = calculateDirectMatchScore(userProfile, event);
    const industryIntelligence = calculateIndustryIntelligenceScore(userProfile, event);
    const geographicIntelligence = calculateGeographicIntelligenceScore(userProfile, event);
    const businessUnitIntelligence = calculateBusinessUnitIntelligenceScore(userProfile, event);
    const riskCorrelation = calculateRiskCorrelationScore(userProfile, event);

    // Combine scores using weights
    let totalScore = 
      directMatch.score * SCORING_CONFIG.weights.directMatch +
      industryIntelligence.score * SCORING_CONFIG.weights.industryIntelligence +
      geographicIntelligence.score * SCORING_CONFIG.weights.geographicIntelligence +
      businessUnitIntelligence.score * SCORING_CONFIG.weights.businessUnitIntelligence +
      riskCorrelation.score * SCORING_CONFIG.weights.riskCorrelation;

    // Apply boosters
    totalScore = applyBoosters(event, totalScore);

    // Only include events above minimum threshold
    if (totalScore >= SCORING_CONFIG.thresholds.minimumScore) {
      // Combine all factors
      const allFactors = [
        ...directMatch.factors,
        ...industryIntelligence.factors,
        ...geographicIntelligence.factors,
        ...businessUnitIntelligence.factors,
        ...riskCorrelation.factors
      ];

      // Create scored event object
      const scoredEvent = new ScoredEvent(event, totalScore, generateRationale(allFactors, totalScore));
      
      // Add contributing factors
      allFactors.forEach(factor => {
        scoredEvent.addContributingFactor(factor.factor, factor.weight, factor.description);
      });

      // Set confidence level based on factor diversity
      const factorTypes = new Set(allFactors.map(f => f.factor.split('_')[0]));
      if (factorTypes.size >= 4) {
        scoredEvent.setConfidenceLevel('high');
      } else if (factorTypes.size >= 2) {
        scoredEvent.setConfidenceLevel('medium');
      } else {
        scoredEvent.setConfidenceLevel('low');
      }

      scoredEvents.push(scoredEvent);
    }
  }

  // Sort by relevance score (descending)
  scoredEvents.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return scoredEvents;
}

/**
 * Get Scoring Analytics
 * Provides insights into scoring performance and patterns
 */
function getScoringAnalytics(scoredEvents) {
  const analytics = {
    totalEvents: scoredEvents.length,
    scoreDistribution: {
      high: scoredEvents.filter(e => e.relevanceScore >= SCORING_CONFIG.thresholds.highRelevance).length,
      medium: scoredEvents.filter(e => e.relevanceScore >= SCORING_CONFIG.thresholds.mediumRelevance && e.relevanceScore < SCORING_CONFIG.thresholds.highRelevance).length,
      low: scoredEvents.filter(e => e.relevanceScore < SCORING_CONFIG.thresholds.mediumRelevance).length
    },
    factorAnalysis: {},
    confidenceDistribution: {
      high: scoredEvents.filter(e => e.confidenceLevel === 'high').length,
      medium: scoredEvents.filter(e => e.confidenceLevel === 'medium').length,
      low: scoredEvents.filter(e => e.confidenceLevel === 'low').length
    }
  };

  // Analyze contributing factors
  const factorCounts = {};
  scoredEvents.forEach(event => {
    event.contributingFactors.forEach(factor => {
      factorCounts[factor.factor] = (factorCounts[factor.factor] || 0) + 1;
    });
  });

  analytics.factorAnalysis = factorCounts;

  return analytics;
}

/**
 * ML/AI Integration Hooks (for future implementation)
 */
const ML_INTEGRATION_HOOKS = {
  // Hook for embedding-based similarity scoring
  calculateEmbeddingSimilarity: async (userProfile, event) => {
    // TODO: Implement with OpenAI embeddings or similar
    return { score: 0, confidence: 0 };
  },

  // Hook for predictive risk modeling
  predictRiskProbability: async (userProfile, event) => {
    // TODO: Implement with ML model
    return { probability: 0.5, confidence: 0.5 };
  },

  // Hook for user behavior analysis
  analyzeUserBehavior: async (userId, eventInteractions) => {
    // TODO: Implement user preference learning
    return { preferences: {}, confidence: 0.5 };
  }
};

module.exports = {
  scoreEvents,
  getScoringAnalytics,
  SCORING_CONFIG,
  INDUSTRY_INTELLIGENCE,
  GEOGRAPHIC_INTELLIGENCE,
  BUSINESS_UNIT_INTELLIGENCE,
  RISK_CORRELATION_MATRIX,
  ML_INTEGRATION_HOOKS,
  ScoredEvent
}; 
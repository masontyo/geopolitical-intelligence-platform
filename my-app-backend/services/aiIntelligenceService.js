const axios = require('axios');
const natural = require('natural');
const { GeopoliticalEvent } = require('../models/GeopoliticalEvent');
const { UserProfile } = require('../models/UserProfile');

class AIIntelligenceService {
  constructor() {
    this.knowledgeGraph = new Map();
    this.userProfiles = new Map();
    this.behavioralPatterns = new Map();
    this.industryContexts = new Map();
    this.geographicIntelligence = new Map();
    
    // Initialize NLP tools
    this.tokenizer = new natural.WordTokenizer();
    this.stemmer = natural.PorterStemmer;
    this.tfidf = new natural.TfIdf();
    
    // Load industry contexts and geographic intelligence
    this.initializeIntelligence();
  }

  /**
   * Initialize AI intelligence with industry contexts and geographic data
   */
  async initializeIntelligence() {
    try {
      // Load industry-specific risk patterns
      await this.loadIndustryContexts();
      
      // Load geographic intelligence
      await this.loadGeographicIntelligence();
      
      // Load existing user profiles for behavioral analysis
      await this.loadUserProfiles();
      
      console.log('✅ AI Intelligence Service initialized');
    } catch (error) {
      console.error('❌ Error initializing AI Intelligence Service:', error);
    }
  }

  /**
   * Load industry-specific risk patterns and contexts
   */
  async loadIndustryContexts() {
    const industryContexts = {
      'Manufacturing': {
        riskFactors: ['supply chain', 'labor disputes', 'trade policy', 'raw materials', 'transportation'],
        keyRegions: ['Southeast Asia', 'Eastern Europe', 'Mexico', 'China'],
        criticalEvents: ['strikes', 'port closures', 'trade wars', 'sanctions', 'natural disasters'],
        impactAreas: ['production', 'logistics', 'costs', 'delivery times']
      },
      'Technology': {
        riskFactors: ['cyber attacks', 'data breaches', 'regulatory changes', 'talent acquisition', 'intellectual property'],
        keyRegions: ['Silicon Valley', 'Israel', 'India', 'Eastern Europe'],
        criticalEvents: ['data breaches', 'regulatory crackdowns', 'trade restrictions', 'talent wars'],
        impactAreas: ['operations', 'reputation', 'compliance', 'innovation']
      },
      'Financial Services': {
        riskFactors: ['regulatory changes', 'market volatility', 'cyber security', 'compliance', 'economic instability'],
        keyRegions: ['New York', 'London', 'Singapore', 'Hong Kong'],
        criticalEvents: ['regulatory announcements', 'market crashes', 'cyber attacks', 'economic indicators'],
        impactAreas: ['operations', 'compliance', 'reputation', 'financial performance']
      },
      'Healthcare': {
        riskFactors: ['regulatory changes', 'supply chain', 'clinical trials', 'patient safety', 'data privacy'],
        keyRegions: ['United States', 'Europe', 'India', 'China'],
        criticalEvents: ['regulatory approvals', 'recalls', 'clinical trial results', 'pandemic responses'],
        impactAreas: ['operations', 'compliance', 'patient outcomes', 'reputation']
      }
    };

    this.industryContexts = industryContexts;
  }

  /**
   * Load geographic intelligence and risk patterns
   */
  async loadGeographicIntelligence() {
    const geographicData = {
      'Southeast Asia': {
        riskLevel: 'Medium',
        commonRisks: ['political instability', 'natural disasters', 'labor disputes', 'infrastructure'],
        keyCountries: ['Vietnam', 'Thailand', 'Indonesia', 'Malaysia'],
        monitoringKeywords: ['strikes', 'protests', 'typhoons', 'floods', 'political unrest']
      },
      'Eastern Europe': {
        riskLevel: 'Medium-High',
        commonRisks: ['political instability', 'corruption', 'infrastructure', 'regulatory changes'],
        keyCountries: ['Poland', 'Czech Republic', 'Hungary', 'Romania'],
        monitoringKeywords: ['protests', 'elections', 'regulatory changes', 'corruption', 'infrastructure']
      },
      'China': {
        riskLevel: 'High',
        commonRisks: ['trade policy', 'regulatory changes', 'labor costs', 'intellectual property'],
        keyCountries: ['China'],
        monitoringKeywords: ['trade war', 'regulatory changes', 'labor costs', 'IP theft', 'supply chain']
      },
      'North America': {
        riskLevel: 'Low-Medium',
        commonRisks: ['regulatory changes', 'labor disputes', 'natural disasters', 'cyber attacks'],
        keyCountries: ['United States', 'Canada', 'Mexico'],
        monitoringKeywords: ['regulatory changes', 'strikes', 'hurricanes', 'cyber attacks', 'trade policy']
      }
    };

    this.geographicIntelligence = geographicData;
  }

  /**
   * Load existing user profiles for behavioral analysis
   */
  async loadUserProfiles() {
    try {
      // Skip database loading for now since we're not connected
      console.log('Skipping user profile loading (no database connection)');
    } catch (error) {
      console.error('Error loading user profiles:', error);
    }
  }

  /**
   * Analyze user behavior patterns
   */
  analyzeUserBehavior(userProfile) {
    const userId = userProfile.userId;
    const behavior = {
      viewedEvents: userProfile.viewedEvents || [],
      flaggedEvents: userProfile.flaggedEvents || [],
      ignoredEvents: userProfile.ignoredEvents || [],
      searchHistory: userProfile.searchHistory || [],
      preferences: userProfile.preferences || {},
      lastActive: userProfile.lastActive || new Date()
    };

    // Calculate behavioral patterns
    const patterns = this.calculateBehavioralPatterns(behavior);
    this.behavioralPatterns.set(userId, patterns);
  }

  /**
   * Calculate behavioral patterns from user data
   */
  calculateBehavioralPatterns(behavior) {
    const patterns = {
      preferredRegions: this.extractPreferredRegions(behavior),
      preferredEventTypes: this.extractPreferredEventTypes(behavior),
      riskTolerance: this.calculateRiskTolerance(behavior),
      attentionPatterns: this.analyzeAttentionPatterns(behavior),
      engagementLevel: this.calculateEngagementLevel(behavior)
    };

    return patterns;
  }

  /**
   * Extract preferred regions from user behavior
   */
  extractPreferredRegions(behavior) {
    const regionCounts = {};
    
    behavior.viewedEvents.forEach(event => {
      if (event.region) {
        regionCounts[event.region] = (regionCounts[event.region] || 0) + 1;
      }
    });

    return Object.entries(regionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([region]) => region);
  }

  /**
   * Extract preferred event types from user behavior
   */
  extractPreferredEventTypes(behavior) {
    const typeCounts = {};
    
    behavior.viewedEvents.forEach(event => {
      if (event.category) {
        typeCounts[event.category] = (typeCounts[event.category] || 0) + 1;
      }
    });

    return Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([type]) => type);
  }

  /**
   * Calculate user's risk tolerance
   */
  calculateRiskTolerance(behavior) {
    const highSeverityEvents = behavior.viewedEvents.filter(e => e.severity === 'High').length;
    const totalEvents = behavior.viewedEvents.length;
    
    if (totalEvents === 0) return 'Medium';
    
    const highSeverityRatio = highSeverityEvents / totalEvents;
    
    if (highSeverityRatio > 0.7) return 'High';
    if (highSeverityRatio < 0.3) return 'Low';
    return 'Medium';
  }

  /**
   * Analyze attention patterns
   */
  analyzeAttentionPatterns(behavior) {
    const patterns = {
      peakHours: this.calculatePeakHours(behavior),
      preferredDays: this.calculatePreferredDays(behavior),
      sessionLength: this.calculateAverageSessionLength(behavior)
    };

    return patterns;
  }

  /**
   * Calculate peak activity hours
   */
  calculatePeakHours(behavior) {
    const hourCounts = {};
    
    behavior.viewedEvents.forEach(event => {
      if (event.timestamp) {
        const hour = new Date(event.timestamp).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      }
    });

    return Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));
  }

  /**
   * Calculate preferred activity days
   */
  calculatePreferredDays(behavior) {
    const dayCounts = {};
    
    behavior.viewedEvents.forEach(event => {
      if (event.timestamp) {
        const day = new Date(event.timestamp).getDay();
        dayCounts[day] = (dayCounts[day] || 0) + 1;
      }
    });

    return Object.entries(dayCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([day]) => parseInt(day));
  }

  /**
   * Calculate average session length
   */
  calculateAverageSessionLength(behavior) {
    // This would need more detailed session data
    // For now, return a default value
    return 15; // minutes
  }

  /**
   * Calculate engagement level
   */
  calculateEngagementLevel(behavior) {
    const totalInteractions = behavior.viewedEvents.length + 
                            behavior.flaggedEvents.length + 
                            behavior.searchHistory.length;
    
    if (totalInteractions > 100) return 'High';
    if (totalInteractions > 50) return 'Medium';
    return 'Low';
  }

  /**
   * Process and analyze events with AI intelligence
   */
  async processEventWithAI(event, userId) {
    try {
      // Get user profile and behavioral patterns
      const userProfile = this.userProfiles.get(userId);
      const behaviorPatterns = this.behavioralPatterns.get(userId);
      
      if (!userProfile || !behaviorPatterns) {
        return this.getDefaultAnalysis(event);
      }

      // Perform AI analysis
      const analysis = {
        relevanceScore: await this.calculateRelevanceScore(event, userProfile, behaviorPatterns),
        impactAssessment: await this.assessImpact(event, userProfile),
        riskLevel: await this.assessRiskLevel(event, userProfile),
        recommendedActions: await this.generateRecommendedActions(event, userProfile),
        contextualInsights: await this.generateContextualInsights(event, userProfile),
        behavioralInsights: await this.generateBehavioralInsights(event, behaviorPatterns)
      };

      return analysis;
    } catch (error) {
      console.error('Error processing event with AI:', error);
      return this.getDefaultAnalysis(event);
    }
  }

  /**
   * Calculate relevance score using AI
   */
  async calculateRelevanceScore(event, userProfile, behaviorPatterns) {
    let score = 0;
    
    // Industry relevance
    const industryContext = this.industryContexts[userProfile.industry];
    if (industryContext) {
      const industryKeywords = industryContext.riskFactors;
      const eventText = `${event.title} ${event.description}`.toLowerCase();
      
      industryKeywords.forEach(keyword => {
        if (eventText.includes(keyword.toLowerCase())) {
          score += 20;
        }
      });
    }

    // Geographic relevance
    const userRegions = userProfile.operatingRegions || [];
    const eventRegions = this.extractEventRegions(event);
    
    userRegions.forEach(userRegion => {
      eventRegions.forEach(eventRegion => {
        if (this.areRegionsRelated(userRegion, eventRegion)) {
          score += 25;
        }
      });
    });

    // Behavioral relevance
    const preferredTypes = behaviorPatterns.preferredEventTypes;
    if (preferredTypes.includes(event.category)) {
      score += 15;
    }

    // Risk tolerance alignment
    const userRiskTolerance = behaviorPatterns.riskTolerance;
    const eventRiskLevel = this.mapSeverityToRiskLevel(event.severity);
    
    if (this.isRiskToleranceAligned(userRiskTolerance, eventRiskLevel)) {
      score += 10;
    }

    // Time-based relevance
    const peakHours = behaviorPatterns.attentionPatterns.peakHours;
    const currentHour = new Date().getHours();
    if (peakHours.includes(currentHour)) {
      score += 5;
    }

    return Math.min(score, 100);
  }

  /**
   * Assess impact on user's business
   */
  async assessImpact(event, userProfile) {
    const impact = {
      severity: 'Low',
      affectedAreas: [],
      estimatedImpact: 'Minimal',
      timeline: 'Unknown'
    };

    // Analyze based on user's business profile
    const industryContext = this.industryContexts[userProfile.industry];
    if (industryContext) {
      const eventText = `${event.title} ${event.description}`.toLowerCase();
      
      industryContext.impactAreas.forEach(area => {
        if (eventText.includes(area.toLowerCase())) {
          impact.affectedAreas.push(area);
        }
      });
    }

    // Determine severity based on affected areas
    if (impact.affectedAreas.length > 2) {
      impact.severity = 'High';
      impact.estimatedImpact = 'Significant';
    } else if (impact.affectedAreas.length > 0) {
      impact.severity = 'Medium';
      impact.estimatedImpact = 'Moderate';
    }

    return impact;
  }

  /**
   * Assess risk level
   */
  async assessRiskLevel(event, userProfile) {
    const riskLevel = {
      overall: 'Low',
      factors: [],
      mitigation: []
    };

    // Analyze geographic risk
    const eventRegions = this.extractEventRegions(event);
    eventRegions.forEach(region => {
      const geoIntelligence = this.geographicIntelligence[region];
      if (geoIntelligence) {
        riskLevel.factors.push(`${region}: ${geoIntelligence.riskLevel} risk`);
        if (geoIntelligence.riskLevel === 'High') {
          riskLevel.overall = 'High';
        }
      }
    });

    // Analyze industry-specific risks
    const industryContext = this.industryContexts[userProfile.industry];
    if (industryContext) {
      const eventText = `${event.title} ${event.description}`.toLowerCase();
      
      industryContext.criticalEvents.forEach(criticalEvent => {
        if (eventText.includes(criticalEvent.toLowerCase())) {
          riskLevel.factors.push(`Critical event: ${criticalEvent}`);
          riskLevel.overall = 'High';
        }
      });
    }

    return riskLevel;
  }

  /**
   * Generate recommended actions
   */
  async generateRecommendedActions(event, userProfile) {
    const actions = [];

    // Industry-specific recommendations
    const industryContext = this.industryContexts[userProfile.industry];
    if (industryContext) {
      const eventText = `${event.title} ${event.description}`.toLowerCase();
      
      if (eventText.includes('supply chain')) {
        actions.push('Review supplier contracts and backup plans');
        actions.push('Assess inventory levels and safety stock');
      }
      
      if (eventText.includes('trade policy')) {
        actions.push('Review trade agreements and compliance requirements');
        actions.push('Assess impact on pricing and margins');
      }
      
      if (eventText.includes('labor')) {
        actions.push('Review labor agreements and contingency plans');
        actions.push('Assess impact on production schedules');
      }
    }

    // Geographic-specific recommendations
    const eventRegions = this.extractEventRegions(event);
    eventRegions.forEach(region => {
      const geoIntelligence = this.geographicIntelligence[region];
      if (geoIntelligence && geoIntelligence.riskLevel === 'High') {
        actions.push(`Monitor ${region} closely for developments`);
        actions.push(`Review contingency plans for ${region}`);
      }
    });

    return actions;
  }

  /**
   * Generate contextual insights
   */
  async generateContextualInsights(event, userProfile) {
    const insights = [];

    // Industry context
    const industryContext = this.industryContexts[userProfile.industry];
    if (industryContext) {
      const eventText = `${event.title} ${event.description}`.toLowerCase();
      
      industryContext.riskFactors.forEach(factor => {
        if (eventText.includes(factor.toLowerCase())) {
          insights.push(`This event relates to ${factor}, which is a key risk factor for ${userProfile.industry} companies`);
        }
      });
    }

    // Geographic context
    const eventRegions = this.extractEventRegions(event);
    eventRegions.forEach(region => {
      const geoIntelligence = this.geographicIntelligence[region];
      if (geoIntelligence) {
        insights.push(`${region} has a ${geoIntelligence.riskLevel} risk profile with common risks including ${geoIntelligence.commonRisks.join(', ')}`);
      }
    });

    return insights;
  }

  /**
   * Generate behavioral insights
   */
  async generateBehavioralInsights(event, behaviorPatterns) {
    const insights = [];

    // Attention pattern insights
    const peakHours = behaviorPatterns.attentionPatterns.peakHours;
    const currentHour = new Date().getHours();
    
    if (peakHours.includes(currentHour)) {
      insights.push('This event is being surfaced during your peak activity hours');
    }

    // Preference insights
    const preferredTypes = behaviorPatterns.preferredEventTypes;
    if (preferredTypes.includes(event.category)) {
      insights.push('This event type aligns with your viewing preferences');
    }

    // Risk tolerance insights
    const riskTolerance = behaviorPatterns.riskTolerance;
    const eventRiskLevel = this.mapSeverityToRiskLevel(event.severity);
    
    if (riskTolerance === 'High' && eventRiskLevel === 'Low') {
      insights.push('This event may be below your typical risk threshold');
    } else if (riskTolerance === 'Low' && eventRiskLevel === 'High') {
      insights.push('This event exceeds your typical risk threshold');
    }

    return insights;
  }

  /**
   * Extract regions from event
   */
  extractEventRegions(event) {
    const regions = [];
    
    if (event.location) {
      regions.push(event.location);
    }
    
    if (event.description) {
      const description = event.description.toLowerCase();
      Object.keys(this.geographicIntelligence).forEach(region => {
        if (description.includes(region.toLowerCase())) {
          regions.push(region);
        }
      });
    }
    
    return [...new Set(regions)];
  }

  /**
   * Check if regions are related
   */
  areRegionsRelated(region1, region2) {
    const region1Lower = region1.toLowerCase();
    const region2Lower = region2.toLowerCase();
    
    return region1Lower.includes(region2Lower) || 
           region2Lower.includes(region1Lower) ||
           this.areRegionsInSameContinent(region1, region2);
  }

  /**
   * Check if regions are in the same continent
   */
  areRegionsInSameContinent(region1, region2) {
    const continentMap = {
      'North America': ['United States', 'Canada', 'Mexico'],
      'Europe': ['Germany', 'France', 'United Kingdom', 'Poland', 'Czech Republic'],
      'Asia': ['China', 'Japan', 'India', 'Vietnam', 'Thailand', 'Indonesia'],
      'Southeast Asia': ['Vietnam', 'Thailand', 'Indonesia', 'Malaysia']
    };

    for (const [continent, countries] of Object.entries(continentMap)) {
      if (countries.some(country => region1.includes(country)) && 
          countries.some(country => region2.includes(country))) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Map severity to risk level
   */
  mapSeverityToRiskLevel(severity) {
    const mapping = {
      'Low': 'Low',
      'Medium': 'Medium',
      'High': 'High',
      'Critical': 'High'
    };
    
    return mapping[severity] || 'Medium';
  }

  /**
   * Check if risk tolerance is aligned
   */
  isRiskToleranceAligned(userTolerance, eventRiskLevel) {
    const toleranceMap = {
      'Low': ['Low'],
      'Medium': ['Low', 'Medium'],
      'High': ['Low', 'Medium', 'High']
    };
    
    return toleranceMap[userTolerance]?.includes(eventRiskLevel) || false;
  }

  /**
   * Get default analysis when user profile is not available
   */
  getDefaultAnalysis(event) {
    return {
      relevanceScore: 50,
      impactAssessment: {
        severity: 'Medium',
        affectedAreas: ['General'],
        estimatedImpact: 'Unknown',
        timeline: 'Unknown'
      },
      riskLevel: {
        overall: 'Medium',
        factors: ['Insufficient user data'],
        mitigation: ['Complete user profile for better analysis']
      },
      recommendedActions: ['Complete user profile setup for personalized recommendations'],
      contextualInsights: ['User profile required for contextual analysis'],
      behavioralInsights: ['User profile required for behavioral analysis']
    };
  }

  /**
   * Update user behavior when they interact with events
   */
  async updateUserBehavior(userId, eventId, action) {
    try {
      const userProfile = this.userProfiles.get(userId);
      if (!userProfile) return;

      // Update user profile based on action
      switch (action) {
        case 'view':
          if (!userProfile.viewedEvents) userProfile.viewedEvents = [];
          userProfile.viewedEvents.push({
            eventId,
            timestamp: new Date(),
            region: 'Unknown', // This would come from the event
            category: 'Unknown' // This would come from the event
          });
          break;
        case 'flag':
          if (!userProfile.flaggedEvents) userProfile.flaggedEvents = [];
          userProfile.flaggedEvents.push({
            eventId,
            timestamp: new Date()
          });
          break;
        case 'ignore':
          if (!userProfile.ignoredEvents) userProfile.ignoredEvents = [];
          userProfile.ignoredEvents.push({
            eventId,
            timestamp: new Date()
          });
          break;
      }

      // Save updated profile
      await userProfile.save();
      
      // Recalculate behavioral patterns
      this.analyzeUserBehavior(userProfile);
      
    } catch (error) {
      console.error('Error updating user behavior:', error);
    }
  }

  /**
   * Get personalized event recommendations
   */
  async getPersonalizedRecommendations(userId, limit = 10) {
    try {
      const userProfile = this.userProfiles.get(userId);
      const behaviorPatterns = this.behavioralPatterns.get(userId);
      
      if (!userProfile || !behaviorPatterns) {
        return [];
      }

      // Get recent events
      const recentEvents = await GeopoliticalEvent.find({})
        .sort({ timestamp: -1 })
        .limit(50);

      // Score and rank events
      const scoredEvents = [];
      for (const event of recentEvents) {
        const analysis = await this.processEventWithAI(event, userId);
        scoredEvents.push({
          event,
          analysis,
          score: analysis.relevanceScore
        });
      }

      // Sort by score and return top recommendations
      return scoredEvents
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => ({
          event: item.event,
          relevanceScore: item.score,
          insights: item.analysis.contextualInsights,
          recommendations: item.analysis.recommendedActions
        }));

    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      return [];
    }
  }
}

module.exports = AIIntelligenceService;

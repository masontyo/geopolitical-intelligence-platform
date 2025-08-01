# Advanced Event Relevance Scoring Algorithm

## Overview

The Advanced Event Relevance Scoring Algorithm is a sophisticated, multi-factor scoring system designed to provide intelligent and personalized geopolitical risk intelligence. It goes beyond simple keyword matching to deliver contextual, industry-aware, and geographically intelligent event relevance scoring.

## Key Features

### 🧠 **Intelligent Scoring Layers**
- **Direct Match Scoring**: Traditional keyword and field matching
- **Industry Intelligence**: Industry-specific risk pattern recognition
- **Geographic Intelligence**: Geographic correlation and supply chain implications
- **Business Unit Intelligence**: Business unit-specific risk patterns
- **Risk Correlation**: Cascading risk effect analysis

### 🎯 **Multi-Factor Relevance**
- Uses all available user profile data
- Incorporates industry knowledge graphs
- Applies geographic intelligence patterns
- Considers business unit specificities
- Analyzes risk correlation matrices

### 🔍 **Transparency & Explainability**
- Detailed rationale for each score
- Contributing factors breakdown
- Confidence level assessment
- Scoring analytics and insights

### 🚀 **Extensibility**
- Modular architecture for easy expansion
- ML/AI integration hooks
- Configurable scoring weights
- Custom intelligence mappings

## Architecture

### Core Components

#### 1. **ScoredEvent Class**
```javascript
class ScoredEvent {
  constructor(event, score, rationale)
  addContributingFactor(factor, weight, description)
  setConfidenceLevel(level)
}
```

#### 2. **Scoring Functions**
- `calculateDirectMatchScore()` - Direct field matching
- `calculateIndustryIntelligenceScore()` - Industry patterns
- `calculateGeographicIntelligenceScore()` - Geographic correlations
- `calculateBusinessUnitIntelligenceScore()` - Business unit patterns
- `calculateRiskCorrelationScore()` - Risk cascading effects

#### 3. **Intelligence Mappings**
- `INDUSTRY_INTELLIGENCE` - Industry-specific risk patterns
- `GEOGRAPHIC_INTELLIGENCE` - Geographic correlation patterns
- `BUSINESS_UNIT_INTELLIGENCE` - Business unit risk patterns
- `RISK_CORRELATION_MATRIX` - Risk type correlation patterns

## Scoring Algorithm

### Scoring Weights
```javascript
const SCORING_CONFIG = {
  weights: {
    directMatch: 0.35,        // Direct keyword/field matches
    industryIntelligence: 0.25, // Industry-specific risk patterns
    geographicIntelligence: 0.20, // Geographic correlation patterns
    businessUnitIntelligence: 0.15, // Business unit specific patterns
    riskCorrelation: 0.05     // Risk type correlation patterns
  }
}
```

### Score Calculation Process

1. **Direct Match Scoring (35%)**
   - Business units matching
   - Areas of concern matching
   - Regional matching

2. **Industry Intelligence (25%)**
   - Supply chain risk patterns
   - Regulatory risk patterns
   - Geopolitical risk patterns

3. **Geographic Intelligence (20%)**
   - Related region correlations
   - Supply chain implications
   - Geopolitical risk patterns

4. **Business Unit Intelligence (15%)**
   - Related category matching
   - Geographic risk patterns
   - Regulatory risk patterns

5. **Risk Correlation (5%)**
   - Related risk matching
   - Industry impact analysis

### Score Boosting

#### Severity Multipliers
```javascript
severityMultiplier: {
  'critical': 1.5,
  'high': 1.3,
  'medium': 1.0,
  'low': 0.7
}
```

#### Recency Multipliers
```javascript
recencyMultiplier: {
  'immediate': 1.4,
  'short-term': 1.2,
  'medium-term': 1.0,
  'long-term': 0.8
}
```

## Intelligence Mappings

### Industry Intelligence

#### Technology Industry
```javascript
'technology': {
  supplyChainRisks: ['semiconductor', 'rare earth', 'china', 'taiwan'],
  regulatoryRisks: ['data privacy', 'antitrust', 'ai regulation'],
  geopoliticalRisks: ['us-china tensions', 'trade restrictions']
}
```

#### Manufacturing Industry
```javascript
'manufacturing': {
  supplyChainRisks: ['raw materials', 'commodities', 'logistics'],
  regulatoryRisks: ['environmental regulations', 'labor laws'],
  geopoliticalRisks: ['trade wars', 'tariffs', 'sanctions']
}
```

### Geographic Intelligence

#### Vietnam Region
```javascript
'vietnam': {
  relatedRegions: ['south china sea', 'southeast asia', 'china'],
  supplyChainRisks: ['shipping routes', 'manufacturing disruption'],
  geopoliticalRisks: ['us-china tensions', 'territorial disputes']
}
```

#### China Region
```javascript
'china': {
  relatedRegions: ['taiwan', 'hong kong', 'south china sea'],
  supplyChainRisks: ['manufacturing disruption', 'trade restrictions'],
  geopoliticalRisks: ['us-china tensions', 'territorial disputes']
}
```

### Business Unit Intelligence

#### Semiconductor Business Unit
```javascript
'semiconductor': {
  relatedCategories: ['technology', 'supply chain', 'trade'],
  geographicRisks: ['taiwan', 'china', 'south korea'],
  regulatoryRisks: ['export controls', 'technology transfer']
}
```

#### Supply Chain Business Unit
```javascript
'supply chain': {
  relatedCategories: ['logistics', 'trade', 'manufacturing'],
  geographicRisks: ['shipping routes', 'port disruptions'],
  regulatoryRisks: ['customs regulations', 'trade agreements']
}
```

## API Endpoints

### Get Relevant Events (Enhanced)
```http
GET /api/user-profile/:id/relevant-events?threshold=0.05&includeAnalytics=true
```

**Response:**
```json
{
  "success": true,
  "events": [
    {
      "title": "US-China Trade Tensions Escalate",
      "relevanceScore": 0.85,
      "rationale": "Relevance score: 85.0%. Top factors: Matched 1 of 2 business units; Industry geopolitical risk pattern matched (2 terms)",
      "contributingFactors": [...],
      "confidenceLevel": "high"
    }
  ],
  "scoringMetadata": {
    "totalEventsProcessed": 10,
    "eventsAboveThreshold": 5,
    "threshold": 0.05
  },
  "analytics": {
    "scoreDistribution": {...},
    "confidenceDistribution": {...},
    "factorAnalysis": {...}
  }
}
```

### Get Scoring Analytics
```http
GET /api/scoring-analytics/:profileId?threshold=0.05
```

**Response:**
```json
{
  "success": true,
  "profile": {
    "name": "John Smith",
    "company": "TechGlobal Solutions",
    "industry": "technology"
  },
  "analytics": {
    "totalEvents": 5,
    "scoreDistribution": {
      "high": 2,
      "medium": 2,
      "low": 1
    },
    "confidenceDistribution": {
      "high": 3,
      "medium": 2,
      "low": 0
    },
    "factorAnalysis": {
      "business_units": 5,
      "industry_geopolitical": 4,
      "geographic_correlation": 3
    }
  },
  "topEvents": [...]
}
```

### Test Scoring Algorithm
```http
POST /api/test-scoring
Content-Type: application/json

{
  "profile": {...},
  "events": [...],
  "threshold": 0.05
}
```

## Usage Examples

### Basic Scoring
```javascript
const { scoreEvents } = require('./utils/advancedScoring');

const userProfile = {
  industry: 'technology',
  businessUnits: [{ name: 'semiconductor' }],
  areasOfConcern: [{ category: 'trade disputes' }],
  regions: ['asia-pacific']
};

const events = [
  {
    title: 'US-China Trade Tensions',
    description: 'New tariffs on technology imports',
    categories: ['Trade', 'Technology'],
    regions: ['Asia-Pacific'],
    severity: 'high'
  }
];

const scoredEvents = scoreEvents(userProfile, events);
console.log(scoredEvents[0].rationale);
// Output: "Relevance score: 85.0%. Top factors: Matched 1 of 1 business units; Industry geopolitical risk pattern matched (2 terms)"
```

### Advanced Analytics
```javascript
const { getScoringAnalytics } = require('./utils/advancedScoring');

const analytics = getScoringAnalytics(scoredEvents);
console.log(analytics.scoreDistribution);
// Output: { high: 1, medium: 0, low: 0 }
```

## Configuration

### Customizing Scoring Weights
```javascript
const SCORING_CONFIG = {
  weights: {
    directMatch: 0.40,        // Increase direct matching weight
    industryIntelligence: 0.20, // Decrease industry intelligence weight
    geographicIntelligence: 0.20,
    businessUnitIntelligence: 0.15,
    riskCorrelation: 0.05
  }
}
```

### Adjusting Thresholds
```javascript
const SCORING_CONFIG = {
  thresholds: {
    minimumScore: 0.03,       // Lower minimum threshold
    highRelevance: 0.8,       // Increase high relevance threshold
    mediumRelevance: 0.5      // Increase medium relevance threshold
  }
}
```

## ML/AI Integration Hooks

### Embedding-Based Similarity
```javascript
const ML_INTEGRATION_HOOKS = {
  calculateEmbeddingSimilarity: async (userProfile, event) => {
    // TODO: Implement with OpenAI embeddings
    return { score: 0, confidence: 0 };
  }
}
```

### Predictive Risk Modeling
```javascript
const ML_INTEGRATION_HOOKS = {
  predictRiskProbability: async (userProfile, event) => {
    // TODO: Implement with ML model
    return { probability: 0.5, confidence: 0.5 };
  }
}
```

### User Behavior Analysis
```javascript
const ML_INTEGRATION_HOOKS = {
  analyzeUserBehavior: async (userId, eventInteractions) => {
    // TODO: Implement user preference learning
    return { preferences: {}, confidence: 0.5 };
  }
}
```

## Testing

### Running Unit Tests
```bash
npm run test:unit -- --testPathPattern=advancedScoring
```

### Test Coverage
The test suite covers:
- ScoredEvent class functionality
- All scoring components
- Score boosting mechanisms
- Full integration testing
- Configuration validation
- Intelligence mapping validation

## Best Practices

### 1. **Weight Configuration**
- Ensure weights sum to 1.0
- Balance between direct matches and intelligence layers
- Consider industry-specific adjustments

### 2. **Threshold Management**
- Start with lower thresholds (0.05) for comprehensive results
- Adjust based on user feedback and testing
- Consider different thresholds for different user types

### 3. **Performance Optimization**
- Cache intelligence mappings
- Implement scoring result caching
- Use database indexes for event queries

### 4. **Extensibility**
- Add new intelligence mappings incrementally
- Use the ML integration hooks for AI enhancement
- Maintain backward compatibility

### 5. **Monitoring & Analytics**
- Track scoring performance metrics
- Monitor user engagement with scored events
- Use analytics to refine scoring weights

## Future Enhancements

### 1. **Machine Learning Integration**
- Embedding-based similarity scoring
- User preference learning
- Predictive risk modeling

### 2. **Real-time Intelligence**
- Live event correlation
- Dynamic risk assessment
- Automated alert generation

### 3. **Advanced Analytics**
- Trend analysis
- Risk forecasting
- Impact assessment models

### 4. **Collaborative Intelligence**
- Peer benchmarking
- Industry overlays
- Expert knowledge integration

## Troubleshooting

### Common Issues

#### Low Relevance Scores
- Check intelligence mappings for user's industry/regions
- Verify business unit and concern matching
- Adjust scoring weights if needed

#### Missing Events
- Lower the minimum threshold
- Check event categories and regions
- Verify intelligence mapping coverage

#### Performance Issues
- Implement caching for intelligence mappings
- Optimize database queries
- Consider pagination for large event sets

### Debug Mode
Enable detailed logging for scoring analysis:
```javascript
const DEBUG_MODE = true;
// This will log detailed scoring breakdowns
```

## Support

For questions or issues with the advanced scoring algorithm:
1. Check the test suite for usage examples
2. Review the intelligence mappings
3. Examine the scoring analytics
4. Contact the development team

---

*This advanced scoring algorithm represents a significant evolution in geopolitical risk intelligence, providing intelligent, contextual, and transparent event relevance scoring.* 
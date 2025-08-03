# Event Identification and Scoring Process

This document provides a comprehensive walkthrough of how the geopolitical intelligence platform identifies, processes, and scores events for relevance to specific user profiles.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Process Flow](#process-flow)
3. [Step 1: User Profile Creation](#step-1-user-profile-creation)
4. [Step 2: Real-Time News Fetching](#step-2-real-time-news-fetching)
5. [Step 3: Content Analysis & Categorization](#step-3-content-analysis--categorization)
6. [Step 4: LLM-Powered Intelligent Scoring](#step-4-llm-powered-intelligent-scoring)
7. [Step 5: Advanced Scoring Algorithm (Fallback)](#step-5-advanced-scoring-algorithm-fallback)
8. [Step 6: Filtering & Ranking](#step-6-filtering--ranking)
9. [Configuration & Weights](#configuration--weights)
10. [Scoring Factors Breakdown](#scoring-factors-breakdown)
11. [Example Scoring Process](#example-scoring-process)

## 🎯 Overview

The platform uses a **two-tier scoring system**:
1. **Primary**: LLM-powered intelligent scoring (OpenAI GPT-4o-mini)
2. **Fallback**: Advanced keyword-based scoring algorithm

This ensures robust event relevance assessment even when LLM services are unavailable.

## 🔄 Process Flow

```
User Profile → News API Fetch → Content Analysis → LLM Scoring → Filtering → Dashboard Display
     ↓              ↓              ↓              ↓           ↓
  Profile Data   Real Articles  Categories/    Relevance   Top Events
  & Preferences  (Title + Desc) Regions/Severity  Scores   (≤50 results)
```

## 📝 Step 1: User Profile Creation

### Profile Structure
```javascript
{
  name: "Sarah Johnson",
  company: "TechCorp Inc",
  industry: "Technology",
  businessUnits: [
    { name: "Semiconductor Division" },
    { name: "Cloud Services" },
    { name: "AI Research" }
  ],
  areasOfConcern: [
    { category: "Supply Chain Disruption" },
    { category: "Cybersecurity Threats" },
    { category: "Regulatory Changes" },
    { category: "Geopolitical Tensions" }
  ],
  regions: ["North America", "Europe", "Asia-Pacific"]
}
```

### Validation Requirements
- **Required fields**: `name`, `email`, `title`, `company`
- **Business units**: Must have at least one unit
- **Areas of concern**: Must have at least one concern
- **Regions**: Must have at least one region

## 📰 Step 2: Real-Time News Fetching

### API Configuration
- **Source**: NewsAPI.org
- **Query construction**: Dynamic based on user profile
- **Default query**: `geopolitical OR international OR business OR economy OR trade OR security OR technology OR government OR policy`
- **Custom mapping**: User concerns mapped to broader search terms

### Content Availability
- **Title**: Always available
- **Description**: Usually available (first few sentences)
- **Content**: Limited availability (first 500 characters if available)
- **Source**: Publisher name and URL
- **Date**: Publication timestamp

### Example API Response
```javascript
{
  title: "China announces new semiconductor export restrictions",
  description: "Beijing introduces stricter controls on advanced chip exports...",
  content: "The Chinese government announced today...",
  source: { name: "Reuters", url: "https://..." },
  publishedAt: "2025-08-02T10:30:00Z"
}
```

## 🔍 Step 3: Content Analysis & Categorization

### Basic Categorization (Pre-LLM)
Before LLM analysis, articles are categorized using keyword matching:

#### Category Detection
```javascript
// Supply Chain
if (content.includes('supply') || content.includes('logistics') || content.includes('manufacturing')) {
  categories.push('Supply Chain');
}

// Cybersecurity
if (content.includes('cyber') || content.includes('hack') || content.includes('security')) {
  categories.push('Cybersecurity');
}

// Regulatory
if (content.includes('regulation') || content.includes('policy') || content.includes('law')) {
  categories.push('Regulatory');
}

// Geopolitical
if (content.includes('geopolitical') || content.includes('international') || content.includes('diplomatic')) {
  categories.push('Geopolitical');
}
```

#### Region Detection
```javascript
// Asia-Pacific
if (content.includes('china') || content.includes('asia')) {
  regions.push('Asia-Pacific');
}

// Europe
if (content.includes('europe') || content.includes('eu')) {
  regions.push('Europe');
}

// North America
if (content.includes('united states') || content.includes('us') || content.includes('america')) {
  regions.push('North America');
}
```

#### Severity Detection
```javascript
let severity = 'low';
if (content.includes('crisis') || content.includes('war') || content.includes('attack')) {
  severity = 'critical';
} else if (content.includes('tension') || content.includes('dispute') || content.includes('breach')) {
  severity = 'high';
} else if (content.includes('policy') || content.includes('announcement')) {
  severity = 'medium';
}
```

## 🧠 Step 4: LLM-Powered Intelligent Scoring

### LLM Configuration
- **Model**: OpenAI GPT-4o-mini
- **Temperature**: 0.1 (low for consistent analysis)
- **Max tokens**: 500
- **Timeout**: 10 seconds
- **Batch processing**: 3 events concurrently

### Analysis Prompt Structure
The LLM receives a comprehensive prompt including:

1. **User Profile Context**
   - Name, company, industry
   - Business units and areas of concern
   - Regions of interest

2. **Event Information**
   - Title, description, categories
   - Regions, severity, source

3. **Analysis Instructions**
   - Distinguish developing events vs informational content
   - Score relevance from 0.0 to 1.0
   - Provide reasoning and key factors

### Developing Event Indicators
The LLM looks for action words indicating current developments:
- **Announcements**: "announces", "announced", "announcement"
- **New developments**: "new", "recent", "latest", "breaking"
- **Active processes**: "develops", "developing", "emerging"
- **Changes**: "changes", "changed", "updates", "updated"
- **Actions**: "launches", "launched", "introduces"
- **Revelations**: "reveals", "revealed", "discovered"
- **Responses**: "responds", "responded", "reacts"
- **Planning**: "plans", "planning", "proposes", "proposed"
- **Investigations**: "investigates", "investigation", "probe"
- **Warnings**: "warns", "warning", "alerts", "alert"

### Informational Content Indicators (Avoided)
- **Explanatory**: "explains", "explanation", "guide", "tutorial"
- **Background**: "overview", "summary", "background"
- **Historical**: "history", "historical", "tradition"
- **Analytical**: "analysis", "analyst", "expert says"
- **Research**: "study", "research", "survey"
- **Educational**: "tips", "advice", "recommendations"

### LLM Response Format
```javascript
{
  "relevanceScore": 0.85,
  "isRelevant": true,
  "isDevelopingEvent": true,
  "reasoning": "This is a current developing event involving new semiconductor export restrictions that directly impacts the user's semiconductor division business unit and supply chain concerns.",
  "keyFactors": ["semiconductor_restrictions", "supply_chain_impact", "current_development"],
  "confidence": "high"
}
```

## ⚙️ Step 5: Advanced Scoring Algorithm (Fallback)

When LLM is unavailable, the system falls back to a sophisticated keyword-based algorithm.

### Scoring Configuration
```javascript
const SCORING_CONFIG = {
  weights: {
    directMatch: 0.35,           // 35% - Direct keyword/field matches
    industryIntelligence: 0.25,  // 25% - Industry-specific risk patterns
    geographicIntelligence: 0.20, // 20% - Geographic correlation patterns
    businessUnitIntelligence: 0.15, // 15% - Business unit specific patterns
    riskCorrelation: 0.05        // 5% - Risk type correlation patterns
  },
  thresholds: {
    minimumScore: 0.05,          // Minimum score to consider relevant
    highRelevance: 0.7,          // Score threshold for high relevance
    mediumRelevance: 0.4         // Score threshold for medium relevance
  },
  boosters: {
    severityMultiplier: {
      'critical': 1.5,           // 50% boost for critical events
      'high': 1.3,               // 30% boost for high severity
      'medium': 1.0,             // No boost for medium
      'low': 0.7                 // 30% penalty for low severity
    },
    recencyMultiplier: {
      'immediate': 1.4,          // 40% boost for immediate events
      'short-term': 1.2,         // 20% boost for short-term
      'medium-term': 1.0,        // No boost for medium-term
      'long-term': 0.8           // 20% penalty for long-term
    }
  }
};
```

### Scoring Components

#### 1. Direct Match Scoring (35% weight)
```javascript
// Business Units Matching
const businessUnitScore = (businessUnitMatches / totalBusinessUnits) * 0.4;

// Areas of Concern Matching
const concernScore = (concernMatches / totalConcerns) * 0.4;

// Region Matching
const regionScore = (regionMatches / totalRegions) * 0.2;
```

#### 2. Industry Intelligence (25% weight)
Maps user's industry to relevant risk patterns:
- **Technology**: Semiconductor risks, data privacy, AI regulation
- **Manufacturing**: Supply chain disruption, environmental regulations
- **Finance**: Financial regulations, payment systems, compliance
- **Healthcare**: FDA regulations, pharmaceutical supply chains
- **Retail**: Consumer protection, inventory management

#### 3. Geographic Intelligence (20% weight)
Maps regions to geopolitical risks:
- **China**: US-China tensions, manufacturing disruption, trade restrictions
- **Taiwan**: Semiconductor manufacturing, territorial disputes
- **Europe**: Energy supply, trade agreements, regulatory changes
- **Middle East**: Oil supply, regional conflicts, shipping routes

#### 4. Business Unit Intelligence (15% weight)
Specific patterns for business units:
- **Semiconductor**: Technology transfer, export controls, rare earth materials
- **Cloud Services**: Data sovereignty, cybersecurity, cross-border data flows
- **AI Research**: Intellectual property, research collaboration, AI regulation

#### 5. Risk Correlation (5% weight)
Identifies correlations between different risk types and user concerns.

### Booster Application
```javascript
// Severity Booster
if (event.severity === 'critical') {
  totalScore *= 1.5; // 50% boost
}

// Recency Booster
if (eventTimeframe === 'immediate') {
  totalScore *= 1.4; // 40% boost
}
```

## 🎯 Step 6: Filtering & Ranking

### Primary Filters
1. **Relevance Score**: Must meet minimum threshold (0.005 for API, 0.05 for fallback)
2. **LLM Relevance**: Must be marked as relevant by LLM
3. **Developing Event**: Must be identified as a current developing event
4. **Content Quality**: Must have sufficient content for analysis

### Ranking Criteria
1. **Relevance Score**: Primary sorting (highest first)
2. **Confidence Level**: Secondary sorting (high > medium > low)
3. **Recency**: Tertiary sorting (newest first)

### Result Limits
- **Maximum events**: 50 per request
- **Default threshold**: 0.005 (configurable via API parameter)
- **Analytics inclusion**: Optional via `includeAnalytics=true` parameter

## 📊 Configuration & Weights

### LLM Scoring Weights
- **Primary scoring method**: LLM analysis (when available)
- **Fallback method**: Advanced keyword algorithm
- **Batch processing**: 3 concurrent analyses
- **Timeout handling**: 10-second timeout per analysis

### Advanced Algorithm Weights
| Component | Weight | Description |
|-----------|--------|-------------|
| Direct Match | 35% | Direct keyword/field matches |
| Industry Intelligence | 25% | Industry-specific risk patterns |
| Geographic Intelligence | 20% | Geographic correlation patterns |
| Business Unit Intelligence | 15% | Business unit specific patterns |
| Risk Correlation | 5% | Risk type correlation patterns |

### Severity Multipliers
| Severity | Multiplier | Effect |
|----------|------------|--------|
| Critical | 1.5x | 50% boost |
| High | 1.3x | 30% boost |
| Medium | 1.0x | No change |
| Low | 0.7x | 30% penalty |

### Recency Multipliers
| Timeframe | Multiplier | Effect |
|-----------|------------|--------|
| Immediate | 1.4x | 40% boost |
| Short-term | 1.2x | 20% boost |
| Medium-term | 1.0x | No change |
| Long-term | 0.8x | 20% penalty |

## 🔍 Scoring Factors Breakdown

### Direct Match Factors
- **Business Unit Match**: Percentage of user's business units that match event categories
- **Area of Concern Match**: Percentage of user's concerns that match event categories
- **Region Match**: Percentage of user's regions that match event regions

### Intelligence Factors
- **Industry Patterns**: Industry-specific risk correlations
- **Geographic Patterns**: Regional geopolitical risk patterns
- **Business Unit Patterns**: Unit-specific risk patterns
- **Risk Correlations**: Cross-risk type correlations

### Quality Factors
- **Content Completeness**: Amount of available content for analysis
- **Source Reliability**: Credibility of the news source
- **Event Recency**: How recent the event is
- **Event Severity**: Impact level of the event

## 📝 Example Scoring Process

### Input Event
```javascript
{
  title: "China announces new semiconductor export restrictions",
  description: "Beijing introduces stricter controls on advanced chip exports to US and allies",
  categories: ["Supply Chain", "Regulatory"],
  regions: ["Asia-Pacific"],
  severity: "high",
  source: { name: "Reuters", reliability: "high" }
}
```

### User Profile Context
```javascript
{
  industry: "Technology",
  businessUnits: ["Semiconductor Division"],
  areasOfConcern: ["Supply Chain Disruption", "Regulatory Changes"],
  regions: ["Asia-Pacific", "North America"]
}
```

### LLM Analysis Result
```javascript
{
  relevanceScore: 0.92,
  isRelevant: true,
  isDevelopingEvent: true,
  reasoning: "Direct impact on semiconductor business unit and supply chain concerns",
  keyFactors: ["semiconductor_restrictions", "supply_chain_impact", "regulatory_changes"],
  confidence: "high"
}
```

### Advanced Algorithm Calculation (if LLM unavailable)
```javascript
// Direct Match: 35% weight
directMatch = 0.35 * (1.0 + 1.0 + 0.5) / 3 = 0.29

// Industry Intelligence: 25% weight
industryIntelligence = 0.25 * 0.9 = 0.225

// Geographic Intelligence: 20% weight
geographicIntelligence = 0.20 * 0.8 = 0.16

// Business Unit Intelligence: 15% weight
businessUnitIntelligence = 0.15 * 0.95 = 0.1425

// Risk Correlation: 5% weight
riskCorrelation = 0.05 * 0.85 = 0.0425

// Base Score
baseScore = 0.29 + 0.225 + 0.16 + 0.1425 + 0.0425 = 0.86

// Apply Severity Booster (high = 1.3x)
finalScore = 0.86 * 1.3 = 1.118

// Apply Recency Booster (immediate = 1.4x)
finalScore = 1.118 * 1.4 = 1.565
```

### Final Result
- **Relevance Score**: 0.92 (LLM) or 1.565 (Advanced Algorithm)
- **Status**: Relevant and developing event
- **Ranking**: High priority due to direct business impact
- **Display**: Shown prominently in dashboard

## 🚀 Performance Considerations

### Optimization Strategies
1. **Batch Processing**: LLM analyses processed in batches of 3
2. **Timeout Handling**: 10-second timeout prevents hanging requests
3. **Fallback System**: Advanced algorithm ensures service availability
4. **Caching**: Results cached to avoid duplicate analyses
5. **Parallel Processing**: Multiple events analyzed concurrently

### Monitoring & Analytics
- **Total articles fetched**: Number of articles from News API
- **Total events processed**: Number of events analyzed
- **Events above threshold**: Number of relevant events found
- **Scoring metadata**: Detailed breakdown of scoring performance
- **Confidence distribution**: Distribution of confidence levels
- **Factor analysis**: Most common contributing factors

This comprehensive scoring system ensures that users receive the most relevant, current, and actionable geopolitical intelligence tailored to their specific business needs. 
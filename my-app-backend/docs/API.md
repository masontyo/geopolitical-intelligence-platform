# API Documentation

## Overview

The Geopolitical Intelligence Platform API provides endpoints for managing user profiles, geopolitical events, and relevance scoring. The API follows RESTful conventions and returns JSON responses.

**Base URL**: `http://localhost:5000/api`

## Authentication

Currently, the API does not require authentication. In production, JWT tokens or API keys should be implemented.

## Response Format

All API responses follow this standard format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

## User Profile Endpoints

### Create/Update User Profile

**POST** `/user-profile`

Creates a new user profile or updates an existing one based on name and company.

#### Request Body

```json
{
  "name": "John Doe",
  "company": "TechCorp Global",
  "role": "Chief Risk Officer",
  "businessUnits": [
    {
      "name": "Technology Division",
      "regions": ["North America", "Asia-Pacific"]
    },
    {
      "name": "Manufacturing",
      "regions": ["Europe"]
    }
  ],
  "areasOfConcern": [
    {
      "category": "Supply Chain Disruption",
      "priority": "high"
    },
    {
      "category": "Cybersecurity Threats",
      "priority": "critical"
    },
    {
      "category": "Regulatory Changes",
      "priority": "medium"
    }
  ],
  "riskTolerance": "medium",
  "regions": ["North America", "Europe", "Asia-Pacific"],
  "countries": ["United States", "Germany", "China", "Japan"],
  "industries": ["Technology", "Manufacturing"],
  "notificationPreferences": {
    "email": true,
    "push": true,
    "frequency": "daily"
  }
}
```

#### Response

```json
{
  "success": true,
  "message": "Profile created successfully",
  "profile": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "company": "TechCorp Global",
    "role": "Chief Risk Officer",
    "businessUnits": [...],
    "areasOfConcern": [...],
    "riskTolerance": "medium",
    "regions": [...],
    "countries": [...],
    "industries": [...],
    "notificationPreferences": {...},
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Validation Rules

- `name`: Required, string, max 100 characters
- `company`: Required, string, max 100 characters
- `role`: Required, string, max 100 characters
- `businessUnits`: Array of objects with `name` and `regions`
- `areasOfConcern`: Array of objects with `category` and `priority`
- `riskTolerance`: One of: "low", "medium", "high"
- `regions`: Array of strings
- `countries`: Array of strings
- `industries`: Array of strings

### Get User Profile

**GET** `/user-profile/:id`

Retrieves a specific user profile by ID.

#### Response

```json
{
  "success": true,
  "profile": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "company": "TechCorp Global",
    "role": "Chief Risk Officer",
    "businessUnits": [...],
    "areasOfConcern": [...],
    "riskTolerance": "medium",
    "regions": [...],
    "countries": [...],
    "industries": [...],
    "notificationPreferences": {...},
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Get Relevant Events

**GET** `/user-profile/:id/relevant-events`

Retrieves geopolitical events relevant to a specific user profile, sorted by relevance score.

#### Query Parameters

- `threshold` (optional): Minimum relevance score (0.0 to 1.0), default: 0.5

#### Response

```json
{
  "success": true,
  "events": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "US-China Trade Tensions Escalate",
      "description": "New tariffs imposed on Chinese technology imports...",
      "summary": "Escalating trade tensions between US and China...",
      "eventDate": "2024-01-15T00:00:00.000Z",
      "categories": ["Trade", "Technology", "Economic Sanctions"],
      "regions": ["Asia-Pacific", "North America"],
      "countries": ["United States", "China", "Taiwan", "South Korea"],
      "severity": "high",
      "impact": {
        "economic": "negative",
        "political": "negative",
        "social": "neutral"
      },
      "source": {
        "name": "Reuters",
        "url": "https://reuters.com/trade-tensions",
        "reliability": "high"
      },
      "historicalContext": {
        "hasHappenedBefore": true,
        "previousOccurrences": [...],
        "similarPatterns": [...]
      },
      "predictiveAnalytics": {
        "likelihood": 0.85,
        "timeframe": "short-term",
        "scenarios": [...]
      },
      "actionableInsights": [
        {
          "insight": "Diversify supply chains away from China",
          "action": "Identify alternative suppliers in Southeast Asia",
          "priority": "high"
        }
      ],
      "tags": ["trade-war", "semiconductors", "supply-chain"],
      "status": "active",
      "relevanceScore": 0.92,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 1
}
```

## Geopolitical Events Endpoints

### Get All Events

**GET** `/events`

Retrieves all geopolitical events, sorted by event date (newest first).

#### Query Parameters

- `limit` (optional): Number of events to return, default: all
- `offset` (optional): Number of events to skip, default: 0
- `status` (optional): Filter by status ("active", "resolved", "monitoring", "archived")
- `severity` (optional): Filter by severity ("low", "medium", "high", "critical")
- `categories` (optional): Filter by categories (comma-separated)
- `regions` (optional): Filter by regions (comma-separated)

#### Response

```json
{
  "success": true,
  "events": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "US-China Trade Tensions Escalate",
      "description": "New tariffs imposed on Chinese technology imports...",
      "summary": "Escalating trade tensions between US and China...",
      "eventDate": "2024-01-15T00:00:00.000Z",
      "categories": ["Trade", "Technology", "Economic Sanctions"],
      "regions": ["Asia-Pacific", "North America"],
      "countries": ["United States", "China", "Taiwan", "South Korea"],
      "severity": "high",
      "impact": {
        "economic": "negative",
        "political": "negative",
        "social": "neutral"
      },
      "source": {
        "name": "Reuters",
        "url": "https://reuters.com/trade-tensions",
        "reliability": "high"
      },
      "historicalContext": {...},
      "predictiveAnalytics": {...},
      "actionableInsights": [...],
      "tags": ["trade-war", "semiconductors", "supply-chain"],
      "status": "active",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 10
}
```

### Create Event

**POST** `/events`

Creates a new geopolitical event.

#### Request Body

```json
{
  "title": "New Geopolitical Event",
  "description": "Detailed description of the event...",
  "summary": "Brief summary of the event",
  "eventDate": "2024-01-15T00:00:00.000Z",
  "categories": ["Technology", "Trade"],
  "regions": ["Asia-Pacific"],
  "countries": ["China", "Japan"],
  "severity": "medium",
  "impact": {
    "economic": "negative",
    "political": "neutral",
    "social": "neutral"
  },
  "source": {
    "name": "News Source",
    "url": "https://example.com/news",
    "reliability": "high"
  },
  "historicalContext": {
    "hasHappenedBefore": false,
    "previousOccurrences": [],
    "similarPatterns": [
      {
        "pattern": "Technology export controls",
        "description": "Similar to previous technology restrictions"
      }
    ]
  },
  "predictiveAnalytics": {
    "likelihood": 0.7,
    "timeframe": "short-term",
    "scenarios": [
      {
        "scenario": "Further escalation",
        "probability": 0.6,
        "impact": "Supply chain disruption"
      }
    ]
  },
  "actionableInsights": [
    {
      "insight": "Monitor supply chain impacts",
      "action": "Review supplier relationships",
      "priority": "medium"
    }
  ],
  "tags": ["technology", "trade", "supply-chain"],
  "status": "active"
}
```

#### Response

```json
{
  "success": true,
  "message": "Event created successfully",
  "event": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "New Geopolitical Event",
    "description": "Detailed description of the event...",
    "summary": "Brief summary of the event",
    "eventDate": "2024-01-15T00:00:00.000Z",
    "categories": ["Technology", "Trade"],
    "regions": ["Asia-Pacific"],
    "countries": ["China", "Japan"],
    "severity": "medium",
    "impact": {...},
    "source": {...},
    "historicalContext": {...},
    "predictiveAnalytics": {...},
    "actionableInsights": [...],
    "tags": ["technology", "trade", "supply-chain"],
    "status": "active",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Validation Rules

- `title`: Required, string, max 200 characters
- `description`: Required, string, max 2000 characters
- `summary`: Optional, string, max 500 characters
- `eventDate`: Optional, ISO date string (defaults to current date)
- `categories`: Array of strings
- `regions`: Array of strings
- `countries`: Array of strings
- `severity`: One of: "low", "medium", "high", "critical"
- `impact.economic`: One of: "positive", "negative", "neutral", "unknown"
- `impact.political`: One of: "positive", "negative", "neutral", "unknown"
- `impact.social`: One of: "positive", "negative", "neutral", "unknown"
- `source.reliability`: One of: "high", "medium", "low"

## Error Handling

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `500`: Internal Server Error

### Error Response Examples

#### Validation Error (400)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Name is required",
    "Company is required",
    "Risk tolerance must be one of: low, medium, high"
  ]
}
```

#### Not Found Error (404)

```json
{
  "success": false,
  "message": "Profile not found"
}
```

#### Internal Server Error (500)

```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Rate Limiting

Currently, no rate limiting is implemented. In production, consider implementing rate limiting to prevent abuse.

## CORS

The API supports CORS for cross-origin requests. Configured to allow requests from the frontend application.

## Data Models

### User Profile Schema

```javascript
{
  name: String (required),
  company: String (required),
  role: String (required),
  businessUnits: [{
    name: String,
    regions: [String]
  }],
  areasOfConcern: [{
    category: String,
    priority: String (enum: low, medium, high, critical)
  }],
  riskTolerance: String (enum: low, medium, high),
  regions: [String],
  countries: [String],
  industries: [String],
  notificationPreferences: {
    email: Boolean,
    push: Boolean,
    frequency: String (enum: real-time, daily, weekly)
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Geopolitical Event Schema

```javascript
{
  title: String (required),
  description: String (required),
  summary: String,
  eventDate: Date (required),
  categories: [String],
  regions: [String],
  countries: [String],
  severity: String (enum: low, medium, high, critical),
  impact: {
    economic: String (enum: positive, negative, neutral, unknown),
    political: String (enum: positive, negative, neutral, unknown),
    social: String (enum: positive, negative, neutral, unknown)
  },
  source: {
    name: String,
    url: String,
    reliability: String (enum: high, medium, low)
  },
  historicalContext: {
    hasHappenedBefore: Boolean,
    previousOccurrences: [{
      date: Date,
      description: String,
      outcome: String
    }],
    similarPatterns: [{
      pattern: String,
      description: String
    }]
  },
  predictiveAnalytics: {
    likelihood: Number (0-1),
    timeframe: String (enum: immediate, short-term, medium-term, long-term),
    scenarios: [{
      scenario: String,
      probability: Number,
      impact: String
    }]
  },
  actionableInsights: [{
    insight: String,
    action: String,
    priority: String (enum: low, medium, high, critical)
  }],
  tags: [String],
  status: String (enum: active, resolved, monitoring, archived),
  createdAt: Date,
  updatedAt: Date
}
```

## Testing

The API includes comprehensive tests for all endpoints. Run tests with:

```bash
npm test
```

Test coverage includes:
- Input validation
- Error handling
- Database operations
- Relevance scoring algorithm
- Edge cases

## Support

For API support, contact:
- Email: api-support@geointel.com
- Documentation: https://docs.geointel.com/api
- Status page: https://status.geointel.com 
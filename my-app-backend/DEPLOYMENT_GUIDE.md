# Risk Intelligence Platform - Deployment & Best Practices Guide

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Cloud Deployment](#cloud-deployment)
3. [Scalability Considerations](#scalability-considerations)
4. [Security Best Practices](#security-best-practices)
5. [Crisis Communications Workflow](#crisis-communications-workflow)
6. [Monitoring & Observability](#monitoring--observability)
7. [Performance Optimization](#performance-optimization)
8. [Testing Strategy](#testing-strategy)
9. [Environment Configuration](#environment-configuration)
10. [Troubleshooting](#troubleshooting)

## Architecture Overview

### Current Stack
- **Frontend**: React (Vercel)
- **Backend**: Node.js/Express (Render)
- **Database**: MongoDB Atlas
- **Scoring Engine**: Advanced multi-factor relevance scoring
- **Crisis Communications**: Multi-channel notification system

### Key Components
1. **User Onboarding & Profile Management**
2. **Event Intelligence Engine**
3. **Advanced Scoring Algorithm**
4. **Crisis Communications Module**
5. **Dashboard & Analytics**

## Cloud Deployment

### Frontend (Vercel)

#### Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd my-app-frontend
vercel --prod
```

#### Environment Variables
```env
REACT_APP_API_URL=https://your-backend.onrender.com
REACT_APP_ENVIRONMENT=production
REACT_APP_ANALYTICS_ID=your-analytics-id
```

#### Best Practices
- Enable automatic deployments on Git push
- Configure custom domain with SSL
- Set up preview deployments for PRs
- Enable edge caching for static assets
- Configure build optimization

### Backend (Render)

#### Setup
```yaml
# render.yaml
services:
  - type: web
    name: risk-intelligence-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        sync: false
```

#### Environment Variables
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-super-secret-jwt-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
TEAMS_WEBHOOK_URL=https://your-org.webhook.office.com/...
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890
```

#### Best Practices
- Use environment-specific configurations
- Enable auto-scaling based on CPU/memory
- Set up health checks
- Configure proper logging
- Enable SSL/TLS

### Database (MongoDB Atlas)

#### Setup
1. Create Atlas cluster
2. Configure network access (IP whitelist)
3. Create database user
4. Set up connection string

#### Best Practices
- Enable automated backups
- Configure point-in-time recovery
- Set up monitoring and alerts
- Use connection pooling
- Enable data encryption at rest

## Scalability Considerations

### Horizontal Scaling

#### Backend Scaling
```javascript
// server.js - Add clustering for multi-core utilization
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Replace dead worker
  });
} else {
  // Worker process
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} started`);
  });
}
```

#### Database Scaling
- Use MongoDB Atlas M10+ for production
- Implement read replicas for analytics
- Consider sharding for large datasets
- Use connection pooling

### Caching Strategy

#### Redis Integration
```javascript
// Add Redis for session management and caching
const redis = require('redis');
const client = redis.createClient({
  url: process.env.REDIS_URL
});

// Cache frequently accessed data
async function getCachedEvents(userId) {
  const cached = await client.get(`events:${userId}`);
  if (cached) {
    return JSON.parse(cached);
  }
  
  const events = await fetchEventsFromDB(userId);
  await client.setex(`events:${userId}`, 3600, JSON.stringify(events));
  return events;
}
```

#### CDN Configuration
- Configure Vercel edge caching
- Use CloudFlare for global CDN
- Cache static assets aggressively
- Implement API response caching

### Load Balancing
- Use Render's built-in load balancer
- Configure health checks
- Implement circuit breakers
- Set up auto-scaling policies

## Security Best Practices

### Authentication & Authorization

#### JWT Implementation
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};
```

#### Role-Based Access Control
```javascript
// middleware/rbac.js
const checkRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user.roles.includes(requiredRole)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};
```

### Data Protection

#### Input Validation
```javascript
// middleware/validation.js
const { body, validationResult } = require('express-validator');

const validateUserProfile = [
  body('email').isEmail().normalizeEmail(),
  body('name').trim().isLength({ min: 2, max: 50 }),
  body('company').trim().isLength({ min: 2, max: 100 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
```

#### Data Encryption
- Enable TLS/SSL for all connections
- Encrypt sensitive data at rest
- Use environment variables for secrets
- Implement API rate limiting

### API Security
```javascript
// middleware/security.js
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(helmet());
```

## Crisis Communications Workflow

### Automated Crisis Detection

#### Event Scoring Integration
```javascript
// services/crisisDetectionService.js
class CrisisDetectionService {
  async detectCrisis(event) {
    // Score event for all users
    const userProfiles = await UserProfile.find({});
    const crisisThreshold = 0.8;
    
    for (const profile of userProfiles) {
      const scoredEvents = await scoreEvents(profile, [event]);
      const scoredEvent = scoredEvents[0];
      
      if (scoredEvent && scoredEvent.relevanceScore >= crisisThreshold) {
        await this.createCrisisRoom(event._id, {
          title: `Crisis: ${event.title}`,
          severity: this.determineSeverity(scoredEvent.relevanceScore),
          stakeholders: await this.getStakeholdersForProfile(profile)
        });
      }
    }
  }
}
```

#### Multi-Channel Notification
```javascript
// services/notificationOrchestrator.js
class NotificationOrchestrator {
  async sendCrisisNotification(crisisRoom, stakeholders) {
    const promises = stakeholders.map(stakeholder => {
      return stakeholder.notificationChannels.map(channel => {
        switch (channel) {
          case 'email':
            return this.sendEmail(stakeholder, crisisRoom);
          case 'sms':
            return this.sendSMS(stakeholder, crisisRoom);
          case 'slack':
            return this.sendSlack(stakeholder, crisisRoom);
          case 'teams':
            return this.sendTeams(stakeholder, crisisRoom);
        }
      });
    });
    
    await Promise.all(promises.flat());
  }
}
```

### Escalation Workflow

#### Automated Escalation
```javascript
// services/escalationService.js
class EscalationService {
  async checkEscalationConditions(crisisRoom) {
    const { settings } = crisisRoom;
    
    // Check response time
    const lastCommunication = crisisRoom.communications[crisisRoom.communications.length - 1];
    const timeSinceLastComm = Date.now() - lastCommunication.sentAt;
    
    if (timeSinceLastComm > settings.autoEscalation.timeThreshold * 60 * 1000) {
      await this.triggerEscalation(crisisRoom, 'No response within threshold');
    }
    
    // Check response rate
    const responseRate = crisisRoom.metrics.responseRate;
    if (responseRate < 50) { // Less than 50% response rate
      await this.triggerEscalation(crisisRoom, 'Low response rate');
    }
  }
}
```

### Response Tracking

#### Real-time Updates
```javascript
// WebSocket integration for real-time updates
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    const data = JSON.parse(message);
    
    if (data.type === 'stakeholder_response') {
      await crisisCommunicationService.processStakeholderResponse(
        data.crisisRoomId,
        data.response
      );
      
      // Broadcast to all connected clients
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'response_received',
            data: data.response
          }));
        }
      });
    }
  });
});
```

## Monitoring & Observability

### Application Monitoring

#### Health Checks
```javascript
// routes/health.js
router.get('/health', async (req, res) => {
  try {
    // Check database connection
    await mongoose.connection.db.admin().ping();
    
    // Check external services
    const emailService = await checkEmailService();
    const scoringService = await checkScoringService();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'healthy',
        email: emailService ? 'healthy' : 'unhealthy',
        scoring: scoringService ? 'healthy' : 'unhealthy'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

#### Logging Strategy
```javascript
// utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### Performance Monitoring

#### Metrics Collection
```javascript
// middleware/metrics.js
const prometheus = require('prom-client');

const httpRequestDurationMicroseconds = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDurationMicroseconds
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration / 1000);
  });
  next();
});
```

## Performance Optimization

### Database Optimization

#### Indexing Strategy
```javascript
// models/GeopoliticalEvent.js
geopoliticalEventSchema.index({ eventDate: -1 });
geopoliticalEventSchema.index({ categories: 1 });
geopoliticalEventSchema.index({ regions: 1 });
geopoliticalEventSchema.index({ severity: 1 });
geopoliticalEventSchema.index({ status: 1 });
geopoliticalEventSchema.index({ 
  categories: 1, 
  regions: 1, 
  eventDate: -1 
}); // Compound index for common queries
```

#### Query Optimization
```javascript
// Optimize scoring queries
async function getRelevantEvents(userProfile, limit = 50) {
  const pipeline = [
    {
      $match: {
        status: 'active',
        eventDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }
    },
    {
      $addFields: {
        relevanceScore: {
          $function: {
            body: calculateRelevanceScore,
            args: ["$this", userProfile],
            lang: "js"
          }
        }
      }
    },
    {
      $match: {
        relevanceScore: { $gte: 0.3 }
      }
    },
    {
      $sort: { relevanceScore: -1 }
    },
    {
      $limit: limit
    }
  ];
  
  return await GeopoliticalEvent.aggregate(pipeline);
}
```

### Frontend Optimization

#### Code Splitting
```javascript
// App.js - Implement lazy loading
import React, { Suspense, lazy } from 'react';

const CrisisRoom = lazy(() => import('./components/CrisisRoom'));
const Dashboard = lazy(() => import('./components/Dashboard'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/crisis/:id" element={<CrisisRoom />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}
```

#### Bundle Optimization
```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
```

## Testing Strategy

### Unit Testing
```javascript
// __tests__/unit/scoring.test.js
describe('Advanced Scoring', () => {
  test('should calculate relevance score correctly', async () => {
    const userProfile = mockUserProfile();
    const event = mockGeopoliticalEvent();
    
    const scoredEvents = await scoreEvents(userProfile, [event]);
    
    expect(scoredEvents[0].relevanceScore).toBeGreaterThan(0);
    expect(scoredEvents[0].relevanceScore).toBeLessThanOrEqual(1);
  });
});
```

### Integration Testing
```javascript
// __tests__/integration/crisisCommunication.test.js
describe('Crisis Communication Flow', () => {
  test('should create crisis room and send notifications', async () => {
    const event = await createTestEvent();
    const crisisRoom = await crisisCommunicationService.createCrisisRoom(
      event._id,
      testCrisisData
    );
    
    expect(crisisRoom.crisisRoom.status).toBe('active');
    expect(crisisRoom.stakeholders.length).toBeGreaterThan(0);
  });
});
```

### Load Testing
```javascript
// scripts/loadTest.js
const autocannon = require('autocannon');

autocannon({
  url: 'http://localhost:3001',
  connections: 100,
  duration: 10,
  requests: [
    {
      method: 'POST',
      path: '/api/crisis-rooms',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(testCrisisData)
    }
  ]
}, console.log);
```

## Environment Configuration

### Development
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/risk-intelligence-dev
JWT_SECRET=dev-secret-key
SMTP_HOST=localhost
SMTP_PORT=1025
```

### Staging
```env
NODE_ENV=staging
PORT=3001
MONGODB_URI=mongodb+srv://...
JWT_SECRET=staging-secret-key
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
```

### Production
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://...
JWT_SECRET=production-super-secret-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

## Troubleshooting

### Common Issues

#### Database Connection Issues
```javascript
// config/database.js
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  // Implement retry logic
  setTimeout(connectDB, 5000);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  // Implement reconnection logic
});
```

#### Memory Leaks
```javascript
// Monitor memory usage
setInterval(() => {
  const used = process.memoryUsage();
  console.log({
    rss: `${Math.round(used.rss / 1024 / 1024 * 100) / 100} MB`,
    heapTotal: `${Math.round(used.heapTotal / 1024 / 1024 * 100) / 100} MB`,
    heapUsed: `${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB`
  });
}, 30000);
```

#### API Timeouts
```javascript
// middleware/timeout.js
const timeout = require('connect-timeout');

app.use(timeout('30s'));
app.use((req, res, next) => {
  if (!req.timedout) next();
});
```

### Debugging Tools

#### API Documentation
```javascript
// Add Swagger documentation
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
```

#### Error Tracking
```javascript
// Integrate with error tracking service
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Monitoring configured
- [ ] Backup strategy implemented

### Post-Deployment
- [ ] Health checks passing
- [ ] Performance metrics normal
- [ ] Error rates acceptable
- [ ] Crisis communication flow tested
- [ ] Stakeholder notifications working
- [ ] Escalation procedures verified

### Maintenance
- [ ] Regular security updates
- [ ] Database optimization
- [ ] Performance monitoring
- [ ] Backup verification
- [ ] Disaster recovery testing

This deployment guide provides a comprehensive framework for deploying and maintaining your risk intelligence platform in production. Adapt the configurations and practices based on your specific requirements and infrastructure constraints. 
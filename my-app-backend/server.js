// my-app-backend/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDB = require('./config/database');
// Use database onboarding routes when MongoDB is available, otherwise use simple in-memory routes
const onboardingRoutes = process.env.MONGODB_URI 
  ? require('./routes/onboarding')
  : require('./routes/simpleOnboarding');

console.log('📋 Using', process.env.MONGODB_URI ? 'full' : 'simple', 'onboarding routes');
const userProfileRoutes = require('./routes/userProfile');
const newsRoutes = require('./routes/news');
const enhancedNewsRoutes = require('./routes/enhancedNews');
const linkedinAuthRoutes = require('./routes/linkedinAuth');
const crisisCommunicationRoutes = require('./routes/crisisCommunication');
const crisisRoomsRoutes = require('./routes/crisisRooms');
const eventsRoutes = require('./routes/events');
const supplyChainRoutes = require('./routes/supplyChain');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Debug port configuration
console.log('Environment PORT:', process.env.PORT);
console.log('Final PORT:', PORT);

// Connect to MongoDB
// In test environment or local development without MongoDB, skip database connection
if (process.env.NODE_ENV !== 'test' && process.env.MONGODB_URI) {
  connectDB().catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    console.log('💡 Running without database - using in-memory storage for development');
  });
} else {
  console.log('💡 Running in development mode without MongoDB - using in-memory storage');
}

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'https://geop-frontend-yes.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Allow cookies to work
}));
app.use(morgan('combined'));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/user-profile', userProfileRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/enhanced-news', enhancedNewsRoutes);
app.use('/api/linkedin', linkedinAuthRoutes);
app.use('/api/crisis-communication', crisisCommunicationRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/supply-chain', supplyChainRoutes);

// Crisis rooms direct access (for backward compatibility and cleaner API)
app.use('/api/crisis-rooms', crisisRoomsRoutes);

// Debug: Log all registered routes
if (process.env.NODE_ENV === 'test') {
  console.log('Registered routes:');
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      console.log(`${Object.keys(middleware.route.methods).join(',').toUpperCase()} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      console.log(`Router mounted at: ${middleware.regexp}`);
    }
  });
}

// Health check endpoints
const healthResponse = (req, res) => {
  res.status(200).json({
    status: 'OK',
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
};

app.get('/health', healthResponse);
app.get('/api/health', healthResponse);

// 404 handler for non-existent routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;

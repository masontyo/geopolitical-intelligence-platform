// my-app-backend/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/database');
const onboardingRoutes = require('./routes/onboarding');
const userProfileRoutes = require('./routes/userProfile');
const newsRoutes = require('./routes/news');
const enhancedNewsRoutes = require('./routes/enhancedNews');
const linkedinAuthRoutes = require('./routes/linkedinAuth');
const crisisCommunicationRoutes = require('./routes/crisisCommunication');
const crisisRoomsRoutes = require('./routes/crisisRooms');
const eventsRoutes = require('./routes/events');

const app = express();
const PORT = process.env.PORT || 3001;

// Debug port configuration
console.log('Environment PORT:', process.env.PORT);
console.log('Final PORT:', PORT);

// Connect to MongoDB
// In test environment, skip database connection (using mocked models)
// In other environments, connect to real database
if (process.env.NODE_ENV !== 'test') {
  connectDB().catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });
}

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/user-profile', userProfileRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/enhanced-news', enhancedNewsRoutes);
app.use('/api/linkedin', linkedinAuthRoutes);
app.use('/api/crisis-communication', crisisCommunicationRoutes);
app.use('/api/events', eventsRoutes);

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

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

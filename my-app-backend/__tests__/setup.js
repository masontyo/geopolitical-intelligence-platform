// Test setup file
process.env.NODE_ENV = 'test';
process.env.PORT = '5001'; // Use different port for tests

const mongoose = require('mongoose');

// Suppress console logs during tests unless there's an error
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(async () => {
  console.log = jest.fn();
  console.error = jest.fn();
  
  // Try to connect to test database, but don't fail if it's not available
  // The @shelf/jest-mongodb preset should handle this automatically
  if (mongoose.connection.readyState === 0) {
    try {
      // Use the MongoDB URI from the preset if available
      const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL || 'mongodb://localhost:27017/test';
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000, // 5 second timeout
        socketTimeoutMS: 5000
      });
    } catch (error) {
      // Don't fail the tests if MongoDB is not available
      console.warn('MongoDB not available for tests, some tests may be skipped');
    }
  }
});

afterAll(async () => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  
  // Close database connection if it exists
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.connection.close();
    } catch (error) {
      // Ignore errors during cleanup
    }
  }
});

// Global test timeout
jest.setTimeout(30000); 
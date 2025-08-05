// Test setup file
process.env.NODE_ENV = 'test';
process.env.PORT = '5001'; // Use different port for tests

const mongoose = require('mongoose');

// Suppress console logs during tests unless there's an error
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

// Mock MongoDB connection for tests
const mockMongoConnection = {
  readyState: 1, // Connected
  db: {
    admin: () => ({
      ping: jest.fn().mockResolvedValue({ ok: 1 })
    })
  },
  collections: {},
  close: jest.fn().mockResolvedValue(undefined)
};

// Mock mongoose connection
mongoose.connection = mockMongoConnection;

beforeAll(async () => {
  console.log = jest.fn();
  console.error = jest.fn();
  
  // Mock mongoose.connect to always succeed
  mongoose.connect = jest.fn().mockResolvedValue(mockMongoConnection);
  
  // Mock mongoose.disconnect
  mongoose.disconnect = jest.fn().mockResolvedValue(undefined);
  
  // Mock mongoose.connection.readyState
  Object.defineProperty(mongoose.connection, 'readyState', {
    get: () => 1, // Always return connected state
    configurable: true
  });
  
  console.log('Test environment setup complete');
});

beforeEach(async () => {
  // Clear all mocks before each test
  jest.clearAllMocks();
  
  // Reset mongoose connection state
  Object.defineProperty(mongoose.connection, 'readyState', {
    get: () => 1,
    configurable: true
  });
});

afterAll(async () => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  
  // Clean up mocks
  jest.restoreAllMocks();
});

// Global test timeout
jest.setTimeout(30000); 
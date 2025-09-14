// Test setup file
process.env.NODE_ENV = 'test';
process.env.PORT = '5001'; // Use different port for tests

// Set up mock database for tests
// We're using mocked models instead of real MongoDB
process.env.MONGODB_URI = 'mock://localhost:27017/test';

// Test environment variables are set in individual test files as needed

// Suppress console logs during tests unless there's an error
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(async () => {
  console.log = jest.fn();
  console.error = jest.fn();
  
  console.log('Test environment setup complete');
  console.log('MongoDB URI:', process.env.MONGODB_URI);
});

beforeEach(async () => {
  // Clear all mocks before each test
  jest.clearAllMocks();
  
  // Reset mock states for models
  try {
    const UserProfileMock = require('./__mocks__/UserProfile');
    if (UserProfileMock.resetMock) {
      UserProfileMock.resetMock();
    }
  } catch (error) {
    // Mock might not be loaded yet, ignore
  }
});

afterAll(async () => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});

// Global test timeout
jest.setTimeout(30000); 
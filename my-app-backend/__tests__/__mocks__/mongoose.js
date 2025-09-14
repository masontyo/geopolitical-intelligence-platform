// Mock mongoose module for testing
const mongoose = jest.genMockFromModule('mongoose');

// Mock connection
const mockConnection = {
  readyState: 1,
  db: {
    admin: () => ({
      ping: jest.fn().mockResolvedValue({ ok: 1 })
    })
  },
  collections: {},
  close: jest.fn().mockResolvedValue(undefined)
};

// Mock model operations
const mockModel = {
  find: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  findOne: jest.fn().mockReturnThis(),
  create: jest.fn().mockReturnThis(),
  save: jest.fn().mockReturnThis(),
  updateOne: jest.fn().mockReturnThis(),
  updateMany: jest.fn().mockReturnThis(),
  deleteOne: jest.fn().mockReturnThis(),
  deleteMany: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([]),
  lean: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  populate: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  equals: jest.fn().mockReturnThis(),
  in: jest.fn().mockReturnThis(),
  nin: jest.fn().mockReturnThis(),
  exists: jest.fn().mockReturnThis(),
  countDocuments: jest.fn().mockResolvedValue(0),
  aggregate: jest.fn().mockReturnThis(),
  pipeline: jest.fn().mockReturnThis(),
  addFields: jest.fn().mockReturnThis(),
  match: jest.fn().mockReturnThis(),
  group: jest.fn().mockReturnThis(),
  project: jest.fn().mockReturnThis(),
  unwind: jest.fn().mockReturnThis(),
  lookup: jest.fn().mockReturnThis(),
  facet: jest.fn().mockReturnThis()
};

// Mock schema
const mockSchema = {
  add: jest.fn(),
  index: jest.fn(),
  pre: jest.fn(),
  post: jest.fn(),
  virtual: jest.fn(),
  method: jest.fn(),
  statics: jest.fn(),
  query: jest.fn()
};

// Mock model function
const mockModelFunction = jest.fn().mockImplementation(() => mockModel);

// Mock Schema.Types
const mockSchemaTypes = {
  ObjectId: 'ObjectId',
  String: 'String',
  Number: 'Number',
  Date: 'Date',
  Boolean: 'Boolean',
  Array: 'Array',
  Mixed: 'Mixed',
  Buffer: 'Buffer',
  Decimal128: 'Decimal128',
  Map: 'Map',
  Schema: 'Schema'
};

// Mock ObjectId validation
const mockObjectId = {
  isValid: jest.fn().mockImplementation((id) => {
    // Return false for obviously invalid IDs
    if (typeof id !== 'string') return false;
    if (id === 'invalid-id-format' || id === 'invalid-id') return false;
    if (id.includes('invalid')) return false;
    if (id === 'not-a-valid-object-id') return false;
    if (id === 'nonexistent-id') return false;
    if (id === '507f1f77bcf86cd799439011') return false; // This should be invalid for non-existent profiles
    return true;
  })
};

// Set up mongoose mock
mongoose.connect = jest.fn().mockResolvedValue(mockConnection);
mongoose.disconnect = jest.fn().mockResolvedValue(undefined);
mongoose.connection = mockConnection;
mongoose.Schema = jest.fn().mockImplementation(() => mockSchema);
mongoose.Schema.Types = mockSchemaTypes;
mongoose.model = mockModelFunction;
mongoose.models = {};

// Mock specific models
mongoose.models.UserProfile = mockModel;
mongoose.models.CrisisCommunication = mockModel;
mongoose.models.GeopoliticalEvent = mockModel;

// Mock validation
mongoose.Types = {
  ObjectId: mockObjectId,
  String: jest.fn(),
  Number: jest.fn(),
  Date: jest.fn(),
  Boolean: jest.fn(),
  Array: jest.fn(),
  Mixed: jest.fn()
};

// Mock error classes
mongoose.Error = class MockMongooseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'MongooseError';
  }
};

mongoose.Error.ValidationError = class MockValidationError extends mongoose.Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
};

mongoose.Error.CastError = class MockCastError extends mongoose.Error {
  constructor(message) {
    super(message);
    this.name = 'CastError';
  }
};

module.exports = mongoose; 
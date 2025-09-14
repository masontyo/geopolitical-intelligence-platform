// Test database mock for integration tests
const mongoose = require('mongoose');

// Mock the mongoose connection
const mockConnection = {
  readyState: 1, // Connected
  on: jest.fn(),
  close: jest.fn().mockResolvedValue(undefined)
};

// Mock mongoose
mongoose.connect = jest.fn().mockResolvedValue(mockConnection);
mongoose.connection = mockConnection;
mongoose.Types.ObjectId.isValid = jest.fn((id) => {
  // Simple validation for ObjectId format
  return /^[0-9a-fA-F]{24}$/.test(id);
});

// Mock models with in-memory storage
const mockModels = {
  UserProfile: {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    deleteMany: jest.fn()
  },
  GeopoliticalEvent: {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
    distinct: jest.fn(),
    aggregate: jest.fn(),
    insertMany: jest.fn()
  },
  CrisisCommunication: {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn()
  }
};

// In-memory storage
const inMemoryStorage = {
  userProfiles: [],
  geopoliticalEvents: [],
  crisisCommunications: []
};

// Setup mock implementations
function setupMocks() {
  // UserProfile mocks
  mockModels.UserProfile.find.mockResolvedValue(inMemoryStorage.userProfiles);
  mockModels.UserProfile.findById.mockImplementation((id) => {
    return inMemoryStorage.userProfiles.find(profile => profile._id === id) || null;
  });
  mockModels.UserProfile.findOne.mockImplementation((query) => {
    if (query.name && query.company) {
      return inMemoryStorage.userProfiles.find(profile => 
        profile.name === query.name && profile.company === query.company
      ) || null;
    }
    return null;
  });
  mockModels.UserProfile.create.mockImplementation((profileData) => {
    const newProfile = {
      _id: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...profileData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    inMemoryStorage.userProfiles.push(newProfile);
    return newProfile;
  });
  mockModels.UserProfile.findByIdAndUpdate.mockImplementation((id, updateData, options) => {
    const profileIndex = inMemoryStorage.userProfiles.findIndex(profile => profile._id === id);
    if (profileIndex === -1) return null;
    
    inMemoryStorage.userProfiles[profileIndex] = {
      ...inMemoryStorage.userProfiles[profileIndex],
      ...updateData,
      updatedAt: new Date()
    };
    return inMemoryStorage.userProfiles[profileIndex];
  });
  mockModels.UserProfile.deleteMany.mockResolvedValue({ deletedCount: inMemoryStorage.userProfiles.length });

  // GeopoliticalEvent mocks
  mockModels.GeopoliticalEvent.find.mockResolvedValue(inMemoryStorage.geopoliticalEvents);
  mockModels.GeopoliticalEvent.findById.mockImplementation((id) => {
    return inMemoryStorage.geopoliticalEvents.find(event => event._id === id) || null;
  });
  mockModels.GeopoliticalEvent.create.mockImplementation((eventData) => {
    const newEvent = {
      _id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...eventData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    inMemoryStorage.geopoliticalEvents.push(newEvent);
    return newEvent;
  });
  mockModels.GeopoliticalEvent.findByIdAndUpdate.mockImplementation((id, updateData, options) => {
    const eventIndex = inMemoryStorage.geopoliticalEvents.findIndex(event => event._id === id);
    if (eventIndex === -1) return null;
    
    inMemoryStorage.geopoliticalEvents[eventIndex] = {
      ...inMemoryStorage.geopoliticalEvents[eventIndex],
      ...updateData,
      updatedAt: new Date()
    };
    return inMemoryStorage.geopoliticalEvents[eventIndex];
  });
  mockModels.GeopoliticalEvent.findByIdAndDelete.mockImplementation((id) => {
    const eventIndex = inMemoryStorage.geopoliticalEvents.findIndex(event => event._id === id);
    if (eventIndex === -1) return null;
    
    const deletedEvent = inMemoryStorage.geopoliticalEvents[eventIndex];
    inMemoryStorage.geopoliticalEvents.splice(eventIndex, 1);
    return deletedEvent;
  });
  mockModels.GeopoliticalEvent.countDocuments.mockResolvedValue(inMemoryStorage.geopoliticalEvents.length);
  mockModels.GeopoliticalEvent.distinct.mockImplementation((field) => {
    const values = [...new Set(inMemoryStorage.geopoliticalEvents.map(event => event[field]))];
    return values.filter(Boolean);
  });
  mockModels.GeopoliticalEvent.aggregate.mockImplementation((pipeline) => {
    // Simple aggregation mock
    if (pipeline[0]?.$group?._id === 'category') {
      const categories = {};
      inMemoryStorage.geopoliticalEvents.forEach(event => {
        categories[event.category] = (categories[event.category] || 0) + 1;
      });
      return Object.entries(categories).map(([category, count]) => ({ _id: category, count }));
    }
    if (pipeline[0]?.$group?._id === 'severity') {
      const severities = {};
      inMemoryStorage.geopoliticalEvents.forEach(event => {
        severities[event.severity] = (severities[event.severity] || 0) + 1;
      });
      return Object.entries(severities).map(([severity, count]) => ({ _id: severity, count }));
    }
    return [];
  });
  mockModels.GeopoliticalEvent.insertMany.mockImplementation((events) => {
    const newEvents = events.map(eventData => ({
      _id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...eventData,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    inMemoryStorage.geopoliticalEvents.push(...newEvents);
    return newEvents;
  });

  // CrisisCommunication mocks
  mockModels.CrisisCommunication.find.mockResolvedValue(inMemoryStorage.crisisCommunications);
  mockModels.CrisisCommunication.findById.mockImplementation((id) => {
    return inMemoryStorage.crisisCommunications.find(crisis => crisis._id === id) || null;
  });
  mockModels.CrisisCommunication.create.mockImplementation((crisisData) => {
    const newCrisis = {
      _id: `crisis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...crisisData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    inMemoryStorage.crisisCommunications.push(newCrisis);
    return newCrisis;
  });
  mockModels.CrisisCommunication.findByIdAndUpdate.mockImplementation((id, updateData, options) => {
    const crisisIndex = inMemoryStorage.crisisCommunications.findIndex(crisis => crisis._id === id);
    if (crisisIndex === -1) return null;
    
    inMemoryStorage.crisisCommunications[crisisIndex] = {
      ...inMemoryStorage.crisisCommunications[crisisIndex],
      ...updateData,
      updatedAt: new Date()
    };
    return inMemoryStorage.crisisCommunications[crisisIndex];
  });
  mockModels.CrisisCommunication.findByIdAndDelete.mockImplementation((id) => {
    const crisisIndex = inMemoryStorage.crisisCommunications.findIndex(crisis => crisis._id === id);
    if (crisisIndex === -1) return null;
    
    const deletedCrisis = inMemoryStorage.crisisCommunications[crisisIndex];
    inMemoryStorage.crisisCommunications.splice(crisisIndex, 1);
    return deletedCrisis;
  });
  mockModels.CrisisCommunication.countDocuments.mockResolvedValue(inMemoryStorage.crisisCommunications.length);
}

// Clear all data
function clearData() {
  inMemoryStorage.userProfiles = [];
  inMemoryStorage.geopoliticalEvents = [];
  inMemoryStorage.crisisCommunications = [];
}

// Reset all mocks
function resetMocks() {
  Object.values(mockModels).forEach(model => {
    Object.values(model).forEach(mock => {
      if (typeof mock.mockReset === 'function') {
        mock.mockReset();
      }
    });
  });
  clearData();
  setupMocks();
}

// Initialize mocks
setupMocks();

module.exports = {
  mockModels,
  inMemoryStorage,
  setupMocks,
  clearData,
  resetMocks,
  mockConnection
}; 
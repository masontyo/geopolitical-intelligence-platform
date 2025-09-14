// Mock GeopoliticalEvent model for testing
const mockGeopoliticalEvent = {
  find: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  findOne: jest.fn().mockReturnThis(),
  create: jest.fn().mockReturnThis(),
  save: jest.fn().mockReturnThis(),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
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

// Mock successful event creation response
const mockCreatedEvent = {
  _id: "mock-event-id-123",
  title: "Trade War Escalation",
  description: "New tariffs imposed on imported goods",
  categories: ["Trade Relations", "Economics"],
  regions: ["Global"],
  severity: "medium",
  impact: {
    economic: "negative",
    political: "neutral",
    social: "neutral"
  },
  source: {
    name: "Test News Source",
    url: "https://example.com",
    reliability: "high"
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Set up mock methods with realistic responses
mockGeopoliticalEvent.create.mockResolvedValue(mockCreatedEvent);
mockGeopoliticalEvent.find.mockResolvedValue([mockCreatedEvent]);
mockGeopoliticalEvent.findById.mockResolvedValue(mockCreatedEvent);
mockGeopoliticalEvent.findOne.mockResolvedValue(mockCreatedEvent);
mockGeopoliticalEvent.findByIdAndUpdate.mockResolvedValue(mockCreatedEvent);
mockGeopoliticalEvent.deleteMany.mockResolvedValue({ deletedCount: 1 });
mockGeopoliticalEvent.countDocuments.mockResolvedValue(1);

module.exports = mockGeopoliticalEvent; 
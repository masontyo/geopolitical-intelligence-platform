// Mock CrisisCommunication model for testing
const mockCrisisCommunication = {
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  findByIdAndUpdate: jest.fn().mockResolvedValue({
    _id: 'mock-crisis-id',
    status: 'active',
    save: jest.fn().mockResolvedValue(true)
  }),
  findByIdAndDelete: jest.fn(),
  updateOne: jest.fn(),
  updateMany: jest.fn(),
  deleteOne: jest.fn(),
  deleteMany: jest.fn(),
  exec: jest.fn(),
  lean: jest.fn(),
  sort: jest.fn(),
  limit: jest.fn(),
  skip: jest.fn(),
  populate: jest.fn(),
  select: jest.fn(),
  where: jest.fn(),
  equals: jest.fn(),
  in: jest.fn(),
  nin: jest.fn(),
  exists: jest.fn(),
  countDocuments: jest.fn(),
  aggregate: jest.fn(),
  pipeline: jest.fn(),
  addFields: jest.fn(),
  match: jest.fn(),
  group: jest.fn(),
  project: jest.fn(),
  unwind: jest.fn(),
  lookup: jest.fn(),
  facet: jest.fn()
};

// Create a mock chain that returns the final value
const createMockChain = (finalValue) => {
  const chain = {};
  chain.populate = jest.fn().mockReturnValue(chain);
  chain.select = jest.fn().mockReturnValue(chain);
  chain.lean = jest.fn().mockReturnValue(chain);
  chain.sort = jest.fn().mockReturnValue(chain);
  chain.limit = jest.fn().mockReturnValue(chain);
  chain.skip = jest.fn().mockReturnValue(chain);
  chain.exec = jest.fn().mockResolvedValue(finalValue);
  
  return chain;
};

module.exports = mockCrisisCommunication; 
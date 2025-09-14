// Simple UserProfile mock for testing
const mockUserProfile = {
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  findByIdAndUpdate: jest.fn(),
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

// In-memory storage for profiles
let profiles = [];
let profileCounter = 0;

// Reset function for tests
const resetMock = () => {
  profiles = [];
  profileCounter = 0;
};

// Set up mock implementations
mockUserProfile.create.mockImplementation((profileData) => {
  // Check if profile already exists
  const existingProfile = profiles.find(p => 
    p.name === profileData.name && p.company === profileData.company
  );
  
  if (existingProfile) {
    // Update existing profile
    Object.assign(existingProfile, profileData);
    existingProfile.updatedAt = new Date().toISOString();
    return Promise.resolve(existingProfile);
  } else {
    // Create new profile
    profileCounter++;
    const newProfile = {
      ...profileData,
      _id: `mock-profile-id-${profileCounter}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    profiles.push(newProfile);
    return Promise.resolve(newProfile);
  }
});

mockUserProfile.findOne.mockImplementation((query) => {
  // Find profile by name and company
  if (query && query.name && query.company) {
    const profile = profiles.find(p => 
      p.name === query.name && p.company === query.company
    );
    return profile || null;
  }
  return null;
});

mockUserProfile.findById.mockImplementation((id) => {
  // Return null for fake/non-existent IDs
  if (id === "mock-fake-id-456" || id === "mock-fake-id-789" || id.includes("fake")) {
    return null;
  }
  // Return the profile for valid IDs
  const profile = profiles.find(p => p._id === id);
  return profile || null;
});

mockUserProfile.find.mockImplementation((query = {}) => {
  if (Object.keys(query).length === 0) {
    return profiles;
  }
  // Filter profiles based on query
  return profiles.filter(profile => {
    for (const [key, value] of Object.entries(query)) {
      if (profile[key] !== value) {
        return false;
      }
    }
    return true;
  });
});

mockUserProfile.findByIdAndUpdate.mockImplementation((id, updateData, options) => {
  const profileIndex = profiles.findIndex(profile => profile._id === id);
  if (profileIndex === -1) return null;
  
  profiles[profileIndex] = {
    ...profiles[profileIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  return Promise.resolve(profiles[profileIndex]);
});

mockUserProfile.deleteMany.mockResolvedValue({ deletedCount: profiles.length });

// Add reset function to the mock object
mockUserProfile.resetMock = resetMock;

module.exports = mockUserProfile; 
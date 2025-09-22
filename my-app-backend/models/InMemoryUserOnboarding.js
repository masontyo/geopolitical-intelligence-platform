// In-memory mock for UserOnboarding model for local development
class InMemoryUserOnboarding {
  constructor(data) {
    this.userId = data.userId;
    this.status = data.status || 'not_started';
    this.profileData = data.profileData || {};
    this.progress = data.progress || {
      phase1: { name: 'Essential Business Profile', completed: 0, total: 10 },
      phase2: { name: 'Geographic Footprint', completed: 0, total: 4 },
      phase3: { name: 'Key Dependencies', completed: 0, total: 4 },
      phase4: { name: 'Enhanced Data', completed: 0, total: 6 }
    };
    this.completionPercentage = data.completionPercentage || 0;
    this.recommendations = data.recommendations || [];
    this.insights = data.insights || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Save method
  async save() {
    this.updatedAt = new Date();
    InMemoryUserOnboarding.store.set(this.userId, this);
    return this;
  }

  // Static methods
  static async findOne(query) {
    if (query.userId) {
      return InMemoryUserOnboarding.store.get(query.userId) || null;
    }
    return null;
  }

  static async findOneAndUpdate(query, update, options = {}) {
    let existing = await this.findOne(query);
    
    if (!existing && options.upsert) {
      existing = new InMemoryUserOnboarding({ userId: query.userId, ...update });
    } else if (existing) {
      // Update existing record
      Object.assign(existing, update);
      existing.updatedAt = new Date();
    }
    
    if (existing) {
      await existing.save();
      return options.new ? existing : existing;
    }
    
    return null;
  }

  static async create(data) {
    const instance = new InMemoryUserOnboarding(data);
    await instance.save();
    return instance;
  }

  static async deleteMany(query) {
    if (query.userId) {
      InMemoryUserOnboarding.store.delete(query.userId);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }

  // Convert to JSON (similar to MongoDB's toObject)
  toObject() {
    return {
      userId: this.userId,
      status: this.status,
      profileData: this.profileData,
      progress: this.progress,
      completionPercentage: this.completionPercentage,
      recommendations: this.recommendations,
      insights: this.insights,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

// In-memory storage
InMemoryUserOnboarding.store = new Map();

module.exports = InMemoryUserOnboarding;


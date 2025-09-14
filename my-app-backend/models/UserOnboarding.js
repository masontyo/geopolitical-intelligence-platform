const mongoose = require('mongoose');

const userOnboardingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Phase 1: Essential Business Profile
  companyName: {
    type: String,
    required: true
  },
  industry: {
    type: String,
    required: true,
    enum: ['Manufacturing', 'Technology', 'Financial Services', 'Healthcare', 'Retail', 'Energy', 'Other']
  },
  primaryBusiness: {
    type: String,
    required: true
  },
  headquarters: {
    type: String,
    required: true
  },
  keyMarkets: [{
    type: String,
    required: true
  }],
  companySize: {
    type: String,
    required: true,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+']
  },

  // Geographic Footprint
  offices: [{
    location: String,
    type: {
      type: String,
      enum: ['headquarters', 'branch', 'manufacturing', 'r&d', 'sales']
    },
    importance: {
      type: String,
      enum: ['critical', 'important', 'standard']
    }
  }],
  manufacturing: [{
    location: String,
    products: [String],
    importance: {
      type: String,
      enum: ['critical', 'important', 'standard']
    }
  }],
  suppliers: [{
    region: String,
    type: String,
    importance: {
      type: String,
      enum: ['critical', 'important', 'standard']
    }
  }],
  customers: [{
    region: String,
    type: String,
    importance: {
      type: String,
      enum: ['critical', 'important', 'standard']
    }
  }],

  // Key Dependencies
  topSuppliers: [{
    name: String,
    location: String,
    products: [String],
    importance: {
      type: String,
      enum: ['critical', 'important', 'standard']
    }
  }],
  keyCustomers: [{
    name: String,
    region: String,
    relationship: {
      type: String,
      enum: ['strategic', 'major', 'standard']
    }
  }],
  criticalAssets: [{
    name: String,
    location: String,
    type: String,
    importance: {
      type: String,
      enum: ['critical', 'important', 'standard']
    }
  }],
  importantPartners: [{
    name: String,
    type: String,
    relationship: String
  }],

  // Risk Preferences
  riskTolerance: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High']
  },
  alertFrequency: {
    type: String,
    required: true,
    enum: ['Real-time', 'Hourly', 'Daily', 'Weekly']
  },
  priorityRegions: [{
    type: String,
    required: true
  }],
  concernAreas: [{
    type: String,
    required: true,
    enum: ['Supply Chain', 'Trade Policy', 'Labor Issues', 'Regulatory Changes', 'Cyber Security', 'Natural Disasters', 'Political Instability', 'Economic Instability']
  }],

  // Phase 2: Enhanced Data (Optional)
  businessUnits: [{
    name: String,
    function: String,
    importance: {
      type: String,
      enum: ['critical', 'important', 'standard']
    }
  }],
  keyPersonnel: [{
    name: String,
    role: String,
    department: String,
    contactInfo: String
  }],
  decisionMakers: [{
    name: String,
    role: String,
    level: {
      type: String,
      enum: ['executive', 'management', 'operational']
    }
  }],

  // Financial Context (Optional)
  revenue: {
    type: String,
    enum: ['<1M', '1M-10M', '10M-50M', '50M-100M', '100M-500M', '500M-1B', '1B+']
  },
  publicCompany: {
    type: Boolean,
    default: false
  },
  stockSymbol: String,
  keyFinancials: [{
    metric: String,
    value: String,
    period: String
  }],

  // Risk History (Optional)
  pastIncidents: [{
    description: String,
    date: Date,
    impact: String,
    resolution: String
  }],
  riskMitigation: [{
    strategy: String,
    description: String,
    effectiveness: {
      type: String,
      enum: ['high', 'medium', 'low']
    }
  }],
  insurance: [{
    type: String,
    coverage: String,
    provider: String
  }],

  // AI Intelligence Data
  aiProfile: {
    riskProfile: {
      type: String,
      enum: ['conservative', 'moderate', 'aggressive']
    },
    attentionPatterns: {
      peakHours: [Number],
      preferredDays: [Number],
      sessionLength: Number
    },
    behavioralInsights: {
      preferredRegions: [String],
      preferredEventTypes: [String],
      engagementLevel: {
        type: String,
        enum: ['low', 'medium', 'high']
      }
    },
    knowledgeGraph: {
      entities: [String],
      relationships: [String],
      riskFactors: [String]
    }
  },

  // Onboarding Status
  onboardingStatus: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'needs_review'],
    default: 'not_started'
  },
  completionPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for performance
userOnboardingSchema.index({ userId: 1 });
userOnboardingSchema.index({ industry: 1 });
userOnboardingSchema.index({ onboardingStatus: 1 });
userOnboardingSchema.index({ lastUpdated: -1 });

  // Method for calculating completion percentage
  userOnboardingSchema.methods.calculateCompletionPercentage = function() {
    let completed = 0;
    let total = 0;

    // Phase 1 fields (required)
    const phase1Fields = [
      'companyName', 'industry', 'primaryBusiness', 'headquarters', 
      'keyMarkets', 'companySize', 'riskTolerance', 'alertFrequency', 
      'priorityRegions', 'concernAreas'
    ];
    
    phase1Fields.forEach(field => {
      total++;
      if (this[field] && this[field].length > 0) {
        completed++;
      }
    });

    // Geographic footprint
    const geoFields = ['offices', 'manufacturing', 'suppliers', 'customers'];
    geoFields.forEach(field => {
      total++;
      if (this[field] && this[field].length > 0) {
        completed++;
      }
    });

    // Key dependencies
    const depFields = ['topSuppliers', 'keyCustomers', 'criticalAssets', 'importantPartners'];
    depFields.forEach(field => {
      total++;
      if (this[field] && this[field].length > 0) {
        completed++;
      }
    });

    return Math.round((completed / total) * 100);
  };

// Method to get onboarding progress
userOnboardingSchema.methods.getOnboardingProgress = function() {
  const progress = {
    phase1: {
      name: 'Essential Business Profile',
      completed: 0,
      total: 10,
      fields: [
        'companyName', 'industry', 'primaryBusiness', 'headquarters',
        'keyMarkets', 'companySize', 'riskTolerance', 'alertFrequency',
        'priorityRegions', 'concernAreas'
      ]
    },
    phase2: {
      name: 'Geographic Footprint',
      completed: 0,
      total: 4,
      fields: ['offices', 'manufacturing', 'suppliers', 'customers']
    },
    phase3: {
      name: 'Key Dependencies',
      completed: 0,
      total: 4,
      fields: ['topSuppliers', 'keyCustomers', 'criticalAssets', 'importantPartners']
    },
    phase4: {
      name: 'Enhanced Data (Optional)',
      completed: 0,
      total: 6,
      fields: ['businessUnits', 'keyPersonnel', 'decisionMakers', 'revenue', 'pastIncidents', 'riskMitigation']
    }
  };

  // Calculate completion for each phase
  Object.keys(progress).forEach(phase => {
    progress[phase].fields.forEach(field => {
      if (this[field] && this[field].length > 0) {
        progress[phase].completed++;
      }
    });
  });

  return progress;
};

// Method to get next recommended fields
userOnboardingSchema.methods.getNextRecommendedFields = function() {
  const progress = this.getOnboardingProgress();
  const recommendations = [];

  // Check Phase 1 (Essential)
  if (progress.phase1.completed < progress.phase1.total) {
    progress.phase1.fields.forEach(field => {
      if (!this[field] || this[field].length === 0) {
        recommendations.push({
          field,
          phase: 'Essential Business Profile',
          priority: 'high',
          description: this.getFieldDescription(field)
        });
      }
    });
  }

  // Check Phase 2 (Geographic)
  if (progress.phase1.completed === progress.phase1.total && progress.phase2.completed < progress.phase2.total) {
    progress.phase2.fields.forEach(field => {
      if (!this[field] || this[field].length === 0) {
        recommendations.push({
          field,
          phase: 'Geographic Footprint',
          priority: 'high',
          description: this.getFieldDescription(field)
        });
      }
    });
  }

  // Check Phase 3 (Dependencies)
  if (progress.phase2.completed === progress.phase2.total && progress.phase3.completed < progress.phase3.total) {
    progress.phase3.fields.forEach(field => {
      if (!this[field] || this[field].length === 0) {
        recommendations.push({
          field,
          phase: 'Key Dependencies',
          priority: 'high',
          description: this.getFieldDescription(field)
        });
      }
    });
  }

  // Check Phase 4 (Enhanced)
  if (progress.phase3.completed === progress.phase3.total && progress.phase4.completed < progress.phase4.total) {
    progress.phase4.fields.forEach(field => {
      if (!this[field] || this[field].length === 0) {
        recommendations.push({
          field,
          phase: 'Enhanced Data',
          priority: 'medium',
          description: this.getFieldDescription(field)
        });
      }
    });
  }

  return recommendations.slice(0, 5); // Return top 5 recommendations
};

// Method to get field descriptions
userOnboardingSchema.methods.getFieldDescription = function(field) {
  const descriptions = {
    companyName: 'Your company name for personalized analysis',
    industry: 'Your industry sector for relevant risk patterns',
    primaryBusiness: 'Your main business activities',
    headquarters: 'Your main office location',
    keyMarkets: 'Regions where you operate or sell',
    companySize: 'Number of employees for risk scaling',
    riskTolerance: 'Your comfort level with different risk levels',
    alertFrequency: 'How often you want to receive alerts',
    priorityRegions: 'Regions you want to monitor most closely',
    concernAreas: 'Types of risks you want to track',
    offices: 'All your office locations and their importance',
    manufacturing: 'Your manufacturing facilities and products',
    suppliers: 'Your supplier regions and types',
    customers: 'Your customer regions and types',
    topSuppliers: 'Your most important suppliers',
    keyCustomers: 'Your most important customers',
    criticalAssets: 'Your most important business assets',
    importantPartners: 'Your key business partners',
    businessUnits: 'Your organizational structure',
    keyPersonnel: 'Important people in your organization',
    decisionMakers: 'People who make risk decisions',
    revenue: 'Your company revenue range',
    pastIncidents: 'Previous risk incidents you experienced',
    riskMitigation: 'Your current risk mitigation strategies'
  };

  return descriptions[field] || 'Additional information for better analysis';
};

// Method to validate required fields
userOnboardingSchema.methods.validateRequiredFields = function() {
  const errors = [];
  
  // Phase 1 required fields
  const requiredFields = [
    'companyName', 'industry', 'primaryBusiness', 'headquarters',
    'keyMarkets', 'companySize', 'riskTolerance', 'alertFrequency',
    'priorityRegions', 'concernAreas'
  ];

  requiredFields.forEach(field => {
    if (!this[field] || this[field].length === 0) {
      errors.push(`${field} is required`);
    }
  });

  return errors;
};

// Method to get AI insights based on current data
userOnboardingSchema.methods.getAIInsights = function() {
  const insights = [];

  // Industry insights
  if (this.industry) {
    insights.push(`Based on your ${this.industry} industry, we'll monitor for industry-specific risks and opportunities`);
  }

  // Geographic insights
  if (this.priorityRegions && this.priorityRegions.length > 0) {
    insights.push(`We'll prioritize monitoring ${this.priorityRegions.join(', ')} for geopolitical events`);
  }

  // Risk tolerance insights
  if (this.riskTolerance) {
    insights.push(`Your ${this.riskTolerance} risk tolerance will help us filter and prioritize alerts`);
  }

  // Concern areas insights
  if (this.concernAreas && this.concernAreas.length > 0) {
    insights.push(`We'll focus on ${this.concernAreas.join(', ')} as your primary risk concerns`);
  }

  return insights;
};

module.exports = mongoose.model('UserOnboarding', userOnboardingSchema);

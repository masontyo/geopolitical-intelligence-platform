const mongoose = require('mongoose');

const geopoliticalEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  summary: {
    type: String,
    trim: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  categories: [{
    type: String,
    trim: true
  }],
  regions: [{
    type: String,
    trim: true
  }],
  countries: [{
    type: String,
    trim: true
  }],
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  impact: {
    economic: {
      type: String,
      enum: ['positive', 'negative', 'neutral', 'unknown'],
      default: 'unknown'
    },
    political: {
      type: String,
      enum: ['positive', 'negative', 'neutral', 'unknown'],
      default: 'unknown'
    },
    social: {
      type: String,
      enum: ['positive', 'negative', 'neutral', 'unknown'],
      default: 'unknown'
    }
  },
  source: {
    name: {
      type: String,
      trim: true
    },
    url: {
      type: String,
      trim: true
    },
    reliability: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    }
  },
  historicalContext: {
    hasHappenedBefore: {
      type: Boolean,
      default: false
    },
    previousOccurrences: [{
      date: Date,
      description: String,
      outcome: String
    }],
    similarPatterns: [{
      pattern: String,
      description: String
    }]
  },
  predictiveAnalytics: {
    likelihood: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5
    },
    timeframe: {
      type: String,
      enum: ['immediate', 'short-term', 'medium-term', 'long-term'],
      default: 'short-term'
    },
    scenarios: [{
      scenario: String,
      probability: Number,
      impact: String
    }]
  },
  actionableInsights: [{
    insight: String,
    action: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['active', 'resolved', 'monitoring', 'archived'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes for faster queries
geopoliticalEventSchema.index({ eventDate: -1 });
geopoliticalEventSchema.index({ categories: 1 });
geopoliticalEventSchema.index({ regions: 1 });
geopoliticalEventSchema.index({ severity: 1 });
geopoliticalEventSchema.index({ status: 1 });

module.exports = mongoose.model('GeopoliticalEvent', geopoliticalEventSchema); 
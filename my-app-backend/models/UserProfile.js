const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  industry: {
    type: String,
    required: true,
    trim: true
  },
  businessUnits: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    regions: [{
      type: String,
      trim: true
    }],
    products: [{
      type: String,
      trim: true
    }]
  }],
  areasOfConcern: [{
    category: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    }
  }],
  regions: [{
    type: String,
    trim: true
  }],
  riskTolerance: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  notificationPreferences: {
    email: {
      type: Boolean,
      default: true
    },
    frequency: {
      type: String,
      enum: ['immediate', 'daily', 'weekly'],
      default: 'daily'
    }
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Index for faster queries
userProfileSchema.index({ name: 1, company: 1 });

module.exports = mongoose.model('UserProfile', userProfileSchema); 
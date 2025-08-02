const mongoose = require('mongoose');

const crisisCommunicationSchema = new mongoose.Schema({
  // Event association
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GeopoliticalEvent',
    required: true
  },
  
  // Crisis room details
  crisisRoom: {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['active', 'resolved', 'monitoring', 'escalated'],
      default: 'active'
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    resolvedAt: Date,
    assignedTeam: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserProfile'
      },
      role: {
        type: String,
        enum: ['incident_commander', 'communications_lead', 'technical_lead', 'stakeholder_liaison', 'observer'],
        default: 'observer'
      },
      assignedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },

  // Stakeholder contacts and groups
  stakeholders: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      enum: ['executive', 'manager', 'technical', 'external', 'regulatory'],
      required: true
    },
    organization: {
      type: String,
      trim: true
    },
    notificationChannels: [{
      type: String,
      enum: ['email', 'sms', 'slack', 'teams', 'webhook'],
      default: ['email']
    }],
    escalationLevel: {
      type: Number,
      min: 1,
      max: 5,
      default: 1
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],

  // Communication templates
  templates: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['initial_alert', 'status_update', 'resolution', 'escalation', 'custom'],
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    variables: [{
      name: String,
      description: String,
      defaultValue: String
    }],
    isDefault: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserProfile'
    }
  }],

  // Communication history
  communications: [{
    type: {
      type: String,
      enum: ['alert', 'update', 'escalation', 'resolution', 'internal_note'],
      required: true
    },
    channel: {
      type: String,
      enum: ['email', 'sms', 'slack', 'teams', 'webhook', 'internal'],
      required: true
    },
    recipients: [{
      stakeholderId: {
        type: mongoose.Schema.Types.ObjectId
      },
      name: String,
      email: String,
      role: String
    }],
    subject: String,
    content: String,
    templateUsed: {
      type: mongoose.Schema.Types.ObjectId
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    sentBy: {
      type: String,
      required: true
    },
    deliveryStatus: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'read', 'failed', 'bounced'],
      default: 'pending'
    },
    readAt: Date,
    responseReceived: {
      type: Boolean,
      default: false
    },
    responseContent: String,
    responseAt: Date,
    escalationRequired: {
      type: Boolean,
      default: false
    },
    escalationReason: String,
    attachments: [{
      filename: String,
      url: String,
      size: Number,
      mimeType: String
    }]
  }],

  // Response tracking
  responses: [{
    stakeholderId: {
      type: mongoose.Schema.Types.ObjectId
    },
    stakeholderName: String,
    responseType: {
      type: String,
      enum: ['acknowledgement', 'action_required', 'no_action_needed', 'escalation_request', 'information_request'],
      required: true
    },
    content: String,
    receivedAt: {
      type: Date,
      default: Date.now
    },
    actionItems: [{
      description: String,
      assignedTo: String,
      dueDate: Date,
      status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'cancelled'],
        default: 'pending'
      },
      completedAt: Date
    }],
    followUpRequired: {
      type: Boolean,
      default: false
    },
    followUpDate: Date
  }],

  // Escalation tracking
  escalations: [{
    level: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    triggeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserProfile'
    },
    triggeredAt: {
      type: Date,
      default: Date.now
    },
    escalatedTo: [{
      stakeholderId: mongoose.Schema.Types.ObjectId,
      name: String,
      role: String
    }],
    resolvedAt: Date,
    resolutionNotes: String
  }],

  // Timeline and milestones
  timeline: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    event: {
      type: String,
      required: true
    },
    description: String,
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserProfile'
    },
    actorName: String,
    metadata: mongoose.Schema.Types.Mixed
  }],

  // Settings and configuration
  settings: {
    autoEscalation: {
      enabled: {
        type: Boolean,
        default: true
      },
      timeThreshold: {
        type: Number, // minutes
        default: 30
      },
      noResponseThreshold: {
        type: Number, // minutes
        default: 60
      }
    },
    notificationFrequency: {
      type: String,
      enum: ['immediate', 'hourly', 'daily'],
      default: 'immediate'
    },
    requireAcknowledgement: {
      type: Boolean,
      default: true
    },
    allowPublicComments: {
      type: Boolean,
      default: false
    }
  },

  // Analytics and metrics
  metrics: {
    totalCommunications: {
      type: Number,
      default: 0
    },
    responseRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    averageResponseTime: {
      type: Number, // minutes
      default: 0
    },
    escalationCount: {
      type: Number,
      default: 0
    },
    resolutionTime: {
      type: Number, // minutes
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
crisisCommunicationSchema.index({ eventId: 1 });
crisisCommunicationSchema.index({ 'crisisRoom.status': 1 });
crisisCommunicationSchema.index({ 'crisisRoom.severity': 1 });
crisisCommunicationSchema.index({ 'communications.sentAt': -1 });
crisisCommunicationSchema.index({ 'stakeholders.email': 1 });

// Pre-save middleware to update metrics
crisisCommunicationSchema.pre('save', function(next) {
  // Update total communications count
  this.metrics.totalCommunications = this.communications.length;
  
  // Calculate response rate
  const totalRecipients = this.communications.reduce((sum, comm) => sum + comm.recipients.length, 0);
  const totalResponses = this.responses.length;
  this.metrics.responseRate = totalRecipients > 0 ? (totalResponses / totalRecipients) * 100 : 0;
  
  // Calculate average response time
  if (this.responses.length > 0) {
    const responseTimes = this.responses.map(response => {
      const communication = this.communications.find(comm => 
        comm.recipients.some(recipient => recipient.email === response.stakeholderName)
      );
      if (communication) {
        return (response.receivedAt - communication.sentAt) / (1000 * 60); // Convert to minutes
      }
      return 0;
    }).filter(time => time > 0);
    
    this.metrics.averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
      : 0;
  }
  
  // Update escalation count
  this.metrics.escalationCount = this.escalations.length;
  
  // Calculate resolution time if resolved
  if (this.crisisRoom.status === 'resolved' && this.crisisRoom.resolvedAt) {
    this.metrics.resolutionTime = (this.crisisRoom.resolvedAt - this.crisisRoom.createdAt) / (1000 * 60);
  }
  
  next();
});

module.exports = mongoose.model('CrisisCommunication', crisisCommunicationSchema); 
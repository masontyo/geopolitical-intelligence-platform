const nodemailer = require('nodemailer');
const axios = require('axios');
const CrisisCommunication = require('../models/CrisisCommunication');
const GeopoliticalEvent = require('../models/GeopoliticalEvent');
const UserProfile = require('../models/UserProfile');
const { scoreEvents } = require('../utils/advancedScoring');

class CrisisCommunicationService {
  constructor() {
    // Initialize email transporter
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Initialize external service clients
    this.slackClient = null;
    this.teamsClient = null;
    this.smsClient = null;

    // Initialize if credentials are available
    if (process.env.SLACK_WEBHOOK_URL) {
      this.slackClient = axios.create({
        baseURL: process.env.SLACK_WEBHOOK_URL
      });
    }

    if (process.env.TEAMS_WEBHOOK_URL) {
      this.teamsClient = axios.create({
        baseURL: process.env.TEAMS_WEBHOOK_URL
      });
    }

    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.smsClient = require('twilio')(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
    }
  }

  /**
   * Create a new crisis communication room for an event
   */
  async createCrisisRoom(eventId, crisisData) {
    try {
      const event = await GeopoliticalEvent.findById(eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      // Score the event to determine severity
      const userProfiles = await UserProfile.find({});
      let maxScore = 0;
      
      for (const profile of userProfiles) {
        const scoredEvents = await scoreEvents(profile, [event]);
        if (scoredEvents.length > 0 && scoredEvents[0].relevanceScore > maxScore) {
          maxScore = scoredEvents[0].relevanceScore;
        }
      }

      // Determine severity based on score
      const severity = this.determineSeverity(maxScore);

      const crisisRoom = new CrisisCommunication({
        eventId,
        crisisRoom: {
          title: crisisData.title || `Crisis Room: ${event.title}`,
          description: crisisData.description || `Crisis communication room for ${event.title}`,
          severity,
          assignedTeam: crisisData.assignedTeam || []
        },
        stakeholders: crisisData.stakeholders || [],
        templates: crisisData.templates || await this.getDefaultTemplates(),
        settings: crisisData.settings || {}
      });

      // Add initial timeline entry
      crisisRoom.timeline.push({
        event: 'crisis_room_created',
        description: 'Crisis communication room created',
        actorName: crisisData.createdBy || 'System'
      });

      await crisisRoom.save();
      return crisisRoom;
    } catch (error) {
      console.error('Error creating crisis room:', error);
      throw error;
    }
  }

  /**
   * Send multi-channel crisis communication
   */
  async sendCrisisCommunication(crisisRoomId, communicationData) {
    try {
      const crisisRoom = await CrisisCommunication.findById(crisisRoomId);
      if (!crisisRoom) {
        throw new Error('Crisis room not found');
      }

      const communication = {
        type: communicationData.type,
        channel: communicationData.channel,
        recipients: communicationData.recipients,
        subject: communicationData.subject,
        content: communicationData.content,
        templateUsed: communicationData.templateUsed,
        sentBy: communicationData.sentBy,
        attachments: communicationData.attachments || []
      };

      // Send through appropriate channel
      let deliveryStatus = 'pending';
      try {
        switch (communicationData.channel) {
          case 'email':
            await this.sendEmail(communication);
            deliveryStatus = 'sent';
            break;
          case 'slack':
            await this.sendSlackMessage(communication);
            deliveryStatus = 'sent';
            break;
          case 'teams':
            await this.sendTeamsMessage(communication);
            deliveryStatus = 'sent';
            break;
          case 'sms':
            await this.sendSMS(communication);
            deliveryStatus = 'sent';
            break;
          case 'webhook':
            await this.sendWebhook(communication);
            deliveryStatus = 'sent';
            break;
          default:
            throw new Error(`Unsupported channel: ${communicationData.channel}`);
        }
      } catch (error) {
        deliveryStatus = 'failed';
        console.error(`Failed to send ${communicationData.channel} communication:`, error);
      }

      communication.deliveryStatus = deliveryStatus;
      crisisRoom.communications.push(communication);

      // Add timeline entry
      crisisRoom.timeline.push({
        event: 'communication_sent',
        description: `Sent ${communicationData.type} via ${communicationData.channel}`,
        actorName: communicationData.sentBy || 'System',
        metadata: {
          recipients: communicationData.recipients.length,
          channel: communicationData.channel,
          status: deliveryStatus
        }
      });

      await crisisRoom.save();
      return communication;
    } catch (error) {
      console.error('Error sending crisis communication:', error);
      throw error;
    }
  }

  /**
   * Process stakeholder responses
   */
  async processStakeholderResponse(crisisRoomId, responseData) {
    try {
      const crisisRoom = await CrisisCommunication.findById(crisisRoomId);
      if (!crisisRoom) {
        throw new Error('Crisis room not found');
      }

      const response = {
        stakeholderId: responseData.stakeholderId,
        stakeholderName: responseData.stakeholderName,
        responseType: responseData.responseType,
        content: responseData.content,
        actionItems: responseData.actionItems || [],
        followUpRequired: responseData.followUpRequired || false,
        followUpDate: responseData.followUpDate
      };

      crisisRoom.responses.push(response);

      // Update communication status
      const communication = crisisRoom.communications.find(comm => 
        comm.recipients.some(recipient => recipient.email === responseData.stakeholderName)
      );
      
      if (communication) {
        communication.responseReceived = true;
        communication.responseContent = responseData.content;
        communication.responseAt = new Date();
      }

      // Check if escalation is needed
      if (responseData.responseType === 'escalation_request') {
        await this.triggerEscalation(crisisRoom, responseData);
      }

      // Add timeline entry
      crisisRoom.timeline.push({
        event: 'stakeholder_response',
        description: `Response received from ${responseData.stakeholderName}`,
        actorName: responseData.stakeholderName,
        metadata: {
          responseType: responseData.responseType,
          followUpRequired: responseData.followUpRequired
        }
      });

      await crisisRoom.save();
      return response;
    } catch (error) {
      console.error('Error processing stakeholder response:', error);
      throw error;
    }
  }

  /**
   * Trigger escalation based on conditions
   */
  async triggerEscalation(crisisRoom, triggerData) {
    try {
      const escalationLevel = this.calculateEscalationLevel(crisisRoom);
      
      const escalation = {
        level: escalationLevel,
        reason: triggerData.reason || 'Automatic escalation triggered',
        triggeredBy: triggerData.triggeredBy,
        escalatedTo: await this.getEscalationRecipients(crisisRoom, escalationLevel)
      };

      crisisRoom.escalations.push(escalation);
      crisisRoom.crisisRoom.status = 'escalated';

      // Send escalation notifications
      for (const recipient of escalation.escalatedTo) {
        await this.sendCrisisCommunication(crisisRoom._id, {
          type: 'escalation',
          channel: 'email',
          recipients: [recipient],
          subject: `ESCALATION: ${crisisRoom.crisisRoom.title}`,
          content: `This crisis has been escalated to level ${escalationLevel}. Reason: ${escalation.reason}`,
          sentBy: 'System'
        });
      }

      // Add timeline entry
      crisisRoom.timeline.push({
        event: 'escalation_triggered',
        description: `Escalated to level ${escalationLevel}`,
        actorName: triggerData.triggeredBy || 'System',
        metadata: {
          level: escalationLevel,
          reason: escalation.reason
        }
      });

      await crisisRoom.save();
      return escalation;
    } catch (error) {
      console.error('Error triggering escalation:', error);
      throw error;
    }
  }

  /**
   * Resolve crisis room
   */
  async resolveCrisisRoom(crisisRoomId, resolutionData) {
    try {
      const crisisRoom = await CrisisCommunication.findById(crisisRoomId);
      if (!crisisRoom) {
        throw new Error('Crisis room not found');
      }

      crisisRoom.crisisRoom.status = 'resolved';
      crisisRoom.crisisRoom.resolvedAt = new Date();

      // Send resolution notification
      await this.sendCrisisCommunication(crisisRoomId, {
        type: 'resolution',
        channel: 'email',
        recipients: crisisRoom.stakeholders.map(s => ({
          stakeholderId: s._id,
          name: s.name,
          email: s.email,
          role: s.role
        })),
        subject: `RESOLVED: ${crisisRoom.crisisRoom.title}`,
        content: `This crisis has been resolved. ${resolutionData.notes || ''}`,
        sentBy: resolutionData.resolvedBy || 'System'
      });

      // Add timeline entry
      crisisRoom.timeline.push({
        event: 'crisis_resolved',
        description: 'Crisis room resolved',
        actorName: resolutionData.resolvedBy || 'System',
        metadata: {
          resolutionNotes: resolutionData.notes
        }
      });

      await crisisRoom.save();
      return crisisRoom;
    } catch (error) {
      console.error('Error resolving crisis room:', error);
      throw error;
    }
  }

  /**
   * Get crisis room analytics
   */
  async getCrisisRoomAnalytics(crisisRoomId) {
    try {
      const crisisRoom = await CrisisCommunication.findById(crisisRoomId);
      if (!crisisRoom) {
        throw new Error('Crisis room not found');
      }

      const analytics = {
        basic: {
          totalCommunications: crisisRoom.metrics.totalCommunications,
          responseRate: crisisRoom.metrics.responseRate,
          averageResponseTime: crisisRoom.metrics.averageResponseTime,
          escalationCount: crisisRoom.metrics.escalationCount,
          resolutionTime: crisisRoom.metrics.resolutionTime
        },
        stakeholderEngagement: this.analyzeStakeholderEngagement(crisisRoom),
        communicationChannels: this.analyzeCommunicationChannels(crisisRoom),
        timeline: crisisRoom.timeline,
        escalations: crisisRoom.escalations
      };

      return analytics;
    } catch (error) {
      console.error('Error getting crisis room analytics:', error);
      throw error;
    }
  }

  // Private helper methods

  async sendEmail(communication) {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@crisis-comm.com',
      to: communication.recipients.map(r => r.email).join(', '),
      subject: communication.subject,
      html: communication.content,
      attachments: communication.attachments
    };

    return await this.emailTransporter.sendMail(mailOptions);
  }

  async sendSlackMessage(communication) {
    if (!this.slackClient) {
      throw new Error('Slack client not configured');
    }

    const message = {
      text: communication.subject,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${communication.subject}*\n\n${communication.content}`
          }
        }
      ]
    };

    return await this.slackClient.post('', message);
  }

  async sendTeamsMessage(communication) {
    if (!this.teamsClient) {
      throw new Error('Teams client not configured');
    }

    const message = {
      title: communication.subject,
      text: communication.content,
      themeColor: '#0078D4'
    };

    return await this.teamsClient.post('', message);
  }

  async sendSMS(communication) {
    if (!this.smsClient) {
      throw new Error('SMS client not configured');
    }

    const promises = communication.recipients.map(recipient => {
      return this.smsClient.messages.create({
        body: `${communication.subject}\n\n${communication.content}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: recipient.phone
      });
    });

    return await Promise.all(promises);
  }

  async sendWebhook(communication) {
    // Generic webhook implementation
    const webhookData = {
      type: communication.type,
      subject: communication.subject,
      content: communication.content,
      recipients: communication.recipients,
      timestamp: new Date().toISOString()
    };

    return await axios.post(process.env.WEBHOOK_URL, webhookData);
  }

  determineSeverity(score) {
    if (score >= 0.8) return 'critical';
    if (score >= 0.6) return 'high';
    if (score >= 0.4) return 'medium';
    return 'low';
  }

  calculateEscalationLevel(crisisRoom) {
    const currentLevel = crisisRoom.escalations.length > 0 
      ? Math.max(...crisisRoom.escalations.map(e => e.level))
      : 0;
    
    return Math.min(currentLevel + 1, 5);
  }

  async getEscalationRecipients(crisisRoom, level) {
    // Get stakeholders with appropriate escalation level
    return crisisRoom.stakeholders
      .filter(s => s.escalationLevel >= level && s.isActive)
      .map(s => ({
        stakeholderId: s._id,
        name: s.name,
        role: s.role
      }));
  }

  async getDefaultTemplates() {
    return [
      {
        name: 'Initial Alert',
        type: 'initial_alert',
        subject: 'CRISIS ALERT: {event_title}',
        content: `
          <h2>Crisis Alert</h2>
          <p>A new crisis has been identified that requires immediate attention.</p>
          <p><strong>Event:</strong> {event_title}</p>
          <p><strong>Severity:</strong> {severity}</p>
          <p><strong>Description:</strong> {event_description}</p>
          <p>Please review and respond as appropriate.</p>
        `,
        variables: [
          { name: 'event_title', description: 'Event title', defaultValue: '' },
          { name: 'severity', description: 'Crisis severity', defaultValue: 'medium' },
          { name: 'event_description', description: 'Event description', defaultValue: '' }
        ],
        isDefault: true
      },
      {
        name: 'Status Update',
        type: 'status_update',
        subject: 'STATUS UPDATE: {crisis_title}',
        content: `
          <h2>Status Update</h2>
          <p>This is an update on the ongoing crisis situation.</p>
          <p><strong>Current Status:</strong> {status}</p>
          <p><strong>Update:</strong> {update_content}</p>
          <p>Please review and take any necessary actions.</p>
        `,
        variables: [
          { name: 'crisis_title', description: 'Crisis title', defaultValue: '' },
          { name: 'status', description: 'Current status', defaultValue: 'active' },
          { name: 'update_content', description: 'Update content', defaultValue: '' }
        ],
        isDefault: true
      }
    ];
  }

  analyzeStakeholderEngagement(crisisRoom) {
    const engagement = {};
    
    crisisRoom.stakeholders.forEach(stakeholder => {
      const responses = crisisRoom.responses.filter(r => 
        r.stakeholderId.toString() === stakeholder._id.toString()
      );
      
      engagement[stakeholder.name] = {
        totalCommunications: crisisRoom.communications.filter(c => 
          c.recipients.some(r => r.email === stakeholder.email)
        ).length,
        responses: responses.length,
        responseTime: responses.length > 0 ? 
          responses.reduce((sum, r) => sum + (r.receivedAt - new Date()), 0) / responses.length : 0,
        lastResponse: responses.length > 0 ? 
          Math.max(...responses.map(r => r.receivedAt)) : null
      };
    });

    return engagement;
  }

  analyzeCommunicationChannels(crisisRoom) {
    const channels = {};
    
    crisisRoom.communications.forEach(comm => {
      if (!channels[comm.channel]) {
        channels[comm.channel] = {
          total: 0,
          successful: 0,
          failed: 0
        };
      }
      
      channels[comm.channel].total++;
      if (comm.deliveryStatus === 'sent' || comm.deliveryStatus === 'delivered') {
        channels[comm.channel].successful++;
      } else if (comm.deliveryStatus === 'failed') {
        channels[comm.channel].failed++;
      }
    });

    return channels;
  }
}

module.exports = new CrisisCommunicationService(); 
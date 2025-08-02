const nodemailer = require('nodemailer');
const UserProfile = require('../models/UserProfile');
const { scoreEvents } = require('../utils/advancedScoring');

class NotificationService {
  constructor() {
    // Initialize email transporter (will be configured with real credentials)
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  /**
   * Check if user should receive notification based on preferences and event relevance
   */
  async shouldNotifyUser(userProfile, event, relevanceScore) {
    const { notificationPreferences } = userProfile;
    
    // Check if email notifications are enabled
    if (!notificationPreferences.email) {
      return false;
    }

    // Check frequency settings
    const lastNotification = await this.getLastNotificationTime(userProfile._id);
    const now = new Date();
    
    switch (notificationPreferences.frequency) {
      case 'immediate':
        return relevanceScore >= 0.7; // High relevance threshold for immediate
      case 'daily':
        // Only send if no notification sent today
        const lastDay = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        return !lastNotification || lastNotification < lastDay;
      case 'weekly':
        // Only send if no notification sent this week
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return !lastNotification || lastNotification < lastWeek;
      default:
        return false;
    }
  }

  /**
   * Send notification email to user
   */
  async sendNotificationEmail(userProfile, event, relevanceScore, rationale) {
    try {
      const emailContent = this.generateEmailContent(userProfile, event, relevanceScore, rationale);
      
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@geopolitical-intelligence.com',
        to: userProfile.email || 'user@example.com', // We'll need to add email to user profile
        subject: `🚨 Geopolitical Alert: ${event.title}`,
        html: emailContent
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Notification email sent:', result.messageId);
      
      // Log notification for frequency tracking
      await this.logNotification(userProfile._id, event._id, relevanceScore);
      
      return result;
    } catch (error) {
      console.error('Failed to send notification email:', error);
      throw error;
    }
  }

  /**
   * Generate HTML email content
   */
  generateEmailContent(userProfile, event, relevanceScore, rationale) {
    const riskLevel = this.getRiskLevel(relevanceScore);
    const riskColor = this.getRiskColor(relevanceScore);
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: ${riskColor}; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .event-card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .risk-score { font-size: 24px; font-weight: bold; color: ${riskColor}; }
          .rationale { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
          .button { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🚨 Geopolitical Intelligence Alert</h1>
          <p>Risk Level: <span class="risk-score">${riskLevel}</span></p>
        </div>
        
        <div class="content">
          <h2>Hello ${userProfile.name},</h2>
          <p>A new geopolitical event has been detected that may impact your business operations.</p>
          
          <div class="event-card">
            <h3>${event.title}</h3>
            <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Category:</strong> ${event.category}</p>
            <p><strong>Severity:</strong> ${event.severity}</p>
            <p>${event.description}</p>
          </div>
          
          <div class="rationale">
            <h4>Why this matters to you:</h4>
            <p><strong>Relevance Score:</strong> ${(relevanceScore * 100).toFixed(1)}%</p>
            <p><strong>Key Factors:</strong> ${rationale}</p>
          </div>
          
          <p><strong>Recommended Actions:</strong></p>
          <ul>
            <li>Review your supply chain exposure in ${event.location}</li>
            <li>Assess potential regulatory impacts</li>
            <li>Monitor for follow-up developments</li>
            <li>Update your risk assessment if needed</li>
          </ul>
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="button">
              View Full Analysis
            </a>
          </p>
        </div>
        
        <div class="footer">
          <p>This alert was generated based on your risk profile and notification preferences.</p>
          <p>To update your preferences, visit your dashboard settings.</p>
          <p>© 2024 Geopolitical Intelligence Platform</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get risk level based on relevance score
   */
  getRiskLevel(score) {
    if (score >= 0.8) return 'CRITICAL';
    if (score >= 0.6) return 'HIGH';
    if (score >= 0.4) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Get color based on risk level
   */
  getRiskColor(score) {
    if (score >= 0.8) return '#dc3545'; // Red
    if (score >= 0.6) return '#fd7e14'; // Orange
    if (score >= 0.4) return '#ffc107'; // Yellow
    return '#28a745'; // Green
  }

  /**
   * Process new events and send notifications
   */
  async processNewEvents(events) {
    try {
      // Get all user profiles
      const userProfiles = await UserProfile.find({});
      
      for (const event of events) {
        for (const userProfile of userProfiles) {
          // Score the event for this user
          const scoredEvents = await scoreEvents(userProfile, [event]);
          const scoredEvent = scoredEvents[0];
          
          if (scoredEvent && scoredEvent.relevanceScore > 0.3) { // Minimum threshold
            const shouldNotify = await this.shouldNotifyUser(
              userProfile, 
              event, 
              scoredEvent.relevanceScore
            );
            
            if (shouldNotify) {
              await this.sendNotificationEmail(
                userProfile,
                event,
                scoredEvent.relevanceScore,
                scoredEvent.rationale
              );
            }
          }
        }
      }
    } catch (error) {
      console.error('Error processing new events for notifications:', error);
      throw error;
    }
  }

  /**
   * Get last notification time for frequency tracking
   */
  async getLastNotificationTime(userId) {
    // This would typically query a notifications log table
    // For now, we'll use a simple approach
    return null; // Placeholder
  }

  /**
   * Log notification for frequency tracking
   */
  async logNotification(userId, eventId, relevanceScore) {
    // This would typically save to a notifications log table
    // For now, we'll just log to console
    console.log(`Notification logged: User ${userId}, Event ${eventId}, Score ${relevanceScore}`);
  }

  /**
   * Test email configuration
   */
  async testEmailConfiguration() {
    try {
      const testMailOptions = {
        from: process.env.SMTP_FROM || 'noreply@geopolitical-intelligence.com',
        to: 'test@example.com',
        subject: 'Test Email - Geopolitical Intelligence Platform',
        text: 'This is a test email to verify the notification system is working.'
      };

      const result = await this.transporter.sendMail(testMailOptions);
      console.log('Test email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Test email failed:', error);
      return false;
    }
  }
}

module.exports = new NotificationService(); 
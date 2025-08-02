# Crisis Communications Module - Integration Guide

## 🎯 **Overview**

The Crisis Communications Module seamlessly integrates with your existing Risk Intelligence Platform, creating a unified workflow from risk detection to crisis response.

## 🔄 **Integration Architecture**

```
Risk Intelligence Platform
├── User Onboarding & Profile Management
├── Event Intelligence Engine
├── Dashboard & Visualization
├── 🆕 Crisis Communications Module ← NEW
├── Admin & Content Management
└── System Integrations
```

## 📊 **How It Works Together**

### **1. Risk Detection → Crisis Response Flow**

```
1. Event Intelligence Engine detects high-risk event
   ↓
2. Advanced scoring algorithm flags event as relevant
   ↓
3. Dashboard shows event with "Create Crisis Room" button
   ↓
4. User clicks button → Crisis Communications Module activates
   ↓
5. Multi-channel stakeholder notifications sent
   ↓
6. Response tracking and escalation management
   ↓
7. Analytics feed back to main dashboard
```

### **2. Data Flow Integration**

```javascript
// Existing User Profile feeds into Crisis Communications
UserProfile → CrisisRoom.stakeholders
UserProfile → CrisisRoom.assignedTeam
UserProfile → Communication preferences

// Existing Events trigger Crisis Rooms
GeopoliticalEvent → CrisisRoom.eventId
Event scoring → CrisisRoom.severity
Event location → Stakeholder targeting

// Crisis Communications feed back to Analytics
CrisisRoom.metrics → Dashboard.analytics
Response rates → Performance tracking
Escalation data → Risk assessment
```

## 🎨 **UI Integration Points**

### **Main Dashboard Integration**

```jsx
// IntegratedDashboard.jsx - New unified interface
<Tabs>
  <Tab label="Overview" />           // Existing dashboard
  <Tab label="Risk Events" />        // Existing events
  <Tab label="Crisis Communications" /> // NEW crisis rooms
  <Tab label="Analytics" />          // Enhanced analytics
</Tabs>
```

### **Event Cards with Crisis Actions**

```jsx
// Each risk event now has crisis communication options
<Card>
  <CardContent>
    <Typography>{event.title}</Typography>
    <Typography>{event.description}</Typography>
  </CardContent>
  <CardActions>
    <Button>View Details</Button>
    <Button startIcon={<CrisisAlert />}>
      Create Crisis Room  // NEW
    </Button>
  </CardActions>
</Card>
```

### **Crisis Room Badge Notifications**

```jsx
// Dashboard shows active crisis rooms
<Tab label="Crisis Communications">
  <Badge badgeContent={crisisRooms.length} color="error">
    Crisis Communications
  </Badge>
</Tab>
```

## 🔧 **Backend Integration**

### **API Endpoints Integration**

```javascript
// Existing endpoints enhanced
GET /api/user-profile/:id/relevant-events
  ↓ Enhanced with crisis room data
GET /api/user-profile/:id/relevant-events?includeCrisisRooms=true

// New crisis communication endpoints
POST /api/crisis-rooms                    // Create from event
GET /api/crisis-rooms/profile/:profileId  // Get user's crisis rooms
GET /api/crisis-rooms/:id                 // Get specific crisis room
POST /api/crisis-rooms/:id/communications // Send communication
```

### **Database Relationships**

```javascript
// Existing models enhanced
UserProfile {
  // ... existing fields
  crisisRooms: [{ type: ObjectId, ref: 'CrisisCommunication' }] // NEW
}

GeopoliticalEvent {
  // ... existing fields
  crisisRooms: [{ type: ObjectId, ref: 'CrisisCommunication' }] // NEW
}

// New Crisis Communication model
CrisisCommunication {
  eventId: { type: ObjectId, ref: 'GeopoliticalEvent' }, // Links to existing event
  stakeholders: [...], // Uses UserProfile data
  assignedTeam: [...], // Uses UserProfile data
  // ... crisis-specific fields
}
```

## 🚀 **Deployment Integration**

### **Environment Variables**

```bash
# Existing variables
MONGODB_URI=...
NODE_ENV=production
FRONTEND_URL=...

# New crisis communication variables
JWT_SECRET=...
SMTP_HOST=...
SMTP_USER=...
SMTP_PASS=...
SLACK_WEBHOOK_URL=...
TEAMS_WEBHOOK_URL=...
TWILIO_ACCOUNT_SID=...
```

### **Render Configuration**

```yaml
# render.yaml - Enhanced with crisis communications
services:
  - type: web
    name: geop-backend
    envVars:
      - key: MONGODB_URI
      - key: JWT_SECRET        # NEW
      - key: SMTP_HOST         # NEW
      - key: SMTP_USER         # NEW
      - key: SMTP_PASS         # NEW
```

## 📱 **User Experience Integration**

### **Seamless Workflow**

1. **User logs into existing dashboard**
2. **Views risk events as usual**
3. **Sees "Create Crisis Room" button on high-priority events**
4. **Clicks button → Crisis room opens in same interface**
5. **Manages crisis communications without leaving platform**
6. **Returns to main dashboard when done**

### **Unified Navigation**

```jsx
// Single app bar across all modules
<AppBar>
  <Toolbar>
    <Typography>Risk Intelligence Platform</Typography>
    <IconButton>Settings</IconButton>
  </Toolbar>
</AppBar>
```

## 🔄 **Data Synchronization**

### **Real-time Updates**

```javascript
// Crisis room updates reflect in main dashboard
useEffect(() => {
  // Load crisis rooms when dashboard loads
  loadCrisisRooms();
  
  // Update dashboard stats when crisis room changes
  if (crisisRoomUpdated) {
    updateDashboardStats();
  }
}, [crisisRoomUpdated]);
```

### **Analytics Integration**

```javascript
// Crisis communications feed into existing analytics
const dashboardAnalytics = {
  riskEvents: relevantEvents.length,
  crisisRooms: crisisRooms.length,        // NEW
  responseRate: averageResponseRate,       // NEW
  escalationCount: totalEscalations,      // NEW
  // ... existing analytics
};
```

## 🎯 **Migration Strategy**

### **Phase 1: Core Integration (Current)**
- ✅ Crisis Communications Module deployed
- ✅ Basic UI integration
- ✅ API endpoints working
- ✅ Database models created

### **Phase 2: Enhanced Integration (Next)**
- 🔄 Replace `CrisisRoomTest` with `IntegratedDashboard`
- 🔄 Add crisis room creation from event cards
- 🔄 Implement real-time notifications
- 🔄 Enhanced analytics dashboard

### **Phase 3: Advanced Features (Future)**
- 🔄 Automated crisis room creation for high-severity events
- 🔄 AI-powered stakeholder recommendations
- 🔄 Advanced escalation workflows
- 🔄 Integration with external crisis management tools

## 🔧 **Configuration Options**

### **Enable/Disable Crisis Communications**

```javascript
// In your app configuration
const config = {
  features: {
    crisisCommunications: true,  // Enable/disable module
    autoCrisisCreation: false,   // Auto-create for high-severity events
    multiChannelNotifications: true,
    escalationWorkflows: true
  }
};
```

### **Customization Points**

```javascript
// Customize crisis room templates
const crisisTemplates = {
  initialAlert: {
    subject: 'CRISIS ALERT: {event_title}',
    content: '...'
  },
  statusUpdate: {
    subject: 'STATUS UPDATE: {crisis_title}',
    content: '...'
  }
};

// Customize escalation levels
const escalationConfig = {
  levels: 5,
  timeThresholds: [30, 60, 120, 240, 480], // minutes
  autoEscalation: true
};
```

## 📈 **Performance Considerations**

### **Database Optimization**

```javascript
// Indexes for crisis communications
crisisCommunicationSchema.index({ eventId: 1 });
crisisCommunicationSchema.index({ 'crisisRoom.status': 1 });
crisisCommunicationSchema.index({ 'communications.sentAt': -1 });
```

### **API Performance**

```javascript
// Efficient crisis room loading
const loadCrisisRooms = async (profileId) => {
  // Load with pagination
  const response = await fetch(`/api/crisis-rooms/profile/${profileId}?limit=10&page=1`);
  // Cache crisis room data
  // Implement real-time updates via WebSocket
};
```

## 🔒 **Security Integration**

### **Authentication & Authorization**

```javascript
// Use existing JWT authentication
const authenticateRequest = (req, res, next) => {
  // Existing auth logic
  // Crisis communications inherit same security
};

// Role-based access for crisis rooms
const crisisRoomAccess = {
  'incident_commander': ['read', 'write', 'escalate'],
  'communications_lead': ['read', 'write'],
  'observer': ['read']
};
```

## 🎉 **Benefits of Integration**

1. **Unified Experience**: Users stay in one platform
2. **Data Consistency**: Shared user profiles and event data
3. **Workflow Efficiency**: Seamless risk-to-crisis transition
4. **Analytics Integration**: Comprehensive reporting
5. **Scalability**: Leverages existing infrastructure
6. **Maintenance**: Single codebase to maintain

## 🚀 **Next Steps**

1. **Test the current integration** with your live deployment
2. **Replace `CrisisRoomTest`** with `IntegratedDashboard` in `App.js`
3. **Configure environment variables** for full functionality
4. **Add crisis room creation** buttons to event cards
5. **Implement real-time updates** for live crisis management

The Crisis Communications Module is designed to enhance your existing platform, not replace it. It adds powerful crisis management capabilities while maintaining the familiar interface and workflows your users already know. 
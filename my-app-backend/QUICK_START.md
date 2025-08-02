# Quick Start Guide - Crisis Communications Testing

## 🚀 Immediate Setup for Testing

### 1. Install Dependencies

**Backend:**
```bash
cd my-app-backend
npm install
```

**Frontend:**
```bash
cd my-app-frontend
npm install
```

### 2. Set Up Environment

**Backend:**
```bash
cd my-app-backend
cp env.example .env
```

Edit `.env` and set at minimum:
```env
MONGODB_URI=mongodb://localhost:27017/risk-intelligence
NODE_ENV=development
PORT=3001
JWT_SECRET=test-secret-key
```

### 3. Start MongoDB

Make sure MongoDB is running locally:
```bash
# If using MongoDB locally
mongod

# Or if using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Run Backend Test

```bash
cd my-app-backend
npm run test:crisis
```

This will:
- Create test user profile and event
- Create a crisis room
- Send test communications
- Process test responses
- Trigger test escalations
- Display analytics

**Copy the Crisis Room ID from the output!**

### 5. Start Backend Server

```bash
cd my-app-backend
npm run dev
```

### 6. Start Frontend

```bash
cd my-app-frontend
npm start
```

### 7. Test the Frontend

1. Open http://localhost:3000
2. Paste the Crisis Room ID from step 4
3. Click "Load Crisis Room"
4. Explore the crisis communications interface!

## 🧪 What You Can Test

### Crisis Room Features:
- **Overview Tab**: View crisis statistics and recent communications
- **Communications Tab**: Send multi-channel communications (email, SMS, Slack, Teams)
- **Stakeholders Tab**: Manage stakeholder contacts and roles
- **Timeline Tab**: View chronological crisis events
- **Analytics Tab**: View response rates and engagement metrics

### Communication Features:
- Send alerts, updates, escalations, and resolutions
- Multi-channel delivery (email, SMS, Slack, Teams, webhooks)
- Template-based messaging
- Delivery status tracking
- Response processing

### Stakeholder Management:
- Add/update stakeholder contacts
- Set notification preferences
- Configure escalation levels
- Track response times

### Escalation Features:
- Automated escalation based on time thresholds
- Manual escalation triggers
- Escalation level management
- Response tracking

## 🔧 Troubleshooting

### Common Issues:

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Try: `mongod --dbpath /path/to/data/db`

**Backend Won't Start:**
- Check if port 3001 is available
- Verify all dependencies are installed
- Check .env file configuration

**Frontend Can't Connect:**
- Ensure backend is running on port 3001
- Check CORS configuration
- Verify API endpoints are accessible

**Test Script Fails:**
- Check MongoDB connection
- Verify all models are properly imported
- Check console for specific error messages

### Getting Help:

1. Check the console output for error messages
2. Verify all environment variables are set
3. Ensure MongoDB is running and accessible
4. Check that all dependencies are installed

## 📝 Next Steps

After testing the basic functionality:

1. **Add Authentication**: Implement JWT-based user authentication
2. **Configure External Services**: Set up real email, SMS, and webhook services
3. **Add Real Data**: Connect to actual geopolitical event sources
4. **Enhance UI**: Add more interactive features and real-time updates
5. **Production Deployment**: Follow the DEPLOYMENT_GUIDE.md for production setup

## 🎯 Test Scenarios

Try these test scenarios:

1. **Crisis Detection**: Create a high-severity event and watch crisis room creation
2. **Multi-channel Communication**: Send communications via different channels
3. **Escalation Flow**: Trigger escalations and observe the workflow
4. **Response Tracking**: Process stakeholder responses and view analytics
5. **Timeline Review**: Check the timeline for all crisis activities

Happy testing! 🚀 
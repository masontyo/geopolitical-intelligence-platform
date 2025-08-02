# Frontend Testing Guide - End-to-End Testing

This guide provides a comprehensive walkthrough for testing all frontend functionality on the live server. Follow these steps to verify that everything is working correctly.

## 🚀 Prerequisites

Before starting the tests, ensure:

1. **Backend Server is Running**: The backend should be running on `http://localhost:5000`
2. **Frontend is Running**: The React frontend should be running on `http://localhost:3000`
3. **Database is Connected**: MongoDB should be connected and accessible
4. **News API is Configured**: At least one news API key should be set up

## 📋 Test Checklist

- [ ] **User Profile Creation & Management**
- [ ] **Onboarding Flow**
- [ ] **News Feed & Event Processing**
- [ ] **Relevance Scoring**
- [ ] **Analytics Dashboard**
- [ ] **Notifications**
- [ ] **Error Handling**
- [ ] **Responsive Design**

---

## 🧪 Step-by-Step Testing Guide

### **Phase 1: Backend Health Check**

#### 1.1 Verify Backend is Running
```bash
# Test health endpoint
curl http://localhost:5000/health
```
**Expected Result**: `{"status":"OK","timestamp":"...","uptime":...}`

#### 1.2 Test News API Status
```bash
# Check news service status
curl http://localhost:5000/api/status
```
**Expected Result**: 
```json
{
  "success": true,
  "status": {
    "sources": [
      {"name": "newsapi", "enabled": true, "configured": true},
      {"name": "gnews", "enabled": false, "configured": false},
      {"name": "alphavantage", "enabled": false, "configured": false}
    ],
    "configuredSources": 1,
    "enabledSources": 1,
    "hasConfiguredSources": true,
    "hasEnabledSources": true
  }
}
```

#### 1.3 Test News Fetching
```bash
# Test news fetching
curl http://localhost:5000/api/fetch-test
```
**Expected Result**: Should return news articles and processed events

---

### **Phase 2: Frontend Initial Load**

#### 2.1 Open Frontend Application
1. Navigate to `http://localhost:3000` in your browser
2. **Expected Result**: 
   - Page loads without errors
   - No console errors in browser dev tools
   - Loading spinner appears briefly
   - Main application interface is visible

#### 2.2 Check Initial State
1. Open browser developer tools (F12)
2. Check Console tab for any errors
3. Check Network tab for successful API calls
4. **Expected Result**: 
   - No JavaScript errors
   - API calls to backend return 200 status
   - Application loads in initial state

---

### **Phase 3: User Profile Creation**

#### 3.1 Access User Profile Form
1. Look for "Create Profile" or "User Profile" button/link
2. Click to open the profile creation form
3. **Expected Result**: Form opens with all required fields

#### 3.2 Fill Out Profile Information
Fill in the following test data:

**Personal Information:**
- Name: `John Smith`
- Title: `Chief Risk Officer`
- Company: `TechCorp International`
- Industry: `Technology`

**Business Units:**
- Add business unit: `Software Division`
- Description: `Enterprise software solutions`
- Regions: `North America`, `Europe`
- Products: `CRM`, `ERP`, `Analytics Platform`

**Areas of Concern:**
- Category: `Trade Relations`
- Description: `US-China trade tensions and tariffs`
- Priority: `High`

**Geographic Focus:**
- Regions: `North America`, `Europe`, `Asia Pacific`
- Countries: `United States`, `Germany`, `China`, `Japan`

**Risk Preferences:**
- Risk Tolerance: `Medium`
- Notification Preferences: `Email` enabled, `Daily` frequency

#### 3.3 Submit Profile
1. Click "Save Profile" or "Submit"
2. **Expected Result**: 
   - Form submits successfully
   - Success message appears
   - Profile data is saved to database
   - User is redirected to dashboard or profile view

#### 3.4 Verify Profile Creation
1. Check if profile appears in dashboard
2. Look for profile summary or details view
3. **Expected Result**: 
   - Profile information is displayed correctly
   - All entered data is visible
   - Profile can be edited or updated

---

### **Phase 4: Onboarding Flow**

#### 4.1 Start Onboarding Process
1. Look for "Onboarding" or "Get Started" section
2. Click to begin onboarding flow
3. **Expected Result**: Onboarding wizard opens

#### 4.2 Complete Onboarding Steps
Follow the onboarding flow through each step:

**Step 1: Company Information**
- Company Name: `Global Manufacturing Corp`
- Industry: `Manufacturing`
- Company Size: `Large (1000+ employees)`

**Step 2: Business Units**
- Add: `Supply Chain Operations`
- Regions: `Vietnam`, `China`, `Mexico`
- Products: `Consumer Goods`, `Industrial Equipment`

**Step 3: Risk Areas**
- Primary Concern: `Supply Chain Disruptions`
- Secondary Concern: `Regulatory Changes`
- Geographic Focus: `Southeast Asia`

**Step 4: Notification Preferences**
- Email: `Enabled`
- Frequency: `Immediate`
- Risk Level: `Low tolerance`

#### 4.3 Complete Onboarding
1. Review all entered information
2. Click "Complete Setup" or "Finish"
3. **Expected Result**: 
   - Onboarding completes successfully
   - User is taken to main dashboard
   - Profile is created and saved

---

### **Phase 5: News Feed & Event Processing**

#### 5.1 Access News Feed
1. Navigate to "News" or "Events" section
2. **Expected Result**: News feed loads with recent geopolitical events

#### 5.2 Verify News Content
Look for the following elements:
- **Event Cards**: Individual news items displayed as cards
- **Event Details**: Title, description, source, date
- **Relevance Indicators**: Score or relevance level
- **Categories**: Trade, Political, Economic, etc.
- **Severity Levels**: Low, Medium, High, Critical

#### 5.3 Test Event Filtering
1. Look for filter options (if available)
2. Try filtering by:
   - Category (Trade, Political, Economic)
   - Severity (Low, Medium, High)
   - Region (Asia, Europe, North America)
   - Date range
3. **Expected Result**: Events filter correctly based on criteria

#### 5.4 Test Event Details
1. Click on an individual event card
2. **Expected Result**: 
   - Detailed view opens
   - Full article content is displayed
   - Relevance score is shown
   - Related events are suggested

#### 5.5 Verify Real-time Updates
1. Refresh the news feed
2. **Expected Result**: 
   - New events may appear
   - Timestamps are recent
   - Content is current

---

### **Phase 6: Relevance Scoring**

#### 6.1 Check Relevance Scores
1. Look for relevance scores on event cards
2. **Expected Result**: 
   - Scores are displayed (0.0 to 1.0)
   - Higher scores for more relevant events
   - Scores are calculated based on user profile

#### 6.2 Test Score Accuracy
1. Look for events that should be highly relevant to your profile
2. **Expected Result**: 
   - Events matching your business units have higher scores
   - Events in your regions of concern have higher scores
   - Events matching your areas of concern have higher scores

#### 6.3 Verify Score Distribution
1. Check multiple events
2. **Expected Result**: 
   - Scores vary appropriately
   - Not all events have the same score
   - Scores reflect actual relevance

---

### **Phase 7: Analytics Dashboard**

#### 7.1 Access Analytics
1. Navigate to "Analytics" or "Dashboard" section
2. **Expected Result**: Analytics dashboard loads with charts and metrics

#### 7.2 Check Key Metrics
Look for the following analytics:

**Risk Metrics:**
- Total events processed
- High-risk events count
- Risk trend over time
- Geographic risk distribution

**Relevance Analytics:**
- Average relevance score
- Score distribution chart
- Top relevant events
- Category breakdown

**Geographic Analysis:**
- Risk map or geographic visualization
- Regional risk levels
- Country-specific metrics

#### 7.3 Test Chart Interactions
1. Click on chart elements (if interactive)
2. Hover over data points
3. **Expected Result**: 
   - Charts are interactive
   - Tooltips show detailed information
   - Data is accurate and current

---

### **Phase 8: Notifications**

#### 8.1 Check Notification Settings
1. Look for notification preferences
2. **Expected Result**: 
   - Email notifications can be enabled/disabled
   - Frequency can be adjusted
   - Risk thresholds can be set

#### 8.2 Test Notification Triggers
1. Create a high-relevance event (if possible)
2. **Expected Result**: 
   - Notification is sent (check email)
   - In-app notification appears
   - Notification settings are respected

---

### **Phase 9: Error Handling**

#### 9.1 Test Network Errors
1. Disconnect internet temporarily
2. Try to perform actions
3. **Expected Result**: 
   - Graceful error messages
   - Retry options available
   - No application crashes

#### 9.2 Test Invalid Input
1. Try submitting forms with invalid data
2. **Expected Result**: 
   - Validation errors are displayed
   - Form doesn't submit
   - Clear error messages

#### 9.3 Test API Errors
1. Stop the backend server temporarily
2. Try to perform actions
3. **Expected Result**: 
   - Connection error messages
   - Retry mechanisms
   - Graceful degradation

---

### **Phase 10: Responsive Design**

#### 10.1 Test Mobile View
1. Open browser dev tools
2. Toggle device toolbar
3. Test on mobile viewport sizes
4. **Expected Result**: 
   - Layout adapts to mobile
   - Touch interactions work
   - Text is readable

#### 10.2 Test Tablet View
1. Test on tablet viewport sizes
2. **Expected Result**: 
   - Layout adapts appropriately
   - Navigation works correctly
   - Content is well-organized

#### 10.3 Test Different Browsers
1. Test in Chrome, Firefox, Safari, Edge
2. **Expected Result**: 
   - Consistent appearance
   - All functionality works
   - No browser-specific issues

---

## 🎯 Success Criteria

### **All Tests Pass When:**
- ✅ Backend responds to all API calls
- ✅ Frontend loads without errors
- ✅ User profiles can be created and managed
- ✅ News feed displays real geopolitical events
- ✅ Relevance scoring works accurately
- ✅ Analytics dashboard shows meaningful data
- ✅ Notifications function properly
- ✅ Error handling is graceful
- ✅ Design is responsive across devices

### **Performance Expectations:**
- Page load time: < 3 seconds
- API response time: < 2 seconds
- Smooth interactions with no lag
- Responsive UI updates

---

## 🔧 Troubleshooting

### **Common Issues:**

**Backend Not Responding:**
- Check if server is running on port 5000
- Verify MongoDB connection
- Check console for error messages

**Frontend Not Loading:**
- Verify React app is running on port 3000
- Check browser console for errors
- Clear browser cache

**News API Issues:**
- Verify API keys are set in .env file
- Check API rate limits
- Test API endpoints directly

**Database Issues:**
- Verify MongoDB connection string
- Check database permissions
- Ensure collections exist

---

## 📊 Test Results Template

Use this template to document your test results:

```markdown
## Test Results - [Date]

### Backend Health
- [ ] Health endpoint: ✅/❌
- [ ] News API status: ✅/❌
- [ ] News fetching: ✅/❌

### Frontend Functionality
- [ ] Initial load: ✅/❌
- [ ] User profile creation: ✅/❌
- [ ] Onboarding flow: ✅/❌
- [ ] News feed: ✅/❌
- [ ] Relevance scoring: ✅/❌
- [ ] Analytics dashboard: ✅/❌
- [ ] Notifications: ✅/❌

### Error Handling
- [ ] Network errors: ✅/❌
- [ ] Invalid input: ✅/❌
- [ ] API errors: ✅/❌

### Responsive Design
- [ ] Mobile view: ✅/❌
- [ ] Tablet view: ✅/❌
- [ ] Cross-browser: ✅/❌

### Performance
- [ ] Page load time: ✅/❌
- [ ] API response time: ✅/❌
- [ ] UI responsiveness: ✅/❌

### Issues Found:
1. [Description of issue]
2. [Description of issue]

### Recommendations:
1. [Recommendation]
2. [Recommendation]
```

---

## 🚀 Next Steps

After completing the tests:

1. **Document Results**: Use the test results template above
2. **Report Issues**: Create detailed bug reports for any failures
3. **Performance Analysis**: Note any performance issues
4. **User Experience**: Document UX improvements needed
5. **Security Review**: Verify no security vulnerabilities
6. **Accessibility**: Test with screen readers and keyboard navigation

This comprehensive testing ensures your geopolitical intelligence platform is ready for production use! 
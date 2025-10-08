# 🚀 Local Development Guide

## ✅ **Prerequisites Verified**
- ✅ Node.js installed
- ✅ MongoDB Atlas connection configured
- ✅ Backend dependencies installed (bcryptjs, cookie-parser, JWT, etc.)
- ✅ Frontend dependencies installed (React, MUI, Axios, Leaflet, etc.)
- ✅ Environment variables configured

---

## 🎯 **Daily Development Workflow**

### **Step 1: Start Backend Server**

Open **Terminal 1** (PowerShell or Command Prompt):

```powershell
cd D:\Projects\geopolitical-intelligence-platform\my-app-backend
npm run dev
```

**Expected Output:**
```
Server running on port 3001
Environment: development
✅ MongoDB Connected: ac-kvlkbjd-shard-00-00.xwxx76q.mongodb.net
📋 Using full onboarding routes
```

**Backend will be available at:** `http://localhost:3001`

---

### **Step 2: Start Frontend Server**

Open **Terminal 2** (separate window):

```powershell
cd D:\Projects\geopolitical-intelligence-platform\my-app-frontend
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view my-app-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

**Frontend will automatically open at:** `http://localhost:3000`

---

## 🔐 **Testing Authentication Flow**

### **1. Register a Test User**
1. Go to `http://localhost:3000`
2. Click "Start Testing" or "Create Account"
3. Enter test credentials:
   - Email: `test@example.com`
   - Password: `test123`
4. Click "Create Account"

### **2. Verify Login Works**
1. Logout (if logged in)
2. Click "Sign In"
3. Enter same credentials
4. Should redirect to onboarding

### **3. Complete Onboarding**
1. Fill in company information
2. Add suppliers with addresses
3. Add ports and routes
4. Complete onboarding
5. Should redirect to dashboard

### **4. Verify Dashboard**
1. Should see personalized map with your data
2. Suppliers, ports, and routes should appear
3. User email should show in header

---

## 🛠️ **Development Features**

### **Hot Reload (Auto-Refresh)**
- **Frontend**: Changes to React files reload instantly
- **Backend**: Nodemon restarts server when you save files
- **No need to restart manually!**

### **Debugging**
- **Frontend**: Open browser DevTools (F12)
  - Console tab: See React errors and logs
  - Network tab: See API calls
  - Application tab: See localStorage and cookies

- **Backend**: Terminal shows all logs
  - API requests logged by Morgan
  - Console.log outputs appear here
  - Error stack traces visible

### **Database Access**
- **MongoDB Atlas Dashboard**: https://cloud.mongodb.com
- **Database Name**: `risk-intelligence`
- **Collections**:
  - `users` - Authentication data
  - `useronboardings` - Onboarding data
  - `geopoliticalevents` - Events data

---

## 🔧 **Common Commands**

### **Backend Commands**
```powershell
cd my-app-backend

# Start development server (auto-restart)
npm run dev

# Start production server
npm start

# Run tests
npm test

# Check for errors
npm run lint
```

### **Frontend Commands**
```powershell
cd my-app-frontend

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

---

## 🌐 **API Testing**

### **Test API Endpoints Directly**

You can test backend APIs using:
1. **Browser** (for GET requests)
2. **Postman** (recommended)
3. **curl** (command line)
4. **Thunder Client** (VS Code extension)

### **Example: Test Health Check**
```powershell
# In browser or curl
curl http://localhost:3001/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-10-08T...",
  "uptime": 123.45,
  "environment": "development"
}
```

### **Example: Test Registration**
```powershell
curl -X POST http://localhost:3001/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"test123"}'
```

---

## 🤖 **LLM & External API Integration**

### **YES, You Can Make External API Calls!**

All external APIs work perfectly in local development:

#### **1. OpenAI API (for LLM algorithms)**
```javascript
// In backend: services/aiIntelligenceService.js
const openai = require('openai');
const client = new openai.OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Make LLM calls
const response = await client.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: "Analyze this risk..." }]
});
```

#### **2. News APIs**
- NewsAPI.org ✅
- GNews API ✅
- Bing News ✅
- All configured in `.env`

#### **3. Geocoding APIs**
- Nominatim (OpenStreetMap) ✅
- Google Maps API (if you add it) ✅

#### **4. Communication APIs**
- Twilio (SMS) ✅
- Nodemailer (Email) ✅
- Slack Webhooks ✅

**All API keys are in your `.env` file and work locally!**

---

## 📊 **Environment Variables**

### **Backend (.env location)**
```
D:\Projects\geopolitical-intelligence-platform\my-app-backend\.env
```

### **Key Variables:**
```env
# Database
MONGODB_URI=mongodb+srv://...

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# External APIs
OPENAI_API_KEY=your-openai-api-key
NEWSAPI_KEY=00a28673b0414caabfadd792f7d0b7f8

# Server
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### **Frontend Environment Variables (if needed)**
Create `my-app-frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:3001
```

---

## 🐛 **Troubleshooting**

### **Backend Won't Start**
```powershell
# Check if port 3001 is in use
netstat -ano | findstr :3001

# Kill process if needed (replace PID)
taskkill /PID <PID> /F

# Reinstall dependencies
npm install
```

### **Frontend Won't Start**
```powershell
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Clear cache and reinstall
rm -r node_modules
npm install
```

### **MongoDB Connection Error**
- Check internet connection
- Verify `.env` file exists in `my-app-backend`
- Check MongoDB Atlas whitelist (should allow all IPs: `0.0.0.0/0`)

### **CORS Errors**
- Make sure backend is running on `localhost:3001`
- Make sure frontend is running on `localhost:3000`
- Check browser console for specific error

### **Authentication Not Working**
- Clear browser cookies and localStorage
- Check that both servers are running
- Verify JWT secrets are set in `.env`

---

## 📝 **Git Workflow with Local Development**

### **New Feature Development**
```powershell
# 1. Make changes in your editor
# 2. Test locally (both servers running)
# 3. Verify everything works
# 4. When satisfied, commit:

git add .
git commit -m "Add new feature: description"
git push origin main
```

### **Only Push When:**
- ✅ Feature is fully tested locally
- ✅ No console errors
- ✅ Authentication works
- ✅ Database operations succeed
- ✅ UI looks correct

---

## 🎯 **Next Steps**

### **Immediate:**
1. ✅ Start both servers
2. ✅ Create test user
3. ✅ Complete onboarding flow
4. ✅ Verify dashboard loads

### **For LLM Integration:**
1. Add OpenAI API key to `.env`
2. Create LLM service in `services/llmService.js`
3. Test locally with sample data
4. Integrate into risk scoring

### **For Additional Features:**
1. Develop locally
2. Test thoroughly
3. Commit when working
4. Deploy automatically

---

## 💡 **Pro Tips**

1. **Keep Both Terminals Open**: You'll see errors immediately
2. **Use Browser DevTools**: F12 is your friend
3. **Check Network Tab**: See all API calls and responses
4. **Use Console.log**: Debug anywhere in your code
5. **MongoDB Compass**: Visual tool for database inspection
6. **VS Code Extensions**:
   - Thunder Client (API testing)
   - MongoDB for VS Code
   - ESLint
   - Prettier

---

## 🚀 **You're Ready!**

Everything is set up and verified. You can now:
- ✅ Develop locally with instant feedback
- ✅ Make external API calls (OpenAI, News APIs, etc.)
- ✅ Test authentication and database operations
- ✅ Debug easily with full console access
- ✅ Only push to production when ready

**Start both servers and begin developing!** 🎉

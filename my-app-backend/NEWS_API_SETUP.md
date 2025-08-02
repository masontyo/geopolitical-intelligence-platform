# News API Setup Guide

This guide will help you set up the news API functions to fetch real geopolitical events.

## 🚀 Quick Start

### Step 1: Get API Keys

Choose one or more news APIs (we recommend starting with NewsAPI.org):

#### Option 1: NewsAPI.org (Recommended)
1. Go to https://newsapi.org/
2. Sign up for a free account
3. Get your API key
4. Free tier: 1,000 requests/day

#### Option 2: GNews API
1. Go to https://gnews.io/
2. Sign up for a free account
3. Get your API key
4. Free tier: 100 requests/day

#### Option 3: Alpha Vantage
1. Go to https://www.alphavantage.co/
2. Sign up for a free account
3. Get your API key
4. Free tier: 500 requests/day

### Step 2: Set Up Environment Variables

Create a `.env` file in your project root with the following content:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/geopolitical-intelligence

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# News API Keys (set at least one)
NEWSAPI_KEY=your-newsapi-key-here
GNEWS_API_KEY=your-gnews-api-key-here
ALPHA_VANTAGE_API_KEY=your-alpha-vantage-key-here

# Optional: Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@geopolitical-intelligence.com

# Optional: Additional configuration
LOG_LEVEL=info
```

### Step 3: Test Your Setup

Run the test script to verify your setup:

```bash
node test-news-api.js
```

Or test via the API endpoint:

```bash
curl http://localhost:3001/api/news/fetch-test
```

## 🔧 API Endpoints

Once set up, you can use these endpoints:

### Test News Fetching
```bash
GET /api/news/fetch-test
```
Tests news fetching without database operations.

### Get Latest News
```bash
GET /api/news/latest?limit=20
```
Fetches the latest news articles.

### Update News and Process Events
```bash
GET /api/news/update
```
Fetches news, processes them into events, and saves to database.

### Test News Service
```bash
GET /api/news/test
```
Runs comprehensive news service tests.

## 📊 What the News Service Does

1. **Fetches News**: Gets articles from configured news APIs
2. **Analyzes Content**: Extracts geopolitical relevance, categories, severity
3. **Processes Events**: Converts news articles into structured geopolitical events
4. **Saves to Database**: Stores processed events for user relevance scoring
5. **Sends Notifications**: Alerts users about relevant events

## 🎯 Geopolitical Keywords Monitored

The service automatically monitors for these geopolitical keywords:
- Sanctions, trade war, tariffs, embargo
- Political instability, regime change, elections
- Military conflict, border disputes, territorial issues
- Cyber attacks, espionage, hacking
- Supply chain disruptions, logistics issues
- Economic crises, currency issues, inflation
- Regulatory changes, policy changes

## 🔍 Troubleshooting

### No News Services Enabled
**Error**: "No news services are enabled"
**Solution**: Set at least one API key in your `.env` file

### API Rate Limit Exceeded
**Error**: "Rate limit exceeded" or "Too many requests"
**Solution**: 
- Wait for rate limit reset
- Upgrade to paid tier
- Use multiple API providers

### Network Issues
**Error**: "Network error" or "Request timeout"
**Solution**:
- Check internet connection
- Verify API endpoints are accessible
- Check firewall settings

### Invalid API Key
**Error**: "Unauthorized" or "Invalid API key"
**Solution**:
- Verify API key is correct
- Check if API key is active
- Ensure proper formatting

## 🧪 Testing with Real Events

Once your news API is working, you can:

1. **Test Event Processing**:
   ```bash
   curl http://localhost:3001/api/news/fetch-test
   ```

2. **Create User Profiles** and test relevance scoring with real events

3. **Monitor Real-time Updates** by calling the update endpoint periodically

4. **Test Notifications** by setting up email configuration

## 📈 Next Steps

1. Set up your API keys
2. Test the news fetching
3. Create user profiles to test relevance scoring
4. Set up notifications (optional)
5. Deploy and monitor real-world usage

## 🔗 Useful Links

- [NewsAPI.org Documentation](https://newsapi.org/docs)
- [GNews API Documentation](https://gnews.io/docs)
- [Alpha Vantage Documentation](https://www.alphavantage.co/documentation/)
- [Project Documentation](./docs/)

## 💡 Tips

- Start with NewsAPI.org as it has the most generous free tier
- Use multiple APIs for redundancy and better coverage
- Monitor your API usage to avoid rate limits
- Test with different geopolitical keywords to ensure good coverage
- Consider setting up automated news updates for production use 
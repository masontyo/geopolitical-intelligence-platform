# Social Media API Setup Guide

This guide walks you through setting up social media APIs to enhance your geopolitical intelligence platform with real-time social media monitoring.

## 🐦 **Twitter/X API Setup**

### 1. Apply for Twitter Developer Account
1. Go to [developer.twitter.com](https://developer.twitter.com)
2. Sign in with your Twitter account
3. Apply for a developer account (free tier available)
4. Complete the application form explaining your use case

### 2. Create a Twitter App
1. Go to [developer.twitter.com/en/portal/dashboard](https://developer.twitter.com/en/portal/dashboard)
2. Click "Create App"
3. Fill in app details:
   - App name: "Geopolitical Intelligence Platform"
   - App description: "Real-time geopolitical event monitoring"
   - Website: Your website URL
   - Use case: "Academic research and business intelligence"

### 3. Get API Keys
1. Go to your app's "Keys and tokens" tab
2. Generate API Key and Secret
3. Generate Bearer Token
4. Add to your `.env` file:
   ```
   TWITTER_API_KEY=your_api_key_here
   TWITTER_API_SECRET=your_api_secret_here
   TWITTER_BEARER_TOKEN=your_bearer_token_here
   ```

### 4. Twitter API v2 Features
- **Search Tweets**: Real-time tweet search
- **Rate Limits**: 300 requests/15min (free), 1,500 requests/15min (paid)
- **Cost**: Free tier available, paid plans from $100/month

## 🔴 **Reddit API Setup**

### 1. Create Reddit App
1. Go to [reddit.com/prefs/apps](https://reddit.com/prefs/apps)
2. Click "Create App" or "Create Another App"
3. Fill in details:
   - Name: "Geopolitical Intelligence Bot"
   - App type: "script"
   - Description: "Geopolitical event monitoring"
   - About URL: Your website URL
   - Redirect URI: `http://localhost:8080`

### 2. Get Credentials
1. Note down the client ID (under the app name)
2. Note down the client secret
3. Add to your `.env` file:
   ```
   REDDIT_CLIENT_ID=your_client_id_here
   REDDIT_CLIENT_SECRET=your_client_secret_here
   ```

### 3. Reddit API Features
- **Subreddit Access**: Monitor specific subreddits
- **Rate Limits**: 60 requests/minute
- **Cost**: Free
- **Data Quality**: High-quality discussions and analysis

## 💼 **LinkedIn API Setup**

### 1. Create LinkedIn App
1. Go to [linkedin.com/developers](https://linkedin.com/developers)
2. Click "Create App"
3. Fill in app details:
   - App name: "Geopolitical Intelligence"
   - LinkedIn Page: Your company page
   - Privacy Policy URL: Your privacy policy
   - App logo: Upload a logo

### 2. Get Credentials
1. Go to "Auth" tab
2. Note down Client ID and Client Secret
3. Add to your `.env` file:
   ```
   LINKEDIN_CLIENT_ID=your_client_id_here
   LINKEDIN_CLIENT_SECRET=your_client_secret_here
   ```

### 3. LinkedIn API Features
- **Company Updates**: Monitor company posts
- **Professional Content**: High-quality business insights
- **Rate Limits**: 100 requests/day (free)
- **Cost**: Free tier available

## 📺 **YouTube API Setup**

### 1. Enable YouTube Data API
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable YouTube Data API v3
4. Go to "Credentials" → "Create Credentials" → "API Key"

### 2. Get API Key
1. Copy the generated API key
2. Add to your `.env` file:
   ```
   YOUTUBE_API_KEY=your_api_key_here
   ```

### 3. YouTube API Features
- **Video Search**: Search for news videos
- **Channel Monitoring**: Monitor specific news channels
- **Rate Limits**: 10,000 requests/day (free)
- **Cost**: Free tier available

## 📱 **Telegram Bot Setup**

### 1. Create Telegram Bot
1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot` command
3. Follow prompts to create your bot
4. Get the bot token

### 2. Get Bot Token
1. Copy the bot token from BotFather
2. Add to your `.env` file:
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   ```

### 3. Telegram Features
- **Channel Monitoring**: Monitor news channels
- **Real-time Updates**: Instant notifications
- **Rate Limits**: 30 messages/second
- **Cost**: Free

## 🔧 **Implementation Steps**

### 1. Install Dependencies
```bash
npm install axios buffer
```

### 2. Update Environment Variables
Copy the example environment file:
```bash
cp env.social.example .env
```

Fill in your API keys in the `.env` file.

### 3. Update Your News Service
Replace your existing news service with the enhanced version:
```javascript
const enhancedNewsService = require('./services/enhancedNewsService');
```

### 4. Test the Integration
```javascript
// Test social media fetching
const socialContent = await enhancedNewsService.fetchSocialMediaContent();
console.log(`Fetched ${socialContent.length} social media items`);

// Test all sources
const allContent = await enhancedNewsService.fetchAllSources();
console.log(`Fetched ${allContent.length} total content items`);
```

## 📊 **API Comparison**

| Platform | Cost | Rate Limits | Data Quality | Real-time | Setup Difficulty |
|----------|------|-------------|--------------|-----------|------------------|
| Twitter | Free/Paid | 300/15min | High | Yes | Medium |
| Reddit | Free | 60/min | Very High | Yes | Easy |
| LinkedIn | Free | 100/day | Very High | No | Medium |
| YouTube | Free | 10k/day | High | No | Easy |
| Telegram | Free | 30/sec | Medium | Yes | Easy |

## 🚀 **Advanced Features**

### 1. Real-time Streaming (Twitter)
```javascript
// Set up Twitter streaming for real-time updates
const stream = twitterClient.stream('tweets/search/stream', {
  'tweet.fields': 'created_at,author_id,public_metrics'
});
```

### 2. Reddit WebSocket Monitoring
```javascript
// Monitor Reddit for real-time posts
const redditStream = new RedditStream({
  subreddits: ['worldnews', 'geopolitics'],
  interval: 30000 // Check every 30 seconds
});
```

### 3. YouTube Live Stream Monitoring
```javascript
// Monitor YouTube for live news streams
const liveStreams = await youtube.search.list({
  part: 'snippet',
  eventType: 'live',
  type: 'video',
  q: 'breaking news'
});
```

## 🔒 **Security Best Practices**

1. **Never commit API keys** to version control
2. **Use environment variables** for all credentials
3. **Rotate API keys** regularly
4. **Monitor usage** to avoid rate limits
5. **Implement error handling** for API failures
6. **Cache responses** to reduce API calls

## 📈 **Monitoring & Analytics**

### 1. Track API Usage
```javascript
const apiUsage = {
  twitter: { requests: 0, errors: 0 },
  reddit: { requests: 0, errors: 0 },
  youtube: { requests: 0, errors: 0 }
};
```

### 2. Monitor Rate Limits
```javascript
const rateLimitStatus = {
  twitter: { remaining: 300, resetTime: Date.now() + 900000 },
  reddit: { remaining: 60, resetTime: Date.now() + 60000 }
};
```

### 3. Content Quality Metrics
```javascript
const qualityMetrics = {
  totalContent: 0,
  geopoliticalContent: 0,
  highEngagementContent: 0,
  verifiedSources: 0
};
```

## 🎯 **Next Steps**

1. **Start with Reddit** - Easiest to set up and highest data quality
2. **Add Twitter** - Best for real-time breaking news
3. **Integrate YouTube** - Good for video content and live streams
4. **Consider LinkedIn** - Professional insights and business impact
5. **Implement Telegram** - Real-time notifications and alerts

This enhanced social media integration will significantly improve your event discovery capabilities and provide more comprehensive geopolitical intelligence.

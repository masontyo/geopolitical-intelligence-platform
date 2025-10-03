require('dotenv').config();
const axios = require('axios');
const GeopoliticalEvent = require('../models/GeopoliticalEvent');
const notificationService = require('./notificationService');

class EnhancedNewsService {
  constructor() {
    // Rate limiting tracking
    this.lastFetchTimes = {
      gnews: 0,
      twitter: 0,
      newsapi: 0
    };
    this.rateLimits = {
      gnews: 60000, // 1 minute
      twitter: 300000, // 5 minutes
      newsapi: 60000 // 1 minute
    };

    // Traditional News Sources
    this.newsSources = {
      newsapi: {
        baseUrl: 'https://newsapi.org/v2',
        apiKey: process.env.NEWSAPI_KEY,
        enabled: !!process.env.NEWSAPI_KEY
      },
      gnews: {
        baseUrl: 'https://gnews.io/api/v4',
        apiKey: process.env.GNEWS_API_KEY,
        enabled: !!process.env.GNEWS_API_KEY
      },
      alphavantage: {
        baseUrl: 'https://www.alphavantage.co/query',
        apiKey: process.env.ALPHA_VANTAGE_API_KEY,
        enabled: !!process.env.ALPHA_VANTAGE_API_KEY
      },
      newsdata: {
        baseUrl: 'https://newsdata.io/api/1/news',
        apiKey: process.env.NEWSDATA_API_KEY,
        enabled: !!process.env.NEWSDATA_API_KEY
      },
      bing: {
        baseUrl: 'https://api.bing.microsoft.com/v7.0/news/search',
        apiKey: process.env.BING_API_KEY,
        enabled: !!process.env.BING_API_KEY
      }
    };

    // Social Media Sources
    this.socialSources = {
      twitter: {
        baseUrl: 'https://api.twitter.com/2',
        apiKey: process.env.TWITTER_API_KEY,
        apiSecret: process.env.TWITTER_API_SECRET,
        bearerToken: process.env.TWITTER_BEARER_TOKEN,
        enabled: !!(process.env.TWITTER_API_KEY && process.env.TWITTER_API_SECRET)
      },
      reddit: {
        baseUrl: 'https://oauth.reddit.com',
        clientId: process.env.REDDIT_CLIENT_ID,
        clientSecret: process.env.REDDIT_CLIENT_SECRET,
        userAgent: 'GeopoliticalIntelligence/1.0',
        enabled: !!(process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET)
      },
      linkedin: {
        baseUrl: 'https://api.linkedin.com/v2',
        clientId: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        enabled: !!(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET)
      },
      telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN,
        enabled: !!process.env.TELEGRAM_BOT_TOKEN
      }
    };

    // Enhanced keyword sets for social media
    this.geopoliticalKeywords = [
      // Traditional terms
      'sanctions', 'trade war', 'tariffs', 'embargo', 'political instability',
      'regime change', 'election', 'protest', 'civil unrest', 'military conflict',
      'border dispute', 'territorial', 'diplomatic', 'treaty', 'alliance',
      'nuclear', 'missile', 'cyber attack', 'hacking', 'espionage',
      'supply chain', 'logistics', 'shipping', 'ports', 'trade route',
      'currency', 'inflation', 'economic crisis', 'recession', 'market crash',
      'regulation', 'policy change', 'legislation', 'compliance', 'enforcement',
      
      // Social media specific terms
      'breaking', 'urgent', 'alert', 'crisis', 'emergency', 'developing',
      'just in', 'reports', 'sources say', 'exclusive', 'confirmed',
      'denied', 'statement', 'announcement', 'declaration', 'warning',
      'threat', 'escalation', 'tension', 'conflict', 'dispute',
      'negotiation', 'talks', 'meeting', 'summit', 'conference'
    ];

    // Hashtags for social media monitoring
    this.geopoliticalHashtags = [
      '#geopolitics', '#breaking', '#news', '#politics', '#worldnews',
      '#international', '#diplomacy', '#trade', '#economy', '#security',
      '#cybersecurity', '#supplychain', '#sanctions', '#tradewar',
      '#china', '#russia', '#ukraine', '#middleeast', '#asia',
      '#europe', '#america', '#global', '#crisis', '#alert'
    ];

    // Subreddits for Reddit monitoring
    this.redditSubreddits = [
      'worldnews', 'geopolitics', 'politics', 'news', 'intelligence',
      'supplychain', 'cybersecurity', 'business', 'economics',
      'china', 'russia', 'ukraine', 'middleeast', 'europe'
    ];


    // Telegram channels for news monitoring
    this.telegramChannels = [
      '@BBCBreaking', '@CNNBreaking', '@Reuters', '@AP', '@AFP',
      '@DWBreaking', '@AlJazeera', '@RTBreaking', '@SkyNewsBreak'
    ];
  }

  /**
   * Fetch from all sources (news + social media)
   */
  async fetchAllSources() {
    const allContent = [];
    
    try {
      // Fetch traditional news
      const newsContent = await this.fetchLatestNews();
      allContent.push(...newsContent);

      // Fetch social media content
      const socialContent = await this.fetchSocialMediaContent();
      allContent.push(...socialContent);

      console.log(`Fetched ${allContent.length} total content items`);
      return allContent;
      
    } catch (error) {
      console.error('Error fetching from all sources:', error);
      return [];
    }
  }

  /**
   * Fetch from traditional news sources
   */
  async fetchLatestNews() {
    const allNews = [];
    
    try {
      // Fetch from NewsAPI
      if (this.newsSources.newsapi.enabled) {
        const newsapiNews = await this.fetchFromNewsAPI();
        allNews.push(...newsapiNews);
      }
      
      // Fetch from GNews
      if (this.newsSources.gnews.enabled) {
        const gnewsNews = await this.fetchFromGNews();
        allNews.push(...gnewsNews);
      }
      
      // Fetch from other news sources...
      // (existing implementation)
      
      return allNews;
      
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

  /**
   * Fetch from social media sources
   */
  async fetchSocialMediaContent() {
    const allSocialContent = [];
    
    try {
      // Fetch from Twitter
      if (this.socialSources.twitter.enabled) {
        const twitterContent = await this.fetchFromTwitter();
        allSocialContent.push(...twitterContent);
      }

      // Fetch from Reddit
      if (this.socialSources.reddit.enabled) {
        const redditContent = await this.fetchFromReddit();
        allSocialContent.push(...redditContent);
      }


      // Fetch from LinkedIn
      if (this.socialSources.linkedin.enabled) {
        const linkedinContent = await this.fetchFromLinkedIn();
        allSocialContent.push(...linkedinContent);
      }

      return allSocialContent;
      
    } catch (error) {
      console.error('Error fetching social media content:', error);
      return [];
    }
  }

  /**
   * Fetch from Twitter API v2
   */
  async fetchFromTwitter() {
    try {
      // Check if Twitter credentials are available
      if (!this.socialSources.twitter.bearerToken) {
        console.warn('Twitter Bearer Token not configured, skipping Twitter fetch');
        return [];
      }

      // Rate limiting check (Twitter has strict limits)
      const now = Date.now();
      if (now - this.lastFetchTimes.twitter < this.rateLimits.twitter) {
        console.log('Twitter rate limited, skipping fetch');
        return [];
      }

      const query = this.buildTwitterQuery();
      
      const response = await axios.get(`${this.socialSources.twitter.baseUrl}/tweets/search/recent`, {
        params: {
          query: query,
          max_results: 10, // Reduced from 100 to avoid rate limits
          'tweet.fields': 'created_at,author_id,public_metrics',
          'user.fields': 'name,username',
          expansions: 'author_id'
        },
        headers: {
          'Authorization': `Bearer ${this.socialSources.twitter.bearerToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      if (!response.data || !response.data.data) {
        console.warn('Twitter returned no data');
        return [];
      }

      const tweets = response.data.data.map(tweet => ({
        id: tweet.id,
        title: tweet.text.substring(0, 200) + (tweet.text.length > 200 ? '...' : ''),
        description: tweet.text,
        content: tweet.text,
        url: `https://twitter.com/i/web/status/${tweet.id}`,
        source: {
          name: 'Twitter',
          url: `https://twitter.com/i/web/status/${tweet.id}`,
          reliability: 'medium'
        },
        publishedAt: tweet.created_at,
        author: tweet.author_id,
        socialMetrics: {
          retweets: tweet.public_metrics?.retweet_count || 0,
          likes: tweet.public_metrics?.like_count || 0,
          replies: tweet.public_metrics?.reply_count || 0
        },
        platform: 'twitter',
        type: 'social_media'
      }));

      // Update last fetch time
      this.lastFetchTimes.twitter = now;
      
      return tweets;

    } catch (error) {
      if (error.response?.status === 401) {
        console.error('Twitter API Error (401): Invalid Bearer Token');
      } else if (error.response?.status === 429) {
        console.error('Twitter API Error (429): Rate limit exceeded - Twitter has strict rate limits');
      } else if (error.response?.status === 400) {
        console.error('Twitter API Error (400): Invalid request parameters');
      } else {
        console.error('Error fetching from Twitter:', error.message);
      }
      return [];
    }
  }

  /**
   * Build Twitter search query
   */
  buildTwitterQuery() {
    const keywords = this.geopoliticalKeywords.slice(0, 10).join(' OR ');
    const hashtags = this.geopoliticalHashtags.slice(0, 5).join(' OR ');
    return `(${keywords}) OR (${hashtags}) -is:retweet lang:en`;
  }

  /**
   * Fetch from Reddit API
   */
  async fetchFromReddit() {
    try {
      // First, get access token
      const tokenResponse = await axios.post('https://www.reddit.com/api/v1/access_token', 
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${this.socialSources.reddit.clientId}:${this.socialSources.reddit.clientSecret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': this.socialSources.reddit.userAgent
          }
        }
      );

      const accessToken = tokenResponse.data.access_token;
      const allRedditContent = [];

      // Fetch from each subreddit
      for (const subreddit of this.redditSubreddits.slice(0, 5)) {
        try {
          const response = await axios.get(`${this.socialSources.reddit.baseUrl}/r/${subreddit}/hot`, {
            params: {
              limit: 25,
              raw_json: 1
            },
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'User-Agent': this.socialSources.reddit.userAgent
            }
          });

          const posts = response.data.data.children.map(post => ({
            id: post.data.id,
            title: post.data.title,
            description: post.data.selftext?.substring(0, 300) || post.data.title,
            content: post.data.selftext || post.data.title,
            url: `https://reddit.com${post.data.permalink}`,
            source: {
              name: `Reddit r/${subreddit}`,
              url: `https://reddit.com${post.data.permalink}`,
              reliability: 'medium'
            },
            publishedAt: new Date(post.data.created_utc * 1000).toISOString(),
            author: post.data.author,
            socialMetrics: {
              upvotes: post.data.ups,
              downvotes: post.data.downs,
              comments: post.data.num_comments,
              score: post.data.score
            },
            platform: 'reddit',
            type: 'social_media',
            subreddit: subreddit
          }));

          allRedditContent.push(...posts);
        } catch (subredditError) {
          console.error(`Error fetching from r/${subreddit}:`, subredditError.message);
        }
      }

      return allRedditContent;

    } catch (error) {
      console.error('Error fetching from Reddit:', error.message);
      return [];
    }
  }


  /**
   * Fetch from LinkedIn API
   */
  async fetchFromLinkedIn() {
    try {
      // Check if we have a valid access token
      if (!process.env.LINKEDIN_ACCESS_TOKEN || process.env.LINKEDIN_ACCESS_TOKEN === 'your_linkedin_access_token_here') {
        console.log('LinkedIn: No valid access token configured');
        return [];
      }

      // LinkedIn API requires OAuth 2.0 flow
      // This is a simplified example - you'd need to implement full OAuth
      const response = await axios.get(`${this.socialSources.linkedin.baseUrl}/shares`, {
        params: {
          q: 'owners',
          owners: 'urn:li:organization:123456789', // Your organization URN
          count: 50
        },
        headers: {
          'Authorization': `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.elements?.map(share => ({
        id: share.id,
        title: share.text?.substring(0, 200) || 'LinkedIn Post',
        description: share.text?.substring(0, 300) || share.text,
        content: share.text,
        url: share.permalink,
        source: {
          name: 'LinkedIn',
          url: share.permalink,
          reliability: 'high'
        },
        publishedAt: share.created?.time || new Date().toISOString(),
        author: share.author,
        platform: 'linkedin',
        type: 'professional_content'
      })) || [];

    } catch (error) {
      console.error('Error fetching from LinkedIn:', error.message);
      return [];
    }
  }

  /**
   * Generate LinkedIn OAuth URL
   */
  generateLinkedInOAuthURL() {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:3001/auth/linkedin/callback';
    const state = Math.random().toString(36).substring(7);
    
    const scopes = [
      'r_liteprofile',
      'r_organization_social',
      'r_member_social',
      'r_organization_content'
    ].join('%20');
    
    return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${scopes}`;
  }

  /**
   * Exchange LinkedIn authorization code for access token
   */
  async exchangeLinkedInCodeForToken(code) {
    try {
      const response = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:3001/auth/linkedin/callback',
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return response.data.access_token;
    } catch (error) {
      console.error('Error exchanging LinkedIn code for token:', error.message);
      throw error;
    }
  }

  /**
   * Enhanced content analysis for social media
   */
  analyzeSocialMediaContent(content) {
    const analysis = {
      isGeopolitical: false,
      urgency: 'low',
      sentiment: 'neutral',
      credibility: 'medium',
      engagement: 'low'
    };

    const text = content.toLowerCase();

    // Check for geopolitical terms
    analysis.isGeopolitical = this.geopoliticalKeywords.some(keyword => 
      text.includes(keyword.toLowerCase())
    );

    // Check for urgency indicators
    const urgencyTerms = ['breaking', 'urgent', 'alert', 'crisis', 'emergency', 'developing'];
    if (urgencyTerms.some(term => text.includes(term))) {
      analysis.urgency = 'high';
    }

    // Check for sentiment
    const positiveTerms = ['positive', 'growth', 'improve', 'benefit', 'success'];
    const negativeTerms = ['negative', 'decline', 'crisis', 'threat', 'risk', 'conflict'];
    
    const positiveCount = positiveTerms.filter(term => text.includes(term)).length;
    const negativeCount = negativeTerms.filter(term => text.includes(term)).length;
    
    if (positiveCount > negativeCount) analysis.sentiment = 'positive';
    else if (negativeCount > positiveCount) analysis.sentiment = 'negative';

    // Check for credibility indicators
    const credibilityTerms = ['confirmed', 'official', 'statement', 'announcement', 'verified'];
    if (credibilityTerms.some(term => text.includes(term))) {
      analysis.credibility = 'high';
    }

    return analysis;
  }

  /**
   * Process all content into events with enhanced social media analysis
   */
  async processAllContentIntoEvents(allContent) {
    const events = [];
    
    for (const item of allContent) {
      try {
        const event = await this.convertContentToEvent(item);
        if (event) {
          events.push(event);
        }
      } catch (error) {
        console.error('Error processing content item:', error);
      }
    }
    
    return events;
  }

  /**
   * Convert content item to event with social media enhancements
   */
  async convertContentToEvent(contentItem) {
    const analysis = this.analyzeArticle(contentItem);
    
    if (!analysis.isGeopolitical) {
      return null;
    }

    // Enhanced analysis for social media content
    if (contentItem.type === 'social_media') {
      const socialAnalysis = this.analyzeSocialMediaContent(contentItem.content);
      
      // Adjust relevance score based on social media metrics
      let socialRelevanceBoost = 0;
      if (contentItem.socialMetrics) {
        const totalEngagement = (contentItem.socialMetrics.retweets || 0) + 
                               (contentItem.socialMetrics.likes || 0) + 
                               (contentItem.socialMetrics.comments || 0) + 
                               (contentItem.socialMetrics.upvotes || 0);
        
        // Boost relevance based on engagement
        if (totalEngagement > 1000) socialRelevanceBoost = 0.2;
        else if (totalEngagement > 100) socialRelevanceBoost = 0.1;
        else if (totalEngagement > 10) socialRelevanceBoost = 0.05;
      }

      analysis.relevanceScore = Math.min(analysis.relevanceScore + socialRelevanceBoost, 1.0);
    }

    const event = {
      title: contentItem.title,
      description: contentItem.description,
      summary: this.createSummary(contentItem.title, contentItem.description),
      content: contentItem.content,
      location: analysis.location || 'Global',
      category: analysis.category,
      severity: analysis.severity,
      eventDate: new Date(contentItem.publishedAt),
      source: contentItem.source || {
        name: 'Unknown Source',
        url: contentItem.url,
        reliability: 'medium'
      },
      relevanceScore: analysis.relevanceScore,
      tags: analysis.tags,
      impact: analysis.impact,
      
      // Social media specific fields
      platform: contentItem.platform,
      socialMetrics: contentItem.socialMetrics,
      engagement: contentItem.socialMetrics ? 
        (contentItem.socialMetrics.retweets || 0) + 
        (contentItem.socialMetrics.likes || 0) + 
        (contentItem.socialMetrics.upvotes || 0) : 0,
      
      // Enhanced metadata
      entities: this.extractEntities(contentItem.content),
      sentiment: this.analyzeSentiment(contentItem.content),
      keywords: this.extractKeyPhrases(contentItem.content),
      metadata: {
        wordCount: contentItem.content?.split(/\s+/).length || 0,
        readingTime: Math.ceil((contentItem.content?.split(/\s+/).length || 0) / 200),
        hasFullContent: !!(contentItem.content && contentItem.content.length > 500),
        sourceQuality: this.assessSourceQuality(contentItem.source?.name),
        platform: contentItem.platform,
        type: contentItem.type
      }
    };
    
    return event;
  }

  /**
   * Fetch from NewsAPI.org
   */
  async fetchFromNewsAPI() {
    try {
      const response = await axios.get(`${this.newsSources.newsapi.baseUrl}/everything`, {
        params: {
          q: 'geopolitics OR sanctions OR trade war OR political instability',
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 20,
          apiKey: this.newsSources.newsapi.apiKey
        }
      });
      
      return response.data.articles.map(article => ({
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        source: {
          name: article.source?.name || 'Unknown Source',
          url: article.url,
          reliability: 'medium'
        },
        publishedAt: article.publishedAt,
        author: article.author
      }));
      
    } catch (error) {
      console.error('Error fetching from NewsAPI:', error.message);
      return [];
    }
  }

  /**
   * Fetch from GNews
   */
  async fetchFromGNews() {
    try {
      // Check if API key is available
      if (!this.newsSources.gnews.apiKey) {
        console.warn('GNews API key not configured, skipping GNews fetch');
        return [];
      }

      // Rate limiting check
      const now = Date.now();
      if (now - this.lastFetchTimes.gnews < this.rateLimits.gnews) {
        console.log('GNews rate limited, skipping fetch');
        return [];
      }

      const response = await axios.get(`${this.newsSources.gnews.baseUrl}/search`, {
        params: {
          q: this.geopoliticalKeywords.slice(0, 5).join(' OR '), // Limit keywords to avoid long URLs
          lang: 'en',
          country: 'us',
          max: 20, // Reduced from 50 to avoid rate limits
          apikey: this.newsSources.gnews.apiKey
        },
        timeout: 10000 // 10 second timeout
      });
      
      if (!response.data || !response.data.articles) {
        console.warn('GNews returned invalid response structure');
        return [];
      }
      
      const articles = response.data.articles.map(article => ({
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        source: {
          name: article.source?.name || 'GNews',
          url: article.url,
          reliability: 'medium'
        },
        publishedAt: article.publishedAt,
        author: article.author
      }));

      // Update last fetch time
      this.lastFetchTimes.gnews = now;
      
      return articles;
      
    } catch (error) {
      if (error.response?.status === 400) {
        console.error('GNews API Error (400): Invalid request parameters or API key');
      } else if (error.response?.status === 401) {
        console.error('GNews API Error (401): Invalid API key');
      } else if (error.response?.status === 429) {
        console.error('GNews API Error (429): Rate limit exceeded');
      } else {
        console.error('Error fetching from GNews:', error.message);
      }
      return [];
    }
  }

  /**
   * Analyze article content to determine geopolitical relevance
   */
  analyzeArticle(article) {
    const content = `${article.title} ${article.description} ${article.content}`.toLowerCase();
    
    // Check if article is geopolitical
    const geopoliticalTerms = this.geopoliticalKeywords.some(keyword => 
      content.includes(keyword.toLowerCase())
    );
    
    if (!geopoliticalTerms) {
      return { isGeopolitical: false };
    }
    
    // Determine location
    const location = this.extractLocation(content);
    
    // Determine category
    const category = this.determineCategory(content);
    
    // Determine severity
    const severity = this.determineSeverity(content);
    
    // Calculate relevance score
    const relevanceScore = this.calculateRelevanceScore(content);
    
    // Extract tags
    const tags = this.extractTags(content);
    
    // Determine impact
    const impact = this.determineImpact(content);
    
    return {
      isGeopolitical: true,
      location,
      category,
      severity,
      relevanceScore,
      tags,
      impact
    };
  }

  /**
   * Extract location from article content
   */
  extractLocation(content) {
    const geopoliticalRegions = [
      'China', 'Russia', 'Ukraine', 'Iran', 'North Korea', 'Venezuela',
      'Cuba', 'Syria', 'Yemen', 'Libya', 'Sudan', 'Myanmar', 'Belarus',
      'Taiwan', 'Hong Kong', 'South China Sea', 'East China Sea',
      'Strait of Hormuz', 'Black Sea', 'Baltic Sea', 'Arctic'
    ];
    
    for (const region of geopoliticalRegions) {
      if (content.includes(region.toLowerCase())) {
        return region;
      }
    }
    
    return 'Global';
  }

  /**
   * Determine event category
   */
  determineCategory(content) {
    if (content.includes('sanction') || content.includes('embargo')) return 'Sanctions';
    if (content.includes('trade war') || content.includes('tariff')) return 'Trade Disputes';
    if (content.includes('election') || content.includes('vote')) return 'Political Instability';
    if (content.includes('protest') || content.includes('unrest')) return 'Civil Unrest';
    if (content.includes('military') || content.includes('conflict')) return 'Military Conflict';
    if (content.includes('cyber') || content.includes('hack')) return 'Cybersecurity Threats';
    if (content.includes('supply chain') || content.includes('logistics')) return 'Supply Chain Disruptions';
    if (content.includes('currency') || content.includes('inflation')) return 'Currency Fluctuations';
    if (content.includes('regulation') || content.includes('policy')) return 'Regulatory Changes';
    
    return 'General';
  }

  /**
   * Determine event severity
   */
  determineSeverity(content) {
    const criticalTerms = ['nuclear', 'war', 'crisis', 'emergency', 'attack'];
    const highTerms = ['sanction', 'protest', 'conflict', 'dispute', 'threat'];
    const mediumTerms = ['policy', 'regulation', 'change', 'announcement'];
    
    if (criticalTerms.some(term => content.includes(term))) return 'critical';
    if (highTerms.some(term => content.includes(term))) return 'high';
    if (mediumTerms.some(term => content.includes(term))) return 'medium';
    
    return 'low';
  }

  /**
   * Calculate relevance score
   */
  calculateRelevanceScore(content) {
    let score = 0.1; // Base score
    
    // Add points for geopolitical terms
    const geopoliticalMatches = this.geopoliticalKeywords.filter(keyword => 
      content.includes(keyword.toLowerCase())
    ).length;
    score += Math.min(geopoliticalMatches * 0.1, 0.4);
    
    // Add points for specific regions
    const geopoliticalRegions = [
      'China', 'Russia', 'Ukraine', 'Iran', 'North Korea', 'Venezuela',
      'Cuba', 'Syria', 'Yemen', 'Libya', 'Sudan', 'Myanmar', 'Belarus',
      'Taiwan', 'Hong Kong', 'South China Sea', 'East China Sea',
      'Strait of Hormuz', 'Black Sea', 'Baltic Sea', 'Arctic'
    ];
    
    const regionMatches = geopoliticalRegions.filter(region => 
      content.includes(region.toLowerCase())
    ).length;
    score += Math.min(regionMatches * 0.15, 0.3);
    
    // Add points for severity
    if (content.includes('nuclear') || content.includes('war')) score += 0.2;
    if (content.includes('sanction') || content.includes('embargo')) score += 0.15;
    if (content.includes('protest') || content.includes('unrest')) score += 0.1;
    
    return Math.min(score, 1.0);
  }

  /**
   * Extract tags from content
   */
  extractTags(content) {
    const tags = [];
    
    // Add geopolitical keywords found
    this.geopoliticalKeywords.forEach(keyword => {
      if (content.includes(keyword.toLowerCase())) {
        tags.push(keyword);
      }
    });
    
    return tags.slice(0, 10); // Limit to 10 tags
  }

  /**
   * Determine impact level
   */
  determineImpact(content) {
    if (content.includes('global') || content.includes('worldwide')) return 'Global';
    if (content.includes('regional') || content.includes('continent')) return 'Regional';
    if (content.includes('national') || content.includes('country')) return 'National';
    
    return 'Local';
  }

  /**
   * Create a concise summary
   */
  createSummary(title, description) {
    const keyPoints = [];
    
    // Extract key information from title
    if (title.includes('announces') || title.includes('announced')) {
      keyPoints.push('Policy announcement');
    }
    if (title.includes('sanctions') || title.includes('sanctioned')) {
      keyPoints.push('Sanctions imposed');
    }
    if (title.includes('trade') || title.includes('tariff')) {
      keyPoints.push('Trade policy change');
    }
    
    // Add key points from description
    if (description.includes('impact') || description.includes('affect')) {
      keyPoints.push('Business impact expected');
    }
    if (description.includes('response') || description.includes('react')) {
      keyPoints.push('Response/reaction involved');
    }
    
    return keyPoints.length > 0 ? keyPoints.join('; ') : 'Geopolitical development';
  }

  /**
   * Extract entities from text
   */
  extractEntities(text) {
    const entities = {
      countries: [],
      companies: [],
      people: [],
      organizations: []
    };
    
    // Extract countries
    const countryPatterns = [
      /\b(China|Russia|USA|United States|UK|United Kingdom|Germany|France|Japan|India|Brazil|Canada|Australia|South Korea|Iran|North Korea|Taiwan|Hong Kong)\b/gi
    ];
    
    countryPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        entities.countries.push(...matches.map(m => m.toLowerCase()));
      }
    });
    
    // Extract companies (basic pattern)
    const companyPatterns = [
      /\b(Apple|Google|Microsoft|Amazon|Tesla|Samsung|Intel|AMD|NVIDIA|TSMC|ASML|Qualcomm|Huawei|ZTE|Alibaba|Tencent)\b/gi
    ];
    
    companyPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        entities.companies.push(...matches.map(m => m.toLowerCase()));
      }
    });
    
    // Remove duplicates
    Object.keys(entities).forEach(key => {
      entities[key] = [...new Set(entities[key])];
    });
    
    return entities;
  }

  /**
   * Basic sentiment analysis
   */
  analyzeSentiment(text) {
    const positiveWords = ['positive', 'growth', 'improve', 'benefit', 'opportunity', 'success', 'gain'];
    const negativeWords = ['negative', 'decline', 'worse', 'threat', 'risk', 'loss', 'crisis', 'conflict', 'sanction'];
    const neutralWords = ['announce', 'change', 'policy', 'regulation', 'update'];
    
    const lowerText = text.toLowerCase();
    let score = 0;
    
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) score += 1;
    });
    
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) score -= 1;
    });
    
    neutralWords.forEach(word => {
      if (lowerText.includes(word)) score += 0.1;
    });
    
    if (score > 0) return 'positive';
    if (score < 0) return 'negative';
    return 'neutral';
  }

  /**
   * Extract key phrases
   */
  extractKeyPhrases(text) {
    const phrases = [];
    const lowerText = text.toLowerCase();
    
    // Look for key geopolitical phrases
    const keyPhrases = [
      'supply chain disruption',
      'trade restrictions',
      'economic sanctions',
      'regulatory changes',
      'cybersecurity threat',
      'political instability',
      'military conflict',
      'diplomatic relations',
      'market volatility',
      'currency fluctuations'
    ];
    
    keyPhrases.forEach(phrase => {
      if (lowerText.includes(phrase)) {
        phrases.push(phrase);
      }
    });
    
    return phrases;
  }

  /**
   * Assess source quality
   */
  assessSourceQuality(sourceName) {
    const highQualitySources = ['reuters', 'bloomberg', 'financial times', 'wall street journal', 'cnn', 'bbc'];
    const mediumQualitySources = ['ap', 'associated press', 'usa today', 'nbc', 'abc', 'cbs'];
    
    if (!sourceName) return 'unknown';
    
    const lowerSource = sourceName.toLowerCase();
    
    if (highQualitySources.some(source => lowerSource.includes(source))) {
      return 'high';
    }
    if (mediumQualitySources.some(source => lowerSource.includes(source))) {
      return 'medium';
    }
    
    return 'low';
  }

  /**
   * Save events to database and trigger notifications
   */
  async saveEventsAndNotify(events) {
    const savedEvents = [];
    
    for (const event of events) {
      try {
        // Skip events without valid eventDate
        if (!event.eventDate || !event.eventDate.getTime) {
          console.warn(`Skipping event without valid eventDate: ${event.title}`);
          continue;
        }

        // Check if event already exists (avoid duplicates)
        const existingEvent = await GeopoliticalEvent.findOne({
          title: event.title,
          eventDate: {
            $gte: new Date(event.eventDate.getTime() - 24 * 60 * 60 * 1000), // Within 24 hours
            $lte: new Date(event.eventDate.getTime() + 24 * 60 * 60 * 1000)
          }
        });
        
        if (!existingEvent) {
          const savedEvent = await GeopoliticalEvent.create(event);
          savedEvents.push(savedEvent);
          console.log(`Saved new event: ${event.title}`);
        }
      } catch (error) {
        console.error('Error saving event:', error);
      }
    }
    
    // Trigger notifications for new events
    if (savedEvents.length > 0) {
      try {
        await notificationService.processNewEvents(savedEvents);
        console.log(`Processed notifications for ${savedEvents.length} new events`);
      } catch (error) {
        console.error('Error processing notifications:', error);
      }
    }
    
    return savedEvents;
  }

  /**
   * Main method to fetch, process, and save all content
   */
  async updateAllContentAndNotify() {
    try {
      console.log('Starting enhanced content update...');
      
      // Fetch from all sources
      const allContent = await this.fetchAllSources();
      console.log(`Fetched ${allContent.length} content items`);
      
      // Process into events
      const events = await this.processAllContentIntoEvents(allContent);
      console.log(`Processed ${events.length} geopolitical events`);
      
      // Save and notify
      const savedEvents = await this.saveEventsAndNotify(events);
      console.log(`Saved ${savedEvents.length} new events`);
      
      return savedEvents;
      
    } catch (error) {
      console.error('Error in enhanced content update process:', error);
      throw error;
    }
  }
}

module.exports = new EnhancedNewsService();

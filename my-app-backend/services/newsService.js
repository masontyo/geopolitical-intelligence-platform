const axios = require('axios');
const GeopoliticalEvent = require('../models/GeopoliticalEvent');
const notificationService = require('./notificationService');

class NewsService {
  constructor() {
    this.newsSources = {
      // NewsAPI.org (free tier available)
      newsapi: {
        baseUrl: 'https://newsapi.org/v2',
        apiKey: process.env.NEWSAPI_KEY,
        enabled: !!process.env.NEWSAPI_KEY
      },
      // Alternative: GNews API (often provides longer content)
      gnews: {
        baseUrl: 'https://gnews.io/api/v4',
        apiKey: process.env.GNEWS_API_KEY,
        enabled: !!process.env.GNEWS_API_KEY
      },
      // Alternative: Alpha Vantage News API (financial focus)
      alphavantage: {
        baseUrl: 'https://www.alphavantage.co/query',
        apiKey: process.env.ALPHA_VANTAGE_API_KEY,
        enabled: !!process.env.ALPHA_VANTAGE_API_KEY
      },
      // Alternative: NewsData.io (comprehensive)
      newsdata: {
        baseUrl: 'https://newsdata.io/api/1/news',
        apiKey: process.env.NEWSDATA_API_KEY,
        enabled: !!process.env.NEWSDATA_API_KEY
      },
      // Alternative: Bing News Search (Microsoft)
      bing: {
        baseUrl: 'https://api.bing.microsoft.com/v7.0/news/search',
        apiKey: process.env.BING_API_KEY,
        enabled: !!process.env.BING_API_KEY
      }
    };
    
    this.geopoliticalKeywords = [
      'sanctions', 'trade war', 'tariffs', 'embargo', 'political instability',
      'regime change', 'election', 'protest', 'civil unrest', 'military conflict',
      'border dispute', 'territorial', 'diplomatic', 'treaty', 'alliance',
      'nuclear', 'missile', 'cyber attack', 'hacking', 'espionage',
      'supply chain', 'logistics', 'shipping', 'ports', 'trade route',
      'currency', 'inflation', 'economic crisis', 'recession', 'market crash',
      'regulation', 'policy change', 'legislation', 'compliance', 'enforcement'
    ];
    
    this.geopoliticalRegions = [
      'China', 'Russia', 'Ukraine', 'Iran', 'North Korea', 'Venezuela',
      'Cuba', 'Syria', 'Yemen', 'Libya', 'Sudan', 'Myanmar', 'Belarus',
      'Taiwan', 'Hong Kong', 'South China Sea', 'East China Sea',
      'Strait of Hormuz', 'Black Sea', 'Baltic Sea', 'Arctic'
    ];
  }

  /**
   * Fetch news from configured sources
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
      
      // Fetch from Alpha Vantage
      if (this.newsSources.alphavantage.enabled) {
        const alphaNews = await this.fetchFromAlphaVantage();
        allNews.push(...alphaNews);
      }
      
      // Fetch from NewsData.io
      if (this.newsSources.newsdata.enabled) {
        const newsdataNews = await this.fetchFromNewsData();
        allNews.push(...newsdataNews);
      }
      
      // Fetch from Bing News
      if (this.newsSources.bing.enabled) {
        const bingNews = await this.fetchFromBing();
        allNews.push(...bingNews);
      }
      
      console.log(`Fetched ${allNews.length} news articles total`);
      return allNews;
      
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

  /**
   * Fetch from NewsAPI.org
   */
  async fetchFromNewsAPI() {
    try {
      const response = await axios.get(`${this.newsSources.newsapi.baseUrl}/everything`, {
        params: {
          q: this.geopoliticalKeywords.join(' OR '),
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 50,
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
      const response = await axios.get(`${this.newsSources.gnews.baseUrl}/search`, {
        params: {
          q: this.geopoliticalKeywords.join(' OR '),
          lang: 'en',
          country: 'us',
          max: 50,
          apikey: this.newsSources.gnews.apiKey
        }
      });
      
      return response.data.articles.map(article => ({
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
      
    } catch (error) {
      console.error('Error fetching from GNews:', error.message);
      return [];
    }
  }

  /**
   * Fetch from Alpha Vantage
   */
  async fetchFromAlphaVantage() {
    try {
      const response = await axios.get(this.newsSources.alphavantage.baseUrl, {
        params: {
          function: 'NEWS_SENTIMENT',
          topics: 'technology,forex,earnings',
          time_from: '20240101T0000',
          limit: 50,
          apikey: this.newsSources.alphavantage.apiKey
        }
      });
      
      if (response.data.feed) {
        return response.data.feed.map(article => ({
          title: article.title,
          description: article.summary,
          content: article.summary,
          url: article.url,
          source: {
            name: article.source || 'Alpha Vantage',
            url: article.url,
            reliability: 'medium'
          },
          publishedAt: article.time_published,
          author: article.authors?.[0] || 'Unknown'
        }));
      }
      
      return [];
      
    } catch (error) {
      console.error('Error fetching from Alpha Vantage:', error.message);
      return [];
    }
  }

  /**
   * Fetch from NewsData.io (often provides longer content)
   */
  async fetchFromNewsData() {
    try {
      const response = await axios.get(this.newsSources.newsdata.baseUrl, {
        params: {
          apikey: this.newsSources.newsdata.apiKey,
          q: this.geopoliticalKeywords.join(' OR '),
          language: 'en',
          category: 'business,politics,technology',
          country: 'us,gb,ca,au',
          page: 1
        }
      });
      
      if (response.data.results) {
        return response.data.results.map(article => ({
          title: article.title,
          description: article.description,
          content: article.content || article.description,
          url: article.link,
          source: {
            name: article.source_id || 'NewsData',
            url: article.link,
            reliability: 'medium'
          },
          publishedAt: article.pubDate,
          author: article.creator?.[0] || 'Unknown',
          // Additional metadata from NewsData
          category: article.category?.[0],
          country: article.country?.[0],
          language: article.language
        }));
      }
      
      return [];
      
    } catch (error) {
      console.error('Error fetching from NewsData:', error.message);
      return [];
    }
  }

  /**
   * Fetch from Bing News Search
   */
  async fetchFromBing() {
    try {
      const response = await axios.get(this.newsSources.bing.baseUrl, {
        params: {
          q: this.geopoliticalKeywords.join(' OR '),
          count: 50,
          freshness: 'Day',
          textFormat: 'Raw',
          safeSearch: 'Off'
        },
        headers: {
          'Ocp-Apim-Subscription-Key': this.newsSources.bing.apiKey
        }
      });
      
      if (response.data.value) {
        return response.data.value.map(article => ({
          title: article.name,
          description: article.description,
          content: article.description, // Bing doesn't provide full content
          url: article.url,
          source: {
            name: article.provider?.[0]?.name || 'Bing News',
            url: article.url,
            reliability: 'medium'
          },
          publishedAt: article.datePublished,
          author: article.provider?.[0]?.name || 'Unknown',
          // Additional metadata from Bing
          category: article.category,
          isBreakingNews: article.isBreakingNews || false
        }));
      }
      
      return [];
      
    } catch (error) {
      console.error('Error fetching from Bing News:', error.message);
      return [];
    }
  }

  /**
   * Process news articles into geopolitical events
   */
  async processNewsIntoEvents(newsArticles) {
    const events = [];
    
    for (const article of newsArticles) {
      try {
        const event = await this.convertArticleToEvent(article);
        if (event) {
          events.push(event);
        }
      } catch (error) {
        console.error('Error processing article:', error);
      }
    }
    
    return events;
  }

  /**
   * Convert a news article to a geopolitical event
   */
  async convertArticleToEvent(article) {
    // Analyze the article content to determine event properties
    const analysis = this.analyzeArticle(article);
    
    if (!analysis.isGeopolitical) {
      return null; // Skip non-geopolitical articles
    }
    
    // Enhanced content processing
    const enhancedContent = this.enhanceContent(article);
    
    const event = {
      title: article.title,
      description: enhancedContent.description,
      summary: enhancedContent.summary,
      content: enhancedContent.fullContent,
      location: analysis.location || 'Global',
      category: analysis.category,
      severity: analysis.severity,
      eventDate: new Date(article.publishedAt),
      source: article.source || {
        name: 'Unknown Source',
        url: article.url,
        reliability: 'medium'
      },
      relevanceScore: analysis.relevanceScore,
      tags: analysis.tags,
      impact: analysis.impact,
      // Enhanced metadata
      entities: enhancedContent.entities,
      sentiment: enhancedContent.sentiment,
      keywords: enhancedContent.keywords,
      metadata: {
        wordCount: enhancedContent.wordCount,
        readingTime: enhancedContent.readingTime,
        hasFullContent: enhancedContent.hasFullContent,
        sourceQuality: enhancedContent.sourceQuality
      }
    };
    
    return event;
  }

  /**
   * Enhance content with additional processing
   */
  enhanceContent(article) {
    const fullText = `${article.title} ${article.description || ''} ${article.content || ''}`;
    const wordCount = fullText.split(/\s+/).length;
    
    // Create better description (prioritize longer content)
    let description = article.description || '';
    if (article.content && article.content.length > description.length) {
      description = article.content.substring(0, 300) + (article.content.length > 300 ? '...' : '');
    }
    
    // Create summary from title and key points
    const summary = this.createSummary(article.title, description);
    
    // Extract entities (companies, countries, people)
    const entities = this.extractEntities(fullText);
    
    // Basic sentiment analysis
    const sentiment = this.analyzeSentiment(fullText);
    
    // Extract key phrases
    const keywords = this.extractKeyPhrases(fullText);
    
    // Assess source quality
    const sourceQuality = this.assessSourceQuality(article.source?.name);
    
    return {
      description,
      summary,
      fullContent: fullText,
      entities,
      sentiment,
      keywords,
      wordCount,
      readingTime: Math.ceil(wordCount / 200), // Average reading speed
      hasFullContent: !!(article.content && article.content.length > 500),
      sourceQuality
    };
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
    for (const region of this.geopoliticalRegions) {
      if (content.includes(region.toLowerCase())) {
        return region;
      }
    }
    
    // Try to extract country names from common patterns
    const countryPatterns = [
      /in\s+([A-Z][a-z]+)/g,
      /from\s+([A-Z][a-z]+)/g,
      /([A-Z][a-z]+)\s+government/g,
      /([A-Z][a-z]+)\s+officials/g
    ];
    
    for (const pattern of countryPatterns) {
      const match = content.match(pattern);
      if (match) {
        return match[1];
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
    const regionMatches = this.geopoliticalRegions.filter(region => 
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
    
    // Add regions found
    this.geopoliticalRegions.forEach(region => {
      if (content.includes(region.toLowerCase())) {
        tags.push(region);
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
   * Main method to fetch, process, and save news
   */
  async updateNewsAndNotify() {
    try {
      console.log('Starting news update...');
      
      // Fetch latest news
      const newsArticles = await this.fetchLatestNews();
      console.log(`Fetched ${newsArticles.length} news articles`);
      
      // Process into events
      const events = await this.processNewsIntoEvents(newsArticles);
      console.log(`Processed ${events.length} geopolitical events`);
      
      // Save and notify
      const savedEvents = await this.saveEventsAndNotify(events);
      console.log(`Saved ${savedEvents.length} new events`);
      
      return savedEvents;
      
    } catch (error) {
      console.error('Error in news update process:', error);
      throw error;
    }
  }

  /**
   * Test the news service
   */
  async testNewsService() {
    try {
      console.log('Testing news service...');
      
      // Test fetching news
      const news = await this.fetchLatestNews();
      console.log(`Test: Fetched ${news.length} articles`);
      
      // Test processing
      const events = await this.processNewsIntoEvents(news.slice(0, 5)); // Test with first 5
      console.log(`Test: Processed ${events.length} events`);
      
      return { success: true, newsCount: news.length, eventCount: events.length };
      
    } catch (error) {
      console.error('News service test failed:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new NewsService(); 
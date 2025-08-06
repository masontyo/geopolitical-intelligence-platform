/**
 * LLM-Powered Title Enhancement Service
 * Transforms raw news article titles into professional, actionable intelligence titles
 */

const axios = require('axios');

class TitleEnhancementService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
    this.cache = new Map(); // Simple in-memory cache
  }

  /**
   * Enhance a news article title to be more professional and actionable
   */
  async enhanceTitle(originalTitle, articleContext = {}) {
    try {
      // Check cache first
      const cacheKey = this.generateCacheKey(originalTitle, articleContext);
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      if (!this.apiKey) {
        console.warn('⚠️ OpenAI API key not found, returning original title');
        return this.fallbackEnhancement(originalTitle);
      }

      const prompt = this.buildEnhancementPrompt(originalTitle, articleContext);
      
      const response = await axios.post(`${this.baseURL}/chat/completions`, {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert geopolitical intelligence analyst. Your job is to transform raw news headlines into professional, actionable intelligence titles that would appear in a high-end risk intelligence platform.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 100,
        temperature: 0.3, // Slightly creative but consistent
        timeout: 5000
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const enhancedTitle = this.parseEnhancedTitle(response.data.choices[0].message.content);
      
      // Cache the result
      this.cache.set(cacheKey, enhancedTitle);
      
      return enhancedTitle;

    } catch (error) {
      console.error('❌ Title enhancement failed:', error.message);
      console.log('🔄 Falling back to basic enhancement...');
      return this.fallbackEnhancement(originalTitle);
    }
  }

  /**
   * Build enhancement prompt
   */
  buildEnhancementPrompt(originalTitle, context) {
    const { description = '', categories = [], regions = [] } = context;
    
    return `
TRANSFORM THIS NEWS HEADLINE INTO A PROFESSIONAL INTELLIGENCE TITLE

ORIGINAL HEADLINE: "${originalTitle}"

CONTEXT:
- Description: ${description.substring(0, 200)}...
- Categories: ${categories.join(', ')}
- Regions: ${regions.join(', ')}

REQUIREMENTS:
1. Make it sound professional and intelligence-focused
2. Add context about business impact or risk implications
3. Use intelligence terminology (e.g., "Alert", "Analysis", "Assessment", "Update")
4. Keep it concise (max 80 characters)
5. Make it actionable for business decision-makers
6. Avoid sensationalist language
7. Add geographic or industry context if relevant

EXAMPLES:
- "China Announces New Tech Regulations" → "China Tech Regulation Alert: New Compliance Requirements"
- "Supply Chain Disruption in Asia" → "Asia Supply Chain Risk Assessment: Disruption Analysis"
- "Cybersecurity Breach Reported" → "Cybersecurity Incident Alert: Threat Assessment"

ENHANCED TITLE:`;
  }

  /**
   * Parse the enhanced title from LLM response
   */
  parseEnhancedTitle(response) {
    try {
      // Clean up the response
      let title = response.trim();
      
      // Remove quotes if present
      title = title.replace(/^["']|["']$/g, '');
      
      // Remove any "Enhanced Title:" prefix
      title = title.replace(/^enhanced title:\s*/i, '');
      
      // Ensure it's not too long
      if (title.length > 80) {
        title = title.substring(0, 77) + '...';
      }
      
      return title || 'Intelligence Update';
      
    } catch (error) {
      console.error('Error parsing enhanced title:', error);
      return 'Intelligence Update';
    }
  }

  /**
   * Fallback enhancement when LLM is not available
   */
  fallbackEnhancement(originalTitle) {
    // Basic enhancement without LLM
    let enhanced = originalTitle;
    
    // Add intelligence context based on keywords
    const keywords = {
      'cyber': 'Cybersecurity Alert: ',
      'hack': 'Cybersecurity Alert: ',
      'breach': 'Security Incident: ',
      'supply chain': 'Supply Chain Risk: ',
      'trade': 'Trade Policy Update: ',
      'regulation': 'Regulatory Alert: ',
      'policy': 'Policy Update: ',
      'sanction': 'Sanctions Alert: ',
      'tension': 'Geopolitical Alert: ',
      'conflict': 'Conflict Alert: ',
      'election': 'Political Risk: ',
      'economy': 'Economic Risk: ',
      'inflation': 'Economic Alert: ',
      'recession': 'Economic Risk: '
    };
    
    const lowerTitle = enhanced.toLowerCase();
    for (const [keyword, prefix] of Object.entries(keywords)) {
      if (lowerTitle.includes(keyword)) {
        enhanced = prefix + enhanced;
        break;
      }
    }
    
    // If no keyword match, add generic prefix
    if (!enhanced.includes('Alert:') && !enhanced.includes('Risk:') && !enhanced.includes('Update:')) {
      enhanced = 'Intelligence Update: ' + enhanced;
    }
    
    return enhanced;
  }

  /**
   * Generate cache key for title enhancement
   */
  generateCacheKey(originalTitle, context) {
    const contextStr = JSON.stringify(context);
    return `${originalTitle}:${contextStr}`;
  }

  /**
   * Batch enhance multiple titles
   */
  async batchEnhanceTitles(titlesWithContext, maxConcurrent = 3) {
    const results = [];
    
    // Process in chunks to avoid overwhelming the API
    for (let i = 0; i < titlesWithContext.length; i += maxConcurrent) {
      const chunk = titlesWithContext.slice(i, i + maxConcurrent);
      
      const chunkPromises = chunk.map(async (item) => {
        const enhancedTitle = await this.enhanceTitle(item.title, item.context);
        return {
          originalTitle: item.title,
          enhancedTitle,
          context: item.context
        };
      });
      
      const chunkResults = await Promise.all(chunkPromises);
      results.push(...chunkResults);
      
      // Small delay between chunks to be respectful to the API
      if (i + maxConcurrent < titlesWithContext.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return results;
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

module.exports = TitleEnhancementService; 
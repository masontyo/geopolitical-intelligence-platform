/**
 * LLM-Powered Intelligent Event Scoring
 * Uses OpenAI GPT to understand context and provide intelligent relevance scoring
 */

const axios = require('axios');

class LLMScoringEngine {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
  }

  /**
   * Analyze event relevance using LLM
   */
  async analyzeEventRelevance(userProfile, event) {
    try {
      if (!this.apiKey) {
        console.warn('⚠️ OpenAI API key not found, falling back to keyword scoring');
        return this.fallbackScoring(userProfile, event);
      }

      const prompt = this.buildAnalysisPrompt(userProfile, event);
      
      const response = await axios.post(`${this.baseURL}/chat/completions`, {
        model: 'gpt-4o-mini', // Using the faster, cheaper model for real-time analysis
        messages: [
          {
            role: 'system',
            content: `You are an expert geopolitical risk analyst specializing in supply chain, cybersecurity, regulatory, and geopolitical risk assessment. Your job is to analyze news events and determine their relevance to specific business profiles.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.1, // Low temperature for consistent, analytical responses
        timeout: 10000 // 10 second timeout
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const analysis = this.parseLLMResponse(response.data.choices[0].message.content);
      return analysis;

    } catch (error) {
      console.error('❌ LLM scoring failed:', error.message);
      console.log('🔄 Falling back to keyword-based scoring...');
      return this.fallbackScoring(userProfile, event);
    }
  }

  /**
   * Build comprehensive analysis prompt
   */
  buildAnalysisPrompt(userProfile, event) {
    return `
ANALYZE THIS EVENT FOR BUSINESS RELEVANCE

USER PROFILE:
- Name: ${userProfile.name}
- Company: ${userProfile.company}
- Industry: ${userProfile.industry}
- Business Units: ${userProfile.businessUnits.map(b => b.name).join(', ')}
- Areas of Concern: ${userProfile.areasOfConcern.map(c => c.category).join(', ')}
- Regions of Interest: ${userProfile.regions.join(', ')}

EVENT TO ANALYZE:
- Title: ${event.title}
- Description: ${event.description}
- Categories: ${event.categories.join(', ')}
- Regions: ${event.regions.join(', ')}
- Severity: ${event.severity}
- Source: ${event.source.name}

ANALYSIS TASK:
1. Determine if this event is TRULY relevant to the user's business interests
2. Consider context - distinguish between:
   - Real geopolitical/economic events vs entertainment/gaming
   - Business-relevant policy changes vs general news
   - Actual supply chain/cybersecurity issues vs unrelated tech news
3. Score relevance from 0.0 (completely irrelevant) to 1.0 (highly relevant)
4. Provide reasoning for your score

RESPOND IN THIS EXACT JSON FORMAT:
{
  "relevanceScore": 0.0-1.0,
  "isRelevant": true/false,
  "reasoning": "Brief explanation of why this is or isn't relevant",
  "keyFactors": ["factor1", "factor2"],
  "confidence": "high/medium/low"
}

IMPORTANT: Be strict about relevance. If this is entertainment, gaming, sports, or clearly unrelated business news, score it low (0.0-0.2). Only score high (0.7-1.0) for events that could actually impact the user's business operations, supply chain, cybersecurity, regulatory compliance, or geopolitical risk exposure.
`;
  }

  /**
   * Parse LLM response into structured data
   */
  parseLLMResponse(response) {
    try {
      // Extract JSON from response (handle cases where LLM adds extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const analysis = JSON.parse(jsonMatch[0]);
      
      // Validate and normalize the response
      return {
        relevanceScore: Math.max(0, Math.min(1, parseFloat(analysis.relevanceScore) || 0)),
        isRelevant: analysis.isRelevant || false,
        reasoning: analysis.reasoning || 'No reasoning provided',
        keyFactors: Array.isArray(analysis.keyFactors) ? analysis.keyFactors : [],
        confidence: analysis.confidence || 'medium'
      };

    } catch (error) {
      console.error('❌ Failed to parse LLM response:', error.message);
      console.log('Raw response:', response);
      return this.fallbackScoring(null, null);
    }
  }

  /**
   * Fallback to keyword-based scoring when LLM is unavailable
   */
  fallbackScoring(userProfile, event) {
    // Simple keyword-based fallback
    const content = `${event?.title || ''} ${event?.description || ''}`.toLowerCase();
    
    // Check for obvious non-relevant content
    const entertainmentTerms = ['game', 'gaming', 'entertainment', 'movie', 'film', 'tv', 'show', 'sport', 'football', 'basketball', 'celebrity', 'actor', 'actress'];
    const isEntertainment = entertainmentTerms.some(term => content.includes(term));
    
    if (isEntertainment) {
      return {
        relevanceScore: 0.1,
        isRelevant: false,
        reasoning: 'Event appears to be entertainment/gaming related',
        keyFactors: ['entertainment_content'],
        confidence: 'high'
      };
    }

    // Basic relevance check
    const businessTerms = ['business', 'economy', 'trade', 'policy', 'regulation', 'supply', 'cyber', 'security', 'government'];
    const hasBusinessTerms = businessTerms.some(term => content.includes(term));
    
    return {
      relevanceScore: hasBusinessTerms ? 0.3 : 0.1,
      isRelevant: hasBusinessTerms,
      reasoning: hasBusinessTerms ? 'Contains business-related keywords' : 'No clear business relevance',
      keyFactors: hasBusinessTerms ? ['business_keywords'] : ['no_business_relevance'],
      confidence: 'medium'
    };
  }

  /**
   * Batch analyze multiple events efficiently
   */
  async batchAnalyzeEvents(userProfile, events, maxConcurrent = 5) {
    const results = [];
    const batches = this.chunkArray(events, maxConcurrent);

    for (const batch of batches) {
      const batchPromises = batch.map(event => 
        this.analyzeEventRelevance(userProfile, event)
          .then(analysis => ({ event, analysis }))
          .catch(error => {
            console.error(`❌ Failed to analyze event "${event.title}":`, error.message);
            return { event, analysis: this.fallbackScoring(userProfile, event) };
          })
      );

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    return results;
  }

  /**
   * Helper to chunk array for batch processing
   */
  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

module.exports = LLMScoringEngine; 
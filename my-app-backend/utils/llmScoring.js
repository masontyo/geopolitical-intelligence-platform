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
ANALYZE THIS EVENT FOR BUSINESS RELEVANCE, SEVERITY, AND CURRENT DEVELOPMENTS

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
- Source: ${event.source.name}

ANALYSIS TASK:
1. Determine if this is a CURRENT DEVELOPING EVENT (not just informational content)
2. Check if this event is TRULY relevant to the user's business interests
3. Score relevance from 0.0 (completely irrelevant) to 1.0 (highly relevant)
4. Assess the SEVERITY level based on BOTH content impact AND relevance to the user
5. Provide reasoning for your score

SEVERITY ASSESSMENT (determine based on content impact AND relevance to user):
- CRITICAL: Major crises, wars, severe attacks, major policy changes, significant supply chain disruptions, large-scale cyber attacks, major regulatory changes - AND highly relevant to user's business
- HIGH: Significant tensions, disputes, breaches, policy announcements, trade restrictions, moderate supply chain issues, regulatory proposals - AND moderately to highly relevant to user's business
- MEDIUM: Policy discussions, minor disputes, routine announcements, small-scale issues, ongoing negotiations - AND somewhat relevant to user's business
- LOW: Minor updates, routine news, background information, small policy changes - OR not very relevant to user's business

IMPORTANT: The same event can have different severity levels depending on how relevant it is to the specific user. A major policy change that doesn't affect the user's industry should be rated lower severity than a minor policy change that directly impacts their business.

DEVELOPING EVENT INDICATORS (look for these):
- "announces", "announced", "announcement"
- "new", "recent", "latest", "breaking"
- "develops", "developing", "emerging"
- "launches", "launched", "introduces"
- "changes", "changed", "updates", "updated"
- "reveals", "revealed", "discovered"
- "responds", "responded", "reacts"
- "plans", "planning", "proposes", "proposed"
- "investigates", "investigation", "probe"
- "warns", "warning", "alerts", "alert"
- "expands", "expanding", "grows", "growing"
- "restricts", "restricted", "bans", "banned"
- "approves", "approved", "rejects", "rejected"
- "signs", "signed", "agrees", "agreed"
- "declares", "declared", "states", "stated"
- "reports", "reported", "finds", "found"
- "reveals", "revealed", "exposes", "exposed"

INFORMATIONAL CONTENT INDICATORS (avoid these):
- "explains", "explanation", "guide", "tutorial"
- "overview", "summary", "background"
- "history", "historical", "tradition"
- "analysis", "analyst", "expert says"
- "study", "research", "survey"
- "tips", "advice", "recommendations"
- "how to", "what is", "why does"
- "comparison", "versus", "differences"
- "review", "evaluation", "assessment"

RESPOND IN THIS EXACT JSON FORMAT:
{
  "relevanceScore": 0.0-1.0,
  "severity": "critical/high/medium/low",
  "isRelevant": true/false,
  "isDevelopingEvent": true/false,
  "reasoning": "Brief explanation of why this is or isn't relevant, the severity level, and whether it's a developing event",
  "keyFactors": ["factor1", "factor2"],
  "confidence": "high/medium/low"
}

IMPORTANT RULES:
1. ONLY score high (0.7-1.0) for CURRENT DEVELOPING EVENTS that could impact business
2. Score low (0.0-0.3) for informational/educational content, even if topic-relevant
3. Score very low (0.0-0.1) for entertainment/gaming/sports
4. Must be BOTH relevant AND a developing event to score above 0.5
5. Look for action words and recent developments, not just topic mentions
6. SEVERITY should be influenced by relevance - more relevant events should be considered more severe
7. Assess severity based on BOTH content impact AND relevance to the specific user
8. The same event can have different severity levels for different users based on their business profile
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
        severity: analysis.severity || 'low',
        isRelevant: analysis.isRelevant || false,
        isDevelopingEvent: analysis.isDevelopingEvent || false,
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
        severity: 'low',
        isRelevant: false,
        isDevelopingEvent: false,
        reasoning: 'Event appears to be entertainment/gaming related',
        keyFactors: ['entertainment_content'],
        confidence: 'high'
      };
    }

    // Check for developing event indicators
    const developingEventTerms = [
      'announces', 'announced', 'announcement', 'new', 'recent', 'latest', 'breaking',
      'develops', 'developing', 'emerging', 'launches', 'launched', 'introduces',
      'changes', 'changed', 'updates', 'updated', 'reveals', 'revealed', 'discovered',
      'responds', 'responded', 'reacts', 'plans', 'planning', 'proposes', 'proposed',
      'investigates', 'investigation', 'probe', 'warns', 'warning', 'alerts', 'alert',
      'expands', 'expanding', 'grows', 'growing', 'restricts', 'restricted', 'bans', 'banned',
      'approves', 'approved', 'rejects', 'rejected', 'signs', 'signed', 'agrees', 'agreed',
      'declares', 'declared', 'states', 'stated', 'reports', 'reported', 'finds', 'found',
      'exposes', 'exposed'
    ];
    const isDevelopingEvent = developingEventTerms.some(term => content.includes(term));

    // Check for informational content indicators (avoid these)
    const informationalTerms = [
      'explains', 'explanation', 'guide', 'tutorial', 'overview', 'summary', 'background',
      'history', 'historical', 'tradition', 'analysis', 'analyst', 'expert says',
      'study', 'research', 'survey', 'tips', 'advice', 'recommendations',
      'how to', 'what is', 'why does', 'comparison', 'versus', 'differences',
      'review', 'evaluation', 'assessment'
    ];
    const isInformational = informationalTerms.some(term => content.includes(term));

    // Basic relevance check
    const businessTerms = ['business', 'economy', 'trade', 'policy', 'regulation', 'supply', 'cyber', 'security', 'government'];
    const hasBusinessTerms = businessTerms.some(term => content.includes(term));
    
    // Determine severity based on content AND relevance
    let severity = 'low';
    let baseSeverity = 'low';
    
    // First, assess base severity from content
    if (content.includes('crisis') || content.includes('war') || content.includes('attack') || content.includes('major') || content.includes('significant')) {
      baseSeverity = 'critical';
    } else if (content.includes('tension') || content.includes('dispute') || content.includes('breach') || content.includes('restriction') || content.includes('sanction')) {
      baseSeverity = 'high';
    } else if (content.includes('policy') || content.includes('announcement') || content.includes('discussion') || content.includes('proposal')) {
      baseSeverity = 'medium';
    }
    
    // Then adjust severity based on relevance to user
    if (hasBusinessTerms && isDevelopingEvent && !isInformational) {
      // If highly relevant, maintain or increase severity
      if (baseSeverity === 'critical') severity = 'critical';
      else if (baseSeverity === 'high') severity = 'high';
      else if (baseSeverity === 'medium') severity = 'high'; // Boost medium to high if relevant
      else severity = 'medium'; // Boost low to medium if relevant
    } else if (hasBusinessTerms && isDevelopingEvent) {
      // If somewhat relevant, maintain or slightly reduce severity
      if (baseSeverity === 'critical') severity = 'high';
      else if (baseSeverity === 'high') severity = 'medium';
      else if (baseSeverity === 'medium') severity = 'medium';
      else severity = 'low';
    } else if (hasBusinessTerms && !isInformational) {
      // If minimally relevant, reduce severity
      if (baseSeverity === 'critical') severity = 'medium';
      else if (baseSeverity === 'high') severity = 'medium';
      else if (baseSeverity === 'medium') severity = 'low';
      else severity = 'low';
    } else {
      // If not relevant, reduce severity significantly
      if (baseSeverity === 'critical') severity = 'medium';
      else if (baseSeverity === 'high') severity = 'low';
      else if (baseSeverity === 'medium') severity = 'low';
      else severity = 'low';
    }
    
    // Determine score based on multiple factors
    let relevanceScore = 0.1;
    let reasoning = 'No clear business relevance';
    
    if (hasBusinessTerms && isDevelopingEvent && !isInformational) {
      relevanceScore = 0.6;
      reasoning = 'Contains business keywords and developing event indicators';
    } else if (hasBusinessTerms && isDevelopingEvent) {
      relevanceScore = 0.4;
      reasoning = 'Contains business keywords and developing event indicators, but may be informational';
    } else if (hasBusinessTerms && !isInformational) {
      relevanceScore = 0.3;
      reasoning = 'Contains business-related keywords but no clear developing event';
    } else if (hasBusinessTerms) {
      relevanceScore = 0.2;
      reasoning = 'Contains business-related keywords but appears to be informational content';
    }
    
    return {
      relevanceScore: relevanceScore,
      severity: severity,
      isRelevant: hasBusinessTerms,
      isDevelopingEvent: isDevelopingEvent && !isInformational,
      reasoning: reasoning,
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
const sampleEvents = [
  {
    title: "US-China Trade Tensions Escalate",
    description: "New tariffs imposed on Chinese technology imports, affecting semiconductor supply chains globally. Major tech companies report supply chain disruptions.",
    summary: "Escalating trade tensions between US and China impact global technology supply chains",
    eventDate: new Date('2024-01-15'),
    categories: ['Trade', 'Technology', 'Economic Sanctions'],
    regions: ['Asia-Pacific', 'North America'],
    countries: ['United States', 'China', 'Taiwan', 'South Korea'],
    severity: 'high',
    impact: {
      economic: 'negative',
      political: 'negative',
      social: 'neutral'
    },
    source: {
      name: 'Reuters',
      url: 'https://reuters.com/trade-tensions',
      reliability: 'high'
    },
    historicalContext: {
      hasHappenedBefore: true,
      previousOccurrences: [
        {
          date: new Date('2018-07-06'),
          description: 'US-China trade war began with initial tariffs',
          outcome: 'Phase 1 trade deal signed in 2020'
        }
      ],
      similarPatterns: [
        {
          pattern: 'Technology export controls',
          description: 'Similar to Cold War era technology restrictions'
        }
      ]
    },
    predictiveAnalytics: {
      likelihood: 0.85,
      timeframe: 'short-term',
      scenarios: [
        {
          scenario: 'Further escalation with additional tariffs',
          probability: 0.6,
          impact: 'Global supply chain disruption'
        },
        {
          scenario: 'Negotiation breakthrough',
          probability: 0.3,
          impact: 'Market stabilization'
        }
      ]
    },
    actionableInsights: [
      {
        insight: 'Diversify supply chains away from China',
        action: 'Identify alternative suppliers in Southeast Asia',
        priority: 'high'
      },
      {
        insight: 'Stockpile critical components',
        action: 'Increase inventory of affected semiconductors',
        priority: 'medium'
      }
    ],
    tags: ['trade-war', 'semiconductors', 'supply-chain', 'tariffs'],
    status: 'active'
  },
  {
    title: "European Union Digital Services Act Implementation",
    description: "New EU regulations on digital platforms come into effect, requiring major tech companies to comply with content moderation and transparency requirements.",
    summary: "EU implements comprehensive digital platform regulations affecting global tech companies",
    eventDate: new Date('2024-02-17'),
    categories: ['Regulation', 'Technology', 'Digital Policy'],
    regions: ['Europe'],
    countries: ['Germany', 'France', 'Netherlands', 'Ireland'],
    severity: 'medium',
    impact: {
      economic: 'neutral',
      political: 'positive',
      social: 'positive'
    },
    source: {
      name: 'European Commission',
      url: 'https://ec.europa.eu/digital-services-act',
      reliability: 'high'
    },
    historicalContext: {
      hasHappenedBefore: false,
      previousOccurrences: [],
      similarPatterns: [
        {
          pattern: 'GDPR implementation',
          description: 'Similar regulatory approach to data protection'
        }
      ]
    },
    predictiveAnalytics: {
      likelihood: 1.0,
      timeframe: 'immediate',
      scenarios: [
        {
          scenario: 'Successful compliance by major platforms',
          probability: 0.7,
          impact: 'Improved digital governance'
        },
        {
          scenario: 'Legal challenges and delays',
          probability: 0.3,
          impact: 'Regulatory uncertainty'
        }
      ]
    },
    actionableInsights: [
      {
        insight: 'Review digital platform compliance requirements',
        action: 'Assess impact on EU operations and user base',
        priority: 'medium'
      },
      {
        insight: 'Monitor regulatory developments in other regions',
        action: 'Track similar legislation in US and Asia',
        priority: 'low'
      }
    ],
    tags: ['digital-regulation', 'content-moderation', 'transparency', 'eu'],
    status: 'active'
  },
  {
    title: "Middle East Energy Transition Accelerates",
    description: "Saudi Arabia and UAE announce major investments in renewable energy, signaling shift away from oil dependency. Regional energy markets face transformation.",
    summary: "Gulf states accelerate transition to renewable energy, impacting global oil markets",
    eventDate: new Date('2024-01-28'),
    categories: ['Energy', 'Climate Change', 'Economic Transition'],
    regions: ['Middle East'],
    countries: ['Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait'],
    severity: 'medium',
    impact: {
      economic: 'positive',
      political: 'positive',
      social: 'positive'
    },
    source: {
      name: 'Bloomberg',
      url: 'https://bloomberg.com/middle-east-energy',
      reliability: 'high'
    },
    historicalContext: {
      hasHappenedBefore: false,
      previousOccurrences: [],
      similarPatterns: [
        {
          pattern: 'European Green Deal',
          description: 'Similar regional energy transition initiatives'
        }
      ]
    },
    predictiveAnalytics: {
      likelihood: 0.9,
      timeframe: 'medium-term',
      scenarios: [
        {
          scenario: 'Successful renewable energy deployment',
          probability: 0.6,
          impact: 'Reduced oil dependency, new investment opportunities'
        },
        {
          scenario: 'Gradual transition with oil revenue maintenance',
          probability: 0.4,
          impact: 'Balanced economic transformation'
        }
      ]
    },
    actionableInsights: [
      {
        insight: 'Explore renewable energy investment opportunities',
        action: 'Research partnerships with Gulf state energy projects',
        priority: 'medium'
      },
      {
        insight: 'Diversify energy supply sources',
        action: 'Develop alternative energy partnerships',
        priority: 'low'
      }
    ],
    tags: ['renewable-energy', 'oil-markets', 'climate-policy', 'gulf-states'],
    status: 'active'
  },
  {
    title: "African Continental Free Trade Area Operational",
    description: "The AfCFTA becomes fully operational, creating the world's largest free trade area by population. Intra-African trade expected to increase significantly.",
    summary: "Pan-African free trade agreement operationalizes, creating new market opportunities",
    eventDate: new Date('2024-03-01'),
    categories: ['Trade', 'Economic Integration', 'Development'],
    regions: ['Africa'],
    countries: ['Nigeria', 'South Africa', 'Kenya', 'Egypt', 'Ghana'],
    severity: 'medium',
    impact: {
      economic: 'positive',
      political: 'positive',
      social: 'positive'
    },
    source: {
      name: 'African Union',
      url: 'https://au.int/afcfta',
      reliability: 'high'
    },
    historicalContext: {
      hasHappenedBefore: false,
      previousOccurrences: [],
      similarPatterns: [
        {
          pattern: 'EU single market formation',
          description: 'Similar regional economic integration process'
        }
      ]
    },
    predictiveAnalytics: {
      likelihood: 0.95,
      timeframe: 'long-term',
      scenarios: [
        {
          scenario: 'Successful trade integration',
          probability: 0.5,
          impact: 'Increased intra-African trade and investment'
        },
        {
          scenario: 'Gradual implementation with challenges',
          probability: 0.4,
          impact: 'Moderate trade growth with some barriers'
        }
      ]
    },
    actionableInsights: [
      {
        insight: 'Explore African market expansion opportunities',
        action: 'Research entry strategies for key African markets',
        priority: 'medium'
      },
      {
        insight: 'Monitor trade facilitation developments',
        action: 'Track customs and regulatory harmonization',
        priority: 'low'
      }
    ],
    tags: ['free-trade', 'africa', 'economic-integration', 'market-access'],
    status: 'active'
  },
  {
    title: "Cybersecurity Breach Affects Global Financial Institutions",
    description: "Major cyberattack targets multiple global banks, exposing customer data and disrupting financial services. Attack attributed to state-sponsored actors.",
    summary: "Coordinated cyberattack impacts global financial sector, raising security concerns",
    eventDate: new Date('2024-02-10'),
    categories: ['Cybersecurity', 'Financial Services', 'State-Sponsored Attacks'],
    regions: ['Global'],
    countries: ['United States', 'United Kingdom', 'Germany', 'Japan'],
    severity: 'critical',
    impact: {
      economic: 'negative',
      political: 'negative',
      social: 'negative'
    },
    source: {
      name: 'Financial Times',
      url: 'https://ft.com/cyber-attack-banks',
      reliability: 'high'
    },
    historicalContext: {
      hasHappenedBefore: true,
      previousOccurrences: [
        {
          date: new Date('2020-12-13'),
          description: 'SolarWinds cyberattack affected government and private sector',
          outcome: 'Enhanced cybersecurity regulations and practices'
        }
      ],
      similarPatterns: [
        {
          pattern: 'State-sponsored financial cyberattacks',
          description: 'Similar to previous attacks on SWIFT system'
        }
      ]
    },
    predictiveAnalytics: {
      likelihood: 0.7,
      timeframe: 'short-term',
      scenarios: [
        {
          scenario: 'Escalating cyber warfare',
          probability: 0.4,
          impact: 'Increased financial sector vulnerabilities'
        },
        {
          scenario: 'Enhanced cybersecurity cooperation',
          probability: 0.6,
          impact: 'Improved financial security measures'
        }
      ]
    },
    actionableInsights: [
      {
        insight: 'Strengthen cybersecurity infrastructure',
        action: 'Implement advanced threat detection and response systems',
        priority: 'critical'
      },
      {
        insight: 'Review financial sector partnerships',
        action: 'Assess exposure to affected institutions',
        priority: 'high'
      }
    ],
    tags: ['cybersecurity', 'financial-services', 'data-breach', 'state-actors'],
    status: 'active'
  },
  {
    title: "Latin America Lithium Mining Boom",
    description: "Argentina, Chile, and Bolivia announce major lithium mining projects to meet global electric vehicle demand. Environmental concerns and indigenous rights issues emerge.",
    summary: "South American lithium mining expansion creates economic opportunities and environmental challenges",
    eventDate: new Date('2024-01-20'),
    categories: ['Mining', 'Electric Vehicles', 'Environmental Impact'],
    regions: ['South America'],
    countries: ['Argentina', 'Chile', 'Bolivia', 'Brazil'],
    severity: 'medium',
    impact: {
      economic: 'positive',
      political: 'neutral',
      social: 'negative'
    },
    source: {
      name: 'Mining.com',
      url: 'https://mining.com/lithium-boom',
      reliability: 'medium'
    },
    historicalContext: {
      hasHappenedBefore: false,
      previousOccurrences: [],
      similarPatterns: [
        {
          pattern: 'Rare earth mining in China',
          description: 'Similar resource extraction and environmental concerns'
        }
      ]
    },
    predictiveAnalytics: {
      likelihood: 0.8,
      timeframe: 'medium-term',
      scenarios: [
        {
          scenario: 'Sustainable mining practices adopted',
          probability: 0.4,
          impact: 'Balanced economic and environmental outcomes'
        },
        {
          scenario: 'Environmental conflicts escalate',
          probability: 0.6,
          impact: 'Mining delays and regulatory challenges'
        }
      ]
    },
    actionableInsights: [
      {
        insight: 'Monitor lithium supply chain developments',
        action: 'Assess impact on electric vehicle production costs',
        priority: 'medium'
      },
      {
        insight: 'Consider sustainable sourcing strategies',
        action: 'Research environmentally responsible lithium suppliers',
        priority: 'low'
      }
    ],
    tags: ['lithium', 'mining', 'electric-vehicles', 'environmental-impact'],
    status: 'active'
  },
  {
    title: "Southeast Asia Digital Economy Surge",
    description: "Indonesia, Vietnam, and Philippines report record growth in digital payments and e-commerce. Regional fintech startups attract major international investment.",
    summary: "Southeast Asian digital economy experiences rapid growth, creating new market opportunities",
    eventDate: new Date('2024-02-05'),
    categories: ['Digital Economy', 'Fintech', 'E-commerce'],
    regions: ['Southeast Asia'],
    countries: ['Indonesia', 'Vietnam', 'Philippines', 'Thailand', 'Malaysia'],
    severity: 'low',
    impact: {
      economic: 'positive',
      political: 'positive',
      social: 'positive'
    },
    source: {
      name: 'Nikkei Asia',
      url: 'https://asia.nikkei.com/digital-economy',
      reliability: 'high'
    },
    historicalContext: {
      hasHappenedBefore: false,
      previousOccurrences: [],
      similarPatterns: [
        {
          pattern: 'Chinese digital economy growth',
          description: 'Similar rapid digital transformation in emerging markets'
        }
      ]
    },
    predictiveAnalytics: {
      likelihood: 0.9,
      timeframe: 'long-term',
      scenarios: [
        {
          scenario: 'Sustained digital growth',
          probability: 0.7,
          impact: 'New market opportunities and innovation hubs'
        },
        {
          scenario: 'Regulatory challenges emerge',
          probability: 0.3,
          impact: 'Growth moderation with increased oversight'
        }
      ]
    },
    actionableInsights: [
      {
        insight: 'Explore Southeast Asian digital market entry',
        action: 'Research partnership opportunities with local fintech companies',
        priority: 'medium'
      },
      {
        insight: 'Monitor digital payment trends',
        action: 'Assess impact on traditional banking services',
        priority: 'low'
      }
    ],
    tags: ['digital-economy', 'fintech', 'e-commerce', 'southeast-asia'],
    status: 'active'
  },
  {
    title: "Arctic Shipping Route Development",
    description: "Climate change opens new Arctic shipping routes, reducing transit times between Asia and Europe. Russia and China announce joint infrastructure development.",
    summary: "Melting Arctic ice creates new shipping opportunities, raising geopolitical and environmental concerns",
    eventDate: new Date('2024-01-25'),
    categories: ['Climate Change', 'Shipping', 'Infrastructure'],
    regions: ['Arctic', 'Asia', 'Europe'],
    countries: ['Russia', 'China', 'Norway', 'Canada'],
    severity: 'medium',
    impact: {
      economic: 'positive',
      political: 'neutral',
      social: 'negative'
    },
    source: {
      name: 'Arctic Council',
      url: 'https://arctic-council.org/shipping',
      reliability: 'high'
    },
    historicalContext: {
      hasHappenedBefore: false,
      previousOccurrences: [],
      similarPatterns: [
        {
          pattern: 'Suez Canal development',
          description: 'Similar strategic shipping route development'
        }
      ]
    },
    predictiveAnalytics: {
      likelihood: 0.6,
      timeframe: 'long-term',
      scenarios: [
        {
          scenario: 'Gradual route development',
          probability: 0.5,
          impact: 'New shipping options with environmental risks'
        },
        {
          scenario: 'Rapid development with conflicts',
          probability: 0.3,
          impact: 'Geopolitical tensions and environmental damage'
        }
      ]
    },
    actionableInsights: [
      {
        insight: 'Monitor Arctic shipping developments',
        action: 'Assess potential impact on global supply chains',
        priority: 'low'
      },
      {
        insight: 'Consider environmental implications',
        action: 'Evaluate sustainability of Arctic shipping options',
        priority: 'low'
      }
    ],
    tags: ['arctic', 'shipping', 'climate-change', 'infrastructure'],
    status: 'active'
  },
  {
    title: "Global Semiconductor Supply Chain Restructuring",
    description: "Major semiconductor manufacturers announce plans to diversify production away from Taiwan and China. New facilities planned in US, Europe, and Japan.",
    summary: "Semiconductor industry restructuring creates new manufacturing hubs and supply chain resilience",
    eventDate: new Date('2024-02-12'),
    categories: ['Technology', 'Manufacturing', 'Supply Chain'],
    regions: ['Global'],
    countries: ['United States', 'Japan', 'Germany', 'Taiwan', 'South Korea'],
    severity: 'high',
    impact: {
      economic: 'positive',
      political: 'positive',
      social: 'neutral'
    },
    source: {
      name: 'TechCrunch',
      url: 'https://techcrunch.com/semiconductor-restructuring',
      reliability: 'medium'
    },
    historicalContext: {
      hasHappenedBefore: false,
      previousOccurrences: [],
      similarPatterns: [
        {
          pattern: 'Automotive supply chain diversification',
          description: 'Similar industry restructuring for resilience'
        }
      ]
    },
    predictiveAnalytics: {
      likelihood: 0.8,
      timeframe: 'medium-term',
      scenarios: [
        {
          scenario: 'Successful diversification',
          probability: 0.6,
          impact: 'Improved supply chain resilience and new opportunities'
        },
        {
          scenario: 'Cost increases and delays',
          probability: 0.4,
          impact: 'Higher production costs but greater security'
        }
      ]
    },
    actionableInsights: [
      {
        insight: 'Plan for semiconductor supply chain changes',
        action: 'Identify new supplier relationships and opportunities',
        priority: 'high'
      },
      {
        insight: 'Monitor technology transfer developments',
        action: 'Track intellectual property and manufacturing partnerships',
        priority: 'medium'
      }
    ],
    tags: ['semiconductors', 'manufacturing', 'supply-chain', 'technology'],
    status: 'active'
  },
  {
    title: "European Green Hydrogen Initiative Launch",
    description: "EU announces €100 billion investment in green hydrogen infrastructure. Major energy companies commit to hydrogen production and distribution networks.",
    summary: "European Union launches major green hydrogen initiative to accelerate energy transition",
    eventDate: new Date('2024-02-20'),
    categories: ['Energy', 'Climate Change', 'Infrastructure'],
    regions: ['Europe'],
    countries: ['Germany', 'France', 'Netherlands', 'Spain', 'Italy'],
    severity: 'medium',
    impact: {
      economic: 'positive',
      political: 'positive',
      social: 'positive'
    },
    source: {
      name: 'European Commission',
      url: 'https://ec.europa.eu/green-hydrogen',
      reliability: 'high'
    },
    historicalContext: {
      hasHappenedBefore: false,
      previousOccurrences: [],
      similarPatterns: [
        {
          pattern: 'Renewable energy subsidies',
          description: 'Similar government-led energy transition initiatives'
        }
      ]
    },
    predictiveAnalytics: {
      likelihood: 0.9,
      timeframe: 'long-term',
      scenarios: [
        {
          scenario: 'Successful hydrogen economy development',
          probability: 0.5,
          impact: 'New energy markets and reduced emissions'
        },
        {
          scenario: 'Gradual adoption with challenges',
          probability: 0.4,
          impact: 'Moderate progress with some delays'
        }
      ]
    },
    actionableInsights: [
      {
        insight: 'Explore hydrogen economy opportunities',
        action: 'Research potential partnerships in hydrogen production or distribution',
        priority: 'medium'
      },
      {
        insight: 'Monitor energy transition investments',
        action: 'Track developments in clean energy infrastructure',
        priority: 'low'
      }
    ],
    tags: ['green-hydrogen', 'energy-transition', 'climate-policy', 'infrastructure'],
    status: 'active'
  }
];

module.exports = sampleEvents; 
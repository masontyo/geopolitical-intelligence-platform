// Map language configuration and internationalization utilities

// Available tile providers with different language focuses
export const MAP_TILE_PROVIDERS = {
  // Standard OpenStreetMap (mixed languages, local names)
  standard: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    description: "Standard map with local country names"
  },
  
  // Humanitarian style (cleaner, more English-focused)
  humanitarian: {
    url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="https://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>',
    description: "Humanitarian style with cleaner labels"
  },
  
  // CartoDB Positron (minimal, English-focused)
  positron: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    description: "Clean, minimal style with English labels"
  }
};

// Country name translations (for risk data and popups)
export const COUNTRY_NAMES = {
  en: {
    'United States': 'United States',
    'China': 'China',
    'Russia': 'Russia',
    'Ukraine': 'Ukraine',
    'Iran': 'Iran',
    'Germany': 'Germany',
    'Japan': 'Japan',
    'India': 'India',
    'Brazil': 'Brazil',
    'Australia': 'Australia',
    'United Kingdom': 'United Kingdom',
    'France': 'France',
    'North Korea': 'North Korea',
    'South Africa': 'South Africa',
    'Canada': 'Canada',
    'Mexico': 'Mexico',
    'Egypt': 'Egypt',
    'Turkey': 'Turkey',
    'Saudi Arabia': 'Saudi Arabia',
    'Venezuela': 'Venezuela'
  },
  es: {
    'United States': 'Estados Unidos',
    'China': 'China',
    'Russia': 'Rusia',
    'Ukraine': 'Ucrania',
    'Iran': 'Irán',
    'Germany': 'Alemania',
    'Japan': 'Japón',
    'India': 'India',
    'Brazil': 'Brasil',
    'Australia': 'Australia',
    'United Kingdom': 'Reino Unido',
    'France': 'Francia',
    'North Korea': 'Corea del Norte',
    'South Africa': 'Sudáfrica',
    'Canada': 'Canadá',
    'Mexico': 'México',
    'Egypt': 'Egipto',
    'Turkey': 'Turquía',
    'Saudi Arabia': 'Arabia Saudí',
    'Venezuela': 'Venezuela'
  },
  fr: {
    'United States': 'États-Unis',
    'China': 'Chine',
    'Russia': 'Russie',
    'Ukraine': 'Ukraine',
    'Iran': 'Iran',
    'Germany': 'Allemagne',
    'Japan': 'Japon',
    'India': 'Inde',
    'Brazil': 'Brésil',
    'Australia': 'Australie',
    'United Kingdom': 'Royaume-Uni',
    'France': 'France',
    'North Korea': 'Corée du Nord',
    'South Africa': 'Afrique du Sud',
    'Canada': 'Canada',
    'Mexico': 'Mexique',
    'Egypt': 'Égypte',
    'Turkey': 'Turquie',
    'Saudi Arabia': 'Arabie Saoudite',
    'Venezuela': 'Venezuela'
  }
};

// UI text translations
export const UI_TEXT = {
  en: {
    title: 'Global Risk Assessment Map',
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    totalEvents: 'Total Events',
    riskScore: 'Risk Score',
    activeEvents: 'Active Events',
    coordinates: 'Coordinates',
    riskLevel: 'Risk Level',
    refresh: 'Refresh'
  },
  es: {
    title: 'Mapa de Evaluación de Riesgo Global',
    critical: 'Crítico',
    high: 'Alto',
    medium: 'Medio',
    low: 'Bajo',
    totalEvents: 'Eventos Totales',
    riskScore: 'Puntuación de Riesgo',
    activeEvents: 'Eventos Activos',
    coordinates: 'Coordenadas',
    riskLevel: 'Nivel de Riesgo',
    refresh: 'Actualizar'
  },
  fr: {
    title: 'Carte d\'Évaluation des Risques Globaux',
    critical: 'Critique',
    high: 'Élevé',
    medium: 'Moyen',
    low: 'Faible',
    totalEvents: 'Événements Totaux',
    riskScore: 'Score de Risque',
    activeEvents: 'Événements Actifs',
    coordinates: 'Coordonnées',
    riskLevel: 'Niveau de Risque',
    refresh: 'Actualiser'
  }
};

// Get user's preferred language (defaults to English)
export const getUserLanguage = () => {
  // Check browser language
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.split('-')[0]; // Get just the language part (e.g., 'en' from 'en-US')
  
  // Return language if we support it, otherwise default to English
  return Object.keys(COUNTRY_NAMES).includes(langCode) ? langCode : 'en';
};

// Get translated country name
export const getCountryName = (countryKey, language = 'en') => {
  return COUNTRY_NAMES[language]?.[countryKey] || countryKey;
};

// Get translated UI text
export const getUIText = (key, language = 'en') => {
  return UI_TEXT[language]?.[key] || UI_TEXT.en[key];
};

// Get recommended tile provider for language
export const getRecommendedTileProvider = (language = 'en') => {
  // For English, use the cleaner Positron style
  // For other languages, use standard OSM which shows more local names
  return language === 'en' ? MAP_TILE_PROVIDERS.positron : MAP_TILE_PROVIDERS.standard;
};


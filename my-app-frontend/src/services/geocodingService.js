// Geocoding service to convert addresses to coordinates
// Uses OpenStreetMap Nominatim API (free, no API key required)

const GEOCODING_BASE_URL = 'https://nominatim.openstreetmap.org/search';

// Cache for geocoding results to avoid repeated API calls
const geocodingCache = new Map();

export const geocodeAddress = async (address, country = '') => {
  // Create cache key
  const cacheKey = `${address}, ${country}`.toLowerCase();
  
  // Check cache first
  if (geocodingCache.has(cacheKey)) {
    return geocodingCache.get(cacheKey);
  }

  try {
    // Construct search query
    const query = country ? `${address}, ${country}` : address;
    const encodedQuery = encodeURIComponent(query);
    
    const response = await fetch(
      `${GEOCODING_BASE_URL}?q=${encodedQuery}&format=json&limit=1&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'GeopoliticalIntelligencePlatform/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        address: data[0].display_name,
        confidence: data[0].importance || 0.5
      };
      
      // Cache the result
      geocodingCache.set(cacheKey, result);
      
      return result;
    } else {
      // No results found
      const fallbackResult = getFallbackCoordinates(country);
      geocodingCache.set(cacheKey, fallbackResult);
      return fallbackResult;
    }
  } catch (error) {
    console.warn(`Geocoding failed for "${address}, ${country}":`, error.message);
    
    // Return fallback coordinates based on country
    const fallbackResult = getFallbackCoordinates(country);
    geocodingCache.set(cacheKey, fallbackResult);
    return fallbackResult;
  }
};

// Fallback coordinates for common countries/locations
const getFallbackCoordinates = (country) => {
  const countryCoordinates = {
    'china': [35.8617, 104.1954],
    'united states': [39.8283, -98.5795],
    'germany': [51.1657, 10.4515],
    'japan': [36.2048, 138.2529],
    'united kingdom': [55.3781, -3.4360],
    'france': [46.6034, 1.8883],
    'india': [20.5937, 78.9629],
    'brazil': [-14.2350, -51.9253],
    'canada': [56.1304, -106.3468],
    'australia': [-25.2744, 133.7751],
    'south korea': [35.9078, 127.7669],
    'italy': [41.8719, 12.5674],
    'spain': [40.4637, -3.7492],
    'mexico': [23.6345, -102.5528],
    'russia': [61.5240, 105.3188],
    'singapore': [1.3521, 103.8198],
    'netherlands': [52.1326, 5.2913],
    'belgium': [50.5039, 4.4699],
    'switzerland': [46.8182, 8.2275],
    'austria': [47.5162, 14.5501],
    'poland': [51.9194, 19.1451],
    'czech republic': [49.8175, 15.4730],
    'hungary': [47.1625, 19.5033],
    'romania': [45.9432, 24.9668],
    'bulgaria': [42.7339, 25.4858],
    'greece': [39.0742, 21.8243],
    'portugal': [39.3999, -8.2245],
    'ireland': [53.4129, -8.2439],
    'denmark': [56.2639, 9.5018],
    'sweden': [60.1282, 18.6435],
    'norway': [60.4720, 8.4689],
    'finland': [61.9241, 25.7482],
    'thailand': [15.8700, 100.9925],
    'vietnam': [14.0583, 108.2772],
    'indonesia': [-0.7893, 113.9213],
    'malaysia': [4.2105, 101.9758],
    'philippines': [12.8797, 121.7740],
    'taiwan': [23.6978, 120.9605],
    'hong kong': [22.3193, 114.1694],
    'south africa': [-30.5595, 22.9375],
    'egypt': [26.0975, 30.0444],
    'turkey': [38.9637, 35.2433],
    'israel': [31.0461, 34.8516],
    'saudi arabia': [23.8859, 45.0792],
    'uae': [23.4241, 53.8478],
    'argentina': [-38.4161, -63.6167],
    'chile': [-35.6751, -71.5430],
    'colombia': [4.5709, -74.2973],
    'peru': [-9.1900, -75.0152],
    'venezuela': [6.4238, -66.5897],
    'ukraine': [48.3794, 31.1656],
    'pakistan': [30.3753, 69.3451],
    'bangladesh': [23.6850, 90.3563],
    'sri lanka': [7.8731, 80.7718],
    'nepal': [28.3949, 84.1240],
    'myanmar': [21.9162, 95.9560],
    'cambodia': [12.5657, 104.9910],
    'laos': [19.8563, 102.4955],
    'mongolia': [46.8625, 103.8467],
    'kazakhstan': [48.0196, 66.9237],
    'uzbekistan': [41.3775, 64.5853],
    'kyrgyzstan': [41.2044, 74.7661],
    'tajikistan': [38.8610, 71.2761],
    'afghanistan': [33.9391, 67.7100],
    'iran': [32.4279, 53.6880],
    'iraq': [33.2232, 43.6793],
    'syria': [34.8021, 38.9968],
    'lebanon': [33.8547, 35.8623],
    'jordan': [30.5852, 36.2384],
    'kuwait': [29.3117, 47.4818],
    'qatar': [25.3548, 51.1839],
    'bahrain': [25.9304, 50.6378],
    'oman': [21.4735, 55.9754],
    'yemen': [15.5527, 48.5164],
    'ethiopia': [9.1450, 40.4897],
    'kenya': [-0.0236, 37.9062],
    'nigeria': [9.0820, 8.6753],
    'ghana': [7.9465, -1.0232],
    'morocco': [31.6295, -7.9811],
    'algeria': [28.0339, 1.6596],
    'tunisia': [33.8869, 9.5375],
    'libya': [26.3351, 17.2283],
    'sudan': [12.8628, 30.2176],
    'chad': [15.4542, 18.7322],
    'niger': [17.6078, 8.0817],
    'mali': [17.5707, -3.9962],
    'burkina faso': [12.2383, -1.5616],
    'senegal': [14.4974, -14.4524],
    'guinea': [9.6412, -10.1314],
    'sierra leone': [8.4606, -11.7799],
    'liberia': [6.4281, -9.4295],
    'ivory coast': [7.5400, -5.5471],
    'togo': [8.6195, 0.8248],
    'benin': [9.3077, 2.3158],
    'cameroon': [7.3697, 12.3547],
    'central african republic': [6.6111, 20.9394],
    'democratic republic of the congo': [-4.0383, 21.7587],
    'republic of the congo': [-0.2280, 15.8277],
    'gabon': [-0.8037, 11.6094],
    'equatorial guinea': [1.6508, 10.2679],
    'sao tome and principe': [0.1864, 6.6131],
    'angola': [-11.2027, 17.8739],
    'zambia': [-13.1339, 27.8493],
    'zimbabwe': [-19.0154, 29.1549],
    'botswana': [-22.3285, 24.6849],
    'namibia': [-22.9576, 18.4904],
    'lesotho': [-29.6100, 28.2336],
    'swaziland': [-26.5225, 31.4659],
    'madagascar': [-18.7669, 46.8691],
    'mauritius': [-20.3484, 57.5522],
    'seychelles': [-4.6796, 55.4920],
    'comoros': [-11.8750, 43.8722],
    'djibouti': [11.8251, 42.5903],
    'somalia': [5.1521, 46.1996],
    'eritrea': [15.1794, 39.7823],
    'uganda': [1.3733, 32.2903],
    'tanzania': [-6.3690, 34.8888],
    'rwanda': [-1.9403, 29.8739],
    'burundi': [-3.3731, 29.9189],
    'malawi': [-13.2543, 34.3015],
    'mozambique': [-18.6657, 35.5296],
    'zambia': [-13.1339, 27.8493],
    'zimbabwe': [-19.0154, 29.1549],
    'botswana': [-22.3285, 24.6849],
    'namibia': [-22.9576, 18.4904],
    'lesotho': [-29.6100, 28.2336],
    'swaziland': [-26.5225, 31.4659],
    'madagascar': [-18.7669, 46.8691],
    'mauritius': [-20.3484, 57.5522],
    'seychelles': [-4.6796, 55.4920],
    'comoros': [-11.8750, 43.8722],
    'djibouti': [11.8251, 42.5903],
    'somalia': [5.1521, 46.1996],
    'eritrea': [15.1794, 39.7823],
    'uganda': [1.3733, 32.2903],
    'tanzania': [-6.3690, 34.8888],
    'rwanda': [-1.9403, 29.8739],
    'burundi': [-3.3731, 29.9189],
    'malawi': [-13.2543, 34.3015],
    'mozambique': [-18.6657, 35.5296]
  };

  const countryKey = country.toLowerCase();
  const coordinates = countryCoordinates[countryKey] || [0, 0]; // Default to 0,0 if country not found
  
  return {
    lat: coordinates[0],
    lng: coordinates[1],
    address: `${country} (approximate)`,
    confidence: 0.3 // Low confidence for fallback coordinates
  };
};

// Batch geocode multiple addresses
export const geocodeAddresses = async (addresses) => {
  const results = await Promise.allSettled(
    addresses.map(async (addressData) => {
      const { address, country } = addressData;
      const coordinates = await geocodeAddress(address, country);
      return {
        ...addressData,
        coordinates: [coordinates.lat, coordinates.lng],
        geocodedAddress: coordinates.address,
        confidence: coordinates.confidence
      };
    })
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.warn(`Failed to geocode address ${index}:`, result.reason);
      const fallback = getFallbackCoordinates(addresses[index].country);
      return {
        ...addresses[index],
        coordinates: [fallback.lat, fallback.lng],
        geocodedAddress: fallback.address,
        confidence: fallback.confidence
      };
    }
  });
};

// Get coordinates for common port names
export const geocodePort = async (portName, country = '') => {
  // Common port patterns
  const portPatterns = {
    'port of': 'port',
    'harbor': 'harbor',
    'harbour': 'harbour',
    'terminal': 'terminal',
    'dock': 'dock'
  };

  // Try different variations
  const variations = [
    portName,
    `${portName}, ${country}`,
    `Port of ${portName}`,
    `${portName} Port`,
    `${portName} Harbor`,
    `${portName} Terminal`
  ];

  for (const variation of variations) {
    try {
      const result = await geocodeAddress(variation, country);
      if (result.confidence > 0.4) {
        return result;
      }
    } catch (error) {
      continue;
    }
  }

  // If all variations fail, return fallback
  return getFallbackCoordinates(country);
};

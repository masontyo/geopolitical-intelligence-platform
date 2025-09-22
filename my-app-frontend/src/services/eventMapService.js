// Event-Map Integration Service
// Handles mapping between events and geographic locations

// Country coordinate mapping (subset for performance)
export const countryCoordinates = {
  'United States': [39.8283, -98.5795],
  'China': [35.8617, 104.1954],
  'Russia': [61.5240, 105.3188],
  'Ukraine': [48.3794, 31.1656],
  'Iran': [32.4279, 53.6880],
  'Germany': [51.1657, 10.4515],
  'Japan': [36.2048, 138.2529],
  'India': [20.5937, 78.9629],
  'United Kingdom': [55.3781, -3.4360],
  'France': [46.2276, 2.2137],
  'Brazil': [-14.2350, -51.9253],
  'Canada': [56.1304, -106.3468],
  'Australia': [-25.2744, 133.7751],
  'South Korea': [35.9078, 127.7669],
  'Italy': [41.8719, 12.5674],
  'Spain': [40.4637, -3.7492],
  'Mexico': [23.6345, -102.5528],
  'Indonesia': [-0.7893, 113.9213],
  'Netherlands': [52.1326, 5.2913],
  'Saudi Arabia': [23.8859, 45.0792],
  'Turkey': [38.9637, 35.2433],
  'Switzerland': [46.8182, 8.2275],
  'Belgium': [50.5039, 4.4699],
  'Israel': [31.0461, 34.8516],
  'Poland': [51.9194, 19.1451],
  'Argentina': [-38.4161, -63.6167],
  'South Africa': [-30.5595, 22.9375],
  'Egypt': [26.0975, 34.8958],
  'Nigeria': [9.0820, 8.6753],
  'Thailand': [15.8700, 100.9925],
  'Vietnam': [14.0583, 108.2772],
  'Malaysia': [4.2105, 101.9758],
  'Philippines': [12.8797, 121.7740],
  'Singapore': [1.3521, 103.8198],
  'New Zealand': [-40.9006, 174.8860],
  'Chile': [-35.6751, -71.5430],
  'Peru': [-9.1900, -75.0152],
  'Colombia': [4.5709, -74.2973],
  'Venezuela': [6.4238, -66.5897],
  'Pakistan': [30.3753, 69.3451],
  'Bangladesh': [23.6850, 90.3563],
  'Afghanistan': [33.9391, 67.7100],
  'Iraq': [33.2232, 43.6793],
  'Syria': [34.8021, 38.9968],
  'Jordan': [30.5852, 36.2384],
  'Lebanon': [33.8547, 35.8623],
  'Kuwait': [29.3117, 47.4818],
  'UAE': [23.4241, 53.8478],
  'Qatar': [25.3548, 51.1839],
  'Oman': [21.4735, 55.9754],
  'Yemen': [30.5852, 36.2384],
  'Ethiopia': [9.1450, 40.4897],
  'Kenya': [-0.0236, 37.9062],
  'Morocco': [31.6295, -7.9811],
  'Algeria': [28.0339, 1.6596],
  'Libya': [26.3351, 17.2283],
  'Tunisia': [33.8869, 9.5375],
  'Sudan': [12.8628, 30.2176],
  'Ghana': [7.9465, -1.0232],
  'Tanzania': [-6.3690, 34.8888],
  'Uganda': [1.3733, 32.2903],
  'Angola': [-11.2027, 17.8739],
  'Mozambique': [-18.6657, 35.5296],
  'Madagascar': [-18.7669, 46.8691],
  'Botswana': [-22.3285, 24.6849],
  'Namibia': [-22.9576, 18.4904],
  'Zimbabwe': [-19.0154, 29.1549],
  'Zambia': [-13.1339, 27.8493],
  'Malawi': [-13.2543, 34.3015],
  'Senegal': [14.4974, -14.4524],
  'Mali': [17.5707, -3.9962],
  'Burkina Faso': [12.2383, -1.5616],
  'Niger': [17.6078, 8.0817],
  'Chad': [15.4542, 18.7322],
  'Cameroon': [7.3697, 12.3547],
  'Central African Republic': [6.6111, 20.9394],
  'Democratic Republic of Congo': [-4.0383, 21.7587],
  'Republic of Congo': [-0.2280, 15.8277],
  'Gabon': [-0.8037, 11.6094],
  'Equatorial Guinea': [1.6508, 10.2679],
  'São Tomé and Príncipe': [0.1864, 6.6131],
  'Rwanda': [-1.9403, 29.8739],
  'Burundi': [-3.3731, 29.9189],
  'Djibouti': [11.8251, 42.5903],
  'Eritrea': [15.1794, 39.7823],
  'Somalia': [5.1521, 46.1996],
  'South Sudan': [6.8770, 31.3070],
  'Lesotho': [-29.6100, 28.2336],
  'Eswatini': [-26.5225, 31.4659],
  'Cape Verde': [16.5388, -24.0132],
  'Comoros': [-11.6455, 43.3333],
  'Mauritius': [-20.3484, 57.5522],
  'Seychelles': [-4.6796, 55.4920],
  'Gambia': [13.4432, -15.3101],
  'Guinea-Bissau': [11.8037, -15.1804],
  'Guinea': [9.6412, -10.9374],
  'Sierra Leone': [8.4606, -11.7799],
  'Liberia': [6.4281, -9.4295],
  'Ivory Coast': [7.5400, -5.5471],
  'Togo': [8.6195, 0.8248],
  'Benin': [9.3077, 2.3158],
  'Mauritania': [21.0079, -10.9408],
  'Western Sahara': [24.2155, -12.8858],
  'Albania': [41.1533, 20.1683],
  'Austria': [47.5162, 14.5501],
  'Belarus': [53.7098, 27.9534],
  'Bosnia and Herzegovina': [43.9159, 17.6791],
  'Bulgaria': [42.7339, 25.4858],
  'Croatia': [45.1000, 15.2000],
  'Cyprus': [35.1264, 33.4299],
  'Czech Republic': [49.8175, 15.4730],
  'Denmark': [56.2639, 9.5018],
  'Estonia': [58.5953, 25.0136],
  'Finland': [61.9241, 25.7482],
  'Greece': [39.0742, 21.8243],
  'Hungary': [47.1625, 19.5033],
  'Iceland': [64.9631, -19.0208],
  'Ireland': [53.4129, -8.2439],
  'Latvia': [56.8796, 24.6032],
  'Lithuania': [55.1694, 23.8813],
  'Luxembourg': [49.8153, 6.1296],
  'Malta': [35.9375, 14.3754],
  'Moldova': [47.4116, 28.3699],
  'Monaco': [43.7384, 7.4246],
  'Montenegro': [42.7087, 19.3744],
  'North Macedonia': [41.6086, 21.7453],
  'Norway': [60.4720, 8.4689],
  'Portugal': [39.3999, -8.2245],
  'Romania': [45.9432, 24.9668],
  'San Marino': [43.9424, 12.4578],
  'Serbia': [44.0165, 21.0059],
  'Slovakia': [48.6690, 19.6990],
  'Slovenia': [46.1512, 14.9955],
  'Sweden': [60.1282, 18.6435],
  'Vatican City': [41.9029, 12.4534],
  'Kazakhstan': [48.0196, 66.9237],
  'Kyrgyzstan': [41.2044, 74.7661],
  'Tajikistan': [38.8610, 71.2761],
  'Turkmenistan': [38.9697, 59.5563],
  'Uzbekistan': [41.3775, 64.5853],
  'Mongolia': [46.8625, 103.8467],
  'North Korea': [40.3399, 127.5101],
  'Taiwan': [23.6978, 120.9605],
  'Hong Kong': [22.3193, 114.1694],
  'Macau': [22.1987, 113.5439],
  'Myanmar': [21.9162, 95.9560],
  'Laos': [19.8563, 102.4955],
  'Cambodia': [12.5657, 104.9910],
  'Brunei': [4.5353, 114.7277],
  'East Timor': [-8.8742, 125.7275],
  'Papua New Guinea': [-6.3149, 143.9555],
  'Fiji': [-16.5788, 179.4144],
  'Solomon Islands': [-9.6457, 160.1562],
  'Vanuatu': [-15.3767, 166.9592],
  'Samoa': [-13.7590, -172.1046],
  'Tonga': [-21.1789, -175.1982],
  'Kiribati': [-3.3704, -168.7340],
  'Tuvalu': [-7.1095, 177.6493],
  'Nauru': [-0.5228, 166.9315],
  'Palau': [7.5150, 134.5825],
  'Marshall Islands': [7.1315, 171.1845],
  'Micronesia': [7.4256, 150.5508],
  'Guam': [13.4443, 144.7937],
  'Northern Mariana Islands': [17.3308, 145.3846],
  'American Samoa': [-14.2710, -170.1322],
  'Cook Islands': [-21.2367, -159.7777],
  'French Polynesia': [-17.6797, -149.4068],
  'New Caledonia': [-20.9043, 165.6180],
  'Pitcairn Islands': [-24.7036, -127.4393],
  'Wallis and Futuna': [-13.7683, -177.1561],
  'Niue': [-19.0544, -169.8672],
  'Tokelau': [-8.9674, -171.8559],
  'Cuba': [21.5218, -77.7812],
  'Jamaica': [18.1096, -77.2975],
  'Haiti': [18.9712, -72.2852],
  'Dominican Republic': [18.7357, -70.1627],
  'Puerto Rico': [18.2208, -66.5901],
  'Trinidad and Tobago': [10.6918, -61.2225],
  'Barbados': [13.1939, -59.5432],
  'Saint Lucia': [13.9094, -60.9789],
  'Saint Vincent and the Grenadines': [12.9843, -61.2872],
  'Grenada': [12.2626, -61.6019],
  'Antigua and Barbuda': [17.0608, -61.7964],
  'Saint Kitts and Nevis': [17.3578, -62.7829],
  'Dominica': [15.4150, -61.3710],
  'Belize': [17.1899, -88.4976],
  'Costa Rica': [9.7489, -83.7534],
  'El Salvador': [13.7942, -88.8965],
  'Guatemala': [15.7835, -90.2308],
  'Honduras': [15.2000, -86.2419],
  'Nicaragua': [12.2650, -85.2072],
  'Panama': [8.5380, -80.7821],
  'Bahamas': [25.0343, -77.3963],
  'Bermuda': [32.3078, -64.7505],
  'Cayman Islands': [19.3133, -81.2546],
  'Turks and Caicos Islands': [21.6940, -71.7979],
  'British Virgin Islands': [18.4207, -64.6399],
  'US Virgin Islands': [18.3358, -64.8963],
  'Anguilla': [18.2206, -63.0686],
  'Montserrat': [16.7425, -62.1874],
  'Saint Martin': [18.0708, -63.0501],
  'Sint Maarten': [18.0425, -63.0548],
  'Aruba': [12.5211, -69.9683],
  'Curaçao': [12.1696, -68.9900],
  'Bonaire': [12.1784, -68.2385],
  'French Guiana': [3.9339, -53.1258],
  'Guyana': [4.8604, -58.9302],
  'Suriname': [3.9193, -55.8778],
  'Falkland Islands': [-51.7963, -59.5236],
  'South Georgia and the South Sandwich Islands': [-54.4296, -36.5879],
  'Antarctica': [-75.2509, -0.0713],
  'Greenland': [71.7069, -42.6043],
  'Faroe Islands': [61.8926, -6.9118],
  'Svalbard and Jan Mayen': [77.5536, 23.6703],
  'Bouvet Island': [-54.4208, 3.3464],
  'Heard Island and McDonald Islands': [-53.0818, 73.5042],
  'French Southern Territories': [-49.2804, 69.3486],
  'British Indian Ocean Territory': [-6.0000, 71.5000],
  'Christmas Island': [-10.4475, 105.6904],
  'Cocos Islands': [-12.1642, 96.8710],
  'Norfolk Island': [-29.0408, 167.9547],
  'Ashmore and Cartier Islands': [-12.2583, 123.0417],
  'Coral Sea Islands': [-18.0000, 152.0000],
  'Lord Howe Island': [-31.5533, 159.0825],
  'Macquarie Island': [-54.5000, 158.9500],
  'Tasmania': [-41.4545, 145.9707]
};

// Region to countries mapping
export const regionCountries = {
  'North America': ['United States', 'Canada', 'Mexico', 'Guatemala', 'Belize', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica', 'Panama', 'Cuba', 'Jamaica', 'Haiti', 'Dominican Republic', 'Puerto Rico', 'Trinidad and Tobago', 'Barbados', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Grenada', 'Antigua and Barbuda', 'Saint Kitts and Nevis', 'Dominica', 'Bahamas', 'Bermuda', 'Cayman Islands', 'Turks and Caicos Islands', 'British Virgin Islands', 'US Virgin Islands', 'Anguilla', 'Montserrat', 'Saint Martin', 'Sint Maarten', 'Aruba', 'Curaçao', 'Bonaire', 'French Guiana', 'Guyana', 'Suriname', 'Falkland Islands', 'South Georgia and the South Sandwich Islands', 'Greenland', 'Faroe Islands', 'Svalbard and Jan Mayen', 'Bouvet Island', 'Heard Island and McDonald Islands', 'French Southern Territories', 'British Indian Ocean Territory', 'Christmas Island', 'Cocos Islands', 'Norfolk Island', 'Ashmore and Cartier Islands', 'Coral Sea Islands', 'Lord Howe Island', 'Macquarie Island', 'Tasmania'],
  'South America': ['Brazil', 'Argentina', 'Chile', 'Peru', 'Colombia', 'Venezuela', 'Ecuador', 'Bolivia', 'Paraguay', 'Uruguay', 'Guyana', 'Suriname', 'French Guiana'],
  'Europe': ['Germany', 'France', 'Italy', 'Spain', 'United Kingdom', 'Poland', 'Romania', 'Netherlands', 'Belgium', 'Greece', 'Czech Republic', 'Portugal', 'Sweden', 'Hungary', 'Austria', 'Belarus', 'Switzerland', 'Bulgaria', 'Serbia', 'Denmark', 'Finland', 'Slovakia', 'Norway', 'Ireland', 'Croatia', 'Bosnia and Herzegovina', 'Albania', 'Lithuania', 'Slovenia', 'Latvia', 'Estonia', 'North Macedonia', 'Moldova', 'Luxembourg', 'Malta', 'Iceland', 'Montenegro', 'Cyprus', 'Andorra', 'San Marino', 'Vatican City', 'Liechtenstein', 'Monaco'],
  'Asia': ['China', 'India', 'Japan', 'South Korea', 'Indonesia', 'Thailand', 'Vietnam', 'Philippines', 'Malaysia', 'Myanmar', 'Cambodia', 'Laos', 'Singapore', 'Brunei', 'East Timor', 'Mongolia', 'North Korea', 'Taiwan', 'Hong Kong', 'Macau', 'Kazakhstan', 'Kyrgyzstan', 'Tajikistan', 'Turkmenistan', 'Uzbekistan', 'Afghanistan', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Maldives', 'Nepal', 'Bhutan'],
  'Middle East': ['Saudi Arabia', 'Iran', 'Iraq', 'Turkey', 'Israel', 'Jordan', 'Lebanon', 'Syria', 'Kuwait', 'UAE', 'Qatar', 'Bahrain', 'Oman', 'Yemen', 'Palestine'],
  'Africa': ['Nigeria', 'Ethiopia', 'Egypt', 'South Africa', 'Kenya', 'Tanzania', 'Uganda', 'Algeria', 'Sudan', 'Morocco', 'Angola', 'Mozambique', 'Ghana', 'Madagascar', 'Cameroon', 'Niger', 'Burkina Faso', 'Mali', 'Malawi', 'Zambia', 'Somalia', 'Senegal', 'Chad', 'Zimbabwe', 'Guinea', 'Rwanda', 'Benin', 'Burundi', 'Tunisia', 'South Sudan', 'Togo', 'Sierra Leone', 'Libya', 'Liberia', 'Central African Republic', 'Mauritania', 'Eritrea', 'Gambia', 'Botswana', 'Gabon', 'Lesotho', 'Guinea-Bissau', 'Equatorial Guinea', 'Mauritius', 'Eswatini', 'Djibouti', 'Fiji', 'Réunion', 'Comoros', 'Western Sahara', 'Cabo Verde', 'São Tomé and Príncipe', 'Seychelles'],
  'Oceania': ['Australia', 'New Zealand', 'Papua New Guinea', 'Fiji', 'Solomon Islands', 'Vanuatu', 'Samoa', 'Tonga', 'Kiribati', 'Micronesia', 'Marshall Islands', 'Palau', 'Tuvalu', 'Nauru'],
  'Global': Object.keys(countryCoordinates)
};

class EventMapService {
  constructor() {
    this.countryCoordinates = countryCoordinates;
    this.regionCountries = regionCountries;
  }

  /**
   * Process events to create map markers
   */
  processEventsToMarkers(events) {
    const markers = [];
    
    events.forEach(event => {
      // Handle countries
      if (event.countries && event.countries.length > 0) {
        event.countries.forEach(country => {
          const coords = this.countryCoordinates[country];
          if (coords) {
            markers.push({
              id: `${event.id}-${country}`,
              eventId: event.id,
              event,
              country,
              coordinates: coords,
              type: 'country'
            });
          }
        });
      }
      
      // Handle regions
      if (event.regions && event.regions.length > 0) {
        event.regions.forEach(region => {
          const regionCountries = this.regionCountries[region];
          if (regionCountries) {
            regionCountries.forEach(country => {
              const coords = this.countryCoordinates[country];
              if (coords) {
                markers.push({
                  id: `${event.id}-${region}-${country}`,
                  eventId: event.id,
                  event,
                  country,
                  region,
                  coordinates: coords,
                  type: 'region'
                });
              }
            });
          }
        });
      }
    });
    
    return markers;
  }

  /**
   * Group events by country for summary
   */
  groupEventsByCountry(events) {
    const grouped = {};
    
    events.forEach(event => {
      // Handle countries
      if (event.countries && event.countries.length > 0) {
        event.countries.forEach(country => {
          if (!grouped[country]) {
            grouped[country] = [];
          }
          grouped[country].push(event);
        });
      }
      
      // Handle regions
      if (event.regions && event.regions.length > 0) {
        event.regions.forEach(region => {
          const regionCountries = this.regionCountries[region];
          if (regionCountries) {
            regionCountries.forEach(country => {
              if (!grouped[country]) {
                grouped[country] = [];
              }
              grouped[country].push(event);
            });
          }
        });
      }
    });
    
    return grouped;
  }

  /**
   * Get events for a specific country
   */
  getEventsForCountry(events, country) {
    return events.filter(event => {
      // Check if event has specific country
      if (event.countries && event.countries.includes(country)) {
        return true;
      }
      
      // Check if event has region that includes country
      if (event.regions) {
        return event.regions.some(region => {
          const regionCountries = this.regionCountries[region];
          return regionCountries && regionCountries.includes(country);
        });
      }
      
      return false;
    });
  }

  /**
   * Get risk level for a country based on events
   */
  getCountryRiskLevel(events, country) {
    const countryEvents = this.getEventsForCountry(events, country);
    
    if (countryEvents.length === 0) {
      return { level: 'low', score: 0, events: 0 };
    }
    
    // Calculate risk based on severity and count
    const severityScores = { critical: 4, high: 3, medium: 2, low: 1 };
    const totalScore = countryEvents.reduce((sum, event) => {
      return sum + (severityScores[event.severity] || 1);
    }, 0);
    
    const averageScore = totalScore / countryEvents.length;
    const maxScore = Math.max(...countryEvents.map(e => severityScores[e.severity] || 1));
    
    let level = 'low';
    if (maxScore >= 4 || averageScore >= 3.5) {
      level = 'critical';
    } else if (maxScore >= 3 || averageScore >= 2.5) {
      level = 'high';
    } else if (maxScore >= 2 || averageScore >= 1.5) {
      level = 'medium';
    }
    
    return {
      level,
      score: Math.min(maxScore * 2.5, 10),
      events: countryEvents.length
    };
  }

  /**
   * Get map center and zoom for a country
   */
  getMapCenterForCountry(country) {
    const coords = this.countryCoordinates[country];
    if (coords) {
      return {
        center: coords,
        zoom: 6
      };
    }
    return {
      center: [20, 0],
      zoom: 2
    };
  }

  /**
   * Get map center and zoom for a region
   */
  getMapCenterForRegion(region) {
    const regionCoords = {
      'North America': [39.8283, -98.5795],
      'South America': [-14.2350, -51.9253],
      'Europe': [54.5260, 15.2551],
      'Asia': [34.0479, 100.6197],
      'Middle East': [25.0000, 45.0000],
      'Africa': [8.7832, 34.5085],
      'Oceania': [-25.2744, 133.7751],
      'Global': [20, 0]
    };
    
    const coords = regionCoords[region];
    if (coords) {
      return {
        center: coords,
        zoom: 4
      };
    }
    return {
      center: [20, 0],
      zoom: 2
    };
  }

  /**
   * Filter events by location
   */
  filterEventsByLocation(events, location, locationType = 'country') {
    if (locationType === 'country') {
      return this.getEventsForCountry(events, location);
    } else if (locationType === 'region') {
      return events.filter(event => 
        event.regions && event.regions.includes(location)
      );
    }
    return events;
  }

  /**
   * Get severity color for UI
   */
  getSeverityColor(severity) {
    const colors = {
      'critical': '#d32f2f',
      'high': '#f57c00',
      'medium': '#fbc02d',
      'low': '#388e3c'
    };
    return colors[severity] || '#757575';
  }

  /**
   * Get severity icon for UI
   */
  getSeverityIcon(severity) {
    const icons = {
      'critical': 'Error',
      'high': 'Warning',
      'medium': 'Info',
      'low': 'CheckCircle'
    };
    return icons[severity] || 'Timeline';
  }

  /**
   * Calculate event density for a region
   */
  calculateEventDensity(events, region) {
    const regionCountries = this.regionCountries[region];
    if (!regionCountries) return 0;
    
    const totalEvents = events.filter(event => {
      if (event.countries) {
        return event.countries.some(country => regionCountries.includes(country));
      }
      if (event.regions) {
        return event.regions.includes(region);
      }
      return false;
    }).length;
    
    return totalEvents / regionCountries.length;
  }

  /**
   * Get top countries by event count
   */
  getTopCountriesByEventCount(events, limit = 10) {
    const countryCounts = {};
    
    events.forEach(event => {
      if (event.countries) {
        event.countries.forEach(country => {
          countryCounts[country] = (countryCounts[country] || 0) + 1;
        });
      }
      
      if (event.regions) {
        event.regions.forEach(region => {
          const regionCountries = this.regionCountries[region];
          if (regionCountries) {
            regionCountries.forEach(country => {
              countryCounts[country] = (countryCounts[country] || 0) + 1;
            });
          }
        });
      }
    });
    
    return Object.entries(countryCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([country, count]) => ({ country, count }));
  }
}

export default new EventMapService();

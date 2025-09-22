import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Badge,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Warning,
  Error,
  CheckCircle,
  Info,
  LocationOn,
  Timeline,
  Event,
  Close,
  FilterList,
  Refresh
} from '@mui/icons-material';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { eventsAPI } from '../services/api';

// Fix for Leaflet markers in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Country coordinate mapping
const countryCoordinates = {
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
  'Yemen': [15.5527, 48.5164],
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
  'Niger': [17.5707, -3.9962],
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
  'South Korea': [35.9078, 127.7669],
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
  'Tasmania': [-41.4545, 145.9707],
  'Bouvet Island': [-54.4208, 3.3464],
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
const regionCountries = {
  'North America': ['United States', 'Canada', 'Mexico', 'Guatemala', 'Belize', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica', 'Panama', 'Cuba', 'Jamaica', 'Haiti', 'Dominican Republic', 'Puerto Rico', 'Trinidad and Tobago', 'Barbados', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Grenada', 'Antigua and Barbuda', 'Saint Kitts and Nevis', 'Dominica', 'Bahamas', 'Bermuda', 'Cayman Islands', 'Turks and Caicos Islands', 'British Virgin Islands', 'US Virgin Islands', 'Anguilla', 'Montserrat', 'Saint Martin', 'Sint Maarten', 'Aruba', 'Curaçao', 'Bonaire', 'French Guiana', 'Guyana', 'Suriname', 'Falkland Islands', 'South Georgia and the South Sandwich Islands', 'Greenland', 'Faroe Islands', 'Svalbard and Jan Mayen', 'Bouvet Island', 'Heard Island and McDonald Islands', 'French Southern Territories', 'British Indian Ocean Territory', 'Christmas Island', 'Cocos Islands', 'Norfolk Island', 'Ashmore and Cartier Islands', 'Coral Sea Islands', 'Lord Howe Island', 'Macquarie Island', 'Tasmania'],
  'South America': ['Brazil', 'Argentina', 'Chile', 'Peru', 'Colombia', 'Venezuela', 'Ecuador', 'Bolivia', 'Paraguay', 'Uruguay', 'Guyana', 'Suriname', 'French Guiana'],
  'Europe': ['Germany', 'France', 'Italy', 'Spain', 'United Kingdom', 'Poland', 'Romania', 'Netherlands', 'Belgium', 'Greece', 'Czech Republic', 'Portugal', 'Sweden', 'Hungary', 'Austria', 'Belarus', 'Switzerland', 'Bulgaria', 'Serbia', 'Denmark', 'Finland', 'Slovakia', 'Norway', 'Ireland', 'Croatia', 'Bosnia and Herzegovina', 'Albania', 'Lithuania', 'Slovenia', 'Latvia', 'Estonia', 'North Macedonia', 'Moldova', 'Luxembourg', 'Malta', 'Iceland', 'Montenegro', 'Cyprus', 'Andorra', 'San Marino', 'Vatican City', 'Liechtenstein', 'Monaco'],
  'Asia': ['China', 'India', 'Japan', 'South Korea', 'Indonesia', 'Thailand', 'Vietnam', 'Philippines', 'Malaysia', 'Myanmar', 'Cambodia', 'Laos', 'Singapore', 'Brunei', 'East Timor', 'Mongolia', 'North Korea', 'Taiwan', 'Hong Kong', 'Macau', 'Kazakhstan', 'Kyrgyzstan', 'Tajikistan', 'Turkmenistan', 'Uzbekistan', 'Afghanistan', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Maldives', 'Nepal', 'Bhutan'],
  'Middle East': ['Saudi Arabia', 'Iran', 'Iraq', 'Turkey', 'Israel', 'Jordan', 'Lebanon', 'Syria', 'Kuwait', 'UAE', 'Qatar', 'Bahrain', 'Oman', 'Yemen', 'Palestine'],
  'Africa': ['Nigeria', 'Ethiopia', 'Egypt', 'South Africa', 'Kenya', 'Tanzania', 'Uganda', 'Algeria', 'Sudan', 'Morocco', 'Angola', 'Mozambique', 'Ghana', 'Madagascar', 'Cameroon', 'Niger', 'Burkina Faso', 'Mali', 'Malawi', 'Zambia', 'Somalia', 'Senegal', 'Chad', 'Zimbabwe', 'Guinea', 'Rwanda', 'Benin', 'Burundi', 'Tunisia', 'South Sudan', 'Togo', 'Sierra Leone', 'Libya', 'Liberia', 'Central African Republic', 'Mauritania', 'Eritrea', 'Gambia', 'Botswana', 'Gabon', 'Lesotho', 'Guinea-Bissau', 'Equatorial Guinea', 'Mauritius', 'Eswatini', 'Djibouti', 'Fiji', 'Réunion', 'Comoros', 'Western Sahara', 'Cabo Verde', 'São Tomé and Príncipe', 'Seychelles'],
  'Oceania': ['Australia', 'New Zealand', 'Papua New Guinea', 'Fiji', 'Solomon Islands', 'Vanuatu', 'Samoa', 'Tonga', 'Kiribati', 'Micronesia', 'Marshall Islands', 'Palau', 'Tuvalu', 'Nauru'],
  'Global': Object.keys(countryCoordinates)
};

export default function EventMapIntegration() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [mapCenter, setMapCenter] = useState([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [error, setError] = useState(null);

  // Load events from API
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to load from API first
      try {
        const apiEvents = await eventsAPI.getAllEvents();
        if (apiEvents && apiEvents.length > 0) {
          setEvents(apiEvents);
        } else {
          // Fallback to sample data if API returns empty
          setEvents(getSampleEvents());
        }
      } catch (apiError) {
        console.warn('API not available, using sample data:', apiError);
        setEvents(getSampleEvents());
      }
    } catch (error) {
      console.error('Error loading events:', error);
      setError('Failed to load events');
      setEvents(getSampleEvents());
    } finally {
      setLoading(false);
    }
  };

  // Sample events data for development
  const getSampleEvents = () => [
    {
      id: 1,
      title: "Supply Chain Disruption in Asia Pacific",
      description: "Major port closures and shipping delays affecting key trade routes in the Asia Pacific region.",
      category: "Supply Chain Risk",
      severity: "high",
      regions: ["Asia Pacific", "Global"],
      countries: ["China", "Japan", "South Korea", "Singapore"],
      eventDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
      relevanceScore: 0.85,
      source: { name: "Reuters", reliability: "high" }
    },
    {
      id: 2,
      title: "New Regulatory Requirements in Europe",
      description: "Updated GDPR compliance requirements for data processing affecting all EU operations.",
      category: "Regulatory Risk",
      severity: "medium",
      regions: ["Europe"],
      countries: ["Germany", "France", "Italy", "Spain"],
      eventDate: new Date(Date.now() - 6 * 60 * 60 * 1000),
      relevanceScore: 0.72,
      source: { name: "EU Commission", reliability: "high" }
    },
    {
      id: 3,
      title: "Cybersecurity Threat Detection",
      description: "Advanced persistent threat targeting financial institutions across North America.",
      category: "Cybersecurity Risk",
      severity: "high",
      regions: ["North America"],
      countries: ["United States", "Canada"],
      eventDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
      relevanceScore: 0.91,
      source: { name: "CISA", reliability: "high" }
    },
    {
      id: 4,
      title: "Market Volatility in Emerging Markets",
      description: "Currency fluctuations and political instability affecting investments in Latin America.",
      category: "Market Risk",
      severity: "medium",
      regions: ["Latin America"],
      countries: ["Brazil", "Argentina", "Chile"],
      eventDate: new Date(Date.now() - 4 * 60 * 60 * 1000),
      relevanceScore: 0.68,
      source: { name: "Bloomberg", reliability: "medium" }
    },
    {
      id: 5,
      title: "Geopolitical Tensions in Middle East",
      description: "Regional conflicts affecting energy supply and trade routes in the Middle East.",
      category: "Geopolitical Risk",
      severity: "high",
      regions: ["Middle East"],
      countries: ["Iran", "Saudi Arabia", "UAE", "Israel"],
      eventDate: new Date(Date.now() - 3 * 60 * 60 * 1000),
      relevanceScore: 0.78,
      source: { name: "AP News", reliability: "medium" }
    },
    {
      id: 6,
      title: "Environmental Compliance Updates",
      description: "New sustainability reporting requirements for manufacturing operations in North America.",
      category: "Environmental Risk",
      severity: "low",
      regions: ["North America"],
      countries: ["United States", "Canada"],
      eventDate: new Date(Date.now() - 8 * 60 * 60 * 1000),
      relevanceScore: 0.45,
      source: { name: "EPA", reliability: "high" }
    }
  ];

  // Process events to create map markers
  const eventMarkers = useMemo(() => {
    const markers = [];
    
    events.forEach(event => {
      // Handle countries
      if (event.countries && event.countries.length > 0) {
        event.countries.forEach(country => {
          const coords = countryCoordinates[country];
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
          const regionCountries = regionCountries[region];
          if (regionCountries) {
            regionCountries.forEach(country => {
              const coords = countryCoordinates[country];
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
  }, [events]);

  // Group events by country for summary
  const eventsByCountry = useMemo(() => {
    const grouped = {};
    
    eventMarkers.forEach(marker => {
      const country = marker.country;
      if (!grouped[country]) {
        grouped[country] = [];
      }
      grouped[country].push(marker.event);
    });
    
    return grouped;
  }, [eventMarkers]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#d32f2f';
      case 'high': return '#f57c00';
      case 'medium': return '#fbc02d';
      case 'low': return '#388e3c';
      default: return '#757575';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <Error color="error" />;
      case 'high': return <Warning color="warning" />;
      case 'medium': return <Info color="info" />;
      case 'low': return <CheckCircle color="success" />;
      default: return <Timeline />;
    }
  };

  const handleMarkerClick = (marker) => {
    setSelectedCountry(marker.country);
    setFilteredEvents(eventsByCountry[marker.country] || []);
    setMapCenter(marker.coordinates);
    setMapZoom(6);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  const MapComponent = () => {
    const map = useMap();
    
    useEffect(() => {
      map.setView(mapCenter, mapZoom);
    }, [mapCenter, mapZoom, map]);
    
    return null;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" gutterBottom>
              Event Map Integration
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click on markers to view events by location
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <IconButton onClick={loadEvents} disabled={loading}>
              <Refresh />
            </IconButton>
            <Chip
              label={`${events.length} Events`}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      </Paper>

      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        {/* Map */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: '600px', overflow: 'hidden' }}>
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '100%', width: '100%' }}
              worldCopyJump={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <MapComponent />
              
              {/* Event Markers */}
              {eventMarkers.map((marker) => (
                <CircleMarker
                  key={marker.id}
                  center={marker.coordinates}
                  radius={8}
                  fillColor={getSeverityColor(marker.event.severity)}
                  color="#fff"
                  weight={2}
                  opacity={0.8}
                  fillOpacity={0.7}
                  eventHandlers={{
                    click: () => handleMarkerClick(marker)
                  }}
                >
                  <Popup>
                    <Box sx={{ minWidth: 200 }}>
                      <Typography variant="h6" gutterBottom>
                        {marker.event.title}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        {getSeverityIcon(marker.event.severity)}
                        <Chip
                          label={marker.event.severity}
                          size="small"
                          color={marker.event.severity === 'high' ? 'error' : 
                                 marker.event.severity === 'medium' ? 'warning' : 'success'}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {marker.event.description}
                      </Typography>
                      <Box mt={1}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleEventClick(marker.event)}
                        >
                          View Details
                        </Button>
                      </Box>
                    </Box>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </Paper>
        </Grid>

        {/* Event List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '600px', overflow: 'auto' }}>
            <Box sx={{ p: 2 }}>
              {selectedCountry ? (
                <>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">
                      Events in {selectedCountry}
                    </Typography>
                    <IconButton onClick={() => setSelectedCountry(null)}>
                      <Close />
                    </IconButton>
                  </Box>
                  
                  {filteredEvents.length > 0 ? (
                    <List>
                      {filteredEvents.map((event, index) => (
                        <React.Fragment key={event.id}>
                          <ListItem
                            button
                            onClick={() => handleEventClick(event)}
                            sx={{ borderRadius: 1, mb: 1 }}
                          >
                            <ListItemIcon>
                              {getSeverityIcon(event.severity)}
                            </ListItemIcon>
                            <ListItemText
                              primary={event.title}
                              secondary={
                                <Box>
                                  <Typography variant="caption" display="block">
                                    {event.category}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {event.eventDate.toLocaleDateString()}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                          {index < filteredEvents.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Typography color="text.secondary" align="center">
                      No events found for this country
                    </Typography>
                  )}
                </>
              ) : (
                <>
                  <Typography variant="h6" gutterBottom>
                    All Events
                  </Typography>
                  <List>
                    {events.map((event, index) => (
                      <React.Fragment key={event.id}>
                        <ListItem
                          button
                          onClick={() => handleEventClick(event)}
                          sx={{ borderRadius: 1, mb: 1 }}
                        >
                          <ListItemIcon>
                            {getSeverityIcon(event.severity)}
                          </ListItemIcon>
                          <ListItemText
                            primary={event.title}
                            secondary={
                              <Box>
                                <Typography variant="caption" display="block">
                                  {event.category} • {event.countries?.join(', ') || event.regions?.join(', ')}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {event.eventDate.toLocaleDateString()}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < events.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Event Details Dialog */}
      <Dialog
        open={showEventDialog}
        onClose={() => setShowEventDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {selectedEvent?.title}
            </Typography>
            <IconButton onClick={() => setShowEventDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Box>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                {getSeverityIcon(selectedEvent.severity)}
                <Chip
                  label={selectedEvent.severity}
                  color={selectedEvent.severity === 'high' ? 'error' : 
                         selectedEvent.severity === 'medium' ? 'warning' : 'success'}
                />
                <Chip
                  label={selectedEvent.category}
                  variant="outlined"
                />
              </Box>
              
              <Typography variant="body1" paragraph>
                {selectedEvent.description}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Location
                  </Typography>
                  <Typography variant="body2">
                    {selectedEvent.countries?.join(', ') || selectedEvent.regions?.join(', ')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Date
                  </Typography>
                  <Typography variant="body2">
                    {selectedEvent.eventDate.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Source
                  </Typography>
                  <Typography variant="body2">
                    {selectedEvent.source?.name || 'Unknown'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Relevance Score
                  </Typography>
                  <Typography variant="body2">
                    {(selectedEvent.relevanceScore * 100).toFixed(1)}%
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEventDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

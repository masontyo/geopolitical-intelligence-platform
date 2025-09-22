import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Warning,
  Error,
  CheckCircle,
  Info,
  Refresh,
  ZoomIn,
  ZoomOut,
  Language
} from '@mui/icons-material';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  getUserLanguage, 
  getCountryName, 
  getUIText, 
  getRecommendedTileProvider 
} from '../utils/mapLanguageConfig';
import { eventsAPI } from '../services/api';
import eventMapService from '../services/eventMapService';

// Detailed risk data with real geographic coordinates (lat, lng)
const riskData = {
  'United States': { 
    level: 'low', score: 3.2, events: 2, 
    coords: [39.8283, -98.5795], // Geographic center of US
    description: 'Stable political environment' 
  },
  'China': { 
    level: 'high', score: 8.5, events: 12, 
    coords: [35.8617, 104.1954], // Geographic center of China
    description: 'Supply chain disruptions, trade tensions' 
  },
  'Russia': { 
    level: 'high', score: 9.2, events: 18, 
    coords: [61.5240, 105.3188], // Geographic center of Russia
    description: 'Geopolitical tensions, sanctions impact' 
  },
  'Ukraine': { 
    level: 'critical', score: 9.8, events: 25, 
    coords: [48.3794, 31.1656], // Geographic center of Ukraine
    description: 'Active conflict zone, infrastructure damage' 
  },
  'Iran': { 
    level: 'high', score: 8.1, events: 8, 
    coords: [32.4279, 53.6880], // Geographic center of Iran
    description: 'Regional instability, sanctions' 
  },
  'Germany': { 
    level: 'low', score: 2.8, events: 1, 
    coords: [51.1657, 10.4515], // Geographic center of Germany
    description: 'Economic stability, strong institutions' 
  },
  'Japan': { 
    level: 'low', score: 3.5, events: 2, 
    coords: [36.2048, 138.2529], // Geographic center of Japan
    description: 'Natural disaster preparedness concerns' 
  },
  'India': { 
    level: 'medium', score: 5.5, events: 8, 
    coords: [20.5937, 78.9629], // Geographic center of India
    description: 'Border tensions, economic growth challenges' 
  },
  'Brazil': { 
    level: 'medium', score: 6.2, events: 6, 
    coords: [-14.2350, -51.9253], // Geographic center of Brazil
    description: 'Political polarization, environmental concerns' 
  },
  'Australia': { 
    level: 'low', score: 2.5, events: 1, 
    coords: [-25.2744, 133.7751], // Geographic center of Australia
    description: 'Stable democracy, strong economy' 
  },
  'United Kingdom': { 
    level: 'low', score: 3.8, events: 2, 
    coords: [55.3781, -3.4360], // Geographic center of UK
    description: 'Post-Brexit adjustments' 
  },
  'France': { 
    level: 'low', score: 3.6, events: 2, 
    coords: [46.6034, 1.8883], // Geographic center of France
    description: 'Social tensions, economic challenges' 
  },
  'North Korea': { 
    level: 'high', score: 7.9, events: 6, 
    coords: [40.3399, 127.5101], // Geographic center of North Korea
    description: 'Nuclear tensions, unpredictable policies' 
  },
  'South Africa': { 
    level: 'medium', score: 6.9, events: 5, 
    coords: [-30.5595, 22.9375], // Geographic center of South Africa
    description: 'Economic challenges, social unrest' 
  },
  'Canada': { 
    level: 'low', score: 2.3, events: 1, 
    coords: [56.1304, -106.3468], // Geographic center of Canada
    description: 'Political stability, resource security' 
  },
  'Mexico': { 
    level: 'medium', score: 6.0, events: 4, 
    coords: [23.6345, -102.5528], // Geographic center of Mexico
    description: 'Drug cartel violence, economic challenges' 
  },
  'Egypt': { 
    level: 'medium', score: 6.5, events: 7, 
    coords: [26.0975, 30.0444], // Geographic center of Egypt
    description: 'Political instability, economic pressures' 
  },
  'Turkey': { 
    level: 'medium', score: 6.8, events: 9, 
    coords: [38.9637, 35.2433], // Geographic center of Turkey
    description: 'Regional conflicts, economic volatility' 
  },
  'Saudi Arabia': { 
    level: 'medium', score: 5.8, events: 5, 
    coords: [23.8859, 45.0792], // Geographic center of Saudi Arabia
    description: 'Regional tensions, economic diversification' 
  },
  'Venezuela': { 
    level: 'high', score: 8.5, events: 12, 
    coords: [6.4238, -66.5897], // Geographic center of Venezuela
    description: 'Economic collapse, political crisis' 
  }
};

// Color mapping for risk levels
const getRiskColor = (level) => {
  const colors = {
    critical: '#dc2626', // Red
    high: '#f59e0b',     // Orange  
    medium: '#eab308',   // Yellow
    low: '#10b981',      // Green
  };
  return colors[level] || '#9ca3af';
};

// Get marker size based on risk level
const getMarkerSize = (level) => {
  const sizes = {
    critical: 25,
    high: 20,
    medium: 15,
    low: 12
  };
  return sizes[level] || 12;
};

// Risk level icons
const getRiskIcon = (level) => {
  const iconProps = { fontSize: 'small' };
  switch (level) {
    case 'critical': return <Error {...iconProps} sx={{ color: '#dc2626' }} />;
    case 'high': return <Warning {...iconProps} sx={{ color: '#f59e0b' }} />;
    case 'medium': return <Info {...iconProps} sx={{ color: '#eab308' }} />;
    case 'low': return <CheckCircle {...iconProps} sx={{ color: '#10b981' }} />;
    default: return <Info {...iconProps} sx={{ color: '#9ca3af' }} />;
  }
};

const DetailedWorldMap = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [userLanguage] = useState(getUserLanguage());
  const [tileProvider] = useState(getRecommendedTileProvider(userLanguage));
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calculate risk statistics
  const riskStats = Object.values(riskData).reduce((acc, risk) => {
    acc[risk.level] = (acc[risk.level] || 0) + 1;
    acc.totalEvents += risk.events;
    return acc;
  }, { critical: 0, high: 0, medium: 0, low: 0, totalEvents: 0 });

  // Load events when component mounts
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const apiEvents = await eventsAPI.getAllEvents();
      if (apiEvents && apiEvents.length > 0) {
        setEvents(apiEvents);
      } else {
        // Fallback to sample data
        setEvents(getSampleEvents());
      }
    } catch (error) {
      console.warn('API not available, using sample data:', error.message);
      setEvents(getSampleEvents());
    } finally {
      setLoading(false);
    }
  };

  // Sample events data
  const getSampleEvents = () => [
    {
      id: 1,
      title: "Supply Chain Disruption in Asia Pacific",
      description: "Major port closures and shipping delays affecting key trade routes.",
      category: "Supply Chain Risk",
      severity: "high",
      countries: ["China", "Japan", "South Korea", "Singapore"],
      eventDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
      relevanceScore: 0.85
    },
    {
      id: 2,
      title: "New Regulatory Requirements in Europe",
      description: "Updated GDPR compliance requirements for data processing.",
      category: "Regulatory Risk",
      severity: "medium",
      countries: ["Germany", "France", "Italy", "Spain"],
      eventDate: new Date(Date.now() - 6 * 60 * 60 * 1000),
      relevanceScore: 0.72
    },
    {
      id: 3,
      title: "Cybersecurity Threat Detection",
      description: "Advanced persistent threat targeting financial institutions.",
      category: "Cybersecurity Risk",
      severity: "high",
      countries: ["United States", "Canada"],
      eventDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
      relevanceScore: 0.91
    }
  ];

  // Get events for a specific country
  const getEventsForCountry = (countryName) => {
    return events.filter(event => {
      if (event.countries && event.countries.includes(countryName)) {
        return true;
      }
      // Also check regions
      if (event.regions) {
        return event.regions.some(region => {
          const regionCountries = eventMapService.regionCountries[region];
          return regionCountries && regionCountries.includes(countryName);
        });
      }
      return false;
    });
  };

  // Get coordinates for events
  const getEventCoordinates = () => {
    const eventMarkers = [];
    
    events.forEach(event => {
      if (event.countries && event.countries.length > 0) {
        event.countries.forEach(countryName => {
          // Find the country in riskData to get coordinates
          const countryData = riskData[countryName];
          if (countryData) {
            eventMarkers.push({
              ...event,
              coords: countryData.coords,
              countryName: countryName
            });
          }
        });
      } else if (event.regions && event.regions.length > 0) {
        // For regional events, use a representative country
        event.regions.forEach(region => {
          const regionCountries = eventMapService.regionCountries[region];
          if (regionCountries && regionCountries.length > 0) {
            // Use the first country in the region as a representative
            const representativeCountry = regionCountries[0];
            const countryData = riskData[representativeCountry];
            if (countryData) {
              eventMarkers.push({
                ...event,
                coords: countryData.coords,
                countryName: representativeCountry,
                region: region
              });
            }
          }
        });
      }
    });
    
    return eventMarkers;
  };

  // Get color for event severity
  const getEventSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const handleRefresh = () => {
    setSelectedCountry(null);
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {getUIText('title', userLanguage)}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={`Language: ${userLanguage.toUpperCase()}`}>
            <IconButton size="small">
              <Language />
            </IconButton>
          </Tooltip>
          <Tooltip title={getUIText('refresh', userLanguage)}>
            <IconButton size="small" onClick={handleRefresh}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Risk Level Legend */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Chip
          icon={<Error fontSize="small" />}
          label={`${getUIText('critical', userLanguage)} (${riskStats.critical})`}
          size="small"
          sx={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}
        />
        <Chip
          icon={<Warning fontSize="small" />}
          label={`${getUIText('high', userLanguage)} (${riskStats.high})`}
          size="small"
          sx={{ backgroundColor: '#fffbeb', color: '#f59e0b', border: '1px solid #fed7aa' }}
        />
        <Chip
          icon={<Info fontSize="small" />}
          label={`${getUIText('medium', userLanguage)} (${riskStats.medium})`}
          size="small"
          sx={{ backgroundColor: '#fefce8', color: '#eab308', border: '1px solid #fde68a' }}
        />
        <Chip
          icon={<CheckCircle fontSize="small" />}
          label={`${getUIText('low', userLanguage)} (${riskStats.low})`}
          size="small"
          sx={{ backgroundColor: '#f0fdf4', color: '#10b981', border: '1px solid #bbf7d0' }}
        />
        <Chip
          label={`${getUIText('totalEvents', userLanguage)}: ${riskStats.totalEvents}`}
          size="small"
          variant="outlined"
          sx={{ ml: 1 }}
        />
      </Box>

      {/* Leaflet Map */}
      <Box sx={{ 
        flexGrow: 1, 
        position: 'relative', 
        minHeight: '300px',
        borderRadius: 2,
        overflow: 'hidden',
        '& .leaflet-container': {
          height: '100%',
          width: '100%',
          borderRadius: 2
        }
      }}>
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
          worldCopyJump={true}
          maxBounds={[[-90, -180], [90, 180]]}
          maxBoundsViscosity={1.0}
        >
          <TileLayer
            attribution={tileProvider.attribution}
            url={tileProvider.url}
            noWrap={false}
          />
          
          {/* Risk Markers */}
          {Object.entries(riskData).map(([countryName, data]) => (
            <CircleMarker
              key={countryName}
              center={data.coords}
              radius={getMarkerSize(data.level)}
              fillColor={getRiskColor(data.level)}
              color="#ffffff"
              weight={2}
              opacity={1}
              fillOpacity={0.8}
              eventHandlers={{
                click: () => setSelectedCountry({ name: countryName, ...data })
              }}
            >
              <Popup>
                <Box sx={{ minWidth: 300, maxWidth: 400 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {getCountryName(countryName, userLanguage)}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>{getUIText('riskLevel', userLanguage)}:</strong> {getUIText(data.level, userLanguage).toUpperCase()}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>{getUIText('riskScore', userLanguage)}:</strong> {data.score}/10
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>{getUIText('activeEvents', userLanguage)}:</strong> {data.events}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {data.description}
                  </Typography>
                  
                  {/* Associated Events */}
                  {(() => {
                    const countryEvents = getEventsForCountry(countryName);
                    if (countryEvents.length > 0) {
                      return (
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                            📰 Associated Events ({countryEvents.length})
                          </Typography>
                          <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                            {countryEvents.slice(0, 3).map((event, index) => (
                              <Box 
                                key={event.id || index}
                                sx={{ 
                                  p: 1, 
                                  mb: 1, 
                                  border: 1, 
                                  borderColor: 'divider', 
                                  borderRadius: 1,
                                  backgroundColor: 'background.paper'
                                }}
                              >
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                  {event.title}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                                  {event.category} • {event.severity?.toUpperCase()}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  {event.description?.substring(0, 100)}
                                  {event.description?.length > 100 ? '...' : ''}
                                </Typography>
                              </Box>
                            ))}
                            {countryEvents.length > 3 && (
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                                +{countryEvents.length - 3} more events
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      );
                    }
                    return (
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                        No recent events for this location
                      </Typography>
                    );
                  })()}
                </Box>
              </Popup>
            </CircleMarker>
          ))}
          
          {/* Event Markers */}
          {getEventCoordinates().map((eventMarker, index) => (
            <CircleMarker
              key={`event-${eventMarker.id || index}`}
              center={eventMarker.coords}
              radius={8}
              fillColor={getEventSeverityColor(eventMarker.severity)}
              color="#ffffff"
              weight={2}
              opacity={1}
              fillOpacity={0.9}
              eventHandlers={{
                click: () => {
                  // You can add event selection logic here if needed
                  console.log('Event clicked:', eventMarker);
                }
              }}
            >
              <Popup>
                <Box sx={{ minWidth: 250, maxWidth: 350 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    📰 {eventMarker.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Category:</strong> {eventMarker.category}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Severity:</strong> 
                    <Chip 
                      label={eventMarker.severity?.toUpperCase()} 
                      size="small" 
                      sx={{ 
                        ml: 1, 
                        backgroundColor: getEventSeverityColor(eventMarker.severity),
                        color: 'white',
                        fontWeight: 600
                      }} 
                    />
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Location:</strong> {eventMarker.countryName}
                    {eventMarker.region && ` (${eventMarker.region})`}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Date:</strong> {eventMarker.eventDate?.toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {eventMarker.description}
                  </Typography>
                </Box>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </Box>

      {/* Enhanced Map Legend */}
      <Box sx={{ mt: 2, p: 2, backgroundColor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
          🗺️ Map Legend
        </Typography>
        
        {/* Risk Level Legend */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            🌍 Country Risk Levels
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 400 }}>
              (Large circles - click for country details)
            </Typography>
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1.5 }}>
            {['critical', 'high', 'medium', 'low'].map(level => (
              <Box key={level} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1, backgroundColor: 'background.default', borderRadius: 1 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: getRiskColor(level),
                    border: '2px solid #ffffff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                    {level}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {riskStats[level] || 0} countries
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        
        {/* Event Markers Legend */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            📰 Recent Events
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 400 }}>
              (Small circles - click for event details)
            </Typography>
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1.5 }}>
            {['critical', 'high', 'medium', 'low'].map(severity => {
              const eventCount = getEventCoordinates().filter(e => e.severity?.toLowerCase() === severity).length;
              return (
                <Box key={severity} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1, backgroundColor: 'background.default', borderRadius: 1 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: getEventSeverityColor(severity),
                      border: '2px solid #ffffff',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                      {severity}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {eventCount} events
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
        
        {/* Interactive Instructions */}
        <Box sx={{ mt: 2, p: 1.5, backgroundColor: 'primary.light', borderRadius: 1, border: 1, borderColor: 'primary.main' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.dark', mb: 0.5 }}>
            💡 How to Use:
          </Typography>
          <Typography variant="caption" sx={{ color: 'primary.dark', display: 'block' }}>
            • Click large circles to see country risk details and associated events
          </Typography>
          <Typography variant="caption" sx={{ color: 'primary.dark', display: 'block' }}>
            • Click small circles to see individual event information
          </Typography>
          <Typography variant="caption" sx={{ color: 'primary.dark', display: 'block' }}>
            • Use zoom and pan to explore different regions
          </Typography>
        </Box>
      </Box>

      {/* Selected Country Details */}
      {selectedCountry && (
        <Card sx={{ mt: 2 }}>
          <CardContent sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {getRiskIcon(selectedCountry.level)}
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {getCountryName(selectedCountry.name, userLanguage)}
              </Typography>
              <Chip
                label={getUIText(selectedCountry.level, userLanguage).toUpperCase()}
                size="small"
                color={selectedCountry.level === 'critical' ? 'error' : 
                       selectedCountry.level === 'high' ? 'warning' :
                       selectedCountry.level === 'medium' ? 'info' : 'success'}
              />
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">{getUIText('riskScore', userLanguage)}</Typography>
                <Typography variant="h6">{selectedCountry.score}/10</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">{getUIText('activeEvents', userLanguage)}</Typography>
                <Typography variant="h6">{selectedCountry.events}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">{getUIText('coordinates', userLanguage)}</Typography>
                <Typography variant="body2">
                  {selectedCountry.coords[0].toFixed(2)}, {selectedCountry.coords[1].toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              {selectedCountry.description}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Paper>
  );
};

export default DetailedWorldMap;

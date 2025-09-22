import React, { useState, useEffect, useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Tooltip,
  Grid,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Badge,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab
} from '@mui/material';
import {
  Warning,
  Error,
  CheckCircle,
  Info,
  ZoomIn,
  ZoomOut,
  Refresh,
  LocationOn,
  Timeline,
  Event,
  Close,
  FilterList
} from '@mui/icons-material';
import { eventsAPI } from '../services/api';
import eventMapService from '../services/eventMapService';

// World map topology URL
const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

export default function EnhancedWorldRiskMap() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([0, 0]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

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

  // Process events to create country risk data
  const countryRiskData = useMemo(() => {
    const riskData = {};
    
    // Initialize all countries with low risk
    Object.keys(eventMapService.countryCoordinates).forEach(country => {
      riskData[country] = {
        level: 'low',
        score: 0,
        events: 0,
        description: 'No significant events detected'
      };
    });
    
    // Calculate risk for each country based on events
    events.forEach(event => {
      // Handle countries
      if (event.countries && event.countries.length > 0) {
        event.countries.forEach(country => {
          if (riskData[country]) {
            riskData[country].events += 1;
            riskData[country].description = `${riskData[country].events} event(s) detected`;
          }
        });
      }
      
      // Handle regions
      if (event.regions && event.regions.length > 0) {
        event.regions.forEach(region => {
          const regionCountries = eventMapService.regionCountries[region];
          if (regionCountries) {
            regionCountries.forEach(country => {
              if (riskData[country]) {
                riskData[country].events += 1;
                riskData[country].description = `${riskData[country].events} event(s) detected`;
              }
            });
          }
        });
      }
    });
    
    // Calculate risk levels based on event count and severity
    Object.keys(riskData).forEach(country => {
      const countryEvents = eventMapService.getEventsForCountry(events, country);
      const riskLevel = eventMapService.getCountryRiskLevel(events, country);
      
      riskData[country] = {
        ...riskData[country],
        ...riskLevel,
        description: `${countryEvents.length} event(s) detected`
      };
    });
    
    return riskData;
  }, [events]);

  // Get events for selected country
  const countryEvents = useMemo(() => {
    if (!selectedCountry) return [];
    return eventMapService.getEventsForCountry(events, selectedCountry);
  }, [selectedCountry, events]);

  // Get top countries by event count
  const topCountries = useMemo(() => {
    return eventMapService.getTopCountriesByEventCount(events, 10);
  }, [events]);

  const getRiskColor = (level) => {
    switch (level) {
      case 'critical': return '#d32f2f';
      case 'high': return '#f57c00';
      case 'medium': return '#fbc02d';
      case 'low': return '#388e3c';
      default: return '#757575';
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'critical': return <Error color="error" />;
      case 'high': return <Warning color="warning" />;
      case 'medium': return <Info color="info" />;
      case 'low': return <CheckCircle color="success" />;
      default: return <Timeline />;
    }
  };

  const handleCountryClick = (countryName) => {
    setSelectedCountry(countryName);
    setActiveTab(0);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  const handleZoomIn = () => setZoom(zoom + 0.5);
  const handleZoomOut = () => setZoom(zoom - 0.5);

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
              Enhanced World Risk Map
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Interactive map showing geopolitical events by country
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <IconButton onClick={loadEvents} disabled={loading}>
              <Refresh />
            </IconButton>
            <IconButton onClick={handleZoomIn}>
              <ZoomIn />
            </IconButton>
            <IconButton onClick={handleZoomOut}>
              <ZoomOut />
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
            <ComposableMap
              projectionConfig={{
                rotate: [-10, 0, 0],
                scale: 147
              }}
              style={{
                width: '100%',
                height: '100%'
              }}
            >
              <ZoomableGroup zoom={zoom} center={center}>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const countryName = geo.properties.NAME;
                      const riskData = countryRiskData[countryName];
                      const isHovered = hoveredCountry === countryName;
                      const isSelected = selectedCountry === countryName;
                      
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onMouseEnter={() => setHoveredCountry(countryName)}
                          onMouseLeave={() => setHoveredCountry(null)}
                          onClick={() => handleCountryClick(countryName)}
                          style={{
                            default: {
                              fill: riskData ? getRiskColor(riskData.level) : '#e0e0e0',
                              stroke: isSelected ? '#1976d2' : '#ffffff',
                              strokeWidth: isSelected ? 2 : 0.5,
                              outline: 'none',
                              opacity: isHovered ? 0.8 : 1
                            },
                            hover: {
                              fill: riskData ? getRiskColor(riskData.level) : '#e0e0e0',
                              stroke: '#1976d2',
                              strokeWidth: 1,
                              outline: 'none',
                              opacity: 0.8
                            },
                            pressed: {
                              fill: riskData ? getRiskColor(riskData.level) : '#e0e0e0',
                              stroke: '#1976d2',
                              strokeWidth: 2,
                              outline: 'none'
                            }
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
                
                {/* Event markers for countries with events */}
                {Object.entries(countryRiskData)
                  .filter(([, data]) => data.events > 0)
                  .map(([countryName, data]) => {
                    const coords = eventMapService.countryCoordinates[countryName];
                    if (coords) {
                      return (
                        <Marker key={countryName} coordinates={coords}>
                          <circle
                            r={Math.min(data.events * 2 + 4, 12)}
                            fill={getRiskColor(data.level)}
                            stroke="#fff"
                            strokeWidth={2}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleCountryClick(countryName)}
                          />
                          <text
                            textAnchor="middle"
                            y={-15}
                            style={{
                              fontFamily: 'system-ui',
                              fill: '#5D5A6D',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}
                          >
                            {data.events}
                          </text>
                        </Marker>
                      );
                    }
                    return null;
                  })}
              </ZoomableGroup>
            </ComposableMap>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '600px', overflow: 'hidden' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                <Tab label="Country Details" />
                <Tab label="Top Countries" />
              </Tabs>
            </Box>
            
            <Box sx={{ height: 'calc(100% - 48px)', overflow: 'auto' }}>
              {activeTab === 0 && (
                <Box sx={{ p: 2 }}>
                  {selectedCountry ? (
                    <>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">
                          {selectedCountry}
                        </Typography>
                        <IconButton onClick={() => setSelectedCountry(null)}>
                          <Close />
                        </IconButton>
                      </Box>
                      
                      {countryRiskData[selectedCountry] && (
                        <Card sx={{ mb: 2 }}>
                          <CardContent>
                            <Box display="flex" alignItems="center" gap={2} mb={1}>
                              {getRiskIcon(countryRiskData[selectedCountry].level)}
                              <Chip
                                label={countryRiskData[selectedCountry].level}
                                color={countryRiskData[selectedCountry].level === 'high' ? 'error' : 
                                       countryRiskData[selectedCountry].level === 'medium' ? 'warning' : 'success'}
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {countryRiskData[selectedCountry].description}
                            </Typography>
                            <Typography variant="h6" mt={1}>
                              Risk Score: {countryRiskData[selectedCountry].score.toFixed(1)}/10
                            </Typography>
                          </CardContent>
                        </Card>
                      )}
                      
                      {countryEvents.length > 0 ? (
                        <>
                          <Typography variant="subtitle1" gutterBottom>
                            Events ({countryEvents.length})
                          </Typography>
                          <List>
                            {countryEvents.map((event, index) => (
                              <React.Fragment key={event.id}>
                                <ListItem
                                  button
                                  onClick={() => handleEventClick(event)}
                                  sx={{ borderRadius: 1, mb: 1 }}
                                >
                                  <ListItemIcon>
                                    {getRiskIcon(event.severity)}
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
                                {index < countryEvents.length - 1 && <Divider />}
                              </React.Fragment>
                            ))}
                          </List>
                        </>
                      ) : (
                        <Typography color="text.secondary" align="center">
                          No events found for this country
                        </Typography>
                      )}
                    </>
                  ) : (
                    <Box textAlign="center" mt={4}>
                      <LocationOn sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        Select a Country
                      </Typography>
                      <Typography color="text.secondary">
                        Click on a country on the map to view its events and risk assessment
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
              
              {activeTab === 1 && (
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Top Countries by Event Count
                  </Typography>
                  <List>
                    {topCountries.map((item, index) => (
                      <React.Fragment key={item.country}>
                        <ListItem>
                          <ListItemIcon>
                            <Badge badgeContent={item.count} color="primary">
                              <LocationOn />
                            </Badge>
                          </ListItemIcon>
                          <ListItemText
                            primary={item.country}
                            secondary={`${item.count} event(s)`}
                          />
                        </ListItem>
                        {index < topCountries.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
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
                {getRiskIcon(selectedEvent.severity)}
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

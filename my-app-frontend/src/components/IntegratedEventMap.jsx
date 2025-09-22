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
  Alert,
  Tabs,
  Tab,
  Switch,
  FormControlLabel
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
  Refresh,
  Map,
  List as ListIcon,
  FilterList
} from '@mui/icons-material';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { eventsAPI } from '../services/api';
import eventMapService from '../services/eventMapService';

// Fix for Leaflet markers in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function IntegratedEventMap({ 
  showMapView = true, 
  showEventList = true, 
  height = '600px',
  onEventSelect = null 
}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [mapCenter, setMapCenter] = useState([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [showRiskLevels, setShowRiskLevels] = useState(true);
  const [showEventMarkers, setShowEventMarkers] = useState(true);

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
        console.warn('API not available, using sample data:', apiError.message || apiError);
        setEvents(getSampleEvents());
        // Don't set error for API failures - sample data is acceptable
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
    return eventMapService.processEventsToMarkers(events);
  }, [events]);

  // Group events by country for summary
  const eventsByCountry = useMemo(() => {
    return eventMapService.groupEventsByCountry(events);
  }, [events]);

  // Get top countries by event count
  const topCountries = useMemo(() => {
    return eventMapService.getTopCountriesByEventCount(events, 10);
  }, [events]);

  const getSeverityColor = (severity) => {
    return eventMapService.getSeverityColor(severity);
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
    if (onEventSelect) {
      onEventSelect(event);
    }
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
    <Box sx={{ height: height, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" gutterBottom>
              Event Map Integration
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click on markers to view events by location
            </Typography>
          </Box>
          <Box display="flex" gap={1} alignItems="center">
            <FormControlLabel
              control={
                <Switch
                  checked={showRiskLevels}
                  onChange={(e) => setShowRiskLevels(e.target.checked)}
                  size="small"
                />
              }
              label="Risk Levels"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={showEventMarkers}
                  onChange={(e) => setShowEventMarkers(e.target.checked)}
                  size="small"
                />
              }
              label="Event Markers"
            />
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
        {showMapView && (
          <Grid item xs={12} md={showEventList ? 8 : 12}>
            <Paper sx={{ height: '100%', overflow: 'hidden' }}>
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
                {showEventMarkers && eventMarkers.map((marker) => (
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
        )}

        {/* Event List */}
        {showEventList && (
          <Grid item xs={12} md={showMapView ? 4 : 12}>
            <Paper sx={{ height: '100%', overflow: 'hidden' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                  <Tab label="Events" />
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
        )}
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

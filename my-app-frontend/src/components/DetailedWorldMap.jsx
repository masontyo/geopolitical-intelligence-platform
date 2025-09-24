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
import { MapContainer, TileLayer, CircleMarker, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  getUserLanguage, 
  getCountryName, 
  getUIText, 
  getRecommendedTileProvider 
} from '../utils/mapLanguageConfig';
import { eventsAPI } from '../services/api';
import eventMapService from '../services/eventMapService';

// Custom Marker Components
const SupplierMarker = ({ supplier, alertCount, markerColor, onSupplierClick }) => {
  const divIcon = L.divIcon({
    className: 'custom-supplier-marker',
    html: `<div style="
      width: ${alertCount > 0 ? '20px' : '16px'};
      height: ${alertCount > 0 ? '20px' : '16px'};
      background-color: ${markerColor};
      border: 3px solid white;
      border-radius: 3px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
      font-size: 10px;
    ">${alertCount > 0 ? alertCount : '🏭'}</div>`,
    iconSize: [alertCount > 0 ? 20 : 16, alertCount > 0 ? 20 : 16],
    iconAnchor: [alertCount > 0 ? 10 : 8, alertCount > 0 ? 10 : 8]
  });

  return <Marker position={supplier.coords} icon={divIcon} eventHandlers={{ click: () => onSupplierClick(supplier) }} />;
};

const PortMarker = ({ port, alertCount, onPortClick }) => {
  const portColor = port.status === 'delayed' ? '#dc2626' : port.status === 'active' ? '#16a34a' : '#6b7280';
  
  const divIcon = L.divIcon({
    className: 'custom-port-marker',
    html: `<div style="
      width: ${alertCount > 0 ? '16px' : '12px'};
      height: ${alertCount > 0 ? '16px' : '12px'};
      background-color: ${portColor};
      border: 2px solid white;
      clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
      font-size: 8px;
    ">${alertCount > 0 ? alertCount : '⚓'}</div>`,
    iconSize: [alertCount > 0 ? 16 : 12, alertCount > 0 ? 16 : 12],
    iconAnchor: [alertCount > 0 ? 8 : 6, alertCount > 0 ? 12 : 10]
  });

  return <Marker position={port.coords} icon={divIcon} eventHandlers={{ click: () => onPortClick(port) }} />;
};

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

const DetailedWorldMap = ({ 
  height = '500px',
  onSupplierClick,
  onEventClick,
  showRelationships = false,
  activeFilters = { suppliers: true, events: true, ports: true, routes: false }
}) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [userLanguage] = useState(getUserLanguage());
  const [tileProvider] = useState(getRecommendedTileProvider(userLanguage));
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [ports, setPorts] = useState([]);

  // Calculate risk statistics
  const riskStats = Object.values(riskData).reduce((acc, risk) => {
    acc[risk.level] = (acc[risk.level] || 0) + 1;
    acc.totalEvents += risk.events;
    return acc;
  }, { critical: 0, high: 0, medium: 0, low: 0, totalEvents: 0 });

  // Load events when component mounts
  useEffect(() => {
    loadEvents();
    loadSuppliers();
    loadAlerts();
    loadPorts();
  }, []);

  const loadSuppliers = () => {
    // Mock supplier data - in real app, this would come from API
    const mockSuppliers = [
      {
        id: 'supplier-1',
        name: 'Shanghai Metal Works',
        country: 'China',
        coords: [31.2304, 121.4737], // Shanghai
        tier: 'Tier 1',
        alertCount: 2
      },
      {
        id: 'supplier-2', 
        name: 'German Electronics Ltd',
        country: 'Germany',
        coords: [52.5200, 13.4050], // Berlin
        tier: 'Tier 1',
        alertCount: 1
      },
      {
        id: 'supplier-3',
        name: 'Thai Components Inc',
        country: 'Thailand',
        coords: [13.7563, 100.5018], // Bangkok
        tier: 'Tier 2',
        alertCount: 1
      }
    ];
    console.log('Loading suppliers:', mockSuppliers);
    setSuppliers(mockSuppliers);
  };

  const loadAlerts = () => {
    // Mock alert data
    const mockAlerts = [
      { id: 1, supplierId: 'supplier-1', severity: 'critical', message: 'Port closure in Shanghai', new: true },
      { id: 2, supplierId: 'supplier-1', severity: 'high', message: 'Shipping delays expected', new: true },
      { id: 3, supplierId: 'supplier-2', severity: 'medium', message: 'Weather warning in region', new: false },
      { id: 4, supplierId: 'supplier-3', severity: 'critical', message: 'Supplier facility damaged', new: true }
    ];
    setAlerts(mockAlerts);
  };

  const loadPorts = () => {
    // Mock port data
    const mockPorts = [
      {
        id: 'port-1',
        name: 'Port of Shanghai',
        country: 'China',
        coords: [31.2397, 121.4994], // Shanghai port
        status: 'active',
        alertCount: 1
      },
      {
        id: 'port-2',
        name: 'Port of Hamburg',
        country: 'Germany', 
        coords: [53.5511, 9.9937], // Hamburg
        status: 'active',
        alertCount: 0
      },
      {
        id: 'port-3',
        name: 'Port of Los Angeles',
        country: 'USA',
        coords: [33.7175, -118.2708], // LA port
        status: 'delayed',
        alertCount: 2
      }
    ];
    setPorts(mockPorts);
  };

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

  // Get supplier alert count
  const getSupplierAlertCount = (supplierId) => {
    return alerts.filter(alert => alert.supplierId === supplierId && alert.new).length;
  };

  // Get supplier most critical alert severity
  const getSupplierMostCriticalAlert = (supplierId) => {
    const supplierAlerts = alerts.filter(alert => alert.supplierId === supplierId);
    if (supplierAlerts.length === 0) return null;
    
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return supplierAlerts.reduce((mostCritical, alert) => 
      severityOrder[alert.severity] > severityOrder[mostCritical.severity] ? alert : mostCritical
    );
  };

  // Get supplier marker color based on most critical alert
  const getSupplierMarkerColor = (supplierId) => {
    const mostCriticalAlert = getSupplierMostCriticalAlert(supplierId);
    if (!mostCriticalAlert) return '#6b7280'; // Default gray if no alerts
    return getEventSeverityColor(mostCriticalAlert.severity);
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

      {/* Comprehensive Legend */}
      <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
          Legend:
        </Typography>
        
        {/* Country Risk */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: getRiskColor('critical'), border: '1px solid #fff' }} />
          <Typography variant="caption">Country Risk</Typography>
        </Box>
        
        {/* Suppliers - Square */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, backgroundColor: getEventSeverityColor('critical'), border: '2px solid #fff', borderRadius: '2px' }} />
          <Typography variant="caption">Suppliers</Typography>
        </Box>
        
        {/* Events - Circle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: getEventSeverityColor('high'), border: '1px solid #fff' }} />
          <Typography variant="caption">Events</Typography>
        </Box>
        
        {/* Ports - Triangle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ 
            width: 0, 
            height: 0, 
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderBottom: `10px solid ${getEventSeverityColor('medium')}`,
            border: '1px solid #fff'
          }} />
          <Typography variant="caption">Ports</Typography>
        </Box>
        
        <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
          Click for details
        </Typography>
      </Box>

      {/* Leaflet Map */}
      <Box sx={{ 
        flexGrow: 1, 
        position: 'relative', 
        height: height,
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
          minZoom={1}
          maxZoom={8}
          style={{ height: '100%', width: '100%' }}
          worldCopyJump={false}
          maxBounds={[[-85, -180], [85, 180]]}
          maxBoundsViscosity={1.0}
        >
          <TileLayer
            attribution={tileProvider.attribution}
            url={tileProvider.url}
            noWrap={true}
          />
          
          {/* Risk Markers */}
          {/* Countries are now clickable via background - no individual markers needed */}
          
          {/* Supplier Markers - Square Shape */}
          {activeFilters.suppliers && suppliers.length > 0 && suppliers.map((supplier, index) => {
            const alertCount = getSupplierAlertCount(supplier.id);
            const markerColor = getSupplierMarkerColor(supplier.id);
            const mostCriticalAlert = getSupplierMostCriticalAlert(supplier.id);
            
            console.log('Rendering supplier marker:', supplier, 'alertCount:', alertCount, 'markerColor:', markerColor);
            
            return (
              <SupplierMarker
                key={`supplier-${supplier.id}`}
                supplier={supplier}
                alertCount={alertCount}
                markerColor={markerColor}
                onSupplierClick={(supplier) => {
                  if (onSupplierClick) {
                    onSupplierClick(supplier);
                  }
                }}
              />
            );
          })}

          {/* Port Markers - Triangle Shape */}
          {activeFilters.ports && ports.length > 0 && ports.map((port, index) => {
            return (
              <PortMarker
                key={`port-${port.id}`}
                port={port}
                alertCount={port.alertCount}
                onPortClick={(port) => {
                  console.log('Port clicked:', port);
                  // Could add onPortClick callback if needed
                }}
              />
            );
          })}

          {/* Event Markers */}
          {activeFilters.events && getEventCoordinates().map((eventMarker, index) => (
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
                  if (onEventClick) {
                    onEventClick(eventMarker);
                  }
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


    </Paper>
  );
};

export default DetailedWorldMap;

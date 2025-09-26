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
  Tooltip,
  Button
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
import { MapContainer, TileLayer, CircleMarker, Popup, Marker, Polyline, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  getUserLanguage, 
  getCountryName, 
  getUIText, 
  getRecommendedTileProvider 
} from '../utils/mapLanguageConfig';
import { eventsAPI } from '../services/api';
import { supplyChainAPI } from '../services/supplyChainService';
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
    ">${alertCount > 0 ? alertCount : ''}</div>`,
    iconSize: [alertCount > 0 ? 20 : 16, alertCount > 0 ? 20 : 16],
    iconAnchor: [alertCount > 0 ? 10 : 8, alertCount > 0 ? 10 : 8]
  });

  return (
    <Marker position={supplier.coords} icon={divIcon}>
      <Popup>
        <Box sx={{ minWidth: 250, maxWidth: 350 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            {supplier.name}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Country:</strong> {supplier.country}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Tier:</strong> {supplier.tier}
          </Typography>
          {alertCount > 0 && (
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Active Alerts:</strong> {alertCount}
            </Typography>
          )}
          {alertCount === 0 && (
            <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
              ✓ No active alerts
            </Typography>
          )}
          <Button 
            variant="contained" 
            size="small" 
            fullWidth
            onClick={() => window.location.href = `/supplier/${supplier.id}`}
          >
            View Details
          </Button>
        </Box>
      </Popup>
    </Marker>
  );
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
    ">${alertCount > 0 ? alertCount : ''}</div>`,
    iconSize: [alertCount > 0 ? 16 : 12, alertCount > 0 ? 16 : 12],
    iconAnchor: [alertCount > 0 ? 8 : 6, alertCount > 0 ? 12 : 10]
  });

  return (
    <Marker position={port.coords} icon={divIcon}>
      <Popup>
        <Box sx={{ minWidth: 250, maxWidth: 350 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            {port.name}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Country:</strong> {port.country}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Status:</strong> 
            <Chip 
              label={port.status.toUpperCase()} 
              size="small" 
              sx={{ 
                ml: 1, 
                backgroundColor: port.status === 'active' ? '#16a34a' : port.status === 'delayed' ? '#dc2626' : '#6b7280',
                color: 'white',
                fontWeight: 600
              }} 
            />
          </Typography>
          {port.alertCount > 0 && (
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Active Alerts:</strong> {port.alertCount}
            </Typography>
          )}
          {port.alertCount === 0 && (
            <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
              ✓ No active alerts
            </Typography>
          )}
          <Button 
            variant="contained" 
            size="small" 
            fullWidth
            onClick={() => window.location.href = `/port/${port.id}`}
          >
            View Details
          </Button>
        </Box>
      </Popup>
    </Marker>
  );
};


// Detailed risk data with exact country boundaries
const riskData = {
  'United States': { 
    level: 'low', score: 3.2, events: 2, 
    coords: [39.8283, -98.5795],
    description: 'Stable political environment',
    // Simplified but accurate US boundary
    geoJson: {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-125.0, 49.0], [-66.9, 49.0], [-66.9, 24.4], [-125.0, 24.4], [-125.0, 49.0]
        ]]
      }
    }
  },
  'China': { 
    level: 'high', score: 8.5, events: 12, 
    coords: [35.8617, 104.1954],
    description: 'Supply chain disruptions, trade tensions',
    geoJson: {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[
          [73.6, 53.6], [135.0, 53.6], [135.0, 18.2], [73.6, 18.2], [73.6, 53.6]
        ]]
      }
    }
  },
  'Germany': { 
    level: 'low', score: 2.8, events: 1, 
    coords: [51.1657, 10.4515],
    description: 'Economic stability, strong institutions',
    geoJson: {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[
          [5.9, 55.1], [15.0, 55.1], [15.0, 47.3], [5.9, 47.3], [5.9, 55.1]
        ]]
      }
    }
  },
  'Japan': { 
    level: 'low', score: 3.5, events: 2, 
    coords: [36.2048, 138.2529],
    description: 'Natural disaster preparedness concerns',
    geoJson: {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[
          [123.0, 45.6], [145.8, 45.6], [145.8, 24.2], [123.0, 24.2], [123.0, 45.6]
        ]]
      }
    }
  },
  'Singapore': { 
    level: 'low', score: 2.1, events: 0, 
    coords: [1.3521, 103.8198],
    description: 'Stable financial hub, low risk',
    geoJson: {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[
          [103.6, 1.47], [104.0, 1.47], [104.0, 1.16], [103.6, 1.16], [103.6, 1.47]
        ]]
      }
    }
  },
  'Netherlands': { 
    level: 'low', score: 2.5, events: 1, 
    coords: [52.1326, 5.2913],
    description: 'Stable economy, major port hub',
    geoJson: {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[
          [3.3, 53.6], [7.2, 53.6], [7.2, 50.8], [3.3, 50.8], [3.3, 53.6]
        ]]
      }
    }
  },
  'United Arab Emirates': { 
    level: 'medium', score: 4.2, events: 3, 
    coords: [23.4241, 53.8478],
    description: 'Regional tensions, economic diversification',
    geoJson: {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[
          [51.0, 26.1], [56.4, 26.1], [56.4, 22.5], [51.0, 22.5], [51.0, 26.1]
        ]]
      }
    }
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
  activeFilters = { suppliers: true, events: true, ports: true, routes: false },
  showCountryRisk = false
}) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [userLanguage] = useState(getUserLanguage());
  const [tileProvider] = useState(getRecommendedTileProvider(userLanguage));
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [ports, setPorts] = useState([]);
  const [routes, setRoutes] = useState([]);

  // Calculate risk statistics
  const riskStats = Object.values(riskData).reduce((acc, risk) => {
    acc[risk.level] = (acc[risk.level] || 0) + 1;
    acc.totalEvents += risk.events;
    return acc;
  }, { critical: 0, high: 0, medium: 0, low: 0, totalEvents: 0 });

  // Load events when component mounts
  useEffect(() => {
    const loadAllData = async () => {
      await Promise.all([
        loadEvents(),
        loadSuppliers(),
        loadPorts(),
        loadRoutes()
      ]);
      loadAlerts(); // Keep alerts synchronous for now
    };
    
    loadAllData();
  }, []);

  const loadSuppliers = async () => {
    try {
      const response = await supplyChainAPI.getSuppliers('demo-user');
      
      if (response.success && response.suppliers && response.suppliers.length > 0) {
        setSuppliers(response.suppliers);
      } else {
        // Fallback to mock data if no real data
        const fallbackSuppliers = [
          {
            id: 'supplier-1',
            name: 'Shanghai Metal Works',
            country: 'China',
            coords: [31.2304, 121.4737], // Shanghai
            tier: 'Tier 1',
            alertCount: 2,
            status: 'active'
          },
          {
            id: 'supplier-2', 
            name: 'German Electronics Ltd',
            country: 'Germany',
            coords: [52.5200, 13.4050], // Berlin
            tier: 'Tier 1',
            alertCount: 1,
            status: 'active'
          }
        ];
        setSuppliers(fallbackSuppliers);
      }
    } catch (error) {
      console.error('Error loading suppliers:', error);
      // Fallback to mock data on error
      const fallbackSuppliers = [
        {
          id: 'supplier-1',
          name: 'Shanghai Metal Works',
          country: 'China',
          coords: [31.2304, 121.4737],
          tier: 'Tier 1',
          alertCount: 2,
          status: 'active'
        }
      ];
      setSuppliers(fallbackSuppliers);
    }
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

  const loadPorts = async () => {
    try {
      const response = await supplyChainAPI.getPorts('demo-user');
      
      if (response.success && response.ports && response.ports.length > 0) {
        setPorts(response.ports);
      } else {
        // Fallback to mock data if no real data
        const fallbackPorts = [
          {
            id: 'port-1',
            name: 'Port of Shanghai',
            country: 'China',
            coords: [31.2397, 121.4994], // Shanghai port
            status: 'active',
            alertCount: 1,
            type: 'container'
          },
          {
            id: 'port-2',
            name: 'Port of Hamburg',
            country: 'Germany', 
            coords: [53.5511, 9.9937], // Hamburg
            status: 'active',
            alertCount: 0,
            type: 'container'
          }
        ];
        setPorts(fallbackPorts);
      }
    } catch (error) {
      console.error('Error loading ports:', error);
      // Fallback to mock data on error
      const fallbackPorts = [
        {
          id: 'port-1',
          name: 'Port of Shanghai',
          country: 'China',
          coords: [31.2397, 121.4994],
          status: 'active',
          alertCount: 1,
          type: 'container'
        }
      ];
      setPorts(fallbackPorts);
    }
  };

  const loadRoutes = async () => {
    try {
      console.log('Loading routes from API...');
      const response = await supplyChainAPI.getRoutes('demo-user');
      
      if (response.success && response.routes) {
        console.log('Loaded routes:', response.routes);
        setRoutes(response.routes);
      } else {
        console.log('No routes found, using fallback data');
        // Fallback to mock data if no real data
        const fallbackRoutes = [
          {
            id: 'route-1',
            name: 'Shanghai to Los Angeles',
            from: { name: 'Port of Shanghai', coords: [31.2397, 121.4994] },
            to: { name: 'Port of Los Angeles', coords: [33.7175, -118.2708] },
            status: 'active',
            frequency: 'weekly',
            alertCount: 1
          },
          {
            id: 'route-2', 
            name: 'Hamburg to New York',
            from: { name: 'Port of Hamburg', coords: [53.5511, 9.9937] },
            to: { name: 'Port of New York', coords: [40.6892, -74.0445] },
            status: 'delayed',
            frequency: 'bi-weekly',
            alertCount: 2
          },
          {
            id: 'route-3',
            name: 'Singapore to Rotterdam',
            from: { name: 'Port of Singapore', coords: [1.3521, 103.8198] },
            to: { name: 'Port of Rotterdam', coords: [51.9225, 4.4792] },
            status: 'active',
            frequency: 'weekly',
            alertCount: 0
          },
          {
            id: 'route-4',
            name: 'Dubai to Hamburg',
            from: { name: 'Port of Dubai', coords: [25.2048, 55.2708] },
            to: { name: 'Port of Hamburg', coords: [53.5511, 9.9937] },
            status: 'active',
            frequency: 'bi-weekly',
            alertCount: 1
          },
          {
            id: 'route-5',
            name: 'Los Angeles to Tokyo',
            from: { name: 'Port of Los Angeles', coords: [33.7175, -118.2708] },
            to: { name: 'Port of Tokyo', coords: [35.6762, 139.6503] },
            status: 'delayed',
            frequency: 'weekly',
            alertCount: 3
          },
          {
            id: 'route-6',
            name: 'Antwerp to New York',
            from: { name: 'Port of Antwerp', coords: [51.2194, 4.4025] },
            to: { name: 'Port of New York', coords: [40.6892, -74.0445] },
            status: 'active',
            frequency: 'weekly',
            alertCount: 0
          }
        ];
        setRoutes(fallbackRoutes);
      }
    } catch (error) {
      console.error('Error loading routes:', error);
      // Fallback to mock data on error
      const fallbackRoutes = [
        {
          id: 'route-1',
          name: 'Shanghai to Los Angeles',
          from: { name: 'Port of Shanghai', coords: [31.2397, 121.4994] },
          to: { name: 'Port of Los Angeles', coords: [33.7175, -118.2708] },
          status: 'active',
          frequency: 'weekly',
          alertCount: 1
        },
        {
          id: 'route-2',
          name: 'Hamburg to New York',
          from: { name: 'Port of Hamburg', coords: [53.5511, 9.9937] },
          to: { name: 'Port of New York', coords: [40.6892, -74.0445] },
          status: 'delayed',
          frequency: 'bi-weekly',
          alertCount: 2
        },
        {
          id: 'route-3',
          name: 'Singapore to Rotterdam',
          from: { name: 'Port of Singapore', coords: [1.3521, 103.8198] },
          to: { name: 'Port of Rotterdam', coords: [51.9225, 4.4792] },
          status: 'active',
          frequency: 'weekly',
          alertCount: 0
        }
      ];
      setRoutes(fallbackRoutes);
    }
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      const apiEvents = await eventsAPI.getAllEvents();
      if (apiEvents && apiEvents.length > 0) {
        setEvents(apiEvents);
      } else {
        // Fallback to sample data
        const sampleEvents = getSampleEvents();
        setEvents(sampleEvents);
      }
    } catch (error) {
      console.warn('API not available, using sample data:', error.message);
      const sampleEvents = getSampleEvents();
      setEvents(sampleEvents);
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

  // Clustering logic - group nearby markers
  const clusterMarkers = (markers, clusterDistance = 0.5) => {
    const clusters = [];
    const processed = new Set();

    markers.forEach((marker, index) => {
      if (processed.has(index)) return;

      const cluster = [marker];
      processed.add(index);

      // Find nearby markers
      markers.forEach((otherMarker, otherIndex) => {
        if (processed.has(otherIndex) || index === otherIndex) return;

        const distance = Math.sqrt(
          Math.pow(marker.coords[0] - otherMarker.coords[0], 2) +
          Math.pow(marker.coords[1] - otherMarker.coords[1], 2)
        );

        if (distance < clusterDistance) {
          cluster.push(otherMarker);
          processed.add(otherIndex);
        }
      });

      clusters.push(cluster);
    });

    return clusters;
  };

  // Get countries relevant to user's supply chain
  const getRelevantCountries = () => {
    const countries = new Set();
    
    // Add countries from suppliers
    suppliers.forEach(supplier => {
      if (supplier.country) countries.add(supplier.country);
    });
    
    // Add countries from ports
    ports.forEach(port => {
      if (port.country) countries.add(port.country);
    });
    
    // Add countries from routes
    routes.forEach(route => {
      if (route.from && route.from.country) countries.add(route.from.country);
      if (route.to && route.to.country) countries.add(route.to.country);
    });
    
    // Add countries from events
    events.forEach(event => {
      if (event.countries) {
        event.countries.forEach(country => countries.add(country));
      }
    });
    
    return Array.from(countries);
  };


  // Get all markers for clustering
  const getAllMarkers = () => {
    const allMarkers = [];

    // Add suppliers
    if (activeFilters.suppliers && suppliers.length > 0) {
      suppliers.forEach(supplier => {
        allMarkers.push({
          id: supplier.id,
          type: 'supplier',
          coords: supplier.coords,
          data: supplier,
          priority: 1 // Highest priority
        });
      });
    }

    // Add ports
    if (activeFilters.ports && ports.length > 0) {
      ports.forEach(port => {
        allMarkers.push({
          id: port.id,
          type: 'port',
          coords: port.coords,
          data: port,
          priority: 2
        });
      });
    }

    // Add events
    if (activeFilters.events && events.length > 0) {
      getEventCoordinates().forEach(event => {
        allMarkers.push({
          id: event.id || `event-${event.title}`,
          type: 'event',
          coords: event.coords,
          data: event,
          priority: 3
        });
      });
    }

    return allMarkers;
  };

  const handleRefresh = () => {
    setSelectedCountry(null);
  };

  // Clustered Marker Component (defined inside component to access helper functions)
  const ClusteredMarker = ({ cluster, onSupplierClick, onEventClick, onPortClick }) => {
    if (cluster.length === 1) {
      // Single marker - render normally
      const marker = cluster[0];
      if (marker.type === 'supplier') {
        const supplier = marker.data;
        const alertCount = getSupplierAlertCount(supplier.id);
        const markerColor = getSupplierMarkerColor(supplier.id);
        return (
          <SupplierMarker
            supplier={supplier}
            alertCount={alertCount}
            markerColor={markerColor}
            onSupplierClick={() => {}} // No auto-redirect
          />
        );
      } else if (marker.type === 'port') {
        const port = marker.data;
        return (
          <PortMarker
            port={port}
            alertCount={port.alertCount}
            onPortClick={() => {}} // No auto-redirect
          />
        );
      } else if (marker.type === 'event') {
        const event = marker.data;
        return (
          <CircleMarker
            center={event.coords}
            radius={8}
            fillColor={getEventSeverityColor(event.severity)}
            color="#ffffff"
            weight={2}
            opacity={1}
            fillOpacity={0.9}
          >
            <Popup>
              <Box sx={{ minWidth: 250, maxWidth: 350 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  📰 {event.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Category:</strong> {event.category}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Severity:</strong> 
                  <Chip 
                    label={event.severity?.toUpperCase()} 
                    size="small" 
                    sx={{ 
                      ml: 1, 
                      backgroundColor: getEventSeverityColor(event.severity),
                      color: 'white',
                      fontWeight: 600
                    }} 
                  />
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Location:</strong> {event.countryName}
                  {event.region && ` (${event.region})`}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Date:</strong> {event.eventDate?.toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {event.description}
                </Typography>
                <Button 
                  variant="contained" 
                  size="small" 
                  fullWidth
                  onClick={() => window.location.href = `/event/${event.id || event.title}`}
                >
                  View Details
                </Button>
              </Box>
            </Popup>
          </CircleMarker>
        );
      }
    }

    // Multiple markers - create cluster
    const centerCoords = [
      cluster.reduce((sum, marker) => sum + marker.coords[0], 0) / cluster.length,
      cluster.reduce((sum, marker) => sum + marker.coords[1], 0) / cluster.length
    ];

    const clusterIcon = L.divIcon({
      className: 'custom-cluster-marker',
      html: `<div style="
        width: 30px;
        height: 30px;
        background-color: #1976d2;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 12px;
      ">${cluster.length}</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    return (
      <Marker position={centerCoords} icon={clusterIcon}>
        <Popup>
          <Box sx={{ minWidth: 300, maxWidth: 400 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              📍 Multiple Items ({cluster.length})
            </Typography>
            <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
              {cluster.map((marker, index) => (
                <Box key={marker.id} sx={{ p: 1, mb: 1, border: 1, borderColor: 'divider', borderRadius: 1, backgroundColor: 'background.paper', cursor: 'pointer' }}>
                  {marker.type === 'supplier' && (
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {marker.data.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
                        {marker.data.country} • {marker.data.tier}
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        fullWidth
                        onClick={() => window.location.href = `/supplier/${marker.data.id}`}
                      >
                        View Details
                      </Button>
                    </Box>
                  )}
                  {marker.type === 'port' && (
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {marker.data.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
                        {marker.data.country} • {marker.data.status}
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        fullWidth
                        onClick={() => window.location.href = `/port/${marker.data.id}`}
                      >
                        View Details
                      </Button>
                    </Box>
                  )}
                  {marker.type === 'event' && (
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        📰 {marker.data.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
                        {marker.data.category} • {marker.data.severity?.toUpperCase()}
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        fullWidth
                        onClick={() => window.location.href = `/event/${marker.data.id || marker.data.title}`}
                      >
                        View Details
                      </Button>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </Popup>
      </Marker>
    );
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
        
        {/* Routes - Line */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ 
            width: 20, 
            height: 2, 
            backgroundColor: getEventSeverityColor('high'),
            borderRadius: 1
          }} />
          <Typography variant="caption">Routes</Typography>
        </Box>
        
        {/* Clusters - Circle with number */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ 
            width: 16, 
            height: 16, 
            backgroundColor: '#1976d2',
            border: '2px solid white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 'bold',
            color: 'white'
          }}>
            3
          </Box>
          <Typography variant="caption">Clusters</Typography>
        </Box>
        
        {/* Country Risk - Rectangle with low opacity */}
        {showCountryRisk && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 20, 
              height: 12, 
              backgroundColor: getRiskColor('high'),
              border: '1px solid white',
              opacity: 0.3
            }} />
            <Typography variant="caption">Country Risk</Typography>
          </Box>
        )}
        
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
          
          {/* Country Risk Overlay */}
          {showCountryRisk && getRelevantCountries().map(countryName => {
            const countryData = riskData[countryName];
            if (!countryData || !countryData.geoJson) return null;
            
            const riskColor = getRiskColor(countryData.level);
            
            return (
              <GeoJSON
                key={`country-risk-${countryName}`}
                data={countryData.geoJson}
                style={{
                  fillColor: riskColor,
                  color: '#ffffff',
                  weight: 2,
                  opacity: 0.8,
                  fillOpacity: 0.3
                }}
                eventHandlers={{
                  click: () => {
                    setSelectedCountry({
                      name: countryName,
                      ...countryData
                    });
                  }
                }}
              >
                <Popup>
                  <Box sx={{ minWidth: 250, maxWidth: 350 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      {countryName} Risk Assessment
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Risk Level:</strong> 
                      <Chip 
                        label={countryData.level?.toUpperCase()} 
                        size="small" 
                        sx={{ 
                          ml: 1, 
                          backgroundColor: riskColor,
                          color: 'white',
                          fontWeight: 600
                        }} 
                      />
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Risk Score:</strong> {countryData.score}/10
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Active Events:</strong> {countryData.events}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>Assessment:</strong> {countryData.description}
                    </Typography>
                    <Button 
                      variant="contained" 
                      size="small" 
                      fullWidth
                      onClick={() => {
                        // Future: Navigate to country risk detail page
                        console.log('Country risk details for:', countryName);
                      }}
                    >
                      View Risk Details
                    </Button>
                  </Box>
                </Popup>
              </GeoJSON>
            );
          })}
          
          {/* Clustered Markers */}
          {(() => {
            const allMarkers = getAllMarkers();
            const clusters = clusterMarkers(allMarkers);
            
            return clusters.map((cluster, index) => (
              <ClusteredMarker
                key={`cluster-${index}`}
                cluster={cluster}
                onSupplierClick={(supplier) => {
                  if (onSupplierClick) {
                    onSupplierClick(supplier);
                  }
                }}
                onEventClick={(event) => {
                  if (onEventClick) {
                    onEventClick(event);
                  }
                }}
                onPortClick={(port) => {
                  console.log('Port clicked:', port);
                }}
              />
            ));
          })()}

          {/* Shipping Routes - Lines */}
          {activeFilters.routes && routes.length > 0 && routes.map((route, index) => {
            const routeColor = route.status === 'active' ? '#16a34a' : route.status === 'delayed' ? '#dc2626' : '#6b7280';
            const routeWeight = route.alertCount > 0 ? 4 : 2;
            
            return (
              <Polyline
                key={`route-${route.id}`}
                positions={[route.from.coords, route.to.coords]}
                color={routeColor}
                weight={routeWeight}
                opacity={0.8}
                dashArray={route.status === 'delayed' ? '10, 10' : undefined}
                eventHandlers={{
                  click: () => {
                    console.log('Route clicked:', route);
                  }
                }}
              />
            );
          })}
        </MapContainer>
      </Box>


    </Paper>
  );
};

export default DetailedWorldMap;

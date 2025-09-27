import React, { useState, useEffect } from 'react';
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
  IconButton
} from '@mui/material';
import {
  Warning,
  Error,
  CheckCircle,
  Info,
  ZoomIn,
  ZoomOut,
  Refresh
} from '@mui/icons-material';

// World map topology URL
const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

// Sample risk data - in a real app, this would come from your API
const sampleRiskData = {
  'China': { level: 'high', score: 8.5, events: 12, description: 'Supply chain disruptions, trade tensions' },
  'Russia': { level: 'high', score: 9.2, events: 18, description: 'Geopolitical tensions, sanctions impact' },
  'Ukraine': { level: 'critical', score: 9.8, events: 25, description: 'Active conflict zone, infrastructure damage' },
  'Iran': { level: 'high', score: 8.1, events: 8, description: 'Regional instability, sanctions' },
  'North Korea': { level: 'high', score: 7.9, events: 6, description: 'Nuclear tensions, unpredictable policies' },
  'Venezuela': { level: 'medium', score: 6.5, events: 4, description: 'Economic instability, political unrest' },
  'Syria': { level: 'high', score: 8.7, events: 15, description: 'Ongoing conflict, humanitarian crisis' },
  'Afghanistan': { level: 'high', score: 8.3, events: 10, description: 'Political instability, security concerns' },
  'Myanmar': { level: 'medium', score: 7.2, events: 7, description: 'Political coup, civil unrest' },
  'Ethiopia': { level: 'medium', score: 6.8, events: 5, description: 'Internal conflicts, drought conditions' },
  'United States': { level: 'low', score: 3.2, events: 2, description: 'Stable political environment' },
  'Germany': { level: 'low', score: 2.8, events: 1, description: 'Economic stability, strong institutions' },
  'Japan': { level: 'low', score: 3.5, events: 2, description: 'Natural disaster preparedness concerns' },
  'Australia': { level: 'low', score: 2.5, events: 1, description: 'Stable democracy, strong economy' },
  'Canada': { level: 'low', score: 2.3, events: 1, description: 'Political stability, resource security' },
  'United Kingdom': { level: 'low', score: 3.8, events: 2, description: 'Post-Brexit adjustments' },
  'France': { level: 'low', score: 3.6, events: 2, description: 'Social tensions, economic challenges' },
  'India': { level: 'medium', score: 5.5, events: 8, description: 'Border tensions, economic growth challenges' },
  'Brazil': { level: 'medium', score: 6.2, events: 6, description: 'Political polarization, environmental concerns' },
  'South Africa': { level: 'medium', score: 6.9, events: 5, description: 'Economic challenges, social unrest' }
};

// Color mapping for risk levels
const getRiskColor = (level, isHovered = false) => {
  const colors = {
    critical: isHovered ? '#b91c1c' : '#dc2626', // Red
    high: isHovered ? '#d97706' : '#f59e0b',     // Orange  
    medium: isHovered ? '#ca8a04' : '#eab308',   // Yellow
    low: isHovered ? '#059669' : '#10b981',      // Green
    default: isHovered ? '#6b7280' : '#9ca3af'   // Gray
  };
  return colors[level] || colors.default;
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

const WorldRiskMap = () => {
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [zoom, setZoom] = useState(1.5);
  const [center, setCenter] = useState([15, 0]);

  // Calculate risk statistics
  const riskStats = Object.values(sampleRiskData).reduce((acc, risk) => {
    acc[risk.level] = (acc[risk.level] || 0) + 1;
    acc.totalEvents += risk.events;
    return acc;
  }, { critical: 0, high: 0, medium: 0, low: 0, totalEvents: 0 });

  const handleZoomIn = () => {
    if (zoom >= 4) return;
    setZoom(zoom * 1.5);
  };

  const handleZoomOut = () => {
    if (zoom <= 1.5) return;
    setZoom(zoom / 1.5);
  };

  const handleReset = () => {
    setZoom(1.5);
    setCenter([15, 0]);
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
          Global Risk Assessment Map
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small" onClick={handleZoomIn} disabled={zoom >= 4}>
            <ZoomIn />
          </IconButton>
          <IconButton size="small" onClick={handleZoomOut} disabled={zoom <= 1.5}>
            <ZoomOut />
          </IconButton>
          <IconButton size="small" onClick={handleReset}>
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Risk Level Legend */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Chip
          icon={<Error fontSize="small" />}
          label={`Critical (${riskStats.critical})`}
          size="small"
          sx={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}
        />
        <Chip
          icon={<Warning fontSize="small" />}
          label={`High (${riskStats.high})`}
          size="small"
          sx={{ backgroundColor: '#fffbeb', color: '#f59e0b', border: '1px solid #fed7aa' }}
        />
        <Chip
          icon={<Info fontSize="small" />}
          label={`Medium (${riskStats.medium})`}
          size="small"
          sx={{ backgroundColor: '#fefce8', color: '#eab308', border: '1px solid #fde68a' }}
        />
        <Chip
          icon={<CheckCircle fontSize="small" />}
          label={`Low (${riskStats.low})`}
          size="small"
          sx={{ backgroundColor: '#f0fdf4', color: '#10b981', border: '1px solid #bbf7d0' }}
        />
        <Chip
          label={`Total Events: ${riskStats.totalEvents}`}
          size="small"
          variant="outlined"
          sx={{ ml: 1 }}
        />
      </Box>

      {/* Map Container */}
      <Box sx={{ 
        flexGrow: 1, 
        position: 'relative', 
        minHeight: '400px',
        width: '100%',
        '& .leaflet-container': {
          width: '100% !important',
          '& .leaflet-tile-pane': {
            width: '100% !important'
          }
        }
      }}>
        <ComposableMap
          projectionConfig={{
            rotate: [-10, 0, 0],
            scale: 160
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
                  const riskData = sampleRiskData[countryName];
                  const isHovered = hoveredCountry === countryName;
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setHoveredCountry(countryName)}
                      onMouseLeave={() => setHoveredCountry(null)}
                      onClick={() => setSelectedCountry(riskData ? { name: countryName, ...riskData } : null)}
                      style={{
                        default: {
                          fill: riskData ? getRiskColor(riskData.level) : '#f3f4f6',
                          stroke: '#ffffff',
                          strokeWidth: 0.5,
                          outline: 'none',
                        },
                        hover: {
                          fill: riskData ? getRiskColor(riskData.level, true) : '#e5e7eb',
                          stroke: '#374151',
                          strokeWidth: 1,
                          outline: 'none',
                          cursor: 'pointer'
                        },
                        pressed: {
                          fill: riskData ? getRiskColor(riskData.level, true) : '#e5e7eb',
                          stroke: '#374151',
                          strokeWidth: 1,
                          outline: 'none',
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip for hovered country */}
        {hoveredCountry && sampleRiskData[hoveredCountry] && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              p: 1,
              borderRadius: 1,
              fontSize: '0.875rem',
              zIndex: 1000,
              maxWidth: 300
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {hoveredCountry}
            </Typography>
            <Typography variant="body2">
              Risk Level: {sampleRiskData[hoveredCountry].level.toUpperCase()}
            </Typography>
            <Typography variant="body2">
              Risk Score: {sampleRiskData[hoveredCountry].score}/10
            </Typography>
            <Typography variant="body2">
              Active Events: {sampleRiskData[hoveredCountry].events}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Selected Country Details */}
      {selectedCountry && (
        <Card sx={{ mt: 2 }}>
          <CardContent sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {getRiskIcon(selectedCountry.level)}
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {selectedCountry.name}
              </Typography>
              <Chip
                label={selectedCountry.level.toUpperCase()}
                size="small"
                color={selectedCountry.level === 'critical' ? 'error' : 
                       selectedCountry.level === 'high' ? 'warning' :
                       selectedCountry.level === 'medium' ? 'info' : 'success'}
              />
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">Risk Score</Typography>
                <Typography variant="h6">{selectedCountry.score}/10</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">Active Events</Typography>
                <Typography variant="h6">{selectedCountry.events}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <Typography variant="body2">{selectedCountry.level.toUpperCase()}</Typography>
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

export default WorldRiskMap;

import React, { useState } from 'react';
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
  Public
} from '@mui/icons-material';

// Sample risk data with coordinates aligned to continent shapes
const riskData = {
  // North America (continent shape: x: 8-30, y: 15-45)
  'United States': { level: 'low', score: 3.2, events: 2, x: 20, y: 32, description: 'Stable political environment' },
  'Canada': { level: 'low', score: 2.3, events: 1, x: 18, y: 22, description: 'Political stability, resource security' },
  'Mexico': { level: 'medium', score: 6.0, events: 4, x: 16, y: 38, description: 'Drug cartel violence, economic challenges' },
  
  // South America (continent shape: x: 18-32, y: 45-80)
  'Brazil': { level: 'medium', score: 6.2, events: 6, x: 26, y: 62, description: 'Political polarization, environmental concerns' },
  'Venezuela': { level: 'high', score: 8.5, events: 12, x: 24, y: 52, description: 'Economic collapse, political crisis' },
  
  // Europe (continent shape: x: 45-58, y: 15-32)
  'Germany': { level: 'low', score: 2.8, events: 1, x: 52, y: 24, description: 'Economic stability, strong institutions' },
  'United Kingdom': { level: 'low', score: 3.8, events: 2, x: 46, y: 20, description: 'Post-Brexit adjustments' },
  'France': { level: 'low', score: 3.6, events: 2, x: 49, y: 26, description: 'Social tensions, economic challenges' },
  'Ukraine': { level: 'critical', score: 9.8, events: 25, x: 56, y: 22, description: 'Active conflict zone, infrastructure damage' },
  
  // Asia (continent shape: x: 58-85, y: 10-45)
  'Russia': { level: 'high', score: 9.2, events: 18, x: 72, y: 18, description: 'Geopolitical tensions, sanctions impact' },
  'China': { level: 'high', score: 8.5, events: 12, x: 78, y: 32, description: 'Supply chain disruptions, trade tensions' },
  'Japan': { level: 'low', score: 3.5, events: 2, x: 84, y: 30, description: 'Natural disaster preparedness concerns' },
  'North Korea': { level: 'high', score: 7.9, events: 6, x: 82, y: 28, description: 'Nuclear tensions, unpredictable policies' },
  'India': { level: 'medium', score: 5.5, events: 8, x: 68, y: 38, description: 'Border tensions, economic growth challenges' },
  
  // Africa (continent shape: x: 46-60, y: 30-75)
  'South Africa': { level: 'medium', score: 6.9, events: 5, x: 54, y: 70, description: 'Economic challenges, social unrest' },
  'Egypt': { level: 'medium', score: 6.5, events: 7, x: 56, y: 35, description: 'Political instability, economic pressures' },
  
  // Middle East (between Africa and Asia)
  'Iran': { level: 'high', score: 8.1, events: 8, x: 62, y: 36, description: 'Regional instability, sanctions' },
  'Turkey': { level: 'medium', score: 6.8, events: 9, x: 58, y: 30, description: 'Regional conflicts, economic volatility' },
  'Saudi Arabia': { level: 'medium', score: 5.8, events: 5, x: 60, y: 40, description: 'Regional tensions, economic diversification' },
  
  // Oceania (continent shape: x: 72-88, y: 65-82)
  'Australia': { level: 'low', score: 2.5, events: 1, x: 80, y: 74, description: 'Stable democracy, strong economy' }
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

const SimpleWorldMap = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);

  // Calculate risk statistics
  const riskStats = Object.values(riskData).reduce((acc, risk) => {
    acc[risk.level] = (acc[risk.level] || 0) + 1;
    acc.totalEvents += risk.events;
    return acc;
  }, { critical: 0, high: 0, medium: 0, low: 0, totalEvents: 0 });

  const handleCountryClick = (countryName, countryData) => {
    setSelectedCountry({ name: countryName, ...countryData });
  };

  const handleRefresh = () => {
    setSelectedCountry(null);
    setHoveredCountry(null);
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
          <IconButton size="small" onClick={handleRefresh}>
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

      {/* Simplified World Map with Risk Points */}
      <Box sx={{ 
        flexGrow: 1, 
        position: 'relative', 
        minHeight: '300px',
        background: 'linear-gradient(135deg, #4fc3f7 0%, #29b6f6 50%, #0277bd 100%)',
        borderRadius: 2,
        border: '2px solid #0288d1',
        overflow: 'hidden',
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {/* Ocean Pattern */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          opacity: 0.5
        }} />
        
        {/* Continent Shapes */}
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {/* North America */}
          <path
            d="M 8 20 Q 22 15 30 25 L 28 40 Q 18 45 12 40 L 8 30 Z"
            fill="#66bb6a"
            fillOpacity="0.6"
            stroke="#388e3c"
            strokeWidth="0.5"
          />
          
          {/* South America */}
          <path
            d="M 22 50 Q 28 45 32 55 L 30 75 Q 25 80 20 70 L 18 60 Z"
            fill="#66bb6a"
            fillOpacity="0.6"
            stroke="#388e3c"
            strokeWidth="0.5"
          />
          
          {/* Europe */}
          <path
            d="M 45 18 Q 52 15 58 22 L 56 28 Q 50 32 45 25 Z"
            fill="#66bb6a"
            fillOpacity="0.6"
            stroke="#388e3c"
            strokeWidth="0.5"
          />
          
          {/* Africa */}
          <path
            d="M 48 32 Q 55 30 60 45 L 58 70 Q 52 75 48 65 L 46 45 Z"
            fill="#66bb6a"
            fillOpacity="0.6"
            stroke="#388e3c"
            strokeWidth="0.5"
          />
          
          {/* Asia */}
          <path
            d="M 58 15 Q 75 10 85 25 L 82 40 Q 70 45 60 35 L 58 25 Z"
            fill="#66bb6a"
            fillOpacity="0.6"
            stroke="#388e3c"
            strokeWidth="0.5"
          />
          
          {/* Australia */}
          <path
            d="M 72 68 Q 82 65 88 72 L 86 78 Q 78 82 72 75 Z"
            fill="#66bb6a"
            fillOpacity="0.6"
            stroke="#388e3c"
            strokeWidth="0.5"
          />
          
          {/* Continent Labels */}
          <text x="18" y="32" fill="#1b5e20" fontSize="3" fontWeight="bold" opacity="0.8">
            N. AMERICA
          </text>
          <text x="22" y="65" fill="#1b5e20" fontSize="3" fontWeight="bold" opacity="0.8">
            S. AMERICA
          </text>
          <text x="47" y="23" fill="#1b5e20" fontSize="2.5" fontWeight="bold" opacity="0.8">
            EUROPE
          </text>
          <text x="50" y="52" fill="#1b5e20" fontSize="3" fontWeight="bold" opacity="0.8">
            AFRICA
          </text>
          <text x="68" y="28" fill="#1b5e20" fontSize="3" fontWeight="bold" opacity="0.8">
            ASIA
          </text>
          <text x="76" y="76" fill="#1b5e20" fontSize="2.5" fontWeight="bold" opacity="0.8">
            OCEANIA
          </text>
        </svg>

        {/* Grid Lines for Geographic Reference */}
        <svg 
          width="100%" 
          height="100%" 
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {/* Longitude lines */}
          {[20, 40, 60, 80].map(x => (
            <line 
              key={`lon-${x}`}
              x1={`${x}%`} 
              y1="0%" 
              x2={`${x}%`} 
              y2="100%" 
              stroke="#b0bec5" 
              strokeWidth="1" 
              strokeDasharray="2,2"
              opacity="0.5"
            />
          ))}
          {/* Latitude lines */}
          {[20, 40, 60, 80].map(y => (
            <line 
              key={`lat-${y}`}
              x1="0%" 
              y1={`${y}%`} 
              x2="100%" 
              y2={`${y}%`} 
              stroke="#b0bec5" 
              strokeWidth="1" 
              strokeDasharray="2,2"
              opacity="0.5"
            />
          ))}
        </svg>

        {/* Risk Points */}
        {Object.entries(riskData).map(([countryName, data]) => (
          <Tooltip 
            key={countryName}
            title={
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {countryName}
                </Typography>
                <Typography variant="body2">
                  Risk Level: {data.level.toUpperCase()}
                </Typography>
                <Typography variant="body2">
                  Risk Score: {data.score}/10
                </Typography>
                <Typography variant="body2">
                  Active Events: {data.events}
                </Typography>
              </Box>
            }
            placement="top"
          >
            <Box
              sx={{
                position: 'absolute',
                left: `${data.x}%`,
                top: `${data.y}%`,
                transform: 'translate(-50%, -50%)',
                width: data.level === 'critical' ? 24 : data.level === 'high' ? 20 : 16,
                height: data.level === 'critical' ? 24 : data.level === 'high' ? 20 : 16,
                borderRadius: '50%',
                backgroundColor: getRiskColor(data.level),
                border: '2px solid white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                zIndex: hoveredCountry === countryName ? 1000 : 1,
                '&:hover': {
                  transform: 'translate(-50%, -50%) scale(1.3)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                  zIndex: 1000
                }
              }}
              onClick={() => handleCountryClick(countryName, data)}
              onMouseEnter={() => setHoveredCountry(countryName)}
              onMouseLeave={() => setHoveredCountry(null)}
            >
              {/* Pulse animation for critical risks */}
              {data.level === 'critical' && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '50%',
                    backgroundColor: getRiskColor(data.level),
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': {
                        transform: 'scale(1)',
                        opacity: 1,
                      },
                      '100%': {
                        transform: 'scale(2)',
                        opacity: 0,
                      },
                    },
                  }}
                />
              )}
            </Box>
          </Tooltip>
        ))}

        {/* Geographic Labels */}
        <Typography 
          variant="caption" 
          sx={{ 
            position: 'absolute', 
            top: 10, 
            left: 10, 
            color: 'text.secondary',
            fontWeight: 600
          }}
        >
          Global Risk Monitoring
        </Typography>
        
        <Box sx={{ position: 'absolute', bottom: 10, right: 10 }}>
          <Public sx={{ color: 'text.secondary', opacity: 0.5 }} />
        </Box>
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

export default SimpleWorldMap;

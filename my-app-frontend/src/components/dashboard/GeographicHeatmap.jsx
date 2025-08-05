import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Button,
  useTheme
} from '@mui/material';
import {
  LocationOn,
  TrendingUp,
  TrendingDown,
  Warning,
  Error,
  CheckCircle
} from '@mui/icons-material';

export default function GeographicHeatmap({ events, onRegionClick }) {
  const theme = useTheme();
  const [selectedRegion, setSelectedRegion] = useState(null);

  // Mock geographic data based on events
  const geographicData = [
    { region: 'North America', riskLevel: 'high', eventCount: 15, trend: 'increasing', color: 'error.main' },
    { region: 'Europe', riskLevel: 'medium', eventCount: 12, trend: 'stable', color: 'warning.main' },
    { region: 'Asia Pacific', riskLevel: 'high', eventCount: 18, trend: 'increasing', color: 'error.main' },
    { region: 'Middle East', riskLevel: 'medium', eventCount: 8, trend: 'decreasing', color: 'warning.main' },
    { region: 'Africa', riskLevel: 'low', eventCount: 5, trend: 'stable', color: 'success.main' },
    { region: 'South America', riskLevel: 'medium', eventCount: 7, trend: 'increasing', color: 'warning.main' }
  ];

  const getRiskIcon = (level) => {
    switch (level) {
      case 'high': return <Error color="error" />;
      case 'medium': return <Warning color="warning" />;
      case 'low': return <CheckCircle color="success" />;
      default: return <Warning />;
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return <TrendingUp color="error" />;
      case 'decreasing': return <TrendingDown color="success" />;
      default: return <TrendingUp color="warning" />;
    }
  };

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
    onRegionClick?.(region);
  };

  return (
    <Paper sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Geographic Risk View
        </Typography>
        <Chip
          icon={<LocationOn />}
          label={`${geographicData.length} regions`}
          variant="outlined"
          size="small"
        />
      </Box>

      {/* Interactive Map Placeholder */}
      <Box 
        sx={{ 
          mb: 3, 
          p: 3, 
          bgcolor: 'grey.100', 
          borderRadius: 2,
          textAlign: 'center',
          border: '2px dashed',
          borderColor: 'grey.300',
          minHeight: 200,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <LocationOn sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Interactive World Map
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Click regions to filter events
        </Typography>
        <Button variant="outlined" size="small">
          Enable Map View
        </Button>
      </Box>

      {/* Regional Risk List */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Regional Risk Levels
        </Typography>
        <List dense>
          {geographicData.map((region, index) => (
            <ListItem 
              key={region.region} 
              sx={{ 
                px: 0, 
                cursor: 'pointer',
                borderRadius: 1,
                mb: 0.5,
                backgroundColor: selectedRegion === region.region ? 'action.selected' : 'transparent',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
              onClick={() => handleRegionClick(region.region)}
            >
              <ListItemIcon>
                <Avatar sx={{ width: 32, height: 32, bgcolor: region.color }}>
                  {getRiskIcon(region.riskLevel)}
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={region.region}
                secondary={`${region.eventCount} events • ${region.trend} trend`}
                primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
                secondaryTypographyProps={{ fontSize: '0.75rem' }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getTrendIcon(region.trend)}
                <Chip 
                  label={region.riskLevel} 
                  size="small"
                  color={region.riskLevel === 'high' ? 'error' : region.riskLevel === 'medium' ? 'warning' : 'success'}
                  variant="outlined"
                />
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Legend */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
          Risk Level Legend
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 12, bgcolor: 'error.main', borderRadius: '50%' }} />
            <Typography variant="caption">High</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 12, bgcolor: 'warning.main', borderRadius: '50%' }} />
            <Typography variant="caption">Medium</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 12, bgcolor: 'success.main', borderRadius: '50%' }} />
            <Typography variant="caption">Low</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
} 
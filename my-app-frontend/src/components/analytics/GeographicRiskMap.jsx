import React, { useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Grid,
  Chip,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Public,
  LocationOn,
  TrendingUp,
  TrendingDown,
  FilterList,
  Download
} from '@mui/icons-material';

// Geographic coordinates for major regions
const REGION_COORDINATES = {
  'North America': { x: 25, y: 35 },
  'United States': { x: 22, y: 38 },
  'Canada': { x: 25, y: 25 },
  'Mexico': { x: 20, y: 45 },
  'Europe': { x: 48, y: 30 },
  'United Kingdom': { x: 45, y: 28 },
  'Germany': { x: 50, y: 30 },
  'France': { x: 47, y: 32 },
  'Italy': { x: 50, y: 35 },
  'Spain': { x: 45, y: 38 },
  'Poland': { x: 52, y: 28 },
  'Ukraine': { x: 55, y: 28 },
  'Russia': { x: 65, y: 25 },
  'Asia': { x: 75, y: 35 },
  'China': { x: 78, y: 38 },
  'Japan': { x: 85, y: 35 },
  'South Korea': { x: 82, y: 35 },
  'India': { x: 70, y: 45 },
  'Southeast Asia': { x: 75, y: 50 },
  'Vietnam': { x: 78, y: 50 },
  'Thailand': { x: 75, y: 48 },
  'Malaysia': { x: 75, y: 52 },
  'Indonesia': { x: 78, y: 55 },
  'Philippines': { x: 82, y: 50 },
  'Middle East': { x: 58, y: 42 },
  'Saudi Arabia': { x: 60, y: 45 },
  'Iran': { x: 62, y: 40 },
  'Iraq': { x: 60, y: 40 },
  'Syria': { x: 58, y: 38 },
  'Turkey': { x: 55, y: 35 },
  'Israel': { x: 55, y: 40 },
  'Africa': { x: 52, y: 55 },
  'Egypt': { x: 55, y: 45 },
  'Libya': { x: 52, y: 42 },
  'Tunisia': { x: 48, y: 42 },
  'Algeria': { x: 45, y: 45 },
  'Morocco': { x: 42, y: 42 },
  'Nigeria': { x: 50, y: 55 },
  'South Africa': { x: 52, y: 70 },
  'South America': { x: 32, y: 70 },
  'Brazil': { x: 35, y: 65 },
  'Argentina': { x: 30, y: 75 },
  'Chile': { x: 25, y: 75 },
  'Colombia': { x: 28, y: 58 },
  'Venezuela': { x: 30, y: 55 },
  'Peru': { x: 25, y: 65 },
  'Australia': { x: 82, y: 70 },
  'New Zealand': { x: 85, y: 75 }
};

export default function GeographicRiskMap({ events, profile }) {
  // Generate geographic risk data
  const geographicData = useMemo(() => {
    const regionMap = {};
    
    // Process events to extract geographic risk data
    events.forEach(event => {
      const regions = event.regions || [];
      regions.forEach(region => {
        if (!regionMap[region]) {
          regionMap[region] = {
            name: region,
            eventCount: 0,
            highRiskEvents: 0,
            avgRiskScore: 0,
            totalRiskScore: 0,
            events: []
          };
        }
        
        regionMap[region].eventCount++;
        regionMap[region].totalRiskScore += event.relevanceScore || 0;
        regionMap[region].events.push(event);
        
        if (event.severity === 'high' || event.severity === 'critical') {
          regionMap[region].highRiskEvents++;
        }
      });
    });
    
    // Calculate averages
    Object.values(regionMap).forEach(region => {
      region.avgRiskScore = region.totalRiskScore / region.eventCount;
    });
    
    return Object.values(regionMap).sort((a, b) => b.avgRiskScore - a.avgRiskScore);
  }, [events]);

  const getRiskColor = (score) => {
    if (score >= 0.7) return 'error';
    if (score >= 0.4) return 'warning';
    return 'success';
  };

  const getRiskLevel = (score) => {
    if (score >= 0.7) return 'High';
    if (score >= 0.4) return 'Medium';
    return 'Low';
  };

  // Render world map with actual image and overlay dots
  const renderWorldMap = () => {
    return (
      <Box sx={{ 
        position: 'relative',
        height: 500,
        border: '2px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        overflow: 'hidden'
      }}>
        {/* World map background */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 25%, #e8f5e8 50%, #fff3e0 75%, #fce4ec 100%)',
          opacity: 0.6
        }} />
        
                 {/* Simple continent outlines */}
         <svg
           style={{
             position: 'absolute',
             top: 0,
             left: 0,
             width: '100%',
             height: '100%',
             opacity: 0.3
           }}
           viewBox="0 0 1000 500"
           preserveAspectRatio="xMidYMid meet"
         >
           {/* North America */}
           <path d="M 150 150 Q 200 120 250 140 L 280 180 Q 250 200 200 190 L 150 150 Z" fill="#e8f4f8" stroke="#b3d9e6" strokeWidth="1" />
           {/* Europe */}
           <path d="M 450 150 Q 480 140 500 150 L 520 170 Q 500 180 480 175 L 450 150 Z" fill="#e8f4f8" stroke="#b3d9e6" strokeWidth="1" />
           {/* Asia */}
           <path d="M 550 150 Q 650 140 750 160 L 780 200 Q 750 220 650 210 L 550 150 Z" fill="#e8f4f8" stroke="#b3d9e6" strokeWidth="1" />
           {/* Africa */}
           <path d="M 480 200 Q 520 180 550 200 L 560 280 Q 520 300 480 290 L 480 200 Z" fill="#e8f4f8" stroke="#b3d9e6" strokeWidth="1" />
           {/* South America */}
           <path d="M 300 250 Q 320 240 340 250 L 350 350 Q 320 370 300 360 L 300 250 Z" fill="#e8f4f8" stroke="#b3d9e6" strokeWidth="1" />
           {/* Australia */}
           <path d="M 750 350 Q 780 340 800 350 L 810 380 Q 780 390 750 385 L 750 350 Z" fill="#e8f4f8" stroke="#b3d9e6" strokeWidth="1" />
         </svg>
        
        {/* Risk dots overlay */}
        {geographicData.map((region, index) => {
          const coordinates = REGION_COORDINATES[region.name];
          if (!coordinates) return null;
          
          const riskScore = region.avgRiskScore;
          const color = getRiskColor(riskScore);
          const size = Math.max(8, Math.min(20, region.eventCount * 2)); // Size based on event count
          
          return (
            <Tooltip 
              key={index}
              title={
                <Box>
                  <Typography variant="subtitle2">{region.name}</Typography>
                  <Typography variant="body2">
                    Risk Score: {(riskScore * 100).toFixed(1)}%
                  </Typography>
                  <Typography variant="body2">
                    Events: {region.eventCount}
                  </Typography>
                  <Typography variant="body2">
                    High-Risk: {region.highRiskEvents}
                  </Typography>
                </Box>
              }
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: `${coordinates.x}%`,
                  top: `${coordinates.y}%`,
                  width: size,
                  height: size,
                  borderRadius: '50%',
                  bgcolor: `${color}.main`,
                  border: '2px solid white',
                  boxShadow: `0 0 0 2px ${color === 'error' ? '#d32f2f' : color === 'warning' ? '#ed6c02' : '#2e7d32'}`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: 'translate(-50%, -50%)',
                  '&:hover': {
                    transform: 'translate(-50%, -50%) scale(1.3)',
                    boxShadow: `0 0 0 4px ${color === 'error' ? '#d32f2f' : color === 'warning' ? '#ed6c02' : '#2e7d32'}`,
                    zIndex: 10
                  }
                }}
              />
            </Tooltip>
          );
        })}
        
        {/* Legend */}
        <Box sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          bgcolor: 'background.paper',
          p: 2,
          borderRadius: 1,
          boxShadow: 3,
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 1, display: 'block' }}>
            Risk Levels
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'error.main', border: '2px solid white' }} />
              <Typography variant="caption">High Risk (≥70%)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'warning.main', border: '2px solid white' }} />
              <Typography variant="caption">Medium Risk (40-69%)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'success.main', border: '2px solid white' }} />
              <Typography variant="caption">Low Risk (&lt;40%)</Typography>
            </Box>
          </Box>
          <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
            Dot size = Event count
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Grid container spacing={3}>
      {/* World Map */}
      <Grid item xs={12} lg={8}>
        <Card>
          <CardHeader 
            title="Geographic Risk Distribution" 
            subheader="Global risk heatmap"
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small">
                  <FilterList />
                </IconButton>
                <IconButton size="small">
                  <Download />
                </IconButton>
              </Box>
            }
          />
          <CardContent>
            {renderWorldMap()}
          </CardContent>
        </Card>
      </Grid>

      {/* Regional Analysis */}
      <Grid item xs={12} lg={4}>
        <Card>
          <CardHeader title="Regional Risk Analysis" />
          <CardContent>
            {geographicData.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No geographic data available for the current events.
              </Typography>
            ) : (
              <List>
                {geographicData.slice(0, 8).map((region, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <LocationOn color={getRiskColor(region.avgRiskScore)} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {region.name}
                          </Typography>
                          <Chip 
                            label={getRiskLevel(region.avgRiskScore)}
                            size="small"
                            color={getRiskColor(region.avgRiskScore)}
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Risk Score: {(region.avgRiskScore * 100).toFixed(1)}% • 
                            Events: {region.eventCount} • 
                            High-Risk: {region.highRiskEvents}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Risk by Region Details */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Detailed Regional Risk Analysis" />
          <CardContent>
            <Grid container spacing={2}>
              {geographicData.map((region, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Paper elevation={1} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <LocationOn color={getRiskColor(region.avgRiskScore)} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {region.name}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" color={`${getRiskColor(region.avgRiskScore)}.main`}>
                        {(region.avgRiskScore * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Average Risk Score
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption">Total Events</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
                        {region.eventCount}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption">High-Risk Events</Typography>
                      <Typography variant="caption" color="error.main" sx={{ fontWeight: 'medium' }}>
                        {region.highRiskEvents}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">Risk Level</Typography>
                      <Chip 
                        label={getRiskLevel(region.avgRiskScore)}
                        size="small"
                        color={getRiskColor(region.avgRiskScore)}
                      />
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Profile Regions vs Global Risk */}
      {profile?.regions && (
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Your Regions vs Global Risk" />
            <CardContent>
              <Grid container spacing={2}>
                {profile.regions.map((profileRegion, index) => {
                  const regionData = geographicData.find(d => 
                    d.name.toLowerCase().includes(profileRegion.toLowerCase()) ||
                    profileRegion.toLowerCase().includes(d.name.toLowerCase())
                  );
                  
                  return (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper elevation={1} sx={{ p: 2, border: '2px solid', borderColor: 'primary.main' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Public color="primary" />
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {profileRegion}
                          </Typography>
                          <Chip label="Your Region" size="small" color="primary" />
                        </Box>
                        
                        {regionData ? (
                          <Box>
                            <Typography variant="h6" color={`${getRiskColor(regionData.avgRiskScore)}.main`}>
                              {(regionData.avgRiskScore * 100).toFixed(1)}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Current Risk Score
                            </Typography>
                            
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="caption" color="text.secondary">
                                Active Events: {regionData.eventCount}
                              </Typography>
                            </Box>
                          </Box>
                        ) : (
                          <Box>
                            <Typography variant="body2" color="success.main">
                              No active risks detected
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              This region is currently stable
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
} 
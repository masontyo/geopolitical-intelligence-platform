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

  // Mock world map visualization (in a real app, you'd use a mapping library)
  const renderWorldMap = () => {
    const regions = [
      { name: 'North America', x: 20, y: 30, size: 15 },
      { name: 'Europe', x: 45, y: 25, size: 12 },
      { name: 'Asia-Pacific', x: 75, y: 35, size: 18 },
      { name: 'Southeast Asia', x: 70, y: 50, size: 10 },
      { name: 'Middle East', x: 55, y: 45, size: 8 },
      { name: 'Africa', x: 50, y: 60, size: 14 },
      { name: 'South America', x: 30, y: 70, size: 12 }
    ];

    return (
      <Box sx={{ 
        position: 'relative',
        height: 400,
        border: '2px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        overflow: 'hidden'
      }}>
        {/* Mock world map background */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, #e3f2fd 0%, #f3e5f5 50%, #e8f5e8 100%)',
          opacity: 0.3
        }} />
        
        {/* Region markers */}
        {regions.map((region, index) => {
          const regionData = geographicData.find(d => 
            d.name.toLowerCase().includes(region.name.toLowerCase()) ||
            region.name.toLowerCase().includes(d.name.toLowerCase())
          );
          
          const riskScore = regionData?.avgRiskScore || 0;
          const color = getRiskColor(riskScore);
          
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
                    Events: {regionData?.eventCount || 0}
                  </Typography>
                </Box>
              }
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: `${region.x}%`,
                  top: `${region.y}%`,
                  width: region.size,
                  height: region.size,
                  borderRadius: '50%',
                  bgcolor: `${color}.main`,
                  border: '2px solid white',
                  boxShadow: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.2)',
                    boxShadow: 4
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
          boxShadow: 2
        }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 1, display: 'block' }}>
            Risk Levels
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main' }} />
              <Typography variant="caption">High Risk</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main' }} />
              <Typography variant="caption">Medium Risk</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
              <Typography variant="caption">Low Risk</Typography>
            </Box>
          </Box>
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
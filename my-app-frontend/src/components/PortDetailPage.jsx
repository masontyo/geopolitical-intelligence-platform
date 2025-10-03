import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  LinearProgress
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/material';
import {
  ArrowBack,
  Warning,
  CheckCircle,
  Error,
  Info,
  LocalShipping,
  LocationOn,
  Schedule,
  Timeline as TimelineIcon,
  Assessment,
  Lightbulb,
  Public,
  Business,
  Menu
} from '@mui/icons-material';

const PortDetailPage = () => {
  const { portId } = useParams();
  const navigate = useNavigate();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // Mock data - in real app, this would come from API
  const portData = {
    id: portId,
    name: 'Port of Shanghai',
    country: 'China',
    type: 'container',
    capacity: 'large',
    status: 'active',
    congestion: 65,
    alertCount: 2,
    coordinates: [31.2397, 121.4994],
    lastUpdated: '2024-01-15T10:30:00Z',
    description: 'One of the world\'s busiest container ports, handling over 47 million TEUs annually.',
    facilities: ['Container Terminal', 'Bulk Cargo', 'RoRo Terminal', 'Cruise Terminal'],
    shippingLines: ['Maersk', 'CMA CGM', 'COSCO', 'Hapag-Lloyd'],
    averageWaitTime: '12 hours',
    weatherConditions: 'Severe weather warning'
  };

  const currentDevelopments = [
    {
      id: 1,
      title: 'Severe Weather Alert',
      date: '2 hours ago',
      severity: 'high',
      description: 'National Weather Service issued severe weather warning affecting port operations.',
      impact: 'Port operations suspended until weather clears',
      status: 'ongoing'
    },
    {
      id: 2,
      title: 'Container Vessel Delayed',
      date: '4 hours ago',
      severity: 'medium',
      description: 'CMA CGM vessel "Marco Polo" delayed by 8 hours due to weather conditions.',
      impact: 'Moderate delay affecting 3 scheduled departures',
      status: 'ongoing'
    },
    {
      id: 3,
      title: 'Congestion Level Increased',
      date: '6 hours ago',
      severity: 'medium',
      description: 'Port congestion increased from 45% to 65% due to weather-related delays.',
      impact: 'Extended wait times for incoming vessels',
      status: 'ongoing'
    },
    {
      id: 4,
      title: 'New Terminal Expansion Completed',
      date: '1 week ago',
      severity: 'low',
      description: 'Phase 2 of Yangshan Deep Water Port expansion completed successfully.',
      impact: 'Positive - increased capacity by 15%',
      status: 'resolved'
    }
  ];

  const alternativePorts = [
    {
      name: 'Port of Busan',
      country: 'South Korea',
      distance: '450 nm',
      capacity: 'large',
      congestion: 35,
      status: 'available',
      eta: '18 hours'
    },
    {
      name: 'Port of Singapore',
      country: 'Singapore',
      distance: '1,200 nm',
      capacity: 'large',
      congestion: 25,
      status: 'available',
      eta: '2 days'
    },
    {
      name: 'Port of Hong Kong',
      country: 'Hong Kong',
      distance: '800 nm',
      capacity: 'large',
      congestion: 45,
      status: 'available',
      eta: '1.5 days'
    }
  ];

  const mitigationOptions = [
    {
      title: 'Divert to Alternative Port',
      description: 'Redirect vessels to nearby ports with better weather conditions',
      priority: 'High',
      timeframe: 'Immediate',
      cost: 'Medium',
      effectiveness: 'High'
    },
    {
      title: 'Delay Departures',
      description: 'Hold vessels in port until weather conditions improve',
      priority: 'Medium',
      timeframe: '6-12 hours',
      cost: 'High',
      effectiveness: 'Medium'
    },
    {
      title: 'Activate Emergency Procedures',
      description: 'Implement weather contingency protocols',
      priority: 'High',
      timeframe: 'Immediate',
      cost: 'Low',
      effectiveness: 'High'
    },
    {
      title: 'Coordinate with Shipping Lines',
      description: 'Work with carriers to optimize vessel scheduling',
      priority: 'Medium',
      timeframe: '2-4 hours',
      cost: 'Low',
      effectiveness: 'Medium'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'info';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return <Error />;
      case 'high': return <Warning />;
      case 'medium': return <Info />;
      case 'low': return <CheckCircle />;
      default: return <Info />;
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      {/* Collapsible Sidebar */}
      <Paper 
        elevation={3} 
        sx={{ 
          width: sidebarExpanded ? 400 : 60, 
          transition: 'width 0.3s ease',
          p: sidebarExpanded ? 3 : 1, 
          bgcolor: 'background.paper', 
          borderRight: 1, 
          borderColor: 'divider', 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: sidebarExpanded ? 3 : 1 }}>
          <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: sidebarExpanded ? 2 : 0 }}>
            <ArrowBack />
          </IconButton>
          {sidebarExpanded && (
            <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
              Port Details
            </Typography>
          )}
          <IconButton 
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            sx={{ ml: 'auto' }}
          >
            <Menu />
          </IconButton>
        </Box>

        {/* Port Info */}
        {sidebarExpanded && (
          <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocalShipping sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {portData.name}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2">
                {portData.country}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Assessment sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2">
                Type: {portData.type} • Capacity: {portData.capacity}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                Status:
              </Typography>
              <Chip 
                label={portData.status} 
                size="small" 
                color={portData.status === 'active' ? 'success' : 'warning'} 
              />
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Current Congestion
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">{portData.congestion}%</Typography>
              <Typography variant="caption" color="text.secondary">
                {portData.congestion > 70 ? 'High' : portData.congestion > 40 ? 'Medium' : 'Low'}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={portData.congestion} 
              color={portData.congestion > 70 ? 'error' : portData.congestion > 40 ? 'warning' : 'success'}
            />
          </Box>

          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Average Wait Time
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {portData.averageWaitTime}
          </Typography>

          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Weather Conditions
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {portData.weatherConditions}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Facilities
          </Typography>
          <Box sx={{ mb: 2 }}>
            {portData.facilities.map((facility, index) => (
              <Chip 
                key={index}
                label={facility} 
                size="small" 
                color="primary" 
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
          </Box>

          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Major Shipping Lines
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {portData.shippingLines.join(', ')}
          </Typography>
          </Paper>
        )}
      </Paper>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
          {portData.name} - Intelligence Dashboard
        </Typography>
        
        <Grid container spacing={3}>
          {/* Current Developments */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                <TimelineIcon sx={{ mr: 1 }} />
                Current Developments
              </Typography>
              
              <Timeline>
                {currentDevelopments.map((development, index) => (
                  <TimelineItem key={development.id}>
                    <TimelineSeparator>
                      <TimelineDot color={getSeverityColor(development.severity)}>
                        {getSeverityIcon(development.severity)}
                      </TimelineDot>
                      {index < currentDevelopments.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, flex: 1 }}>
                            {development.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {development.date}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {development.description}
                        </Typography>
                        
                        <Alert 
                          severity={getSeverityColor(development.severity)} 
                          sx={{ mb: 1 }}
                        >
                          <Typography variant="body2">
                            <strong>Impact:</strong> {development.impact}
                          </Typography>
                        </Alert>
                        
                        <Chip 
                          label={development.status} 
                          size="small"
                          color={development.status === 'resolved' ? 'success' : 'warning'}
                        />
                      </Box>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Paper>
          </Grid>

          {/* Alternative Ports */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                <Public sx={{ mr: 1 }} />
                Alternative Ports
              </Typography>
              
              <List>
                {alternativePorts.map((port, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 1 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1 }}>
                            {port.name}
                          </Typography>
                          <Chip 
                            label={port.status} 
                            size="small" 
                            color={port.status === 'available' ? 'success' : 'warning'}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            <strong>Distance:</strong> {port.distance} • <strong>ETA:</strong> {port.eta}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            <strong>Congestion:</strong> {port.congestion}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {port.country} • {port.capacity} capacity
                          </Typography>
                        </Box>
                      }
                    />
                    {index < alternativePorts.length - 1 && <Divider />}
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Mitigation Options */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                <Lightbulb sx={{ mr: 1 }} />
                Recommended Mitigation Actions
              </Typography>
              
              <Grid container spacing={2}>
                {mitigationOptions.map((option, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1rem' }}>
                          {option.title}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {option.description}
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Chip 
                            label={`Priority: ${option.priority}`} 
                            size="small" 
                            color={option.priority === 'High' ? 'error' : option.priority === 'Medium' ? 'warning' : 'success'}
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                          <Chip 
                            label={`Time: ${option.timeframe}`} 
                            size="small" 
                            color="primary"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                          <Chip 
                            label={`Cost: ${option.cost}`} 
                            size="small" 
                            color="info"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                          <Chip 
                            label={`Effect: ${option.effectiveness}`} 
                            size="small" 
                            color="secondary"
                            sx={{ mb: 0.5 }}
                          />
                        </Box>
                        <Button variant="contained" size="small" fullWidth>
                          Take Action
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PortDetailPage;
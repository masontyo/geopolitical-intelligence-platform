import React from 'react';
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
} from '@mui/lab';
import {
  ArrowBack,
  Warning,
  CheckCircle,
  Error,
  Info,
  LocalShipping,
  LocationOn,
  Schedule,
  TrendingUp,
  TrendingDown,
  Timeline as TimelineIcon,
  Assessment,
  Lightbulb,
  DirectionsBoat
} from '@mui/icons-material';

const PortDetailPage = () => {
  const { portId } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, this would come from API
  const portData = {
    id: portId,
    name: 'Port of Shanghai',
    country: 'China',
    city: 'Shanghai',
    status: 'delayed',
    alertCount: 1,
    capacity: 'High',
    congestion: 75
  };

  const currentDevelopments = [
    {
      id: 1,
      title: 'Weather System Causing Delays',
      date: '1 day ago',
      severity: 'high',
      description: 'Tropical storm causing 48-hour delays for all outbound vessels. Expected to clear by tomorrow morning.',
      impact: 'Critical - 15 vessels currently waiting',
      status: 'ongoing'
    },
    {
      id: 2,
      title: 'Container Terminal Upgrade Complete',
      date: '1 week ago',
      severity: 'low',
      description: 'New automated container handling system operational, improving efficiency by 20%.',
      impact: 'Positive - reduced processing time',
      status: 'resolved'
    },
    {
      id: 3,
      title: 'Labor Strike Resolved',
      date: '2 weeks ago',
      severity: 'medium',
      description: 'Port workers strike ended after 3 days. Normal operations resumed.',
      impact: 'Moderate - 2-day backlog cleared',
      status: 'resolved'
    }
  ];

  const alternativePorts = [
    {
      name: 'Port of Ningbo',
      distance: '2 hours away',
      capacity: 'Available',
      status: 'operational',
      congestion: 45,
      recommendation: 'Best alternative - similar capacity, lower congestion'
    },
    {
      name: 'Port of Qingdao',
      distance: '6 hours away',
      capacity: 'Limited',
      status: 'operational',
      congestion: 60,
      recommendation: 'Backup option - requires route adjustment'
    }
  ];

  const vesselStatus = [
    { name: 'Vessel A', eta: '2 hours', status: 'waiting', cargo: 'Electronics' },
    { name: 'Vessel B', eta: '4 hours', status: 'waiting', cargo: 'Textiles' },
    { name: 'Vessel C', eta: '6 hours', status: 'waiting', cargo: 'Machinery' }
  ];

  const connectedRoutes = [
    { name: 'Shanghai to Los Angeles', frequency: 'Weekly', status: 'Delayed', delay: '2 days' },
    { name: 'Shanghai to Hamburg', frequency: 'Bi-weekly', status: 'On Schedule', delay: '0 days' },
    { name: 'Shanghai to New York', frequency: 'Weekly', status: 'Delayed', delay: '1 day' }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <Error />;
      case 'high': return <Warning />;
      case 'medium': return <Info />;
      case 'low': return <CheckCircle />;
      default: return <Info />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'success';
      case 'delayed': return 'warning';
      case 'closed': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Port Intelligence
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
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
                  {portData.city}, {portData.country}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 1 }}>
                <Chip 
                  label={portData.status.toUpperCase()} 
                  size="small" 
                  color={getStatusColor(portData.status)}
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label={`${portData.alertCount} Alert`} 
                  size="small" 
                  color={portData.alertCount > 0 ? 'error' : 'success'}
                />
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Capacity: {portData.capacity}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Congestion Level */}
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

            <Button variant="outlined" fullWidth sx={{ mb: 1 }}>
              View Port Schedule
            </Button>
            <Button variant="outlined" fullWidth>
              Track Vessels
            </Button>
          </Paper>

          {/* Quick Actions */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
              <Lightbulb sx={{ mr: 1 }} />
              Quick Actions
            </Typography>
            
            <Button variant="contained" fullWidth sx={{ mb: 1 }}>
              Switch to Alternative Port
            </Button>
            <Button variant="outlined" fullWidth sx={{ mb: 1 }}>
              Request Priority Berthing
            </Button>
            <Button variant="outlined" fullWidth>
              Set Up Alerts
            </Button>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={9}>
          {/* Current Developments */}
          <Paper sx={{ p: 3, mb: 3 }}>
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

          {/* Alternative Ports */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
              <DirectionsBoat sx={{ mr: 1 }} />
              Alternative Ports
            </Typography>
            
            <Grid container spacing={2}>
              {alternativePorts.map((port, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        {port.name}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Distance: {port.distance}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Capacity: {port.capacity}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>Congestion:</Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={port.congestion} 
                            sx={{ flex: 1, mr: 1 }}
                            color={port.congestion > 70 ? 'error' : port.congestion > 40 ? 'warning' : 'success'}
                          />
                          <Typography variant="caption">{port.congestion}%</Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
                        {port.recommendation}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip 
                          label={port.status} 
                          size="small"
                          color={getStatusColor(port.status)}
                        />
                        <Chip 
                          label={port.capacity} 
                          size="small"
                          color={port.capacity === 'Available' ? 'success' : 'warning'}
                        />
                      </Box>
                      
                      <Button variant="contained" fullWidth size="small">
                        Switch to This Port
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Current Vessel Status */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Current Vessel Status
            </Typography>
            
            <Grid container spacing={2}>
              {vesselStatus.map((vessel, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        {vessel.name}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        ETA: {vessel.eta}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Cargo: {vessel.cargo}
                      </Typography>
                      
                      <Chip 
                        label={vessel.status} 
                        size="small"
                        color={vessel.status === 'waiting' ? 'warning' : 'success'}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Connected Routes */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Connected Shipping Routes
            </Typography>
            
            <List>
              {connectedRoutes.map((route, index) => (
                <ListItem key={index} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                  <ListItemText
                    primary={route.name}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Frequency: {route.frequency}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <Chip 
                            label={route.status} 
                            size="small"
                            color={route.status === 'On Schedule' ? 'success' : 'warning'}
                          />
                          {route.delay !== '0 days' && (
                            <Typography variant="caption" color="error">
                              Delay: {route.delay}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PortDetailPage;

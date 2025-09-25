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
  Avatar
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from './common/CustomTimeline';
import {
  ArrowBack,
  Warning,
  CheckCircle,
  Error,
  Info,
  NewReleases,
  LocationOn,
  Schedule,
  Timeline as TimelineIcon,
  Assessment,
  Lightbulb,
  Public,
  Business,
  Menu
} from '@mui/icons-material';

const EventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // Mock data - in real app, this would come from API
  const eventData = {
    id: eventId,
    title: 'Shanghai Port Closure Due to Severe Weather',
    category: 'Infrastructure',
    severity: 'high',
    location: 'Shanghai, China',
    date: '2024-01-15',
    description: 'Severe weather conditions have forced the closure of Shanghai Port, one of the world\'s busiest container ports. The closure is expected to last 3-5 days and will significantly impact global supply chains.',
    impact: 'Major disruption to shipping routes and supply chains',
    status: 'ongoing',
    source: 'Maritime News Agency',
    confidence: 'high'
  };

  const eventTimeline = [
    {
      title: 'Weather Alert Issued',
      date: 'Jan 15, 2024 06:00',
      impact: 'Low',
      description: 'National Weather Service issued severe weather warning for Shanghai region'
    },
    {
      title: 'Port Closure Announced',
      date: 'Jan 15, 2024 08:30',
      impact: 'High',
      description: 'Shanghai Port Authority officially closed all operations due to safety concerns'
    },
    {
      title: 'Shipping Lines Diverted',
      date: 'Jan 15, 2024 10:15',
      impact: 'Critical',
      description: 'Major shipping lines begin diverting vessels to alternative ports in Asia'
    },
    {
      title: 'Supply Chain Impact Assessment',
      date: 'Jan 15, 2024 14:00',
      impact: 'High',
      description: 'Industry analysts estimate 3-5 day delay for all affected shipments'
    }
  ];

  const affectedEntities = [
    {
      name: 'Shanghai Metal Works',
      type: 'Supplier',
      impact: 'High',
      status: 'Affected',
      description: 'Primary supplier, shipments delayed 4-6 days'
    },
    {
      name: 'Port of Shanghai',
      type: 'Infrastructure',
      impact: 'Critical',
      status: 'Closed',
      description: 'Complete operational shutdown due to weather'
    },
    {
      name: 'CMA CGM Shipping',
      type: 'Carrier',
      impact: 'High',
      status: 'Diverted',
      description: 'Vessels redirected to Busan and Singapore'
    },
    {
      name: 'Maersk Line',
      type: 'Carrier',
      impact: 'High',
      status: 'Diverted',
      description: 'Multiple vessels affected, delays expected'
    }
  ];

  const mitigationOptions = [
    {
      title: 'Activate Alternative Ports',
      description: 'Switch to Busan, Singapore, or Hong Kong for immediate shipments',
      priority: 'High',
      timeframe: 'Immediate',
      cost: 'Medium',
      effectiveness: 'High'
    },
    {
      title: 'Air Freight for Critical Items',
      description: 'Use air cargo for time-sensitive components',
      priority: 'High',
      timeframe: '24 hours',
      cost: 'High',
      effectiveness: 'Very High'
    },
    {
      title: 'Inventory Buffer Activation',
      description: 'Use safety stock to maintain production',
      priority: 'Medium',
      timeframe: 'Immediate',
      cost: 'Low',
      effectiveness: 'Medium'
    },
    {
      title: 'Supplier Diversification',
      description: 'Activate backup suppliers in unaffected regions',
      priority: 'Low',
      timeframe: '1 week',
      cost: 'High',
      effectiveness: 'High'
    }
  ];

  const getImpactColor = (impact) => {
    switch (impact?.toLowerCase()) {
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
          width: sidebarExpanded ? 500 : 60, 
          transition: 'width 0.3s ease',
          p: sidebarExpanded ? 3 : 1, 
          bgcolor: 'background.paper', 
          borderRight: 1, 
          borderColor: 'divider', 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Header - Always visible */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: sidebarExpanded ? 3 : 1, minHeight: 40 }}>
          <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: sidebarExpanded ? 2 : 0 }}>
            <ArrowBack />
          </IconButton>
          {sidebarExpanded && (
            <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
              Event Details
            </Typography>
          )}
          <IconButton 
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            sx={{ ml: 'auto', position: 'absolute', right: sidebarExpanded ? 12 : 4, top: 4 }}
          >
            <Menu />
          </IconButton>
        </Box>

        {/* Event Info */}
        {sidebarExpanded && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header Section */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <NewReleases sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                  {eventData.title}
                </Typography>
              </Box>
          
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn sx={{ mr: 2, fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {eventData.location}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Schedule sx={{ mr: 2, fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {eventData.date}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Assessment sx={{ mr: 2, fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Category: {eventData.category}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" sx={{ mr: 2, fontWeight: 500 }}>
                    Severity:
                  </Typography>
                  <Chip 
                    label={eventData.severity?.toUpperCase()} 
                    size="medium" 
                    color={getImpactColor(eventData.severity)} 
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Event Description
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                {eventData.description}
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Impact Assessment
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                {eventData.impact}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="body1" sx={{ mr: 2, fontWeight: 500 }}>
                  Status:
                </Typography>
                <Chip 
                  label={eventData.status} 
                  size="medium" 
                  color={eventData.status === 'ongoing' ? 'warning' : 'success'} 
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Source & Confidence
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Source:</strong> {eventData.source}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Confidence:</strong> {eventData.confidence}
              </Typography>
            </Paper>
          </Box>
        )}
      </Paper>

      {/* Main Content */}
      <Box sx={{ 
        flexGrow: 1, 
        p: 3, 
        overflowY: 'auto'
      }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
          Event Intelligence Dashboard
        </Typography>
        
        <Grid container spacing={3}>
          {/* Event Timeline */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                <TimelineIcon sx={{ mr: 1 }} />
                Event Timeline
              </Typography>
              
              <Timeline>
                {eventTimeline.map((item, index) => (
                  <TimelineItem key={index}>
                    <TimelineSeparator>
                      <TimelineDot color={getImpactColor(item.impact)}>
                        {getSeverityIcon(item.impact.toLowerCase())}
                      </TimelineDot>
                      {index < eventTimeline.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, flex: 1 }}>
                            {item.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.date}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {item.description}
                        </Typography>
                        
                        <Chip 
                          label={`Impact: ${item.impact}`} 
                          size="small"
                          color={getImpactColor(item.impact)}
                        />
                      </Box>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Paper>
          </Grid>

          {/* Affected Entities */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                <Business sx={{ mr: 1 }} />
                Affected Entities
              </Typography>
              
              <List>
                {affectedEntities.map((entity, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 1 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1 }}>
                            {entity.name}
                          </Typography>
                          <Chip 
                            label={entity.status} 
                            size="small" 
                            color={entity.status === 'Affected' ? 'warning' : entity.status === 'Closed' ? 'error' : 'info'}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            <strong>Type:</strong> {entity.type} • <strong>Impact:</strong> {entity.impact}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {entity.description}
                          </Typography>
                        </Box>
                      }
                    />
                    {index < affectedEntities.length - 1 && <Divider />}
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
                  <Grid item xs={12} sm={6} md={4} key={index}>
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

export default EventDetailPage;
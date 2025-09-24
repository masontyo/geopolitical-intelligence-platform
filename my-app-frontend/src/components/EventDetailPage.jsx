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
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Avatar
} from '@mui/material';
import {
  ArrowBack,
  Warning,
  CheckCircle,
  Error,
  Info,
  NewReleases,
  LocationOn,
  Schedule,
  TrendingUp,
  TrendingDown,
  Timeline as TimelineIcon,
  Assessment,
  Lightbulb,
  Public,
  Business
} from '@mui/icons-material';

const EventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, this would come from API
  const eventData = {
    id: eventId,
    title: 'Trade Dispute Escalation',
    category: 'Trade Policy',
    severity: 'high',
    date: '5 days ago',
    location: 'China-US',
    status: 'ongoing',
    impact: 'Medium',
    source: 'Reuters'
  };

  const eventTimeline = [
    {
      date: '5 days ago',
      title: 'Initial Tariff Announcement',
      description: 'US announces new tariffs on Chinese electronics imports',
      impact: 'Low'
    },
    {
      date: '3 days ago',
      title: 'Chinese Response',
      description: 'China announces retaliatory tariffs on US agricultural products',
      impact: 'Medium'
    },
    {
      date: '1 day ago',
      title: 'Escalation',
      description: 'US threatens additional tariffs, China warns of further retaliation',
      impact: 'High'
    },
    {
      date: 'Today',
      title: 'Current Status',
      description: 'Negotiations ongoing, market volatility increasing',
      impact: 'High'
    }
  ];

  const affectedEntities = [
    {
      type: 'supplier',
      name: 'Shanghai Metal Works',
      impact: 'High',
      description: 'Direct supplier affected by new tariffs',
      action: 'Consider alternative suppliers in Southeast Asia'
    },
    {
      type: 'port',
      name: 'Port of Shanghai',
      impact: 'Medium',
      description: 'Expected decrease in US-bound shipments',
      action: 'Monitor shipping volumes and adjust capacity'
    },
    {
      type: 'route',
      name: 'Shanghai to Los Angeles',
      impact: 'High',
      description: 'Route most affected by trade dispute',
      action: 'Consider alternative routes or suppliers'
    }
  ];

  const mitigationStrategies = [
    {
      title: 'Diversify Supply Base',
      description: 'Add suppliers from Southeast Asia to reduce China dependency',
      priority: 'High',
      timeframe: '1-2 months',
      cost: 'Medium',
      effectiveness: 'High'
    },
    {
      title: 'Stockpile Inventory',
      description: 'Increase inventory levels to buffer against supply disruptions',
      priority: 'Medium',
      timeframe: 'Immediate',
      cost: 'High',
      effectiveness: 'Medium'
    },
    {
      title: 'Negotiate Price Protection',
      description: 'Lock in current prices with existing suppliers',
      priority: 'High',
      timeframe: '1 week',
      cost: 'Low',
      effectiveness: 'Medium'
    },
    {
      title: 'Alternative Sourcing',
      description: 'Identify and qualify alternative suppliers in unaffected regions',
      priority: 'Medium',
      timeframe: '2-3 months',
      cost: 'Medium',
      effectiveness: 'High'
    }
  ];

  const relatedEvents = [
    {
      title: 'EU-China Trade Tensions',
      date: '2 weeks ago',
      severity: 'medium',
      connection: 'Similar trade policy developments'
    },
    {
      title: 'Supply Chain Disruptions in Electronics',
      date: '1 month ago',
      severity: 'low',
      connection: 'Related supply chain impacts'
    }
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

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getEntityIcon = (type) => {
    switch (type) {
      case 'supplier': return <Business />;
      case 'port': return <Public />;
      case 'route': return <Schedule />;
      default: return <Info />;
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
          Event Intelligence
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <NewReleases sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {eventData.title}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOn sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {eventData.location}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 1 }}>
                <Chip 
                  label={eventData.category} 
                  size="small" 
                  color="primary"
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label={eventData.severity.toUpperCase()} 
                  size="small" 
                  color={getSeverityColor(eventData.severity)}
                />
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Date: {eventData.date}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Source: {eventData.source}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Impact Assessment
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Overall Impact
              </Typography>
              <Chip 
                label={eventData.impact} 
                color={getImpactColor(eventData.impact)}
                sx={{ fontWeight: 600 }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Status
              </Typography>
              <Chip 
                label={eventData.status} 
                color={eventData.status === 'ongoing' ? 'warning' : 'success'}
                sx={{ fontWeight: 600 }}
              />
            </Box>

            <Button variant="outlined" fullWidth sx={{ mb: 1 }}>
              Set Up Alerts
            </Button>
            <Button variant="outlined" fullWidth>
              Share Intelligence
            </Button>
          </Paper>

          {/* Related Events */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Related Events
            </Typography>
            
            {relatedEvents.map((event, index) => (
              <Box key={index} sx={{ mb: 2, p: 1, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  {event.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  {event.date}
                </Typography>
                <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
                  {event.connection}
                </Typography>
                <Chip 
                  label={event.severity} 
                  size="small"
                  color={getSeverityColor(event.severity)}
                />
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={9}>
          {/* Event Timeline */}
          <Paper sx={{ p: 3, mb: 3 }}>
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

          {/* Affected Entities */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
              <Assessment sx={{ mr: 1 }} />
              Affected Supply Chain Entities
            </Typography>
            
            <Grid container spacing={2}>
              {affectedEntities.map((entity, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {getEntityIcon(entity.type)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {entity.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {entity.type.charAt(0).toUpperCase() + entity.type.slice(1)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {entity.description}
                      </Typography>
                      
                      <Alert severity={getImpactColor(entity.impact)} sx={{ mb: 2 }}>
                        <Typography variant="body2">
                          <strong>Recommended Action:</strong> {entity.action}
                        </Typography>
                      </Alert>
                      
                      <Chip 
                        label={`Impact: ${entity.impact}`} 
                        size="small"
                        color={getImpactColor(entity.impact)}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Mitigation Strategies */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
              <Lightbulb sx={{ mr: 1 }} />
              Recommended Mitigation Strategies
            </Typography>
            
            <Grid container spacing={2}>
              {mitigationStrategies.map((strategy, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        {strategy.title}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {strategy.description}
                      </Typography>
                      
                      <Grid container spacing={1} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Priority:
                          </Typography>
                          <Chip 
                            label={strategy.priority} 
                            size="small"
                            color={strategy.priority === 'High' ? 'error' : strategy.priority === 'Medium' ? 'warning' : 'success'}
                            sx={{ ml: 1 }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Timeframe:
                          </Typography>
                          <Typography variant="caption" sx={{ ml: 1, fontWeight: 600 }}>
                            {strategy.timeframe}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Cost:
                          </Typography>
                          <Typography variant="caption" sx={{ ml: 1, fontWeight: 600 }}>
                            {strategy.cost}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Effectiveness:
                          </Typography>
                          <Typography variant="caption" sx={{ ml: 1, fontWeight: 600 }}>
                            {strategy.effectiveness}
                          </Typography>
                        </Grid>
                      </Grid>
                      
                      <Button variant="contained" fullWidth size="small">
                        Implement Strategy
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
  );
};

export default EventDetailPage;

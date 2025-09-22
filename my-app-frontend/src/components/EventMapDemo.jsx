import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Container
} from '@mui/material';
import {
  Map,
  List,
  Timeline,
  LocationOn,
  Event,
  IntegrationInstructions
} from '@mui/icons-material';
import EventMapIntegration from './EventMapIntegration';
import EnhancedWorldRiskMap from './EnhancedWorldRiskMap';
import IntegratedEventMap from './IntegratedEventMap';

export default function EventMapDemo() {
  const [activeDemo, setActiveDemo] = useState('integrated');

  const demos = [
    {
      id: 'integrated',
      title: 'Integrated Event Map',
      description: 'Full-featured event-map integration with Leaflet maps, event markers, and interactive details',
      component: IntegratedEventMap,
      icon: <IntegrationInstructions />,
      features: ['Interactive map markers', 'Event filtering by country', 'Real-time event updates', 'Event detail popups']
    },
    {
      id: 'enhanced',
      title: 'Enhanced World Risk Map',
      description: 'Advanced risk visualization with TopoJSON maps and country-based event aggregation',
      component: EnhancedWorldRiskMap,
      icon: <Map />,
      features: ['Country risk scoring', 'Event density visualization', 'Top countries ranking', 'Risk level indicators']
    },
    {
      id: 'basic',
      title: 'Basic Event Map Integration',
      description: 'Simple event-map integration with basic marker functionality and event listings',
      component: EventMapIntegration,
      icon: <Timeline />,
      features: ['Basic event markers', 'Country event filtering', 'Event detail dialogs', 'Sample data support']
    }
  ];

  const ActiveComponent = demos.find(demo => demo.id === activeDemo)?.component;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Event-Map Integration Demo
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Explore different implementations of event-map integration. Click on map markers to view events,
          filter by country, and interact with event details.
        </Typography>
        
        {/* Demo Selector */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {demos.map((demo) => (
            <Grid item xs={12} md={4} key={demo.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: activeDemo === demo.id ? 2 : 1,
                  borderColor: activeDemo === demo.id ? 'primary.main' : 'divider',
                  '&:hover': { borderColor: 'primary.main' }
                }}
                onClick={() => setActiveDemo(demo.id)}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    {demo.icon}
                    <Typography variant="h6">
                      {demo.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {demo.description}
                  </Typography>
                  <Box>
                    {demo.features.map((feature, index) => (
                      <Chip
                        key={index}
                        label={feature}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Active Demo */}
      <Paper sx={{ overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">
            {demos.find(demo => demo.id === activeDemo)?.title}
          </Typography>
        </Box>
        <Box sx={{ height: '700px' }}>
          {ActiveComponent && <ActiveComponent />}
        </Box>
      </Paper>

      {/* Features Overview */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Integration Features
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              🗺️ Map Integration
            </Typography>
            <ul>
              <li>Interactive world maps with country-based event markers</li>
              <li>Real-time event data visualization</li>
              <li>Clickable markers that show event details</li>
              <li>Country-specific event filtering</li>
              <li>Risk level color coding</li>
            </ul>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              📊 Event Management
            </Typography>
            <ul>
              <li>Event detail popups and dialogs</li>
              <li>Event filtering by severity, category, and location</li>
              <li>Top countries by event count</li>
              <li>Event timeline and relevance scoring</li>
              <li>Source reliability indicators</li>
            </ul>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              🔄 Data Integration
            </Typography>
            <ul>
              <li>API integration with fallback to sample data</li>
              <li>Country-coordinate mapping service</li>
              <li>Region-based event aggregation</li>
              <li>Event-map synchronization</li>
              <li>Real-time data updates</li>
            </ul>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              🎨 User Experience
            </Typography>
            <ul>
              <li>Responsive design for all screen sizes</li>
              <li>Intuitive navigation between map and list views</li>
              <li>Interactive tooltips and popups</li>
              <li>Loading states and error handling</li>
              <li>Customizable map layers and markers</li>
            </ul>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

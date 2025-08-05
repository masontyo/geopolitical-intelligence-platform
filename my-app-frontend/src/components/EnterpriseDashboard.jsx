import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Alert,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Skeleton,
  useTheme,
  useMediaQuery,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Warning,
  Error,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  LocationOn,
  Schedule,
  Visibility,
  CrisisAlert,
  Notifications,
  FilterList,
  Refresh,
  ArrowForward,
  Security,
  Business,
  Timeline
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { userProfileAPI } from '../services/api';
import { useToast } from './ToastNotifications';
import RiskStatusOverview from './dashboard/RiskStatusOverview';
import EventFeed from './dashboard/EventFeed';
import GeographicHeatmap from './dashboard/GeographicHeatmap';
import AnalyticsWidgets from './dashboard/AnalyticsWidgets';

export default function EnterpriseDashboard() {
  const { profileId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { error: showError, success, info } = useToast();

  const [profile, setProfile] = useState(null);
  const [relevantEvents, setRelevantEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock data for demonstration
  const mockRiskData = {
    threatLevel: 'medium',
    activeAlerts: 3,
    criticalEvents: 2,
    recentIncidents: [
      { id: 1, title: 'Cybersecurity breach detected', severity: 'high', time: '2 hours ago' },
      { id: 2, title: 'Supply chain disruption', severity: 'medium', time: '4 hours ago' }
    ]
  };

  const mockAnalytics = {
    riskTrend: 'increasing',
    topRegions: ['North America', 'Europe', 'Asia Pacific'],
    topIndustries: ['Technology', 'Finance', 'Healthcare'],
    notificationDelivery: 98.5,
    profileCompletion: 85
  };

  useEffect(() => {
    loadDashboardData();
  }, [profileId]);

  const loadDashboardData = async () => {
    if (!profileId) {
      setError('No profile ID provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Load profile and events
      const [profileResponse, eventsResponse] = await Promise.all([
        userProfileAPI.getProfile(profileId),
        userProfileAPI.getRelevantEvents(profileId, { includeAnalytics: true })
      ]);

      setProfile(profileResponse.profile);
      setRelevantEvents(eventsResponse.events || []);
      setLastUpdated(new Date());
      
      info(`Dashboard loaded successfully. Found ${eventsResponse.events?.length || 0} relevant events.`);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      const errorMessage = `Failed to load dashboard data: ${err.response?.data?.message || err.message}`;
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadDashboardData();
    success('Dashboard refreshed successfully');
  };

  const handleViewAllAlerts = () => {
    navigate('/alerts');
  };

  const handleViewEventDetails = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const getThreatLevelColor = (level) => {
    switch (level) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getThreatLevelIcon = (level) => {
    switch (level) {
      case 'high': return <Error color="error" />;
      case 'medium': return <Warning color="warning" />;
      case 'low': return <CheckCircle color="success" />;
      default: return <Timeline />;
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={loadDashboardData}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Welcome back, {profile?.name || 'User'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {profile?.organization} • {profile?.industry} • Last updated: {lastUpdated.toLocaleTimeString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={handleViewAllAlerts}
            >
              View All Alerts
            </Button>
            <IconButton onClick={handleRefresh}>
              <Refresh />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* F-Pattern Layout */}
      <Grid container spacing={3}>
        {/* Top Left Quadrant - Risk Status Overview (Most Critical) */}
        <Grid item xs={12} lg={6}>
          <RiskStatusOverview 
            riskData={mockRiskData}
            onViewAllAlerts={handleViewAllAlerts}
          />
        </Grid>

        {/* Top Right Quadrant - Quick Analytics */}
        <Grid item xs={12} lg={6}>
          <AnalyticsWidgets 
            analytics={mockAnalytics}
            profile={profile}
          />
        </Grid>

        {/* Main Content Area - Event Feed */}
        <Grid item xs={12} lg={8}>
          <EventFeed 
            events={relevantEvents}
            onViewEventDetails={handleViewEventDetails}
            loading={loading}
          />
        </Grid>

        {/* Right Sidebar - Geographic View & Additional Metrics */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <GeographicHeatmap 
              events={relevantEvents}
              onRegionClick={(region) => {
                // Filter events by region
                console.log('Filtering by region:', region);
              }}
            />
            
            {/* Recent Activity */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Recent Activity
              </Typography>
              <List dense>
                {mockRiskData.recentIncidents.map((incident) => (
                  <ListItem key={incident.id} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: 'error.main' }}>
                        <Warning sx={{ fontSize: 14 }} />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={incident.title}
                      secondary={incident.time}
                      primaryTypographyProps={{ fontSize: '0.875rem' }}
                      secondaryTypographyProps={{ fontSize: '0.75rem' }}
                    />
                    <Chip 
                      label={incident.severity} 
                      size="small"
                      color={getThreatLevelColor(incident.severity)}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* Quick Actions */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<CrisisAlert />}
                  fullWidth
                  onClick={() => navigate('/alerts')}
                >
                  Create Crisis Room
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Notifications />}
                  fullWidth
                  onClick={() => navigate('/notifications')}
                >
                  Configure Alerts
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Security />}
                  fullWidth
                  onClick={() => navigate('/settings')}
                >
                  Security Settings
                </Button>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

// Skeleton loading component
function DashboardSkeleton() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width="60%" height={40} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={24} />
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, height: 200 }}>
            <Skeleton variant="text" width="50%" height={32} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
          </Paper>
        </Grid>
        
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, height: 200 }}>
            <Skeleton variant="text" width="50%" height={32} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
          </Paper>
        </Grid>
        
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
            {[1, 2, 3].map((i) => (
              <Box key={i} sx={{ mb: 2 }}>
                <Skeleton variant="rectangular" height={80} />
              </Box>
            ))}
          </Paper>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 
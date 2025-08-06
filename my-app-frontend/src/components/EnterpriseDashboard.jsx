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
import { useNavigate } from 'react-router-dom';
import { userProfileAPI } from '../services/api';
import { useToast } from './ToastNotifications';
import RiskStatusOverview from './dashboard/RiskStatusOverview';
import EventFeed from './dashboard/EventFeed';
import GeographicHeatmap from './dashboard/GeographicHeatmap';
import AnalyticsWidgets from './dashboard/AnalyticsWidgets';

export default function EnterpriseDashboard({ profileId }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { error: showError, success, info } = useToast();

  const [profile, setProfile] = useState(null);
  const [relevantEvents, setRelevantEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Fallback to localStorage if profileId is not provided
  const effectiveProfileId = profileId || localStorage.getItem('currentProfileId');

  // Generate real analytics from actual data
  const generateRealAnalytics = () => {
    if (!relevantEvents || relevantEvents.length === 0) {
      return {
        threatLevel: 'low',
        activeAlerts: 0,
        criticalEvents: 0,
        recentIncidents: [],
        riskTrend: 'stable',
        topRegions: [],
        topIndustries: [],
        notificationDelivery: 0,
        profileCompletion: profile ? 85 : 0
      };
    }

    // Calculate threat level based on event severity
    const criticalEvents = relevantEvents.filter(event => event.severity === 'critical').length;
    const highEvents = relevantEvents.filter(event => event.severity === 'high').length;
    const mediumEvents = relevantEvents.filter(event => event.severity === 'medium').length;
    
    let threatLevel = 'low';
    if (criticalEvents > 0 || highEvents > 3) threatLevel = 'high';
    else if (highEvents > 0 || mediumEvents > 5) threatLevel = 'medium';

    // Get top regions
    const regionCounts = {};
    relevantEvents.forEach(event => {
      event.regions?.forEach(region => {
        regionCounts[region] = (regionCounts[region] || 0) + 1;
      });
    });
    const topRegions = Object.entries(regionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([region]) => region);

    // Get top categories
    const categoryCounts = {};
    relevantEvents.forEach(event => {
      event.categories?.forEach(category => {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
    });
    const topCategories = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);

    // Recent incidents (last 5 events)
    const recentIncidents = relevantEvents
      .slice(0, 5)
      .map(event => ({
        id: event._id || event.id,
        title: event.title,
        severity: event.severity,
        time: new Date(event.eventDate).toLocaleDateString()
      }));

    return {
      threatLevel,
      activeAlerts: relevantEvents.filter(e => e.severity === 'critical' || e.severity === 'high').length,
      criticalEvents,
      recentIncidents,
      riskTrend: criticalEvents > 0 ? 'increasing' : 'stable',
      topRegions,
      topCategories,
      notificationDelivery: 98.5, // Mock for now
      profileCompletion: profile ? 85 : 0
    };
  };

  const realAnalytics = generateRealAnalytics();

  useEffect(() => {
    if (effectiveProfileId) {
      loadDashboardData();
    }
  }, [effectiveProfileId]);

  const loadDashboardData = async () => {
    if (!effectiveProfileId) {
      setError('No profile ID provided. Please complete onboarding first.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Load profile and events
      const [profileResponse, eventsResponse] = await Promise.all([
        userProfileAPI.getProfile(effectiveProfileId),
        userProfileAPI.getRelevantEvents(effectiveProfileId, { includeAnalytics: true })
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
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button color="inherit" size="small" onClick={loadDashboardData}>
                Retry
              </Button>
              <Button color="inherit" size="small" onClick={() => navigate('/onboarding')}>
                Go to Onboarding
              </Button>
            </Box>
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
             riskData={realAnalytics}
             onViewAllAlerts={handleViewAllAlerts}
             onEventClick={handleViewEventDetails}
           />
         </Grid>

         {/* Top Right Quadrant - Quick Analytics */}
         <Grid item xs={12} lg={6}>
           <AnalyticsWidgets 
             analytics={realAnalytics}
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
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Chip, 
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tabs,
  Tab,
  Alert,
  Button,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  Badge
} from '@mui/material';
import { 
  Business, 
  Warning, 
  Timeline, 
  Refresh,
  Error as ErrorIcon,
  TrendingUp,
  TrendingDown,
  Analytics,
  Map,
  Notifications,
  Assessment,
  Speed,
  Security,
  Public,
  ShowChart,
  FilterList,
  Download,
  Settings
} from '@mui/icons-material';
import { userProfileAPI } from '../services/api';
import { useToast } from './ToastNotifications';
import { LoadingSpinner, SkeletonLoader } from './LoadingSpinner';
import RiskTrendChart from './analytics/RiskTrendChart';
import GeographicRiskMap from './analytics/GeographicRiskMap';
import RiskMetricsCard from './analytics/RiskMetricsCard';
import AlertSystem from './analytics/AlertSystem';

export default function AnalyticsDashboard({ profileId }) {
  const [profile, setProfile] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [relevantEvents, setRelevantEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d
  const { error: showError, info } = useToast();

  const loadAnalyticsData = async () => {
    if (!profileId) {
      console.log('No profileId provided to Analytics Dashboard');
      setError('No profile ID provided');
      setLoading(false);
      return;
    }

    console.log('Loading analytics data for profileId:', profileId);
    setLoading(true);
    setError(null);

    try {
      console.log('Making API calls...');
      const [profileResponse, eventsResponse, analyticsResponse] = await Promise.all([
        userProfileAPI.getProfile(profileId),
        userProfileAPI.getRelevantEvents(profileId, { includeAnalytics: true }),
        userProfileAPI.getScoringAnalytics(profileId)
      ]);

      console.log('Profile response:', profileResponse);
      console.log('Events response:', eventsResponse);
      console.log('Analytics response:', analyticsResponse);

      setProfile(profileResponse.profile);
      setRelevantEvents(eventsResponse.events || []);
      setAnalyticsData(analyticsResponse);
      
      info(`Analytics dashboard loaded successfully. Found ${eventsResponse.events?.length || 0} relevant events.`);
    } catch (err) {
      console.error('Error loading analytics data:', err);
      console.error('Error details:', err.response?.data);
      
      const errorMessage = `Failed to load analytics data: ${err.response?.data?.message || err.message}`;
      setError(errorMessage);
      showError(errorMessage, 'Analytics Loading Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    loadAnalyticsData();
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
    // TODO: Reload data with new time range
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [profileId]);

  const getRiskLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getRiskScoreColor = (score) => {
    if (score >= 0.7) return 'error';
    if (score >= 0.4) return 'warning';
    return 'success';
  };

  const calculateOverallRiskScore = () => {
    if (!relevantEvents.length) return 0;
    const avgScore = relevantEvents.reduce((sum, event) => sum + (event.relevanceScore || 0), 0) / relevantEvents.length;
    return avgScore;
  };

  const getTopRiskFactors = () => {
    if (!analyticsData?.factorAnalysis) return [];
    return Object.entries(analyticsData.factorAnalysis)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([factor, count]) => ({ factor, count }));
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <LoadingSpinner 
          message="Loading advanced analytics dashboard..." 
          size="large" 
        />
        <Box sx={{ mt: 4 }}>
          <SkeletonLoader lines={8} height={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <ErrorIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h5" gutterBottom color="error">
            Analytics Dashboard Loading Failed
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleRetry}
            startIcon={<Refresh />}
            sx={{ mr: 2 }}
          >
            Retry ({retryCount + 1})
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">
          Profile not found. Please check your profile ID and try again.
        </Alert>
      </Container>
    );
  }

  const overallRiskScore = calculateOverallRiskScore();
  const topRiskFactors = getTopRiskFactors();

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Analytics sx={{ mr: 2, color: 'primary.main' }} />
          Advanced Risk Intelligence Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
          Welcome back, {profile.name} • {profile.company} • {profile.industry}
        </Typography>
        
        {/* Time Range Selector */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          {['7d', '30d', '90d'].map((range) => (
            <Chip
              key={range}
              label={range}
              variant={timeRange === range ? 'filled' : 'outlined'}
              onClick={() => handleTimeRangeChange(range)}
              size="small"
            />
          ))}
          <Box sx={{ flexGrow: 1 }} />
          <IconButton size="small">
            <Refresh />
          </IconButton>
          <IconButton size="small">
            <Download />
          </IconButton>
          <IconButton size="small">
            <Settings />
          </IconButton>
        </Box>
      </Box>

      {/* Key Metrics Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <RiskMetricsCard
            title="Overall Risk Score"
            value={`${(overallRiskScore * 100).toFixed(1)}%`}
            trend="+5.2%"
            trendDirection="up"
            color={getRiskScoreColor(overallRiskScore)}
            icon={<Assessment />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <RiskMetricsCard
            title="Active Events"
            value={relevantEvents.length}
            trend={`${relevantEvents.filter(e => e.severity === 'high' || e.severity === 'critical').length} high-risk`}
            trendDirection="neutral"
            color="primary"
            icon={<Warning />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <RiskMetricsCard
            title="Risk Velocity"
            value="12.3"
            trend="+2.1"
            trendDirection="up"
            color="warning"
            icon={<Speed />}
            subtitle="events/day"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <RiskMetricsCard
            title="Geographic Coverage"
            value={new Set(relevantEvents.flatMap(e => e.regions || [])).size}
            trend="3 regions"
            trendDirection="neutral"
            color="info"
            icon={<Public />}
            subtitle="active regions"
          />
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Paper elevation={2} sx={{ mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ShowChart sx={{ mr: 1 }} />
                Risk Trends
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Map sx={{ mr: 1 }} />
                Geographic Analysis
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Security sx={{ mr: 1 }} />
                Risk Factors
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Notifications sx={{ mr: 1 }} />
                Alerts & Monitoring
              </Box>
            } 
          />
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <RiskTrendChart 
              events={relevantEvents}
              timeRange={timeRange}
              analyticsData={analyticsData}
            />
          )}
          
          {activeTab === 1 && (
            <GeographicRiskMap 
              events={relevantEvents}
              profile={profile}
            />
          )}
          
          {activeTab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader 
                    title="Top Risk Factors" 
                    action={
                      <IconButton>
                        <FilterList />
                      </IconButton>
                    }
                  />
                  <CardContent>
                    <List>
                      {topRiskFactors.map((factor, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Box sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              bgcolor: `primary.${index < 2 ? 'main' : 'light'}` 
                            }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={factor.factor.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            secondary={`${factor.count} occurrences`}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {((factor.count / relevantEvents.length) * 100).toFixed(1)}%
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Risk Distribution" />
                  <CardContent>
                    {analyticsData?.scoreDistribution && (
                      <Box>
                        {Object.entries(analyticsData.scoreDistribution).map(([level, count]) => (
                          <Box key={level} sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                {level} Risk
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {count} events
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={(count / relevantEvents.length) * 100}
                              color={getRiskLevelColor(level)}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
          
          {activeTab === 3 && (
            <AlertSystem 
              profile={profile}
              events={relevantEvents}
              analyticsData={analyticsData}
            />
          )}
        </Box>
      </Paper>

      {/* Recent High-Risk Events */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Warning sx={{ mr: 1 }} />
          Recent High-Risk Events
          <Chip 
            label={relevantEvents.filter(e => e.severity === 'high' || e.severity === 'critical').length} 
            size="small" 
            color="error"
            sx={{ ml: 2 }} 
          />
        </Typography>

        {relevantEvents.filter(e => e.severity === 'high' || e.severity === 'critical').length === 0 ? (
          <Alert severity="success">
            No high-risk events detected in the current time period.
          </Alert>
        ) : (
          <List>
            {relevantEvents
              .filter(e => e.severity === 'high' || e.severity === 'critical')
              .slice(0, 5)
              .map((event, index) => (
                <ListItem key={index} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 2 }}>
                  <ListItemIcon>
                    <Timeline color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1">
                          {event.title}
                        </Typography>
                        <Chip 
                          label={event.severity} 
                          color={getRiskLevelColor(event.severity)}
                          size="small"
                        />
                        <Chip 
                          label={`${(event.relevanceScore * 100).toFixed(1)}%`} 
                          color={getRiskScoreColor(event.relevanceScore)}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {event.description}
                        </Typography>
                        {event.rationale && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                            <strong>Rationale:</strong> {event.rationale}
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {event.regions?.map((region, idx) => (
                            <Chip 
                              key={idx} 
                              label={region} 
                              size="small" 
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
          </List>
        )}
      </Paper>
    </Container>
  );
} 
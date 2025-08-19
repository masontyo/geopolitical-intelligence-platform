import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Alert,
  Avatar,
  Chip,
  Divider,
  Skeleton,
  useTheme,
  useMediaQuery,
  Tooltip
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
  Refresh,
  ArrowForward,
  Security,
  Business,
  Timeline,
  Add,
  Flag,
  Assignment,
  CheckBox
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { userProfileAPI } from '../services/api';
import { useToast } from './ToastNotifications';

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

  // Sample events for demonstration (replace with real data later)
  const sampleEvents = [
    {
      id: 1,
      title: "Supply Chain Disruption in Asia Pacific",
      description: "Port closures",
      severity: "high",
      categories: ["Supply Chain Risk"],
      regions: ["Asia Pacific"],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      actionSteps: [
        { id: 1, text: "Contact key suppliers", status: "pending" },
        { id: 2, text: "Assess inventory levels", status: "in-progress" },
        { id: 3, text: "Update risk assessment", status: "pending" }
      ]
    },
    {
      id: 2,
      title: "New Regulatory Requirements in Europe",
      description: "New GDPR rules",
      severity: "medium",
      categories: ["Regulatory Risk"],
      regions: ["Europe"],
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      actionSteps: [
        { id: 4, text: "Review current policies", status: "completed" },
        { id: 5, text: "Update compliance procedures", status: "in-progress" }
      ]
    },
    {
      id: 3,
      title: "Cybersecurity Threat Detection",
      description: "Phishing attacks",
      severity: "high",
      categories: ["Cybersecurity Risk"],
      regions: ["North America"],
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      actionSteps: [
        { id: 6, text: "Enhance email filtering", status: "completed" },
        { id: 7, text: "Conduct security training", status: "pending" }
      ]
    },
    {
      id: 4,
      title: "Market Volatility in Emerging Markets",
      description: "Currency volatility",
      severity: "medium",
      categories: ["Market Risk"],
      regions: ["Latin America"],
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      actionSteps: [
        { id: 8, text: "Review portfolio exposure", status: "in-progress" },
        { id: 9, text: "Consult with financial advisors", status: "pending" }
      ]
    },
    {
      id: 5,
      title: "Environmental Compliance Updates",
      description: "New sustainability rules",
      severity: "low",
      categories: ["Environmental Risk"],
      regions: ["North America"],
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      actionSteps: [
        { id: 10, text: "Assess current practices", status: "pending" },
        { id: 11, text: "Develop reporting framework", status: "pending" }
      ]
    },
    {
      id: 6,
      title: "Geopolitical Tensions in Middle East",
      description: "Regional conflicts",
      severity: "high",
      categories: ["Geopolitical Risk"],
      regions: ["Middle East"],
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      actionSteps: [
        { id: 12, text: "Monitor energy prices", status: "completed" },
        { id: 13, text: "Assess supply chain impact", status: "in-progress" }
      ]
    }
  ];

  // Sample action steps for the right sidebar
  const sampleActionSteps = [
    { id: 1, text: "Contact key suppliers", status: "pending", event: "Supply Chain Disruption", priority: "high" },
    { id: 2, text: "Assess inventory levels", status: "in-progress", event: "Supply Chain Disruption", priority: "high" },
    { id: 3, text: "Update risk assessment", status: "pending", event: "Supply Chain Disruption", priority: "medium" },
    { id: 4, text: "Review current policies", status: "completed", event: "New Regulatory Requirements", priority: "medium" },
    { id: 5, text: "Update compliance procedures", status: "in-progress", event: "New Regulatory Requirements", priority: "high" },
    { id: 6, text: "Enhance email filtering", status: "completed", event: "Cybersecurity Threat", priority: "high" },
    { id: 7, text: "Conduct security training", status: "pending", event: "Cybersecurity Threat", priority: "medium" }
  ];

  useEffect(() => {
    if (effectiveProfileId) {
      loadDashboardData();
    } else {
      // Use sample data for now
      setRelevantEvents(sampleEvents);
      setLoading(false);
    }
  }, [effectiveProfileId]);

  // Load user profile data from localStorage
  useEffect(() => {
    const loadProfile = () => {
      try {
        // Try to get profile from persistent user profile storage
        const userProfile = localStorage.getItem('user_profile');
        if (userProfile) {
          const parsed = JSON.parse(userProfile);
          console.log('EnterpriseDashboard: Loaded profile from user_profile:', parsed);
          setProfile(parsed);
          return;
        }
        
        // Fallback: try to get from onboarding data
        const onboardingData = localStorage.getItem('onboarding_progress');
        if (onboardingData) {
          const parsed = JSON.parse(onboardingData);
          if (parsed.profileData) {
            setProfile(parsed.profileData);
            return;
          }
        }
        
        // Fallback: try to get from currentProfileId
        if (effectiveProfileId) {
          const profileData = localStorage.getItem(`profile_${effectiveProfileId}`);
          if (profileData) {
            setProfile(JSON.parse(profileData));
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
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
      setRelevantEvents(eventsResponse.events || sampleEvents);
      setLastUpdated(new Date());
      
      info(`Dashboard loaded successfully. Found ${eventsResponse.events?.length || 0} relevant events.`);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      // Fall back to sample data
      setRelevantEvents(sampleEvents);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadDashboardData();
    success('Dashboard refreshed successfully');
  };

  const handleViewEventDetails = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handleViewAllEvents = () => {
    navigate('/events');
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <Error color="error" />;
      case 'medium': return <Warning color="warning" />;
      case 'low': return <CheckCircle color="success" />;
      default: return <Timeline />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'pending': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  // Helper function to safely format timestamps
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Recent';
    if (timestamp instanceof Date) {
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    // If it's a string or number, try to convert to Date
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Recent';
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return 'Recent';
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
              Welcome back, {profile?.firstName || 'User'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {profile?.company || 'Your Company'} • Last updated: {lastUpdated.toLocaleTimeString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Main Content Layout */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Left Side - Events Grid */}
        <Box sx={{ flex: '1 1 0%', minWidth: 0 }}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Recent Events
            </Typography>
            <Button
              variant="outlined"
              endIcon={<ArrowForward />}
              onClick={handleViewAllEvents}
            >
              View All
            </Button>
          </Box>

          {/* Events Grid - 2x3 Layout with Fixed Heights */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 2 
          }}>
            {relevantEvents.slice(0, 6).map((event) => {
              console.log('Rendering event:', event); // Debug log
              return (
                <Card 
                  key={event.id}
                  sx={{ 
                    height: 200, // Fixed height for consistency
                    width: '100%', // Full width within grid cell
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[8]
                    }
                  }}
                  onClick={() => handleViewEventDetails(event.id)}
                >
                  <CardContent sx={{ p: 1.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Event Header */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                      {getSeverityIcon(event.severity)}
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 600, 
                          fontSize: '0.9rem',
                          lineHeight: 1.3,
                          mb: 0.5
                        }}>
                          {event.title}
                        </Typography>
                      </Box>
                    </Box>

                                         {/* Event Description */}
                     <Typography variant="body2" color="text.secondary" sx={{ 
                       mb: 1.5, 
                       lineHeight: 1.4,
                       fontSize: '0.8rem',
                       flexGrow: 1 // Take up remaining space
                     }}>
                       {event.description}
                     </Typography>

                    {/* Event Metadata */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      <Chip 
                        label={event.categories?.[0] || event.category || 'Unknown Category'} 
                        size="small" 
                        variant="filled"
                        color="primary"
                        sx={{ 
                          fontSize: '0.8rem', 
                          height: 28,
                          minWidth: 'fit-content',
                          fontWeight: 600,
                          backgroundColor: theme.palette.primary.main,
                          color: 'white',
                          '& .MuiChip-label': {
                            px: 1.5,
                            fontWeight: 600
                          }
                        }}
                      />
                      <Chip 
                        label={event.regions?.[0] || event.region || 'Unknown Region'} 
                        size="small" 
                        variant="filled"
                        color="secondary"
                        icon={<LocationOn sx={{ fontSize: '1.1rem', color: 'white' }} />}
                        sx={{ 
                          fontSize: '0.8rem', 
                          height: 28,
                          minWidth: 'fit-content',
                          fontWeight: 600,
                          backgroundColor: theme.palette.secondary.main,
                          color: 'white',
                          '& .MuiChip-label': {
                            px: 1.5,
                            fontWeight: 600
                          }
                        }}
                      />
                    </Box>

                    {/* Timestamp */}
                    <Typography variant="caption" color="text.secondary" sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5, 
                      fontSize: '0.75rem',
                      fontWeight: 500
                    }}>
                      <Schedule sx={{ fontSize: '0.875rem' }} />
                      {formatTimestamp(event.timestamp)}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Box>

        {/* Right Side - Action Steps */}
        <Box sx={{ 
          width: { xs: '100%', md: '320px' }, 
          flexShrink: 0,
          position: { xs: 'static', md: 'sticky' },
          top: 24
        }}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Action Steps
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Add />}
                onClick={() => navigate('/actions')}
              >
                Add New
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {sampleActionSteps.map((action) => (
                <Box key={action.id} sx={{ 
                  p: 2, 
                  border: 1, 
                  borderColor: 'divider', 
                  borderRadius: 1,
                  backgroundColor: 'background.paper'
                }}>
                  {/* Action Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, flexGrow: 1 }}>
                      {action.text}
                    </Typography>
                    <Chip 
                      label={action.status} 
                      size="small" 
                      color={getStatusColor(action.status)}
                      sx={{ fontSize: '0.7rem', ml: 1 }}
                    />
                  </Box>

                  {/* Action Metadata */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {action.event}
                    </Typography>
                    <Chip 
                      label={action.priority} 
                      size="small" 
                      color={getPriorityColor(action.priority)}
                      sx={{ fontSize: '0.7rem' }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Quick Actions */}
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Flag />}
                fullWidth
                onClick={() => navigate('/alerts')}
              >
                Create Alert
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Assignment />}
                fullWidth
                onClick={() => navigate('/tasks')}
              >
                New Task
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<CheckBox />}
                fullWidth
                onClick={() => navigate('/checklist')}
              >
                Risk Checklist
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
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
      
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Events Grid Skeleton */}
        <Box sx={{ flex: '1 1 0%', minWidth: 0 }}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Skeleton variant="text" width="30%" height={32} />
            <Skeleton variant="rectangular" width={100} height={36} />
          </Box>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 2 
          }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
            ))}
          </Box>
        </Box>
        
        {/* Action Steps Skeleton */}
        <Box sx={{ 
          width: { xs: '100%', md: '320px' }, 
          flexShrink: 0
        }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Skeleton variant="text" width="40%" height={24} />
              <Skeleton variant="rectangular" width={80} height={32} />
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[1, 2, 3, 4].map((i) => (
                <Box key={i} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="60%" height={16} />
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
} 
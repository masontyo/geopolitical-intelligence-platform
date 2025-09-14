import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  IconButton,
  Alert,
  Chip,
  Divider,
  Skeleton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Warning,
  Error,
  CheckCircle,
  LocationOn,
  Schedule,
  Refresh,
  ArrowForward,
  Timeline,
  Flag,
  Assignment,
  CheckBox,
  Delete
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { userProfileAPI } from '../services/api';
import aiService from '../services/aiService';
import { useToast } from './ToastNotifications';

export default function EnterpriseDashboard({ profileId }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { success, info } = useToast();

  const [profile, setProfile] = useState(null);
  const [relevantEvents, setRelevantEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiInsights, setAiInsights] = useState([]);
  const [onboardingStatus, setOnboardingStatus] = useState(null);
  const [aiRecommendations, setAiRecommendations] = useState([]);

  const [actionSteps, setActionSteps] = useState([]);

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
          
          // Load action steps from dashboard storage
          const dashboardActions = localStorage.getItem('dashboard_action_steps');
          if (dashboardActions) {
            try {
              const parsedActions = JSON.parse(dashboardActions);
              console.log('Dashboard: Loaded action steps from profile:', parsedActions);
              setActionSteps(parsedActions);
            } catch (err) {
              console.error('Error loading dashboard action steps:', err);
            }
          }
          return;
        }
        
        // Fallback: try to get from onboarding data
        const onboardingData = localStorage.getItem('onboarding_progress');
        if (onboardingData) {
          const parsed = JSON.parse(onboardingData);
          if (parsed.profileData) {
            setProfile(parsed.profileData);
            
            // Load action steps from dashboard storage
            const dashboardActions = localStorage.getItem('dashboard_action_steps');
            if (dashboardActions) {
              try {
                const parsedActions = JSON.parse(dashboardActions);
                setActionSteps(parsedActions);
              } catch (err) {
                console.error('Error loading dashboard action steps:', err);
              }
            }
            return;
          }
        }
        
        // Fallback: try to get from currentProfileId
        if (effectiveProfileId) {
          const profileData = localStorage.getItem(`profile_${effectiveProfileId}`);
          if (profileData) {
            const parsed = JSON.parse(profileData);
            setProfile(parsed);
            
            // Load action steps from dashboard storage
            const dashboardActions = localStorage.getItem('dashboard_action_steps');
            if (dashboardActions) {
              try {
                const parsedActions = JSON.parse(dashboardActions);
                setActionSteps(parsedActions);
              } catch (err) {
                console.error('Error loading dashboard action steps:', err);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, [effectiveProfileId]);

  // Listen for changes to action steps in localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'dashboard_action_steps') {
        try {
          const newActions = JSON.parse(e.newValue || '[]');
          console.log('Dashboard: Action steps updated:', newActions);
          setActionSteps(newActions);
        } catch (err) {
          console.error('Error parsing updated action steps:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleCompleteAction = (actionId) => {
    // Update action status to completed in dashboard storage
    const existingActions = JSON.parse(localStorage.getItem('dashboard_action_steps') || '[]');
    const updatedActions = existingActions.map(action => 
      action.id === actionId ? { ...action, status: 'completed', completedAt: new Date().toISOString() } : action
    );
    localStorage.setItem('dashboard_action_steps', JSON.stringify(updatedActions));
    
    setActionSteps(updatedActions);
    success('Action step marked as completed');
  };

  const handleDeleteAction = (actionId) => {
    // Remove action from dashboard storage
    const existingActions = JSON.parse(localStorage.getItem('dashboard_action_steps') || '[]');
    const updatedActions = existingActions.filter(action => action.id !== actionId);
    localStorage.setItem('dashboard_action_steps', JSON.stringify(updatedActions));
    
    setActionSteps(updatedActions);
    success('Action step deleted');
  };

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load AI intelligence data
      const [onboardingStatus, aiInsights, aiRecommendations, enhancedNews] = await Promise.all([
        aiService.getOnboardingStatus('demo-user'),
        aiService.getAIInsights('demo-user'),
        aiService.getPersonalizedRecommendations('demo-user', 6),
        aiService.getEnhancedNews()
      ]);

      setOnboardingStatus(onboardingStatus);
      setAiInsights(aiInsights.insights || []);
      setAiRecommendations(aiRecommendations.recommendations || []);

      // Use AI-processed events if available, otherwise fall back to sample data
      if (enhancedNews.events && enhancedNews.events.length > 0) {
        setRelevantEvents(enhancedNews.events);
        info(`AI Intelligence loaded successfully. Found ${enhancedNews.events.length} AI-processed events.`);
      } else {
        setRelevantEvents(sampleEvents);
        info(`Using sample data. AI service may be starting up. Found ${sampleEvents.length} sample events.`);
      }

      // Load profile if available
      if (effectiveProfileId) {
        try {
          const profileResponse = await userProfileAPI.getProfile(effectiveProfileId);
          setProfile(profileResponse.profile);
        } catch (err) {
          console.log('No profile found, using demo mode');
        }
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      // Fall back to sample data
      setRelevantEvents(sampleEvents);
      setError('AI service temporarily unavailable. Showing sample data.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadDashboardData();
    success('Dashboard refreshed successfully');
  };

  const handleViewEventDetails = (eventId) => {
    navigate(`/event/${eventId}`, { 
      state: { from: '/dashboard' }
    });
  };

  const handleViewAllEvents = () => {
    navigate('/events');
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
              AI-Powered Risk Intelligence Dashboard
            </Typography>
            {onboardingStatus && onboardingStatus.completionPercentage < 100 && (
              <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                Complete your AI setup for personalized insights ({onboardingStatus.completionPercentage}% complete)
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/onboarding')}
              sx={{ 
                background: 'linear-gradient(45deg, #1e3a8a 30%, #3b82f6 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1e40af 30%, #2563eb 90%)',
                }
              }}
            >
              AI Setup
            </Button>
            <Button
              variant="outlined"
              onClick={async () => {
                try {
                  const result = await aiService.testAIIntelligence();
                  info(`AI Test: ${result.status} - ${result.message || 'Service responding'}`);
                } catch (error) {
                  info(`AI Test: Error - ${error.message}`);
                }
              }}
            >
              Test AI
            </Button>
          </Box>
        </Box>
      </Box>

      {/* AI Insights Section */}
      {aiInsights.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Paper sx={{ p: 2, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              🤖 AI Insights
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {aiInsights.map((insight, index) => (
                <Chip
                  key={index}
                  label={insight}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    bgcolor: 'white',
                    borderColor: 'primary.300',
                    color: 'primary.700',
                    fontWeight: 500
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Box>
      )}

      {/* Main Content Layout */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Left Side - Events Grid */}
        <Box sx={{ flex: '1 1 0%', minWidth: 0 }}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {aiRecommendations.length > 0 ? 'AI-Recommended Events' : 'Recent Events'}
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
            {(aiRecommendations.length > 0 ? aiRecommendations : relevantEvents.slice(0, 6)).map((event) => {
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
             </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {actionSteps.length > 0 ? actionSteps.map((action) => (
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
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {/* Event Link */}
                    {action.eventTitle && action.eventId && (
                      <Typography 
                        variant="caption" 
                        color="primary" 
                        sx={{ 
                          fontWeight: 500, 
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          '&:hover': { opacity: 0.8 }
                        }}
                        onClick={() => navigate(`/event/${action.eventId}`, { 
                          state: { from: '/dashboard' }
                        })}
                      >
                        📋 {action.eventTitle}
                      </Typography>
                    )}
                    
                    {/* Priority Only - Status already shown in header */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                      <Chip 
                        label={action.priority} 
                        size="small" 
                        color={getPriorityColor(action.priority)}
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </Box>
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                    {action.status !== 'completed' && (
                      <IconButton
                        size="small"
                        onClick={() => handleCompleteAction(action.id)}
                        color="success"
                        sx={{ p: 0.5 }}
                      >
                        <CheckCircle fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteAction(action.id)}
                      color="error"
                      sx={{ p: 0.5 }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              )) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    No action steps yet
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Click on any event to add action steps that will appear here.
                  </Typography>
                </Box>
              )}
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
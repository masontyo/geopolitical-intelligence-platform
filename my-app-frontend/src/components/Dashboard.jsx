import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Chip, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Alert,
  Button
} from '@mui/material';
import { 
  Business, 
  Warning, 
  Timeline, 
  Refresh,
  Error as ErrorIcon
} from '@mui/icons-material';
import { userProfileAPI } from '../services/api';
import { useToast } from './ToastNotifications';
import { LoadingSpinner, SkeletonLoader } from './LoadingSpinner';

export default function Dashboard({ profileId }) {
  const [profile, setProfile] = useState(null);
  const [relevantEvents, setRelevantEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const { error: showError, info } = useToast();

  const loadDashboardData = async () => {
    if (!profileId) {
      console.log('No profileId provided to Dashboard');
      setError('No profile ID provided');
      setLoading(false);
      return;
    }

    console.log('Loading dashboard data for profileId:', profileId);
    setLoading(true);
    setError(null);

    try {
      console.log('Making API calls...');
      const [profileResponse, eventsResponse] = await Promise.all([
        userProfileAPI.getProfile(profileId),
        userProfileAPI.getRelevantEvents(profileId)
      ]);

      console.log('Profile response:', profileResponse);
      console.log('Events response:', eventsResponse);

      setProfile(profileResponse.profile);
      setRelevantEvents(eventsResponse.events || []);
      
      info(`Dashboard loaded successfully. Found ${eventsResponse.events?.length || 0} relevant events.`);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      console.error('Error details:', err.response?.data);
      
      const errorMessage = `Failed to load dashboard data: ${err.response?.data?.message || err.message}`;
      setError(errorMessage);
      showError(errorMessage, 'Dashboard Loading Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    loadDashboardData();
  };

  useEffect(() => {
    loadDashboardData();
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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <LoadingSpinner 
          message="Loading your personalized dashboard..." 
          size="large" 
        />
        <Box sx={{ mt: 4 }}>
          <SkeletonLoader lines={5} height={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <ErrorIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h5" gutterBottom color="error">
            Dashboard Loading Failed
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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">
          Profile not found. Please check your profile ID and try again.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Business sx={{ mr: 2 }} />
        Welcome, {profile.name}
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Business sx={{ mr: 1 }} />
              Profile Summary
            </Typography>

            <Typography variant="subtitle2" gutterBottom>
              Company
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {profile.company || profile.name}
            </Typography>

            <Typography variant="subtitle2" gutterBottom>
              Business Units
            </Typography>
            <Box sx={{ mb: 2 }}>
              {profile.businessUnits?.map((unit, index) => (
                <Chip 
                  key={index} 
                  label={unit.name || unit} 
                  size="small" 
                  sx={{ mr: 1, mb: 1 }} 
                />
              ))}
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              Areas of Concern
            </Typography>
            <Box sx={{ mb: 2 }}>
              {profile.areasOfConcern?.map((concern, index) => (
                <Chip 
                  key={index} 
                  label={concern.category || concern} 
                  color="warning" 
                  size="small" 
                  sx={{ mr: 1, mb: 1 }} 
                />
              ))}
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              Risk Tolerance
            </Typography>
            <Chip 
              label={profile.riskTolerance || 'Medium'} 
              color={getRiskLevelColor(profile.riskTolerance)}
              size="small"
            />
          </Paper>
        </Grid>

        {/* Relevant Events */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Warning sx={{ mr: 1 }} />
              Relevant Events
              <Chip 
                label={relevantEvents.length} 
                size="small" 
                sx={{ ml: 2 }} 
              />
            </Typography>

            {relevantEvents.length === 0 ? (
              <Alert severity="info">
                No relevant events found. Events will appear here as they are detected.
              </Alert>
            ) : (
              <List>
                {relevantEvents.map((event, index) => (
                  <ListItem key={index} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 2 }}>
                    <ListItemIcon>
                      <Timeline color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">
                            {event.title}
                          </Typography>
                          <Chip 
                            label={event.riskLevel || 'Medium'} 
                            color={getRiskLevelColor(event.riskLevel)}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {event.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {event.affectedRegions?.map((region, idx) => (
                              <Chip 
                                key={idx} 
                                label={region} 
                                size="small" 
                                variant="outlined"
                              />
                            ))}
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Relevance Score: {event.relevanceScore?.toFixed(2) || 'N/A'}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 
import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Card, CardContent, Grid, Chip, 
  Alert, CircularProgress, Button, Divider, List, ListItem, 
  ListItemText, ListItemIcon
} from '@mui/material';
import {
  Business, LocationOn, Warning, TrendingUp, 
  Security, Timeline, CheckCircle, Error
} from '@mui/icons-material';
import { userProfileAPI, eventsAPI } from '../services/api';

export default function Dashboard({ profileId }) {
  const [profile, setProfile] = useState(null);
  const [relevantEvents, setRelevantEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [profileId]);

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
      // Load profile and relevant events in parallel
      console.log('Making API calls...');
      const [profileResponse, eventsResponse] = await Promise.all([
        userProfileAPI.getProfile(profileId),
        userProfileAPI.getRelevantEvents(profileId)
      ]);
      
      console.log('Profile response:', profileResponse);
      console.log('Events response:', eventsResponse);
      
      setProfile(profileResponse.profile);
      setRelevantEvents(eventsResponse.events || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      console.error('Error details:', err.response?.data);
      setError(`Failed to load dashboard data: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
        <Button onClick={loadDashboardData} sx={{ ml: 2 }}>
          Retry
        </Button>
      </Alert>
    );
  }

  if (!profile) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No profile data available.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Intelligence Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Business sx={{ mr: 1 }} />
              Profile Summary
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="primary">
                {profile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile.role} • {profile.company}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

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

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item>
                <Button variant="outlined" startIcon={<Security />}>
                  Update Profile
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" startIcon={<TrendingUp />}>
                  View Analytics
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" startIcon={<CheckCircle />}>
                  Export Report
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 
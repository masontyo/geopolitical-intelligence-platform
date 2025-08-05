import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Button,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  CardActions,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import { 
  Business, 
  Warning, 
  Timeline, 
  Refresh,
  Error as ErrorIcon,
  Analytics,
  Dashboard as DashboardIcon,
  Email,
  People,
  Notifications,
  MoreVert,
  Add,
  Visibility,
  ExpandMore,
  ExpandLess,
  CrisisAlert
} from '@mui/icons-material';
import { userProfileAPI } from '../services/api';
import { useToast } from './ToastNotifications';
import { LoadingSpinner } from './LoadingSpinner';
import AnalyticsDashboard from './AnalyticsDashboard';
import CrisisRoom from './CrisisRoom';

export default function IntegratedDashboard() {
  const navigate = useNavigate();
  const { profileId } = useParams();
  const [profile, setProfile] = useState(null);
  const [relevantEvents, setRelevantEvents] = useState([]);
  const [crisisRooms, setCrisisRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCrisisRoom, setSelectedCrisisRoom] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [expandedCrisis, setExpandedCrisis] = useState(false);
  const [expandedAnalytics, setExpandedAnalytics] = useState(false);
  const [expandedEventDetails, setExpandedEventDetails] = useState({});
  const { error: showError, success, info } = useToast();

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
        userProfileAPI.getRelevantEvents(profileId)
      ]);

      setProfile(profileResponse.profile);
      setRelevantEvents(eventsResponse.events || []);

      // Load crisis rooms for this profile
      await loadCrisisRooms();
      
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

  const loadCrisisRooms = async () => {
    try {
      // This would be a new API endpoint to get crisis rooms for a profile
      const response = await fetch(`https://geop-backend.onrender.com/api/crisis-rooms/profile/${profileId}`);
      if (response.ok) {
        const data = await response.json();
        setCrisisRooms(data.crisisRooms || []);
      }
    } catch (err) {
      console.error('Error loading crisis rooms:', err);
    }
  };

  const handleCreateCrisisRoom = async (eventId) => {
    try {
      console.log('Creating crisis room for event:', eventId);
      const event = relevantEvents.find(e => e._id === eventId);
      console.log('Found event:', event);
      
      const response = await fetch('https://geop-backend.onrender.com/api/crisis-rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          title: `Crisis: ${event?.title || 'Event'}`,
          description: 'Crisis communication room created from dashboard',
          createdBy: profile?.name || 'Dashboard User'
        })
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('Created crisis room:', responseData);
        setCrisisRooms(prev => [...prev, responseData.data]);
        success('Crisis room created successfully!');
        return responseData.data._id;
      } else {
        const errorData = await response.json();
        console.error('Failed to create crisis room:', errorData);
        showError(`Failed to create crisis room: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error creating crisis room:', err);
      showError('Failed to create crisis room');
    }
  };

  const handleOpenCrisisRoom = (crisisRoomId) => {
    setSelectedCrisisRoom(crisisRoomId);
  };

  const handleCloseCrisisRoom = () => {
    setSelectedCrisisRoom(null);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleEventDetails = (eventId) => {
    setExpandedEventDetails(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  const handleViewEventDetails = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return <ErrorIcon color="error" />;
      case 'high': return <Warning color="warning" />;
      case 'medium': return <Warning color="info" />;
      case 'low': return <Warning color="action" />;
      default: return <Warning color="action" />;
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [profileId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={loadDashboardData}>
            Retry
          </Button>
        }>
          {error}
        </Alert>
      </Container>
    );
  }

  // If a crisis room is selected, show it
  if (selectedCrisisRoom) {
    return (
      <CrisisRoom 
        crisisRoomId={selectedCrisisRoom} 
        onClose={handleCloseCrisisRoom}
      />
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Risk Intelligence Dashboard
          </Typography>
          <IconButton color="inherit" onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Profile Summary */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h5" gutterBottom>
                Welcome back, {profile?.name || 'User'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {profile?.organization} • {profile?.industry}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
              <Chip 
                label={`${relevantEvents.length} Active Risks`} 
                color="warning" 
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Risk Overview
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {relevantEvents.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active risk events
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Crisis Rooms
                </Typography>
                <Typography variant="h4" color="error.main">
                  {crisisRooms.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active crisis communications
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Response Rate
                </Typography>
                <Typography variant="h4" color="success.main">
                  87%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average stakeholder response
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Event Monitoring Section */}
        <Paper sx={{ mb: 3 }}>
          <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom>
              Risk Events Requiring Attention
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Monitor and analyze relevant geopolitical events
            </Typography>
          </Box>
          
          {relevantEvents.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Warning sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No Active Risk Events
              </Typography>
              <Typography variant="body2" color="text.secondary">
                New relevant events will appear here as they are detected.
              </Typography>
            </Box>
          ) : (
            <List>
              {relevantEvents.map((event, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
                    {/* Event Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                      <ListItemIcon>
                        {getSeverityIcon(event.severity)}
                      </ListItemIcon>
                      <Box 
                        sx={{ 
                          flexGrow: 1, 
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'action.hover',
                            borderRadius: 1,
                            px: 1,
                            py: 0.5
                          }
                        }}
                        onClick={() => handleViewEventDetails(event._id)}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle1" component="span">
                                {event.title}
                              </Typography>
                              <Chip 
                                label={event.severity} 
                                color={getSeverityColor(event.severity)}
                                size="small" 
                              />
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                              <Typography variant="body2" color="text.secondary">
                                {event.regions?.join(', ') || 'Global'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {new Date(event.eventDate).toLocaleDateString()}
                              </Typography>
                              {event.source?.name && (
                                <Link href={event.source.url} target="_blank" variant="body2">
                                  {event.source.name}
                                </Link>
                              )}
                            </Box>
                          }
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleEventDetails(event._id);
                          }}
                        >
                          {expandedEventDetails[event._id] ? 'Hide Details' : 'View Details'}
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="warning"
                          startIcon={<CrisisAlert />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCreateCrisisRoom(event._id);
                          }}
                        >
                          Create Crisis Room
                        </Button>
                      </Box>
                    </Box>

                    {/* Expanded Event Details */}
                    {expandedEventDetails[event._id] && (
                      <Box sx={{ pl: 7, pr: 2, pb: 2 }}>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body2" paragraph>
                          {event.description}
                        </Typography>
                        {event.rationale && (
                          <Typography variant="body2" color="text.secondary" paragraph>
                            <strong>Analysis:</strong> {event.rationale}
                          </Typography>
                        )}
                        {event.contributingFactors && event.contributingFactors.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              <strong>Key Factors:</strong>
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {event.contributingFactors.slice(0, 3).map((factor, idx) => (
                                <Chip 
                                  key={idx} 
                                  label={factor.factor} 
                                  size="small" 
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          </Box>
                        )}
                      </Box>
                    )}
                  </ListItem>
                  {index < relevantEvents.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>

        {/* Collapsible Crisis Communications Section */}
        <Accordion 
          expanded={expandedCrisis} 
          onChange={() => setExpandedCrisis(!expandedCrisis)}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CrisisAlert color="error" />
              <Typography variant="h6">
                Crisis Communications
              </Typography>
              {crisisRooms.length > 0 && (
                <Badge badgeContent={crisisRooms.length} color="error" />
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {crisisRooms.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  No active crisis rooms. Create one from a high-priority event above.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {crisisRooms.map((crisisRoom, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {crisisRoom.crisisRoom.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {crisisRoom.crisisRoom.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          <Chip 
                            label={crisisRoom.crisisRoom.severity} 
                            color={crisisRoom.crisisRoom.severity === 'critical' ? 'error' : 'warning'} 
                            size="small" 
                          />
                          <Chip 
                            label={crisisRoom.crisisRoom.status} 
                            variant="outlined" 
                            size="small" 
                          />
                          <Chip 
                            label={`${crisisRoom.stakeholders.length} stakeholders`} 
                            variant="outlined" 
                            size="small" 
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Created {new Date(crisisRoom.crisisRoom.createdAt).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small" 
                          startIcon={<Visibility />}
                          onClick={() => handleOpenCrisisRoom(crisisRoom._id)}
                        >
                          Open Crisis Room
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Collapsible Analytics Section */}
        <Accordion 
          expanded={expandedAnalytics} 
          onChange={() => setExpandedAnalytics(!expandedAnalytics)}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Analytics color="primary" />
              <Typography variant="h6">
                Analytics & Insights
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <AnalyticsDashboard profileId={profileId} />
          </AccordionDetails>
        </Accordion>
      </Container>
    </Box>
  );
} 
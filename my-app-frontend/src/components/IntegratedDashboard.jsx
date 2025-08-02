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
  Button,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Link
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
  Visibility
} from '@mui/icons-material';
import { userProfileAPI } from '../services/api';
import { useToast } from './ToastNotifications';
import { LoadingSpinner } from './LoadingSpinner';
import AnalyticsDashboard from './AnalyticsDashboard';
import CrisisRoom from './CrisisRoom';

export default function IntegratedDashboard({ profileId }) {
  const [profile, setProfile] = useState(null);
  const [relevantEvents, setRelevantEvents] = useState([]);
  const [crisisRooms, setCrisisRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCrisisRoom, setSelectedCrisisRoom] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const { error: showError, success, info } = useToast();

  const tabs = [
    { label: 'Overview', icon: <DashboardIcon /> },
    { label: 'Crisis Communications', icon: <Warning /> },
    { label: 'Analytics', icon: <Analytics /> }
  ];

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
          crisisData: {
            title: `Crisis: ${event?.title || 'Event'}`,
            description: 'Crisis communication room created from dashboard',
            createdBy: profile?.name || 'Dashboard User'
          }
        })
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const crisisRoom = await response.json();
        console.log('Created crisis room:', crisisRoom);
        setCrisisRooms(prev => [...prev, crisisRoom]);
        success('Crisis room created successfully!');
        return crisisRoom._id;
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

        {/* Main Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
          >
            {tabs.map((tab, index) => (
              <Tab 
                key={index}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {tab.icon}
                    {tab.label}
                    {tab.label === 'Crisis Communications' && crisisRooms.length > 0 && (
                      <Badge badgeContent={crisisRooms.length} color="error" />
                    )}
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {/* Quick Stats */}
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

            {/* Recent Events */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Risk Events
                  </Typography>
                  <List>
                    {relevantEvents.slice(0, 5).map((event, index) => (
                      <ListItem key={index} divider>
                        <ListItemIcon>
                          <Warning color="warning" />
                        </ListItemIcon>
                        <ListItemText
                          primary={event.title}
                          secondary={`${event.severity} • ${event.regions?.join(', ') || 'Global'} • ${new Date(event.eventDate).toLocaleDateString()}`}
                        />
                        <Button
                          size="small"
                          startIcon={<Warning />}
                          onClick={() => handleCreateCrisisRoom(event._id)}
                        >
                          Create Crisis Room
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Grid container spacing={3}>
            {crisisRooms.length === 0 ? (
              <Grid item xs={12}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Warning sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    No Active Crisis Rooms
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Crisis rooms will appear here when created for high-priority events.
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<Add />}
                    onClick={() => setActiveTab(0)}
                  >
                    View Overview
                  </Button>
                </Paper>
              </Grid>
            ) : (
              crisisRooms.map((crisisRoom, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card>
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
              ))
            )}
          </Grid>
        )}

        {activeTab === 2 && (
          <AnalyticsDashboard profileId={profileId} />
        )}
      </Container>
    </Box>
  );
} 
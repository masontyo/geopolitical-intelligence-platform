import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Divider,
  Switch,
  FormControlLabel,
  FormGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
  useTheme
} from '@mui/material';
import {
  Notifications,
  Business,
  AccountCircle,
  Security,
  Help,
  ArrowForward,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [notificationsExpanded, setNotificationsExpanded] = useState(false);

  // Load user profile data
  useEffect(() => {
    const loadProfile = () => {
      try {
        const userProfile = localStorage.getItem('user_profile');
        if (userProfile) {
          const parsed = JSON.parse(userProfile);
          setProfile(parsed);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, []);

  const handleNavigateTo = (path) => {
    navigate(path);
  };

  const settingsSections = [
    {
      title: 'Company Profile',
      description: 'Manage company information, business units, and risk preferences',
      icon: <Business color="primary" sx={{ fontSize: 32 }} />,
      path: '/settings/company',
      color: 'primary.main'
    },
    {
      title: 'Account Settings',
      description: 'Personal information, password, and security preferences',
      icon: <AccountCircle color="primary" sx={{ fontSize: 32 }} />,
      path: '/settings/account',
      color: 'primary.main'
    },
    {
      title: 'Data & Privacy',
      description: 'Data export, privacy settings, and compliance preferences',
      icon: <Security color="primary" sx={{ fontSize: 32 }} />,
      path: '/settings/privacy',
      color: 'primary.main'
    },
    {
      title: 'Help & Support',
      description: 'Documentation, contact support, and troubleshooting',
      icon: <Help color="primary" sx={{ fontSize: 32 }} />,
      path: '/settings/support',
      color: 'primary.main'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}>
          <SettingsIcon color="primary" />
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account preferences and platform configuration
        </Typography>
      </Box>

      {/* Notification Settings Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Notifications color="primary" sx={{ fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Notification Preferences
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => setNotificationsExpanded(!notificationsExpanded)}
            endIcon={<ArrowForward sx={{ 
              transform: notificationsExpanded ? 'rotate(90deg)' : 'none',
              transition: 'transform 0.2s'
            }} />}
          >
            {notificationsExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </Box>

        {notificationsExpanded && (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Alert Frequency</InputLabel>
                  <Select
                    value={profile?.notificationFrequency || 'daily'}
                    label="Alert Frequency"
                    disabled
                  >
                    <MenuItem value="immediate">Immediate - Real-time alerts</MenuItem>
                    <MenuItem value="hourly">Hourly - Batched updates</MenuItem>
                    <MenuItem value="daily">Daily - Summary reports</MenuItem>
                    <MenuItem value="weekly">Weekly - Trend analysis</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Notification Methods</InputLabel>
                  <Select
                    value={profile?.notificationMediums || []}
                    label="Notification Methods"
                    disabled
                    multiple
                  >
                    <MenuItem value="Email">Email</MenuItem>
                    <MenuItem value="Dashboard alerts">Dashboard alerts</MenuItem>
                    <MenuItem value="Mobile push notifications">Mobile push notifications</MenuItem>
                    <MenuItem value="SMS">SMS</MenuItem>
                    <MenuItem value="Slack/Teams integration">Slack/Teams integration</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormGroup>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Alert Priority Levels
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="High Priority"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Medium Priority"
                    />
                    <FormControlLabel
                      control={<Switch />}
                      label="Low Priority"
                    />
                  </Box>
                </FormGroup>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Settings Navigation Cards */}
      <Grid container spacing={3}>
        {settingsSections.map((section) => (
          <Grid item xs={12} sm={6} md={6} key={section.title}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8]
                }
              }}
            >
              <CardActionArea 
                onClick={() => handleNavigateTo(section.path)}
                sx={{ height: '100%', p: 3 }}
              >
                <CardContent sx={{ p: 0, textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    {section.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {section.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {section.description}
                  </Typography>
                  <Button
                    variant="outlined"
                    endIcon={<ArrowForward />}
                    sx={{ mt: 1 }}
                  >
                    Manage
                  </Button>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Paper elevation={1} sx={{ p: 3, mt: 4, bgcolor: 'grey.50' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={() => handleNavigateTo('/onboarding')}
          >
            Update Onboarding Info
          </Button>
          <Button
            variant="outlined"
            onClick={() => window.open('mailto:support@geointel.com', '_blank')}
          >
            Contact Support
          </Button>
          <Button
            variant="outlined"
            onClick={() => window.open('/docs', '_blank')}
          >
            View Documentation
          </Button>
        </Box>
      </Paper>
    </Box>
  );
} 
import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme
} from '@mui/material';
import {
  Warning,
  Error,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  ArrowForward,
  Notifications,
  CrisisAlert
} from '@mui/icons-material';

export default function RiskStatusOverview({ riskData, onViewAllAlerts, onEventClick }) {
  const theme = useTheme();

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
      default: return <Warning />;
    }
  };

  const getThreatLevelBackground = (level) => {
    switch (level) {
      case 'high': return 'error.light';
      case 'medium': return 'warning.light';
      case 'low': return 'success.light';
      default: return 'grey.100';
    }
  };

  return (
    <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Risk Status Overview
        </Typography>
        <Chip
          icon={getThreatLevelIcon(riskData.threatLevel)}
          label={`${riskData.threatLevel.toUpperCase()} THREAT`}
          color={getThreatLevelColor(riskData.threatLevel)}
          variant="filled"
          sx={{ fontWeight: 600 }}
        />
      </Box>

      {/* Threat Level Indicator */}
      <Box 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 2,
          backgroundColor: getThreatLevelBackground(riskData.threatLevel),
          border: 1,
          borderColor: `${getThreatLevelColor(riskData.threatLevel)}.main`,
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {riskData.threatLevel.toUpperCase()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Current Threat Level
        </Typography>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h4" color="error.main" sx={{ fontWeight: 700 }}>
              {riskData.activeAlerts}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Alerts
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
              {riskData.criticalEvents}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Critical Events
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Recent Critical Events */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Recent Critical Events
        </Typography>
        <List dense sx={{ mb: 2 }}>
          {riskData.recentIncidents.slice(0, 3).map((incident, index) => (
            <React.Fragment key={incident.id}>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <Avatar sx={{ width: 24, height: 24, bgcolor: 'error.main' }}>
                    <Warning sx={{ fontSize: 14 }} />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={incident.title}
                  secondary={incident.time}
                  primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
                  secondaryTypographyProps={{ fontSize: '0.75rem' }}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => onEventClick && onEventClick(incident.id || incident._id)}
                />
                <Chip 
                  label={incident.severity} 
                  size="small"
                  color={getThreatLevelColor(incident.severity)}
                />
              </ListItem>
              {index < riskData.recentIncidents.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
        <Button
          variant="contained"
          color="error"
          startIcon={<CrisisAlert />}
          onClick={onViewAllAlerts}
          fullWidth
          sx={{ fontWeight: 600 }}
        >
          View All Alerts
        </Button>
        <Button
          variant="outlined"
          startIcon={<Notifications />}
          fullWidth
          sx={{ fontWeight: 600 }}
        >
          Configure
        </Button>
      </Box>
    </Paper>
  );
} 
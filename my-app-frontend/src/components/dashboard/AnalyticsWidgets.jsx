import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  LocationOn,
  Business,
  Notifications,
  CheckCircle,
  Warning,
  Error
} from '@mui/icons-material';

export default function AnalyticsWidgets({ analytics, profile }) {
  const theme = useTheme();

  const getTrendIcon = (trend) => {
    return trend === 'increasing' ? 
      <TrendingUp color="error" /> : 
      <TrendingDown color="success" />;
  };

  const getTrendColor = (trend) => {
    return trend === 'increasing' ? 'error.main' : 'success.main';
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Quick Analytics
        </Typography>
        <Chip
          icon={getTrendIcon(analytics.riskTrend)}
          label={`Risk ${analytics.riskTrend}`}
          color={analytics.riskTrend === 'increasing' ? 'error' : 'success'}
          variant="outlined"
          size="small"
        />
      </Box>

      {/* Risk Trend */}
      <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          {getTrendIcon(analytics.riskTrend)}
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Risk Trend
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color: getTrendColor(analytics.riskTrend) }}>
          {analytics.riskTrend === 'increasing' ? '+12%' : '-8%'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          vs. last 30 days
        </Typography>
      </Box>

      {/* Key Metrics Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h5" color="success.main" sx={{ fontWeight: 700 }}>
              {analytics.notificationDelivery}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Notification Delivery
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={analytics.notificationDelivery} 
              sx={{ mt: 1, height: 4, borderRadius: 2 }}
              color="success"
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700 }}>
              {analytics.profileCompletion}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Profile Complete
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={analytics.profileCompletion} 
              sx={{ mt: 1, height: 4, borderRadius: 2 }}
              color="primary"
            />
          </Box>
        </Grid>
      </Grid>

      {/* Top Affected Regions */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Top Affected Regions
        </Typography>
        <List dense>
          {analytics.topRegions.map((region, index) => (
            <ListItem key={region} sx={{ px: 0 }}>
              <ListItemIcon>
                <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                  <LocationOn sx={{ fontSize: 14 }} />
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={region}
                secondary={`${85 - (index * 15)}% risk concentration`}
                primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
                secondaryTypographyProps={{ fontSize: '0.75rem' }}
              />
              <Chip 
                label={`#${index + 1}`} 
                size="small"
                color={index === 0 ? 'error' : index === 1 ? 'warning' : 'default'}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Top Affected Industries */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Top Event Categories
        </Typography>
        <List dense>
          {analytics.topCategories.map((category, index) => (
            <ListItem key={category} sx={{ px: 0 }}>
              <ListItemIcon>
                <Avatar sx={{ width: 24, height: 24, bgcolor: 'secondary.main' }}>
                  <Business sx={{ fontSize: 14 }} />
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={category}
                secondary={`${92 - (index * 18)}% impact score`}
                primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
                secondaryTypographyProps={{ fontSize: '0.75rem' }}
              />
              <Chip 
                label={`${92 - (index * 18)}%`} 
                size="small"
                color={index === 0 ? 'error' : index === 1 ? 'warning' : 'default'}
                variant="outlined"
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
} 
import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Skeleton,
  List,
  ListItem,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  LocationOn,
  Schedule,
  Visibility,
  FilterList,
  TrendingUp,
  TrendingDown,
  Warning,
  Error,
  CheckCircle,
  Business,
  Security,
  CrisisAlert
} from '@mui/icons-material';

export default function EventFeed({ events, onViewEventDetails, loading }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [filters, setFilters] = useState({
    search: '',
    riskLevel: 'all',
    region: 'all',
    eventType: 'all',
    dateRange: 'all'
  });

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return <Error color="error" />;
      case 'high': return <Error color="error" />;
      case 'medium': return <Warning color="warning" />;
      case 'low': return <CheckCircle color="success" />;
      default: return <Warning />;
    }
  };

  const getEventTypeIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'cybersecurity': return <Security />;
      case 'business': return <Business />;
      case 'crisis': return <CrisisAlert />;
      default: return <Business />;
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
                         event.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
                         event.originalTitle?.toLowerCase().includes(filters.search.toLowerCase());
    const matchesRiskLevel = filters.riskLevel === 'all' || event.severity?.toLowerCase() === filters.riskLevel;
    const matchesRegion = filters.region === 'all' || event.regions?.some(region => region === filters.region);
    const matchesEventType = filters.eventType === 'all' || event.categories?.some(category => category.toLowerCase() === filters.eventType);
    
    return matchesSearch && matchesRiskLevel && matchesRegion && matchesEventType;
  });

  const handleFilterChange = (filter, value) => {
    setFilters(prev => ({ ...prev, [filter]: value }));
  };

  if (loading) {
    return <EventFeedSkeleton />;
  }

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Personalized Event Feed
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredEvents.length} relevant events found
          </Typography>
        </Box>
        <Chip 
          icon={<FilterList />}
          label="Filters Active"
          variant="outlined"
          color="primary"
        />
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search events..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: <FilterList sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Risk Level</InputLabel>
              <Select
                value={filters.riskLevel}
                label="Risk Level"
                onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Region</InputLabel>
              <Select
                value={filters.region}
                label="Region"
                onChange={(e) => handleFilterChange('region', e.target.value)}
              >
                <MenuItem value="all">All Regions</MenuItem>
                <MenuItem value="North America">North America</MenuItem>
                <MenuItem value="Europe">Europe</MenuItem>
                <MenuItem value="Asia Pacific">Asia Pacific</MenuItem>
                <MenuItem value="Middle East">Middle East</MenuItem>
                <MenuItem value="Africa">Africa</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Event Type</InputLabel>
              <Select
                value={filters.eventType}
                label="Event Type"
                onChange={(e) => handleFilterChange('eventType', e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="cybersecurity">Cybersecurity</MenuItem>
                <MenuItem value="business">Business</MenuItem>
                <MenuItem value="crisis">Crisis</MenuItem>
                <MenuItem value="politics">Politics</MenuItem>
                <MenuItem value="economics">Economics</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Events List */}
      <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
        {filteredEvents.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No events found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your filters or check back later for new events.
            </Typography>
          </Box>
        ) : (
          <List>
            {filteredEvents.map((event, index) => (
              <React.Fragment key={event._id || index}>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <Card 
                    sx={{ 
                      width: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[8]
                      }
                    }}
                    onClick={() => onViewEventDetails(event._id || event.id || index)}
                  >
                    <CardContent sx={{ pb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {event.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {event.description}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                          <Chip
                            icon={getSeverityIcon(event.severity)}
                            label={event.severity}
                            color={getSeverityColor(event.severity)}
                            size="small"
                          />
                          {event.relevanceScore && (
                            <Chip
                              label={`${Math.round(event.relevanceScore * 100)}% relevant`}
                              variant="outlined"
                              size="small"
                              color="primary"
                            />
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {event.regions?.join(', ') || 'Global'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(event.eventDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {getEventTypeIcon(event.categories?.[0])}
                          <Typography variant="caption" color="text.secondary">
                            {event.categories?.[0] || 'General'}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ pt: 0, pb: 2, px: 2 }}>
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewEventDetails(event._id || event.id || index);
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<CrisisAlert />}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle crisis room creation
                        }}
                      >
                        Create Crisis Room
                      </Button>
                    </CardActions>
                  </Card>
                </ListItem>
                {index < filteredEvents.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
}

function EventFeedSkeleton() {
  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width="40%" height={32} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="20%" height={20} />
      </Box>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Skeleton variant="rectangular" height={40} />
          </Grid>
        ))}
      </Grid>
      
      {[1, 2, 3].map((i) => (
        <Box key={i} sx={{ mb: 2 }}>
          <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 1 }} />
        </Box>
      ))}
    </Paper>
  );
} 
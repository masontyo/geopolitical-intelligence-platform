import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Avatar,
  Link,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowBack,
  Warning,
  Timeline,
  Business,
  LocationOn,
  Category,
  Source,
  Analytics,
  TrendingUp,
  TrendingDown,
  Assessment,
  ExpandMore,
  CrisisAlert,
  Share,
  Bookmark,
  BookmarkBorder
} from '@mui/icons-material';
import { eventsAPI } from '../services/api';
import { useToast } from './ToastNotifications';
import { LoadingSpinner } from './LoadingSpinner';

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const { error: showError, success, info } = useToast();

  useEffect(() => {
    loadEventDetails();
  }, [eventId]);

  const loadEventDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Loading event details for ID:', eventId);
      const response = await eventsAPI.getEventDetails(eventId);
      console.log('📡 API Response:', response);
      
      if (response.success) {
        console.log('✅ Event data received:', response.event);
        setEvent(response.event);
      } else {
        console.error('❌ API returned error:', response);
        setError('Failed to load event details');
        showError('Failed to load event details');
      }
    } catch (error) {
      console.error('❌ Error loading event details:', error);
      setError(error.message || 'Failed to load event details');
      showError(error.message || 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCrisisRoom = () => {
    // Navigate to crisis room creation or open crisis room modal
    info('Crisis room creation initiated');
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    success(bookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return <Warning color="error" />;
      case 'high': return <Warning color="warning" />;
      case 'medium': return <Timeline color="info" />;
      case 'low': return <Timeline color="success" />;
      default: return <Timeline />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'success';
      case 'negative': return 'error';
      case 'neutral': return 'info';
      default: return 'default';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">
          Event not found
        </Alert>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" gutterBottom>
            {event.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              icon={getSeverityIcon(event.severity)}
              label={event.severity} 
              color={getSeverityColor(event.severity)}
              size="medium"
            />
            <Chip 
              icon={<Category />}
              label={event.category}
              variant="outlined"
              size="small"
            />
            <Typography variant="body2" color="text.secondary">
              {new Date(event.eventDate).toLocaleDateString()} at {new Date(event.eventDate).toLocaleTimeString()}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}>
            <IconButton onClick={handleBookmark}>
              {bookmarked ? <Bookmark color="primary" /> : <BookmarkBorder />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Share">
            <IconButton>
              <Share />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          {/* Event Description */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Event Description
            </Typography>
            <Typography variant="body1" paragraph>
              {event.description}
            </Typography>
            {event.rationale && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Analysis & Rationale
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {event.rationale}
                </Typography>
              </>
            )}
          </Paper>

          {/* AI Analysis */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              AI-Powered Analysis
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Relevance Score
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={event.relevanceScore * 100} 
                        sx={{ flexGrow: 1 }}
                      />
                      <Typography variant="h6">
                        {Math.round(event.relevanceScore * 100)}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Impact Score
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={(event.analysis?.impactScore || 0.7) * 100} 
                        sx={{ flexGrow: 1 }}
                      />
                      <Typography variant="h6">
                        {Math.round((event.analysis?.impactScore || 0.7) * 100)}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          {/* Contributing Factors */}
          {event.contributingFactors && event.contributingFactors.length > 0 && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Contributing Factors
              </Typography>
              <Grid container spacing={2}>
                {event.contributingFactors.map((factor, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          {factor.factor}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={factor.weight * 100} 
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Weight: {Math.round(factor.weight * 100)}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}

          {/* Timeline */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Event Timeline
            </Typography>
            <List>
              {(event.analysis?.timeline || []).map((item, index) => (
                <ListItem key={index} sx={{ pl: 0 }}>
                  <ListItemIcon>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                      {index + 1}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.event}
                    secondary={new Date(item.date).toLocaleDateString()}
                  />
                  <Chip 
                    label={item.impact} 
                    size="small"
                    color={getSeverityColor(item.impact)}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Recommendations */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recommended Actions
            </Typography>
            <List>
              {(event.analysis?.recommendations || []).map((rec, index) => (
                <ListItem key={index} sx={{ pl: 0 }}>
                  <ListItemIcon>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: 'secondary.main' }}>
                      {index + 1}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText primary={rec} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Quick Actions */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                color="warning"
                startIcon={<CrisisAlert />}
                onClick={handleCreateCrisisRoom}
                fullWidth
              >
                Create Crisis Room
              </Button>
              <Button variant="outlined" fullWidth>
                Export Report
              </Button>
              <Button variant="outlined" fullWidth>
                Set Alert
              </Button>
            </Box>
          </Paper>

          {/* Event Details */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Event Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Regions Affected
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {event.regions?.map((region, index) => (
                    <Chip 
                      key={index} 
                      icon={<LocationOn />} 
                      label={region} 
                      size="small" 
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Source
                </Typography>
                <Link href={event.source?.url} target="_blank" variant="body2">
                  {event.source?.name}
                </Link>
                {event.source?.reliability && (
                  <Chip 
                    label={`Reliability: ${event.source.reliability}`} 
                    size="small" 
                    color="success"
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip 
                  label={event.status} 
                  color={event.status === 'developing' ? 'warning' : 'default'}
                  size="small"
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body2">
                  {new Date(event.lastUpdated).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Related Events */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Related Events
            </Typography>
            <List dense>
              {(event.analysis?.relatedEvents || []).map((relatedEvent) => (
                <ListItem key={relatedEvent.id} sx={{ pl: 0 }}>
                  <ListItemText
                    primary={relatedEvent.title}
                    secondary={`Relevance: ${Math.round(relatedEvent.relevance * 100)}%`}
                  />
                  <Button size="small" variant="text">
                    View
                  </Button>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 
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
  ListItemSecondaryAction,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Avatar,
  Link,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
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
  BookmarkBorder,
  Add,
  Edit,
  Delete
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
  const [customActions, setCustomActions] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAction, setEditingAction] = useState(null);
  const [actionFormData, setActionFormData] = useState({
    text: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    assignedTo: '',
    description: ''
  });
  const [actionErrors, setActionErrors] = useState({});
  const { error: showError, success, info } = useToast();

  useEffect(() => {
    loadEventDetails();
  }, [eventId]);

  // Load custom actions from localStorage
  useEffect(() => {
    if (event) {
      const savedActions = JSON.parse(localStorage.getItem('dashboard_action_steps') || '[]');
      // Only show actions that were created as custom actions (not recommended ones)
      const eventActions = savedActions.filter(action => 
        action.eventId === event.id && action.isCustomAction
      );
      setCustomActions(eventActions);
    }
  }, [event]);

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

  // Action Steps Functions
  const getRecommendedActions = (event) => {
    if (!event) return [];
    
    const baseActions = [
      {
        text: 'Assess immediate impact on operations',
        description: 'Evaluate how this event affects your current business operations and identify critical areas that need immediate attention.',
        priority: 'high'
      },
      {
        text: 'Review supply chain exposure',
        description: 'Analyze potential disruptions to your supply chain and identify alternative suppliers or contingency plans.',
        priority: 'medium'
      },
      {
        text: 'Update risk assessment',
        description: 'Incorporate this event into your overall risk assessment and update mitigation strategies accordingly.',
        priority: 'medium'
      }
    ];

    // Add category-specific actions
    if (event.categories?.includes('Supply Chain Risk')) {
      baseActions.push({
        text: 'Contact key suppliers for status update',
        description: 'Reach out to critical suppliers to understand their current status and any potential delays.',
        priority: 'high'
      });
    }

    if (event.categories?.includes('Cybersecurity Risk')) {
      baseActions.push({
        text: 'Review security protocols',
        description: 'Assess current cybersecurity measures and identify any vulnerabilities that this event may expose.',
        priority: 'high'
      });
    }

    if (event.categories?.includes('Regulatory Risk')) {
      baseActions.push({
        text: 'Review compliance requirements',
        description: 'Analyze how this event may affect your regulatory compliance and identify required updates.',
        priority: 'medium'
      });
    }

    return baseActions;
  };

  const handleAddRecommendedAction = (action) => {
    const newAction = {
      id: Date.now(),
      text: action.text || 'Action step',
      description: action.description || '',
      priority: action.priority || 'medium',
      status: 'pending', // Recommended actions start as pending
      eventId: event.id,
      eventTitle: event.title,
      isCustomAction: false, // Mark as recommended action
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to localStorage for dashboard (don't add to local custom actions state)
    const existingActions = JSON.parse(localStorage.getItem('dashboard_action_steps') || '[]');
    const updatedActions = [...existingActions, newAction];
    localStorage.setItem('dashboard_action_steps', JSON.stringify(updatedActions));

    success('Action added to your dashboard');
  };

  const handleAddCustomAction = () => {
    if (!validateActionForm()) return;

    const newAction = {
      id: Date.now(),
      text: actionFormData.text || 'Custom action',
      description: actionFormData.description || '',
      priority: actionFormData.priority || 'medium',
      status: actionFormData.status || 'pending',
      dueDate: actionFormData.dueDate || '',
      assignedTo: actionFormData.assignedTo || '',
      eventId: event.id,
      eventTitle: event.title,
      isCustomAction: true, // Mark as custom action
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCustomActions(prev => [...prev, newAction]);

    // Save to localStorage for dashboard
    const existingActions = JSON.parse(localStorage.getItem('dashboard_action_steps') || '[]');
    const updatedActions = [...existingActions, newAction];
    localStorage.setItem('dashboard_action_steps', JSON.stringify(updatedActions));

    resetActionForm();
    setShowAddDialog(false);
    success('Custom action added successfully');
  };

  const handleEditAction = (action) => {
    setEditingAction(action);
    setActionFormData({
      text: action.text,
      priority: action.priority,
      status: action.status,
      dueDate: action.dueDate || '',
      assignedTo: action.assignedTo || '',
      description: action.description || ''
    });
    setShowAddDialog(true);
  };

  const handleUpdateAction = () => {
    if (!validateActionForm()) return;

    const updatedActions = customActions.map(action =>
      action.id === editingAction.id
        ? { ...action, ...actionFormData, updatedAt: new Date().toISOString() }
        : action
    );

    setCustomActions(updatedActions);

    // Update in localStorage
    const existingActions = JSON.parse(localStorage.getItem('dashboard_action_steps') || '[]');
    const updatedDashboardActions = existingActions.map(action =>
      action.id === editingAction.id
        ? { ...action, ...actionFormData, updatedAt: new Date().toISOString() }
        : action
    );
    localStorage.setItem('dashboard_action_steps', JSON.stringify(updatedDashboardActions));

    resetActionForm();
    setShowAddDialog(false);
    setEditingAction(null);
    success('Action updated successfully');
  };

  const handleDeleteAction = (actionId) => {
    setCustomActions(prev => prev.filter(action => action.id !== actionId));

    // Remove from localStorage
    const existingActions = JSON.parse(localStorage.getItem('dashboard_action_steps') || '[]');
    const updatedActions = existingActions.filter(action => action.id !== actionId);
    localStorage.setItem('dashboard_action_steps', JSON.stringify(updatedActions));

    success('Action removed successfully');
  };

  const validateActionForm = () => {
    const newErrors = {};
    if (!actionFormData.text.trim()) {
      newErrors.text = 'Action description is required';
    }
    if (!actionFormData.priority) {
      newErrors.priority = 'Priority is required';
    }
    if (!actionFormData.status) {
      newErrors.status = 'Status is required';
    }
    setActionErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetActionForm = () => {
    setActionFormData({
      text: '',
      priority: 'medium',
      status: 'pending',
      dueDate: '',
      assignedTo: '',
      description: ''
    });
    setActionErrors({});
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'pending': return 'default';
      case 'on-hold': return 'info';
      default: return 'default';
    }
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

          {/* Action Steps */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Action Steps
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Recommended actions based on this event and any custom steps you've added.
            </Typography>
            
            {/* Recommended Actions */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Recommended Actions
              </Typography>
              <Grid container spacing={2}>
                {getRecommendedActions(event).map((action, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, flexGrow: 1 }}>
                          {action.text}
                        </Typography>
                        <Chip 
                          label={action.priority} 
                          size="small" 
                          color={getPriorityColor(action.priority)}
                          sx={{ fontSize: '0.7rem', ml: 1 }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                        {action.description}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleAddRecommendedAction(action)}
                        sx={{ fontSize: '0.7rem' }}
                      >
                        Add to Dashboard
                      </Button>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Custom Actions */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Your Custom Actions
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Add />}
                  onClick={() => setShowAddDialog(true)}
                >
                  Add Custom Action
                </Button>
              </Box>
              
              {customActions.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 3, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    No custom actions added yet
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Add specific actions to address this event's impact on your organization.
                  </Typography>
                </Box>
              ) : (
                <List dense>
                  {customActions.map((action) => (
                    <ListItem key={action.id} sx={{ pl: 0, border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                      <ListItemText
                                                 primary={
                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                             <Typography variant="body2" sx={{ fontWeight: 500, flexGrow: 1 }}>
                               {action.text}
                             </Typography>
                             <Chip
                               label={action.priority}
                               size="small"
                               color={getPriorityColor(action.priority)}
                               sx={{ fontSize: '0.7rem' }}
                             />
                           </Box>
                         }
                        secondary={
                          <Box>
                            {action.description && (
                              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                {action.description}
                              </Typography>
                            )}
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                              {action.dueDate && (
                                <Typography variant="caption" color="text.secondary">
                                  Due: {new Date(action.dueDate).toLocaleDateString()}
                                </Typography>
                              )}
                              {action.assignedTo && (
                                <Typography variant="caption" color="text.secondary">
                                  Assigned to: {action.assignedTo}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => handleEditAction(action)}
                          sx={{ mr: 1 }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => handleDeleteAction(action.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Paper>

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

      {/* Add/Edit Action Dialog */}
      <Dialog
        open={showAddDialog}
        onClose={() => {
          setShowAddDialog(false);
          setEditingAction(null);
          resetActionForm();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingAction ? 'Edit Action Step' : 'Add Custom Action Step'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Action Description"
                  value={actionFormData.text}
                  onChange={(e) => setActionFormData({ ...actionFormData, text: e.target.value })}
                  error={!!actionErrors.text}
                  helperText={actionErrors.text}
                  multiline
                  rows={3}
                  placeholder="Describe the specific action to be taken..."
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!actionErrors.priority}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={actionFormData.priority}
                    onChange={(e) => setActionFormData({ ...actionFormData, priority: e.target.value })}
                    label="Priority"
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="critical">Critical</MenuItem>
                  </Select>
                  {actionErrors.priority && <FormHelperText>{actionErrors.priority}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!actionErrors.status}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={actionFormData.status}
                    onChange={(e) => setActionFormData({ ...actionFormData, status: e.target.value })}
                    label="Status"
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="on-hold">On Hold</MenuItem>
                  </Select>
                  {actionErrors.status && <FormHelperText>{actionErrors.status}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Due Date"
                  type="date"
                  value={actionFormData.dueDate}
                  onChange={(e) => setActionFormData({ ...actionFormData, dueDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Assigned To"
                  value={actionFormData.assignedTo}
                  onChange={(e) => setActionFormData({ ...actionFormData, assignedTo: e.target.value })}
                  placeholder="Team member or department"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Details"
                  value={actionFormData.description}
                  onChange={(e) => setActionFormData({ ...actionFormData, description: e.target.value })}
                  multiline
                  rows={2}
                  placeholder="Any additional context or notes..."
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowAddDialog(false);
            setEditingAction(null);
            resetActionForm();
          }}>
            Cancel
          </Button>
          <Button 
            onClick={editingAction ? handleUpdateAction : handleAddCustomAction} 
            variant="contained"
          >
            {editingAction ? 'Update Action' : 'Add Action'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 
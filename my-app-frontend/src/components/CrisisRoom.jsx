import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
  Badge,
  Tabs,
  Tab,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Fab
} from '@mui/material';
import {
  Warning,
  Email,
  Phone,
  Message,
  Send,
  Add,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Error,
  Schedule,
  Person,
  Business,
  Notifications,
  Timeline as TimelineIcon,
  Analytics,
  Settings,
  ExpandMore,
  AttachFile,
  Reply,
  TrendingUp
} from '@mui/icons-material';
import { useToast } from './ToastNotifications';
import api from '../services/api';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`crisis-tabpanel-${index}`}
      aria-labelledby={`crisis-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function CrisisRoom({ crisisRoomId, onClose }) {
  const [crisisRoom, setCrisisRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [communicationDialog, setCommunicationDialog] = useState(false);
  const [stakeholderDialog, setStakeholderDialog] = useState(false);
  const [templateDialog, setTemplateDialog] = useState(false);
  const [escalationDialog, setEscalationDialog] = useState(false);
  const [resolveDialog, setResolveDialog] = useState(false);
  const [newCommunication, setNewCommunication] = useState({
    type: 'alert',
    channel: 'email',
    subject: '',
    content: '',
    recipients: []
  });
  const [newStakeholder, setNewStakeholder] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'manager',
    organization: '',
    notificationChannels: ['email'],
    escalationLevel: 1
  });
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    type: 'initial_alert',
    subject: '',
    content: ''
  });
  const [escalationData, setEscalationData] = useState({
    reason: '',
    escalatedTo: []
  });
  const [resolutionData, setResolutionData] = useState({
    notes: ''
  });

  const { success, error: showError } = useToast();

  // Fetch crisis room data
  useEffect(() => {
    if (crisisRoomId) {
      fetchCrisisRoom();
    }
  }, [crisisRoomId]);

  const fetchCrisisRoom = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/crisis-rooms/${crisisRoomId}`);
      setCrisisRoom(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching crisis room:', err);
      setError('Failed to load crisis room data');
      showError('Failed to load crisis room data');
    } finally {
      setLoading(false);
    }
  };

  // Send communication
  const sendCommunication = async () => {
    try {
      const response = await api.post(`/crisis-rooms/${crisisRoomId}/communications`, {
        ...newCommunication,
        sentBy: 'Current User' // This would come from auth context
      });
      
      success('Communication sent successfully');
      setCommunicationDialog(false);
      setNewCommunication({
        type: 'alert',
        channel: 'email',
        subject: '',
        content: '',
        recipients: []
      });
      fetchCrisisRoom(); // Refresh data
    } catch (err) {
      console.error('Error sending communication:', err);
      showError('Failed to send communication');
    }
  };

  // Add stakeholder
  const addStakeholder = async () => {
    try {
      const response = await api.post(`/crisis-rooms/${crisisRoomId}/stakeholders`, {
        stakeholders: [newStakeholder],
        addedBy: 'Current User'
      });
      
      success('Stakeholder added successfully');
      setStakeholderDialog(false);
      setNewStakeholder({
        name: '',
        email: '',
        phone: '',
        role: 'manager',
        organization: '',
        notificationChannels: ['email'],
        escalationLevel: 1
      });
      fetchCrisisRoom();
    } catch (err) {
      console.error('Error adding stakeholder:', err);
      showError('Failed to add stakeholder');
    }
  };

  // Add template
  const addTemplate = async () => {
    try {
      const response = await api.post(`/crisis-rooms/${crisisRoomId}/templates`, {
        ...newTemplate,
        createdBy: 'Current User'
      });
      
      success('Template added successfully');
      setTemplateDialog(false);
      setNewTemplate({
        name: '',
        type: 'initial_alert',
        subject: '',
        content: ''
      });
      fetchCrisisRoom();
    } catch (err) {
      console.error('Error adding template:', err);
      showError('Failed to add template');
    }
  };

  // Trigger escalation
  const triggerEscalation = async () => {
    try {
      const response = await api.post(`/crisis-rooms/${crisisRoomId}/escalations`, {
        ...escalationData,
        triggeredBy: 'Current User'
      });
      
      success('Escalation triggered successfully');
      setEscalationDialog(false);
      setEscalationData({ reason: '', escalatedTo: [] });
      fetchCrisisRoom();
    } catch (err) {
      console.error('Error triggering escalation:', err);
      showError('Failed to trigger escalation');
    }
  };

  // Resolve crisis room
  const resolveCrisisRoom = async () => {
    try {
      const response = await api.post(`/crisis-rooms/${crisisRoomId}/resolve`, {
        ...resolutionData,
        resolvedBy: 'Current User'
      });
      
      success('Crisis room resolved successfully');
      setResolveDialog(false);
      setResolutionData({ notes: '' });
      fetchCrisisRoom();
    } catch (err) {
      console.error('Error resolving crisis room:', err);
      showError('Failed to resolve crisis room');
    }
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'error';
      case 'escalated': return 'warning';
      case 'monitoring': return 'info';
      case 'resolved': return 'success';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!crisisRoom) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        Crisis room not found
      </Alert>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs>
            <Typography variant="h5" component="h1">
              {crisisRoom.crisisRoom.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {crisisRoom.crisisRoom.description}
            </Typography>
          </Grid>
          <Grid item>
            <Chip
              label={crisisRoom.crisisRoom.severity.toUpperCase()}
              color={getSeverityColor(crisisRoom.crisisRoom.severity)}
              icon={<Warning />}
              sx={{ mr: 1 }}
            />
            <Chip
              label={crisisRoom.crisisRoom.status.toUpperCase()}
              color={getStatusColor(crisisRoom.crisisRoom.status)}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="error"
              startIcon={<TrendingUp />}
              onClick={() => setEscalationDialog(true)}
              sx={{ mr: 1 }}
            >
              Escalate
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<Resolve />}
              onClick={() => setResolveDialog(true)}
            >
              Resolve
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Paper elevation={1} sx={{ flex: 1 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Overview" />
            <Tab label="Communications" />
            <Tab label="Stakeholders" />
            <Tab label="Timeline" />
            <Tab label="Analytics" />
          </Tabs>

          {/* Overview Tab */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              {/* Event Information */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Event Information
                    </Typography>
                    {crisisRoom.eventId && (
                      <>
                        <Typography variant="subtitle1">
                          {crisisRoom.eventId.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {crisisRoom.eventId.description}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Date:</strong> {new Date(crisisRoom.eventId.eventDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Categories:</strong> {crisisRoom.eventId.categories?.join(', ')}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Regions:</strong> {crisisRoom.eventId.regions?.join(', ')}
                        </Typography>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Quick Stats */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Quick Stats
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="h4" color="primary">
                          {crisisRoom.metrics.totalCommunications}
                        </Typography>
                        <Typography variant="body2">Total Communications</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h4" color="secondary">
                          {crisisRoom.metrics.responseRate.toFixed(1)}%
                        </Typography>
                        <Typography variant="body2">Response Rate</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h4" color="warning.main">
                          {crisisRoom.metrics.escalationCount}
                        </Typography>
                        <Typography variant="body2">Escalations</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h4" color="success.main">
                          {crisisRoom.stakeholders.length}
                        </Typography>
                        <Typography variant="body2">Stakeholders</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Recent Communications */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">
                        Recent Communications
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Send />}
                        onClick={() => setCommunicationDialog(true)}
                      >
                        Send Communication
                      </Button>
                    </Box>
                    <List>
                      {crisisRoom.communications.slice(0, 5).map((comm, index) => (
                        <ListItem key={index} divider>
                          <ListItemAvatar>
                            <Avatar>
                              {comm.channel === 'email' && <Email />}
                              {comm.channel === 'sms' && <Phone />}
                              {comm.channel === 'slack' && <Message />}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={comm.subject}
                            secondary={`${comm.channel} • ${new Date(comm.sentAt).toLocaleString()}`}
                          />
                          <Chip
                            label={comm.deliveryStatus}
                            color={comm.deliveryStatus === 'sent' ? 'success' : 'default'}
                            size="small"
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Communications Tab */}
          <TabPanel value={activeTab} index={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Communications ({crisisRoom.communications.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<Send />}
                onClick={() => setCommunicationDialog(true)}
              >
                Send Communication
              </Button>
            </Box>
            
            <List>
              {crisisRoom.communications.map((comm, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6">{comm.subject}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {comm.type} • {comm.channel} • {new Date(comm.sentAt).toLocaleString()}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          {comm.content}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Recipients: {comm.recipients.map(r => r.name).join(', ')}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={comm.deliveryStatus}
                        color={comm.deliveryStatus === 'sent' ? 'success' : 'default'}
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </List>
          </TabPanel>

          {/* Stakeholders Tab */}
          <TabPanel value={activeTab} index={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Stakeholders ({crisisRoom.stakeholders.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setStakeholderDialog(true)}
              >
                Add Stakeholder
              </Button>
            </Box>
            
            <Grid container spacing={2}>
              {crisisRoom.stakeholders.map((stakeholder, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="h6">{stakeholder.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {stakeholder.role} • {stakeholder.organization}
                          </Typography>
                          <Typography variant="body2">{stakeholder.email}</Typography>
                          {stakeholder.phone && (
                            <Typography variant="body2">{stakeholder.phone}</Typography>
                          )}
                        </Box>
                        <Box>
                          <Chip
                            label={`Level ${stakeholder.escalationLevel}`}
                            size="small"
                            sx={{ mb: 1 }}
                          />
                          <Box>
                            {stakeholder.notificationChannels.map(channel => (
                              <Chip
                                key={channel}
                                label={channel}
                                size="small"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Timeline Tab */}
          <TabPanel value={activeTab} index={3}>
            <Typography variant="h6" gutterBottom>
              Timeline
            </Typography>
            
            <Timeline>
              {crisisRoom.timeline.map((item, index) => (
                <TimelineItem key={index}>
                  <TimelineOppositeContent sx={{ m: 'auto 0' }} variant="body2" color="text.secondary">
                    {new Date(item.timestamp).toLocaleString()}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color="primary" />
                    {index < crisisRoom.timeline.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent sx={{ py: '12px', px: 2 }}>
                    <Typography variant="h6" component="span">
                      {item.event.replace(/_/g, ' ').toUpperCase()}
                    </Typography>
                    <Typography>{item.description}</Typography>
                    {item.actorName && (
                      <Typography variant="body2" color="text.secondary">
                        By: {item.actorName}
                      </Typography>
                    )}
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </TabPanel>

          {/* Analytics Tab */}
          <TabPanel value={activeTab} index={4}>
            <Typography variant="h6" gutterBottom>
              Analytics
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Communication Channels
                    </Typography>
                    {Object.entries(crisisRoom.metrics.communicationChannels || {}).map(([channel, stats]) => (
                      <Box key={channel} sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                          {channel}
                        </Typography>
                        <Typography variant="body2">
                          Total: {stats.total} | Success: {stats.successful} | Failed: {stats.failed}
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Stakeholder Engagement
                    </Typography>
                    {Object.entries(crisisRoom.metrics.stakeholderEngagement || {}).map(([name, stats]) => (
                      <Box key={name} sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">{name}</Typography>
                        <Typography variant="body2">
                          Communications: {stats.totalCommunications} | Responses: {stats.responses}
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>
      </Box>

      {/* Communication Dialog */}
      <Dialog open={communicationDialog} onClose={() => setCommunicationDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Send Communication</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={newCommunication.type}
                  onChange={(e) => setNewCommunication({...newCommunication, type: e.target.value})}
                >
                  <MenuItem value="alert">Alert</MenuItem>
                  <MenuItem value="update">Update</MenuItem>
                  <MenuItem value="escalation">Escalation</MenuItem>
                  <MenuItem value="resolution">Resolution</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Channel</InputLabel>
                <Select
                  value={newCommunication.channel}
                  onChange={(e) => setNewCommunication({...newCommunication, channel: e.target.value})}
                >
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="sms">SMS</MenuItem>
                  <MenuItem value="slack">Slack</MenuItem>
                  <MenuItem value="teams">Teams</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject"
                value={newCommunication.subject}
                onChange={(e) => setNewCommunication({...newCommunication, subject: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Content"
                value={newCommunication.content}
                onChange={(e) => setNewCommunication({...newCommunication, content: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommunicationDialog(false)}>Cancel</Button>
          <Button onClick={sendCommunication} variant="contained">Send</Button>
        </DialogActions>
      </Dialog>

      {/* Stakeholder Dialog */}
      <Dialog open={stakeholderDialog} onClose={() => setStakeholderDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Stakeholder</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                value={newStakeholder.name}
                onChange={(e) => setNewStakeholder({...newStakeholder, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newStakeholder.email}
                onChange={(e) => setNewStakeholder({...newStakeholder, email: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={newStakeholder.phone}
                onChange={(e) => setNewStakeholder({...newStakeholder, phone: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={newStakeholder.role}
                  onChange={(e) => setNewStakeholder({...newStakeholder, role: e.target.value})}
                >
                  <MenuItem value="executive">Executive</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="technical">Technical</MenuItem>
                  <MenuItem value="external">External</MenuItem>
                  <MenuItem value="regulatory">Regulatory</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Organization"
                value={newStakeholder.organization}
                onChange={(e) => setNewStakeholder({...newStakeholder, organization: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStakeholderDialog(false)}>Cancel</Button>
          <Button onClick={addStakeholder} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Escalation Dialog */}
      <Dialog open={escalationDialog} onClose={() => setEscalationDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Trigger Escalation</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason for Escalation"
            value={escalationData.reason}
            onChange={(e) => setEscalationData({...escalationData, reason: e.target.value})}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEscalationDialog(false)}>Cancel</Button>
          <Button onClick={triggerEscalation} variant="contained" color="warning">Escalate</Button>
        </DialogActions>
      </Dialog>

      {/* Resolve Dialog */}
      <Dialog open={resolveDialog} onClose={() => setResolveDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Resolve Crisis Room</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Resolution Notes"
            value={resolutionData.notes}
            onChange={(e) => setResolutionData({...resolutionData, notes: e.target.value})}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResolveDialog(false)}>Cancel</Button>
          <Button onClick={resolveCrisisRoom} variant="contained" color="success">Resolve</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 
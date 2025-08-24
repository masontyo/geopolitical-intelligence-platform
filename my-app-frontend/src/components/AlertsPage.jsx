import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Switch,
  FormControlLabel,
  Alert,
  Skeleton,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Notifications,
  NotificationsOff,
  Warning,
  Error,
  Info,
  CheckCircle,
  Schedule,
  Flag
} from '@mui/icons-material';
import { useToast } from './ToastNotifications';

export default function AlertsPage() {
  const { success, error: showError } = useToast();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [alertForm, setAlertForm] = useState({
    title: '',
    description: '',
    type: 'info',
    priority: 'medium',
    conditions: [],
    isActive: true,
    recipients: []
  });

  // Sample alerts data
  const sampleAlerts = [
    {
      id: 1,
      title: "High Risk Event Detection",
      description: "Alert when events with high severity are detected",
      type: "warning",
      priority: "high",
      conditions: ["severity:high", "relevanceScore:>0.8"],
      isActive: true,
      recipients: ["risk-team@company.com", "management@company.com"],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      lastTriggered: new Date(Date.now() - 6 * 60 * 60 * 1000),
      triggerCount: 3
    },
    {
      id: 2,
      title: "Supply Chain Disruption",
      description: "Monitor for supply chain related events",
      type: "error",
      priority: "high",
      conditions: ["category:Supply Chain Risk", "region:Asia Pacific"],
      isActive: true,
      recipients: ["supply-chain@company.com"],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      lastTriggered: new Date(Date.now() - 12 * 60 * 60 * 1000),
      triggerCount: 1
    },
    {
      id: 3,
      title: "Regulatory Updates",
      description: "Alert for new regulatory requirements",
      type: "info",
      priority: "medium",
      conditions: ["category:Regulatory Risk"],
      isActive: false,
      recipients: ["legal@company.com", "compliance@company.com"],
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      lastTriggered: null,
      triggerCount: 0
    }
  ];

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setAlerts(sampleAlerts);
      setLoading(false);
    }, 1000);
  }, []);

  const getTypeColor = (type) => {
    switch (type) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      case 'success': return 'success';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'error': return <Error color="error" />;
      case 'warning': return <Warning color="warning" />;
      case 'info': return <Info color="info" />;
      case 'success': return <CheckCircle color="success" />;
      default: return <Info />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const handleOpenDialog = (alert = null) => {
    if (alert) {
      setEditingAlert(alert);
      setAlertForm({
        title: alert.title,
        description: alert.description,
        type: alert.type,
        priority: alert.priority,
        conditions: alert.conditions,
        isActive: alert.isActive,
        recipients: alert.recipients
      });
    } else {
      setEditingAlert(null);
      setAlertForm({
        title: '',
        description: '',
        type: 'info',
        priority: 'medium',
        conditions: [],
        isActive: true,
        recipients: []
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAlert(null);
    setAlertForm({
      title: '',
      description: '',
      type: 'info',
      priority: 'medium',
      conditions: [],
      isActive: true,
      recipients: []
    });
  };

  const handleSubmit = () => {
    if (!alertForm.title.trim()) {
      showError('Alert title is required');
      return;
    }

    if (editingAlert) {
      // Update existing alert
      const updatedAlerts = alerts.map(alert =>
        alert.id === editingAlert.id
          ? { ...alert, ...alertForm, updatedAt: new Date().toISOString() }
          : alert
      );
      setAlerts(updatedAlerts);
      success('Alert updated successfully');
    } else {
      // Create new alert
      const newAlert = {
        id: Date.now(),
        ...alertForm,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastTriggered: null,
        triggerCount: 0
      };
      setAlerts([...alerts, newAlert]);
      success('Alert created successfully');
    }
    handleCloseDialog();
  };

  const handleDeleteAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
    success('Alert deleted successfully');
  };

  const handleToggleAlert = (alertId) => {
    const updatedAlerts = alerts.map(alert => {
      if (alert.id === alertId) {
        return { ...alert, isActive: !alert.isActive, updatedAt: new Date().toISOString() };
      }
      return alert;
    });
    setAlerts(updatedAlerts);
    success(`Alert ${updatedAlerts.find(a => a.id === alertId)?.isActive ? 'activated' : 'deactivated'} successfully`);
  };

  const activeAlerts = alerts.filter(alert => alert.isActive);
  const inactiveAlerts = alerts.filter(alert => !alert.isActive);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>Alerts</Typography>
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} md={6} key={i}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="60%" height={16} sx={{ mb: 2 }} />
                  <Skeleton variant="rectangular" width="100%" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Alerts
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure and manage risk alerts and notifications
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          New Alert
        </Button>
      </Box>

      {/* Alert Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {alerts.length}
              </Typography>
              <Typography variant="body2">Total Alerts</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {activeAlerts.length}
              </Typography>
              <Typography variant="body2">Active Alerts</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {alerts.reduce((sum, alert) => sum + alert.triggerCount, 0)}
              </Typography>
              <Typography variant="body2">Total Triggers</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label={`Active (${activeAlerts.length})`} />
          <Tab label={`Inactive (${inactiveAlerts.length})`} />
        </Tabs>
      </Box>

      {/* Alerts List */}
      <Grid container spacing={3}>
        {(activeTab === 0 ? activeAlerts : inactiveAlerts).map((alert) => (
          <Grid item xs={12} md={6} key={alert.id}>
            <Card>
              <CardContent>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getTypeIcon(alert.type)}
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {alert.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {alert.description}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={alert.isActive}
                          onChange={() => handleToggleAlert(alert.id)}
                          color="primary"
                        />
                      }
                      label=""
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(alert)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteAlert(alert.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>

                {/* Metadata */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip
                    label={alert.type}
                    size="small"
                    color={getTypeColor(alert.type)}
                  />
                  <Chip
                    label={alert.priority}
                    size="small"
                    color={getPriorityColor(alert.priority)}
                  />
                </Box>

                {/* Conditions */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Conditions:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {alert.conditions.map((condition, index) => (
                      <Chip
                        key={index}
                        label={condition}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>

                {/* Recipients */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Recipients:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {alert.recipients.map((recipient, index) => (
                      <Chip
                        key={index}
                        label={recipient}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                </Box>

                {/* Footer */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Created: {alert.createdAt.toLocaleDateString()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Triggers: {alert.triggerCount}
                    </Typography>
                    {alert.lastTriggered && (
                      <Typography variant="caption" color="text.secondary">
                        Last: {alert.lastTriggered.toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {(activeTab === 0 ? activeAlerts : inactiveAlerts).length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No {activeTab === 0 ? 'active' : 'inactive'} alerts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activeTab === 0 
              ? 'Create your first alert to start monitoring risks'
              : 'All alerts are currently active'
            }
          </Typography>
        </Box>
      )}

      {/* Add/Edit Alert Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingAlert ? 'Edit Alert' : 'Create New Alert'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Alert Title"
                  value={alertForm.title}
                  onChange={(e) => setAlertForm({ ...alertForm, title: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={alertForm.description}
                  onChange={(e) => setAlertForm({ ...alertForm, description: e.target.value })}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={alertForm.type}
                    onChange={(e) => setAlertForm({ ...alertForm, type: e.target.value })}
                    label="Type"
                  >
                    <MenuItem value="info">Info</MenuItem>
                    <MenuItem value="warning">Warning</MenuItem>
                    <MenuItem value="error">Error</MenuItem>
                    <MenuItem value="success">Success</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={alertForm.priority}
                    onChange={(e) => setAlertForm({ ...alertForm, priority: e.target.value })}
                    label="Priority"
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Conditions (comma-separated)"
                  value={alertForm.conditions.join(', ')}
                  onChange={(e) => setAlertForm({ 
                    ...alertForm, 
                    conditions: e.target.value.split(',').map(c => c.trim()).filter(c => c)
                  })}
                  placeholder="severity:high, category:Supply Chain Risk"
                  helperText="Enter alert conditions separated by commas"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Recipients (comma-separated)"
                  value={alertForm.recipients.join(', ')}
                  onChange={(e) => setAlertForm({ 
                    ...alertForm, 
                    recipients: e.target.value.split(',').map(r => r.trim()).filter(r => r)
                  })}
                  placeholder="email1@company.com, email2@company.com"
                  helperText="Enter email addresses separated by commas"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={alertForm.isActive}
                      onChange={(e) => setAlertForm({ ...alertForm, isActive: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Alert is active"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingAlert ? 'Update Alert' : 'Create Alert'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

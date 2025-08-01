import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Grid,
  Chip,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Button,
  Switch,
  FormControlLabel,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Divider,
  Badge,
  Tooltip
} from '@mui/material';
import { 
  Notifications,
  NotificationsActive,
  NotificationsOff,
  Warning,
  Error,
  Info,
  Settings,
  Add,
  Delete,
  Edit,
  CheckCircle,
  Schedule,
  Email,
  Sms
} from '@mui/icons-material';

export default function AlertSystem({ profile, events, analyticsData }) {
  const [alertRules, setAlertRules] = useState([
    {
      id: 1,
      name: 'High Risk Events',
      condition: 'risk_score > 0.7',
      threshold: 0.7,
      enabled: true,
      notifications: ['email', 'dashboard'],
      description: 'Alert when risk score exceeds 70%'
    },
    {
      id: 2,
      name: 'Critical Severity',
      condition: 'severity = critical',
      threshold: 'critical',
      enabled: true,
      notifications: ['email', 'sms', 'dashboard'],
      description: 'Immediate alert for critical severity events'
    },
    {
      id: 3,
      name: 'Geographic Risk',
      condition: 'region in profile_regions',
      threshold: 'profile_regions',
      enabled: true,
      notifications: ['email', 'dashboard'],
      description: 'Alert for events in your monitored regions'
    }
  ]);

  const [newRule, setNewRule] = useState({
    name: '',
    condition: '',
    threshold: '',
    enabled: true,
    notifications: ['dashboard'],
    description: ''
  });

  const [showAddRule, setShowAddRule] = useState(false);

  // Generate mock alert history
  const alertHistory = useMemo(() => {
    const history = [];
    const alertTypes = ['High Risk Event', 'Critical Severity', 'Geographic Risk', 'Supply Chain Disruption'];
    const severities = ['info', 'warning', 'error'];
    
    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 7));
      
      history.push({
        id: i + 1,
        type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        message: `Alert triggered for ${alertTypes[Math.floor(Math.random() * alertTypes.length)].toLowerCase()}`,
        timestamp: date,
        read: Math.random() > 0.3,
        eventId: Math.floor(Math.random() * events.length) + 1
      });
    }
    
    return history.sort((a, b) => b.timestamp - a.timestamp);
  }, [events]);

  const activeAlerts = alertHistory.filter(alert => !alert.read);
  const unreadCount = activeAlerts.length;

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error':
        return <Error color="error" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'info':
        return <Info color="info" />;
      default:
        return <Info color="info" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  const handleAddRule = () => {
    if (newRule.name && newRule.condition) {
      const rule = {
        ...newRule,
        id: Date.now(),
        enabled: true
      };
      setAlertRules([...alertRules, rule]);
      setNewRule({
        name: '',
        condition: '',
        threshold: '',
        enabled: true,
        notifications: ['dashboard'],
        description: ''
      });
      setShowAddRule(false);
    }
  };

  const handleDeleteRule = (ruleId) => {
    setAlertRules(alertRules.filter(rule => rule.id !== ruleId));
  };

  const handleToggleRule = (ruleId) => {
    setAlertRules(alertRules.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const handleMarkAsRead = (alertId) => {
    // In a real app, this would update the backend
    console.log('Marking alert as read:', alertId);
  };

  return (
    <Grid container spacing={3}>
      {/* Alert Overview */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader 
            title="Alert Overview" 
            action={
              <Badge badgeContent={unreadCount} color="error">
                <Notifications color="action" />
              </Badge>
            }
          />
          <CardContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                {unreadCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unread Alerts
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Active Rules</Typography>
                <Chip label={alertRules.filter(r => r.enabled).length} size="small" color="primary" />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Total Rules</Typography>
                <Chip label={alertRules.length} size="small" variant="outlined" />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Today's Alerts</Typography>
                <Chip 
                  label={alertHistory.filter(a => 
                    a.timestamp.toDateString() === new Date().toDateString()
                  ).length} 
                  size="small" 
                  color="warning" 
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Alerts */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardHeader 
            title="Recent Alerts" 
            action={
              <Button 
                size="small" 
                startIcon={<CheckCircle />}
                onClick={() => console.log('Mark all as read')}
              >
                Mark All Read
              </Button>
            }
          />
          <CardContent>
            {alertHistory.length === 0 ? (
              <Alert severity="success">
                No alerts in the last 7 days. Your risk environment is stable.
              </Alert>
            ) : (
              <List>
                {alertHistory.slice(0, 5).map((alert) => (
                  <ListItem key={alert.id} sx={{ px: 0 }}>
                    <ListItemIcon>
                      {getSeverityIcon(alert.severity)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {alert.type}
                          </Typography>
                          <Chip 
                            label={alert.severity}
                            size="small"
                            color={getSeverityColor(alert.severity)}
                            variant="outlined"
                          />
                          {!alert.read && (
                            <Chip 
                              label="New"
                              size="small"
                              color="error"
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {alert.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {alert.timestamp.toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                    <IconButton 
                      size="small"
                      onClick={() => handleMarkAsRead(alert.id)}
                    >
                      <CheckCircle color={alert.read ? 'disabled' : 'primary'} />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Alert Rules */}
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title="Alert Rules" 
            subheader="Configure custom alert conditions"
            action={
              <Button 
                variant="contained" 
                startIcon={<Add />}
                onClick={() => setShowAddRule(true)}
              >
                Add Rule
              </Button>
            }
          />
          <CardContent>
            <Grid container spacing={2}>
              {alertRules.map((rule) => (
                <Grid item xs={12} sm={6} md={4} key={rule.id}>
                  <Paper elevation={1} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {rule.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={rule.enabled}
                              onChange={() => handleToggleRule(rule.id)}
                              size="small"
                            />
                          }
                          label=""
                        />
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteRule(rule.id)}
                          color="error"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {rule.description}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Condition: {rule.condition}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {rule.notifications.map((notification, index) => (
                        <Chip 
                          key={index}
                          label={notification}
                          size="small"
                          icon={notification === 'email' ? <Email /> : notification === 'sms' ? <Sms /> : <Notifications />}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Add New Rule Form */}
            {showAddRule && (
              <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Add New Alert Rule
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Rule Name"
                      value={newRule.name}
                      onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Condition Type</InputLabel>
                      <Select
                        value={newRule.condition}
                        onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                        label="Condition Type"
                      >
                        <MenuItem value="risk_score > threshold">Risk Score Above Threshold</MenuItem>
                        <MenuItem value="severity = critical">Critical Severity</MenuItem>
                        <MenuItem value="region in profile_regions">Geographic Match</MenuItem>
                        <MenuItem value="category in business_units">Business Unit Match</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Threshold"
                      value={newRule.threshold}
                      onChange={(e) => setNewRule({ ...newRule, threshold: e.target.value })}
                      size="small"
                      placeholder="0.7 or 'critical'"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Notifications</InputLabel>
                      <Select
                        multiple
                        value={newRule.notifications}
                        onChange={(e) => setNewRule({ ...newRule, notifications: e.target.value })}
                        label="Notifications"
                      >
                        <MenuItem value="dashboard">Dashboard</MenuItem>
                        <MenuItem value="email">Email</MenuItem>
                        <MenuItem value="sms">SMS</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={newRule.description}
                      onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                      size="small"
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button 
                        variant="contained" 
                        onClick={handleAddRule}
                        disabled={!newRule.name || !newRule.condition}
                      >
                        Add Rule
                      </Button>
                      <Button 
                        variant="outlined" 
                        onClick={() => setShowAddRule(false)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Notification Settings */}
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title="Notification Settings" 
            subheader="Configure how you receive alerts"
          />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Email color="primary" />
                    <Typography variant="subtitle2">Email Notifications</Typography>
                  </Box>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Enable email alerts"
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Receive alerts at: {profile?.notificationPreferences?.email || 'your email'}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Sms color="primary" />
                    <Typography variant="subtitle2">SMS Notifications</Typography>
                  </Box>
                  <FormControlLabel
                    control={<Switch />}
                    label="Enable SMS alerts"
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Only for critical alerts
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Notifications color="primary" />
                    <Typography variant="subtitle2">Dashboard Notifications</Typography>
                  </Box>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Enable dashboard alerts"
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Real-time notifications in dashboard
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
} 
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  Alert
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Flag,
  Assignment,
  CheckBox,
  TrendingUp,
  Security,
  Business
} from "@mui/icons-material";

// Action step templates based on common risk management scenarios
const ACTION_TEMPLATES = [
  {
    id: 'supply-chain',
    title: 'Supply Chain Risk',
    description: 'Common actions for supply chain disruptions',
    actions: [
      'Contact key suppliers to assess impact',
      'Review inventory levels and safety stock',
      'Identify alternative suppliers',
      'Update supply chain risk assessment',
      'Communicate with stakeholders'
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Risk',
    description: 'Essential security actions',
    actions: [
      'Conduct security audit',
      'Update security policies',
      'Train staff on security protocols',
      'Review access controls',
      'Test incident response plan'
    ]
  },
  {
    id: 'compliance',
    title: 'Compliance & Regulatory',
    description: 'Regulatory compliance actions',
    actions: [
      'Review current compliance status',
      'Update compliance procedures',
      'Schedule compliance training',
      'Conduct internal audit',
      'Prepare compliance report'
    ]
  },
  {
    id: 'geopolitical',
    title: 'Geopolitical Risk',
    description: 'Geopolitical risk management',
    actions: [
      'Monitor political developments',
      'Assess regional exposure',
      'Update travel policies',
      'Review local partnerships',
      'Develop contingency plans'
    ]
  }
];

// Priority levels
const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'default' },
  { value: 'medium', label: 'Medium', color: 'warning' },
  { value: 'high', label: 'High', color: 'error' },
  { value: 'critical', label: 'Critical', color: 'error' }
];

// Status options
const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'default' },
  { value: 'in-progress', label: 'In Progress', color: 'warning' },
  { value: 'completed', label: 'Completed', color: 'success' },
  { value: 'on-hold', label: 'On Hold', color: 'info' }
];

export default function ActionSteps({ data = [], onSubmit, onError }) {
  const [actionSteps, setActionSteps] = useState(data);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);
  const [editingAction, setEditingAction] = useState(null);
  const [formData, setFormData] = useState({
    text: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    assignedTo: '',
    description: '',
    category: ''
  });
  const [errors, setErrors] = useState({});

  // Load saved action steps from localStorage
  useEffect(() => {
    const savedActions = localStorage.getItem('onboarding_action_steps');
    if (savedActions) {
      try {
        const parsed = JSON.parse(savedActions);
        setActionSteps(parsed);
      } catch (err) {
        console.error('Error loading saved action steps:', err);
      }
    }
  }, []);

  // Save action steps to localStorage
  useEffect(() => {
    localStorage.setItem('onboarding_action_steps', JSON.stringify(actionSteps));
  }, [actionSteps]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.text.trim()) {
      newErrors.text = 'Action description is required';
    }
    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAction = () => {
    if (!validateForm()) return;

    const newAction = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setActionSteps([...actionSteps, newAction]);
    resetForm();
    setShowAddDialog(false);
  };

  const handleEditAction = () => {
    if (!validateForm()) return;

    const updatedActions = actionSteps.map(action =>
      action.id === editingAction.id
        ? { ...action, ...formData, updatedAt: new Date().toISOString() }
        : action
    );

    setActionSteps(updatedActions);
    resetForm();
    setShowEditDialog(false);
    setEditingAction(null);
  };

  const handleDeleteAction = (actionId) => {
    setActionSteps(actionSteps.filter(action => action.id !== actionId));
  };

  const handleEditClick = (action) => {
    setEditingAction(action);
    setFormData({
      text: action.text,
      priority: action.priority,
      status: action.status,
      dueDate: action.dueDate || '',
      assignedTo: action.assignedTo || '',
      description: action.description || '',
      category: action.category || ''
    });
    setShowEditDialog(true);
  };

  const handleTemplateSelect = (template) => {
    const newActions = template.actions.map((actionText, index) => ({
      id: Date.now() + index,
      text: actionText,
      priority: 'medium',
      status: 'pending',
      category: template.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    setActionSteps([...actionSteps, ...newActions]);
    setShowTemplatesDialog(false);
  };

  const resetForm = () => {
    setFormData({
      text: '',
      priority: 'medium',
      status: 'pending',
      dueDate: '',
      assignedTo: '',
      description: '',
      category: ''
    });
    setErrors({});
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(actionSteps);
    }
  };

  const getPriorityColor = (priority) => {
    const priorityObj = PRIORITIES.find(p => p.value === priority);
    return priorityObj ? priorityObj.color : 'default';
  };

  const getStatusColor = (status) => {
    const statusObj = STATUS_OPTIONS.find(s => s.value === status);
    return statusObj ? statusObj.color : 'default';
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Action Steps & Risk Mitigation
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Define specific actions to address identified risks and improve your risk management posture.
        </Typography>
      </Box>

      {/* Action Steps Summary */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.50' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Action Steps Summary
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Add />}
              onClick={() => setShowAddDialog(true)}
            >
              Add Action
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Assignment />}
              onClick={() => setShowTemplatesDialog(true)}
            >
              Use Templates
            </Button>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                {actionSteps.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Actions
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
                {actionSteps.filter(a => a.status === 'pending').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main" sx={{ fontWeight: 700 }}>
                {actionSteps.filter(a => a.status === 'in-progress').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In Progress
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                {actionSteps.filter(a => a.status === 'completed').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Action Steps List */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Your Action Steps
        </Typography>

        {actionSteps.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Assignment sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              No action steps defined yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add specific actions to address your identified risks and improve your risk management strategy.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowAddDialog(true)}
            >
              Add Your First Action
            </Button>
          </Box>
        ) : (
          <List>
            {actionSteps.map((action) => (
              <ListItem
                key={action.id}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                  bgcolor: 'background.paper'
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500, flexGrow: 1 }}>
                        {action.text}
                      </Typography>
                      <Chip
                        label={action.status}
                        size="small"
                        color={getStatusColor(action.status)}
                        sx={{ fontSize: '0.7rem' }}
                      />
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
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {action.description}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {action.category && (
                          <Chip
                            label={action.category}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.6rem' }}
                          />
                        )}
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
                    onClick={() => handleEditClick(action)}
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
      </Paper>

      {/* Submit Section */}
      <Paper sx={{ p: 3, bgcolor: 'success.50' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.dark' }}>
              Ready to Complete Setup?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {actionSteps.length > 0 
                ? `You've defined ${actionSteps.length} action steps. Click continue to complete your setup.`
                : 'You can add action steps now or continue without them. You can always add them later from your dashboard.'
              }
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => onSubmit([])}
              sx={{ minWidth: 120 }}
            >
              Skip for Now
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              sx={{ minWidth: 120 }}
            >
              Complete Setup
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Add Action Dialog */}
      <Dialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Action Step</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Action Description"
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  error={!!errors.text}
                  helperText={errors.text}
                  multiline
                  rows={3}
                  placeholder="Describe the specific action to be taken..."
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.priority}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    label="Priority"
                  >
                    {PRIORITIES.map((priority) => (
                      <MenuItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.priority && <FormHelperText>{errors.priority}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.status}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    label="Status"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Due Date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Assigned To"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  placeholder="Team member or department"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Details"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  multiline
                  rows={2}
                  placeholder="Any additional context or notes..."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Supply Chain, Cybersecurity, Compliance"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
          <Button onClick={handleAddAction} variant="contained">Add Action</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Action Dialog */}
      <Dialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Action Step</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Action Description"
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  error={!!errors.text}
                  helperText={errors.text}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.priority}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    label="Priority"
                  >
                    {PRIORITIES.map((priority) => (
                      <MenuItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.priority && <FormHelperText>{errors.priority}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.status}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    label="Status"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Due Date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Assigned To"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Details"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditAction} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Templates Dialog */}
      <Dialog
        open={showTemplatesDialog}
        onClose={() => setShowTemplatesDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Use Action Templates</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Choose from pre-defined action templates based on common risk scenarios:
          </Typography>
          <Grid container spacing={2}>
            {ACTION_TEMPLATES.map((template) => (
              <Grid item xs={12} sm={6} key={template.id}>
                <Paper
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: 'divider',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'primary.50'
                    }
                  }}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    {template.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {template.description}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {template.actions.slice(0, 3).map((action, index) => (
                      <Typography key={index} variant="caption" color="text.secondary">
                        • {action}
                      </Typography>
                    ))}
                    {template.actions.length > 3 && (
                      <Typography variant="caption" color="primary">
                        +{template.actions.length - 3} more actions
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTemplatesDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

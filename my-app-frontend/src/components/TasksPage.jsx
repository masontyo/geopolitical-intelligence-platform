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
  Checkbox,
  LinearProgress,
  Alert,
  Skeleton,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ToggleButton,
  ToggleButtonGroup,
  Fab,
  Tooltip
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  CheckCircle,
  Schedule,
  Assignment,
  Flag,
  Warning,
  Error,
  CheckCircleOutline,
  Security,
  Business,
  Timeline,
  ListAlt,
  TaskAlt,
  ExpandMore
} from '@mui/icons-material';
import { useToast } from './ToastNotifications';

export default function TasksPage() {
  const { success, error: showError } = useToast();
  const [viewMode, setViewMode] = useState('tasks'); // 'tasks' or 'checklists'
  const [tasks, setTasks] = useState([]);
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    assignedTo: '',
    category: 'general'
  });
  const [checklistForm, setChecklistForm] = useState({
    title: '',
    description: '',
    category: 'general',
    items: []
  });

  // Sample tasks data
  const sampleTasks = [
    {
      id: 1,
      title: "Review supply chain risk assessment",
      description: "Analyze current supplier vulnerabilities and update risk matrix",
      priority: "high",
      status: "in-progress",
      dueDate: "2024-01-15",
      assignedTo: "Risk Team",
      category: "Supply Chain",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      title: "Update cybersecurity protocols",
      description: "Implement new security measures based on recent threat analysis",
      priority: "high",
      status: "pending",
      dueDate: "2024-01-20",
      assignedTo: "IT Security",
      category: "Cybersecurity",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: 3,
      title: "Conduct regulatory compliance audit",
      description: "Review current compliance status and identify gaps",
      priority: "medium",
      status: "completed",
      dueDate: "2024-01-10",
      assignedTo: "Legal Team",
      category: "Compliance",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }
  ];

  // Sample checklists data
  const sampleChecklists = [
    {
      id: 1,
      title: "Supply Chain Risk Assessment",
      description: "Comprehensive checklist for evaluating supply chain vulnerabilities",
      category: "Supply Chain",
      items: [
        { id: 1, text: "Identify critical suppliers", completed: true, priority: "high" },
        { id: 2, text: "Assess geographic concentration risks", completed: true, priority: "high" },
        { id: 3, text: "Review supplier financial health", completed: false, priority: "medium" },
        { id: 4, text: "Evaluate alternative sourcing options", completed: false, priority: "medium" },
        { id: 5, text: "Update supplier contracts", completed: false, priority: "low" }
      ],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      title: "Cybersecurity Compliance",
      description: "Security checklist for regulatory compliance",
      category: "Cybersecurity",
      items: [
        { id: 6, text: "Conduct security audit", completed: true, priority: "high" },
        { id: 7, text: "Update access controls", completed: false, priority: "high" },
        { id: 8, text: "Review incident response plan", completed: false, priority: "medium" },
        { id: 9, text: "Train staff on security protocols", completed: false, priority: "medium" }
      ],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ];

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setTasks(sampleTasks);
      setChecklists(sampleChecklists);
      setLoading(false);
    }, 1000);
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle color="success" />;
      case 'in-progress': return <Schedule color="warning" />;
      case 'pending': return <Assignment color="default" />;
      case 'on-hold': return <Flag color="info" />;
      default: return <Assignment />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Supply Chain': return <Business />;
      case 'Cybersecurity': return <Security />;
      case 'Compliance': return <Assignment />;
      default: return <Timeline />;
    }
  };

  const calculateProgress = (items) => {
    if (items.length === 0) return 0;
    const completed = items.filter(item => item.completed).length;
    return (completed / items.length) * 100;
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleOpenDialog = (item = null) => {
    if (viewMode === 'tasks') {
      if (item) {
        setEditingItem(item);
        setTaskForm({
          title: item.title,
          description: item.description,
          priority: item.priority,
          status: item.status,
          dueDate: item.dueDate,
          assignedTo: item.assignedTo,
          category: item.category
        });
      } else {
        setEditingItem(null);
        setTaskForm({
          title: '',
          description: '',
          priority: 'medium',
          status: 'pending',
          dueDate: '',
          assignedTo: '',
          category: 'general'
        });
      }
    } else {
      if (item) {
        setEditingItem(item);
        setChecklistForm({
          title: item.title,
          description: item.description,
          category: item.category,
          items: item.items
        });
      } else {
        setEditingItem(null);
        setChecklistForm({
          title: '',
          description: '',
          category: 'general',
          items: []
        });
      }
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setTaskForm({
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      dueDate: '',
      assignedTo: '',
      category: 'general'
    });
    setChecklistForm({
      title: '',
      description: '',
      category: 'general',
      items: []
    });
  };

  const handleSubmit = () => {
    if (viewMode === 'tasks') {
      if (!taskForm.title.trim()) {
        showError('Task title is required');
        return;
      }

      if (editingItem) {
        const updatedTasks = tasks.map(task =>
          task.id === editingItem.id
            ? { ...task, ...taskForm, updatedAt: new Date().toISOString() }
            : task
        );
        setTasks(updatedTasks);
        success('Task updated successfully');
      } else {
        const newTask = {
          id: Date.now(),
          ...taskForm,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setTasks([...tasks, newTask]);
        success('Task created successfully');
      }
    } else {
      if (!checklistForm.title.trim()) {
        showError('Checklist title is required');
        return;
      }

      if (editingItem) {
        const updatedChecklists = checklists.map(checklist =>
          checklist.id === editingItem.id
            ? { ...checklist, ...checklistForm, updatedAt: new Date().toISOString() }
            : checklist
        );
        setChecklists(updatedChecklists);
        success('Checklist updated successfully');
      } else {
        const newChecklist = {
          id: Date.now(),
          ...checklistForm,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setChecklists([...checklists, newChecklist]);
        success('Checklist created successfully');
      }
    }
    handleCloseDialog();
  };

  const handleDeleteItem = (itemId) => {
    if (viewMode === 'tasks') {
      setTasks(tasks.filter(task => task.id !== itemId));
      success('Task deleted successfully');
    } else {
      setChecklists(checklists.filter(checklist => checklist.id !== itemId));
      success('Checklist deleted successfully');
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
        : task
    );
    setTasks(updatedTasks);
    success(`Task status updated to ${newStatus}`);
  };

  const handleToggleChecklistItem = (checklistId, itemId) => {
    const updatedChecklists = checklists.map(checklist => {
      if (checklist.id === checklistId) {
        const updatedItems = checklist.items.map(item => {
          if (item.id === itemId) {
            return { ...item, completed: !item.completed };
          }
          return item;
        });
        return { ...checklist, items: updatedItems, updatedAt: new Date().toISOString() };
      }
      return checklist;
    });
    setChecklists(updatedChecklists);
  };

  const handleAddChecklistItem = (checklistId) => {
    const newItem = {
      id: Date.now(),
      text: 'New checklist item',
      completed: false,
      priority: 'medium'
    };

    const updatedChecklists = checklists.map(checklist => {
      if (checklist.id === checklistId) {
        return {
          ...checklist,
          items: [...checklist.items, newItem],
          updatedAt: new Date().toISOString()
        };
      }
      return checklist;
    });
    setChecklists(updatedChecklists);
  };

  const handleDeleteChecklistItem = (checklistId, itemId) => {
    const updatedChecklists = checklists.map(checklist => {
      if (checklist.id === checklistId) {
        return {
          ...checklist,
          items: checklist.items.filter(item => item.id !== itemId),
          updatedAt: new Date().toISOString()
        };
      }
      return checklist;
    });
    setChecklists(updatedChecklists);
  };

  // Filter tasks by status
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>Tasks & Checklists</Typography>
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
            Tasks & Checklists
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track risk mitigation tasks and assessment checklists
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          New {viewMode === 'tasks' ? 'Task' : 'Checklist'}
        </Button>
      </Box>

      {/* View Mode Toggle */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          aria-label="view mode"
          size="large"
        >
          <ToggleButton value="tasks" aria-label="tasks view">
            <TaskAlt sx={{ mr: 1 }} />
            Tasks
          </ToggleButton>
          <ToggleButton value="checklists" aria-label="checklists view">
            <ListAlt sx={{ mr: 1 }} />
            Checklists
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {viewMode === 'tasks' ? (
        // TASKS VIEW
        <>
          {/* Task Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                <CardContent>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {pendingTasks.length}
                  </Typography>
                  <Typography variant="body2">Pending Tasks</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
                <CardContent>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {inProgressTasks.length}
                  </Typography>
                  <Typography variant="body2">In Progress</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
                <CardContent>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {completedTasks.length}
                  </Typography>
                  <Typography variant="body2">Completed</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Tasks by Status */}
          <Grid container spacing={3}>
            {/* Pending Tasks */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'warning.main' }}>
                    Pending ({pendingTasks.length})
                  </Typography>
                  <List dense>
                    {pendingTasks.map((task) => (
                      <ListItem key={task.id} sx={{ px: 0 }}>
                        <ListItemText
                          primary={task.title}
                          secondary={
                            <Box>
                              <Typography variant="caption" color="text.secondary" display="block">
                                {task.description}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Chip
                                  label={task.priority}
                                  size="small"
                                  color={getPriorityColor(task.priority)}
                                />
                                <Chip
                                  label={task.category}
                                  size="small"
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            size="small"
                            onClick={() => handleStatusChange(task.id, 'in-progress')}
                            color="warning"
                          >
                            <Schedule />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(task)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteItem(task.id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* In Progress Tasks */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'info.main' }}>
                    In Progress ({inProgressTasks.length})
                  </Typography>
                  <List dense>
                    {inProgressTasks.map((task) => (
                      <ListItem key={task.id} sx={{ px: 0 }}>
                        <ListItemText
                          primary={task.title}
                          secondary={
                            <Box>
                              <Typography variant="caption" color="text.secondary" display="block">
                                {task.description}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Chip
                                  label={task.priority}
                                  size="small"
                                  color={getPriorityColor(task.priority)}
                                />
                                <Chip
                                  label={task.category}
                                  size="small"
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            size="small"
                            onClick={() => handleStatusChange(task.id, 'completed')}
                            color="success"
                          >
                            <CheckCircle />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(task)}
                          >
                            <Edit />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Completed Tasks */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'success.main' }}>
                    Completed ({completedTasks.length})
                  </Typography>
                  <List dense>
                    {completedTasks.map((task) => (
                      <ListItem key={task.id} sx={{ px: 0 }}>
                        <ListItemText
                          primary={task.title}
                          secondary={
                            <Box>
                              <Typography variant="caption" color="text.secondary" display="block">
                                {task.description}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Chip
                                  label={task.priority}
                                  size="small"
                                  color={getPriorityColor(task.priority)}
                                />
                                <Chip
                                  label={task.category}
                                  size="small"
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            size="small"
                            onClick={() => handleStatusChange(task.id, 'pending')}
                            color="default"
                          >
                            <Assignment />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      ) : (
        // CHECKLISTS VIEW
        <Grid container spacing={3}>
          {checklists.map((checklist) => (
            <Grid item xs={12} md={6} key={checklist.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getCategoryIcon(checklist.category)}
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {checklist.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {checklist.description}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(checklist)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteItem(checklist.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Category and Progress */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Chip
                      label={checklist.category}
                      size="small"
                      variant="outlined"
                      icon={getCategoryIcon(checklist.category)}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {Math.round(calculateProgress(checklist.items))}% Complete
                    </Typography>
                  </Box>

                  {/* Progress Bar */}
                  <LinearProgress
                    variant="determinate"
                    value={calculateProgress(checklist.items)}
                    sx={{ mb: 2, height: 8, borderRadius: 4 }}
                  />

                  {/* Checklist Items */}
                  <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Items ({checklist.items.length})
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0 }}>
                      <List dense>
                        {checklist.items.map((item) => (
                          <ListItem key={item.id} sx={{ px: 0 }}>
                            <Checkbox
                              checked={item.completed}
                              onChange={() => handleToggleChecklistItem(checklist.id, item.id)}
                              color="primary"
                              size="small"
                            />
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body2"
                                  sx={{
                                    textDecoration: item.completed ? 'line-through' : 'none',
                                    color: item.completed ? 'text.secondary' : 'text.primary'
                                  }}
                                >
                                  {item.text}
                                </Typography>
                              }
                              secondary={
                                <Chip
                                  label={item.priority}
                                  size="small"
                                  color={getPriorityColor(item.priority)}
                                  sx={{ mt: 0.5 }}
                                />
                              }
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteChecklistItem(checklist.id, item.id)}
                                color="error"
                              >
                                <Delete />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                      <Button
                        size="small"
                        startIcon={<Add />}
                        onClick={() => handleAddChecklistItem(checklist.id)}
                        sx={{ mt: 1 }}
                      >
                        Add Item
                      </Button>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth={viewMode === 'tasks' ? 'sm' : 'md'} fullWidth>
        <DialogTitle>
          {editingItem ? `Edit ${viewMode === 'tasks' ? 'Task' : 'Checklist'}` : `Create New ${viewMode === 'tasks' ? 'Task' : 'Checklist'}`}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={`${viewMode === 'tasks' ? 'Task' : 'Checklist'} Title`}
                  value={viewMode === 'tasks' ? taskForm.title : checklistForm.title}
                  onChange={(e) => {
                    if (viewMode === 'tasks') {
                      setTaskForm({ ...taskForm, title: e.target.value });
                    } else {
                      setChecklistForm({ ...checklistForm, title: e.target.value });
                    }
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={viewMode === 'tasks' ? taskForm.description : checklistForm.description}
                  onChange={(e) => {
                    if (viewMode === 'tasks') {
                      setTaskForm({ ...taskForm, description: e.target.value });
                    } else {
                      setChecklistForm({ ...checklistForm, description: e.target.value });
                    }
                  }}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={viewMode === 'tasks' ? taskForm.category : checklistForm.category}
                    onChange={(e) => {
                      if (viewMode === 'tasks') {
                        setTaskForm({ ...taskForm, category: e.target.value });
                      } else {
                        setChecklistForm({ ...checklistForm, category: e.target.value });
                      }
                    }}
                    label="Category"
                  >
                    <MenuItem value="general">General</MenuItem>
                    <MenuItem value="Supply Chain">Supply Chain</MenuItem>
                    <MenuItem value="Cybersecurity">Cybersecurity</MenuItem>
                    <MenuItem value="Compliance">Compliance</MenuItem>
                    <MenuItem value="Market Risk">Market Risk</MenuItem>
                    <MenuItem value="Environmental">Environmental</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Task-specific fields */}
              {viewMode === 'tasks' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Priority</InputLabel>
                      <Select
                        value={taskForm.priority}
                        onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                        label="Priority"
                      >
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={taskForm.status}
                        onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                        label="Status"
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="in-progress">In Progress</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="on-hold">On Hold</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Due Date"
                      type="date"
                      value={taskForm.dueDate}
                      onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Assigned To"
                      value={taskForm.assignedTo}
                      onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                      placeholder="Team or person"
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingItem ? `Update ${viewMode === 'tasks' ? 'Task' : 'Checklist'}` : `Create ${viewMode === 'tasks' ? 'Task' : 'Checklist'}`}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

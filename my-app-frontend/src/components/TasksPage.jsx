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
  ExpandMore,
  TaskAlt,
  ListAlt
} from '@mui/icons-material';
import { useToast } from './ToastNotifications';

export default function TasksPage() {
  const { success, error: showError } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [openChecklistDialog, setOpenChecklistDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingChecklistItem, setEditingChecklistItem] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
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
    text: '',
    priority: 'medium',
    description: ''
  });

  // Sample tasks with integrated checklist items
  const sampleTasks = [
    {
      id: 1,
      title: "Complete Supply Chain Risk Assessment",
      description: "Comprehensive evaluation of supply chain vulnerabilities and risk mitigation strategies",
      priority: "high",
      status: "in-progress",
      dueDate: "2024-01-15",
      assignedTo: "Risk Team",
      category: "Supply Chain",
      checklistItems: [
        { id: 1, text: "Identify critical suppliers", completed: true, priority: "high", description: "List all suppliers critical to operations" },
        { id: 2, text: "Assess geographic concentration risks", completed: true, priority: "high", description: "Evaluate risks from geographic clustering" },
        { id: 3, text: "Review supplier financial health", completed: false, priority: "medium", description: "Analyze financial stability of key suppliers" },
        { id: 4, text: "Evaluate alternative sourcing options", completed: false, priority: "medium", description: "Identify backup suppliers and alternatives" },
        { id: 5, text: "Update supplier contracts", completed: false, priority: "low", description: "Revise contracts with risk mitigation clauses" }
      ],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      title: "Implement Cybersecurity Protocol Updates",
      description: "Deploy new security measures based on recent threat analysis and compliance requirements",
      priority: "high",
      status: "pending",
      dueDate: "2024-01-20",
      assignedTo: "IT Security",
      category: "Cybersecurity",
      checklistItems: [
        { id: 6, text: "Conduct security audit", completed: false, priority: "high", description: "Perform comprehensive security assessment" },
        { id: 7, text: "Update access controls", completed: false, priority: "high", description: "Implement new authentication protocols" },
        { id: 8, text: "Review incident response plan", completed: false, priority: "medium", description: "Update and test response procedures" },
        { id: 9, text: "Train staff on security protocols", completed: false, priority: "medium", description: "Conduct security awareness training" }
      ],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: 3,
      title: "Regulatory Compliance Review",
      description: "Ensure all operations meet current regulatory requirements and identify compliance gaps",
      priority: "medium",
      status: "completed",
      dueDate: "2024-01-10",
      assignedTo: "Legal Team",
      category: "Compliance",
      checklistItems: [
        { id: 10, text: "Review current regulations", completed: true, priority: "high", description: "Analyze applicable regulatory framework" },
        { id: 11, text: "Identify compliance gaps", completed: true, priority: "high", description: "Document areas of non-compliance" },
        { id: 12, text: "Update compliance procedures", completed: true, priority: "medium", description: "Revise internal procedures" },
        { id: 13, text: "Schedule compliance training", completed: true, priority: "low", description: "Arrange staff training sessions" }
      ],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }
  ];

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setTasks(sampleTasks);
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

  const calculateTaskProgress = (checklistItems) => {
    if (checklistItems.length === 0) return 0;
    const completed = checklistItems.filter(item => item.completed).length;
    return (completed / checklistItems.length) * 100;
  };

  const getStatusFromProgress = (progress) => {
    if (progress === 0) return 'pending';
    if (progress === 100) return 'completed';
    return 'in-progress';
  };

  const handleOpenTaskDialog = (task = null) => {
    if (task) {
      setEditingTask(task);
      setTaskForm({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate,
        assignedTo: task.assignedTo,
        category: task.category
      });
    } else {
      setEditingTask(null);
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
    setOpenTaskDialog(true);
  };

  const handleOpenChecklistDialog = (taskId, item = null) => {
    setSelectedTaskId(taskId);
    if (item) {
      setEditingChecklistItem(item);
      setChecklistForm({
        text: item.text,
        priority: item.priority,
        description: item.description
      });
    } else {
      setEditingChecklistItem(null);
      setChecklistForm({
        text: '',
        priority: 'medium',
        description: ''
      });
    }
    setOpenChecklistDialog(true);
  };

  const handleCloseTaskDialog = () => {
    setOpenTaskDialog(false);
    setEditingTask(null);
    setTaskForm({
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      dueDate: '',
      assignedTo: '',
      category: 'general'
    });
  };

  const handleCloseChecklistDialog = () => {
    setOpenChecklistDialog(false);
    setEditingChecklistItem(null);
    setSelectedTaskId(null);
    setChecklistForm({
      text: '',
      priority: 'medium',
      description: ''
    });
  };

  const handleSubmitTask = () => {
    if (!taskForm.title.trim()) {
      showError('Task title is required');
      return;
    }

    if (editingTask) {
      const updatedTasks = tasks.map(task =>
        task.id === editingTask.id
          ? { ...task, ...taskForm, updatedAt: new Date().toISOString() }
          : task
      );
      setTasks(updatedTasks);
      success('Task updated successfully');
    } else {
      const newTask = {
        id: Date.now(),
        ...taskForm,
        checklistItems: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setTasks([...tasks, newTask]);
      success('Task created successfully');
    }
    handleCloseTaskDialog();
  };

  const handleSubmitChecklistItem = () => {
    if (!checklistForm.text.trim()) {
      showError('Checklist item text is required');
      return;
    }

    const updatedTasks = tasks.map(task => {
      if (task.id === selectedTaskId) {
        if (editingChecklistItem) {
          // Update existing item
          const updatedItems = task.checklistItems.map(item =>
            item.id === editingChecklistItem.id
              ? { ...item, ...checklistForm, updatedAt: new Date().toISOString() }
              : item
          );
          return { ...task, checklistItems: updatedItems, updatedAt: new Date().toISOString() };
        } else {
          // Add new item
          const newItem = {
            id: Date.now(),
            ...checklistForm,
            completed: false,
            createdAt: new Date().toISOString()
          };
          return { ...task, checklistItems: [...task.checklistItems, newItem], updatedAt: new Date().toISOString() };
        }
      }
      return task;
    });

    setTasks(updatedTasks);
    success(editingChecklistItem ? 'Checklist item updated successfully' : 'Checklist item added successfully');
    handleCloseChecklistDialog();
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    success('Task deleted successfully');
  };

  const handleDeleteChecklistItem = (taskId, itemId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          checklistItems: task.checklistItems.filter(item => item.id !== itemId),
          updatedAt: new Date().toISOString()
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    success('Checklist item deleted successfully');
  };

  const handleToggleChecklistItem = (taskId, itemId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedItems = task.checklistItems.map(item => {
          if (item.id === itemId) {
            return { ...item, completed: !item.completed };
          }
          return item;
        });
        
        // Update task status based on progress
        const progress = calculateTaskProgress(updatedItems);
        const newStatus = getStatusFromProgress(progress);
        
        return { 
          ...task, 
          checklistItems: updatedItems, 
          status: newStatus,
          updatedAt: new Date().toISOString() 
        };
      }
      return task;
    });
    setTasks(updatedTasks);
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
            Manage tasks with detailed step-by-step checklists
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenTaskDialog()}
        >
          New Task
        </Button>
      </Box>

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
                  <ListItem key={task.id} sx={{ px: 0, flexDirection: 'column', alignItems: 'stretch' }}>
                    <Box sx={{ width: '100%' }}>
                      {/* Task Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, flexGrow: 1 }}>
                          {task.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleStatusChange(task.id, 'in-progress')}
                            color="warning"
                          >
                            <Schedule />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenTaskDialog(task)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteTask(task.id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Task Description */}
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                        {task.description}
                      </Typography>

                      {/* Task Metadata */}
                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
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
                        {task.assignedTo && (
                          <Chip
                            label={task.assignedTo}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>

                      {/* Progress Bar */}
                      {task.checklistItems.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Progress
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {Math.round(calculateTaskProgress(task.checklistItems))}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={calculateTaskProgress(task.checklistItems)}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      )}

                      {/* Checklist Items */}
                      {task.checklistItems.length > 0 && (
                        <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                              Steps ({task.checklistItems.length})
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails sx={{ pt: 0, px: 0 }}>
                            <List dense sx={{ p: 0 }}>
                              {task.checklistItems.map((item) => (
                                <ListItem key={item.id} sx={{ px: 0 }}>
                                  <Checkbox
                                    checked={item.completed}
                                    onChange={() => handleToggleChecklistItem(task.id, item.id)}
                                    color="primary"
                                    size="small"
                                  />
                                  <ListItemText
                                    primary={
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          textDecoration: item.completed ? 'line-through' : 'none',
                                          color: item.completed ? 'text.secondary' : 'text.primary',
                                          fontWeight: 500
                                        }}
                                      >
                                        {item.text}
                                      </Typography>
                                    }
                                    secondary={
                                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                        <Chip
                                          label={item.priority}
                                          size="small"
                                          color={getPriorityColor(item.priority)}
                                        />
                                        {item.description && (
                                          <Typography variant="caption" color="text.secondary">
                                            {item.description}
                                          </Typography>
                                        )}
                                      </Box>
                                    }
                                  />
                                  <ListItemSecondaryAction>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleOpenChecklistDialog(task.id, item)}
                                    >
                                      <Edit />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleDeleteChecklistItem(task.id, item.id)}
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
                              onClick={() => handleOpenChecklistDialog(task.id)}
                              sx={{ mt: 1 }}
                            >
                              Add Step
                            </Button>
                          </AccordionDetails>
                        </Accordion>
                      )}

                      {/* Add Checklist Button for Empty Tasks */}
                      {task.checklistItems.length === 0 && (
                        <Button
                          size="small"
                          startIcon={<Add />}
                          onClick={() => handleOpenChecklistDialog(task.id)}
                          variant="outlined"
                          fullWidth
                        >
                          Add Checklist Steps
                        </Button>
                      )}
                    </Box>
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
                  <ListItem key={task.id} sx={{ px: 0, flexDirection: 'column', alignItems: 'stretch' }}>
                    <Box sx={{ width: '100%' }}>
                      {/* Task Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, flexGrow: 1 }}>
                          {task.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleStatusChange(task.id, 'completed')}
                            color="success"
                          >
                            <CheckCircle />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenTaskDialog(task)}
                          >
                            <Edit />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Task Description */}
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                        {task.description}
                      </Typography>

                      {/* Task Metadata */}
                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
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
                        {task.assignedTo && (
                          <Chip
                            label={task.assignedTo}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>

                      {/* Progress Bar */}
                      {task.checklistItems.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Progress
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {Math.round(calculateTaskProgress(task.checklistItems))}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={calculateTaskProgress(task.checklistItems)}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      )}

                      {/* Checklist Items */}
                      {task.checklistItems.length > 0 && (
                        <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                              Steps ({task.checklistItems.length})
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails sx={{ pt: 0, px: 0 }}>
                            <List dense sx={{ p: 0 }}>
                              {task.checklistItems.map((item) => (
                                <ListItem key={item.id} sx={{ px: 0 }}>
                                  <Checkbox
                                    checked={item.completed}
                                    onChange={() => handleToggleChecklistItem(task.id, item.id)}
                                    color="primary"
                                    size="small"
                                  />
                                  <ListItemText
                                    primary={
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          textDecoration: item.completed ? 'line-through' : 'none',
                                          color: item.completed ? 'text.secondary' : 'text.primary',
                                          fontWeight: 500
                                        }}
                                      >
                                        {item.text}
                                      </Typography>
                                    }
                                    secondary={
                                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                        <Chip
                                          label={item.priority}
                                          size="small"
                                          color={getPriorityColor(item.priority)}
                                        />
                                        {item.description && (
                                          <Typography variant="caption" color="text.secondary">
                                            {item.description}
                                          </Typography>
                                        )}
                                      </Box>
                                    }
                                  />
                                  <ListItemSecondaryAction>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleOpenChecklistDialog(task.id, item)}
                                    >
                                      <Edit />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleDeleteChecklistItem(task.id, item.id)}
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
                              onClick={() => handleOpenChecklistDialog(task.id)}
                              sx={{ mt: 1 }}
                            >
                              Add Step
                            </Button>
                          </AccordionDetails>
                        </Accordion>
                      )}
                    </Box>
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
                  <ListItem key={task.id} sx={{ px: 0, flexDirection: 'column', alignItems: 'stretch' }}>
                    <Box sx={{ width: '100%' }}>
                      {/* Task Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, flexGrow: 1 }}>
                          {task.title}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleStatusChange(task.id, 'pending')}
                          color="default"
                        >
                          <Assignment />
                        </IconButton>
                      </Box>

                      {/* Task Description */}
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                        {task.description}
                      </Typography>

                      {/* Task Metadata */}
                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
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
                        {task.assignedTo && (
                          <Chip
                            label={task.assignedTo}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>

                      {/* Progress Bar */}
                      {task.checklistItems.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Progress
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {Math.round(calculateTaskProgress(task.checklistItems))}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={calculateTaskProgress(task.checklistItems)}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      )}

                      {/* Checklist Items */}
                      {task.checklistItems.length > 0 && (
                        <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                              Steps ({task.checklistItems.length})
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails sx={{ pt: 0, px: 0 }}>
                            <List dense sx={{ p: 0 }}>
                              {task.checklistItems.map((item) => (
                                <ListItem key={item.id} sx={{ px: 0 }}>
                                  <Checkbox
                                    checked={item.completed}
                                    disabled
                                    color="primary"
                                    size="small"
                                  />
                                  <ListItemText
                                    primary={
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          textDecoration: 'line-through',
                                          color: 'text.secondary',
                                          fontWeight: 500
                                        }}
                                      >
                                        {item.text}
                                      </Typography>
                                    }
                                    secondary={
                                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                        <Chip
                                          label={item.priority}
                                          size="small"
                                          color={getPriorityColor(item.priority)}
                                        />
                                        {item.description && (
                                          <Typography variant="caption" color="text.secondary">
                                            {item.description}
                                          </Typography>
                                        )}
                                      </Box>
                                    }
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </AccordionDetails>
                        </Accordion>
                      )}
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add/Edit Task Dialog */}
      <Dialog open={openTaskDialog} onClose={handleCloseTaskDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Task Title"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  multiline
                  rows={3}
                />
              </Grid>
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
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={taskForm.category}
                    onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
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
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTaskDialog}>Cancel</Button>
          <Button onClick={handleSubmitTask} variant="contained">
            {editingTask ? 'Update Task' : 'Create Task'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Checklist Item Dialog */}
      <Dialog open={openChecklistDialog} onClose={handleCloseChecklistDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingChecklistItem ? 'Edit Checklist Step' : 'Add New Checklist Step'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Step Description"
                  value={checklistForm.text}
                  onChange={(e) => setChecklistForm({ ...checklistForm, text: e.target.value })}
                  required
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Details"
                  value={checklistForm.description}
                  onChange={(e) => setChecklistForm({ ...checklistForm, description: e.target.value })}
                  multiline
                  rows={2}
                  placeholder="Optional additional context or notes..."
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={checklistForm.priority}
                    onChange={(e) => setChecklistForm({ ...checklistForm, priority: e.target.value })}
                    label="Priority"
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseChecklistDialog}>Cancel</Button>
          <Button onClick={handleSubmitChecklistItem} variant="contained">
            {editingChecklistItem ? 'Update Step' : 'Add Step'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for Quick Task Creation */}
      <Fab
        color="primary"
        aria-label="add task"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => handleOpenTaskDialog()}
      >
        <Add />
      </Fab>
    </Container>
  );
}

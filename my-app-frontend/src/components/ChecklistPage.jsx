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
  AccordionDetails
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  CheckCircle,
  ExpandMore,
  Assignment,
  Flag,
  Warning,
  Error,
  CheckCircleOutline,
  Security,
  Business,
  Timeline
} from '@mui/icons-material';
import { useToast } from './ToastNotifications';

export default function ChecklistPage() {
  const { success, error: showError } = useToast();
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState(null);
  const [checklistForm, setChecklistForm] = useState({
    title: '',
    description: '',
    category: 'general',
    items: []
  });

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
    },
    {
      id: 3,
      title: "Regulatory Compliance Review",
      description: "Checklist for ensuring regulatory compliance",
      category: "Compliance",
      items: [
        { id: 10, text: "Review current regulations", completed: true, priority: "high" },
        { id: 11, text: "Identify compliance gaps", completed: false, priority: "high" },
        { id: 12, text: "Update compliance procedures", completed: false, priority: "medium" },
        { id: 13, text: "Schedule compliance training", completed: false, priority: "low" }
      ],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    }
  ];

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
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

  const handleOpenDialog = (checklist = null) => {
    if (checklist) {
      setEditingChecklist(checklist);
      setChecklistForm({
        title: checklist.title,
        description: checklist.description,
        category: checklist.category,
        items: checklist.items
      });
    } else {
      setEditingChecklist(null);
      setChecklistForm({
        title: '',
        description: '',
        category: 'general',
        items: []
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingChecklist(null);
    setChecklistForm({
      title: '',
      description: '',
      category: 'general',
      items: []
    });
  };

  const handleSubmit = () => {
    if (!checklistForm.title.trim()) {
      showError('Checklist title is required');
      return;
    }

    if (editingChecklist) {
      // Update existing checklist
      const updatedChecklists = checklists.map(checklist =>
        checklist.id === editingChecklist.id
          ? { ...checklist, ...checklistForm, updatedAt: new Date().toISOString() }
          : checklist
      );
      setChecklists(updatedChecklists);
      success('Checklist updated successfully');
    } else {
      // Create new checklist
      const newChecklist = {
        id: Date.now(),
        ...checklistForm,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setChecklists([...checklists, newChecklist]);
      success('Checklist created successfully');
    }
    handleCloseDialog();
  };

  const handleDeleteChecklist = (checklistId) => {
    setChecklists(checklists.filter(checklist => checklist.id !== checklistId));
    success('Checklist deleted successfully');
  };

  const handleToggleItem = (checklistId, itemId) => {
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

  const handleAddItem = (checklistId) => {
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

  const handleDeleteItem = (checklistId, itemId) => {
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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>Risk Checklists</Typography>
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
            Risk Checklists
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track risk assessment checklists for different areas
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          New Checklist
        </Button>
      </Box>

      {/* Checklists Grid */}
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
                      onClick={() => handleDeleteChecklist(checklist.id)}
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
                            onChange={() => handleToggleItem(checklist.id, item.id)}
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
                              onClick={() => handleDeleteItem(checklist.id, item.id)}
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
                      onClick={() => handleAddItem(checklist.id)}
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

      {/* Add/Edit Checklist Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingChecklist ? 'Edit Checklist' : 'Create New Checklist'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Checklist Title"
                  value={checklistForm.title}
                  onChange={(e) => setChecklistForm({ ...checklistForm, title: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={checklistForm.description}
                  onChange={(e) => setChecklistForm({ ...checklistForm, description: e.target.value })}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={checklistForm.category}
                    onChange={(e) => setChecklistForm({ ...checklistForm, category: e.target.value })}
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
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingChecklist ? 'Update Checklist' : 'Create Checklist'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Grid,
  Divider,
  Button,
  Alert,
  List,
  ListItem,
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
  LocationOn,
  Category,
  ExpandMore,
  Share,
  Bookmark,
  BookmarkBorder,
  Add,
  Edit,
  Delete,
  Info,
  CheckCircle
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
  const { success, info } = useToast();

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
    try {
      setLoading(true);
      
      // Sample events data that matches the IDs from EnterpriseDashboard and EventsList
      const sampleEvents = {
        1: {
          id: 1,
          title: "Supply Chain Disruption in Asia Pacific",
          description: "Major port closures and shipping delays affecting key trade routes in the Asia Pacific region. This disruption is expected to impact global supply chains and may lead to delays in manufacturing and retail operations.",
          category: "Supply Chain Risk",
          severity: "high",
          regions: ["Asia Pacific", "Global"],
          eventDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
          lastUpdated: new Date(),
          status: "developing",
          relevanceScore: 0.85,
          source: {
            name: "Reuters",
            url: "https://reuters.com",
            reliability: "High"
          },
          rationale: "This event represents a significant supply chain disruption that could impact multiple industries globally. The Asia Pacific region is a critical hub for manufacturing and trade.",
          analysis: {
            impactScore: 0.8,
            contributingFactors: [
              { factor: "Port Infrastructure Issues", weight: 0.4 },
              { factor: "Weather Conditions", weight: 0.3 },
              { factor: "Labor Disputes", weight: 0.3 }
            ],
            timeline: [
              { event: "Initial port closures reported", date: new Date(Date.now() - 4 * 60 * 60 * 1000), impact: "high" },
              { event: "Shipping companies announce delays", date: new Date(Date.now() - 3 * 60 * 60 * 1000), impact: "medium" },
              { event: "Global supply chain impact assessment", date: new Date(Date.now() - 2 * 60 * 60 * 1000), impact: "high" }
            ],
            recommendations: [
              "Assess current inventory levels",
              "Identify alternative suppliers",
              "Update supply chain risk assessment"
            ],
            relatedEvents: [
              { id: 2, title: "Previous Port Disruption in 2023", relevance: 0.7 },
              { id: 3, title: "Supply Chain Resilience Report", relevance: 0.6 }
            ]
          }
        },
        2: {
          id: 2,
          title: "New Regulatory Requirements in Europe",
          description: "Updated GDPR compliance requirements for data processing and new sustainability reporting standards affecting European operations. Companies must adapt their data handling practices and environmental reporting frameworks.",
          category: "Regulatory Risk",
          severity: "medium",
          regions: ["Europe", "Global"],
          eventDate: new Date(Date.now() - 6 * 60 * 60 * 1000),
          lastUpdated: new Date(),
          status: "developing",
          relevanceScore: 0.72,
          source: {
            name: "EU Official Journal",
            url: "https://eur-lex.europa.eu",
            reliability: "High"
          },
          rationale: "New regulatory requirements in Europe will impact data processing and sustainability reporting for companies operating in the region.",
          analysis: {
            impactScore: 0.6,
            contributingFactors: [
              { factor: "Data Protection Regulations", weight: 0.5 },
              { factor: "Environmental Reporting Standards", weight: 0.3 },
              { factor: "Cross-border Data Transfer Rules", weight: 0.2 }
            ],
            timeline: [
              { event: "New regulations published", date: new Date(Date.now() - 8 * 60 * 60 * 1000), impact: "medium" },
              { event: "Compliance deadline announced", date: new Date(Date.now() - 6 * 60 * 60 * 1000), impact: "high" },
              { event: "Industry consultation period", date: new Date(Date.now() - 4 * 60 * 60 * 1000), impact: "low" }
            ],
            recommendations: [
              "Review current policies",
              "Update compliance procedures",
              "Conduct impact assessment"
            ],
            relatedEvents: [
              { id: 1, title: "Previous GDPR Updates", relevance: 0.8 },
              { id: 4, title: "Sustainability Reporting Trends", relevance: 0.6 }
            ]
          }
        },
        3: {
          id: 3,
          title: "Cybersecurity Threat Detection",
          description: "Advanced persistent threat targeting financial institutions and critical infrastructure. Sophisticated attack vectors using social engineering and zero-day exploits have been identified across multiple sectors.",
          category: "Cybersecurity Risk",
          severity: "high",
          regions: ["North America", "Europe", "Global"],
          eventDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
          lastUpdated: new Date(),
          status: "developing",
          relevanceScore: 0.91,
          source: {
            name: "CISA",
            url: "https://cisa.gov",
            reliability: "High"
          },
          rationale: "This cybersecurity threat poses significant risk to financial institutions and critical infrastructure, requiring immediate attention and response.",
          analysis: {
            impactScore: 0.9,
            contributingFactors: [
              { factor: "Zero-day Exploits", weight: 0.4 },
              { factor: "Social Engineering", weight: 0.3 },
              { factor: "Insider Threats", weight: 0.3 }
            ],
            timeline: [
              { event: "Threat intelligence received", date: new Date(Date.now() - 3 * 60 * 60 * 1000), impact: "high" },
              { event: "Attack patterns analyzed", date: new Date(Date.now() - 2 * 60 * 60 * 1000), impact: "high" },
              { event: "Mitigation strategies deployed", date: new Date(Date.now() - 1 * 60 * 60 * 1000), impact: "medium" }
            ],
            recommendations: [
              "Enhance email filtering",
              "Conduct security training",
              "Update incident response procedures"
            ],
            relatedEvents: [
              { id: 1, title: "Previous Cyber Attacks", relevance: 0.7 },
              { id: 5, title: "Security Framework Updates", relevance: 0.8 }
            ]
          }
        },
        4: {
          id: 4,
          title: "Market Volatility in Emerging Markets",
          description: "Currency fluctuations and political instability affecting investments in Latin American markets. Economic uncertainty driven by policy changes and external factors is creating significant market volatility.",
          category: "Market Risk",
          severity: "medium",
          regions: ["Latin America", "Global"],
          eventDate: new Date(Date.now() - 4 * 60 * 60 * 1000),
          lastUpdated: new Date(),
          status: "developing",
          relevanceScore: 0.68,
          source: {
            name: "Bloomberg",
            url: "https://bloomberg.com",
            reliability: "High"
          },
          rationale: "Market volatility in emerging markets could impact investment portfolios and business operations in the region.",
          analysis: {
            impactScore: 0.7,
            contributingFactors: [
              { factor: "Currency Fluctuations", weight: 0.4 },
              { factor: "Political Instability", weight: 0.3 },
              { factor: "External Economic Factors", weight: 0.3 }
            ],
            timeline: [
              { event: "Currency devaluation begins", date: new Date(Date.now() - 6 * 60 * 60 * 1000), impact: "high" },
              { event: "Political announcements", date: new Date(Date.now() - 5 * 60 * 60 * 1000), impact: "medium" },
              { event: "Market response analysis", date: new Date(Date.now() - 4 * 60 * 60 * 1000), impact: "high" }
            ],
            recommendations: [
              "Review portfolio exposure",
              "Consult with financial advisors",
              "Assess currency hedging strategies"
            ],
            relatedEvents: [
              { id: 2, title: "Regulatory Changes", relevance: 0.6 },
              { id: 6, title: "Geopolitical Developments", relevance: 0.7 }
            ]
          }
        },
        5: {
          id: 5,
          title: "Environmental Compliance Updates",
          description: "New sustainability reporting requirements for manufacturing and energy sectors. Updated environmental standards requiring enhanced monitoring and reporting of carbon emissions and waste management practices.",
          category: "Environmental Risk",
          severity: "low",
          regions: ["North America", "Global"],
          eventDate: new Date(Date.now() - 8 * 60 * 60 * 1000),
          lastUpdated: new Date(),
          status: "developing",
          relevanceScore: 0.45,
          source: {
            name: "EPA",
            url: "https://epa.gov",
            reliability: "High"
          },
          rationale: "New environmental compliance requirements will affect manufacturing and energy sectors, requiring updates to reporting and monitoring systems.",
          analysis: {
            impactScore: 0.4,
            contributingFactors: [
              { factor: "Carbon Reporting Requirements", weight: 0.4 },
              { factor: "Waste Management Standards", weight: 0.3 },
              { factor: "Energy Efficiency Standards", weight: 0.3 }
            ],
            timeline: [
              { event: "New standards published", date: new Date(Date.now() - 10 * 60 * 60 * 1000), impact: "low" },
              { event: "Industry consultation", date: new Date(Date.now() - 9 * 60 * 60 * 1000), impact: "low" },
              { event: "Implementation timeline announced", date: new Date(Date.now() - 8 * 60 * 60 * 1000), impact: "medium" }
            ],
            recommendations: [
              "Assess current practices",
              "Develop reporting framework",
              "Plan implementation timeline"
            ],
            relatedEvents: [
              { id: 2, title: "Regulatory Updates", relevance: 0.6 },
              { id: 4, title: "Market Impact", relevance: 0.4 }
            ]
          }
        },
        6: {
          id: 6,
          title: "Geopolitical Tensions in Middle East",
          description: "Regional conflicts affecting energy supply and trade routes. Escalating tensions in the Middle East are impacting oil prices and creating uncertainty in global energy markets and supply chains.",
          category: "Geopolitical Risk",
          severity: "high",
          regions: ["Middle East", "Global"],
          eventDate: new Date(Date.now() - 3 * 60 * 60 * 1000),
          lastUpdated: new Date(),
          status: "developing",
          relevanceScore: 0.78,
          source: {
            name: "BBC News",
            url: "https://bbc.com",
            reliability: "High"
          },
          rationale: "Geopolitical tensions in the Middle East could significantly impact energy prices and global supply chains, affecting multiple industries worldwide.",
          analysis: {
            impactScore: 0.8,
            contributingFactors: [
              { factor: "Energy Supply Disruption", weight: 0.4 },
              { factor: "Trade Route Security", weight: 0.3 },
              { factor: "Regional Instability", weight: 0.3 }
            ],
            timeline: [
              { event: "Initial tensions reported", date: new Date(Date.now() - 5 * 60 * 60 * 1000), impact: "medium" },
              { event: "Energy price impact", date: new Date(Date.now() - 4 * 60 * 60 * 1000), impact: "high" },
              { event: "Supply chain assessment", date: new Date(Date.now() - 3 * 60 * 60 * 1000), impact: "high" }
            ],
            recommendations: [
              "Monitor energy prices",
              "Assess supply chain impact",
              "Review geopolitical risk exposure"
            ],
            relatedEvents: [
              { id: 1, title: "Supply Chain Disruptions", relevance: 0.8 },
              { id: 4, title: "Market Volatility", relevance: 0.7 }
            ]
          }
        }
      };
      
      // Get the event by ID, or show error if not found
      const selectedEvent = sampleEvents[parseInt(eventId)];
      if (!selectedEvent) {
        setError('Event not found');
        setLoading(false);
        return;
      }
      
      setEvent(selectedEvent);
      setLoading(false);
    } catch (err) {
      console.error('Error loading event details:', err);
      setError('Failed to load event details');
      setLoading(false);
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    success(bookmarked ? 'Bookmark removed' : 'Event bookmarked');
  };


  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <Warning color="error" />;
      case 'medium': return <Warning color="warning" />;
      case 'low': return <Warning color="success" />;
      default: return <Warning />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'error';
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
      case 'on-hold': return 'error';
      default: return 'default';
    }
  };

  const getRecommendedActions = (event) => {
    // Generate context-aware recommended actions based on event type
    const baseActions = [
      {
        text: "Assess immediate impact on operations",
        description: "Evaluate how this event affects current business operations",
        priority: "high"
      },
      {
        text: "Review supply chain exposure",
        description: "Identify vulnerable suppliers and alternative sources",
        priority: "medium"
      },
      {
        text: "Update risk assessment",
        description: "Incorporate new information into existing risk frameworks",
        priority: "low"
      }
    ];
    
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
      isCustomAction: false,
      createdAt: new Date().toISOString()
    };

    // Save to dashboard storage
    const existingActions = JSON.parse(localStorage.getItem('dashboard_action_steps') || '[]');
    const updatedActions = [...existingActions, newAction];
    localStorage.setItem('dashboard_action_steps', JSON.stringify(updatedActions));
    
    success('Action step added to dashboard');
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
      isCustomAction: true,
      createdAt: new Date().toISOString()
    };

    // Save to both dashboard storage and local state
    const existingActions = JSON.parse(localStorage.getItem('dashboard_action_steps') || '[]');
    const updatedActions = [...existingActions, newAction];
    localStorage.setItem('dashboard_action_steps', JSON.stringify(updatedActions));
    
    setCustomActions([...customActions, newAction]);
    setShowAddDialog(false);
    resetActionForm();
    success('Custom action step added');
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

    const updatedAction = {
      ...editingAction,
      ...actionFormData,
      updatedAt: new Date().toISOString()
    };

    // Update in both dashboard storage and local state
    const existingActions = JSON.parse(localStorage.getItem('dashboard_action_steps') || '[]');
    const updatedActions = existingActions.map(action => 
      action.id === editingAction.id ? updatedAction : action
    );
    localStorage.setItem('dashboard_action_steps', JSON.stringify(updatedActions));
    
    setCustomActions(customActions.map(action => 
      action.id === editingAction.id ? updatedAction : action
    ));
    
    setShowAddDialog(false);
    setEditingAction(null);
    resetActionForm();
    success('Action step updated');
  };

  const handleDeleteAction = (actionId) => {
    // Remove from both dashboard storage and local state
    const existingActions = JSON.parse(localStorage.getItem('dashboard_action_steps') || '[]');
    const updatedActions = existingActions.filter(action => action.id !== actionId);
    localStorage.setItem('dashboard_action_steps', JSON.stringify(updatedActions));
    
    setCustomActions(customActions.filter(action => action.id !== actionId));
    success('Action step deleted');
  };

  const handleCompleteAction = (actionId) => {
    // Update action status to completed in both dashboard storage and local state
    const existingActions = JSON.parse(localStorage.getItem('dashboard_action_steps') || '[]');
    const updatedActions = existingActions.map(action => 
      action.id === actionId ? { ...action, status: 'completed', completedAt: new Date().toISOString() } : action
    );
    localStorage.setItem('dashboard_action_steps', JSON.stringify(updatedActions));
    
    setCustomActions(customActions.map(action => 
      action.id === actionId ? { ...action, status: 'completed', completedAt: new Date().toISOString() } : action
    ));
    success('Action step marked as completed');
  };

  const validateActionForm = () => {
    const errors = {};
    if (!actionFormData.text.trim()) {
      errors.text = 'Action description is required';
    }
    if (!actionFormData.priority) {
      errors.priority = 'Priority is required';
    }
    if (!actionFormData.status) {
      errors.status = 'Status is required';
    }
    
    setActionErrors(errors);
    return Object.keys(errors).length === 0;
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button onClick={() => navigate(-1)} startIcon={<ArrowBack />}>
          Go Back
        </Button>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Event not found
        </Alert>
        <Button onClick={() => navigate(-1)} startIcon={<ArrowBack />}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
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
        {/* Main Content - Left Side */}
        <Grid item xs={12} lg={8}>
          {/* Event Description & Analysis - Combined */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Event Description & Analysis
            </Typography>
            <Typography variant="body1" paragraph>
              {event.description}
            </Typography>
            
            {/* Integrated Timeline */}
            {event.analysis?.timeline && event.analysis.timeline.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  Key Timeline
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {event.analysis.timeline.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main', fontSize: '0.8rem' }}>
                        {index + 1}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {item.event}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(item.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Chip 
                        label={item.impact} 
                        size="small"
                        color={getSeverityColor(item.impact)}
                      />
                    </Box>
                  ))}
                </Box>
              </>
            )}

            {/* Rationale */}
            {event.rationale && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  Analysis Rationale
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.rationale}
                </Typography>
              </>
            )}
          </Paper>

          {/* Action Steps - Compact */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Action Steps
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
            
            {/* Recommended Actions - Compact */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                Recommended Actions
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {getRecommendedActions(event).map((action, index) => (
                  <Chip
                    key={index}
                    label={action.text}
                    variant="outlined"
                    size="small"
                    onClick={() => handleAddRecommendedAction(action)}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  />
                ))}
              </Box>
            </Box>
            
            {/* Custom Actions - Compact List */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                Your Custom Actions
              </Typography>
              {customActions.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    No custom actions added yet. Add specific actions to address this event's impact.
                  </Typography>
                </Box>
              ) : (
                <List dense sx={{ p: 0 }}>
                  {customActions.map((action) => (
                    <ListItem key={action.id} sx={{ 
                      pl: 0, 
                      border: 1, 
                      borderColor: 'divider', 
                      borderRadius: 1, 
                      mb: 1,
                      bgcolor: 'background.paper'
                    }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, flexGrow: 1 }}>
                              {action.text}
                            </Typography>
                            <Chip
                              label={action.priority}
                              size="small"
                              color={getPriorityColor(action.priority)}
                              sx={{ fontSize: '0.7rem' }}
                            />
                            <Chip
                              label={action.status}
                              size="small"
                              color={getStatusColor(action.status)}
                              sx={{ fontSize: '0.7rem' }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                            {action.description && (
                              <Typography variant="caption" color="text.secondary">
                                {action.description}
                              </Typography>
                            )}
                            {action.dueDate && (
                              <Typography variant="caption" color="text.secondary">
                                Due: {new Date(action.dueDate).toLocaleDateString()}
                              </Typography>
                            )}
                            {action.assignedTo && (
                              <Typography variant="caption" color="text.secondary">
                                Assigned: {action.assignedTo}
                              </Typography>
                            )}
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
                        {action.status !== 'completed' && (
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => handleCompleteAction(action.id)}
                            color="success"
                          >
                            <CheckCircle />
                          </IconButton>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar - Right Side */}
        <Grid item xs={12} lg={4}>
          {/* Technical Details and Related Events - Side by Side */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Technical Details - Collapsible */}
            <Paper>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Info color="action" />
                    <Typography variant="h6">Technical Details</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* AI Analysis Scores */}
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Relevance Score
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={event.relevanceScore * 100} 
                          sx={{ flexGrow: 1 }}
                        />
                        <Typography variant="body2">
                          {Math.round(event.relevanceScore * 100)}%
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Impact Score
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={(event.analysis?.impactScore || 0.7) * 100} 
                          sx={{ flexGrow: 1 }}
                        />
                        <Typography variant="body2">
                          {Math.round((event.analysis?.impactScore || 0.7) * 100)}%
                        </Typography>
                      </Box>
                    </Box>

                    {/* Contributing Factors */}
                    {event.analysis?.contributingFactors && event.analysis.contributingFactors.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Contributing Factors
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {event.analysis.contributingFactors.map((factor, index) => (
                            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="caption" sx={{ flexGrow: 1 }}>
                                {factor.factor}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {Math.round(factor.weight * 100)}%
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* Event Details */}
                    <Divider />
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
                </AccordionDetails>
              </Accordion>
            </Paper>

            {/* Related Events - Horizontal Layout */}
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Related Events
              </Typography>
              {event.analysis?.relatedEvents && event.analysis.relatedEvents.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {event.analysis.relatedEvents.map((relatedEvent) => (
                    <Chip
                      key={relatedEvent.id}
                      label={relatedEvent.title}
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        // Navigate to a new page for related event details
                        // For now, just show a toast
                        info(`Navigate to related event ${relatedEvent.title}`);
                      }}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No related events found
                </Typography>
              )}
            </Paper>
          </Box>
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
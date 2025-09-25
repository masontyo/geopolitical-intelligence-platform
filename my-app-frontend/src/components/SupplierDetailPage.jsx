import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from './common/CustomTimeline';
import {
  ArrowBack,
  Warning,
  CheckCircle,
  Error,
  Info,
  Business,
  LocationOn,
  Phone,
  Email,
  Timeline as TimelineIcon,
  Assessment,
  Lightbulb,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';
import { supplyChainAPI } from '../services/supplyChainService';

const SupplierDetailPage = () => {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const [supplierData, setSupplierData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        setLoading(true);
        const response = await supplyChainAPI.getSuppliers('demo-user');
        
        if (response.success && response.suppliers) {
          const supplier = response.suppliers.find(s => s.id === supplierId);
          if (supplier) {
            setSupplierData(supplier);
          } else {
            // Fallback to mock data if supplier not found
            setSupplierData(getMockSupplierData());
          }
        } else {
          setSupplierData(getMockSupplierData());
        }
      } catch (error) {
        console.error('Error fetching supplier data:', error);
        setSupplierData(getMockSupplierData());
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierData();
  }, [supplierId]);

  const getMockSupplierData = () => ({
    id: supplierId,
    name: 'Shanghai Metal Works',
    country: 'China',
    city: 'Shanghai',
    tier: 'Tier 1',
    status: 'active',
    alertCount: 2,
    contact: {
      phone: '+86-21-1234-5678',
      email: 'contact@shanghaimetal.com'
    },
    locations: [
      { name: 'Main Facility', address: 'Shanghai Industrial Zone', status: 'operational' },
      { name: 'Warehouse', address: 'Pudong District', status: 'operational' }
    ]
  };

  const currentDevelopments = [
    {
      id: 1,
      title: 'Port Closure Affecting Shipments',
      date: '2 days ago',
      severity: 'high',
      description: 'Shanghai Port closure due to weather conditions is delaying all outbound shipments by 3-5 days.',
      impact: 'Critical - affects 3 of your orders',
      status: 'ongoing'
    },
    {
      id: 2,
      title: 'New Quality Certification Received',
      date: '1 week ago',
      severity: 'low',
      description: 'ISO 9001:2015 certification renewed, ensuring continued quality standards.',
      impact: 'Positive - maintains supply reliability',
      status: 'resolved'
    },
    {
      id: 3,
      title: 'Raw Material Price Increase',
      date: '2 weeks ago',
      severity: 'medium',
      description: 'Steel prices increased 15% due to global supply chain disruptions.',
      impact: 'Moderate - potential cost increase on future orders',
      status: 'ongoing'
    }
  ];

  const mitigationOptions = [
    {
      title: 'Activate Backup Supplier',
      description: 'Switch to Vietnam Metal Co. for next 2 shipments',
      priority: 'High',
      timeframe: 'Immediate',
      cost: 'Low'
    },
    {
      title: 'Negotiate Price Protection',
      description: 'Lock in current prices for next 6 months',
      priority: 'Medium',
      timeframe: '1 week',
      cost: 'Medium'
    },
    {
      title: 'Diversify Supply Base',
      description: 'Add 2 additional suppliers in Southeast Asia',
      priority: 'High',
      timeframe: '1 month',
      cost: 'High'
    }
  ];

  const riskAssessment = {
    overall: 'Medium',
    factors: [
      { factor: 'Geographic Concentration', risk: 'High', description: 'Single location in Shanghai' },
      { factor: 'Port Dependency', risk: 'High', description: 'Relies heavily on Shanghai Port' },
      { factor: 'Financial Stability', risk: 'Low', description: 'Strong financial position' },
      { factor: 'Quality Performance', risk: 'Low', description: 'Excellent quality record' }
    ]
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <Error />;
      case 'high': return <Warning />;
      case 'medium': return <Info />;
      case 'low': return <CheckCircle />;
      default: return <Info />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Loading supplier details...</Typography>
      </Box>
    );
  }

  if (!supplierData) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Supplier not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar */}
      <Paper elevation={3} sx={{ width: 300, p: 3, bgcolor: 'background.paper', borderRight: 1, borderColor: 'divider', overflowY: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {supplierData.name}
          </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Business sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {supplierData.name}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOn sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {supplierData.city}, {supplierData.country}
                </Typography>
              </Box>
              
              <Chip 
                label={supplierData.tier} 
                size="small" 
                color="primary" 
                sx={{ mb: 1 }}
              />
              
              <Chip 
                label={`${supplierData.alertCount} Active Alerts`} 
                size="small" 
                color={supplierData.alertCount > 0 ? 'error' : 'success'}
                sx={{ ml: 1 }}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Contact Information
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2">{supplierData.contact.phone}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Email sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2">{supplierData.contact.email}</Typography>
            </Box>

            <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
              View Documents
            </Button>
            <Button variant="outlined" fullWidth>
              Contact Supplier
            </Button>
          </Paper>

          {/* Risk Assessment Summary */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
              <Assessment sx={{ mr: 1 }} />
              Risk Assessment
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Overall Risk Level
              </Typography>
              <Chip 
                label={riskAssessment.overall} 
                color={riskAssessment.overall === 'High' ? 'error' : riskAssessment.overall === 'Medium' ? 'warning' : 'success'}
                sx={{ fontWeight: 600 }}
              />
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Key Risk Factors
            </Typography>
            {riskAssessment.factors.map((factor, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {factor.factor}
                </Typography>
                <Chip 
                  label={factor.risk} 
                  size="small"
                  color={factor.risk === 'High' ? 'error' : factor.risk === 'Medium' ? 'warning' : 'success'}
                  sx={{ ml: 1 }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={9}>
          {/* Current Developments */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
              <TimelineIcon sx={{ mr: 1 }} />
              Current Developments
            </Typography>
            
            <Timeline>
              {currentDevelopments.map((development, index) => (
                <TimelineItem key={development.id}>
                  <TimelineSeparator>
                    <TimelineDot color={getSeverityColor(development.severity)}>
                      {getSeverityIcon(development.severity)}
                    </TimelineDot>
                    {index < currentDevelopments.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, flex: 1 }}>
                          {development.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {development.date}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {development.description}
                      </Typography>
                      
                      <Alert 
                        severity={getSeverityColor(development.severity)} 
                        sx={{ mb: 1 }}
                      >
                        <Typography variant="body2">
                          <strong>Impact:</strong> {development.impact}
                        </Typography>
                      </Alert>
                      
                      <Chip 
                        label={development.status} 
                        size="small"
                        color={development.status === 'resolved' ? 'success' : 'warning'}
                      />
                    </Box>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Paper>

          {/* Mitigation Options */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
              <Lightbulb sx={{ mr: 1 }} />
              Recommended Actions
            </Typography>
            
            <Grid container spacing={2}>
              {mitigationOptions.map((option, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        {option.title}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {option.description}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption">Priority:</Typography>
                          <Chip 
                            label={option.priority} 
                            size="small"
                            color={option.priority === 'High' ? 'error' : option.priority === 'Medium' ? 'warning' : 'success'}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption">Timeframe:</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {option.timeframe}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption">Cost:</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {option.cost}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Button variant="contained" fullWidth size="small">
                        Implement Action
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Alternative Suppliers */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Alternative Suppliers
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Vietnam Metal Co.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Similar products, 20% lower cost, 2-day longer lead time
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip label="Tier 1" size="small" color="primary" />
                      <Chip label="Available" size="small" color="success" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Thai Steel Works
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Premium quality, 15% higher cost, same lead time
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip label="Tier 1" size="small" color="primary" />
                      <Chip label="Available" size="small" color="success" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SupplierDetailPage;

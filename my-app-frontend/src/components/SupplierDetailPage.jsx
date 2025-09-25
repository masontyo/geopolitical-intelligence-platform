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
  Lightbulb
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
  });

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
      description: 'Add 2 new suppliers in different regions',
      priority: 'Low',
      timeframe: '1 month',
      cost: 'High'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'info';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
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

        {/* Supplier Info */}
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
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Assessment sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2">
                {supplierData.tier}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                Status:
              </Typography>
              <Chip 
                label={supplierData.status} 
                size="small" 
                color={supplierData.status === 'active' ? 'success' : 'warning'} 
              />
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Contact Information
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Phone sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2">
              {supplierData.contact?.phone || 'Not available'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Email sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2">
              {supplierData.contact?.email || 'Not available'}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Locations
          </Typography>
          {supplierData.locations?.map((location, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {location.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {location.address}
              </Typography>
              <Chip 
                label={location.status} 
                size="small" 
                color="primary" 
                sx={{ ml: 1 }}
              />
            </Box>
          )) || <Typography variant="body2" color="text.secondary">No locations available</Typography>}
        </Paper>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
          {supplierData.name} - Intelligence Dashboard
        </Typography>
        
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
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {option.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {option.description}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        label={`Priority: ${option.priority}`} 
                        size="small" 
                        color={option.priority === 'High' ? 'error' : option.priority === 'Medium' ? 'warning' : 'success'}
                        sx={{ mr: 1, mb: 1 }}
                      />
                      <Chip 
                        label={`Time: ${option.timeframe}`} 
                        size="small" 
                        color="primary"
                        sx={{ mr: 1, mb: 1 }}
                      />
                      <Chip 
                        label={`Cost: ${option.cost}`} 
                        size="small" 
                        color="info"
                        sx={{ mb: 1 }}
                      />
                    </Box>
                    <Button variant="contained" size="small" fullWidth>
                      Take Action
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default SupplierDetailPage;
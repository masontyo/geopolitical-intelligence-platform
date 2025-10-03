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
} from '@mui/material';
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
  Menu
} from '@mui/icons-material';
import { supplyChainAPI } from '../services/supplyChainService';

// Mock data for supplier-port relationships
const mockSupplierPorts = {
  'supplier-1': [
    {
      id: 'port-shanghai',
      name: 'Port of Shanghai',
      country: 'China',
      type: 'primary',
      status: 'active',
      alertCount: 1,
      distance: '5 km',
      capacity: 'High',
      lastUsed: '2024-01-15'
    },
    {
      id: 'port-singapore',
      name: 'Port of Singapore',
      country: 'Singapore',
      type: 'secondary',
      status: 'active',
      alertCount: 0,
      distance: '2,800 km',
      capacity: 'High',
      lastUsed: '2024-01-10'
    },
    {
      id: 'port-busan',
      name: 'Port of Busan',
      country: 'South Korea',
      type: 'secondary',
      status: 'delayed',
      alertCount: 2,
      distance: '1,200 km',
      capacity: 'Medium',
      lastUsed: '2024-01-08'
    },
    {
      id: 'port-hongkong',
      name: 'Port of Hong Kong',
      country: 'Hong Kong',
      type: 'secondary',
      status: 'active',
      alertCount: 0,
      distance: '1,500 km',
      capacity: 'High',
      lastUsed: '2024-01-12'
    },
    {
      id: 'port-tokyo',
      name: 'Port of Tokyo',
      country: 'Japan',
      type: 'secondary',
      status: 'active',
      alertCount: 0,
      distance: '1,800 km',
      capacity: 'Medium',
      lastUsed: '2024-01-05'
    },
    {
      id: 'port-osaka',
      name: 'Port of Osaka',
      country: 'Japan',
      type: 'secondary',
      status: 'active',
      alertCount: 0,
      distance: '1,900 km',
      capacity: 'Medium',
      lastUsed: '2024-01-03'
    }
  ],
  'supplier-2': [
    {
      id: 'port-hamburg',
      name: 'Port of Hamburg',
      country: 'Germany',
      type: 'primary',
      status: 'active',
      alertCount: 0,
      distance: '15 km',
      capacity: 'High',
      lastUsed: '2024-01-14'
    },
    {
      id: 'port-rotterdam',
      name: 'Port of Rotterdam',
      country: 'Netherlands',
      type: 'secondary',
      status: 'active',
      alertCount: 0,
      distance: '300 km',
      capacity: 'High',
      lastUsed: '2024-01-11'
    },
    {
      id: 'port-antwerp',
      name: 'Port of Antwerp',
      country: 'Belgium',
      type: 'secondary',
      status: 'active',
      alertCount: 1,
      distance: '400 km',
      capacity: 'High',
      lastUsed: '2024-01-09'
    }
  ]
};

// Port Card Component
const PortCard = ({ port, isPrimary }) => {
  const navigate = useNavigate();
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'delayed': return 'warning';
      case 'closed': return 'error';
      default: return 'default';
    }
  };

  const getCapacityColor = (capacity) => {
    switch (capacity) {
      case 'High': return 'success';
      case 'Medium': return 'warning';
      case 'Low': return 'error';
      default: return 'default';
    }
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        border: isPrimary ? '2px solid' : '1px solid',
        borderColor: isPrimary ? 'primary.main' : 'divider',
        backgroundColor: isPrimary ? 'primary.50' : 'background.paper',
        opacity: port.autoSwitched ? 0.7 : 1,
        position: 'relative'
      }}
    >
      <CardContent sx={{ p: 2 }}>
        {/* Primary/Secondary indicator */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Chip 
            label={isPrimary ? 'Primary' : 'Secondary'} 
            size="small" 
            color={isPrimary ? 'primary' : 'default'}
            variant={isPrimary ? 'filled' : 'outlined'}
          />
          {port.autoSwitched && (
            <Chip 
              label="Auto-Switched" 
              size="small" 
              color="warning"
              variant="outlined"
            />
          )}
        </Box>

        {/* Port name and country */}
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          {port.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {port.country} • {port.distance}
        </Typography>

        {/* Status and capacity */}
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Chip 
            label={port.status} 
            size="small" 
            color={getStatusColor(port.status)}
            variant="outlined"
          />
          <Chip 
            label={port.capacity} 
            size="small" 
            color={getCapacityColor(port.capacity)}
            variant="outlined"
          />
        </Box>

        {/* Alert count */}
        {port.alertCount > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Warning sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
            <Typography variant="body2" color="warning.main">
              {port.alertCount} active alert{port.alertCount > 1 ? 's' : ''}
            </Typography>
          </Box>
        )}

        {/* Auto-switch reason */}
        {port.autoSwitched && (
          <Alert severity="warning" sx={{ mb: 1, py: 0.5 }}>
            <Typography variant="caption">
              {port.switchReason}
            </Typography>
          </Alert>
        )}

        {/* Last used */}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Last used: {port.lastUsed}
        </Typography>

        {/* View details button */}
        <Button 
          variant="outlined" 
          size="small" 
          fullWidth
          onClick={() => navigate(`/port/${port.id}`)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

const SupplierDetailPage = () => {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const [supplierData, setSupplierData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [connectedPorts, setConnectedPorts] = useState([]);
  const [showAllPorts, setShowAllPorts] = useState(false);

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

  // Load connected ports and implement automatic port switching
  useEffect(() => {
    const loadConnectedPorts = () => {
      const ports = mockSupplierPorts[supplierId] || [];
      
      // Implement automatic port switching logic
      const updatedPorts = ports.map(port => {
        // If primary port has issues, mark it as problematic
        if (port.type === 'primary' && (port.status === 'delayed' || port.alertCount > 0)) {
          return {
            ...port,
            autoSwitched: true,
            switchReason: port.status === 'delayed' ? 'Port delays detected' : 'Active alerts'
          };
        }
        return port;
      });

      setConnectedPorts(updatedPorts);
    };

    loadConnectedPorts();
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
      {/* Collapsible Sidebar */}
      <Paper 
        elevation={3} 
        sx={{ 
          width: sidebarExpanded ? 400 : 60, 
          transition: 'width 0.3s ease',
          p: sidebarExpanded ? 3 : 1, 
          bgcolor: 'background.paper', 
          borderRight: 1, 
          borderColor: 'divider', 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: sidebarExpanded ? 3 : 1 }}>
          <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: sidebarExpanded ? 2 : 0 }}>
            <ArrowBack />
          </IconButton>
          {sidebarExpanded && (
            <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
              {supplierData.name}
            </Typography>
          )}
          <IconButton 
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            sx={{ ml: 'auto' }}
          >
            <Menu />
          </IconButton>
        </Box>

        {/* Supplier Info */}
        {sidebarExpanded && (
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
        )}
      </Paper>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
          {supplierData.name} - Intelligence Dashboard
        </Typography>
        
        <Grid container spacing={3}>
          {/* Current Developments */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3, mb: 3, height: '100%' }}>
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
          </Grid>

          {/* Connected Ports */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, mb: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ mr: 1 }} />
                Connected Ports
              </Typography>
              
              {connectedPorts.length > 0 ? (
                <Box>
                  {/* Show primary ports first, then secondary */}
                  {connectedPorts
                    .filter(port => port.type === 'primary')
                    .map((port) => (
                      <PortCard key={port.id} port={port} isPrimary={true} />
                    ))}
                  
                  {/* Show secondary ports */}
                  {connectedPorts
                    .filter(port => port.type === 'secondary')
                    .slice(0, showAllPorts ? undefined : 2)
                    .map((port) => (
                      <PortCard key={port.id} port={port} isPrimary={false} />
                    ))}
                  
                  {/* Show expand/collapse button if there are more than 3 ports */}
                  {connectedPorts.filter(port => port.type === 'secondary').length > 2 && (
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      onClick={() => setShowAllPorts(!showAllPorts)}
                      sx={{ mt: 2 }}
                    >
                      {showAllPorts 
                        ? `Show Less` 
                        : `Show ${connectedPorts.filter(port => port.type === 'secondary').length - 2} More`
                      }
                    </Button>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No connected ports found.
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Mitigation Options */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, mb: 3, height: '100%' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
            <Lightbulb sx={{ mr: 1 }} />
            Recommended Actions
          </Typography>
          
              <List>
                {mitigationOptions.map((option, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 1, flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100%' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1 }}>
                        {option.title}
                      </Typography>
                      <Chip 
                        label={option.priority} 
                        size="small" 
                        color={option.priority === 'High' ? 'error' : option.priority === 'Medium' ? 'warning' : 'success'}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1, width: '100%' }}>
                      {option.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1, width: '100%' }}>
                      <Chip 
                        label={`Time: ${option.timeframe}`} 
                        size="small" 
                        color="primary"
                      />
                      <Chip 
                        label={`Cost: ${option.cost}`} 
                        size="small" 
                        color="info"
                      />
                    </Box>
                    <Button variant="contained" size="small" fullWidth>
                      Take Action
                    </Button>
                    {index < mitigationOptions.length - 1 && <Divider sx={{ mt: 2, width: '100%' }} />}
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SupplierDetailPage;
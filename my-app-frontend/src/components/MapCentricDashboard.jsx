import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Badge,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu,
  Close,
  FilterList,
  Warning,
  Error,
  Info,
  CheckCircle,
  Timeline,
  Business,
  LocationOn,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import DetailedWorldMap from './DetailedWorldMap';

const MapCentricDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showRelationships, setShowRelationships] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    suppliers: true,
    events: true,
    ports: true,
    routes: true
  });
  const [showCountryRisk, setShowCountryRisk] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem('currentUserId') || 'demo-user');
  const [useOnboardingData, setUseOnboardingData] = useState(false);

  // Check if user has completed onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const response = await fetch(`/api/onboarding/${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.onboarding?.onboardingStatus === 'completed') {
            setUseOnboardingData(true);
          }
        }
      } catch (error) {
        console.log('No onboarding data found, using demo data');
      }
    };
    
    checkOnboardingStatus();
  }, [userId]);

  // Mock data for demonstration
  const [alerts] = useState([
    { id: 1, supplierId: 'supplier-1', severity: 'critical', message: 'Port closure in Shanghai', new: true },
    { id: 2, supplierId: 'supplier-1', severity: 'high', message: 'Shipping delays expected', new: true },
    { id: 3, supplierId: 'supplier-2', severity: 'medium', message: 'Weather warning in region', new: false },
    { id: 4, supplierId: 'supplier-3', severity: 'critical', message: 'Supplier facility damaged', new: true }
  ]);

  const [suppliers] = useState([
    { id: 'supplier-1', name: 'Shanghai Metal Works', country: 'China', tier: 'Tier 1', alertCount: 2 },
    { id: 'supplier-2', name: 'German Electronics Ltd', country: 'Germany', tier: 'Tier 1', alertCount: 1 },
    { id: 'supplier-3', name: 'Thai Components Inc', country: 'Thailand', tier: 'Tier 2', alertCount: 1 }
  ]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#16a34a';
      default: return '#6b7280';
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

  const getSupplierAlertCount = (supplierId) => {
    return alerts.filter(alert => alert.supplierId === supplierId && alert.new).length;
  };

  const getSupplierMostCriticalAlert = (supplierId) => {
    const supplierAlerts = alerts.filter(alert => alert.supplierId === supplierId);
    if (supplierAlerts.length === 0) return null;
    
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return supplierAlerts.reduce((mostCritical, alert) => 
      severityOrder[alert.severity] > severityOrder[mostCritical.severity] ? alert : mostCritical
    );
  };

  const handleSupplierClick = (supplier) => {
    setSelectedSupplier(supplier);
    setSelectedEvent(null);
    setSidebarOpen(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setSelectedSupplier(null);
    setSidebarOpen(true);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleFilterChange = (filterType) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  const SidebarContent = () => (
    <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {selectedSupplier ? 'Supplier Details' : selectedEvent ? 'Event Details' : 'Dashboard'}
        </Typography>
      </Box>

      {selectedSupplier && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {selectedSupplier.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {selectedSupplier.country} • {selectedSupplier.tier}
          </Typography>
          
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Active Alerts ({getSupplierAlertCount(selectedSupplier.id)})
          </Typography>
          
          {alerts
            .filter(alert => alert.supplierId === selectedSupplier.id)
            .map(alert => (
              <Paper key={alert.id} sx={{ p: 2, mb: 2, borderLeft: 4, borderLeftColor: getSeverityColor(alert.severity) }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  {getSeverityIcon(alert.severity)}
                  <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                    {alert.severity}
                  </Typography>
                  {alert.new && <Chip label="New" size="small" color="primary" />}
                </Box>
                <Typography variant="body2">
                  {alert.message}
                </Typography>
              </Paper>
            ))}
          <Button 
            variant="outlined" 
            onClick={() => setSelectedSupplier(null)}
            sx={{ mt: 2 }}
          >
            Back to Map Controls
          </Button>
        </Box>
      )}

      {selectedEvent && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Event Details
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Event information would go here...
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => setSelectedEvent(null)}
            sx={{ mb: 2 }}
          >
            Back to Map Controls
          </Button>
        </Box>
      )}

      {!selectedSupplier && !selectedEvent && (
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Map Controls
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              Show/Hide Layers
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label="Suppliers"
                color={activeFilters.suppliers ? "primary" : "default"}
                onClick={() => handleFilterChange('suppliers')}
                clickable
              />
              <Chip
                label="Events"
                color={activeFilters.events ? "primary" : "default"}
                onClick={() => handleFilterChange('events')}
                clickable
              />
              <Chip
                label="Ports"
                color={activeFilters.ports ? "primary" : "default"}
                onClick={() => handleFilterChange('ports')}
                clickable
              />
              <Chip
                label="Routes"
                color={activeFilters.routes ? "primary" : "default"}
                onClick={() => handleFilterChange('routes')}
                clickable
              />
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              Relationships
            </Typography>
            <ToggleButtonGroup
              value={showRelationships}
              exclusive
              onChange={() => setShowRelationships(!showRelationships)}
              size="small"
            >
              <ToggleButton value={true}>
                <Visibility fontSize="small" />
                Show Connections
              </ToggleButton>
              <ToggleButton value={false}>
                <VisibilityOff fontSize="small" />
                Hide Connections
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              Country Risk
            </Typography>
            <ToggleButtonGroup
              value={showCountryRisk}
              exclusive
              onChange={() => setShowCountryRisk(!showCountryRisk)}
              size="small"
            >
              <ToggleButton value={true}>
                <Warning fontSize="small" />
                Show Risk
              </ToggleButton>
              <ToggleButton value={false}>
                <CheckCircle fontSize="small" />
                Hide Risk
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Recent Alerts
            </Typography>
            {alerts.filter(alert => alert.new).slice(0, 5).map(alert => {
              const supplier = suppliers.find(s => s.id === alert.supplierId);
              return (
                <Paper key={alert.id} sx={{ p: 2, mb: 1, cursor: 'pointer' }} onClick={() => handleEventClick(alert)}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {getSeverityIcon(alert.severity)}
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {supplier?.name}
                    </Typography>
                    <Chip label="New" size="small" color="primary" />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {alert.message}
                  </Typography>
                </Paper>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar */}
      <Box sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'background.paper'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Supply Chain Risk Monitor
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Badge badgeContent={alerts.filter(alert => alert.new).length} color="error">
            <IconButton>
              <Warning />
            </IconButton>
          </Badge>
          <Chip
            label={`${alerts.filter(alert => alert.new).length} New Alerts`}
            color="error"
            size="small"
          />
          <IconButton onClick={toggleSidebar}>
            <Menu />
          </IconButton>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', position: 'relative' }}>
        {/* Map Area */}
        <Box sx={{ 
          flex: 1, 
          position: 'relative',
          transition: 'margin-left 0.3s ease-in-out'
        }}>
          <DetailedWorldMap 
            height="100%"
            onSupplierClick={handleSupplierClick}
            onEventClick={handleEventClick}
            showRelationships={showRelationships}
            activeFilters={activeFilters}
            showCountryRisk={showCountryRisk}
            userId={userId}
            useOnboardingData={useOnboardingData}
          />
        </Box>

        {/* Sidebar Drawer */}
        <Drawer
          anchor="right"
          open={sidebarOpen}
          onClose={toggleSidebar}
          variant="persistent"
          sx={{
            '& .MuiDrawer-paper': {
              width: 350,
              position: 'relative',
              height: '100%',
              borderLeft: 1,
              borderColor: 'divider'
            }
          }}
        >
          <SidebarContent />
        </Drawer>
      </Box>
    </Box>
  );
};

export default MapCentricDashboard;

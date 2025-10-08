import React, { useState, useEffect } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Typography,
  Card,
  CardContent,
  FormControl,
  TextField,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  Alert,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  Grid,
  InputLabel,
  FormHelperText,
  CircularProgress
} from '@mui/material';
import {
  Business,
  LocationOn,
  Inventory,
  Route,
  Timeline,
  Warning,
  Add,
  Delete,
  Info,
  CheckCircle,
  Logout
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../auth/ProtectedRoute';

const SupplyChainOnboarding = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    userInfo: {
      company: '',
      role: ''
    },
    suppliers: [],
    portsAndRoutes: {
      ports: [],
      warehouses: [],
      shippingRoutes: []
    },
    backupSuppliers: [],
    timelines: {
      supplierSwitchTime: '',
      shipmentFrequency: '',
      leadTimes: {}
    },
    riskThresholds: {
      critical: 8,
      high: 6,
      medium: 4,
      low: 2
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Start onboarding when component mounts
  useEffect(() => {
    startOnboarding();
  }, []);

  const startOnboarding = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = process.env.REACT_APP_API_URL || 
        (window.location.hostname === 'localhost' 
          ? 'http://localhost:3001' 
          : 'https://geop-backend.onrender.com');
      
      const response = await fetch(`${API_BASE_URL}/api/onboarding/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id || 'demo-user',
          type: 'supply_chain'
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Onboarding started successfully
        console.log('Supply chain onboarding started:', data);
      } else {
        console.warn('Failed to start onboarding:', data.error);
      }
    } catch (error) {
      console.warn('Error starting onboarding:', error);
      // Don't show error to user, just log it
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Basic Information',
      description: 'Tell us about yourself and your company',
      icon: <Business />
    },
    {
      title: 'Supplier Network',
      description: 'Define your suppliers and their details',
      icon: <Inventory />
    },
    {
      title: 'Ports & Routes',
      description: 'Identify key ports, warehouses, and shipping routes',
      icon: <Route />
    },
    {
      title: 'Backup Suppliers',
      description: 'Configure alternative suppliers and sources',
      icon: <LocationOn />
    },
    {
      title: 'Timelines & Risk',
      description: 'Set switching timelines and risk thresholds',
      icon: <Timeline />
    }
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleComplete = async () => {
    setLoading(true);
    setError(null);

    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 
        (window.location.hostname === 'localhost' 
          ? 'http://localhost:3001' 
          : 'https://geop-backend.onrender.com');
      
      const response = await fetch(`${API_BASE_URL}/api/onboarding/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id || 'demo-user',
          onboardingData: onboardingData,
          type: 'supply_chain'
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Store user ID for the dashboard to use
        localStorage.setItem('currentUserId', user?.id || 'demo-user');
        navigate('/dashboard');
      } else {
        setError(data.error || 'Failed to complete onboarding');
      }
    } catch (error) {
      setError('Failed to complete onboarding');
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOnboardingData = (section, data) => {
    setOnboardingData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const addSupplier = () => {
    const newSupplier = {
      id: Date.now(),
      name: '',
      officialName: '',
      supplierId: '',
      locations: [],
      tier: 'Tier 1',
      products: [],
      region: '',
      status: 'active'
    };
    setOnboardingData(prev => ({
      ...prev,
      suppliers: [...prev.suppliers, newSupplier]
    }));
  };

  const updateSupplier = (index, field, value) => {
    setOnboardingData(prev => ({
      ...prev,
      suppliers: prev.suppliers.map((supplier, i) => 
        i === index ? { ...supplier, [field]: value } : supplier
      )
    }));
  };

  const removeSupplier = (index) => {
    setOnboardingData(prev => ({
      ...prev,
      suppliers: prev.suppliers.filter((_, i) => i !== index)
    }));
  };

  const addSupplierLocation = (supplierIndex) => {
    const newLocation = {
      id: Date.now(),
      name: '',
      address: '',
      country: '',
      coordinates: null
    };
    updateSupplier(supplierIndex, 'locations', [
      ...onboardingData.suppliers[supplierIndex].locations,
      newLocation
    ]);
  };

  const updateSupplierLocation = (supplierIndex, locationIndex, field, value) => {
    const updatedLocations = onboardingData.suppliers[supplierIndex].locations.map((loc, i) =>
      i === locationIndex ? { ...loc, [field]: value } : loc
    );
    updateSupplier(supplierIndex, 'locations', updatedLocations);
  };

  const removeSupplierLocation = (supplierIndex, locationIndex) => {
    const updatedLocations = onboardingData.suppliers[supplierIndex].locations.filter((_, i) => i !== locationIndex);
    updateSupplier(supplierIndex, 'locations', updatedLocations);
  };

  const addPort = () => {
    const newPort = {
      id: Date.now(),
      name: '',
      type: 'port',
      location: '',
      country: '',
      importance: 'critical'
    };
    setOnboardingData(prev => ({
      ...prev,
      portsAndRoutes: {
        ...prev.portsAndRoutes,
        ports: [...prev.portsAndRoutes.ports, newPort]
      }
    }));
  };

  const addWarehouse = () => {
    const newWarehouse = {
      id: Date.now(),
      name: '',
      type: 'warehouse',
      location: '',
      country: '',
      capacity: '',
      importance: 'high'
    };
    setOnboardingData(prev => ({
      ...prev,
      portsAndRoutes: {
        ...prev.portsAndRoutes,
        warehouses: [...prev.portsAndRoutes.warehouses, newWarehouse]
      }
    }));
  };

  const addShippingRoute = () => {
    const newRoute = {
      id: Date.now(),
      name: '',
      from: '',
      to: '',
      frequency: 'weekly',
      transportMode: 'sea',
      estimatedDays: ''
    };
    setOnboardingData(prev => ({
      ...prev,
      portsAndRoutes: {
        ...prev.portsAndRoutes,
        shippingRoutes: [...prev.portsAndRoutes.shippingRoutes, newRoute]
      }
    }));
  };

  const addBackupSupplier = () => {
    const newBackup = {
      id: Date.now(),
      name: '',
      originalSupplierId: '',
      location: '',
      products: [],
      switchTime: '',
      reliability: 'high'
    };
    setOnboardingData(prev => ({
      ...prev,
      backupSuppliers: [...prev.backupSuppliers, newBackup]
    }));
  };

  const updateBackupSupplier = (index, field, value) => {
    setOnboardingData(prev => ({
      ...prev,
      backupSuppliers: prev.backupSuppliers.map((backup, i) => 
        i === index ? { ...backup, [field]: value } : backup
      )
    }));
  };

  const removeBackupSupplier = (index) => {
    setOnboardingData(prev => ({
      ...prev,
      backupSuppliers: prev.backupSuppliers.filter((_, i) => i !== index)
    }));
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Basic Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={onboardingData.userInfo.company}
                  onChange={(e) => updateOnboardingData('userInfo', { company: e.target.value })}
                  placeholder="Enter your company name"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Role/Title"
                  value={onboardingData.userInfo.role}
                  onChange={(e) => updateOnboardingData('userInfo', { role: e.target.value })}
                  placeholder="e.g., Supply Chain Manager"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Note: Your email address ({user?.email}) will be used for notifications.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Supplier Network
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={addSupplier}
              >
                Add Supplier
              </Button>
            </Box>
            
            {onboardingData.suppliers.map((supplier, index) => (
              <Card key={supplier.id} sx={{ mb: 3, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Supplier {index + 1}
                  </Typography>
                  <IconButton onClick={() => removeSupplier(index)} color="error">
                    <Delete />
                  </IconButton>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Internal Supplier Name"
                      value={supplier.name}
                      onChange={(e) => updateSupplier(index, 'name', e.target.value)}
                      placeholder="e.g., 'Shanghai Metal Works'"
                      helperText="Your internal/colloquial name for this supplier"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Official Company Name"
                      value={supplier.officialName}
                      onChange={(e) => updateSupplier(index, 'officialName', e.target.value)}
                      placeholder="e.g., 'Shanghai Metal Works Co., Ltd.'"
                      helperText="Legal/registered business name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Supplier ID/Code"
                      value={supplier.supplierId}
                      onChange={(e) => updateSupplier(index, 'supplierId', e.target.value)}
                      placeholder="Internal supplier code"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Supplier Tier</InputLabel>
                      <Select
                        value={supplier.tier}
                        onChange={(e) => updateSupplier(index, 'tier', e.target.value)}
                      >
                        <MenuItem value="Tier 1">Tier 1 (Direct)</MenuItem>
                        <MenuItem value="Tier 2">Tier 2 (Sub-supplier)</MenuItem>
                        <MenuItem value="Tier 3">Tier 3 (Raw materials)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Operating Region"
                      value={supplier.region}
                      onChange={(e) => updateSupplier(index, 'region', e.target.value)}
                      placeholder="e.g., Asia-Pacific, Europe"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      freeSolo
                      options={[]}
                      value={supplier.products}
                      onChange={(event, newValue) => updateSupplier(index, 'products', newValue)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Products/Services"
                          placeholder="Add products this supplier provides"
                          helperText="Press Enter to add each product"
                        />
                      )}
                    />
                  </Grid>
                  
                  {/* Supplier Locations */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Supplier Locations
                      </Typography>
                      <Button
                        size="small"
                        startIcon={<Add />}
                        onClick={() => addSupplierLocation(index)}
                      >
                        Add Location
                      </Button>
                    </Box>
                    
                    {supplier.locations.map((location, locIndex) => (
                      <Paper key={location.id} sx={{ p: 2, mb: 2, backgroundColor: 'grey.50', border: 1, borderColor: 'primary.light' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {location.name || `Location ${locIndex + 1}`}
                            </Typography>
                            {location.name && location.address && location.country && (
                              <Chip label="Complete" size="small" color="success" variant="outlined" />
                            )}
                          </Box>
                          <IconButton size="small" onClick={() => removeSupplierLocation(index, locIndex)} color="error">
                            <Delete />
                          </IconButton>
                        </Box>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Location Name"
                              value={location.name}
                              onChange={(e) => updateSupplierLocation(index, locIndex, 'name', e.target.value)}
                              placeholder="e.g., Shanghai Factory"
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Address"
                              value={location.address}
                              onChange={(e) => updateSupplierLocation(index, locIndex, 'address', e.target.value)}
                              placeholder="Full address"
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Country"
                              value={location.country}
                              onChange={(e) => updateSupplierLocation(index, locIndex, 'country', e.target.value)}
                              placeholder="Country"
                              required
                            />
                          </Grid>
                        </Grid>
                        {location.name && location.address && location.country && (
                          <Box sx={{ mt: 1, p: 1, backgroundColor: 'success.light', borderRadius: 1 }}>
                            <Typography variant="caption" sx={{ color: 'success.dark', fontWeight: 600 }}>
                              ✓ Location saved for {supplier.name || 'this supplier'}
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    ))}
                    
                    {supplier.locations.length === 0 && (
                      <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: 'grey.50', border: 2, borderStyle: 'dashed', borderColor: 'grey.300' }}>
                        <Typography variant="body2" color="text.secondary">
                          No locations added yet. Click "Add Location" to add supplier locations.
                        </Typography>
                      </Paper>
                    )}
                  </Grid>
                  
                  {/* Supplier Summary */}
                  {supplier.locations.length > 0 && (
                    <Box sx={{ mt: 2, p: 2, backgroundColor: 'primary.light', borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ color: 'primary.dark', fontWeight: 600 }}>
                        📍 {supplier.locations.length} location{supplier.locations.length !== 1 ? 's' : ''} saved for {supplier.name || 'this supplier'}
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Card>
            ))}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Ports, Warehouses & Shipping Routes
            </Typography>
            
            {/* Ports Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Critical Ports
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={addPort}
                >
                  Add Port
                </Button>
              </Box>
              
              {onboardingData.portsAndRoutes.ports.map((port, index) => (
                <Card key={port.id} sx={{ mb: 2, p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Port Name"
                        value={port.name}
                        onChange={(e) => {
                          const updatedPorts = onboardingData.portsAndRoutes.ports.map((p, i) =>
                            i === index ? { ...p, name: e.target.value } : p
                          );
                          setOnboardingData(prev => ({
                            ...prev,
                            portsAndRoutes: { ...prev.portsAndRoutes, ports: updatedPorts }
                          }));
                        }}
                        placeholder="e.g., Port of Los Angeles"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Importance Level</InputLabel>
                        <Select
                          value={port.importance}
                          onChange={(e) => {
                            const updatedPorts = onboardingData.portsAndRoutes.ports.map((p, i) =>
                              i === index ? { ...p, importance: e.target.value } : p
                            );
                            setOnboardingData(prev => ({
                              ...prev,
                              portsAndRoutes: { ...prev.portsAndRoutes, ports: updatedPorts }
                            }));
                          }}
                        >
                          <MenuItem value="critical">Critical</MenuItem>
                          <MenuItem value="high">High</MenuItem>
                          <MenuItem value="medium">Medium</MenuItem>
                          <MenuItem value="low">Low</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Location"
                        value={port.location}
                        onChange={(e) => {
                          const updatedPorts = onboardingData.portsAndRoutes.ports.map((p, i) =>
                            i === index ? { ...p, location: e.target.value } : p
                          );
                          setOnboardingData(prev => ({
                            ...prev,
                            portsAndRoutes: { ...prev.portsAndRoutes, ports: updatedPorts }
                          }));
                        }}
                        placeholder="City, Country"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Country"
                        value={port.country}
                        onChange={(e) => {
                          const updatedPorts = onboardingData.portsAndRoutes.ports.map((p, i) =>
                            i === index ? { ...p, country: e.target.value } : p
                          );
                          setOnboardingData(prev => ({
                            ...prev,
                            portsAndRoutes: { ...prev.portsAndRoutes, ports: updatedPorts }
                          }));
                        }}
                        placeholder="Country"
                      />
                    </Grid>
                  </Grid>
                </Card>
              ))}
            </Box>

            {/* Warehouses Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Key Warehouses
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={addWarehouse}
                >
                  Add Warehouse
                </Button>
              </Box>
              
              {onboardingData.portsAndRoutes.warehouses.map((warehouse, index) => (
                <Card key={warehouse.id} sx={{ mb: 2, p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Warehouse Name"
                        value={warehouse.name}
                        onChange={(e) => {
                          const updatedWarehouses = onboardingData.portsAndRoutes.warehouses.map((w, i) =>
                            i === index ? { ...w, name: e.target.value } : w
                          );
                          setOnboardingData(prev => ({
                            ...prev,
                            portsAndRoutes: { ...prev.portsAndRoutes, warehouses: updatedWarehouses }
                          }));
                        }}
                        placeholder="e.g., Central Distribution Center"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Capacity"
                        value={warehouse.capacity}
                        onChange={(e) => {
                          const updatedWarehouses = onboardingData.portsAndRoutes.warehouses.map((w, i) =>
                            i === index ? { ...w, capacity: e.target.value } : w
                          );
                          setOnboardingData(prev => ({
                            ...prev,
                            portsAndRoutes: { ...prev.portsAndRoutes, warehouses: updatedWarehouses }
                          }));
                        }}
                        placeholder="e.g., 100,000 sq ft"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Location"
                        value={warehouse.location}
                        onChange={(e) => {
                          const updatedWarehouses = onboardingData.portsAndRoutes.warehouses.map((w, i) =>
                            i === index ? { ...w, location: e.target.value } : w
                          );
                          setOnboardingData(prev => ({
                            ...prev,
                            portsAndRoutes: { ...prev.portsAndRoutes, warehouses: updatedWarehouses }
                          }));
                        }}
                        placeholder="City, Country"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Country"
                        value={warehouse.country}
                        onChange={(e) => {
                          const updatedWarehouses = onboardingData.portsAndRoutes.warehouses.map((w, i) =>
                            i === index ? { ...w, country: e.target.value } : w
                          );
                          setOnboardingData(prev => ({
                            ...prev,
                            portsAndRoutes: { ...prev.portsAndRoutes, warehouses: updatedWarehouses }
                          }));
                        }}
                        placeholder="Country"
                      />
                    </Grid>
                  </Grid>
                </Card>
              ))}
            </Box>

            {/* Shipping Routes Section */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Main Shipping Routes
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={addShippingRoute}
                >
                  Add Route
                </Button>
              </Box>
              
              {onboardingData.portsAndRoutes.shippingRoutes.map((route, index) => (
                <Card key={route.id} sx={{ mb: 2, p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Route Name"
                        value={route.name}
                        onChange={(e) => {
                          const updatedRoutes = onboardingData.portsAndRoutes.shippingRoutes.map((r, i) =>
                            i === index ? { ...r, name: e.target.value } : r
                          );
                          setOnboardingData(prev => ({
                            ...prev,
                            portsAndRoutes: { ...prev.portsAndRoutes, shippingRoutes: updatedRoutes }
                          }));
                        }}
                        placeholder="e.g., Shanghai to LA"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Transport Mode</InputLabel>
                        <Select
                          value={route.transportMode}
                          onChange={(e) => {
                            const updatedRoutes = onboardingData.portsAndRoutes.shippingRoutes.map((r, i) =>
                              i === index ? { ...r, transportMode: e.target.value } : r
                            );
                            setOnboardingData(prev => ({
                              ...prev,
                              portsAndRoutes: { ...prev.portsAndRoutes, shippingRoutes: updatedRoutes }
                            }));
                          }}
                        >
                          <MenuItem value="sea">Sea Freight</MenuItem>
                          <MenuItem value="air">Air Freight</MenuItem>
                          <MenuItem value="rail">Rail</MenuItem>
                          <MenuItem value="road">Road/Truck</MenuItem>
                          <MenuItem value="multimodal">Multimodal</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="From"
                        value={route.from}
                        onChange={(e) => {
                          const updatedRoutes = onboardingData.portsAndRoutes.shippingRoutes.map((r, i) =>
                            i === index ? { ...r, from: e.target.value } : r
                          );
                          setOnboardingData(prev => ({
                            ...prev,
                            portsAndRoutes: { ...prev.portsAndRoutes, shippingRoutes: updatedRoutes }
                          }));
                        }}
                        placeholder="Origin location"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="To"
                        value={route.to}
                        onChange={(e) => {
                          const updatedRoutes = onboardingData.portsAndRoutes.shippingRoutes.map((r, i) =>
                            i === index ? { ...r, to: e.target.value } : r
                          );
                          setOnboardingData(prev => ({
                            ...prev,
                            portsAndRoutes: { ...prev.portsAndRoutes, shippingRoutes: updatedRoutes }
                          }));
                        }}
                        placeholder="Destination location"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Frequency</InputLabel>
                        <Select
                          value={route.frequency}
                          onChange={(e) => {
                            const updatedRoutes = onboardingData.portsAndRoutes.shippingRoutes.map((r, i) =>
                              i === index ? { ...r, frequency: e.target.value } : r
                            );
                            setOnboardingData(prev => ({
                              ...prev,
                              portsAndRoutes: { ...prev.portsAndRoutes, shippingRoutes: updatedRoutes }
                            }));
                          }}
                        >
                          <MenuItem value="daily">Daily</MenuItem>
                          <MenuItem value="weekly">Weekly</MenuItem>
                          <MenuItem value="biweekly">Bi-weekly</MenuItem>
                          <MenuItem value="monthly">Monthly</MenuItem>
                          <MenuItem value="as_needed">As Needed</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Estimated Transit Time (Days)"
                        type="number"
                        value={route.estimatedDays}
                        onChange={(e) => {
                          const updatedRoutes = onboardingData.portsAndRoutes.shippingRoutes.map((r, i) =>
                            i === index ? { ...r, estimatedDays: e.target.value } : r
                          );
                          setOnboardingData(prev => ({
                            ...prev,
                            portsAndRoutes: { ...prev.portsAndRoutes, shippingRoutes: updatedRoutes }
                          }));
                        }}
                        placeholder="e.g., 14"
                      />
                    </Grid>
                  </Grid>
                </Card>
              ))}
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Backup Suppliers & Alternative Sources
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={addBackupSupplier}
              >
                Add Backup Supplier
              </Button>
            </Box>
            
            {onboardingData.backupSuppliers.map((backup, index) => (
              <Card key={backup.id} sx={{ mb: 3, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Backup Supplier {index + 1}
                  </Typography>
                  <IconButton onClick={() => removeBackupSupplier(index)} color="error">
                    <Delete />
                  </IconButton>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Backup Supplier Name"
                      value={backup.name}
                      onChange={(e) => updateBackupSupplier(index, 'name', e.target.value)}
                      placeholder="Enter backup supplier name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Original Supplier ID"
                      value={backup.originalSupplierId}
                      onChange={(e) => updateBackupSupplier(index, 'originalSupplierId', e.target.value)}
                      placeholder="ID of the main supplier this replaces"
                      helperText="Enter the ID of the primary supplier this backs up"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={backup.location}
                      onChange={(e) => updateBackupSupplier(index, 'location', e.target.value)}
                      placeholder="City, Country"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Switch Time"
                      value={backup.switchTime}
                      onChange={(e) => updateBackupSupplier(index, 'switchTime', e.target.value)}
                      placeholder="e.g., 2 weeks, 30 days"
                      helperText="How long it takes to switch to this backup"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      freeSolo
                      options={[]}
                      value={backup.products}
                      onChange={(event, newValue) => updateBackupSupplier(index, 'products', newValue)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Products/Services"
                          placeholder="Add products this backup provides"
                          helperText="Press Enter to add each product"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Reliability Level</InputLabel>
                      <Select
                        value={backup.reliability}
                        onChange={(e) => updateBackupSupplier(index, 'reliability', e.target.value)}
                      >
                        <MenuItem value="high">High</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="untested">Untested</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Card>
            ))}
          </Box>
        );

      case 4:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Timelines & Risk Thresholds
            </Typography>
            
            {/* Timelines Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Switching Timelines
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Supplier Switch Time"
                    value={onboardingData.timelines.supplierSwitchTime}
                    onChange={(e) => updateOnboardingData('timelines', { supplierSwitchTime: e.target.value })}
                    placeholder="e.g., 2-4 weeks"
                    helperText="Average time to switch to a new supplier"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Shipment Frequency"
                    value={onboardingData.timelines.shipmentFrequency}
                    onChange={(e) => updateOnboardingData('timelines', { shipmentFrequency: e.target.value })}
                    placeholder="e.g., Weekly, Monthly"
                    helperText="How often you typically ship"
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Risk Thresholds Section */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Risk Alert Thresholds
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                Set the risk scores that will trigger alerts for different severity levels (1-10 scale)
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Critical Risk Threshold</InputLabel>
                    <Select
                      value={onboardingData.riskThresholds.critical}
                      onChange={(e) => updateOnboardingData('riskThresholds', { critical: e.target.value })}
                    >
                      {[8, 9, 10].map(value => (
                        <MenuItem key={value} value={value}>{value}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>Alerts for highest risk events</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>High Risk Threshold</InputLabel>
                    <Select
                      value={onboardingData.riskThresholds.high}
                      onChange={(e) => updateOnboardingData('riskThresholds', { high: e.target.value })}
                    >
                      {[6, 7, 8].map(value => (
                        <MenuItem key={value} value={value}>{value}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>Alerts for high risk events</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Medium Risk Threshold</InputLabel>
                    <Select
                      value={onboardingData.riskThresholds.medium}
                      onChange={(e) => updateOnboardingData('riskThresholds', { medium: e.target.value })}
                    >
                      {[4, 5, 6].map(value => (
                        <MenuItem key={value} value={value}>{value}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>Alerts for medium risk events</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Low Risk Threshold</InputLabel>
                    <Select
                      value={onboardingData.riskThresholds.low}
                      onChange={(e) => updateOnboardingData('riskThresholds', { low: e.target.value })}
                    >
                      {[2, 3, 4].map(value => (
                        <MenuItem key={value} value={value}>{value}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>Alerts for low risk events</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return onboardingData.userInfo.company;
      case 1:
        return onboardingData.suppliers.length > 0 && 
               onboardingData.suppliers.every(s => s.name && s.officialName);
      case 2:
        return true; // Optional step
      case 3:
        return true; // Optional step
      case 4:
        return onboardingData.timelines.supplierSwitchTime;
      default:
        return false;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header with user info and logout */}
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        py: 2,
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <Box sx={{ 
          maxWidth: 'lg', 
          mx: 'auto', 
          px: 3,
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Supply Chain Onboarding
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              {user?.email}
            </Typography>
            <Button
              color="inherit"
              startIcon={<Logout />}
              onClick={logout}
              sx={{ color: 'white' }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
        Supply Chain Risk Assessment
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
        Configure your supply chain monitoring and risk management system
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.title}>
            <StepLabel
              icon={step.icon}
              optional={
                index === steps.length - 1 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              <Typography variant="h6">{step.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {step.description}
              </Typography>
            </StepLabel>
            <StepContent>
              <Box sx={{ mb: 2 }}>
                {renderStepContent(index)}
              </Box>
              <Box sx={{ mb: 1 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                    disabled={!isStepValid(index) || loading}
                  >
                    {index === steps.length - 1 ? 'Complete Setup' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0 || loading}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {loading && (
        <Box sx={{ mt: 3 }}>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
            Processing your supply chain configuration...
          </Typography>
        </Box>
      )}
      </Box>
    </Box>
  );
};

// Wrap the component with ProtectedRoute
const SupplyChainOnboardingWithAuth = () => {
  return (
    <ProtectedRoute>
      <SupplyChainOnboarding />
    </ProtectedRoute>
  );
};

export default SupplyChainOnboardingWithAuth;

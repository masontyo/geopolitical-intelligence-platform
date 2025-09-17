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
  FormLabel,
  TextField,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  Alert,
  LinearProgress,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  CheckCircle,
  RadioButtonUnchecked,
  Info
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AIOnboardingFlow = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [insights, setInsights] = useState([]);
  const [fieldDefinitions, setFieldDefinitions] = useState({});

  // Field options
  const industryOptions = [
    'Manufacturing', 'Technology', 'Financial Services', 
    'Healthcare', 'Retail', 'Energy', 'Other'
  ];

  const companySizeOptions = [
    '1-10', '11-50', '51-200', '201-500', 
    '501-1000', '1001-5000', '5000+'
  ];

  const riskToleranceOptions = ['Low', 'Medium', 'High'];

  const alertFrequencyOptions = ['Real-time', 'Hourly', 'Daily', 'Weekly'];

  const concernAreasOptions = [
    'Supply Chain', 'Trade Policy', 'Labor Issues', 'Regulatory Changes',
    'Cyber Security', 'Natural Disasters', 'Political Instability', 'Economic Instability'
  ];

  const regionOptions = [
    'North America', 'Europe', 'Asia', 'Southeast Asia', 
    'Eastern Europe', 'Latin America', 'Middle East', 'Africa'
  ];

  const steps = [
    {
      label: 'Essential Business Profile',
      description: 'Basic information about your company and business',
      fields: [
        'companyName', 'industry', 'primaryBusiness', 'headquarters',
        'keyMarkets', 'companySize', 'riskTolerance', 'alertFrequency',
        'priorityRegions', 'concernAreas'
      ]
    },
    {
      label: 'Geographic Footprint',
      description: 'Where you operate, manufacture, and do business',
      fields: ['offices', 'manufacturing', 'suppliers', 'customers']
    },
    {
      label: 'Key Dependencies',
      description: 'Your most important suppliers, customers, and assets',
      fields: ['topSuppliers', 'keyCustomers', 'criticalAssets', 'importantPartners']
    },
    {
      label: 'Enhanced Data (Optional)',
      description: 'Additional information for better analysis',
      fields: ['businessUnits', 'keyPersonnel', 'revenue', 'pastIncidents']
    }
  ];

  useEffect(() => {
    loadFieldDefinitions();
    loadOnboardingStatus();
  }, []);

  const loadFieldDefinitions = async () => {
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://geopolitical-intelligence-platform.onrender.com';
      const response = await fetch(`${API_BASE_URL}/api/onboarding/fields`);
      const data = await response.json();
      setFieldDefinitions(data.fieldDefinitions);
    } catch (error) {
      console.error('Error loading field definitions:', error);
    }
  };

  const loadOnboardingStatus = async () => {
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://geopolitical-intelligence-platform.onrender.com';
      const userId = 'demo-user'; // In real app, get from auth context
      const response = await fetch(`${API_BASE_URL}/api/onboarding/status/${userId}`);
      const data = await response.json();
      
      if (data.status !== 'not_started') {
        setOnboardingData(data.onboarding || {});
        setProgress(data.completionPercentage || 0);
        setRecommendations(data.recommendations || []);
        setInsights(data.insights || []);
      }
    } catch (error) {
      console.error('Error loading onboarding status:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setOnboardingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      // Start onboarding process
      await startOnboarding();
    } else {
      // Update existing onboarding
      await updateOnboarding();
    }
    
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const startOnboarding = async () => {
    setLoading(true);
    setError(null);

    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://geopolitical-intelligence-platform.onrender.com';
      const response = await fetch(`${API_BASE_URL}/api/onboarding/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'demo-user',
          ...onboardingData
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setOnboardingData(data.onboarding);
        setProgress(data.progress.phase1.completed / data.progress.phase1.total * 100);
        setRecommendations(data.recommendations);
        setInsights(data.insights);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to start onboarding');
      console.error('Error starting onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOnboarding = async () => {
    setLoading(true);
    setError(null);

    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://geopolitical-intelligence-platform.onrender.com';
      const response = await fetch(`${API_BASE_URL}/api/onboarding/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'demo-user',
          updates: onboardingData
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setOnboardingData(data.onboarding);
        setProgress(data.completionPercentage);
        setRecommendations(data.recommendations);
        setInsights(data.insights);
        
        if (data.isComplete) {
          // Onboarding completed, redirect to dashboard
          navigate('/dashboard');
        }
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to update onboarding');
      console.error('Error updating onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    setError(null);

    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://geopolitical-intelligence-platform.onrender.com';
      const response = await fetch(`${API_BASE_URL}/api/onboarding/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'demo-user'
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Onboarding completed, redirect to dashboard
        navigate('/dashboard');
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to complete onboarding');
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    const value = onboardingData[field] || '';
    const definition = fieldDefinitions[field];

    switch (field) {
      case 'companyName':
      case 'primaryBusiness':
      case 'headquarters':
        return (
          <TextField
            fullWidth
            label={definition?.description || field}
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            required
          />
        );

      case 'industry':
      case 'companySize':
      case 'riskTolerance':
      case 'alertFrequency':
        const options = field === 'industry' ? industryOptions :
                      field === 'companySize' ? companySizeOptions :
                      field === 'riskTolerance' ? riskToleranceOptions :
                      alertFrequencyOptions;

        return (
          <FormControl fullWidth required>
            <FormLabel>{definition?.description || field}</FormLabel>
            <Select
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
            >
              {options.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'keyMarkets':
      case 'priorityRegions':
      case 'concernAreas':
        const multiOptions = field === 'concernAreas' ? concernAreasOptions : regionOptions;
        
        return (
          <Autocomplete
            multiple
            options={multiOptions}
            value={value || []}
            onChange={(_, newValue) => handleInputChange(field, newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={definition?.description || field}
                placeholder="Select options..."
                required
              />
            )}
          />
        );

      default:
        return (
          <TextField
            fullWidth
            label={definition?.description || field}
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            multiline
            rows={3}
          />
        );
    }
  };

  const renderStepContent = (stepIndex) => {
    const step = steps[stepIndex];
    
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          {step.description}
        </Typography>
        
        {step.fields.map(field => (
          <Box key={field} sx={{ mb: 3 }}>
            {renderField(field)}
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        AI-Powered Onboarding
      </Typography>
      
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Help us understand your business so we can provide personalized geopolitical intelligence
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {insights.length > 0 && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.50' }}>
          <Typography variant="h6" gutterBottom>
            AI Insights
          </Typography>
          <List dense>
            {insights.map((insight, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Info color="primary" />
                </ListItemIcon>
                <ListItemText primary={insight} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      <Card>
        <CardContent>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  {step.label}
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </StepLabel>
                <StepContent>
                  {renderStepContent(index)}
                  
                  <Box sx={{ mb: 2 }}>
                    <div>
                      <Button
                        variant="contained"
                        onClick={index === steps.length - 1 ? handleComplete : handleNext}
                        disabled={loading}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {loading ? 'Processing...' : 
                         index === steps.length - 1 ? 'Complete Onboarding' : 'Next'}
                      </Button>
                      
                      {index > 0 && (
                        <Button
                          onClick={handleBack}
                          disabled={loading}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Back
                        </Button>
                      )}
                    </div>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {progress > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Progress: {Math.round(progress)}%
          </Typography>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}

      {recommendations.length > 0 && (
        <Paper sx={{ p: 2, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recommended Next Steps
          </Typography>
          <List dense>
            {recommendations.map((rec, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <RadioButtonUnchecked color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={rec.field}
                  secondary={`${rec.phase} - ${rec.description}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default AIOnboardingFlow;

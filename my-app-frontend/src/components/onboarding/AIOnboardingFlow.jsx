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
  ListItemIcon
} from '@mui/material';
import {
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

  // Get fields based on industry selection
  const getStepFields = (stepIndex) => {
    const industry = onboardingData.industry;
    
    const baseSteps = [
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
        description: 'Where you operate and do business',
        fields: []
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

    // Customize Geographic Footprint based on industry
    if (stepIndex === 1) {
      const manufacturingIndustries = ['Manufacturing', 'Energy'];
      const serviceIndustries = ['Financial Services', 'Technology', 'Healthcare'];
      
      let geoFields = ['offices']; // All companies have offices
      
      if (manufacturingIndustries.includes(industry)) {
        // Manufacturing companies need manufacturing facilities and suppliers
        geoFields = ['offices', 'manufacturing', 'suppliers'];
        baseSteps[1].description = 'Where you operate, manufacture, and source materials';
      } else if (serviceIndustries.includes(industry)) {
        // Service companies focus on offices and service delivery regions
        geoFields = ['offices', 'serviceRegions'];
        baseSteps[1].description = 'Where you operate and deliver services';
      } else if (industry === 'Retail') {
        // Retail has stores, suppliers, and distribution
        geoFields = ['offices', 'stores', 'suppliers', 'distribution'];
        baseSteps[1].description = 'Where you operate, sell, and source products';
      } else {
        // Default for Other or unselected
        geoFields = ['offices', 'operatingRegions'];
        baseSteps[1].description = 'Where you operate and do business';
      }
      
      baseSteps[1].fields = geoFields;
    }

    return baseSteps[stepIndex];
  };


  useEffect(() => {
    loadOnboardingStatus();
  }, []);

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
    
    if (activeStep < 3) { // We have 4 steps (0, 1, 2, 3)
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

  // Field configurations with user-friendly labels, descriptions, and placeholders
  const getFieldConfig = (field) => {
    const configs = {
      companyName: {
        label: 'Company Name',
        description: 'What is your company called?',
        placeholder: 'e.g., Acme Corporation, Tesla Inc., Johnson & Johnson',
        helperText: 'Enter your official company name as it appears in business documents'
      },
      industry: {
        label: 'Industry Sector',
        description: 'What industry does your company operate in?',
        helperText: 'This helps us understand industry-specific risks and regulations'
      },
      primaryBusiness: {
        label: 'Primary Business Activity',
        description: 'What does your company primarily do?',
        placeholder: 'e.g., Manufacturing automotive parts, Providing cloud software solutions, Operating retail stores',
        helperText: 'Describe your main business activities in a few words'
      },
      headquarters: {
        label: 'Headquarters Location',
        description: 'Where is your main office located?',
        placeholder: 'e.g., New York, NY, USA or London, United Kingdom',
        helperText: 'City and country of your primary business location'
      },
      keyMarkets: {
        label: 'Key Markets',
        description: 'Which regions do you sell products or services in?',
        helperText: 'Select all regions where you have customers or generate revenue'
      },
      priorityRegions: {
        label: 'Priority Monitoring Regions',
        description: 'Which regions are most critical for you to monitor?',
        helperText: 'These regions will get extra attention in our risk monitoring'
      },
      companySize: {
        label: 'Company Size',
        description: 'How many employees does your company have?',
        helperText: 'This helps us scale risk assessments to your organization size'
      },
      riskTolerance: {
        label: 'Risk Tolerance',
        description: 'How much risk is your company comfortable with?',
        helperText: 'Low = Conservative approach, High = More aggressive, willing to accept higher risks'
      },
      alertFrequency: {
        label: 'Alert Frequency',
        description: 'How often would you like to receive risk alerts?',
        helperText: 'Real-time for critical situations, Daily for regular monitoring'
      },
      concernAreas: {
        label: 'Risk Areas of Concern',
        description: 'What types of risks are you most worried about?',
        helperText: 'Select all risk categories that could significantly impact your business'
      },
      offices: {
        label: 'Office Locations',
        description: 'Where do you have offices or facilities?',
        placeholder: 'e.g., Regional sales office in Tokyo, Manufacturing facility in Mexico City',
        helperText: 'List all significant office locations and their purpose'
      },
      manufacturing: {
        label: 'Manufacturing Facilities',
        description: 'Where do you manufacture products?',
        placeholder: 'e.g., Electronics assembly in Shenzhen, China',
        helperText: 'Include all production facilities and what they produce'
      },
      suppliers: {
        label: 'Supplier Regions',
        description: 'Where are your key suppliers located?',
        placeholder: 'e.g., Raw materials from Southeast Asia, Components from Germany',
        helperText: 'Regions where you source materials, components, or services'
      },
      customers: {
        label: 'Customer Regions',
        description: 'Where are your main customers located?',
        placeholder: 'e.g., Enterprise clients in North America, Retail customers in Europe',
        helperText: 'Geographic distribution of your customer base'
      },
      topSuppliers: {
        label: 'Top Suppliers',
        description: 'Who are your most important suppliers?',
        placeholder: 'e.g., Intel (semiconductors), DHL (logistics), AWS (cloud services)',
        helperText: 'Key suppliers whose disruption would significantly impact your business'
      },
      keyCustomers: {
        label: 'Key Customers',
        description: 'Who are your most important customers?',
        placeholder: 'e.g., Major retail chains, Government contracts, Enterprise accounts',
        helperText: 'Important customers that represent significant revenue'
      },
      criticalAssets: {
        label: 'Critical Assets',
        description: 'What are your most important business assets?',
        placeholder: 'e.g., Data centers, Patent portfolio, Brand reputation, Key personnel',
        helperText: 'Assets whose loss or damage would severely impact operations'
      },
      importantPartners: {
        label: 'Important Partners',
        description: 'Who are your key business partners?',
        placeholder: 'e.g., Technology partners, Distribution partners, Joint venture partners',
        helperText: 'Strategic partners critical to your business operations'
      },
      businessUnits: {
        label: 'Business Units',
        description: 'What are your main business divisions?',
        placeholder: 'e.g., Consumer Electronics, Enterprise Software, Financial Services',
        helperText: 'Major divisions or business units within your organization'
      },
      keyPersonnel: {
        label: 'Key Personnel',
        description: 'Who are the most important people in your organization?',
        placeholder: 'e.g., CEO, CTO, Head of Operations, Key sales leaders',
        helperText: 'Leadership and critical personnel whose absence would impact operations'
      },
      revenue: {
        label: 'Annual Revenue Range',
        description: 'What is your approximate annual revenue?',
        helperText: 'This helps us understand your company scale and risk exposure'
      },
      pastIncidents: {
        label: 'Past Risk Incidents',
        description: 'What major risks has your company faced before?',
        placeholder: 'e.g., Supply chain disruption in 2020, Cyber attack in 2019, Natural disaster impact',
        helperText: 'Previous incidents help us understand your risk patterns and vulnerabilities'
      },
      serviceRegions: {
        label: 'Service Delivery Regions',
        description: 'Where do you deliver services to clients?',
        placeholder: 'e.g., Investment banking in NYC and London, Software services globally, Healthcare in California',
        helperText: 'Regions where you actively provide services or have client operations'
      },
      stores: {
        label: 'Store/Retail Locations',
        description: 'Where are your retail stores or sales locations?',
        placeholder: 'e.g., 500 stores across North America, Flagship stores in major European cities',
        helperText: 'Physical retail locations where customers can purchase your products'
      },
      distribution: {
        label: 'Distribution Centers',
        description: 'Where are your distribution and logistics hubs?',
        placeholder: 'e.g., Distribution centers in Ohio and Nevada, Fulfillment centers in EU',
        helperText: 'Warehouses and distribution centers that support your retail operations'
      },
      operatingRegions: {
        label: 'Operating Regions',
        description: 'Where does your company have significant operations?',
        placeholder: 'e.g., Project offices in emerging markets, Field operations in oil-producing regions',
        helperText: 'Regions where you have ongoing business operations or projects'
      }
    };
    
    return configs[field] || {
      label: field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1'),
      description: `Please provide information about ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
      placeholder: `Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}...`,
      helperText: 'This information helps us provide better risk analysis'
    };
  };

  const renderField = (field) => {
    const value = onboardingData[field] || '';
    const config = getFieldConfig(field);

    switch (field) {
      case 'companyName':
      case 'primaryBusiness':
      case 'headquarters':
        return (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              {config.label} *
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {config.description}
            </Typography>
            <TextField
              fullWidth
              placeholder={config.placeholder}
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              required
              helperText={config.helperText}
            />
          </Box>
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
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              {config.label} *
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {config.description}
            </Typography>
            <FormControl fullWidth required>
              <Select
                value={value}
                onChange={(e) => handleInputChange(field, e.target.value)}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return <span style={{ color: '#999' }}>Select {config.label.toLowerCase()}</span>;
                  }
                  return selected;
                }}
              >
                {options.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
              {config.helperText && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {config.helperText}
                </Typography>
              )}
            </FormControl>
          </Box>
        );

      case 'keyMarkets':
      case 'priorityRegions':
      case 'concernAreas':
        const multiOptions = field === 'concernAreas' ? concernAreasOptions : regionOptions;
        
        return (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              {config.label} *
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {config.description}
            </Typography>
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
                    size="small"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={`Select ${config.label.toLowerCase()}...`}
                  required={value?.length === 0}
                />
              )}
            />
            {config.helperText && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                {config.helperText}
              </Typography>
            )}
          </Box>
        );

      default:
        return (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              {config.label}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {config.description}
            </Typography>
            <TextField
              fullWidth
              placeholder={config.placeholder}
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              multiline
              rows={3}
              helperText={config.helperText}
            />
          </Box>
        );
    }
  };

  const renderStepContent = (stepIndex) => {
    const step = getStepFields(stepIndex); // Get fresh step data based on current industry
    
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
          {step.description}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {stepIndex === 1 && onboardingData.industry ? 
            `Based on your ${onboardingData.industry} industry, we'll focus on the most relevant geographic information.` :
            'Complete the fields below to help our AI understand your business and provide personalized risk intelligence.'
          }
        </Typography>
        
        {step.fields.map(field => renderField(field))}
        
        {/* Show helpful note about overlap reduction */}
        {stepIndex === 1 && step.fields.length > 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              💡 <strong>Smart Form:</strong> We've customized these questions based on your {onboardingData.industry || 'selected'} industry to avoid redundancy with your earlier answers.
            </Typography>
          </Alert>
        )}
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
            {[0, 1, 2, 3].map((index) => {
              const step = getStepFields(index);
              return (
                <Step key={`step-${index}`}>
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
                          onClick={index === 3 ? handleComplete : handleNext}
                          disabled={loading}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {loading ? 'Processing...' : 
                           index === 3 ? 'Complete Onboarding' : 'Next'}
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
              );
            })}
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

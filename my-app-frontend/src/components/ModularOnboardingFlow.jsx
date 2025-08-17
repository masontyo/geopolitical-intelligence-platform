import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Container,
  Fade,
  Slide
} from "@mui/material";
import {
  Person,
  Business,
  Assessment,
  Dashboard as DashboardIcon,
  CheckCircle,
  Save,
  ArrowBack,
  ArrowForward
} from "@mui/icons-material";
import BasicInfoForm from "./onboarding/BasicInfoForm";
import SampleDashboard from "./onboarding/SampleDashboard";
import { useToast } from "./ToastNotifications";

const STEPS = [
  { 
    label: 'Profile Setup', 
    icon: <Person />, 
    description: 'Complete your profile and preferences' 
  },
  { 
    label: 'Sample Dashboard', 
    icon: <DashboardIcon />, 
    description: 'Preview your personalized experience' 
  }
];

export default function ModularOnboardingFlow() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form data state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    companySize: '',
    industry: '',
    businessUnits: [],
    riskCategories: [],
    regions: [],
    notificationFrequency: '',
    notificationMediums: []
  });
  
  const [completedSteps, setCompletedSteps] = useState(new Set());
  
  const { success, error: showError } = useToast();

  // Autosave functionality
  useEffect(() => {
    const saveData = () => {
      const onboardingData = {
        profileData,
        activeStep,
        completedSteps: Array.from(completedSteps),
        timestamp: Date.now()
      };
      localStorage.setItem('onboarding_progress', JSON.stringify(onboardingData));
    };

    // Debounced autosave
    const timeoutId = setTimeout(saveData, 1000);
    return () => clearTimeout(timeoutId);
  }, [profileData, activeStep, completedSteps]);

  // Load saved progress on mount
  useEffect(() => {
    const savedData = localStorage.getItem('onboarding_progress');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const isRecent = Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000; // 24 hours
        
        if (isRecent) {
          setProfileData(parsed.profileData || {});
          setActiveStep(parsed.activeStep || 0);
          setCompletedSteps(new Set(parsed.completedSteps || []));
        } else {
          localStorage.removeItem('onboarding_progress');
        }
      } catch (err) {
        console.error('Error loading saved progress:', err);
        localStorage.removeItem('onboarding_progress');
      }
    }
  }, []);

  const handleProfileSubmit = (data) => {
    setProfileData(data);
    setCompletedSteps(prev => new Set([...prev, 0]));
    setActiveStep(1);
    success('Profile information saved!');
  };

  const handleDashboardComplete = async () => {
    setLoading(true);
    try {
      // Here you would typically save to your backend
      console.log('Final profile data:', profileData);
      
      // Clear saved progress
      localStorage.removeItem('onboarding_progress');
      
      success('Onboarding completed successfully!');
      
      // Navigate to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (err) {
      setError('Failed to complete onboarding. Please try again.');
      showError('Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const canProceed = () => {
    switch (activeStep) {
      case 0:
        return profileData.firstName && profileData.company && profileData.industry && 
               profileData.businessUnits.length > 0 && profileData.riskCategories.length > 0 && 
               profileData.regions.length > 0 && profileData.notificationFrequency && 
               profileData.notificationMediums.length > 0;
      default:
        return true;
    }
  };

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <BasicInfoForm
            data={profileData}
            onSubmit={handleProfileSubmit}
            onError={setError}
          />
        );
      case 1:
        return (
          <SampleDashboard
            profileData={profileData}
            onComplete={handleDashboardComplete}
            onError={setError}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <CircularProgress size={60} />
          <Typography variant="h6">Completing your setup...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom color="primary">
          Welcome to Geopolitical Intelligence Platform
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Let's get you set up in under 5 minutes
        </Typography>
      </Paper>

      {/* Progress Stepper */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {STEPS.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                icon={
                  completedSteps.has(index) ? (
                    <CheckCircle color="success" />
                  ) : (
                    step.icon
                  )
                }
                sx={{
                  '& .MuiStepLabel-label': {
                    fontSize: '0.875rem',
                    fontWeight: activeStep === index ? 600 : 400
                  }
                }}
              >
                <Box>
                  <Typography variant="body2" fontWeight="inherit">
                    {step.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {step.description}
                  </Typography>
                </Box>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Content Area */}
      <Paper elevation={3} sx={{ p: 4, minHeight: 500 }}>
        <Slide direction="left" in={true} mountOnEnter unmountOnExit>
          <Box>
            {getStepContent()}
          </Box>
        </Slide>
      </Paper>

      {/* Navigation */}
      <Paper elevation={1} sx={{ p: 3, mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          disabled={activeStep === 0}
          variant="outlined"
        >
          Back
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {activeStep < STEPS.length - 1 && (
            <Button
              variant="outlined"
              onClick={() => setActiveStep(activeStep + 1)}
              disabled={!canProceed()}
            >
              Continue
            </Button>
          )}
        </Box>

        {/* Progress indicator */}
        <Typography variant="body2" color="text.secondary">
          Step {activeStep + 1} of {STEPS.length}
        </Typography>
      </Paper>

      {/* Help Section */}
      <Paper elevation={1} sx={{ p: 2, mt: 3, bgcolor: 'grey.50' }}>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          Need help? Contact support at support@geointel.com or call +1-555-INTEL-01
        </Typography>
      </Paper>
    </Container>
  );
} 
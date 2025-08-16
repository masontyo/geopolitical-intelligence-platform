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
import PersonaSelection from "./onboarding/PersonaSelection";
import BasicInfoForm from "./onboarding/BasicInfoForm";
import PersonaSpecificForm from "./onboarding/PersonaSpecificForm";
import ProfileReview from "./onboarding/ProfileReview";
import { useToast } from "./ToastNotifications";

const STEPS = [
  { 
    label: 'Basic Info', 
    icon: <Person />, 
    description: 'Name, email, organization' 
  },
  { 
    label: 'Role Selection', 
    icon: <Business />, 
    description: 'Choose your persona' 
  },
  { 
    label: 'Role Details', 
    icon: <Assessment />, 
    description: 'Role-specific information' 
  },
  { 
    label: 'Review & Complete', 
    icon: <CheckCircle />, 
    description: 'Confirm and finish' 
  }
];

export default function ModularOnboardingFlow() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form data state
  const [basicInfo, setBasicInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organization: '',
    organizationSize: ''
  });
  
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [personaData, setPersonaData] = useState({});
  const [completedSteps, setCompletedSteps] = useState(new Set());
  
  const { success, error: showError } = useToast();

  // Autosave functionality
  useEffect(() => {
    const saveData = () => {
      const onboardingData = {
        basicInfo,
        selectedPersona,
        personaData,
        activeStep,
        completedSteps: Array.from(completedSteps),
        timestamp: Date.now()
      };
      localStorage.setItem('onboarding_progress', JSON.stringify(onboardingData));
    };

    // Debounced autosave
    const timeoutId = setTimeout(saveData, 1000);
    return () => clearTimeout(timeoutId);
  }, [basicInfo, selectedPersona, personaData, activeStep, completedSteps]);

  // Load saved progress on mount
  useEffect(() => {
    const savedData = localStorage.getItem('onboarding_progress');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const isRecent = Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000; // 24 hours
        
        if (isRecent) {
          setBasicInfo(parsed.basicInfo || {});
          setSelectedPersona(parsed.selectedPersona);
          setPersonaData(parsed.personaData || {});
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

  const handleBasicInfoSubmit = (data) => {
    setBasicInfo(data);
    setCompletedSteps(prev => new Set([...prev, 0]));
    setActiveStep(1);
    success('Basic information saved!');
  };

  const handlePersonaSelection = (persona) => {
    setSelectedPersona(persona);
    setCompletedSteps(prev => new Set([...prev, 1]));
    setActiveStep(2);
    success(`${persona.name} role selected!`);
  };

  const handlePersonaDataSubmit = (data) => {
    setPersonaData(data);
    setCompletedSteps(prev => new Set([...prev, 2]));
    setActiveStep(3);
    success('Role-specific information saved!');
  };

  const handleProfileComplete = async (finalData) => {
    setLoading(true);
    try {
      // Here you would typically save to your backend
      console.log('Final onboarding data:', finalData);
      
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

  const handleSkip = () => {
    setCompletedSteps(prev => new Set([...prev, activeStep]));
    if (activeStep < STEPS.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const canProceed = () => {
    switch (activeStep) {
      case 0:
        return basicInfo.firstName && basicInfo.email && basicInfo.organization;
      case 1:
        return selectedPersona !== null;
      case 2:
        return Object.keys(personaData).length > 0;
      default:
        return true;
    }
  };

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <BasicInfoForm
            data={basicInfo}
            onSubmit={handleBasicInfoSubmit}
            onError={setError}
          />
        );
      case 1:
        return (
          <PersonaSelection
            selectedPersona={selectedPersona}
            onSelect={handlePersonaSelection}
            onError={setError}
          />
        );
      case 2:
        return (
          <PersonaSpecificForm
            persona={selectedPersona}
            data={personaData}
            onSubmit={handlePersonaDataSubmit}
            onError={setError}
          />
        );
      case 3:
        return (
          <ProfileReview
            basicInfo={basicInfo}
            persona={selectedPersona}
            personaData={personaData}
            onSubmit={handleProfileComplete}
            onError={setError}
            onEdit={() => setActiveStep(0)}
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
              onClick={handleSkip}
              disabled={!canProceed()}
            >
              Skip for now
            </Button>
          )}
          
          {activeStep < STEPS.length - 1 && (
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
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
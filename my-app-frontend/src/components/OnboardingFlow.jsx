import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Paper, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  Box,
  Alert,
  Button,
  CircularProgress
} from "@mui/material";
import { 
  Person, 
  Business, 
  Assessment, 
  Dashboard as DashboardIcon,
  CheckCircle,
  Error as ErrorIcon
} from "@mui/icons-material";
import CROOnboardingForm from "./CROOnboardingForm";
import CROProfileReview from "./CROProfileReview";
import ProfileSuggestions from "./ProfileSuggestions";
import { useToast } from "./ToastNotifications";

const steps = [
  { label: 'Profile Setup', icon: <Person />, description: 'Enter your basic information' },
  { label: 'Business Details', icon: <Business />, description: 'Define your organization and concerns' },
  { label: 'Review & Confirm', icon: <Assessment />, description: 'Review your profile information' },
  { label: 'Dashboard', icon: <DashboardIcon />, description: 'Access your intelligence dashboard' }
];

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [finalProfile, setFinalProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const { error: showError, success } = useToast();

  // Auto-save profile to localStorage
  useEffect(() => {
    if (profile) {
      localStorage.setItem('onboarding_profile', JSON.stringify(profile));
    }
  }, [profile]);

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('onboarding_profile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
        setActiveStep(1); // Move to review step
        setIsReviewing(true);
      } catch (err) {
        console.error('Error loading saved profile:', err);
        localStorage.removeItem('onboarding_profile');
      }
    }
  }, []);

  const handleProfileSubmit = async (data) => {
    console.log('CROOnboardingForm submitted, data:', data);
    setLoading(true);
    setError(null);
    
    try {
      setProfile(data);
      setActiveStep(1);
      setIsReviewing(true);
      success('Profile information saved successfully!');
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile. Please try again.');
      showError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setProfile(null);
    setIsReviewing(false);
    setActiveStep(0);
    localStorage.removeItem('onboarding_profile');
  };

  const handleContinue = () => {
    setIsReviewing(false);
    setActiveStep(2);
    // Skip suggestions and go directly to dashboard
    setFinalProfile(profile);
    success('Profile setup completed! Welcome to your dashboard.');
    localStorage.removeItem('onboarding_profile'); // Clean up
    // Store profileId in localStorage for navigation
    localStorage.setItem('currentProfileId', profile.id);
    // Navigate to dashboard
    navigate(`/dashboard/${profile.id}`);
  };

  const handleSuggestionsComplete = (suggestions) => {
    console.log('ProfileSuggestions completed, profile ID:', profile.id);
    setFinalProfile({ ...profile, enrichedSuggestions: suggestions });
    setIsSuggesting(false);
    setActiveStep(3);
    success('Profile setup completed! Welcome to your dashboard.');
    localStorage.removeItem('onboarding_profile'); // Clean up
    // Store profileId in localStorage for navigation
    localStorage.setItem('currentProfileId', profile.id);
    // Navigate to dashboard
    navigate(`/dashboard/${profile.id}`);
  };

  const handleSkipSuggestions = () => {
    setFinalProfile(profile);
    setIsSuggesting(false);
    setActiveStep(3);
    success('Profile setup completed! Welcome to your dashboard.');
    localStorage.removeItem('onboarding_profile'); // Clean up
    // Store profileId in localStorage for navigation
    localStorage.setItem('currentProfileId', profile.id);
    // Navigate to dashboard
    navigate(`/dashboard/${profile.id}`);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    showError(errorMessage);
  };

  // Navigate to the dashboard route after onboarding completion
  if (finalProfile) {
    console.log('Final profile data:', finalProfile);
    // The dashboard will be rendered by the router
    return null;
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Progress Stepper */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          Welcome to Geopolitical Intelligence Platform
        </Typography>
        
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel 
                icon={step.icon}
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
          action={
            <Button color="inherit" size="small" onClick={() => setError(null)}>
              Dismiss
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Content Area */}
      <Paper elevation={3} sx={{ p: 4, minHeight: 400 }}>
        {!profile && !loading && (
          <CROOnboardingForm 
            onSubmit={handleProfileSubmit}
            onError={handleError}
          />
        )}

        {isReviewing && profile && (
          <CROProfileReview
            profile={profile}
            onEdit={handleEdit}
            onContinue={handleContinue}
            onError={handleError}
          />
        )}


      </Paper>

      {/* Help Section */}
      <Paper elevation={1} sx={{ p: 2, mt: 3, bgcolor: 'grey.50' }}>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          Need help? Contact support at support@geointel.com or call +1-555-INTEL-01
        </Typography>
      </Paper>
    </Box>
  );
}

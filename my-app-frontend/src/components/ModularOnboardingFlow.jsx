import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Container,
  Fade
} from "@mui/material";
import {
  Person,
  Save,
  ArrowForward
} from "@mui/icons-material";
import BasicInfoForm from "./onboarding/BasicInfoForm";
import { useToast } from "./ToastNotifications";

export default function ModularOnboardingFlow() {
  const navigate = useNavigate();
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
  
  const { success, error: showError } = useToast();

  // Autosave functionality
  useEffect(() => {
    const saveData = () => {
      const onboardingData = {
        profileData,
        timestamp: Date.now()
      };
      localStorage.setItem('onboarding_progress', JSON.stringify(onboardingData));
    };

    // Debounced autosave
    const timeoutId = setTimeout(saveData, 1000);
    return () => clearTimeout(timeoutId);
  }, [profileData]);

  // Load saved progress on mount
  useEffect(() => {
    const savedData = localStorage.getItem('onboarding_progress');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const isRecent = Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000; // 24 hours
        
        if (isRecent) {
          setProfileData(parsed.profileData || {});
        } else {
          localStorage.removeItem('onboarding_progress');
        }
      } catch (err) {
        console.error('Error loading saved progress:', err);
        localStorage.removeItem('onboarding_progress');
      }
    }
  }, []);

  const handleProfileSubmit = async (data) => {
    setLoading(true);
    try {
      // Here you would typically save to your backend
      console.log('Profile data:', data);
      
      // Clear saved progress
      localStorage.removeItem('onboarding_progress');
      
      success('Profile information saved! Redirecting to dashboard...');
      
      // Navigate directly to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (err) {
      setError('Failed to save profile. Please try again.');
      showError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <CircularProgress size={60} />
          <Typography variant="h6">Setting up your dashboard...</Typography>
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
        <Fade in={true} timeout={500}>
          <Box>
            <BasicInfoForm
              data={profileData}
              onSubmit={handleProfileSubmit}
              onError={setError}
            />
          </Box>
        </Fade>
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
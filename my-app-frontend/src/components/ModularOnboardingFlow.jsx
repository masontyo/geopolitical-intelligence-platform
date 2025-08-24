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
  Business,
  CheckCircle
} from "@mui/icons-material";
import BasicInfoForm from "./onboarding/BasicInfoForm";
import { useToast } from "./ToastNotifications";

export default function ModularOnboardingFlow() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const handleProfileSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // Save profile data to localStorage
      const profileToSave = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to multiple locations for persistence
      localStorage.setItem('user_profile', JSON.stringify(profileToSave));
      localStorage.setItem('currentProfileId', profileToSave.id);
      localStorage.setItem(`profile_${profileToSave.id}`, JSON.stringify(profileToSave));
      
      // Save onboarding progress
      localStorage.setItem('onboarding_progress', JSON.stringify({
        profileData: profileToSave,
        completed: true,
        completedAt: new Date().toISOString()
      }));

      setProfileData(profileToSave);
      
      // Show success message and redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h5" gutterBottom>
            Setting up your profile...
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please wait while we configure your personalized experience
          </Typography>
        </Box>
      </Container>
    );
  }

  if (profileData) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Fade in={true} timeout={1000}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
            <Typography variant="h4" gutterBottom sx={{ color: 'success.main' }}>
              Profile Setup Complete!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Redirecting you to your personalized dashboard...
            </Typography>
            <CircularProgress size={24} />
          </Box>
        </Fade>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 4 }}>
        <BasicInfoForm 
          data={{}}
          onSubmit={handleProfileSubmit}
          onError={handleError}
        />
      </Paper>
    </Container>
  );
} 
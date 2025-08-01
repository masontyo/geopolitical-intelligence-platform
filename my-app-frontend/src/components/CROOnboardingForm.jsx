import React, { useState } from "react";
import { 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Divider, 
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  FormHelperText
} from "@mui/material";
import { userProfileAPI } from "../services/api";
import { useToast } from "./ToastNotifications";
import { LoadingSpinner, ProgressBar } from "./LoadingSpinner";
import { healthAPI } from "../services/api";

const EVENT_TYPES = [
  "Trade Disputes",
  "Sanctions",
  "Political Instability", 
  "Natural Disasters",
  "Supply Chain Disruptions",
  "Currency Fluctuations",
  "Regulatory Changes",
  "Cybersecurity Threats"
];

export default function CROOnboardingForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    companyName: '',
    hqLocation: '',
    businessUnits: '',
    supplyChainNodes: '',
    criticalRegions: '',
    eventTypesConcerned: [],
    pastDisruptions: '',
    stakeholders: '',
    deliveryPreference: 'dashboard'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const { success, error: showError } = useToast();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  }

  function handleEventTypeChange(event) {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, eventTypesConcerned: value }));
    
    if (validationErrors.eventTypesConcerned) {
      setValidationErrors(prev => ({ ...prev, eventTypesConcerned: null }));
    }
  }

  function validateForm() {
    const errors = {};
    
    if (!formData.companyName.trim()) {
      errors.companyName = 'Company name is required';
    }
    
    if (!formData.hqLocation.trim()) {
      errors.hqLocation = 'HQ location is required';
    }
    
    if (!formData.businessUnits.trim()) {
      errors.businessUnits = 'At least one business unit is required';
    }
    
    if (formData.eventTypesConcerned.length === 0) {
      errors.eventTypesConcerned = 'Please select at least one area of concern';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      showError('Please fix the validation errors before submitting');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Submitting form data:', formData);
      
      // Check server health first (optional - can be removed if too slow)
      try {
        const healthResponse = await healthAPI.checkHealth();
        console.log('Server health check:', healthResponse);
      } catch (healthError) {
        console.log('Health check failed, proceeding anyway:', healthError.message);
      }
      
      // Transform form data to match backend schema
      const profileData = {
        name: formData.companyName,
        title: 'CRO',
        company: formData.companyName,
        industry: 'Technology',
        businessUnits: (formData.businessUnits || '').split(',').map(unit => unit.trim()).filter(unit => unit).map(unit => ({
          name: unit,
          description: `${unit} business unit`,
          regions: [],
          products: []
        })),
        areasOfConcern: formData.eventTypesConcerned.map(concern => ({
          category: concern,
          description: `${concern} related concerns`,
          priority: 'medium'
        })),
        regions: (formData.criticalRegions || '').split(',').map(region => region.trim()).filter(region => region),
        riskTolerance: 'medium',
        notificationPreferences: {
          email: true,
          frequency: 'daily'
        }
      };

      console.log('Transformed profile data:', profileData);
      
      // Save to backend
      const savedProfile = await userProfileAPI.createProfile(profileData);
      
      console.log('Profile saved successfully:', savedProfile);
      console.log('Response structure:', {
        hasProfile: !!savedProfile.profile,
        profileKeys: savedProfile.profile ? Object.keys(savedProfile.profile) : 'No profile',
        profileId: savedProfile.profile?._id,
        profileIdAlt: savedProfile.profile?.id
      });
      
      // Pass the saved profile (with ID) to parent component
      // MongoDB uses _id, not id
      const profileId = savedProfile.profile._id || savedProfile.profile.id;
      console.log('Extracted profile ID:', profileId);
      
      success('Profile created successfully! Redirecting to review...');
      
      // Small delay to show success message
      setTimeout(() => {
        onSubmit({ ...formData, id: profileId });
      }, 1000);
      
    } catch (err) {
      console.error('Error saving profile:', err);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to save profile. Please try again.';
      
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please check your internet connection and try again.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Server endpoint not found. Please contact support.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      } else if (err.response?.status === 400) {
        // Handle validation errors from backend
        if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
          errorMessage = `Validation errors: ${err.response.data.errors.join(', ')}`;
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else {
          errorMessage = 'Invalid data provided. Please check your form inputs.';
        }
      } else if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        errorMessage = 'Request timed out. The server may be starting up. Please try again in a few moments.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      showError(errorMessage, 'Profile Creation Failed');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Paper elevation={3} sx={{ maxWidth: 620, mx: "auto", my: 6, p: 4 }}>
        <LoadingSpinner 
          message="Creating your profile..." 
          size="large" 
        />
        <ProgressBar 
          value={75} 
          message="Saving to database..." 
        />
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ maxWidth: 620, mx: "auto", my: 6, p: 4 }}>
      <Typography variant="h5" gutterBottom>Your Company Risk Profile</Typography>

      <Typography variant="body2" sx={{ mb: 2, background: "#eef5fc", p: 1.5, borderRadius: 1 }}>
        The more complete your profile, the more timely and targeted your intelligence will be.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Divider sx={{ my: 2 }}>Company Details</Divider>
        
        <TextField
          label="Company Name"
          name="companyName"
          fullWidth 
          required 
          sx={{ mb: 2 }}
          value={formData.companyName} 
          onChange={handleChange}
          error={!!validationErrors.companyName}
          helperText={validationErrors.companyName || "Identifies your organization for tailored reporting."}
        />
        
        <TextField
          label="HQ Location"
          name="hqLocation"
          fullWidth 
          required 
          sx={{ mb: 2 }}
          value={formData.hqLocation} 
          onChange={handleChange}
          error={!!validationErrors.hqLocation}
          helperText={validationErrors.hqLocation || "Some events (like sanctions) are jurisdiction-dependent."}
        />
        
        <TextField
          label="Business Units"
          name="businessUnits"
          fullWidth 
          sx={{ mb: 2 }}
          value={formData.businessUnits} 
          onChange={handleChange}
          error={!!validationErrors.businessUnits}
          helperText={validationErrors.businessUnits || "Allows for unit-specific risk monitoring and recommendations."}
          placeholder="e.g., Manufacturing, Sales, R&D"
        />

        <Divider sx={{ my: 2 }}>Operational Footprint</Divider>
        
        <TextField
          label="Supply Chain Nodes"
          name="supplyChainNodes"
          multiline 
          rows={2}
          fullWidth 
          sx={{ mb: 1 }}
          value={formData.supplyChainNodes}
          onChange={handleChange}
          helperText="List main nodes (factories, suppliers, ports). Gives you route-specific alerts."
        />
        
        <TextField
          label="Critical Regions"
          name="criticalRegions"
          fullWidth 
          sx={{ mb: 2 }}
          value={formData.criticalRegions} 
          onChange={handleChange}
          helperText="Regions where you have operations, suppliers, or customers."
          placeholder="e.g., China, Germany, Brazil"
        />

        <Divider sx={{ my: 2 }}>Risk Monitoring</Divider>
        
        <FormControl fullWidth sx={{ mb: 2 }} error={!!validationErrors.eventTypesConcerned}>
          <InputLabel>Areas of Concern</InputLabel>
          <Select
            multiple
            value={formData.eventTypesConcerned}
            onChange={handleEventTypeChange}
            input={<OutlinedInput label="Areas of Concern" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
          >
            {EVENT_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                <Checkbox checked={formData.eventTypesConcerned.indexOf(type) > -1} />
                <ListItemText primary={type} />
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {validationErrors.eventTypesConcerned || "Select the types of events you want to monitor."}
          </FormHelperText>
        </FormControl>

        <TextField
          label="Past Disruptions"
          name="pastDisruptions"
          multiline 
          rows={2}
          fullWidth 
          sx={{ mb: 2 }}
          value={formData.pastDisruptions} 
          onChange={handleChange}
          helperText="Describe any past geopolitical disruptions that affected your business."
        />

        <TextField
          label="Stakeholders to Alert"
          name="stakeholders"
          fullWidth 
          sx={{ mb: 2 }}
          value={formData.stakeholders} 
          onChange={handleChange}
          helperText="Who should be notified of relevant events? (e.g., CRO, Legal, Operations)"
        />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Preferred Delivery Method</InputLabel>
          <Select
            name="deliveryPreference"
            value={formData.deliveryPreference}
            onChange={handleChange}
            label="Preferred Delivery Method"
          >
            <MenuItem value="dashboard">Dashboard Only</MenuItem>
            <MenuItem value="email">Email Alerts</MenuItem>
            <MenuItem value="both">Dashboard + Email</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            size="large"
            disabled={loading}
          >
            {loading ? 'Creating Profile...' : 'Create Profile'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

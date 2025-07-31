import React, { useState } from 'react';
import {
  Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup,
  Paper, Stepper, Step, StepLabel, TextField, Typography, Divider, MenuItem, Tooltip as MUITooltip,
  Alert, CircularProgress
} from '@mui/material';
import { userProfileAPI } from '../services/api';

const eventOptions = [
  'Shipping Disruption', 'Sanctions', 'Trade Wars',
  'Regulatory Change', 'Cyber Threats', 'Resource Nationalism'
];

const initialState = {
  companyName: '',
  hqLocation: '',
  businessUnits: '',
  supplyChainNodes: '',
  criticalRegions: '',
  eventTypesConcerned: [],
  pastDisruptions: '',
  stakeholders: '',
  deliveryPreference: 'dashboard',
};

export default function CROOnboardingForm({ onSubmit }) {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((data) =>
      type === 'checkbox'
        ? {
            ...data,
            eventTypesConcerned: checked
              ? [...data.eventTypesConcerned, value]
              : data.eventTypesConcerned.filter((et) => et !== value),
          }
        : { ...data, [name]: value }
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Transform form data to match backend API structure
      const profileData = {
        name: formData.companyName,
        title: 'CRO', // Changed from 'role' to 'title'
        company: formData.companyName,
        industry: 'Technology', // Added required industry field
        businessUnits: (formData.businessUnits || '').split(',').map(unit => unit.trim()).filter(unit => unit).map(unit => ({
          name: unit,
          description: `${unit} business unit`,
          regions: [],
          products: []
        })),
        areasOfConcern: (formData.eventTypesConcerned || []).map(concern => ({
          category: concern,
          description: `${concern} related concerns`,
          priority: 'medium'
        })),
        regions: (formData.criticalRegions || '').split(',').map(region => region.trim()).filter(region => region),
        riskTolerance: 'medium', // Default value
        additionalInfo: {
          hqLocation: formData.hqLocation || '',
          supplyChainNodes: formData.supplyChainNodes || '',
          pastDisruptions: formData.pastDisruptions || '',
          stakeholders: formData.stakeholders || '',
          deliveryPreference: formData.deliveryPreference || 'dashboard'
        }
      };

      // Validate required fields
      if (!profileData.businessUnits || profileData.businessUnits.length === 0) {
        throw new Error('At least one business unit is required');
      }
      
      if (!profileData.areasOfConcern || profileData.areasOfConcern.length === 0) {
        throw new Error('At least one area of concern is required');
      }

      console.log('Submitting profile data:', profileData);
      console.log('API URL:', process.env.REACT_APP_API_URL || 'Using default URL');

      // Save to backend
      const savedProfile = await userProfileAPI.createProfile(profileData);
      
      console.log('Profile saved successfully:', savedProfile);
      
      // Pass the saved profile (with ID) to parent component
      onSubmit({ ...formData, id: savedProfile.profile.id });
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
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Paper elevation={3} sx={{ maxWidth: 620, mx: "auto", my: 6, p: 4 }}>
      <Stepper activeStep={0} alternativeLabel sx={{ mb: 3 }}>
        <Step key="Profile">
          <StepLabel>Profile Details</StepLabel>
        </Step>
        <Step key="Review">
          <StepLabel>Review</StepLabel>
        </Step>
        <Step key="Enrich">
          <StepLabel>Enrich</StepLabel>
        </Step>
      </Stepper>
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
          fullWidth required sx={{ mb: 2 }}
          value={formData.companyName} onChange={handleChange}
          helperText="Identifies your organization for tailored reporting."
        />
        <TextField
          label="HQ Location"
          name="hqLocation"
          fullWidth required sx={{ mb: 2 }}
          value={formData.hqLocation} onChange={handleChange}
          helperText="Some events (like sanctions) are jurisdiction-dependent."
        />
        <TextField
          label="Business Units"
          name="businessUnits"
          fullWidth sx={{ mb: 2 }}
          value={formData.businessUnits} onChange={handleChange}
          helperText="Allows for unit-specific risk monitoring and recommendations."
        />

        <Divider sx={{ my: 2 }}>Operational Footprint</Divider>
        <TextField
          label="Supply Chain Nodes"
          name="supplyChainNodes"
          multiline rows={2}
          fullWidth sx={{ mb: 1 }}
          value={formData.supplyChainNodes}
          onChange={handleChange}
          helperText="List main nodes (factories, suppliers, ports). Gives you route-specific alerts."
        />
        {formData.supplyChainNodes && (
          <Box sx={{ bgcolor: "#f5f5f5", p: 1, borderRadius: 1, mb: 2, fontSize: 13 }}>
            <b>Example:</b> 'Singapore port, Shenzhen factory' triggers custom alerts.
          </Box>
        )}
        <TextField
          label="Critical Regions or Routes"
          name="criticalRegions"
          fullWidth sx={{ mb: 1 }}
          value={formData.criticalRegions}
          onChange={handleChange}
          helperText="Defining key regions enables geographic filtering for updates."
        />
        {formData.criticalRegions && (
          <Box sx={{ bgcolor: "#f5f5f5", p: 1, borderRadius: 1, mb: 2, fontSize: 13 }}>
            <b>Example:</b> 'Strait of Hormuz' = Get real-time incident alerts.
          </Box>
        )}

        <Divider sx={{ my: 2 }}>Business Priorities & Risks</Divider>
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <Typography sx={{ mb: 1 }} variant="subtitle1">
            Event types of highest concern&nbsp;
            <MUITooltip title="Prioritizes actionable risk alerts (pick all that apply)">
              <span style={{ color: "#1976d2", fontWeight: 700, cursor: "pointer" }}>i</span>
            </MUITooltip>
          </Typography>
          <FormGroup row>
            {eventOptions.map((evt) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.eventTypesConcerned.includes(evt)}
                    onChange={handleChange}
                    name="eventTypesConcerned"
                    value={evt}
                  />
                }
                label={evt}
                key={evt}
              />
            ))}
          </FormGroup>
        </FormControl>
        {(!!formData.eventTypesConcerned.length) &&
          <Box sx={{ bgcolor: "#f5f5f5", p: 1, borderRadius: 1, mb: 2, fontSize: 13 }}>
            <b>Example:</b> Tick 'Cyber Threats' to get exec-level notices about regional cyber risks.
          </Box>
        }

        <TextField
          label="Describe a recent supply chain crisis or near miss"
          name="pastDisruptions"
          multiline rows={3}
          fullWidth sx={{ mb: 2 }}
          value={formData.pastDisruptions} onChange={handleChange}
          helperText="Your pain points make recommendations actionable."
        />

        <Divider sx={{ my: 2 }}>Stakeholders & Preferences</Divider>
        <TextField
          label="Who else should be alerted?"
          name="stakeholders"
          multiline rows={2}
          fullWidth sx={{ mb: 1 }}
          value={formData.stakeholders} onChange={handleChange}
          helperText="Target risk communications (Ops, Compliance, Finance, etc.)."
        />

        <TextField
          label="Preferred Report Delivery"
          name="deliveryPreference"
          select
          sx={{ width: 250, mb: 4 }}
          value={formData.deliveryPreference} onChange={handleChange}
        >
          <MenuItem value="dashboard">Dashboard</MenuItem>
          <MenuItem value="email">Email</MenuItem>
        </TextField>

        <Box sx={{ mt: 2 }}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Saving Profile...' : 'Submit & Preview Profile'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

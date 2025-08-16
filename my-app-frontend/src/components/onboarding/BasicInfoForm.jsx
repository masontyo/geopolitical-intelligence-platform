import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Paper,
  Divider,
  Alert
} from "@mui/material";
import { Person, Business, Email, BusinessCenter } from "@mui/icons-material";

const ORGANIZATION_SIZES = [
  "1-10 employees",
  "11-50 employees", 
  "51-200 employees",
  "201-500 employees",
  "501-1000 employees",
  "1001-5000 employees",
  "5001-10000 employees",
  "10000+ employees"
];

export default function BasicInfoForm({ data, onSubmit, onError }) {
  const [formData, setFormData] = useState({
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    email: data.email || '',
    organization: data.organization || '',
    organizationSize: data.organizationSize || ''
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Update form data when data prop changes
    setFormData({
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      organization: data.organization || '',
      organizationSize: data.organizationSize || ''
    });
  }, [data]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.organization.trim()) {
      errors.organization = 'Organization name is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      onError('Please fix the validation errors before continuing');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (err) {
      onError(err.message || 'Failed to save basic information');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Person color="primary" />
        Basic Information
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Let's start with the basics. This information helps us personalize your experience.
      </Typography>

      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 3, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Person fontSize="small" />
              Personal Details
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  fullWidth
                  required
                  error={!!validationErrors.firstName}
                  helperText={validationErrors.firstName || "Your first name"}
                  InputProps={{
                    startAdornment: <Person fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  fullWidth
                  required
                  error={!!validationErrors.lastName}
                  helperText={validationErrors.lastName || "Your last name"}
                  InputProps={{
                    startAdornment: <Person fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Work Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  fullWidth
                  required
                  error={!!validationErrors.email}
                  helperText={validationErrors.email || "Your work email address"}
                  InputProps={{
                    startAdornment: <Email fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Organization Information */}
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 3, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Business fontSize="small" />
              Organization Details
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <TextField
                  label="Organization Name"
                  value={formData.organization}
                  onChange={(e) => handleChange('organization', e.target.value)}
                  fullWidth
                  required
                  error={!!validationErrors.organization}
                  helperText={validationErrors.organization || "Your company or organization name"}
                  InputProps={{
                    startAdornment: <Business fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Organization Size</InputLabel>
                  <Select
                    value={formData.organizationSize}
                    onChange={(e) => handleChange('organizationSize', e.target.value)}
                    label="Organization Size"
                    startAdornment={<BusinessCenter fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />}
                  >
                    {ORGANIZATION_SIZES.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Helps us tailor recommendations</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Submit Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          sx={{ minWidth: 120 }}
        >
          {isSubmitting ? 'Saving...' : 'Continue'}
        </Button>
      </Box>
    </Box>
  );
} 
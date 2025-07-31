import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const UserProfileForm = ({ onSubmit, loading = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    role: initialData?.role || '',
    company: initialData?.company || '',
    businessUnits: initialData?.businessUnits || [],
    areasOfConcern: initialData?.areasOfConcern || [],
    regions: initialData?.regions || [],
    riskTolerance: initialData?.riskTolerance || 'medium'
  });

  const [newBusinessUnit, setNewBusinessUnit] = useState('');
  const [newAreaOfConcern, setNewAreaOfConcern] = useState('');
  const [newRegion, setNewRegion] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
    }

    if (formData.businessUnits.length === 0) {
      newErrors.businessUnits = 'At least one business unit is required';
    }

    if (formData.areasOfConcern.length === 0) {
      newErrors.areasOfConcern = 'At least one area of concern is required';
    }

    if (formData.regions.length === 0) {
      newErrors.regions = 'At least one region is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const addBusinessUnit = () => {
    if (newBusinessUnit.trim() && !formData.businessUnits.includes(newBusinessUnit.trim())) {
      setFormData(prev => ({
        ...prev,
        businessUnits: [...prev.businessUnits, newBusinessUnit.trim()]
      }));
      setNewBusinessUnit('');
      setErrors(prev => ({ ...prev, businessUnits: undefined }));
    }
  };

  const removeBusinessUnit = (unit) => {
    setFormData(prev => ({
      ...prev,
      businessUnits: prev.businessUnits.filter(bu => bu !== unit)
    }));
  };

  const addAreaOfConcern = () => {
    if (newAreaOfConcern.trim() && !formData.areasOfConcern.includes(newAreaOfConcern.trim())) {
      setFormData(prev => ({
        ...prev,
        areasOfConcern: [...prev.areasOfConcern, newAreaOfConcern.trim()]
      }));
      setNewAreaOfConcern('');
      setErrors(prev => ({ ...prev, areasOfConcern: undefined }));
    }
  };

  const removeAreaOfConcern = (concern) => {
    setFormData(prev => ({
      ...prev,
      areasOfConcern: prev.areasOfConcern.filter(aoc => aoc !== concern)
    }));
  };

  const addRegion = () => {
    if (newRegion.trim() && !formData.regions.includes(newRegion.trim())) {
      setFormData(prev => ({
        ...prev,
        regions: [...prev.regions, newRegion.trim()]
      }));
      setNewRegion('');
      setErrors(prev => ({ ...prev, regions: undefined }));
    }
  };

  const removeRegion = (region) => {
    setFormData(prev => ({
      ...prev,
      regions: prev.regions.filter(r => r !== region)
    }));
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        {initialData ? 'Update Profile' : 'Create Profile'}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label="Full Name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          error={!!errors.name}
          helperText={errors.name}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Role/Position"
          value={formData.role}
          onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
          error={!!errors.role}
          helperText={errors.role}
          margin="normal"
          required
          placeholder="e.g., CRO, CEO, Director"
        />

        <TextField
          fullWidth
          label="Company"
          value={formData.company}
          onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
          error={!!errors.company}
          helperText={errors.company}
          margin="normal"
          required
        />

        {/* Business Units */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Business Units
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              label="Add Business Unit"
              value={newBusinessUnit}
              onChange={(e) => setNewBusinessUnit(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBusinessUnit())}
              size="small"
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="outlined"
              onClick={addBusinessUnit}
              startIcon={<AddIcon />}
              disabled={!newBusinessUnit.trim()}
            >
              Add
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {formData.businessUnits.map((unit) => (
              <Chip
                key={unit}
                label={unit}
                onDelete={() => removeBusinessUnit(unit)}
                deleteIcon={<DeleteIcon />}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
          {errors.businessUnits && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {errors.businessUnits}
            </Alert>
          )}
        </Box>

        {/* Areas of Concern */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Areas of Concern
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              label="Add Area of Concern"
              value={newAreaOfConcern}
              onChange={(e) => setNewAreaOfConcern(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAreaOfConcern())}
              size="small"
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="outlined"
              onClick={addAreaOfConcern}
              startIcon={<AddIcon />}
              disabled={!newAreaOfConcern.trim()}
            >
              Add
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {formData.areasOfConcern.map((concern) => (
              <Chip
                key={concern}
                label={concern}
                onDelete={() => removeAreaOfConcern(concern)}
                deleteIcon={<DeleteIcon />}
                color="secondary"
                variant="outlined"
              />
            ))}
          </Box>
          {errors.areasOfConcern && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {errors.areasOfConcern}
            </Alert>
          )}
        </Box>

        {/* Regions */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Regions of Interest
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              label="Add Region"
              value={newRegion}
              onChange={(e) => setNewRegion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRegion())}
              size="small"
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="outlined"
              onClick={addRegion}
              startIcon={<AddIcon />}
              disabled={!newRegion.trim()}
            >
              Add
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {formData.regions.map((region) => (
              <Chip
                key={region}
                label={region}
                onDelete={() => removeRegion(region)}
                deleteIcon={<DeleteIcon />}
                color="info"
                variant="outlined"
              />
            ))}
          </Box>
          {errors.regions && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {errors.regions}
            </Alert>
          )}
        </Box>

        {/* Risk Tolerance */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Risk Tolerance</InputLabel>
          <Select
            value={formData.riskTolerance}
            label="Risk Tolerance"
            onChange={(e) => setFormData(prev => ({ ...prev, riskTolerance: e.target.value }))}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ flexGrow: 1 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              initialData ? 'Update Profile' : 'Create Profile'
            )}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default UserProfileForm; 
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Button,
  Alert,
  Divider,
  useTheme,
  IconButton,
  Autocomplete
} from '@mui/material';
import {
  Business,
  ArrowBack,
  Save,
  Refresh
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Company database with autocomplete and industry mapping
const COMPANY_DATABASE = [
  { name: "Amazon", industry: "E-commerce & Technology" },
  { name: "Microsoft", industry: "Technology & Software" },
  { name: "Apple", industry: "Technology & Consumer Electronics" },
  { name: "Google", industry: "Technology & Digital Services" },
  { name: "Tesla", industry: "Automotive & Clean Energy" },
  { name: "Walmart", industry: "Retail & E-commerce" },
  { name: "JPMorgan Chase", industry: "Financial Services & Banking" },
  { name: "Johnson & Johnson", industry: "Healthcare & Pharmaceuticals" },
  { name: "Procter & Gamble", industry: "Consumer Goods & Manufacturing" },
  { name: "ExxonMobil", industry: "Energy & Oil & Gas" }
];

// Business units/divisions - distinct and non-overlapping
const BUSINESS_UNITS = [
  "Executive Leadership",
  "Finance & Accounting",
  "Human Resources",
  "Legal & Compliance",
  "Information Technology",
  "Operations & Supply Chain",
  "Sales & Marketing",
  "Research & Development",
  "Customer Service",
  "Risk Management",
  "Internal Audit",
  "Corporate Communications",
  "Environmental, Health & Safety",
  "Data & Analytics",
  "Strategic Planning"
];

// Risk categories
const RISK_CATEGORIES = [
  "Geopolitical Risk",
  "Supply Chain Risk",
  "Cybersecurity Risk",
  "Financial Risk",
  "Regulatory Risk",
  "Operational Risk",
  "Reputational Risk",
  "Environmental Risk",
  "Technology Risk",
  "Market Risk",
  "Compliance Risk",
  "Strategic Risk"
];

// Regions of interest
const REGIONS = [
  "North America",
  "Europe",
  "Asia Pacific",
  "Latin America",
  "Middle East",
  "Africa",
  "Central Asia",
  "Caribbean",
  "Oceania"
];

// Company sizes
const COMPANY_SIZES = [
  "1-10 employees",
  "11-50 employees", 
  "51-200 employees",
  "201-1,000 employees",
  "1,001-10,000 employees",
  "10,001+ employees"
];

// Industries
const INDUSTRIES = [
  "Technology & Software",
  "E-commerce & Technology",
  "Technology & Consumer Electronics",
  "Technology & Digital Services",
  "Automotive & Clean Energy",
  "Retail & E-commerce",
  "Financial Services & Banking",
  "Healthcare & Pharmaceuticals",
  "Consumer Goods & Manufacturing",
  "Energy & Oil & Gas",
  "Beverages & Consumer Goods",
  "Food & Restaurant Services",
  "Apparel & Sports Equipment",
  "Entertainment & Media",
  "Entertainment & Streaming",
  "Food & Beverage Services",
  "Logistics & Transportation",
  "Aerospace & Defense",
  "Industrial & Manufacturing",
  "Technology & Consulting",
  "Real Estate",
  "Education",
  "Government & Public Sector",
  "Non-Profit",
  "Agriculture",
  "Construction",
  "Media & Communications",
  "Professional Services",
  "Other"
];

export default function CompanyProfile() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    company: '',
    companySize: '',
    industry: '',
    businessUnits: [],
    riskCategories: [],
    regions: []
  });

  // Load existing profile data
  useEffect(() => {
    const loadProfile = () => {
      try {
        const userProfile = localStorage.getItem('user_profile');
        if (userProfile) {
          const parsed = JSON.parse(userProfile);
          setFormData({
            company: parsed.company || '',
            companySize: parsed.companySize || '',
            industry: parsed.industry || '',
            businessUnits: parsed.businessUnits || [],
            riskCategories: parsed.riskCategories || [],
            regions: parsed.regions || []
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get existing profile data
      const existingProfile = localStorage.getItem('user_profile');
      const currentProfile = existingProfile ? JSON.parse(existingProfile) : {};
      
      // Update with new company data
      const updatedProfile = {
        ...currentProfile,
        ...formData
      };
      
      // Save back to localStorage
      localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      
    } catch (err) {
      setError('Failed to save company profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    const loadProfile = () => {
      try {
        const userProfile = localStorage.getItem('user_profile');
        if (userProfile) {
          const parsed = JSON.parse(userProfile);
          setFormData({
            company: parsed.company || '',
            companySize: parsed.companySize || '',
            industry: parsed.industry || '',
            businessUnits: parsed.businessUnits || [],
            riskCategories: parsed.riskCategories || [],
            regions: parsed.regions || []
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    
    loadProfile();
    setSaved(false);
    setError(null);
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <IconButton onClick={() => navigate('/settings')} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Business color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Company Profile
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Manage your company information, business units, and risk preferences
        </Typography>
      </Box>

      {/* Success/Error Messages */}
      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Company profile saved successfully!
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Company Information */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Company Information
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              fullWidth
              options={COMPANY_DATABASE}
              getOptionLabel={(option) => option.name}
              value={COMPANY_DATABASE.find(company => company.name === formData.company) || null}
              onChange={(event, newValue) => {
                if (newValue) {
                  handleChange('company', newValue.name);
                  handleChange('industry', newValue.industry);
                } else {
                  handleChange('company', '');
                  handleChange('industry', '');
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Company Name"
                  placeholder="Start typing company name..."
                />
              )}
              freeSolo
              onInputChange={(event, newInputValue) => {
                if (!newInputValue) {
                  handleChange('company', '');
                  handleChange('industry', '');
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Company Size</InputLabel>
              <Select
                value={formData.companySize}
                onChange={(e) => handleChange('companySize', e.target.value)}
                label="Company Size"
              >
                {COMPANY_SIZES.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Industry</InputLabel>
              <Select
                value={formData.industry}
                onChange={(e) => handleChange('industry', e.target.value)}
                label="Industry"
              >
                {INDUSTRIES.map((industry) => (
                  <MenuItem key={industry} value={industry}>
                    {industry}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Business Units */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Business Units & Divisions
        </Typography>
        
        <FormControl fullWidth>
          <InputLabel>Business Units</InputLabel>
          <Select
            multiple
            value={formData.businessUnits}
            onChange={(e) => handleChange('businessUnits', e.target.value)}
            input={<OutlinedInput label="Business Units" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
          >
            {BUSINESS_UNITS.map((unit) => (
              <MenuItem key={unit} value={unit}>
                <Checkbox checked={formData.businessUnits.indexOf(unit) > -1} />
                <ListItemText primary={unit} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Risk Categories */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Risk Categories
        </Typography>
        
        <FormControl fullWidth>
          <InputLabel>Risk Categories</InputLabel>
          <Select
            multiple
            value={formData.riskCategories}
            onChange={(e) => handleChange('riskCategories', e.target.value)}
            input={<OutlinedInput label="Risk Categories" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
          >
            {RISK_CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                <Checkbox checked={formData.riskCategories.indexOf(category) > -1} />
                <ListItemText primary={category} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Regions of Interest */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Regions of Interest
        </Typography>
        
        <FormControl fullWidth>
          <InputLabel>Regions</InputLabel>
          <Select
            multiple
            value={formData.regions}
            onChange={(e) => handleChange('regions', e.target.value)}
            input={<OutlinedInput label="Regions" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
          >
            {REGIONS.map((region) => (
              <MenuItem key={region} value={region}>
                <Checkbox checked={formData.regions.indexOf(region) > -1} />
                <ListItemText primary={region} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleReset}
          disabled={loading}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
    </Box>
  );
} 
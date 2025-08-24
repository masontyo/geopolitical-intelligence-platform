import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  FormHelperText,
  Paper,
  Divider,
  Alert,
  Checkbox,
  ListItemText,
  OutlinedInput
} from "@mui/material";
import {
  Business,
  LocationOn,
  Notifications,
  Security,
  TrendingUp,
  ArrowForward
} from "@mui/icons-material";

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
  { name: "ExxonMobil", industry: "Energy & Oil & Gas" },
  { name: "Coca-Cola", industry: "Beverages & Consumer Goods" },
  { name: "McDonald's", industry: "Food & Restaurant Services" },
  { name: "Nike", industry: "Apparel & Sports Equipment" },
  { name: "Disney", industry: "Entertainment & Media" },
  { name: "Netflix", industry: "Entertainment & Streaming" },
  { name: "Starbucks", industry: "Food & Beverage Services" },
  { name: "FedEx", industry: "Logistics & Transportation" },
  { name: "Boeing", industry: "Aerospace & Defense" },
  { name: "General Electric", industry: "Industrial & Manufacturing" },
  { name: "IBM", industry: "Technology & Consulting" }
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

// Notification preferences
const NOTIFICATION_FREQUENCIES = [
  { value: "immediate", label: "Immediate - Real-time alerts" },
  { value: "hourly", label: "Hourly - Batched updates" },
  { value: "daily", label: "Daily - Summary reports" },
  { value: "weekly", label: "Weekly - Trend analysis" }
];

const NOTIFICATION_MEDIUMS = [
  "Email",
  "Dashboard alerts",
  "Mobile push notifications",
  "SMS",
  "Slack/Teams integration"
];

export default function BasicInfoForm({ data, onSubmit, onError }) {
  const [formData, setFormData] = useState({
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    company: data.company || '',
    companySize: data.companySize || '',
    industry: data.industry || '',
    businessUnits: data.businessUnits || [],
    riskCategories: data.riskCategories || [],
    regions: data.regions || [],
    notificationFrequency: data.notificationFrequency || '',
    notificationMediums: data.notificationMediums || []
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [companySuggestions, setCompanySuggestions] = useState([]);

  // Handle company search and industry autofill
  const handleCompanyChange = (value) => {
    setFormData(prev => ({ ...prev, company: value }));
    
    if (value) {
      const suggestions = COMPANY_DATABASE.filter(company =>
        company.name.toLowerCase().includes(value.toLowerCase())
      );
      setCompanySuggestions(suggestions);
    } else {
      setCompanySuggestions([]);
    }
  };

  // Handle company selection and auto-fill industry
  const handleCompanySelect = (company) => {
    setFormData(prev => ({
      ...prev,
      company: company.name,
      industry: company.industry
    }));
    setCompanySuggestions([]);
  };

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[fieldName]) {
      setValidationErrors(prev => ({ ...prev, [fieldName]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName?.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName?.trim()) errors.lastName = 'Last name is required';
    if (!formData.company?.trim()) errors.company = 'Company name is required';
    if (!formData.companySize) errors.companySize = 'Company size is required';
    if (!formData.industry?.trim()) errors.industry = 'Industry is required';
    if (formData.businessUnits.length === 0) errors.businessUnits = 'Please select at least one business unit';
    if (formData.riskCategories.length === 0) errors.riskCategories = 'Please select at least one risk category';
    if (formData.regions.length === 0) errors.regions = 'Please select at least one region';
    if (!formData.notificationFrequency) errors.notificationFrequency = 'Notification frequency is required';
    if (formData.notificationMediums.length === 0) errors.notificationMediums = 'Please select at least one notification medium';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
        Let's Get Started
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
        Tell us about yourself and your organization to personalize your experience
      </Typography>

      {/* Personal Information */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Business color="primary" />
          Personal Information
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              error={!!validationErrors.firstName}
              helperText={validationErrors.firstName}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              error={!!validationErrors.lastName}
              helperText={validationErrors.lastName}
              required
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Company Information */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Business color="primary" />
          Company Information
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              freeSolo
              options={companySuggestions}
              getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
              inputValue={formData.company}
              onInputChange={(event, value) => handleCompanyChange(value)}
              onChange={(event, value) => {
                if (value && typeof value === 'object') {
                  handleCompanySelect(value);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Company Name"
                  error={!!validationErrors.company}
                  helperText={validationErrors.company || "Start typing to search or enter manually"}
                  required
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!validationErrors.industry} required>
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
              {validationErrors.industry && (
                <FormHelperText>{validationErrors.industry}</FormHelperText>
              )}
              <FormHelperText>
                Auto-filled from company selection, but you can change it
              </FormHelperText>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!validationErrors.companySize} required>
              <InputLabel>Company Size</InputLabel>
              <Select
                value={formData.companySize}
                onChange={(e) => handleChange('companySize', e.target.value)}
                label="Company Size"
                sx={{ minWidth: 200 }}
              >
                {COMPANY_SIZES.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
              {validationErrors.companySize && (
                <FormHelperText>{validationErrors.companySize}</FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Business Units */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUp color="primary" />
          Business Units & Divisions
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select the business units or divisions you work with or oversee
        </Typography>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Example:</strong> If you select "Risk Management" and "Supply Chain", you'll see alerts like 
            "Supply chain disruption in Asia Pacific affecting your risk profile" and 
            "New regulations in Europe requiring risk assessment updates"
          </Typography>
        </Alert>
        
        <FormControl fullWidth error={!!validationErrors.businessUnits} required>
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
          {validationErrors.businessUnits && (
            <FormHelperText>{validationErrors.businessUnits}</FormHelperText>
          )}
        </FormControl>
      </Paper>

      {/* Risk Categories */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Security color="primary" />
          Risk Categories
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select the risk categories most relevant to your organization
        </Typography>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Example:</strong> Choosing "Supply Chain Risk" will show you alerts about port closures, 
            supplier disruptions, and logistics delays. Selecting "Regulatory Risk" will highlight new compliance 
            requirements and policy changes.
          </Typography>
        </Alert>
        
        <FormControl fullWidth error={!!validationErrors.riskCategories} required>
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
          {validationErrors.riskCategories && (
            <FormHelperText>{validationErrors.riskCategories}</FormHelperText>
          )}
        </FormControl>
      </Paper>

      {/* Regions of Interest */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationOn color="primary" />
          Regions of Interest
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select the regions where you have operations, suppliers, or customers
        </Typography>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Example:</strong> Selecting "Asia Pacific" will show you alerts about trade tensions, 
            supply chain disruptions, and regulatory changes in that region. Choosing "Europe" will highlight 
            GDPR updates, Brexit impacts, and EU policy changes.
          </Typography>
        </Alert>
        
        <FormControl fullWidth error={!!validationErrors.regions} required>
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
          {validationErrors.regions && (
            <FormHelperText>{validationErrors.regions}</FormHelperText>
          )}
        </FormControl>
      </Paper>

      {/* Notification Preferences */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, bgcolor: 'grey.50' }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Notifications color="primary" />
          Notification Preferences
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!validationErrors.notificationFrequency} required>
              <InputLabel>Notification Frequency</InputLabel>
              <Select
                value={formData.notificationFrequency}
                onChange={(e) => handleChange('notificationFrequency', e.target.value)}
                label="Notification Frequency"
                sx={{ minWidth: 200 }}
              >
                {NOTIFICATION_FREQUENCIES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {validationErrors.notificationFrequency && (
                <FormHelperText>{validationErrors.notificationFrequency}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!validationErrors.notificationMediums} required>
              <InputLabel>Notification Mediums</InputLabel>
              <Select
                multiple
                value={formData.notificationMediums}
                onChange={(e) => handleChange('notificationMediums', e.target.value)}
                input={<OutlinedInput label="Notification Mediums" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
                sx={{ minWidth: 200 }}
              >
                {NOTIFICATION_MEDIUMS.map((medium) => (
                  <MenuItem key={medium} value={medium}>
                    <Checkbox checked={formData.notificationMediums.indexOf(medium) > -1} />
                    <ListItemText primary={medium} />
                  </MenuItem>
                ))}
              </Select>
              {validationErrors.notificationMediums && (
                <FormHelperText>{validationErrors.notificationMediums}</FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Divider sx={{ my: 4 }} />

      {/* Complete Setup Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          type="button"
          variant="contained"
          size="large"
          endIcon={<ArrowForward />}
          sx={{ minWidth: 200 }}
          onClick={() => onSubmit(formData)}
        >
          Complete Setup & Go to Dashboard
        </Button>
      </Box>
    </Box>
  );
} 
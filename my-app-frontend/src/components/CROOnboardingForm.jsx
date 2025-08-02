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
  FormHelperText,
  Autocomplete
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

// Common business units for autocomplete
const BUSINESS_UNITS = [
  "Manufacturing",
  "Research & Development",
  "Sales",
  "Marketing",
  "Finance",
  "Human Resources",
  "Legal",
  "Operations",
  "Supply Chain",
  "Logistics",
  "Customer Service",
  "Information Technology",
  "Quality Assurance",
  "Engineering",
  "Product Development",
  "Business Development",
  "Strategy",
  "Risk Management",
  "Compliance",
  "Procurement",
  "Facilities",
  "Security",
  "Communications",
  "Public Relations",
  "Investor Relations",
  "Corporate Affairs",
  "Sustainability",
  "Innovation",
  "Digital Transformation",
  "Data Analytics"
].sort();

// Common supply chain nodes for autocomplete
const SUPPLY_CHAIN_NODES = [
  "Raw Material Suppliers",
  "Component Manufacturers",
  "Assembly Plants",
  "Distribution Centers",
  "Warehouses",
  "Ports",
  "Airports",
  "Railway Hubs",
  "Trucking Companies",
  "Freight Forwarders",
  "Customs Brokers",
  "Third-Party Logistics",
  "Retail Stores",
  "E-commerce Platforms",
  "Wholesale Distributors",
  "Service Centers",
  "Recycling Facilities",
  "Quality Control Labs",
  "Testing Facilities",
  "Packaging Suppliers",
  "Transportation Hubs",
  "Cold Storage Facilities",
  "Bonded Warehouses",
  "Cross-Dock Facilities",
  "Fulfillment Centers"
].sort();

// Comprehensive list of world regions and countries for autocomplete
const WORLD_REGIONS = [
  // Major Regions
  "Asia Pacific",
  "Europe",
  "North America", 
  "South America",
  "Africa",
  "Middle East",
  "Central Asia",
  "Southeast Asia",
  "East Asia",
  "Western Europe",
  "Eastern Europe",
  "Northern Europe",
  "Southern Europe",
  "Central America",
  "Caribbean",
  "Sub-Saharan Africa",
  "North Africa",
  "West Africa",
  "East Africa",
  "Southern Africa",
  "Central Africa",
  
  // Major Countries
  "United States",
  "China",
  "Japan",
  "Germany",
  "United Kingdom",
  "France",
  "India",
  "Italy",
  "Brazil",
  "Canada",
  "South Korea",
  "Russia",
  "Australia",
  "Spain",
  "Mexico",
  "Indonesia",
  "Netherlands",
  "Saudi Arabia",
  "Turkey",
  "Switzerland",
  "Poland",
  "Sweden",
  "Belgium",
  "Thailand",
  "Austria",
  "Norway",
  "Israel",
  "Singapore",
  "Denmark",
  "Finland",
  "Chile",
  "Czech Republic",
  "Portugal",
  "New Zealand",
  "Greece",
  "Hungary",
  "Ireland",
  "Slovakia",
  "Luxembourg",
  "Slovenia",
  "Estonia",
  "Latvia",
  "Lithuania",
  "Malta",
  "Cyprus",
  "Croatia",
  "Bulgaria",
  "Romania",
  "Serbia",
  "Ukraine",
  "Belarus",
  "Moldova",
  "Georgia",
  "Armenia",
  "Azerbaijan",
  "Kazakhstan",
  "Uzbekistan",
  "Kyrgyzstan",
  "Tajikistan",
  "Turkmenistan",
  "Mongolia",
  "Vietnam",
  "Philippines",
  "Malaysia",
  "Myanmar",
  "Cambodia",
  "Laos",
  "Brunei",
  "Timor-Leste",
  "Taiwan",
  "Hong Kong",
  "Macau",
  "North Korea",
  "South Korea",
  "Bangladesh",
  "Pakistan",
  "Sri Lanka",
  "Nepal",
  "Bhutan",
  "Maldives",
  "Afghanistan",
  "Iran",
  "Iraq",
  "Syria",
  "Lebanon",
  "Jordan",
  "Palestine",
  "Yemen",
  "Oman",
  "United Arab Emirates",
  "Qatar",
  "Bahrain",
  "Kuwait",
  "Egypt",
  "Libya",
  "Tunisia",
  "Algeria",
  "Morocco",
  "Sudan",
  "South Sudan",
  "Ethiopia",
  "Eritrea",
  "Djibouti",
  "Somalia",
  "Kenya",
  "Uganda",
  "Tanzania",
  "Rwanda",
  "Burundi",
  "Democratic Republic of the Congo",
  "Republic of the Congo",
  "Gabon",
  "Equatorial Guinea",
  "Cameroon",
  "Central African Republic",
  "Chad",
  "Niger",
  "Nigeria",
  "Benin",
  "Togo",
  "Ghana",
  "Ivory Coast",
  "Liberia",
  "Sierra Leone",
  "Guinea",
  "Guinea-Bissau",
  "Senegal",
  "Gambia",
  "Mauritania",
  "Mali",
  "Burkina Faso",
  "Niger",
  "Chad",
  "South Africa",
  "Namibia",
  "Botswana",
  "Zimbabwe",
  "Zambia",
  "Malawi",
  "Mozambique",
  "Madagascar",
  "Comoros",
  "Mauritius",
  "Seychelles",
  "Argentina",
  "Brazil",
  "Chile",
  "Colombia",
  "Ecuador",
  "Guyana",
  "Paraguay",
  "Peru",
  "Suriname",
  "Uruguay",
  "Venezuela",
  "Bolivia",
  "Panama",
  "Costa Rica",
  "Nicaragua",
  "Honduras",
  "El Salvador",
  "Guatemala",
  "Belize",
  "Cuba",
  "Jamaica",
  "Haiti",
  "Dominican Republic",
  "Puerto Rico",
  "Trinidad and Tobago",
  "Barbados",
  "Grenada",
  "Saint Vincent and the Grenadines",
  "Saint Lucia",
  "Dominica",
  "Antigua and Barbuda",
  "Saint Kitts and Nevis",
  "Bahamas",
  "Fiji",
  "Papua New Guinea",
  "Solomon Islands",
  "Vanuatu",
  "New Caledonia",
  "French Polynesia",
  "Samoa",
  "Tonga",
  "Tuvalu",
  "Kiribati",
  "Marshall Islands",
  "Micronesia",
  "Palau",
  "Nauru"
].sort();

export default function CROOnboardingForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    hqLocation: '',
    businessUnits: [],
    supplyChainNodes: [],
    criticalRegions: [],
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
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.hqLocation.trim()) {
      errors.hqLocation = 'HQ location is required';
    }
    
    if (formData.businessUnits.length === 0) {
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
        email: formData.email,
        industry: 'Technology',
        businessUnits: (formData.businessUnits || []).map(unit => ({
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
        regions: formData.criticalRegions || [],
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
          label="Email Address"
          name="email"
          type="email"
          fullWidth 
          required 
          sx={{ mb: 2 }}
          value={formData.email} 
          onChange={handleChange}
          error={!!validationErrors.email}
          helperText={validationErrors.email || "Used for notifications and alerts about relevant events."}
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
        
                 <Autocomplete
           multiple
           freeSolo
           options={BUSINESS_UNITS}
           value={formData.businessUnits}
           onChange={(event, newValue) => {
             setFormData(prev => ({ ...prev, businessUnits: newValue }));
             if (validationErrors.businessUnits) {
               setValidationErrors(prev => ({ ...prev, businessUnits: null }));
             }
           }}
           filterOptions={(options, { inputValue }) => {
             const filtered = options.filter(option =>
               option.toLowerCase().includes(inputValue.toLowerCase())
             );
             // Remove duplicates and sort by relevance
             const unique = [...new Set(filtered)];
             return unique.sort((a, b) => {
               const aStartsWith = a.toLowerCase().startsWith(inputValue.toLowerCase());
               const bStartsWith = b.toLowerCase().startsWith(inputValue.toLowerCase());
               if (aStartsWith && !bStartsWith) return -1;
               if (!aStartsWith && bStartsWith) return 1;
               return a.localeCompare(b);
             });
           }}
           renderInput={(params) => (
             <TextField
               {...params}
               label="Business Units"
               placeholder="Type to search or select business units"
               error={!!validationErrors.businessUnits}
               helperText={validationErrors.businessUnits || "Allows for unit-specific risk monitoring and recommendations."}
             />
           )}
           renderTags={(value, getTagProps) =>
             value.map((option, index) => (
               <Chip
                 variant="outlined"
                 label={option}
                 {...getTagProps({ index })}
                 sx={{ m: 0.5 }}
               />
             ))
           }
           sx={{ mb: 2 }}
         />

        <Divider sx={{ my: 2 }}>Operational Footprint</Divider>
        
                 <Autocomplete
           multiple
           freeSolo
           options={SUPPLY_CHAIN_NODES}
           value={formData.supplyChainNodes}
           onChange={(event, newValue) => {
             setFormData(prev => ({ ...prev, supplyChainNodes: newValue }));
           }}
           filterOptions={(options, { inputValue }) => {
             const filtered = options.filter(option =>
               option.toLowerCase().includes(inputValue.toLowerCase())
             );
             // Remove duplicates and sort by relevance
             const unique = [...new Set(filtered)];
             return unique.sort((a, b) => {
               const aStartsWith = a.toLowerCase().startsWith(inputValue.toLowerCase());
               const bStartsWith = b.toLowerCase().startsWith(inputValue.toLowerCase());
               if (aStartsWith && !bStartsWith) return -1;
               if (!aStartsWith && bStartsWith) return 1;
               return a.localeCompare(b);
             });
           }}
           renderInput={(params) => (
             <TextField
               {...params}
               label="Supply Chain Nodes"
               placeholder="Type to search or select supply chain nodes"
               helperText="List main nodes (factories, suppliers, ports). Gives you route-specific alerts."
             />
           )}
           renderTags={(value, getTagProps) =>
             value.map((option, index) => (
               <Chip
                 variant="outlined"
                 label={option}
                 {...getTagProps({ index })}
                 sx={{ m: 0.5 }}
               />
             ))
           }
           sx={{ mb: 2 }}
         />
        
                 <Autocomplete
           multiple
           freeSolo
           options={WORLD_REGIONS}
           value={formData.criticalRegions}
           onChange={(event, newValue) => {
             setFormData(prev => ({ ...prev, criticalRegions: newValue }));
             if (validationErrors.criticalRegions) {
               setValidationErrors(prev => ({ ...prev, criticalRegions: null }));
             }
           }}
           filterOptions={(options, { inputValue }) => {
             const filtered = options.filter(option =>
               option.toLowerCase().includes(inputValue.toLowerCase())
             );
             // Remove duplicates and sort by relevance
             const unique = [...new Set(filtered)];
             return unique.sort((a, b) => {
               const aStartsWith = a.toLowerCase().startsWith(inputValue.toLowerCase());
               const bStartsWith = b.toLowerCase().startsWith(inputValue.toLowerCase());
               if (aStartsWith && !bStartsWith) return -1;
               if (!aStartsWith && bStartsWith) return 1;
               return a.localeCompare(b);
             });
           }}
           renderInput={(params) => (
             <TextField
               {...params}
               label="Critical Regions"
               placeholder="Type to search or select regions"
               error={!!validationErrors.criticalRegions}
               helperText={validationErrors.criticalRegions || "Regions where you have operations, suppliers, or customers. Type to search or select from the list."}
             />
           )}
           renderTags={(value, getTagProps) =>
             value.map((option, index) => (
               <Chip
                 variant="outlined"
                 label={option}
                 {...getTagProps({ index })}
                 sx={{ m: 0.5 }}
               />
             ))
           }
           sx={{ mb: 2 }}
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

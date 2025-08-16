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
  FormHelperText,
  Paper,
  Divider,
  Chip,
  Autocomplete,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Alert,
  Tooltip,
  IconButton
} from "@mui/material";
import {
  Security,
  Analytics,
  Business,
  Settings,
  Assessment,
  Dashboard,
  Help,
  Info,
  TrendingUp,
  Notifications,
  BusinessCenter,
  Public,
  Warning
} from "@mui/icons-material";

// Form configurations for each persona
const PERSONA_FORMS = {
  risk: {
    title: "Risk Management Profile",
    description: "Configure your risk monitoring preferences and compliance requirements",
    icon: <Security />,
    fields: [
      {
        type: 'select',
        name: 'riskTolerance',
        label: 'Risk Tolerance Level',
        required: true,
        options: [
          { value: 'low', label: 'Low - Conservative approach' },
          { value: 'medium', label: 'Medium - Balanced approach' },
          { value: 'high', label: 'High - Aggressive approach' }
        ],
        helpText: 'Determines alert sensitivity and risk scoring thresholds'
      },
      {
        type: 'multiselect',
        name: 'riskCategories',
        label: 'Primary Risk Categories',
        required: true,
        options: [
          'Geopolitical Risk',
          'Supply Chain Risk',
          'Regulatory Risk',
          'Financial Risk',
          'Operational Risk',
          'Reputational Risk',
          'Technology Risk',
          'Environmental Risk'
        ],
        helpText: 'Select the risk categories most relevant to your organization'
      },
      {
        type: 'multiselect',
        name: 'complianceFrameworks',
        label: 'Compliance Frameworks',
        required: false,
        options: [
          'SOX',
          'GDPR',
          'ISO 27001',
          'NIST',
          'COSO',
          'Basel III',
          'PCI DSS',
          'HIPAA'
        ],
        helpText: 'Select applicable compliance frameworks for targeted monitoring'
      },
      {
        type: 'text',
        name: 'riskThresholds',
        label: 'Risk Alert Thresholds',
        required: false,
        multiline: true,
        rows: 2,
        helpText: 'Describe specific risk thresholds that should trigger alerts'
      },
      {
        type: 'multiselect',
        name: 'stakeholders',
        label: 'Risk Stakeholders',
        required: true,
        options: [
          'Board of Directors',
          'C-Suite',
          'Legal Team',
          'Compliance Team',
          'Operations Team',
          'Finance Team',
          'IT Team',
          'External Auditors'
        ],
        helpText: 'Who should be notified of risk events?'
      }
    ]
  },
  
  ops: {
    title: "Operations Profile",
    description: "Configure your operational monitoring and supply chain preferences",
    icon: <Settings />,
    fields: [
      {
        type: 'multiselect',
        name: 'supplyChainNodes',
        label: 'Supply Chain Nodes',
        required: true,
        options: [
          'Raw Material Suppliers',
          'Component Manufacturers',
          'Assembly Plants',
          'Distribution Centers',
          'Warehouses',
          'Ports & Airports',
          'Transportation Hubs',
          'Retail Locations'
        ],
        helpText: 'Select your key supply chain nodes for targeted monitoring'
      },
      {
        type: 'multiselect',
        name: 'operationalRegions',
        label: 'Operational Regions',
        required: true,
        options: [
          'North America',
          'Europe',
          'Asia Pacific',
          'Latin America',
          'Middle East',
          'Africa',
          'Central Asia'
        ],
        helpText: 'Regions where you have operations, suppliers, or customers'
      },
      {
        type: 'select',
        name: 'alertFrequency',
        label: 'Alert Frequency',
        required: true,
        options: [
          { value: 'immediate', label: 'Immediate - Real-time alerts' },
          { value: 'hourly', label: 'Hourly - Batched updates' },
          { value: 'daily', label: 'Daily - Summary reports' },
          { value: 'weekly', label: 'Weekly - Trend analysis' }
        ],
        helpText: 'How often should you receive operational alerts?'
      },
      {
        type: 'multiselect',
        name: 'operationalMetrics',
        label: 'Key Performance Indicators',
        required: false,
        options: [
          'On-time Delivery',
          'Quality Metrics',
          'Cost Performance',
          'Inventory Levels',
          'Lead Times',
          'Capacity Utilization',
          'Supplier Performance'
        ],
        helpText: 'Select KPIs most important to your operations'
      }
    ]
  },
  
  analyst: {
    title: "Analytics Profile",
    description: "Configure your data analysis and reporting preferences",
    icon: <Analytics />,
    fields: [
      {
        type: 'multiselect',
        name: 'analysisTypes',
        label: 'Analysis Types',
        required: true,
        options: [
          'Trend Analysis',
          'Risk Assessment',
          'Market Intelligence',
          'Competitive Analysis',
          'Scenario Planning',
          'Performance Benchmarking',
          'Predictive Analytics',
          'Geographic Analysis'
        ],
        helpText: 'Select the types of analysis most valuable to your role'
      },
      {
        type: 'select',
        name: 'dataGranularity',
        label: 'Data Granularity',
        required: true,
        options: [
          { value: 'high', label: 'High - Detailed data points' },
          { value: 'medium', label: 'Medium - Aggregated data' },
          { value: 'low', label: 'Low - Summary level only' }
        ],
        helpText: 'Level of detail needed for your analysis'
      },
      {
        type: 'multiselect',
        name: 'reportingFormats',
        label: 'Preferred Reporting Formats',
        required: true,
        options: [
          'Interactive Dashboards',
          'PDF Reports',
          'Excel Exports',
          'PowerPoint Presentations',
          'Email Summaries',
          'API Access',
          'Real-time Feeds'
        ],
        helpText: 'How would you like to receive your analysis?'
      },
      {
        type: 'text',
        name: 'customMetrics',
        label: 'Custom Metrics',
        required: false,
        multiline: true,
        rows: 2,
        helpText: 'Any specific metrics or KPIs you need to track?'
      }
    ]
  },
  
  executive: {
    title: "Executive Profile",
    description: "Configure your strategic oversight and high-level monitoring preferences",
    icon: <Business />,
    fields: [
      {
        type: 'multiselect',
        name: 'strategicPriorities',
        label: 'Strategic Priorities',
        required: true,
        options: [
          'Market Expansion',
          'Risk Mitigation',
          'Cost Optimization',
          'Innovation',
          'Sustainability',
          'Digital Transformation',
          'Talent Development',
          'Stakeholder Value'
        ],
        helpText: 'Select your organization\'s top strategic priorities'
      },
      {
        type: 'select',
        name: 'reportingLevel',
        label: 'Reporting Level',
        required: true,
        options: [
          { value: 'board', label: 'Board Level - High-level strategic insights' },
          { value: 'executive', label: 'Executive Level - Strategic and operational' },
          { value: 'management', label: 'Management Level - Detailed operational' }
        ],
        helpText: 'Level of detail appropriate for your role'
      },
      {
        type: 'multiselect',
        name: 'keyStakeholders',
        label: 'Key Stakeholders',
        required: true,
        options: [
          'Board of Directors',
          'Investors',
          'Regulators',
          'Customers',
          'Partners',
          'Employees',
          'Communities'
        ],
        helpText: 'Who are your key stakeholders?'
      },
      {
        type: 'text',
        name: 'strategicInitiatives',
        label: 'Current Strategic Initiatives',
        required: false,
        multiline: true,
        rows: 2,
        helpText: 'Describe any current strategic initiatives we should monitor'
      }
    ]
  },
  
  compliance: {
    title: "Compliance Profile",
    description: "Configure your regulatory monitoring and compliance requirements",
    icon: <Assessment />,
    fields: [
      {
        type: 'multiselect',
        name: 'regulatoryBodies',
        label: 'Regulatory Bodies',
        required: true,
        options: [
          'SEC',
          'FINRA',
          'FDIC',
          'OCC',
          'CFTC',
          'EPA',
          'FDA',
          'DOT',
          'International Bodies'
        ],
        helpText: 'Select the regulatory bodies that oversee your operations'
      },
      {
        type: 'multiselect',
        name: 'complianceAreas',
        label: 'Compliance Areas',
        required: true,
        options: [
          'Financial Reporting',
          'Data Privacy',
          'Environmental',
          'Health & Safety',
          'Labor & Employment',
          'Anti-corruption',
          'Trade Compliance',
          'Cybersecurity'
        ],
        helpText: 'Select your primary compliance focus areas'
      },
      {
        type: 'select',
        name: 'auditFrequency',
        label: 'Audit Frequency',
        required: true,
        options: [
          { value: 'quarterly', label: 'Quarterly' },
          { value: 'semi-annual', label: 'Semi-annual' },
          { value: 'annual', label: 'Annual' },
          { value: 'continuous', label: 'Continuous monitoring' }
        ],
        helpText: 'How often do you conduct compliance audits?'
      },
      {
        type: 'text',
        name: 'complianceNotes',
        label: 'Special Compliance Requirements',
        required: false,
        multiline: true,
        rows: 2,
        helpText: 'Any special compliance requirements or considerations?'
      }
    ]
  },
  
  other: {
    title: "Custom Profile",
    description: "Configure your personalized monitoring and alert preferences",
    icon: <Dashboard />,
    fields: [
      {
        type: 'multiselect',
        name: 'customInterests',
        label: 'Areas of Interest',
        required: true,
        options: [
          'Industry Trends',
          'Technology Updates',
          'Market Changes',
          'Regulatory Updates',
          'Geopolitical Events',
          'Economic Indicators',
          'Social Trends',
          'Environmental Issues'
        ],
        helpText: 'Select topics most relevant to your role'
      },
      {
        type: 'select',
        name: 'notificationPreference',
        label: 'Notification Preference',
        required: true,
        options: [
          { value: 'email', label: 'Email notifications' },
          { value: 'dashboard', label: 'Dashboard alerts only' },
          { value: 'both', label: 'Email + Dashboard' },
          { value: 'none', label: 'No notifications' }
        ],
        helpText: 'How would you like to receive updates?'
      },
      {
        type: 'text',
        name: 'customRequirements',
        label: 'Custom Requirements',
        required: false,
        multiline: true,
        rows: 3,
        helpText: 'Describe any specific requirements or preferences for your role'
      }
    ]
  }
};

export default function PersonaSpecificForm({ persona, data, onSubmit, onError }) {
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Initialize form data based on persona
    if (persona && PERSONA_FORMS[persona.id]) {
      const initialData = {};
      const personaSpecificData = data[persona.id] || {};
      
      PERSONA_FORMS[persona.id].fields.forEach(field => {
        if (field.type === 'multiselect') {
          initialData[field.name] = personaSpecificData[field.name] || [];
        } else if (field.type === 'select') {
          initialData[field.name] = personaSpecificData[field.name] || '';
        } else {
          initialData[field.name] = personaSpecificData[field.name] || '';
        }
      });
      setFormData(initialData);
    }
  }, [persona, data]);

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[fieldName]) {
      setValidationErrors(prev => ({ ...prev, [fieldName]: null }));
    }
  };

  const validateForm = () => {
    if (!persona || !PERSONA_FORMS[persona.id]) return false;
    
    const errors = {};
    const formConfig = PERSONA_FORMS[persona.id];
    
    formConfig.fields.forEach(field => {
      if (field.required) {
        if (field.type === 'multiselect') {
          if (!formData[field.name] || formData[field.name].length === 0) {
            errors[field.name] = `${field.label} is required`;
          }
        } else if (field.type === 'select') {
          if (!formData[field.name]) {
            errors[field.name] = `${field.label} is required`;
          }
        } else {
          if (!formData[field.name]?.trim()) {
            errors[field.name] = `${field.label} is required`;
          }
        }
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      onError('Please complete all required fields before continuing');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (err) {
      onError(err.message || 'Failed to save role-specific information');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!persona) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Please select a role first
        </Typography>
      </Box>
    );
  }

  const formConfig = PERSONA_FORMS[persona.id];
  if (!formConfig) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="error">
          Invalid role configuration
        </Typography>
      </Box>
    );
  }

  const renderField = (field) => {
    const commonProps = {
      fullWidth: true,
      error: !!validationErrors[field.name],
      helperText: validationErrors[field.name] || field.helpText,
      sx: { mb: 2 }
    };

    switch (field.type) {
      case 'text':
        return (
          <TextField
            {...commonProps}
            label={field.label}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            multiline={field.multiline}
            rows={field.rows || 1}
          />
        );
        
      case 'select':
        return (
          <FormControl {...commonProps}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              label={field.label}
            >
              {field.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
        
      case 'multiselect':
        return (
          <FormControl {...commonProps}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              multiple
              value={formData[field.name] || []}
              onChange={(e) => handleChange(field.name, e.target.value)}
              input={<OutlinedInput label={field.label} />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {field.options.map((option) => (
                <MenuItem key={option} value={option}>
                  <Checkbox checked={(formData[field.name] || []).indexOf(option) > -1} />
                  <ListItemText primary={option} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
        
      default:
        return null;
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{ color: 'primary.main' }}>
          {formConfig.icon}
        </Box>
        <Box>
          <Typography variant="h5" gutterBottom>
            {formConfig.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {formConfig.description}
          </Typography>
        </Box>
      </Box>

      {/* Form Fields */}
      <Grid container spacing={3}>
        {formConfig.fields.map((field, index) => (
          <Grid item xs={12} key={field.name}>
            <Paper elevation={1} sx={{ p: 3, bgcolor: 'grey.50' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {field.label}
                  {field.required && <span style={{ color: 'error.main' }}> *</span>}
                </Typography>
                {field.helpText && (
                  <Tooltip title={field.helpText} arrow>
                    <IconButton size="small" sx={{ p: 0.5 }}>
                      <Info fontSize="small" color="action" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              {renderField(field)}
            </Paper>
          </Grid>
        ))}
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
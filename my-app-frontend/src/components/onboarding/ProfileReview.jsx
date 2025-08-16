import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  CircularProgress
} from "@mui/material";
import {
  Person,
  Business,
  Security,
  Settings,
  Analytics,
  Assessment,
  Dashboard,
  CheckCircle,
  Edit,
  ExpandMore,
  Warning,
  Info
} from "@mui/icons-material";

export default function ProfileReview({ basicInfo, persona, personaData, onSubmit, onError, onEdit }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const finalData = {
        basicInfo,
        persona,
        personaData,
        completedAt: new Date().toISOString()
      };
      await onSubmit(finalData);
    } catch (err) {
      onError(err.message || 'Failed to complete onboarding');
      setIsSubmitting(false);
    }
  };

  const formatValue = (value) => {
    if (Array.isArray(value)) {
      if (value.length === 0) return 'None selected';
      return value.join(', ');
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (!value || value === '') return 'Not specified';
    return value;
  };

  const renderBasicInfo = () => (
    <Paper elevation={1} sx={{ p: 3, bgcolor: 'grey.50' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Person color="primary" />
        <Typography variant="h6">Basic Information</Typography>
      </Box>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">Name</Typography>
          <Typography variant="body1">
            {basicInfo.firstName} {basicInfo.lastName}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">Email</Typography>
          <Typography variant="body1">{basicInfo.email}</Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">Organization</Typography>
          <Typography variant="body1">{basicInfo.organization}</Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">Organization Size</Typography>
          <Typography variant="body1">
            {basicInfo.organizationSize || 'Not specified'}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderPersonaInfo = () => (
    <Paper elevation={1} sx={{ p: 3, bgcolor: 'grey.50' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Box sx={{ color: persona.color }}>
          {persona.icon}
        </Box>
        <Typography variant="h6">Role: {persona.name}</Typography>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {persona.description}
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {persona.features.slice(0, 3).map((feature, index) => (
          <Chip
            key={index}
            label={feature}
            size="small"
            variant="outlined"
            sx={{ borderColor: persona.color, color: persona.color }}
          />
        ))}
        {persona.features.length > 3 && (
          <Chip
            label={`+${persona.features.length - 3} more`}
            size="small"
            variant="outlined"
            sx={{ borderColor: 'grey.400', color: 'text.secondary' }}
          />
        )}
      </Box>
    </Paper>
  );

  const renderPersonaData = () => {
    if (!persona || !personaData) return null;

    const formConfig = {
      risk: {
        title: "Risk Management Configuration",
        icon: <Security />,
        fields: [
          { key: 'riskTolerance', label: 'Risk Tolerance Level' },
          { key: 'riskCategories', label: 'Primary Risk Categories' },
          { key: 'complianceFrameworks', label: 'Compliance Frameworks' },
          { key: 'riskThresholds', label: 'Risk Alert Thresholds' },
          { key: 'stakeholders', label: 'Risk Stakeholders' }
        ]
      },
      ops: {
        title: "Operations Configuration",
        icon: <Settings />,
        fields: [
          { key: 'supplyChainNodes', label: 'Supply Chain Nodes' },
          { key: 'operationalRegions', label: 'Operational Regions' },
          { key: 'alertFrequency', label: 'Alert Frequency' },
          { key: 'operationalMetrics', label: 'Key Performance Indicators' }
        ]
      },
      analyst: {
        title: "Analytics Configuration",
        icon: <Analytics />,
        fields: [
          { key: 'analysisTypes', label: 'Analysis Types' },
          { key: 'dataGranularity', label: 'Data Granularity' },
          { key: 'reportingFormats', label: 'Preferred Reporting Formats' },
          { key: 'customMetrics', label: 'Custom Metrics' }
        ]
      },
      executive: {
        title: "Executive Configuration",
        icon: <Business />,
        fields: [
          { key: 'strategicPriorities', label: 'Strategic Priorities' },
          { key: 'reportingLevel', label: 'Reporting Level' },
          { key: 'keyStakeholders', label: 'Key Stakeholders' },
          { key: 'strategicInitiatives', label: 'Current Strategic Initiatives' }
        ]
      },
      compliance: {
        title: "Compliance Configuration",
        icon: <Assessment />,
        fields: [
          { key: 'regulatoryBodies', label: 'Regulatory Bodies' },
          { key: 'complianceAreas', label: 'Compliance Areas' },
          { key: 'auditFrequency', label: 'Audit Frequency' },
          { key: 'complianceNotes', label: 'Special Compliance Requirements' }
        ]
      },
      other: {
        title: "Custom Configuration",
        icon: <Dashboard />,
        fields: [
          { key: 'customInterests', label: 'Areas of Interest' },
          { key: 'notificationPreference', label: 'Notification Preference' },
          { key: 'customRequirements', label: 'Custom Requirements' }
        ]
      }
    };

    const config = formConfig[persona.id];
    if (!config) return null;

    return (
      <Paper elevation={1} sx={{ p: 3, bgcolor: 'grey.50' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Box sx={{ color: 'primary.main' }}>
            {config.icon}
          </Box>
          <Typography variant="h6">{config.title}</Typography>
        </Box>
        
        <Grid container spacing={2}>
          {config.fields.map((field) => (
            <Grid item xs={12} sm={6} key={field.key}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {field.label}
              </Typography>
              <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                {formatValue(personaData[field.key])}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
        Review Your Profile
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
        Please review all the information below. You can edit any section by clicking the edit button, 
        or proceed to complete your onboarding.
      </Typography>

      {/* Basic Information */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Basic Information</Typography>
          <Button
            startIcon={<Edit />}
            variant="outlined"
            size="small"
            onClick={() => onEdit()}
          >
            Edit
          </Button>
        </Box>
        {renderBasicInfo()}
      </Box>

      {/* Persona Information */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Selected Role</Typography>
        {renderPersonaInfo()}
      </Box>

      {/* Persona-Specific Data */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Role Configuration</Typography>
        {renderPersonaData()}
      </Box>

      {/* Summary */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Info color="primary" />
          <Typography variant="h6" color="primary">What Happens Next?</Typography>
        </Box>
        
        <List dense>
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <CheckCircle color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Your profile will be configured with personalized settings"
              secondary="Based on your role and preferences"
            />
          </ListItem>
          
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <CheckCircle color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="You'll receive access to your customized dashboard"
              secondary="With relevant insights and monitoring tools"
            />
          </ListItem>
          
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <CheckCircle color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Set up additional features and integrations"
              secondary="Available in your account settings"
            />
          </ListItem>
        </List>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<Edit />}
          onClick={() => onEdit()}
          disabled={isSubmitting}
        >
          Edit Profile
        </Button>
        
        <Button
          variant="contained"
          size="large"
          endIcon={isSubmitting ? <CircularProgress size={20} /> : <CheckCircle />}
          onClick={handleSubmit}
          disabled={isSubmitting}
          sx={{ minWidth: 160 }}
        >
          {isSubmitting ? 'Completing...' : 'Complete Setup'}
        </Button>
      </Box>

      {/* Additional Info */}
      <Paper elevation={1} sx={{ p: 2, mt: 4, bgcolor: 'grey.50' }}>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          You can always update your profile and preferences later in your account settings.
        </Typography>
      </Paper>
    </Box>
  );
} 
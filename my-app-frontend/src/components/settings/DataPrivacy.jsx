import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Alert,
  Switch,
  FormControlLabel,
  FormGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Divider,
  useTheme,
  IconButton
} from '@mui/material';
import {
  Security,
  ArrowBack,
  Download,
  Delete,
  PrivacyTip,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function DataPrivacy() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
  
  const [privacySettings, setPrivacySettings] = useState({
    dataCollection: true,
    analytics: true,
    marketing: false,
    thirdPartySharing: false,
    dataRetention: '2years',
    gdprCompliance: true,
    cookiePreferences: 'essential'
  });

  const [dataRetentionOptions] = useState([
    { value: '6months', label: '6 months' },
    { value: '1year', label: '1 year' },
    { value: '2years', label: '2 years' },
    { value: '5years', label: '5 years' },
    { value: 'indefinite', label: 'Indefinite' }
  ]);

  const [cookieOptions] = useState([
    { value: 'essential', label: 'Essential Only' },
    { value: 'functional', label: 'Functional' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'marketing', label: 'Marketing' }
  ]);

  const handlePrivacyChange = (field, value) => {
    setPrivacySettings(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleExportData = async () => {
    setExporting(true);
    setError(null);
    
    try {
      // Get user profile data
      const userProfile = localStorage.getItem('user_profile');
      const profileData = userProfile ? JSON.parse(userProfile) : {};
      
      // Create export data object
      const exportData = {
        profile: profileData,
        settings: privacySettings,
        exportDate: new Date().toISOString(),
        exportVersion: '1.0'
      };
      
      // Create and download file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `geointel-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      
    } catch (err) {
      setError('Failed to export data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get existing profile data
      const existingProfile = localStorage.getItem('user_profile');
      const currentProfile = existingProfile ? JSON.parse(existingProfile) : {};
      
      // Update with privacy settings
      const updatedProfile = {
        ...currentProfile,
        privacySettings
      };
      
      // Save back to localStorage
      localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      
    } catch (err) {
      setError('Failed to save privacy settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = () => {
    setPrivacySettings({
      dataCollection: true,
      analytics: true,
      marketing: false,
      thirdPartySharing: false,
      dataRetention: '2years',
      gdprCompliance: true,
      cookiePreferences: 'essential'
    });
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
          <Security color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Data & Privacy
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Manage your data preferences, privacy settings, and compliance options
        </Typography>
      </Box>

      {/* Success/Error Messages */}
      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Privacy settings saved successfully!
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Data Collection Preferences */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          <PrivacyTip color="primary" />
          Data Collection Preferences
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={privacySettings.dataCollection}
                    onChange={(e) => handlePrivacyChange('dataCollection', e.target.checked)}
                  />
                }
                label="Data Collection"
              />
              <Typography variant="caption" color="text.secondary">
                Allow collection of usage data to improve platform
              </Typography>
            </FormGroup>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={privacySettings.analytics}
                    onChange={(e) => handlePrivacyChange('analytics', e.target.checked)}
                  />
                }
                label="Analytics"
              />
              <Typography variant="caption" color="text.secondary">
                Enable analytics to track platform performance
              </Typography>
            </FormGroup>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={privacySettings.marketing}
                    onChange={(e) => handlePrivacyChange('marketing', e.target.checked)}
                  />
                }
                label="Marketing Communications"
              />
              <Typography variant="caption" color="text.secondary">
                Receive marketing emails and promotional content
              </Typography>
            </FormGroup>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={privacySettings.thirdPartySharing}
                    onChange={(e) => handlePrivacyChange('thirdPartySharing', e.target.checked)}
                  />
                }
                label="Third-Party Data Sharing"
              />
              <Typography variant="caption" color="text.secondary">
                Allow sharing data with trusted third-party services
              </Typography>
            </FormGroup>
          </Grid>
        </Grid>
      </Paper>

      {/* Data Retention & Cookies */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Data Retention & Cookies
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Data Retention Period</InputLabel>
              <Select
                value={privacySettings.dataRetention}
                onChange={(e) => handlePrivacyChange('dataRetention', e.target.value)}
                label="Data Retention Period"
              >
                {dataRetentionOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Cookie Preferences</InputLabel>
              <Select
                value={privacySettings.cookiePreferences}
                onChange={(e) => handlePrivacyChange('cookiePreferences', e.target.value)}
                label="Cookie Preferences"
              >
                {cookieOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.value === 'essential' && <CheckCircle sx={{ mr: 1, fontSize: 16 }} />}
                    {option.value === 'marketing' && <Warning sx={{ mr: 1, fontSize: 16, color: 'warning.main' }} />}
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* GDPR Compliance */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          GDPR & Compliance
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={privacySettings.gdprCompliance}
                    onChange={(e) => handlePrivacyChange('gdprCompliance', e.target.checked)}
                  />
                }
                label="GDPR Compliance Mode"
              />
              <Typography variant="caption" color="text.secondary">
                Enable enhanced privacy controls for EU users
              </Typography>
            </FormGroup>
          </Grid>
          
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Your Rights:</strong> You have the right to access, rectify, and delete your personal data. 
                Contact us at privacy@geointel.com for data requests.
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </Paper>

      {/* Data Export */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Data Export & Management
        </Typography>
        
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={8}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Export all your data including profile information, preferences, and settings in JSON format.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Export includes: Company profile, risk preferences, notification settings, and privacy choices
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleExportData}
              disabled={exporting}
              fullWidth
            >
              {exporting ? 'Exporting...' : 'Export Data'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={handleResetSettings}
          disabled={loading}
        >
          Reset to Defaults
        </Button>
        <Button
          variant="contained"
          onClick={handleSaveSettings}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </Box>

      {/* Privacy Policy Link */}
      <Paper elevation={1} sx={{ p: 3, mt: 4, bgcolor: 'grey.50' }}>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          For detailed information about how we handle your data, please review our{' '}
          <Button
            variant="text"
            size="small"
            onClick={() => window.open('/privacy-policy', '_blank')}
            sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}
          >
            Privacy Policy
          </Button>
          {' '}and{' '}
          <Button
            variant="text"
            size="small"
            onClick={() => window.open('/terms-of-service', '_blank')}
            sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}
          >
            Terms of Service
          </Button>
          .
        </Typography>
      </Paper>
    </Box>
  );
} 
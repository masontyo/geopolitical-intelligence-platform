import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  Divider,
  Switch,
  FormControlLabel,
  FormGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  IconButton,
  useTheme,
  IconButton as MuiIconButton
} from '@mui/material';
import {
  AccountCircle,
  ArrowBack,
  Save,
  Refresh,
  Visibility,
  VisibilityOff,
  Security,
  Delete
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function AccountSettings() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    emailNotifications: true,
    sessionTimeout: 30
  });

  // Load existing profile data
  useEffect(() => {
    const loadProfile = () => {
      try {
        const userProfile = localStorage.getItem('user_profile');
        if (userProfile) {
          const parsed = JSON.parse(userProfile);
          setFormData({
            firstName: parsed.firstName || '',
            lastName: parsed.lastName || '',
            email: parsed.email || ''
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

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field, value) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get existing profile data
      const existingProfile = localStorage.getItem('user_profile');
      const currentProfile = existingProfile ? JSON.parse(existingProfile) : {};
      
      // Update with new account data
      const updatedProfile = {
        ...currentProfile,
        ...formData
      };
      
      // Save back to localStorage
      localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      
    } catch (err) {
      setError('Failed to save account settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Here you would typically make an API call to change the password
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowPasswordDialog(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      
    } catch (err) {
      setError('Failed to change password. Please try again.');
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
            firstName: parsed.firstName || '',
            lastName: parsed.lastName || '',
            email: parsed.email || ''
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

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Here you would typically make an API call to delete the account
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear all local data
      localStorage.clear();
      
      // Navigate to onboarding
      navigate('/onboarding');
      
    } catch (err) {
      setError('Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <MuiIconButton onClick={() => navigate('/settings')} sx={{ mr: 1 }}>
            <ArrowBack />
          </MuiIconButton>
          <AccountCircle color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Account Settings
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Manage your personal information, password, and security preferences
        </Typography>
      </Box>

      {/* Success/Error Messages */}
      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Account settings saved successfully!
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Personal Information */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Personal Information
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder="Enter first name"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder="Enter last name"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email Address"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter email address"
              type="email"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Security Settings */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Security color="primary" />
          Security Settings
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormGroup>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Two-Factor Authentication
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                Add an extra layer of security to your account
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  // TODO: Implement 2FA setup flow
                  alert('2FA setup coming soon!');
                }}
                sx={{ alignSelf: 'flex-start' }}
              >
                {securitySettings.twoFactorAuth ? 'Manage 2FA' : 'Setup 2FA'}
              </Button>
            </FormGroup>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={securitySettings.emailNotifications}
                    onChange={(e) => handleSecurityChange('emailNotifications', e.target.checked)}
                  />
                }
                label="Email Notifications"
              />
              <Typography variant="caption" color="text.secondary">
                Receive security alerts via email
              </Typography>
            </FormGroup>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setShowPasswordDialog(true)}
            startIcon={<Security />}
          >
            Change Password
          </Button>
        </Box>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          onClick={() => setShowDeleteDialog(true)}
        >
          Delete Account
        </Button>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
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

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Password"
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility('current')}
                        edge="end"
                      >
                        {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="New Password"
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility('new')}
                        edge="end"
                      >
                        {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm New Password"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility('confirm')}
                        edge="end"
                      >
                        {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
          <Button 
            onClick={handlePasswordSubmit} 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Changing...' : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'error.main' }}>Delete Account</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete your account? This action cannot be undone.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All your data, including company profiles, risk assessments, and preferences will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteAccount} 
            variant="contained"
            color="error"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 
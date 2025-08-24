import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip
} from '@mui/material';
import {
  Security,
  Business,
  Analytics,
  Assessment,
  Dashboard
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    role: 'risk-manager'
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create user profile and login
    const userProfile = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      company: formData.company.trim(),
      role: formData.role,
      email: `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@${formData.company.toLowerCase().replace(/\s+/g, '')}.com`,
      createdAt: new Date().toISOString()
    };

    login(userProfile);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const quickLogin = (role) => {
    const quickProfiles = {
      'risk-manager': { firstName: 'Sarah', lastName: 'Chen', company: 'Global Risk Solutions', role: 'risk-manager' },
      'operations': { firstName: 'Mike', lastName: 'Rodriguez', company: 'Supply Chain Corp', role: 'operations-manager' },
      'analyst': { firstName: 'Alex', lastName: 'Thompson', company: 'Data Insights Inc', role: 'business-analyst' },
      'executive': { firstName: 'Jennifer', lastName: 'Williams', company: 'Enterprise Corp', role: 'executive-leader' }
    };

    const profile = quickProfiles[role];
    const userProfile = {
      ...profile,
      email: `${profile.firstName.toLowerCase()}.${profile.lastName.toLowerCase()}@${profile.company.toLowerCase().replace(/\s+/g, '')}.com`,
      createdAt: new Date().toISOString()
    };

    login(userProfile);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
          Risk Intelligence Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Enterprise Risk Management & Intelligence Platform
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Quick Login Options */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
              Quick Start
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
              Choose a pre-configured profile to explore the platform immediately
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card 
                  sx={{ 
                    cursor: 'pointer', 
                    transition: 'all 0.2s',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
                  }}
                  onClick={() => quickLogin('risk-manager')}
                >
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Security sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Risk Manager
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Sarah Chen
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6}>
                <Card 
                  sx={{ 
                    cursor: 'pointer', 
                    transition: 'all 0.2s',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
                  }}
                  onClick={() => quickLogin('operations')}
                >
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Business sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Operations
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Mike Rodriguez
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6}>
                <Card 
                  sx={{ 
                    cursor: 'pointer', 
                    transition: 'all 0.2s',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
                  }}
                  onClick={() => quickLogin('analyst')}
                >
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Analytics sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Business Analyst
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Alex Thompson
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6}>
                <Card 
                  sx={{ 
                    cursor: 'pointer', 
                    transition: 'all 0.2s',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
                  }}
                  onClick={() => quickLogin('executive')}
                >
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Dashboard sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Executive
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Jennifer Williams
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Custom Login Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
              Custom Login
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
              Enter your details to create a personalized profile
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    error={!!errors.company}
                    helperText={errors.company}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    size="small"
                  >
                    <option value="risk-manager">Risk Manager</option>
                    <option value="operations-manager">Operations Manager</option>
                    <option value="business-analyst">Business Analyst</option>
                    <option value="executive-leader">Executive Leader</option>
                    <option value="compliance-officer">Compliance Officer</option>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ mt: 2 }}
                  >
                    Access Dashboard
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Features Overview */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Platform Features
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Security sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>Risk Assessment</Typography>
              <Typography variant="body2" color="text.secondary">
                Comprehensive risk evaluation and scoring
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Analytics sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>Intelligence</Typography>
              <Typography variant="body2" color="text.secondary">
                AI-powered threat analysis and insights
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Assessment sx={{ fontSize: 40, color: 'warning.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>Action Tracking</Typography>
              <Typography variant="body2" color="text.secondary">
                Monitor and manage response actions
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Dashboard sx={{ fontSize: 40, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>Real-time Dashboard</Typography>
              <Typography variant="body2" color="text.secondary">
                Live monitoring and alerting system
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

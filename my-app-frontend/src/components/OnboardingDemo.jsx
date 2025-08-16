import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Divider
} from '@mui/material';
import {
  Person,
  Business,
  Security,
  Settings,
  Analytics,
  Assessment,
  Dashboard,
  ArrowForward,
  CheckCircle,
  TrendingUp
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  {
    icon: <Person />,
    title: 'Progressive Profiling',
    description: 'Collect information only when needed, reducing upfront friction',
    color: '#1976d2'
  },
  {
    icon: <Business />,
    title: 'Persona-Based Forms',
    description: 'Dynamic forms that adapt to your selected role and responsibilities',
    color: '#388e3c'
  },
  {
    icon: <Security />,
    title: 'Autosave & Resume',
    description: 'Never lose progress with automatic saving and resume functionality',
    color: '#f57c00'
  },
  {
    icon: <Settings />,
    title: 'Modular Design',
    description: 'Easy to extend with new roles and features as your platform grows',
    color: '#7b1fa2'
  },
  {
    icon: <Analytics />,
    title: 'Smart Validation',
    description: 'Context-aware validation with helpful tooltips and guidance',
    color: '#d32f2f'
  },
  {
    icon: <Dashboard />,
    title: '5-Minute Setup',
    description: 'Optimized flow designed to get users onboarded quickly',
    color: '#757575'
  }
];

const PERSONAS = [
  {
    id: 'risk',
    name: 'Risk Manager',
    description: 'Enterprise risk oversight and compliance management',
    icon: <Security />,
    color: '#1976d2'
  },
  {
    id: 'ops',
    name: 'Operations Manager',
    description: 'Supply chain and operational monitoring',
    icon: <Settings />,
    color: '#388e3c'
  },
  {
    id: 'analyst',
    name: 'Business Analyst',
    description: 'Data analysis and strategic insights',
    icon: <Analytics />,
    color: '#f57c00'
  },
  {
    id: 'executive',
    name: 'Executive Leader',
    description: 'Strategic decision making and oversight',
    icon: <Business />,
    color: '#7b1fa2'
  },
  {
    id: 'compliance',
    name: 'Compliance Officer',
    description: 'Regulatory compliance and governance',
    icon: <Assessment />,
    color: '#d32f2f'
  },
  {
    id: 'other',
    name: 'Custom Role',
    description: 'Flexible configuration for unique needs',
    icon: <Dashboard />,
    color: '#757575'
  }
];

export default function OnboardingDemo() {
  const navigate = useNavigate();

  const handleStartOnboarding = () => {
    navigate('/onboarding-modular');
  };

  const handleViewLegacy = () => {
    navigate('/onboarding');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" gutterBottom color="primary" sx={{ fontWeight: 700 }}>
          Modular Onboarding Flow
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
          Best-practice B2B SaaS onboarding with persona-based dynamic forms
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
          Experience a modern, modular onboarding system designed to reduce friction while collecting 
          comprehensive user information. Perfect for enterprise platforms with multiple user personas.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={handleStartOnboarding}
            sx={{ minWidth: 200 }}
          >
            Try New Onboarding
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={handleViewLegacy}
            sx={{ minWidth: 200 }}
          >
            View Legacy Flow
          </Button>
        </Box>
      </Box>

      {/* Key Features */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Key Features
        </Typography>
        
        <Grid container spacing={3}>
          {FEATURES.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box
                    sx={{
                      color: feature.color,
                      display: 'flex',
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >
                    {feature.icon}
                  </Box>
                  
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 6 }} />

      {/* Supported Personas */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Supported User Personas
        </Typography>
        
        <Grid container spacing={3}>
          {PERSONAS.map((persona) => (
            <Grid item xs={12} sm={6} md={4} key={persona.id}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardActionArea sx={{ height: '100%', p: 2 }}>
                  <CardContent sx={{ textAlign: 'center', p: 0 }}>
                    <Box
                      sx={{
                        color: persona.color,
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 2
                      }}
                    >
                      {persona.icon}
                    </Box>
                    
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {persona.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {persona.description}
                    </Typography>
                    
                    <Chip
                      label="Dynamic Forms"
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: persona.color,
                        color: persona.color,
                        fontSize: '0.7rem'
                      }}
                    />
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 6 }} />

      {/* Technical Details */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Technical Implementation
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle color="success" />
                Frontend Architecture
              </Typography>
              
              <Box component="ul" sx={{ pl: 2, mt: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  React hooks for state management
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Material-UI components with custom theme
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Responsive design for all devices
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Progressive form validation
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp color="primary" />
                User Experience Features
              </Typography>
              
              <Box component="ul" sx={{ pl: 2, mt: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Autosave with localStorage persistence
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Smooth transitions and animations
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Contextual help and tooltips
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Skip optional fields functionality
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Call to Action */}
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
        <Typography variant="h5" gutterBottom color="primary">
          Ready to Experience the Future of Onboarding?
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Test our modular onboarding flow and see how it can transform your user experience
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowForward />}
          onClick={handleStartOnboarding}
          sx={{ minWidth: 250 }}
        >
          Start Modular Onboarding
        </Button>
      </Paper>
    </Container>
  );
} 
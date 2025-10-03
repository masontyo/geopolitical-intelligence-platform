import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Public,
  Warning,
  Timeline,
  Assessment,
  ArrowForward,
  Info,
  Analytics
} from '@mui/icons-material';

const LandingPage = () => {
  const navigate = useNavigate();
  const [startTime] = useState(Date.now());
  const [pageViews, setPageViews] = useState(0);

  // Track page view
  useEffect(() => {
    const views = parseInt(localStorage.getItem('landingPageViews') || '0') + 1;
    localStorage.setItem('landingPageViews', views.toString());
    setPageViews(views);
    
    // Track time on page
    const handleBeforeUnload = () => {
      const timeOnPage = Date.now() - startTime;
      localStorage.setItem('landingPageTime', timeOnPage.toString());
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [startTime]);

  const handleGetStarted = () => {
    // Track CTA click
    const ctaClicks = parseInt(localStorage.getItem('landingPageClicks') || '0') + 1;
    localStorage.setItem('landingPageClicks', ctaClicks.toString());
    
    // Track conversion
    localStorage.setItem('landingPageConversion', 'true');
    
    navigate('/onboarding');
  };

  const features = [
    {
      icon: <Public sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Interactive Risk Map',
      description: 'Visualize geopolitical risks across your global supply chain'
    },
    {
      icon: <Warning sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Real-time Alerts',
      description: 'Get notified when events affect your suppliers and ports'
    },
    {
      icon: <Timeline sx={{ fontSize: 40, color: 'info.main' }} />,
      title: 'Supply Chain Tracking',
      description: 'Monitor suppliers, ports, and shipping routes across your network'
    },
    {
      icon: <Assessment sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Risk Assessment',
      description: 'Automated scoring and mitigation recommendations'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        py: 2,
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            width: '100%'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Geopolitical Intelligence Platform
            </Typography>
            <Chip 
              label="Beta Testing" 
              color="secondary" 
              size="small"
              sx={{ color: 'white' }}
            />
          </Box>
        </Container>
      </Box>

      {/* Main Content Container */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
        
        {/* Hero Section */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: { xs: 6, sm: 7, md: 8 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%'
        }}>
          <Typography variant="h2" sx={{ 
            fontWeight: 700, 
            mb: { xs: 2, sm: 3, md: 4 },
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            lineHeight: 1.2
          }}>
            Supply Chain Risk Intelligence
          </Typography>
          
          <Typography variant="h5" sx={{ 
            color: 'text.secondary', 
            mb: { xs: 3, sm: 4, md: 5 },
            maxWidth: { xs: '100%', sm: '500px', md: '600px' },
            mx: 'auto',
            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
            lineHeight: 1.4
          }}>
            Monitor geopolitical risks affecting your global supply chain with real-time intelligence and actionable insights.
          </Typography>

          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={handleGetStarted}
            sx={{
              py: { xs: 1.5, sm: 2 },
              px: { xs: 3, sm: 4 },
              fontSize: { xs: '1rem', sm: '1.1rem' },
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: 3,
              mb: 2,
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Start Testing
          </Button>

          <Typography variant="body2" sx={{ 
            color: 'text.secondary',
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}>
            Beta testing program • Help shape the future
          </Typography>
        </Box>

        {/* Features Grid */}
        <Box sx={{ 
          mb: { xs: 6, sm: 7, md: 8 },
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}>
          <Grid container spacing={{ xs: 3, sm: 4 }} sx={{ maxWidth: '100%' }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ 
                  height: '100%', 
                  minHeight: '220px',
                  textAlign: 'center',
                  p: { xs: 2, sm: 3 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-4px)'
                  },
                  transition: 'all 0.3s ease'
                }}>
                  <CardContent sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    textAlign: 'center',
                    height: '100%',
                    minHeight: '180px',
                    justifyContent: 'center'
                  }}>
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600, 
                      mb: 1,
                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                    }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      lineHeight: 1.4
                    }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* What You'll Experience Section */}
        <Box sx={{ 
          mb: { xs: 6, sm: 7, md: 8 },
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}>
          <Paper sx={{ 
            p: { xs: 3, sm: 4 }, 
            bgcolor: 'grey.50',
            width: '100%',
            maxWidth: '100%'
          }}>
            <Typography variant="h5" sx={{ 
              fontWeight: 600, 
              mb: { xs: 3, sm: 4 }, 
              textAlign: 'center',
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
            }}>
              What You'll Experience
            </Typography>
            
            <Grid container spacing={{ xs: 3, sm: 4 }} sx={{ justifyContent: 'center' }}>
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600, 
                    mb: 1,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}>
                    1. Quick Setup
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    lineHeight: 1.4
                  }}>
                    Tell us about your company and supply chain focus
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600, 
                    mb: 1,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}>
                    2. Interactive Dashboard
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    lineHeight: 1.4
                  }}>
                    Explore the map-based intelligence platform
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600, 
                    mb: 1,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}>
                    3. Risk Insights
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    lineHeight: 1.4
                  }}>
                    See how geopolitical events affect supply chains
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        {/* Testing Info Section */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: { xs: 5, sm: 6, md: 7 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%'
        }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 600, 
            mb: { xs: 2, sm: 3 },
            fontSize: { xs: '1.25rem', sm: '1.5rem' }
          }}>
            Beta Testing Program
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ 
            mb: { xs: 3, sm: 4 },
            maxWidth: { xs: '100%', sm: '500px', md: '600px' },
            fontSize: { xs: '1rem', sm: '1.1rem' },
            lineHeight: 1.4
          }}>
            Help us improve the platform by testing key features and providing feedback.
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: { xs: 1, sm: 2 }, 
            flexWrap: 'wrap',
            maxWidth: '100%'
          }}>
            <Chip 
              label="Interactive Maps" 
              color="primary" 
              variant="outlined" 
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            />
            <Chip 
              label="Risk Alerts" 
              color="warning" 
              variant="outlined"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            />
            <Chip 
              label="Supply Chain Tracking" 
              color="info" 
              variant="outlined"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            />
            <Chip 
              label="Real-time Data" 
              color="success" 
              variant="outlined"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            />
          </Box>
        </Box>

        {/* Final CTA Section */}
        <Box sx={{ 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%'
        }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={handleGetStarted}
            sx={{
              py: { xs: 1.5, sm: 2 },
              px: { xs: 4, sm: 6 },
              fontSize: { xs: '1.1rem', sm: '1.2rem' },
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Begin Testing
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ 
        bgcolor: 'grey.100', 
        py: { xs: 3, sm: 4 }, 
        mt: { xs: 6, sm: 7, md: 8 },
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 },
            textAlign: { xs: 'center', sm: 'left' }
          }}>
            <Typography variant="body2" color="text.secondary" sx={{
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}>
              © 2024 Geopolitical Intelligence Platform. Beta Testing Version.
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 1, sm: 2 },
              justifyContent: { xs: 'center', sm: 'flex-end' }
            }}>
              <Tooltip title="Analytics Dashboard">
                <IconButton 
                  size="small"
                  onClick={() => {
                    // Track analytics click
                    const analyticsClicks = parseInt(localStorage.getItem('analyticsClicks') || '0') + 1;
                    localStorage.setItem('analyticsClicks', analyticsClicks.toString());
                  }}
                >
                  <Analytics />
                </IconButton>
              </Tooltip>
              <Tooltip title={`Page Views: ${pageViews}`}>
                <IconButton size="small">
                  <Info />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;

import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Chip,
  Button,
  Paper,
  Divider,
  Tooltip,
  IconButton
} from "@mui/material";
import {
  Security,
  Analytics,
  Business,
  Settings,
  Help,
  CheckCircle,
  TrendingUp,
  Assessment,
  Notifications,
  Dashboard
} from "@mui/icons-material";

const PERSONAS = [
  {
    id: 'risk',
    name: 'Risk Manager',
    description: 'Oversee enterprise risk management and compliance',
    icon: <Security fontSize="large" />,
    color: '#1976d2',
    features: [
      'Risk assessment tools',
      'Compliance monitoring',
      'Incident response workflows',
      'Regulatory updates'
    ],
    responsibilities: [
      'Enterprise risk oversight',
      'Compliance management',
      'Risk reporting',
      'Policy development'
    ]
  },
  {
    id: 'ops',
    name: 'Operations Manager',
    description: 'Manage day-to-day operations and supply chain',
    icon: <Settings fontSize="large" />,
    color: '#388e3c',
    features: [
      'Supply chain monitoring',
      'Operational alerts',
      'Resource planning',
      'Performance metrics'
    ],
    responsibilities: [
      'Supply chain management',
      'Operational efficiency',
      'Resource allocation',
      'Process optimization'
    ]
  },
  {
    id: 'analyst',
    name: 'Business Analyst',
    description: 'Analyze data and provide strategic insights',
    icon: <Analytics fontSize="large" />,
    color: '#f57c00',
    features: [
      'Advanced analytics',
      'Trend analysis',
      'Custom reporting',
      'Data visualization'
    ],
    responsibilities: [
      'Data analysis',
      'Strategic insights',
      'Performance reporting',
      'Market research'
    ]
  },
  {
    id: 'executive',
    name: 'Executive Leader',
    description: 'Strategic decision making and oversight',
    icon: <Business fontSize="large" />,
    color: '#7b1fa2',
    features: [
      'Executive dashboard',
      'Strategic insights',
      'Board reporting',
      'High-level alerts'
    ],
    responsibilities: [
      'Strategic planning',
      'Executive oversight',
      'Board communication',
      'Resource allocation'
    ]
  },
  {
    id: 'compliance',
    name: 'Compliance Officer',
    description: 'Ensure regulatory compliance and governance',
    icon: <Assessment fontSize="large" />,
    color: '#d32f2f',
    features: [
      'Regulatory tracking',
      'Compliance reporting',
      'Audit trails',
      'Policy management'
    ],
    responsibilities: [
      'Regulatory compliance',
      'Policy enforcement',
      'Audit coordination',
      'Training oversight'
    ]
  },
  {
    id: 'other',
    name: 'Other Role',
    description: 'Custom role with flexible configuration',
    icon: <Dashboard fontSize="large" />,
    color: '#757575',
    features: [
      'Customizable dashboard',
      'Flexible alerts',
      'Role-based access',
      'Personalized views'
    ],
    responsibilities: [
      'Custom workflows',
      'Flexible monitoring',
      'Personalized alerts',
      'Adaptive features'
    ]
  }
];

export default function PersonaSelection({ selectedPersona, onSelect, onError }) {
  const [hoveredPersona, setHoveredPersona] = useState(null);

  const handlePersonaSelect = (persona) => {
    try {
      onSelect(persona);
    } catch (err) {
      onError('Failed to select persona. Please try again.');
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 2, textAlign: 'center' }}>
        What's your primary role?
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
        Choose the role that best describes your responsibilities. This helps us tailor your experience.
      </Typography>

      <Grid container spacing={3}>
        {PERSONAS.map((persona) => (
          <Grid item xs={12} sm={6} md={4} key={persona.id}>
            <Card
              elevation={hoveredPersona === persona.id ? 8 : 2}
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: selectedPersona?.id === persona.id ? `2px solid ${persona.color}` : '2px solid transparent',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 8
                }
              }}
              onMouseEnter={() => setHoveredPersona(persona.id)}
              onMouseLeave={() => setHoveredPersona(null)}
            >
              <CardActionArea
                onClick={() => handlePersonaSelect(persona)}
                sx={{ height: '100%', p: 2 }}
              >
                <CardContent sx={{ textAlign: 'center', p: 0 }}>
                  {/* Icon and Selection Indicator */}
                  <Box sx={{ position: 'relative', mb: 2 }}>
                    <Box
                      sx={{
                        color: persona.color,
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 1
                      }}
                    >
                      {persona.icon}
                    </Box>
                    
                    {selectedPersona?.id === persona.id && (
                      <CheckCircle
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          color: 'success.main',
                          bgcolor: 'white',
                          borderRadius: '50%'
                        }}
                      />
                    )}
                  </Box>

                  {/* Title and Description */}
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {persona.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                    {persona.description}
                  </Typography>

                  {/* Key Features */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                      Key Features
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {persona.features.slice(0, 2).map((feature, index) => (
                        <Chip
                          key={index}
                          label={feature}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            mr: 0.5, 
                            mb: 0.5,
                            fontSize: '0.7rem',
                            borderColor: persona.color,
                            color: persona.color
                          }}
                        />
                      ))}
                      {persona.features.length > 2 && (
                        <Chip
                          label={`+${persona.features.length - 2} more`}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            fontSize: '0.7rem',
                            borderColor: 'grey.400',
                            color: 'text.secondary'
                          }}
                        />
                      )}
                    </Box>
                  </Box>

                  {/* Responsibilities */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                      Typical Responsibilities
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {persona.responsibilities.slice(0, 2).map((responsibility, index) => (
                        <Typography
                          key={index}
                          variant="caption"
                          color="text.secondary"
                          sx={{ 
                            display: 'block',
                            fontSize: '0.7rem',
                            lineHeight: 1.4
                          }}
                        >
                          • {responsibility}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Help Section */}
      <Paper elevation={1} sx={{ p: 3, mt: 4, bgcolor: 'grey.50' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Help color="primary" />
          <Typography variant="h6">Need Help Choosing?</Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Your role selection determines which features and insights are most relevant to you. 
          You can always change this later in your profile settings.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<TrendingUp />}
            onClick={() => window.open('#', '_blank')}
          >
            View Feature Comparison
          </Button>
          
          <Button
            variant="outlined"
            size="small"
            startIcon={<Notifications />}
            onClick={() => window.open('#', '_blank')}
          >
            Contact Sales Team
          </Button>
        </Box>
      </Paper>
    </Box>
  );
} 
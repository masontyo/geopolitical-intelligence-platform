import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  CircularProgress,
  LinearProgress
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Security,
  LocationOn,
  Business,
  Notifications,
  Dashboard as DashboardIcon,
  CheckCircleOutline
} from "@mui/icons-material";

// Generate generic sample data (not personalized)
const generateSampleData = () => {
  return {
    riskMetrics: {
      overallRisk: 'Medium',
      riskScore: 67,
      trend: 'trending_down',
      change: -12,
      alerts: [
        {
          id: 1,
          type: 'Geopolitical Risk',
          severity: 'High',
          title: 'Regional tensions affecting supply chain routes',
          description: 'Increased military activity in key shipping lanes may impact delivery timelines',
          region: 'Asia Pacific',
          timestamp: '2 hours ago',
          impact: 'Supply Chain Risk: High'
        },
        {
          id: 2,
          type: 'Regulatory Risk',
          severity: 'Medium',
          title: 'New compliance requirements in EU',
          description: 'Updated GDPR regulations require immediate action for data processing',
          region: 'Europe',
          timestamp: '6 hours ago',
          impact: 'Compliance Risk: Medium'
        },
        {
          id: 3,
          type: 'Supply Chain Risk',
          severity: 'Low',
          title: 'Weather delays in logistics hub',
          description: 'Severe weather conditions affecting operations in major port',
          region: 'North America',
          timestamp: '1 day ago',
          impact: 'Operational Risk: Low'
        }
      ]
    },
    insights: [
      {
        title: 'Supply Chain Resilience',
        description: 'Monitor key supply chain nodes and identify potential disruption risks before they impact operations',
        confidence: 89,
        impact: 'High',
        category: 'Supply Chain Risk'
      },
      {
        title: 'Regulatory Compliance',
        description: 'Stay ahead of changing regulations with automated monitoring and compliance alerts',
        confidence: 92,
        impact: 'Medium',
        category: 'Regulatory Risk'
      },
      {
        title: 'Geopolitical Monitoring',
        description: 'Track political developments and policy changes that could affect your business operations',
        confidence: 78,
        impact: 'Medium',
        category: 'Geopolitical Risk'
      }
    ],
    recommendations: [
      'Implement real-time monitoring for supply chain disruptions',
      'Review compliance procedures for new EU regulations',
      'Establish contingency plans for geopolitical events',
      'Enhance cybersecurity protocols for remote operations'
    ]
  };
};

export default function SampleDashboard({ profileData, onComplete, onError }) {
  const [sampleData, setSampleData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for demo purposes
    const timer = setTimeout(() => {
      setSampleData(generateSampleData());
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h6">Loading sample dashboard...</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          This is what your dashboard could look like
        </Typography>
      </Box>
    );
  }

  if (!sampleData) {
    return (
      <Alert severity="error">
        Failed to load sample dashboard. Please try again.
      </Alert>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getTrendIcon = (trend) => {
    return trend === 'trending_up' ? <TrendingUp color="success" /> : <TrendingDown color="error" />;
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
        Sample Dashboard Preview
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
        This is an example of what your dashboard could look like. Your actual dashboard will be personalized 
        based on the profile information you just provided.
      </Typography>

      {/* Sample Data Notice */}
      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="body2">
          <strong>Note:</strong> This dashboard shows sample data and examples. Your real dashboard will display 
          actual alerts, insights, and recommendations based on your company, business units, risk categories, 
          and regions of interest.
        </Typography>
      </Alert>

      {/* Risk Overview */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Security color="primary" />
          Risk Overview (Sample)
        </Typography>
        
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                {sampleData.riskMetrics.riskScore}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Risk Score
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                {sampleData.riskMetrics.overallRisk}
                {getTrendIcon(sampleData.riskMetrics.trend)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overall Risk Level
              </Typography>
              <Typography variant="caption" color="success.main">
                {sampleData.riskMetrics.change > 0 ? '+' : ''}{sampleData.riskMetrics.change}% from last week
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Risk Distribution
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="Low: 45%" color="success" size="small" />
                <Chip label="Medium: 35%" color="info" size="small" />
                <Chip label="High: 15%" color="warning" size="small" />
                <Chip label="Critical: 5%" color="error" size="small" />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Active Alerts */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="warning" />
          Sample Alerts ({sampleData.riskMetrics.alerts.length})
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          These are examples of the types of alerts you might see based on your risk categories and regions
        </Typography>
        
        <Grid container spacing={2}>
          {sampleData.riskMetrics.alerts.map((alert) => (
            <Grid item xs={12} key={alert.id}>
              <Card variant="outlined" sx={{ 
                borderLeft: `4px solid ${
                  alert.severity === 'Critical' ? 'error.main' :
                  alert.severity === 'High' ? 'warning.main' :
                  alert.severity === 'Medium' ? 'info.main' : 'success.main'
                }`
              }}>
                <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {alert.title}
                    </Typography>
                    <Chip 
                      label={alert.severity} 
                      color={getSeverityColor(alert.severity)} 
                      size="small" 
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {alert.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Chip 
                      icon={<LocationOn fontSize="small" />} 
                      label={alert.region} 
                      size="small" 
                      variant="outlined" 
                    />
                    <Typography variant="caption" color="text.secondary">
                      {alert.timestamp}
                    </Typography>
                    <Typography variant="caption" color="error.main" sx={{ fontWeight: 600 }}>
                      {alert.impact}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* AI Insights */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUp color="primary" />
          Sample AI Insights
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          These are examples of the types of insights and recommendations the AI could provide
        </Typography>
        
        <Grid container spacing={2}>
          {sampleData.insights.map((insight, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    {insight.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {insight.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip 
                      label={insight.category} 
                      size="small" 
                      variant="outlined" 
                      color="primary"
                    />
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" color="text.secondary">
                        Confidence
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {insight.confidence}%
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Recommendations */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleOutline color="success" />
          Sample Recommendations
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Examples of actionable recommendations the platform could provide
        </Typography>
        
        <List>
          {sampleData.recommendations.map((recommendation, index) => (
            <React.Fragment key={index}>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircle color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={recommendation} />
              </ListItem>
              {index < sampleData.recommendations.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Profile Summary */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
          Your Profile Summary
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Based on the information you provided, your dashboard will be personalized for:
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Company</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {profileData.company} ({profileData.industry})
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Business Units</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {profileData.businessUnits.slice(0, 3).map((unit) => (
                <Chip key={unit} label={unit} size="small" />
              ))}
              {profileData.businessUnits.length > 3 && (
                <Chip label={`+${profileData.businessUnits.length - 3} more`} size="small" variant="outlined" />
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Risk Categories</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {profileData.riskCategories.slice(0, 3).map((category) => (
                <Chip key={category} label={category} size="small" color="primary" />
              ))}
              {profileData.riskCategories.length > 3 && (
                <Chip label={`+${profileData.riskCategories.length - 3} more`} size="small" variant="outlined" />
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Regions</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {profileData.regions.slice(0, 3).map((region) => (
                <Chip key={region} label={region} size="small" color="secondary" />
              ))}
              {profileData.regions.length > 3 && (
                <Chip label={`+${profileData.regions.length - 3} more`} size="small" variant="outlined" />
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          onClick={() => window.history.back()}
        >
          Back to Profile
        </Button>
        
        <Button
          variant="contained"
          size="large"
          endIcon={<DashboardIcon />}
          onClick={onComplete}
          sx={{ minWidth: 160 }}
        >
          Complete Setup
        </Button>
      </Box>

      {/* Additional Info */}
      <Paper elevation={1} sx={{ p: 2, mt: 4, bgcolor: 'grey.50' }}>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          Your actual dashboard will show real-time alerts, insights, and recommendations based on your profile. 
          The AI will continuously learn from your preferences to provide increasingly relevant information.
        </Typography>
      </Paper>
    </Box>
  );
} 
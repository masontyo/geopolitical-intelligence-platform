import React, { useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Grid,
  Chip,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  ShowChart,
  FilterList,
  Download
} from '@mui/icons-material';

export default function RiskTrendChart({ events, timeRange, analyticsData }) {
  // Generate mock trend data for demonstration
  const trendData = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate realistic trend data
      const baseScore = 0.3;
      const variation = Math.sin(i * 0.5) * 0.2 + Math.random() * 0.1;
      const score = Math.max(0, Math.min(1, baseScore + variation));
      
      data.push({
        date: date.toISOString().split('T')[0],
        riskScore: score,
        eventCount: Math.floor(Math.random() * 5) + 1,
        highRiskEvents: Math.floor(Math.random() * 2)
      });
    }
    
    return data;
  }, [timeRange]);

  const currentScore = trendData[trendData.length - 1]?.riskScore || 0;
  const previousScore = trendData[trendData.length - 2]?.riskScore || 0;
  const scoreChange = currentScore - previousScore;
  const scoreChangePercent = previousScore > 0 ? (scoreChange / previousScore) * 100 : 0;

  const getScoreColor = (score) => {
    if (score >= 0.7) return 'error';
    if (score >= 0.4) return 'warning';
    return 'success';
  };

  const getTrendDirection = () => {
    if (scoreChange > 0.05) return 'up';
    if (scoreChange < -0.05) return 'down';
    return 'neutral';
  };

  const getTrendIcon = () => {
    const direction = getTrendDirection();
    switch (direction) {
      case 'up':
        return <TrendingUp color="error" />;
      case 'down':
        return <TrendingDown color="success" />;
      default:
        return <TrendingUp color="action" />;
    }
  };

  // Simple chart rendering (in a real app, you'd use a charting library like recharts)
  const renderSimpleChart = () => {
    const maxScore = Math.max(...trendData.map(d => d.riskScore));
    const minScore = Math.min(...trendData.map(d => d.riskScore));
    const range = maxScore - minScore;
    
    return (
      <Box sx={{ 
        height: 200, 
        position: 'relative',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        p: 2,
        bgcolor: 'background.paper'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'flex-end', 
          height: '100%', 
          gap: 1,
          justifyContent: 'space-between'
        }}>
          {trendData.map((point, index) => {
            const height = range > 0 ? ((point.riskScore - minScore) / range) * 100 : 50;
            return (
              <Tooltip 
                key={index} 
                title={`${point.date}: ${(point.riskScore * 100).toFixed(1)}%`}
              >
                <Box sx={{
                  flex: 1,
                  height: `${height}%`,
                  bgcolor: getScoreColor(point.riskScore) === 'error' ? 'error.main' :
                           getScoreColor(point.riskScore) === 'warning' ? 'warning.main' : 'success.main',
                  borderRadius: '4px 4px 0 0',
                  minHeight: 4,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    opacity: 0.8,
                    transform: 'scaleY(1.1)'
                  }
                }} />
              </Tooltip>
            );
          })}
        </Box>
        
        {/* Y-axis labels */}
        <Box sx={{ 
          position: 'absolute', 
          left: 0, 
          top: 0, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          pr: 1
        }}>
          <Typography variant="caption" color="text.secondary">100%</Typography>
          <Typography variant="caption" color="text.secondary">75%</Typography>
          <Typography variant="caption" color="text.secondary">50%</Typography>
          <Typography variant="caption" color="text.secondary">25%</Typography>
          <Typography variant="caption" color="text.secondary">0%</Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Grid container spacing={3}>
      {/* Main Chart */}
      <Grid item xs={12} lg={8}>
        <Card>
          <CardHeader 
            title="Risk Score Trend" 
            subheader={`Last ${timeRange} days`}
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small">
                  <FilterList />
                </IconButton>
                <IconButton size="small">
                  <Download />
                </IconButton>
              </Box>
            }
          />
          <CardContent>
            {renderSimpleChart()}
            
            {/* Chart Legend */}
            <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, bgcolor: 'success.main', borderRadius: 1 }} />
                <Typography variant="caption">Low Risk</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, bgcolor: 'warning.main', borderRadius: 1 }} />
                <Typography variant="caption">Medium Risk</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, bgcolor: 'error.main', borderRadius: 1 }} />
                <Typography variant="caption">High Risk</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Trend Summary */}
      <Grid item xs={12} lg={4}>
        <Card>
          <CardHeader title="Trend Summary" />
          <CardContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                {(currentScore * 100).toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Current Risk Score
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                {getTrendIcon()}
                <Typography 
                  variant="body2" 
                  color={scoreChangePercent > 0 ? 'error.main' : 'success.main'}
                  sx={{ fontWeight: 'medium' }}
                >
                  {scoreChangePercent > 0 ? '+' : ''}{scoreChangePercent.toFixed(1)}% from previous period
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Key Insights
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Peak Risk</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {(Math.max(...trendData.map(d => d.riskScore)) * 100).toFixed(1)}%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Average Risk</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {((trendData.reduce((sum, d) => sum + d.riskScore, 0) / trendData.length) * 100).toFixed(1)}%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Volatility</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {((Math.max(...trendData.map(d => d.riskScore)) - Math.min(...trendData.map(d => d.riskScore))) * 100).toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {trendData.slice(-3).reverse().map((point, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">
                      {new Date(point.date).toLocaleDateString()}
                    </Typography>
                    <Chip 
                      label={`${(point.riskScore * 100).toFixed(0)}%`}
                      size="small"
                      color={getScoreColor(point.riskScore)}
                      variant="outlined"
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Event Count Trend */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Event Activity Trend" />
          <CardContent>
            <Grid container spacing={2}>
              {trendData.slice(-7).map((point, index) => (
                <Grid item xs={12} sm={6} md={3} lg={1.7} key={index}>
                  <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {point.eventCount}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Events
                    </Typography>
                    {point.highRiskEvents > 0 && (
                      <Chip 
                        label={`${point.highRiskEvents} high-risk`}
                        size="small"
                        color="error"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
} 
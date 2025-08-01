import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  Tooltip
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  Remove 
} from '@mui/icons-material';

export default function RiskMetricsCard({ 
  title, 
  value, 
  trend, 
  trendDirection = 'neutral', 
  color = 'primary',
  icon,
  subtitle,
  description
}) {
  const getTrendIcon = () => {
    switch (trendDirection) {
      case 'up':
        return <TrendingUp color="error" fontSize="small" />;
      case 'down':
        return <TrendingDown color="success" fontSize="small" />;
      default:
        return <Remove color="action" fontSize="small" />;
    }
  };

  const getTrendColor = () => {
    switch (trendDirection) {
      case 'up':
        return 'error';
      case 'down':
        return 'success';
      default:
        return 'default';
    }
  };

  const getColorValue = () => {
    if (typeof color === 'string') {
      return color;
    }
    return 'primary';
  };

  return (
    <Card 
      elevation={2} 
      sx={{ 
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          elevation: 4,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: '50%',
            bgcolor: `${getColorValue()}.light`,
            color: `${getColorValue()}.main`
          }}>
            {icon}
          </Box>
          <Tooltip title={`Trend: ${trend}`}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {getTrendIcon()}
              <Typography 
                variant="caption" 
                color={`${getTrendColor()}.main`}
                sx={{ fontWeight: 'medium' }}
              >
                {trend}
              </Typography>
            </Box>
          </Tooltip>
        </Box>

        <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
          {value}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {title}
        </Typography>

        {subtitle && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            {subtitle}
          </Typography>
        )}

        {description && (
          <Typography variant="caption" color="text.secondary">
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
} 
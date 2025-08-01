import React from 'react';
import { Box, CircularProgress, Typography, LinearProgress } from '@mui/material';

export const LoadingSpinner = ({ message = "Loading...", size = "medium" }) => {
  const spinnerSize = size === "small" ? 24 : size === "large" ? 48 : 32;
  
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      p={3}
      gap={2}
    >
      <CircularProgress size={spinnerSize} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export const ProgressBar = ({ value, message, showPercentage = true }) => {
  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
        {showPercentage && (
          <Typography variant="body2" color="text.secondary">
            {Math.round(value)}%
          </Typography>
        )}
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={value} 
        sx={{ height: 8, borderRadius: 4 }}
      />
    </Box>
  );
};

export const SkeletonLoader = ({ lines = 3, height = 20 }) => {
  return (
    <Box>
      {Array.from({ length: lines }).map((_, index) => (
        <Box
          key={index}
          sx={{
            height,
            backgroundColor: 'grey.200',
            borderRadius: 1,
            mb: 1,
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': { opacity: 1 },
              '50%': { opacity: 0.5 },
              '100%': { opacity: 1 },
            },
          }}
        />
      ))}
    </Box>
  );
}; 
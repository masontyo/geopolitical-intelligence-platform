import React from 'react';
import {
  Box
} from '@mui/material';

// Custom Timeline Component to replace @mui/lab Timeline
const CustomTimeline = ({ children, sx = {} }) => {
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      {children}
    </Box>
  );
};

const CustomTimelineItem = ({ children, sx = {} }) => {
  return (
    <Box sx={{ position: 'relative', mb: 3, ...sx }}>
      {children}
    </Box>
  );
};

const CustomTimelineSeparator = ({ children, sx = {} }) => {
  return (
    <Box sx={{ 
      position: 'absolute', 
      left: 0, 
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      ...sx 
    }}>
      {children}
    </Box>
  );
};

const CustomTimelineDot = ({ 
  children, 
  color = 'primary', 
  variant = 'filled',
  sx = {} 
}) => {
  const getColor = () => {
    switch (color) {
      case 'error': return '#f44336';
      case 'warning': return '#ff9800';
      case 'info': return '#2196f3';
      case 'success': return '#4caf50';
      case 'primary':
      default: return '#1976d2';
    }
  };

  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: variant === 'outlined' ? 'transparent' : getColor(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: variant === 'outlined' ? getColor() : 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        border: variant === 'outlined' ? `2px solid ${getColor()}` : 'none',
        ...sx
      }}
    >
      {children}
    </Box>
  );
};

const CustomTimelineConnector = ({ sx = {} }) => {
  return (
    <Box
      sx={{
        width: 2,
        height: 60,
        backgroundColor: 'grey.300',
        mt: 1,
        ...sx
      }}
    />
  );
};

const CustomTimelineContent = ({ children, sx = {} }) => {
  return (
    <Box sx={{ ml: 6, ...sx }}>
      {children}
    </Box>
  );
};

// Export all components
export {
  CustomTimeline as Timeline,
  CustomTimelineItem as TimelineItem,
  CustomTimelineSeparator as TimelineSeparator,
  CustomTimelineDot as TimelineDot,
  CustomTimelineConnector as TimelineConnector,
  CustomTimelineContent as TimelineContent
};

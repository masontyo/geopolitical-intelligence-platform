// App.js - Main application component with routing
// Updated for enterprise dashboard and real data integration
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OnboardingFlow from './components/OnboardingFlow';
import DashboardLayout from './components/DashboardLayout';
import EnterpriseDashboard from './components/EnterpriseDashboard';
import EventDetails from './components/EventDetails';
import { ToastProvider } from './components/ToastNotifications';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a custom enterprise theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1e3a8a', // Deep blue for enterprise
      light: '#3b82f6',
      dark: '#1e40af',
    },
    secondary: {
      main: '#059669', // Green for success/positive
      light: '#10b981',
      dark: '#047857',
    },
    error: {
      main: '#dc2626', // Red for critical alerts
      light: '#ef4444',
      dark: '#b91c1c',
    },
    warning: {
      main: '#d97706', // Orange for warnings
      light: '#f59e0b',
      dark: '#b45309',
    },
    success: {
      main: '#059669', // Green for success
      light: '#10b981',
      dark: '#047857',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.4,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          fontSize: '0.875rem',
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Navigate to="/onboarding" replace />} />
              <Route path="/onboarding" element={<OnboardingFlow />} />
              <Route path="/dashboard/:profileId" element={
                <DashboardLayout>
                  <EnterpriseDashboard />
                </DashboardLayout>
              } />
              <Route path="/event/:eventId" element={<EventDetails />} />
              <Route path="/alerts" element={
                <DashboardLayout>
                  <div>Alerts Page - Coming Soon</div>
                </DashboardLayout>
              } />
              <Route path="/geographic" element={
                <DashboardLayout>
                  <div>Geographic View - Coming Soon</div>
                </DashboardLayout>
              } />
              <Route path="/analytics" element={
                <DashboardLayout>
                  <div>Analytics Page - Coming Soon</div>
                </DashboardLayout>
              } />
              <Route path="/notifications" element={
                <DashboardLayout>
                  <div>Notifications Page - Coming Soon</div>
                </DashboardLayout>
              } />
              <Route path="/settings" element={
                <DashboardLayout>
                  <div>Settings Page - Coming Soon</div>
                </DashboardLayout>
              } />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;

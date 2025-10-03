// App.js - Main application component with routing
// Updated for enterprise dashboard and real data integration
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import EnterpriseDashboard from './components/EnterpriseDashboard';
import MapCentricDashboard from './components/MapCentricDashboard';
import SupplierDetailPage from './components/SupplierDetailPage';
import PortDetailPage from './components/PortDetailPage';
import EventDetailPage from './components/EventDetailPage';
import EventDetails from './components/EventDetails';
import EventsList from './components/EventsList';
import TasksPage from './components/TasksPage';

import AlertsPage from './components/AlertsPage';
import Settings from './components/Settings';
import CompanyProfile from './components/settings/CompanyProfile';
import AccountSettings from './components/settings/AccountSettings';
import DataPrivacy from './components/settings/DataPrivacy';
import HelpSupport from './components/settings/HelpSupport';
import SupplyChainOnboarding from './components/onboarding/SupplyChainOnboarding';
import LandingPage from './components/LandingPage';
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
        outlined: {
          borderWidth: 1.5,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
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
      <AuthProvider>
        <ToastProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Protected routes - require authentication */}
                <Route path="/onboarding" element={
                  <ProtectedRoute>
                    <SupplyChainOnboarding />
                  </ProtectedRoute>
                } />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <MapCentricDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/supplier/:supplierId" element={
                  <ProtectedRoute>
                    <SupplierDetailPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/port/:portId" element={
                  <ProtectedRoute>
                    <PortDetailPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/event/:eventId" element={
                  <ProtectedRoute>
                    <EventDetailPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/dashboard/:profileId" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <EnterpriseDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/event/:eventId" element={
                  <ProtectedRoute>
                    <EventDetails />
                  </ProtectedRoute>
                } />
                
                <Route path="/events" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <EventsList />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/tasks" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <TasksPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/checklist" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Navigate to="/tasks" replace />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/alerts" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <AlertsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/geographic" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <div>Geographic View - Coming Soon</div>
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/analytics" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <div>Analytics Page - Coming Soon</div>
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/notifications" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <div>Notifications Page - Coming Soon</div>
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Settings />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/settings/company" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <CompanyProfile />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/settings/account" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <AccountSettings />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/settings/privacy" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <DataPrivacy />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/settings/support" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <HelpSupport />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                {/* Catch all route - redirect to dashboard */}
                <Route path="*" element={
                  <ProtectedRoute>
                    <Navigate to="/dashboard" replace />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

import React from 'react';
import './App.css';
import OnboardingFlow from './components/OnboardingFlow';
import IntegratedDashboard from './components/IntegratedDashboard';
import { ToastProvider } from './components/ToastNotifications';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a custom theme for better UX
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
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
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <div className="App">
          <OnboardingFlow />
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;

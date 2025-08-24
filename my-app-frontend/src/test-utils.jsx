import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ToastProvider } from './components/ToastNotifications';

// Create a basic theme for testing
const theme = createTheme({
  // Add any theme customizations needed for testing
  components: {
    MuiGrid: {
      // Suppress Grid v2 warnings in tests
      defaultProps: {
        disableLegacyGrid: true,
      },
    },
  },
});

// Custom render function that includes all necessary providers
const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render }; 
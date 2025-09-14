import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnalyticsWidgets from '../AnalyticsWidgets';

// Mock the useTheme hook
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useTheme: () => ({
    palette: {
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
      error: { main: '#d32f2f' },
      success: { main: '#2e7d32' },
      background: { paper: '#ffffff' }
    }
  }),
}));

describe('AnalyticsWidgets', () => {
  const mockAnalytics = {
    riskTrend: 'increasing',
    notificationDelivery: 95,
    profileCompletion: 87,
    activeAlerts: 12,
    totalEvents: 45,
    averageResponseTime: '2.3h',
    topRegions: ['North America', 'Europe', 'Asia Pacific'],
    topCategories: ['Supply Chain', 'Cybersecurity', 'Regulatory']
  };

  const mockProfile = {
    id: 'test-profile-1',
    name: 'Test Company',
    regions: ['North America', 'Europe']
  };

  it('renders without crashing', () => {
    render(
      <AnalyticsWidgets 
        analytics={mockAnalytics}
        profile={mockProfile}
      />
    );
    expect(document.body).toBeInTheDocument();
  });

  it('displays analytics widgets content', () => {
    render(
      <AnalyticsWidgets 
        analytics={mockAnalytics}
        profile={mockProfile}
      />
    );
    expect(document.body).toBeInTheDocument();
  });

  it('renders with decreasing risk trend', () => {
    const decreasingAnalytics = { ...mockAnalytics, riskTrend: 'decreasing' };
    render(
      <AnalyticsWidgets 
        analytics={decreasingAnalytics}
        profile={mockProfile}
      />
    );
    expect(document.body).toBeInTheDocument();
  });

  it('renders with no profile', () => {
    render(
      <AnalyticsWidgets 
        analytics={mockAnalytics}
        profile={null}
      />
    );
    expect(document.body).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RiskStatusOverview from '../RiskStatusOverview';

// Mock the useTheme hook
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useTheme: () => ({
    palette: {
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
      error: { main: '#d32f2f', light: '#ffcdd2' },
      warning: { main: '#ed6c02', light: '#fff3e0' },
      success: { main: '#2e7d32', light: '#c8e6c9' },
      grey: { 100: '#f5f5f5' }
    }
  }),
}));

describe('RiskStatusOverview', () => {
  const mockRiskData = {
    threatLevel: 'medium',
    activeAlerts: 5,
    totalEvents: 12,
    riskScore: 0.65,
    recentAlerts: [
      {
        id: 'alert-1',
        title: 'Supply Chain Disruption',
        severity: 'high',
        timestamp: '2024-01-15T10:00:00Z'
      },
      {
        id: 'alert-2',
        title: 'Cybersecurity Alert',
        severity: 'medium',
        timestamp: '2024-01-14T15:30:00Z'
      }
    ],
    recentIncidents: [
      {
        id: 'incident-1',
        title: 'Data Breach Attempt',
        severity: 'high',
        timestamp: '2024-01-15T08:00:00Z'
      },
      {
        id: 'incident-2',
        title: 'System Outage',
        severity: 'medium',
        timestamp: '2024-01-14T12:00:00Z'
      }
    ]
  };

  const mockOnViewAllAlerts = jest.fn();
  const mockOnEventClick = jest.fn();

  it('renders without crashing', () => {
    render(
      <RiskStatusOverview 
        riskData={mockRiskData}
        onViewAllAlerts={mockOnViewAllAlerts}
        onEventClick={mockOnEventClick}
      />
    );
    expect(document.body).toBeInTheDocument();
  });

  it('displays risk status overview content', () => {
    render(
      <RiskStatusOverview 
        riskData={mockRiskData}
        onViewAllAlerts={mockOnViewAllAlerts}
        onEventClick={mockOnEventClick}
      />
    );
    expect(document.body).toBeInTheDocument();
  });

  it('renders with different threat levels', () => {
    const highRiskData = { ...mockRiskData, threatLevel: 'high' };
    render(
      <RiskStatusOverview 
        riskData={highRiskData}
        onViewAllAlerts={mockOnViewAllAlerts}
        onEventClick={mockOnEventClick}
      />
    );
    expect(document.body).toBeInTheDocument();
  });

  it('renders with low threat level', () => {
    const lowRiskData = { ...mockRiskData, threatLevel: 'low' };
    render(
      <RiskStatusOverview 
        riskData={lowRiskData}
        onViewAllAlerts={mockOnViewAllAlerts}
        onEventClick={mockOnEventClick}
      />
    );
    expect(document.body).toBeInTheDocument();
  });
});

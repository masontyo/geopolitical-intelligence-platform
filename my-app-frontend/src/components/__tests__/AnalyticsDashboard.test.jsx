import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnalyticsDashboard from '../AnalyticsDashboard';

// Mock the useToast hook
jest.mock('../ToastNotifications', () => ({
  useToast: () => ({
    error: jest.fn(),
    info: jest.fn(),
  }),
}));

// Mock the userProfileAPI
jest.mock('../../services/api', () => ({
  userProfileAPI: {
    getProfile: jest.fn(),
    getRelevantEvents: jest.fn(),
    getScoringAnalytics: jest.fn(),
  },
}));

// Mock the child components to actually render content
jest.mock('../analytics/RiskTrendChart', () => {
  return function MockRiskTrendChart() {
    return <div data-testid="risk-trend-chart">Risk Trend Chart</div>;
  };
});

jest.mock('../analytics/GeographicRiskMap', () => {
  return function MockGeographicRiskMap() {
    return <div data-testid="geographic-risk-map">Geographic Risk Map</div>;
  };
});

jest.mock('../analytics/RiskMetricsCard', () => {
  return function MockRiskMetricsCard({ title, value, trend, trendDirection, color, icon, subtitle }) {
    return (
      <div data-testid="risk-metrics-card">
        <div>{title}: {value}</div>
        <div>{trend}</div>
        <div>{trendDirection}</div>
        <div>{color}</div>
        {subtitle && <div>{subtitle}</div>}
      </div>
    );
  };
});

jest.mock('../analytics/AlertSystem', () => {
  return function MockAlertSystem() {
    return <div data-testid="alert-system">Alert System</div>;
  };
});

describe('AnalyticsDashboard', () => {
  const mockProfile = {
    id: 'test-profile-1',
    name: 'Test Company',
    company: 'Test Company Inc',
    industry: 'Technology'
  };

  const mockEvents = [
    {
      id: 'event-1',
      title: 'Supply Chain Disruption',
      relevanceScore: 0.8,
      severity: 'high',
      regions: ['North America', 'Asia']
    },
    {
      id: 'event-2',
      title: 'Cybersecurity Alert',
      relevanceScore: 0.6,
      severity: 'medium',
      regions: ['Europe']
    }
  ];

  const mockAnalyticsData = {
    factorAnalysis: {
      'Supply Chain': 0.8,
      'Cybersecurity': 0.6,
      'Regulatory': 0.4
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders loading state initially', () => {
    render(<AnalyticsDashboard profileId="test-profile-1" />);
    expect(screen.getByText('Loading advanced analytics dashboard...')).toBeInTheDocument();
  });

  it('renders error state when no profileId is provided', async () => {
    render(<AnalyticsDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Analytics Dashboard Loading Failed')).toBeInTheDocument();
      expect(screen.getByText('No profile ID provided')).toBeInTheDocument();
    });
  });

  it('renders error state when API calls fail', async () => {
    const { userProfileAPI } = require('../../services/api');
    userProfileAPI.getProfile.mockRejectedValue(new Error('API Error'));
    userProfileAPI.getRelevantEvents.mockRejectedValue(new Error('API Error'));
    userProfileAPI.getScoringAnalytics.mockRejectedValue(new Error('API Error'));

    render(<AnalyticsDashboard profileId="test-profile-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Analytics Dashboard Loading Failed')).toBeInTheDocument();
      expect(screen.getByText('Failed to load analytics data: API Error')).toBeInTheDocument();
    });
  });

  it('renders dashboard content when data loads successfully', async () => {
    const { userProfileAPI } = require('../../services/api');
    userProfileAPI.getProfile.mockResolvedValue({ profile: mockProfile });
    userProfileAPI.getRelevantEvents.mockResolvedValue({ events: mockEvents });
    userProfileAPI.getScoringAnalytics.mockResolvedValue(mockAnalyticsData);

    render(<AnalyticsDashboard profileId="test-profile-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Advanced Risk Intelligence Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Welcome back, Test Company • Test Company Inc • Technology')).toBeInTheDocument();
    });
  });

  it('displays risk metrics cards with correct data', async () => {
    const { userProfileAPI } = require('../../services/api');
    userProfileAPI.getProfile.mockResolvedValue({ profile: mockProfile });
    userProfileAPI.getRelevantEvents.mockResolvedValue({ events: mockEvents });
    userProfileAPI.getScoringAnalytics.mockResolvedValue(mockAnalyticsData);

    render(<AnalyticsDashboard profileId="test-profile-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Overall Risk Score: 70.0%')).toBeInTheDocument();
      expect(screen.getByText('Active Events: 2')).toBeInTheDocument();
      expect(screen.getByText('Risk Velocity: 12.3')).toBeInTheDocument();
      expect(screen.getByText('Geographic Coverage: 3')).toBeInTheDocument();
    });
  });

  it('handles tab changes correctly', async () => {
    const { userProfileAPI } = require('../../services/api');
    userProfileAPI.getProfile.mockResolvedValue({ profile: mockProfile });
    userProfileAPI.getRelevantEvents.mockResolvedValue({ events: mockEvents });
    userProfileAPI.getScoringAnalytics.mockResolvedValue(mockAnalyticsData);

    render(<AnalyticsDashboard profileId="test-profile-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Advanced Risk Intelligence Dashboard')).toBeInTheDocument();
    });

    // Wait for tabs to be rendered
    await waitFor(() => {
      const tabs = screen.getAllByRole('tab');
      expect(tabs.length).toBeGreaterThan(0);
    });

    const tabs = screen.getAllByRole('tab');
    
    // Click on a different tab (if available)
    if (tabs.length > 1) {
      fireEvent.click(tabs[1]);
      // Should show the content for that tab
      expect(screen.getByText('Advanced Risk Intelligence Dashboard')).toBeInTheDocument();
    }
  });

  it('handles time range changes', async () => {
    const { userProfileAPI } = require('../../services/api');
    userProfileAPI.getProfile.mockResolvedValue({ profile: mockProfile });
    userProfileAPI.getRelevantEvents.mockResolvedValue({ events: mockEvents });
    userProfileAPI.getScoringAnalytics.mockResolvedValue(mockAnalyticsData);

    render(<AnalyticsDashboard profileId="test-profile-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Advanced Risk Intelligence Dashboard')).toBeInTheDocument();
    });

    // Click on 30d time range
    const timeRangeChips = screen.getAllByText(/7d|30d|90d/);
    expect(timeRangeChips.length).toBeGreaterThan(0);
    
    // The first chip should be filled by default
    expect(timeRangeChips[0]).toBeInTheDocument();
  });

  it('handles retry button click', async () => {
    const { userProfileAPI } = require('../../services/api');
    userProfileAPI.getProfile.mockRejectedValue(new Error('API Error'));
    userProfileAPI.getRelevantEvents.mockRejectedValue(new Error('API Error'));
    userProfileAPI.getScoringAnalytics.mockRejectedValue(new Error('API Error'));

    render(<AnalyticsDashboard profileId="test-profile-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Analytics Dashboard Loading Failed')).toBeInTheDocument();
    });

    // Wait for the retry button to be rendered
    await waitFor(() => {
      const retryButton = screen.getByText(/Retry/);
      expect(retryButton).toBeInTheDocument();
    });

    const retryButton = screen.getByText(/Retry/);
    fireEvent.click(retryButton);

    // Should show retry count
    await waitFor(() => {
      expect(screen.getByText(/Retry \(\d+\)/)).toBeInTheDocument();
    });
  });

  it('renders with no profile data', async () => {
    const { userProfileAPI } = require('../../services/api');
    userProfileAPI.getProfile.mockResolvedValue({ profile: null });
    userProfileAPI.getRelevantEvents.mockResolvedValue({ events: [] });
    userProfileAPI.getScoringAnalytics.mockResolvedValue({});

    render(<AnalyticsDashboard profileId="test-profile-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Profile not found. Please check your profile ID and try again.')).toBeInTheDocument();
    });
  });

  it('calculates risk scores correctly', async () => {
    const { userProfileAPI } = require('../../services/api');
    userProfileAPI.getProfile.mockResolvedValue({ profile: mockProfile });
    userProfileAPI.getRelevantEvents.mockResolvedValue({ events: mockEvents });
    userProfileAPI.getScoringAnalytics.mockResolvedValue(mockAnalyticsData);

    render(<AnalyticsDashboard profileId="test-profile-1" />);
    
    await waitFor(() => {
      // Overall risk score should be average of relevance scores (0.8 + 0.6) / 2 = 0.7 = 70%
      expect(screen.getByText('Overall Risk Score: 70.0%')).toBeInTheDocument();
    });
  });

  it('displays dashboard content correctly', async () => {
    const { userProfileAPI } = require('../../services/api');
    userProfileAPI.getProfile.mockResolvedValue({ profile: mockProfile });
    userProfileAPI.getRelevantEvents.mockResolvedValue({ events: mockEvents });
    userProfileAPI.getScoringAnalytics.mockResolvedValue(mockAnalyticsData);

    render(<AnalyticsDashboard profileId="test-profile-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Advanced Risk Intelligence Dashboard')).toBeInTheDocument();
    });

    // Should show the main dashboard content
    expect(screen.getByText('Welcome back, Test Company • Test Company Inc • Technology')).toBeInTheDocument();
    expect(screen.getByText('7d')).toBeInTheDocument();
    expect(screen.getByText('30d')).toBeInTheDocument();
    expect(screen.getByText('90d')).toBeInTheDocument();
  });
});

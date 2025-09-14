import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../Dashboard';

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
  },
}));

// Mock the AnalyticsDashboard component
jest.mock('../AnalyticsDashboard', () => {
  return function MockAnalyticsDashboard() {
    return <div data-testid="analytics-dashboard">Analytics Dashboard</div>;
  };
});

describe('Dashboard', () => {
  const mockProfile = {
    id: 'test-profile-1',
    name: 'Test Company',
    company: 'Test Company Inc',
    businessUnits: [
      { name: 'Operations' },
      { name: 'Finance' }
    ],
    areasOfConcern: [
      { category: 'Supply Chain' },
      { category: 'Cybersecurity' }
    ],
    riskTolerance: 'Medium'
  };

  const mockEvents = [
    {
      title: 'Supply Chain Disruption',
      description: 'Port closures affecting shipments',
      riskLevel: 'High',
      affectedRegions: ['Asia Pacific'],
      relevanceScore: 0.85
    },
    {
      title: 'Cybersecurity Alert',
      description: 'New phishing campaign detected',
      riskLevel: 'Medium',
      affectedRegions: ['Global'],
      relevanceScore: 0.72
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<Dashboard profileId="test-profile-1" />);
    expect(screen.getByText('Loading your personalized dashboard...')).toBeInTheDocument();
  });

  it('renders error state when no profileId is provided', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard Loading Failed')).toBeInTheDocument();
      expect(screen.getByText('No profile ID provided')).toBeInTheDocument();
    });
  });

  it('renders profile summary when data is loaded', async () => {
    const { userProfileAPI } = require('../../services/api');
    userProfileAPI.getProfile.mockResolvedValue({ profile: mockProfile });
    userProfileAPI.getRelevantEvents.mockResolvedValue({ events: mockEvents });

    render(<Dashboard profileId="test-profile-1" />);

    await waitFor(() => {
      expect(screen.getByText('Welcome, Test Company')).toBeInTheDocument();
      expect(screen.getByText('Profile Summary')).toBeInTheDocument();
      expect(screen.getByText('Company')).toBeInTheDocument();
      expect(screen.getByText('Test Company Inc')).toBeInTheDocument();
    });
  });

  it('displays business units', async () => {
    const { userProfileAPI } = require('../../services/api');
    userProfileAPI.getProfile.mockResolvedValue({ profile: mockProfile });
    userProfileAPI.getRelevantEvents.mockResolvedValue({ events: mockEvents });

    render(<Dashboard profileId="test-profile-1" />);

    await waitFor(() => {
      expect(screen.getByText('Operations')).toBeInTheDocument();
      expect(screen.getByText('Finance')).toBeInTheDocument();
    });
  });

  it('displays areas of concern', async () => {
    const { userProfileAPI } = require('../../services/api');
    userProfileAPI.getProfile.mockResolvedValue({ profile: mockProfile });
    userProfileAPI.getRelevantEvents.mockResolvedValue({ events: mockEvents });

    render(<Dashboard profileId="test-profile-1" />);

    await waitFor(() => {
      expect(screen.getByText('Supply Chain')).toBeInTheDocument();
      expect(screen.getByText('Cybersecurity')).toBeInTheDocument();
    });
  });

  it('displays relevant events', async () => {
    const { userProfileAPI } = require('../../services/api');
    userProfileAPI.getProfile.mockResolvedValue({ profile: mockProfile });
    userProfileAPI.getRelevantEvents.mockResolvedValue({ events: mockEvents });

    render(<Dashboard profileId="test-profile-1" />);

    await waitFor(() => {
      expect(screen.getByText('Supply Chain Disruption')).toBeInTheDocument();
      expect(screen.getByText('Cybersecurity Alert')).toBeInTheDocument();
      expect(screen.getByText('Port closures affecting shipments')).toBeInTheDocument();
    });
  });

  it('shows no events message when no events are found', async () => {
    const { userProfileAPI } = require('../../services/api');
    userProfileAPI.getProfile.mockResolvedValue({ profile: mockProfile });
    userProfileAPI.getRelevantEvents.mockResolvedValue({ events: [] });

    render(<Dashboard profileId="test-profile-1" />);

    await waitFor(() => {
      expect(screen.getByText('No relevant events found. Events will appear here as they are detected.')).toBeInTheDocument();
    });
  });

  it('switches to analytics tab when clicked', async () => {
    const { userProfileAPI } = require('../../services/api');
    userProfileAPI.getProfile.mockResolvedValue({ profile: mockProfile });
    userProfileAPI.getRelevantEvents.mockResolvedValue({ events: mockEvents });

    render(<Dashboard profileId="test-profile-1" />);

    await waitFor(() => {
      expect(screen.getByText('Advanced Analytics')).toBeInTheDocument();
    });

    const analyticsTab = screen.getByText('Advanced Analytics');
    fireEvent.click(analyticsTab);

    expect(screen.getByTestId('analytics-dashboard')).toBeInTheDocument();
  });

  it('displays risk tolerance chip', async () => {
    const { userProfileAPI } = require('../../services/api');
    userProfileAPI.getProfile.mockResolvedValue({ profile: mockProfile });
    userProfileAPI.getRelevantEvents.mockResolvedValue({ events: mockEvents });

    render(<Dashboard profileId="test-profile-1" />);

    await waitFor(() => {
      expect(screen.getAllByText('Medium')[0]).toBeInTheDocument();
    });
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CROProfileReview from '../CROProfileReview';

describe('CROProfileReview', () => {
  const mockProfile = {
    companyName: 'Test Company',
    hqLocation: 'Test Location',
    businessUnits: ['Unit 1', 'Unit 2'],
    supplyChainNodes: 'Test Nodes',
    criticalRegions: ['Region 1', 'Region 2'],
    eventTypesConcerned: ['Type 1', 'Type 2'],
    pastDisruptions: 'Test Disruptions',
    stakeholders: 'Test Stakeholders',
    deliveryPreference: 'Test Delivery'
  };

  const mockOnEdit = jest.fn();
  const mockOnContinue = jest.fn();

  it('renders without crashing', () => {
    render(<CROProfileReview profile={mockProfile} onEdit={mockOnEdit} onContinue={mockOnContinue} />);
    // Check for the actual content being rendered
    expect(screen.getByText('Review Your Profile')).toBeInTheDocument();
  });

  it('displays profile review content', () => {
    render(<CROProfileReview profile={mockProfile} onEdit={mockOnEdit} onContinue={mockOnContinue} />);
    // Check for specific content elements
    expect(screen.getByText('Review Your Profile')).toBeInTheDocument();
    expect(screen.getByText('Company Name')).toBeInTheDocument();
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });
});

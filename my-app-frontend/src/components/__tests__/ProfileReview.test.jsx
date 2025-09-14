import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfileReview from '../onboarding/ProfileReview';

describe('ProfileReview', () => {
  const mockBasicInfo = {
    firstName: 'John',
    lastName: 'Doe',
    company: 'Test Company',
    role: 'Test Role'
  };

  const mockProfile = {
    businessUnits: ['Unit 1', 'Unit 2'],
    regions: ['Region 1', 'Region 2'],
    areasOfConcern: ['Concern 1', 'Concern 2']
  };

  const mockPersona = {
    name: 'Test Persona',
    color: 'primary.main',
    icon: '🚀',
    features: ['Feature 1', 'Feature 2', 'Feature 3']
  };

  const mockOnEdit = jest.fn();
  const mockOnContinue = jest.fn();

  it('renders without crashing', () => {
    render(
      <ProfileReview 
        basicInfo={mockBasicInfo}
        profile={mockProfile}
        persona={mockPersona}
        onEdit={mockOnEdit}
        onContinue={mockOnContinue}
      />
    );
    // Check for the actual content being rendered
    expect(screen.getByText('Review Your Profile')).toBeInTheDocument();
  });

  it('displays profile review content', () => {
    render(
      <ProfileReview 
        basicInfo={mockBasicInfo}
        profile={mockProfile}
        persona={mockPersona}
        onEdit={mockOnEdit}
        onContinue={mockOnContinue}
      />
    );
    // Check for specific content elements
    expect(screen.getByText('Review Your Profile')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
  });
});

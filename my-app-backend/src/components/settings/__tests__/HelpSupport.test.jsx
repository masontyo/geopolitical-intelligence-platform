import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import HelpSupport from '../HelpSupport';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('HelpSupport Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    renderWithRouter(<HelpSupport />);
    expect(screen.getByText('Help & Support')).toBeInTheDocument();
  });

  it('should display help description', () => {
    renderWithRouter(<HelpSupport />);
    expect(screen.getByText('Find answers, documentation, and get help when you need it')).toBeInTheDocument();
  });

  it('should show quick help section', () => {
    renderWithRouter(<HelpSupport />);
    expect(screen.getByText('Quick Help')).toBeInTheDocument();
  });

  it('should display documentation section', () => {
    renderWithRouter(<HelpSupport />);
    expect(screen.getByText('Documentation & Resources')).toBeInTheDocument();
  });

  it('should show documentation resources', () => {
    renderWithRouter(<HelpSupport />);
    expect(screen.getByText('Getting Started Guide')).toBeInTheDocument();
    expect(screen.getByText('Video Tutorials')).toBeInTheDocument();
    expect(screen.getByText('API Documentation')).toBeInTheDocument();
    expect(screen.getByText('Troubleshooting Guide')).toBeInTheDocument();
  });

  it('should display FAQ section', () => {
    renderWithRouter(<HelpSupport />);
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
  });

  it('should show support channels section', () => {
    renderWithRouter(<HelpSupport />);
    expect(screen.getByText('Get Support')).toBeInTheDocument();
  });

  it('should display support contact information', () => {
    renderWithRouter(<HelpSupport />);
    expect(screen.getByText('Email Support')).toBeInTheDocument();
    expect(screen.getByText('Phone Support')).toBeInTheDocument();
    expect(screen.getByText('Live Chat')).toBeInTheDocument();
  });

  it('should render help icons correctly', () => {
    renderWithRouter(<HelpSupport />);
    
    // Should show various help-related icons (using getAllByTestId for duplicates)
    expect(screen.getByTestId('HelpIcon')).toBeInTheDocument();
    const bookIcons = screen.getAllByTestId('BookIcon');
    expect(bookIcons.length).toBeGreaterThan(0);
    expect(screen.getByTestId('DownloadIcon')).toBeInTheDocument();
  });

  it('should show back navigation button', () => {
    renderWithRouter(<HelpSupport />);
    const backButton = screen.getByTestId('ArrowBackIcon');
    expect(backButton).toBeInTheDocument();
  });

  it('should display quick help buttons', () => {
    renderWithRouter(<HelpSupport />);
    expect(screen.getByText('Update Onboarding Info')).toBeInTheDocument();
    expect(screen.getByText('Export My Data')).toBeInTheDocument();
  });

  it('should show contact support form', () => {
    renderWithRouter(<HelpSupport />);
    expect(screen.getByText('Contact Support Team')).toBeInTheDocument();
    expect(screen.getByText('Send Support Request')).toBeInTheDocument();
  });

  it('should display additional resources section', () => {
    renderWithRouter(<HelpSupport />);
    expect(screen.getByText(/Can't find what you're looking for/)).toBeInTheDocument();
  });
});


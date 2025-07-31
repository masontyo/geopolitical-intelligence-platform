import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CROOnboardingForm from '../CROOnboardingForm';

// Mock Material-UI components
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  TextField: ({ label, value, onChange, error, helperText, ...props }) => (
    <div>
      <label htmlFor={props.id || 'input'}>{label}</label>
      <input
        id={props.id || 'input'}
        value={value || ''}
        onChange={onChange}
        data-testid={props['data-testid']}
        {...props}
      />
      {error && <span data-testid="error">{helperText}</span>}
    </div>
  ),
  Button: ({ children, onClick, disabled, ...props }) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
  FormControl: ({ children }) => <div>{children}</div>,
  InputLabel: ({ children }) => <label>{children}</label>,
  Select: ({ children, value, onChange }) => (
    <select value={value} onChange={onChange}>
      {children}
    </select>
  ),
  MenuItem: ({ children, value }) => (
    <option value={value}>{children}</option>
  ),
  Box: ({ children }) => <div>{children}</div>,
  Typography: ({ children, variant }) => <div data-testid={`typography-${variant}`}>{children}</div>,
  Stepper: ({ children }) => <div data-testid="stepper">{children}</div>,
  Step: ({ children }) => <div data-testid="step">{children}</div>,
  StepLabel: ({ children }) => <div data-testid="step-label">{children}</div>
}));

describe('CROOnboardingForm Component', () => {
  const mockOnNext = jest.fn();
  const mockOnBack = jest.fn();
  const mockFormData = {
    name: '',
    title: '',
    company: '',
    industry: '',
    businessUnits: [],
    areasOfConcern: [],
    regions: [],
    riskTolerance: 'medium',
    notificationPreferences: {
      email: true,
      frequency: 'daily'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('should render the form with all required fields', () => {
      render(
        <CROOnboardingForm
          formData={mockFormData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          currentStep={0}
        />
      );

      expect(screen.getByText(/Personal Information/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Job Title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Company/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Industry/i)).toBeInTheDocument();
    });

    it('should show the current step indicator', () => {
      render(
        <CROOnboardingForm
          formData={mockFormData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          currentStep={0}
        />
      );

      expect(screen.getByTestId('stepper')).toBeInTheDocument();
      expect(screen.getByTestId('step-label')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for empty required fields', async () => {
      const user = userEvent.setup();
      render(
        <CROOnboardingForm
          formData={mockFormData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          currentStep={0}
        />
      );

      // Try to proceed without filling required fields
      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Company is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Industry is required/i)).toBeInTheDocument();
      });

      // onNext should not be called
      expect(mockOnNext).not.toHaveBeenCalled();
    });

    it('should allow navigation when all required fields are filled', async () => {
      const user = userEvent.setup();
      const filledFormData = {
        ...mockFormData,
        name: 'John Smith',
        title: 'Chief Risk Officer',
        company: 'TechCorp International',
        industry: 'Technology'
      };

      render(
        <CROOnboardingForm
          formData={filledFormData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          currentStep={0}
        />
      );

      // Fill in all required fields
      await user.type(screen.getByLabelText(/Full Name/i), 'John Smith');
      await user.type(screen.getByLabelText(/Job Title/i), 'Chief Risk Officer');
      await user.type(screen.getByLabelText(/Company/i), 'TechCorp International');
      await user.type(screen.getByLabelText(/Industry/i), 'Technology');

      // Click Next button
      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      // Should call onNext with updated form data
      await waitFor(() => {
        expect(mockOnNext).toHaveBeenCalledWith(expect.objectContaining({
          name: 'John Smith',
          title: 'Chief Risk Officer',
          company: 'TechCorp International',
          industry: 'Technology'
        }));
      });
    });
  });

  describe('Form Navigation', () => {
    it('should call onBack when Back button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <CROOnboardingForm
          formData={mockFormData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          currentStep={1}
        />
      );

      const backButton = screen.getByRole('button', { name: /back/i });
      await user.click(backButton);

      expect(mockOnBack).toHaveBeenCalled();
    });

    it('should not show Back button on first step', () => {
      render(
        <CROOnboardingForm
          formData={mockFormData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          currentStep={0}
        />
      );

      expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument();
    });
  });

  describe('Form Data Handling', () => {
    it('should display existing form data', () => {
      const filledFormData = {
        ...mockFormData,
        name: 'John Smith',
        title: 'Chief Risk Officer',
        company: 'TechCorp International',
        industry: 'Technology'
      };

      render(
        <CROOnboardingForm
          formData={filledFormData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          currentStep={0}
        />
      );

      expect(screen.getByDisplayValue('John Smith')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Chief Risk Officer')).toBeInTheDocument();
      expect(screen.getByDisplayValue('TechCorp International')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Technology')).toBeInTheDocument();
    });

    it('should update form data when user types', async () => {
      const user = userEvent.setup();
      render(
        <CROOnboardingForm
          formData={mockFormData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          currentStep={0}
        />
      );

      const nameInput = screen.getByLabelText(/Full Name/i);
      await user.type(nameInput, 'John Smith');

      expect(nameInput).toHaveValue('John Smith');
    });
  });

  describe('Risk Tolerance Selection', () => {
    it('should allow selecting risk tolerance', async () => {
      const user = userEvent.setup();
      render(
        <CROOnboardingForm
          formData={mockFormData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          currentStep={0}
        />
      );

      // Find and select risk tolerance
      const riskToleranceSelect = screen.getByLabelText(/Risk Tolerance/i);
      await user.selectOptions(riskToleranceSelect, 'high');

      expect(riskToleranceSelect).toHaveValue('high');
    });

    it('should have default risk tolerance value', () => {
      render(
        <CROOnboardingForm
          formData={mockFormData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          currentStep={0}
        />
      );

      const riskToleranceSelect = screen.getByLabelText(/Risk Tolerance/i);
      expect(riskToleranceSelect).toHaveValue('medium');
    });
  });

  describe('Step Progression', () => {
    it('should show different content for different steps', () => {
      const { rerender } = render(
        <CROOnboardingForm
          formData={mockFormData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          currentStep={0}
        />
      );

      expect(screen.getByText(/Personal Information/i)).toBeInTheDocument();

      // Change to step 1 (Business Units)
      rerender(
        <CROOnboardingForm
          formData={mockFormData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          currentStep={1}
        />
      );

      expect(screen.getByText(/Business Units/i)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle form submission errors gracefully', async () => {
      const user = userEvent.setup();
      mockOnNext.mockImplementation(() => {
        throw new Error('Submission failed');
      });

      render(
        <CROOnboardingForm
          formData={mockFormData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          currentStep={0}
        />
      );

      // Fill in required fields
      await user.type(screen.getByLabelText(/Full Name/i), 'John Smith');
      await user.type(screen.getByLabelText(/Job Title/i), 'Chief Risk Officer');
      await user.type(screen.getByLabelText(/Company/i), 'TechCorp International');
      await user.type(screen.getByLabelText(/Industry/i), 'Technology');

      // Try to submit
      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      // Should handle the error gracefully
      expect(mockOnNext).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for form fields', () => {
      render(
        <CROOnboardingForm
          formData={mockFormData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          currentStep={0}
        />
      );

      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Job Title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Company/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Industry/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Risk Tolerance/i)).toBeInTheDocument();
    });

    it('should have proper button labels', () => {
      render(
        <CROOnboardingForm
          formData={mockFormData}
          onNext={mockOnNext}
          onBack={mockOnBack}
          currentStep={1}
        />
      );

      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    });
  });
}); 
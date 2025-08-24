import { render, screen } from '@testing-library/react';
import App from './App';

test('renders onboarding demo page', () => {
  render(<App />);
  // Use getByRole to find the h3 heading specifically
  const titleElement = screen.getByRole('heading', { name: /Modular Onboarding Flow/i, level: 3 });
  expect(titleElement).toBeInTheDocument();
});

test('renders try new onboarding button', () => {
  render(<App />);
  const buttonElement = screen.getByRole('button', { name: /Try New Onboarding/i });
  expect(buttonElement).toBeInTheDocument();
});

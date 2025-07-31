import { render, screen } from '@testing-library/react';
import App from './App';

test('renders onboarding flow', () => {
  render(<App />);
  const profileElement = screen.getByText(/Profile Details/i);
  expect(profileElement).toBeInTheDocument();
});

import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the AuthContext to simulate an unauthenticated state
jest.mock('./contexts/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

// Mock the ToastProvider
jest.mock('./components/ToastNotifications', () => ({
  ToastProvider: ({ children }) => children,
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

// Mock react-router-dom to avoid routing issues in tests
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => children,
  Routes: ({ children }) => children,
  Route: ({ element }) => element,
  Navigate: () => null,
  useNavigate: () => jest.fn(),
  useParams: () => ({}),
  useLocation: () => ({ pathname: '/', state: null }),
}));

test('renders login page when not authenticated', () => {
  render(<App />);
  
  // Check for login page elements
  const titleElement = screen.getByRole('heading', { name: /Risk Intelligence Dashboard/i, level: 3 });
  expect(titleElement).toBeInTheDocument();
  
  const subtitleElement = screen.getByRole('heading', { name: /Enterprise Risk Management & Intelligence Platform/i, level: 6 });
  expect(subtitleElement).toBeInTheDocument();
  
  const quickStartElement = screen.getByRole('heading', { name: /Quick Start/i, level: 5 });
  expect(quickStartElement).toBeInTheDocument();
});

test('renders quick start profiles', () => {
  render(<App />);
  
  // Check for quick start profile cards using more specific selectors
  const quickStartSection = screen.getByRole('heading', { name: /Quick Start/i, level: 5 });
  expect(quickStartSection).toBeInTheDocument();
  
  // Check for profile names in the cards
  const sarahChenElement = screen.getByText('Sarah Chen');
  expect(sarahChenElement).toBeInTheDocument();
  
  const mikeRodriguezElement = screen.getByText('Mike Rodriguez');
  expect(mikeRodriguezElement).toBeInTheDocument();
  
  const businessAnalystElement = screen.getByText('Business Analyst');
  expect(businessAnalystElement).toBeInTheDocument();
  
  const executiveElement = screen.getByText('Executive');
  expect(executiveElement).toBeInTheDocument();
});

test('renders custom login form', () => {
  render(<App />);
  
  // Check for custom login form elements
  const customLoginElement = screen.getByRole('heading', { name: /Custom Login/i, level: 5 });
  expect(customLoginElement).toBeInTheDocument();
  
  const firstNameInput = screen.getByLabelText('First Name');
  expect(firstNameInput).toBeInTheDocument();
  
  const lastNameInput = screen.getByLabelText('Last Name');
  expect(lastNameInput).toBeInTheDocument();
  
  const companyInput = screen.getByLabelText('Company');
  expect(companyInput).toBeInTheDocument();
  
  const roleSelect = screen.getByLabelText('Role');
  expect(roleSelect).toBeInTheDocument();
  
  const accessButton = screen.getByRole('button', { name: /Access Dashboard/i });
  expect(accessButton).toBeInTheDocument();
});

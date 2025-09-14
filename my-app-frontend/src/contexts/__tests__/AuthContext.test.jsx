import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '../AuthContext';

// Test component to use the context
const TestComponent = () => {
  const { isAuthenticated, user, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
      </div>
      <div data-testid="user-info">
        {user ? `${user.firstName} ${user.lastName}` : 'No User'}
      </div>
      <button onClick={() => login({ firstName: 'John', lastName: 'Doe' })}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides authentication context', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toBeInTheDocument();
    expect(screen.getByTestId('user-info')).toBeInTheDocument();
  });

  it('starts with unauthenticated state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(screen.getByTestId('user-info')).toHaveTextContent('No User');
  });

  it('can login a user', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');
    act(() => {
      loginButton.click();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    expect(screen.getByTestId('user-info')).toHaveTextContent('John Doe');
  });

  it('can logout a user', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // First login
    const loginButton = screen.getByText('Login');
    act(() => {
      loginButton.click();
    });

    // Then logout
    const logoutButton = screen.getByText('Logout');
    act(() => {
      logoutButton.click();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(screen.getByTestId('user-info')).toHaveTextContent('No User');
  });

  it('persists user data in localStorage', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');
    act(() => {
      loginButton.click();
    });

    // Check if data is stored in localStorage with correct key
    const storedUser = localStorage.getItem('user_profile');
    expect(storedUser).toBeTruthy();
    expect(JSON.parse(storedUser)).toEqual({
      firstName: 'John',
      lastName: 'Doe'
    });
  });
});

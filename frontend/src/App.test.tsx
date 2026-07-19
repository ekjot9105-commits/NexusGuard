import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders landing page by default', () => {
    render(<App />);
    expect(screen.getAllByText(/NexusGuard/i).length).toBeGreaterThan(0);
  });
});

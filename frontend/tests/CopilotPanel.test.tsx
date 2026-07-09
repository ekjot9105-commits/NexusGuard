import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CopilotPanel from '../src/components/copilot/CopilotPanel';

const queryClient = new QueryClient();

describe('CopilotPanel', () => {
  it('renders loading state initially', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CopilotPanel />
      </QueryClientProvider>
    );
    // Uses aria-busy state added for accessibility
    expect(screen.getByText(/AI Copilot is analyzing telemetry/i)).toBeInTheDocument();
  });
});

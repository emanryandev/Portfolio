import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Contact from '../Contact';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

// Mock dependencies
vi.mock('@/features/team/api/queries', () => ({
  useTeam: vi.fn(() => ({
    data: { data: [{ id: 1, name: 'John Doe', role: 'Developer' }] },
    isLoading: false,
  })),
}));

vi.mock('@/features/services/api/queries', () => ({
  useServices: vi.fn(() => ({
    data: { data: [{ id: 1, name: 'Web Dev', description: 'desc' }] },
    isLoading: false,
  })),
}));

const mockMutateAsync = vi.fn();
vi.mock('@/features/contact/api/mutations', () => ({
  useSubmitContactRequest: vi.fn(() => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  })),
}));

const queryClient = new QueryClient();

const renderContact = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('Contact Wizard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders step 1 and validates selection', async () => {
    renderContact();
    
    expect(screen.getByText('Who do you want to work with?')).toBeInTheDocument();
    
    const nextBtn = screen.getByRole('button', { name: /Next Step/i });
    expect(nextBtn).toBeDisabled();

    // Select team
    const teamOption = screen.getByText('The Entire Team');
    fireEvent.click(teamOption);

    await waitFor(() => {
      expect(nextBtn).not.toBeDisabled();
    });

    fireEvent.click(nextBtn);
    expect(screen.getByText('What do you need?')).toBeInTheDocument();
  });

  it('completes the full flow and submits', async () => {
    renderContact();
    
    // Step 1: Who
    fireEvent.click(screen.getByText('The Entire Team'));
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // Step 2: Need
    await waitFor(() => screen.getByText('What do you need?'));
    fireEvent.click(screen.getByText('Web Dev'));
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // Step 3: Project
    await waitFor(() => screen.getByText('Tell us about the project'));
    fireEvent.change(screen.getByLabelText(/Project Name/i), { target: { value: 'My App' } });
    fireEvent.change(screen.getByLabelText(/Project Description/i), { target: { value: 'This is a long enough description.' } });
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // Step 4: Details
    await waitFor(() => screen.getByText('Your contact details'));
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Review/i }));

    // Step 5: Review
    await waitFor(() => screen.getByText('Review & Submit'));
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();

    // Submit
    mockMutateAsync.mockResolvedValueOnce({});
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Test User',
        email: 'test@example.com',
      }));
    });

    expect(await screen.findByText('Request Sent Successfully!')).toBeInTheDocument();
  });
});

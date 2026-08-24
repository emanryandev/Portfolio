import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RequireAuth } from '../components/RequireAuth';
import * as authQueries from '../api/queries';
import '@testing-library/jest-dom';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: { queries: { retry: false } }
});

describe('RequireAuth', () => {
  it('shows loader when loading', () => {
    vi.spyOn(authQueries, 'useUser').mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as any);

    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route path="/admin" element={<RequireAuth />}>
              <Route index element={<div>Protected Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    // PageLoader uses a spinner with 'sr-only' text or just an SVG
    // We can just check if "Protected Content" is not there
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects to /admin/login when unauthenticated', async () => {
    vi.spyOn(authQueries, 'useUser').mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true, // Failed to fetch or 401
    } as any);

    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route path="/admin/login" element={<div>Login Page</div>} />
            <Route path="/admin" element={<RequireAuth />}>
              <Route index element={<div>Protected Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders protected content when authenticated', async () => {
    vi.spyOn(authQueries, 'useUser').mockReturnValue({
      data: { id: 1, name: 'Admin', email: 'admin@example.com' },
      isLoading: false,
      isError: false,
    } as any);

    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route path="/admin" element={<RequireAuth />}>
              <Route index element={<div>Protected Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });
});

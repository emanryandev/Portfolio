import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DesignSystem from './pages/DesignSystem';
import { Toaster } from './components/ui/toaster';

// Basic test to verify vitest is working
describe('Frontend test suite', () => {
  it('should render the design system without crashing', () => {
    render(
      <div>
        <DesignSystem />
        <Toaster />
      </div>
    );
    expect(screen.getByText('Design System')).toBeInTheDocument();
  });
});

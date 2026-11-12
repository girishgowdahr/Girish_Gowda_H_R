import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/app/App';
import axe from 'axe-core';

describe('Frontend Skeleton & Base Layout (Task 1.4)', () => {
  it('renders skip link and main navigation landmark', () => {
    render(<App />);

    // Accessible skip to main content link
    const skipLink = screen.getByRole('link', { name: /skip to main content/i });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');

    // Navigation branding
    expect(screen.getByLabelText(/girish home/i)).toBeInTheDocument();

    // Main landmark with id matching skip-link
    const mainLandmark = screen.getByRole('main');
    expect(mainLandmark).toBeInTheDocument();
    expect(mainLandmark).toHaveAttribute('id', 'main-content');
  });

  it('renders lobby hero title and navigation links', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: /welcome to girish/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^projects$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^skills$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^about$/i })).toBeInTheDocument();
  });

  it('satisfies basic axe accessibility rule checks', async () => {
    const { container } = render(<App />);
    const results = await axe.run(container);

    // Filter out critical violations
    const violations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(violations).toHaveLength(0);
  });
});

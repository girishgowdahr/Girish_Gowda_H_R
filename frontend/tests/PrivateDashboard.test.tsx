import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../src/core/auth/AuthContext';
import { LoginPage } from '../src/modules/admin/LoginPage';
import { DashboardPage } from '../src/modules/admin/DashboardPage';
import { PersonalBioModule } from '../src/modules/admin/components/PersonalBioModule';

describe('Private Dashboard & Master Password Authentication', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders LoginPage with Master Password input and security badges', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ configured: true, authenticated: false, lockoutActive: false }),
    } as any);

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(await screen.findByRole('heading', { name: /private enclave access/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your master password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /authenticate & enter/i })).toBeInTheDocument();
  });

  it('renders PersonalBioModule with Categories A through F and search bar', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        categories: {
          BASIC: [
            { category: 'BASIC', fieldKey: 'full_name', fieldLabel: 'Full Name', fieldValue: '', fieldType: 'text', isCustom: false, sortOrder: 1 },
            { category: 'BASIC', fieldKey: 'nationality', fieldLabel: 'Nationality', fieldValue: '', fieldType: 'text', isCustom: false, sortOrder: 6 },
          ],
          CONTACT: [
            { category: 'CONTACT', fieldKey: 'email', fieldLabel: 'Personal Email', fieldValue: '', fieldType: 'email', isCustom: false, sortOrder: 1 },
          ],
        },
      }),
    } as any);

    render(
      <BrowserRouter>
        <PersonalBioModule />
      </BrowserRouter>
    );

    // Verify presence of category buttons
    expect(await screen.findByRole('button', { name: /basic information/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /contact information/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /education history/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /professional profile/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /personal interests/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /important personal records/i })).toBeInTheDocument();

    // Verify search input and edit profile button
    expect(screen.getByPlaceholderText(/search across all personal bio fields/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add custom field/i })).toBeInTheDocument();
  });

  it('renders DashboardPage with Secure Enclave status indicator', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ configured: true, authenticated: true, lockoutActive: false }),
    } as any);

    render(
      <BrowserRouter>
        <AuthProvider>
          <DashboardPage />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/secure enclave active/i)).toBeInTheDocument();
    expect(screen.getByText(/argon2id • zero public leakage/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /lock enclave/i })).toBeInTheDocument();
  });
});

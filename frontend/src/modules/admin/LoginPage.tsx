import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthContext';
import { Shield, Lock, KeyRound, Eye, EyeOff, AlertTriangle, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, setup, setupRequired, error, loading, clearError } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localValidation, setLocalValidation] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalValidation(null);

    if (!password) {
      setLocalValidation('Master Password is required.');
      return;
    }

    if (setupRequired) {
      if (password.length < 8) {
        setLocalValidation('Master Password must be at least 8 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setLocalValidation('Passwords do not match. Please verify both fields.');
        return;
      }
      const success = await setup(password);
      if (success) {
        navigate(from, { replace: true });
      }
    } else {
      const success = await login(password);
      if (success) {
        navigate(from, { replace: true });
      }
    }
  };

  return (
    <div style={containerStyles}>
      <div style={cardStyles}>
        {/* Enclave Security Header */}
        <div style={headerStyles}>
          <div style={badgeContainerStyles}>
            <Shield size={28} color="var(--accent-cyan)" />
          </div>
          <h1 style={titleStyles}>
            {setupRequired ? 'INITIALIZE MASTER PASSWORD' : 'PRIVATE ENCLAVE ACCESS'}
          </h1>
          <p style={subtitleStyles}>
            {setupRequired
              ? 'First-time security initialization. Set your Master Password to protect your private personal dashboard and records.'
              : 'Authorized Platform Owner Access Only. Enter Master Password to decrypt and enter the Private Enclave.'}
          </p>
        </div>

        {/* Error Feedback */}
        {(error || localValidation) && (
          <div style={errorBannerStyles} role="alert">
            <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
            <span style={errorTextStyles}>{localValidation || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={formStyles}>
          <div style={inputGroupStyles}>
            <label htmlFor="master-password" style={labelStyles}>
              <KeyRound size={16} color="var(--accent-cyan)" />
              <span>{setupRequired ? 'New Master Password' : 'Enter Master Password'}</span>
            </label>
            <div style={passwordInputWrapperStyles}>
              <input
                id="master-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLocalValidation(null);
                }}
                placeholder={setupRequired ? 'Create secure password (min 8 chars)...' : 'Enter your master password...'}
                autoComplete="current-password"
                style={inputStyles}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={eyeButtonStyles}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} color="var(--text-muted)" /> : <Eye size={18} color="var(--text-muted)" />}
              </button>
            </div>
          </div>

          {setupRequired && (
            <div style={inputGroupStyles}>
              <label htmlFor="confirm-password" style={labelStyles}>
                <Lock size={16} color="var(--accent-cyan)" />
                <span>Confirm Master Password</span>
              </label>
              <div style={passwordInputWrapperStyles}>
                <input
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setLocalValidation(null);
                  }}
                  placeholder="Re-enter password to confirm..."
                  autoComplete="new-password"
                  style={inputStyles}
                  required
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={submitButtonStyles(loading)}
          >
            <Lock size={18} />
            <span>{loading ? 'AUTHENTICATING...' : setupRequired ? 'INITIALIZE & ENTER DASHBOARD' : 'AUTHENTICATE & ENTER'}</span>
          </button>
        </form>

        <div style={footerRowStyles}>
          <Link to="/" style={backLinkStyles}>
            <ArrowLeft size={16} />
            <span>Back to Public Lobby</span>
          </Link>
          <span style={securityGuaranteeStyles}>
            <CheckCircle2 size={14} color="#10b981" />
            <span>Argon2id Enforced</span>
          </span>
        </div>
      </div>
    </div>
  );
};

const containerStyles: React.CSSProperties = {
  minHeight: '80vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem 1rem',
};

const cardStyles: React.CSSProperties = {
  width: '100%',
  maxWidth: '480px',
  backgroundColor: 'rgba(15, 23, 42, 0.85)',
  border: '1px solid rgba(0, 240, 255, 0.25)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 24px rgba(0, 240, 255, 0.1)',
  borderRadius: '16px',
  padding: '2.5rem',
  backdropFilter: 'blur(16px)',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.75rem',
};

const headerStyles: React.CSSProperties = {
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.75rem',
};

const badgeContainerStyles: React.CSSProperties = {
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  backgroundColor: 'rgba(0, 240, 255, 0.1)',
  border: '1px solid var(--accent-cyan)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '0.5rem',
  boxShadow: '0 0 16px rgba(0, 240, 255, 0.3)',
};

const titleStyles: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  color: '#f8fafc',
  margin: 0,
};

const subtitleStyles: React.CSSProperties = {
  fontSize: '0.875rem',
  color: 'var(--text-muted)',
  lineHeight: 1.5,
  margin: 0,
};

const errorBannerStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.875rem 1rem',
  backgroundColor: 'rgba(239, 68, 68, 0.12)',
  border: '1px solid rgba(239, 68, 68, 0.4)',
  borderRadius: '8px',
};

const errorTextStyles: React.CSSProperties = {
  fontSize: '0.85rem',
  color: '#fca5a5',
  lineHeight: 1.4,
};

const formStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
};

const inputGroupStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const labelStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.85rem',
  fontWeight: 600,
  color: '#cbd5e1',
};

const passwordInputWrapperStyles: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
};

const inputStyles: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 2.75rem 0.75rem 1rem',
  backgroundColor: 'rgba(9, 14, 26, 0.8)',
  border: '1px solid rgba(148, 163, 184, 0.25)',
  borderRadius: '8px',
  color: '#f8fafc',
  fontSize: '0.95rem',
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const eyeButtonStyles: React.CSSProperties = {
  position: 'absolute',
  right: '0.75rem',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '0.25rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const submitButtonStyles = (loading: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.85rem 1.5rem',
  backgroundColor: loading ? '#0284c7' : 'var(--accent-cyan)',
  color: '#090a0f',
  fontWeight: 700,
  fontSize: '0.95rem',
  letterSpacing: '0.05em',
  border: 'none',
  borderRadius: '8px',
  cursor: loading ? 'not-allowed' : 'pointer',
  boxShadow: '0 4px 14px rgba(0, 240, 255, 0.35)',
  transition: 'transform 0.15s, box-shadow 0.15s, opacity 0.15s',
  opacity: loading ? 0.7 : 1,
});

const footerRowStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderTop: '1px solid rgba(148, 163, 184, 0.15)',
  paddingTop: '1.25rem',
  fontSize: '0.85rem',
};

const backLinkStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  color: 'var(--text-muted)',
  textDecoration: 'none',
  transition: 'color 0.2s',
};

const securityGuaranteeStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.35rem',
  color: '#10b981',
  fontFamily: 'monospace',
  fontSize: '0.75rem',
};

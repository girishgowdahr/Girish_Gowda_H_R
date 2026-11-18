import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthContext';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={loadingContainerStyles}>
        <div style={loadingCardStyles}>
          <Loader2 size={36} color="var(--accent-cyan)" className="spin-animation" />
          <p style={loadingTextStyles}>VERIFYING ENCLAVE CLEARANCE...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/dashboard/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const loadingContainerStyles: React.CSSProperties = {
  minHeight: '60vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
};

const loadingCardStyles: React.CSSProperties = {
  backgroundColor: 'rgba(15, 23, 42, 0.75)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '12px',
  padding: '2.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
  backdropFilter: 'blur(10px)',
};

const loadingTextStyles: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '0.875rem',
  letterSpacing: '0.1em',
  color: 'var(--text-muted)',
};

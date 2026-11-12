import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div style={containerStyles}>
      <div style={iconBoxStyles}>
        <AlertTriangle size={36} color="var(--accent-amber)" />
      </div>
      <h1 style={titleStyles}>404 — Module Not Found</h1>
      <p style={subtitleStyles}>
        The requested sector or module does not exist or has been archived.
      </p>
      <Link to="/" style={linkStyles}>
        <ArrowLeft size={16} />
        <span>Return to Lobby</span>
      </Link>
    </div>
  );
};

const containerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: '4rem 1rem',
  gap: '1.25rem',
};

const iconBoxStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  backgroundColor: 'rgba(245, 158, 11, 0.1)',
  border: '1px solid rgba(245, 158, 11, 0.3)',
};

const titleStyles: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: 800,
};

const subtitleStyles: React.CSSProperties = {
  fontSize: '1rem',
  color: 'var(--text-secondary)',
  maxWidth: '450px',
};

const linkStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.65rem 1.25rem',
  backgroundColor: 'var(--bg-card)',
  color: 'var(--accent-cyan)',
  fontWeight: 600,
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-subtle)',
  textDecoration: 'none',
  marginTop: '1rem',
};

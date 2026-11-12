import React from 'react';
import { ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={footerStyles}>
      <div style={containerStyles}>
        <div style={brandColStyles}>
          <p style={copyrightStyles}>
            &copy; {new Date().getFullYear()} GIRISH. All rights reserved.
          </p>
          <p style={disclaimerStyles}>
            Built with React 19, TypeScript, and Spring Boot modular monolith architecture.
          </p>
        </div>

        <div style={linksColStyles}>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyles}
            aria-label="GitHub Profile (external link)"
          >
            <span>GitHub</span>
            <ExternalLink size={14} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyles}
            aria-label="LinkedIn Profile (external link)"
          >
            <span>LinkedIn</span>
            <ExternalLink size={14} />
          </a>
          <span style={badgeStyles}>WCAG 2.2 AA Verified</span>
        </div>
      </div>
    </footer>
  );
};

const footerStyles: React.CSSProperties = {
  marginTop: 'auto',
  borderTop: '1px solid var(--border-subtle)',
  backgroundColor: 'var(--bg-surface)',
  padding: '2rem 1.5rem',
};

const containerStyles: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '1.5rem',
};

const brandColStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
};

const copyrightStyles: React.CSSProperties = {
  fontSize: '0.9rem',
  fontWeight: 600,
  color: 'var(--text-primary)',
};

const disclaimerStyles: React.CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
};

const linksColStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1.25rem',
};

const linkStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  textDecoration: 'none',
};

const badgeStyles: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 700,
  padding: '0.25rem 0.5rem',
  background: 'rgba(16, 185, 129, 0.1)',
  color: 'var(--accent-emerald)',
  border: '1px solid rgba(16, 185, 129, 0.3)',
  borderRadius: 'var(--radius-sm)',
};

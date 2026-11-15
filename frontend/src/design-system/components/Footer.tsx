import React from 'react';
import { ExternalLink, Mail, Shield } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';
import { NavLink } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer style={footerStyles}>
      <div style={containerStyles}>
        <div style={brandColStyles}>
          <p style={copyrightStyles}>
            &copy; {new Date().getFullYear()} Girish Gowda H R. All rights reserved.
          </p>
          <p style={disclaimerStyles}>
            Engineered with React 19, TypeScript, Three.js 3D Lobby, Spring Boot 3 modular monolith, and Zero-Knowledge Vault.
          </p>
        </div>

        <div style={linksColStyles}>
          <a
            href="https://github.com/girishgowdahr"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyles}
            aria-label="Girish Gowda H R GitHub Profile (opens in new tab)"
          >
            <GithubIcon size={15} />
            <span>GitHub</span>
            <ExternalLink size={12} />
          </a>
          <a
            href="https://linkedin.com/in/girishgowdahr"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyles}
            aria-label="Girish Gowda H R LinkedIn Profile (opens in new tab)"
          >
            <LinkedinIcon size={15} />
            <span>LinkedIn</span>
            <ExternalLink size={12} />
          </a>
          <a
            href="mailto:girishgowda0428@gmail.com"
            style={linkStyles}
            aria-label="Send email to Girish Gowda H R"
          >
            <Mail size={15} />
            <span>Email</span>
          </a>
          <NavLink
            to="/privacy"
            style={linkStyles}
            aria-label="Privacy Notice"
          >
            <Shield size={14} />
            <span>Privacy Notice</span>
          </NavLink>
          <span style={badgeStyles}>WCAG 2.2 AA</span>
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
  flexWrap: 'wrap',
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
  transition: 'color 0.15s ease',
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

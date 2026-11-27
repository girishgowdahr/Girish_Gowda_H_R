import React from 'react';
import { Shield, Mail } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { NavLink } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer style={footerStyles}>
      <div style={containerStyles}>
        <div style={brandColStyles}>
          <p style={copyrightStyles}>
            &copy; {new Date().getFullYear()} Girish Gowda H R · Aspiring Software Engineer
          </p>
          <p style={disclaimerStyles}>
            MCA Candidate @ RV College of Engineering, Bengaluru · Co-author, IEEE Research (2026)
          </p>
        </div>

        <div style={linksColStyles}>
          <a
            href="https://github.com/girishgowdahr"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyles}
            aria-label="GitHub Profile"
          >
            <GithubIcon size={14} />
            <span>GitHub</span>
          </a>

          <a
            href="mailto:girishgowdahr.mca25@rvce.edu.in"
            style={linkStyles}
            aria-label="Email Girish Gowda H R"
          >
            <Mail size={14} />
            <span>Email</span>
          </a>

          <NavLink
            to="/privacy"
            style={linkStyles}
            aria-label="Privacy Notice"
          >
            <Shield size={14} />
            <span>Privacy</span>
          </NavLink>

          <span style={badgeStyles}>WCAG 2.2 AAA Compliant</span>
        </div>
      </div>
    </footer>
  );
};

const footerStyles: React.CSSProperties = {
  marginTop: 'auto',
  borderTop: '1px solid var(--border-subtle)',
  backgroundColor: 'var(--bg-main)',
  padding: '2.5rem 1.5rem',
};

const containerStyles: React.CSSProperties = {
  maxWidth: '1240px',
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
  gap: '0.35rem',
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
  gap: '1.5rem',
};

const linkStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  transition: 'color var(--transition-fast)',
};

const badgeStyles: React.CSSProperties = {
  fontSize: '0.72rem',
  fontWeight: 600,
  letterSpacing: '0.04em',
  padding: '0.25rem 0.6rem',
  background: 'rgba(16, 185, 129, 0.08)',
  color: 'var(--accent-emerald)',
  border: '1px solid rgba(16, 185, 129, 0.25)',
  borderRadius: 'var(--radius-sm)',
};

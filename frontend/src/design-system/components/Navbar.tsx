import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, Download, Code2 } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header style={headerStyles}>
      <div style={containerStyles}>
        {/* Brand / Name Logo */}
        <NavLink to="/" style={logoLinkStyles} aria-label="Girish Home">
          <span style={logoBadgeStyles}>
            <Code2 size={16} color="var(--accent-lavender)" />
          </span>
          <div style={logoTextColStyles}>
            <span style={logoTextStyles}>GIRISH GOWDA H R</span>
            <span style={logoSubTextStyles}>RVCE MCA '27</span>
          </div>
          <span style={statusDotStyles} title="Available for Software Engineering Opportunities" />
        </NavLink>

        {/* Navigation Links */}
        <nav aria-label="Main Navigation" style={navStyles}>
          <ul style={navListStyles}>
            <li>
              <NavLink to="/about" style={({ isActive }) => navLinkStyles(isActive)}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/projects" style={({ isActive }) => navLinkStyles(isActive)}>
                Projects
              </NavLink>
            </li>
            <li>
              <NavLink to="/skills" style={({ isActive }) => navLinkStyles(isActive)}>
                Skills
              </NavLink>
            </li>
            <li>
              <NavLink to="/education" style={({ isActive }) => navLinkStyles(isActive)}>
                Education
              </NavLink>
            </li>
            <li>
              <NavLink to="/experience" style={({ isActive }) => navLinkStyles(isActive)}>
                Experience
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Right Action Buttons */}
        <div style={rightActionsStyles}>
          <a
            href={`${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/resume/Girish_Gowda_H_R_Resume.pdf`}
            download="Girish_Gowda_H_R_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={resumeButtonStyles}
            aria-label="Download Girish Gowda H R resume PDF"
            title="Download or view official PDF resume"
          >
            <Download size={14} />
            <span>Resume</span>
          </a>

          <NavLink
            to="/dashboard"
            style={({ isActive }) => systemBadgeStyles(isActive)}
            title="Access Private Dashboard & Secure Enclave"
            aria-label="Access Private Dashboard Enclave"
          >
            <Shield size={13} color="var(--accent-lavender)" />
            <span>ENCLAVE</span>
          </NavLink>
        </div>
      </div>
    </header>
  );
};

const headerStyles: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 100,
  backgroundColor: 'rgba(2, 6, 23, 0.88)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  borderBottom: '1px solid var(--border-subtle)',
  transition: 'background-color var(--transition-normal)',
};

const containerStyles: React.CSSProperties = {
  maxWidth: '1240px',
  margin: '0 auto',
  padding: '0.85rem 1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
};

const logoLinkStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  textDecoration: 'none',
};

const logoBadgeStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: 'var(--radius-sm)',
  background: 'var(--accent-lavender-dim)',
  border: '1px solid rgba(165, 180, 252, 0.25)',
};

const logoTextColStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  lineHeight: 1.15,
};

const logoTextStyles: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 700,
  letterSpacing: '0.04em',
  color: 'var(--text-primary)',
};

const logoSubTextStyles: React.CSSProperties = {
  fontSize: '0.72rem',
  fontWeight: 500,
  letterSpacing: '0.06em',
  color: 'var(--text-muted)',
};

const statusDotStyles: React.CSSProperties = {
  width: '7px',
  height: '7px',
  borderRadius: '50%',
  backgroundColor: 'var(--accent-emerald)',
  boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
  marginLeft: '0.2rem',
};

const navStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

const navListStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.35rem',
  listStyle: 'none',
};

const navLinkStyles = (isActive: boolean): React.CSSProperties => ({
  display: 'inline-block',
  padding: '0.45rem 0.85rem',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: isActive ? 'var(--accent-lavender)' : 'var(--text-secondary)',
  backgroundColor: isActive ? 'var(--accent-lavender-dim)' : 'transparent',
  border: isActive ? '1px solid rgba(165, 180, 252, 0.28)' : '1px solid transparent',
  borderRadius: 'var(--radius-sm)',
  textDecoration: 'none',
  transition: 'all var(--transition-fast)',
});

const resumeButtonStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.45rem',
  fontSize: '0.825rem',
  fontWeight: 600,
  padding: '0.42rem 0.85rem',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'var(--accent-lavender-dim)',
  border: '1px solid rgba(165, 180, 252, 0.35)',
  color: 'var(--accent-lavender)',
  textDecoration: 'none',
  transition: 'all var(--transition-fast)',
};

const rightActionsStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
};

const systemBadgeStyles = (isActive: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.72rem',
  fontWeight: 600,
  letterSpacing: '0.05em',
  padding: '0.4rem 0.65rem',
  borderRadius: 'var(--radius-sm)',
  background: isActive ? 'var(--accent-lavender-dim)' : 'var(--bg-card)',
  border: isActive ? '1px solid rgba(165, 180, 252, 0.35)' : '1px solid var(--border-subtle)',
  color: isActive ? 'var(--accent-lavender)' : 'var(--text-muted)',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)',
});

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, Terminal, Download } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header style={headerStyles}>
      <div style={containerStyles}>
        <NavLink to="/" style={logoLinkStyles} aria-label="Girish Home">
          <span style={logoBadgeStyles}>
            <Terminal size={18} color="var(--accent-cyan)" />
          </span>
          <span style={logoTextStyles}>GIRISH</span>
          <span style={statusDotStyles} title="System Online"></span>
        </NavLink>

        <nav aria-label="Main Navigation" style={navStyles}>
          <ul style={navListStyles}>
            <li>
              <NavLink to="/" style={({ isActive }) => navLinkStyles(isActive)} end>
                Lobby
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" style={({ isActive }) => navLinkStyles(isActive)}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/skills" style={({ isActive }) => navLinkStyles(isActive)}>
                Skills
              </NavLink>
            </li>
            <li>
              <NavLink to="/projects" style={({ isActive }) => navLinkStyles(isActive)}>
                Projects
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

        <div style={rightActionsStyles}>
          <a
            href={`${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/resume/Girish_Gowda_H_R_Resume.pdf`}
            download="Girish_Gowda_H_R_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={resumeButtonStyles}
            aria-label="Download Girish Gowda H R resume PDF"
            title="Download or open Girish Gowda H R resume PDF"
          >
            <Download size={14} />
            <span>Resume</span>
          </a>

          <NavLink
            to="/dashboard"
            style={({ isActive }) => systemBadgeStyles(isActive)}
            title="Access Private Dashboard & Personal Bio"
            aria-label="Access Private Dashboard Enclave"
          >
            <Shield size={14} color="var(--accent-cyan)" />
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
  backgroundColor: 'rgba(9, 10, 15, 0.85)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderBottom: '1px solid var(--border-subtle)',
};

const containerStyles: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0.75rem 1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
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
  background: 'rgba(0, 240, 255, 0.1)',
  border: '1px solid rgba(0, 240, 255, 0.3)',
};

const logoTextStyles: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 800,
  letterSpacing: '0.08em',
  color: 'var(--text-primary)',
};

const statusDotStyles: React.CSSProperties = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: 'var(--accent-emerald)',
  boxShadow: '0 0 8px var(--accent-emerald)',
};

const navStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

const navListStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  listStyle: 'none',
};

const navLinkStyles = (isActive: boolean): React.CSSProperties => ({
  display: 'inline-block',
  padding: '0.5rem 0.875rem',
  fontSize: '0.9rem',
  fontWeight: 600,
  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
  backgroundColor: isActive ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
  border: isActive ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid transparent',
  borderRadius: 'var(--radius-sm)',
  textDecoration: 'none',
  transition: 'all var(--transition-fast)',
});

const resumeButtonStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  fontSize: '0.8rem',
  fontWeight: 700,
  padding: '0.35rem 0.75rem',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'rgba(0, 255, 204, 0.12)',
  border: '1px solid rgba(0, 255, 204, 0.35)',
  color: 'var(--accent-cyan)',
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
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  padding: '0.35rem 0.65rem',
  borderRadius: 'var(--radius-sm)',
  background: isActive ? 'rgba(0, 240, 255, 0.15)' : 'var(--bg-card)',
  border: isActive ? '1px solid rgba(0, 240, 255, 0.4)' : '1px solid var(--border-subtle)',
  color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)',
});

import React from 'react';
import { User, Terminal, Mail, MapPin } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div style={containerStyles}>
      <header style={headerStyles}>
        <div style={taglineBadgeStyles}>
          <User size={14} color="var(--accent-cyan)" />
          <span>OPERATOR BIOGRAPHY</span>
        </div>
        <h1 style={titleStyles}>About Me</h1>
        <p style={subtitleStyles}>
          Engineering principles, technical background, and personal drive.
        </p>
      </header>

      <div style={gridStyles}>
        <section style={cardStyles} aria-labelledby="bio-heading">
          <h2 id="bio-heading" style={sectionTitleStyles}>
            <Terminal size={18} color="var(--accent-cyan)" />
            <span>Profile Overview</span>
          </h2>
          <div style={noticeBoxStyles}>
            <strong>Notice:</strong> Data below reflects provisional content awaiting owner confirmation in <code>docs/product/content-inventory.md</code>.
          </div>
          <p style={paragraphStyles}>
            Hello! I am <strong>Girish</strong>, a software engineer passionate about architecting reliable, privacy-first software, modular monoliths, and quantifiable performance systems.
          </p>
          <p style={paragraphStyles}>
            My engineering focus centers on clean separation of concerns, strict authorization models (Spring Security & PostgreSQL RLS), and accessible user interfaces that balance aesthetic appeal with high performance.
          </p>
        </section>

        <aside style={cardStyles} aria-labelledby="info-heading">
          <h2 id="info-heading" style={sectionTitleStyles}>
            <span>Core Attributes</span>
          </h2>
          <ul style={infoListStyles}>
            <li style={infoItemStyles}>
              <span style={infoLabelStyles}>Location</span>
              <span style={infoValueStyles}><MapPin size={14} /> Karnataka, India (Asia/Kolkata)</span>
            </li>
            <li style={infoItemStyles}>
              <span style={infoLabelStyles}>Role</span>
              <span style={infoValueStyles}>Full-Stack Software Engineer</span>
            </li>
            <li style={infoItemStyles}>
              <span style={infoLabelStyles}>Architecture</span>
              <span style={infoValueStyles}>Modular Monolith & React SPA</span>
            </li>
            <li style={infoItemStyles}>
              <span style={infoLabelStyles}>Contact Link</span>
              <span style={infoValueStyles}>
                <a href="mailto:placeholder-owner@example.com" style={contactLinkStyles}>
                  <Mail size={14} /> Send Email
                </a>
              </span>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

const containerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
};

const headerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const taglineBadgeStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.06em',
  color: 'var(--accent-cyan)',
};

const titleStyles: React.CSSProperties = {
  fontSize: '2.25rem',
  fontWeight: 800,
};

const subtitleStyles: React.CSSProperties = {
  fontSize: '1.05rem',
  color: 'var(--text-secondary)',
};

const gridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '1.5rem',
};

const cardStyles: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-lg)',
  padding: '1.75rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
};

const sectionTitleStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '1.2rem',
  fontWeight: 700,
  borderBottom: '1px solid var(--border-subtle)',
  paddingBottom: '0.75rem',
};

const noticeBoxStyles: React.CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
  backgroundColor: 'rgba(255, 255, 255, 0.02)',
  padding: '0.5rem 0.75rem',
  borderRadius: 'var(--radius-sm)',
  borderLeft: '3px solid var(--accent-cyan)',
};

const paragraphStyles: React.CSSProperties = {
  fontSize: '0.95rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.7,
};

const infoListStyles: React.CSSProperties = {
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const infoItemStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  paddingBottom: '0.75rem',
  fontSize: '0.9rem',
};

const infoLabelStyles: React.CSSProperties = {
  color: 'var(--text-muted)',
  fontWeight: 500,
};

const infoValueStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  color: 'var(--text-primary)',
  fontWeight: 600,
};

const contactLinkStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  color: 'var(--accent-cyan)',
  textDecoration: 'none',
};

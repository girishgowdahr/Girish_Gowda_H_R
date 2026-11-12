import React from 'react';
import { Briefcase, Calendar, CheckCircle2 } from 'lucide-react';

export const ExperiencePage: React.FC = () => {
  return (
    <div style={containerStyles}>
      <header style={headerStyles}>
        <div style={taglineBadgeStyles}>
          <Briefcase size={14} color="var(--accent-cyan)" />
          <span>CAREER TIMELINE</span>
        </div>
        <h1 style={titleStyles}>Experience & History</h1>
        <p style={subtitleStyles}>
          Professional trajectory and software engineering roles.
        </p>
      </header>

      <div style={noticeBoxStyles}>
        <strong>Note:</strong> Work experience records below are draft placeholders. All dates, company names, and achievements will be updated from your confirmed inputs in <code>docs/product/content-inventory.md</code>.
      </div>

      <div style={timelineStyles}>
        <article style={cardStyles}>
          <div style={cardHeaderStyles}>
            <div>
              <h2 style={roleTitleStyles}>Software Engineer</h2>
              <p style={companyStyles}>Technology Company [Owner Confirmation Pending]</p>
            </div>
            <span style={durationBadgeStyles}>
              <Calendar size={14} /> 2024 – Present
            </span>
          </div>

          <ul style={achievementsListStyles}>
            <li style={achievementItemStyles}>
              <CheckCircle2 size={16} color="var(--accent-cyan)" />
              <span>Developed high-reliability backend microservices and modular monolith components using Spring Boot and PostgreSQL.</span>
            </li>
            <li style={achievementItemStyles}>
              <CheckCircle2 size={16} color="var(--accent-cyan)" />
              <span>Engineered secure REST APIs adhering to RFC 9457 error standards with comprehensive Testcontainers automated suites.</span>
            </li>
            <li style={achievementItemStyles}>
              <CheckCircle2 size={16} color="var(--accent-cyan)" />
              <span>Implemented accessible, responsive React interfaces optimized for performance and zero-dependency accessibility.</span>
            </li>
          </ul>
        </article>
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

const noticeBoxStyles: React.CSSProperties = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  backgroundColor: 'rgba(0, 240, 255, 0.05)',
  border: '1px solid rgba(0, 240, 255, 0.2)',
  padding: '0.85rem 1.25rem',
  borderRadius: 'var(--radius-md)',
  lineHeight: 1.6,
};

const timelineStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

const cardStyles: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-lg)',
  padding: '1.75rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  boxShadow: 'var(--shadow-card)',
};

const cardHeaderStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  gap: '0.75rem',
  borderBottom: '1px solid var(--border-subtle)',
  paddingBottom: '0.85rem',
};

const roleTitleStyles: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 700,
};

const companyStyles: React.CSSProperties = {
  fontSize: '0.95rem',
  color: 'var(--accent-cyan)',
  fontWeight: 600,
};

const durationBadgeStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: 'var(--text-muted)',
  backgroundColor: 'var(--bg-surface)',
  padding: '0.35rem 0.65rem',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-subtle)',
};

const achievementsListStyles: React.CSSProperties = {
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
};

const achievementItemStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.65rem',
  fontSize: '0.9rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.5,
};

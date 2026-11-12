import React from 'react';
import { Layers, FolderGit2 } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const projects = [
    {
      title: 'GIRISH Identity & Portfolio Platform',
      status: 'In Active Development',
      statusColor: 'var(--accent-cyan)',
      summary:
        'A privacy-first personal identity platform featuring a recruiter portfolio, quantified-self dashboard, and client-side encrypted vault.',
      tech: ['Java 21', 'Spring Boot 3', 'React 19', 'TypeScript', 'PostgreSQL RLS'],
      github: 'https://github.com',
      demo: '#',
    },
    {
      title: 'Distributed Rate Limiter & Token Bucket',
      status: 'CONFIRMED PROTOTYPE',
      statusColor: 'var(--accent-emerald)',
      summary:
        'High-performance token-bucket rate limiter implementing progressive delays and IP throttling for authentication endpoints.',
      tech: ['Java', 'Spring Security', 'Redis', 'Docker'],
      github: 'https://github.com',
      demo: '#',
    },
    {
      title: 'Quantified-Self Fitness Engine',
      status: 'PLANNED (Phase 5)',
      statusColor: 'var(--accent-amber)',
      summary:
        'Workout session tracking engine capturing exercise volume, RPE ratings, and biometric measurements with zero external trackers.',
      tech: ['Spring Data JPA', 'PostgreSQL', 'TypeScript', 'Chart.js'],
      github: 'https://github.com',
      demo: '#',
    },
  ];

  return (
    <div style={containerStyles}>
      <header style={headerStyles}>
        <div style={taglineBadgeStyles}>
          <Layers size={14} color="var(--accent-cyan)" />
          <span>ENGINEERING PORTFOLIO</span>
        </div>
        <h1 style={titleStyles}>Featured Projects</h1>
        <p style={subtitleStyles}>
          Production systems, architecture prototypes, and open-source contributions.
        </p>
      </header>

      <div style={gridStyles}>
        {projects.map((proj, idx) => (
          <article key={idx} style={cardStyles}>
            <div style={cardTopRowStyles}>
              <span style={statusBadgeStyles(proj.statusColor)}>{proj.status}</span>
              <div style={linksGroupStyles}>
                <a
                  href={proj.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={iconButtonStyles}
                  aria-label={`${proj.title} GitHub repository (external link)`}
                >
                  <FolderGit2 size={16} />
                </a>
              </div>
            </div>

            <h2 style={projectTitleStyles}>{proj.title}</h2>
            <p style={projectSummaryStyles}>{proj.summary}</p>

            <div style={techPillContainerStyles}>
              {proj.tech.map((t, tIdx) => (
                <span key={tIdx} style={techPillStyles}>
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
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
  gap: '1rem',
  boxShadow: 'var(--shadow-card)',
};

const cardTopRowStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const statusBadgeStyles = (color: string): React.CSSProperties => ({
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  padding: '0.25rem 0.6rem',
  borderRadius: 'var(--radius-sm)',
  color,
  backgroundColor: 'rgba(255, 255, 255, 0.04)',
  border: `1px solid ${color}`,
});

const linksGroupStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const iconButtonStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-secondary)',
};

const projectTitleStyles: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 700,
  lineHeight: 1.3,
};

const projectSummaryStyles: React.CSSProperties = {
  fontSize: '0.9rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
  flex: 1,
};

const techPillContainerStyles: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.4rem',
  marginTop: '0.5rem',
};

const techPillStyles: React.CSSProperties = {
  fontSize: '0.75rem',
  padding: '0.2rem 0.5rem',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'var(--bg-surface)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-muted)',
};

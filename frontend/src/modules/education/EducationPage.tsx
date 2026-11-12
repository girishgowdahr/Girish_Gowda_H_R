import React from 'react';
import { GraduationCap, Calendar } from 'lucide-react';

export const EducationPage: React.FC = () => {
  return (
    <div style={containerStyles}>
      <header style={headerStyles}>
        <div style={taglineBadgeStyles}>
          <GraduationCap size={14} color="var(--accent-cyan)" />
          <span>ACADEMIC BACKGROUND</span>
        </div>
        <h1 style={titleStyles}>Education & Qualifications</h1>
        <p style={subtitleStyles}>
          Foundational engineering degrees and technical curriculum.
        </p>
      </header>

      <div style={noticeBoxStyles}>
        <strong>Note:</strong> Academic credentials below represent initial provisional placeholders. You can supply and confirm your exact college, degree, and graduation dates in <code>docs/product/content-inventory.md</code>.
      </div>

      <div style={timelineStyles}>
        <article style={cardStyles}>
          <div style={cardHeaderStyles}>
            <div style={headerLeftStyles}>
              <h2 style={degreeTitleStyles}>Bachelor of Technology (B.Tech)</h2>
              <p style={institutionStyles}>Engineering Institution [Awaiting Owner Confirmation]</p>
            </div>
            <span style={durationBadgeStyles}>
              <Calendar size={14} /> 2020 – 2024
            </span>
          </div>

          <p style={descriptionStyles}>
            Core coursework: Data Structures & Algorithms, Object-Oriented Analysis & Design, Database Management Systems, Computer Networks, Operating Systems, and Software Engineering.
          </p>

          <div style={topicsRowStyles}>
            <span style={topicPillStyles}>Computer Science & Engineering</span>
            <span style={topicPillStyles}>Distributed Systems</span>
            <span style={topicPillStyles}>Information Security</span>
          </div>
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

const headerLeftStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
};

const degreeTitleStyles: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 700,
};

const institutionStyles: React.CSSProperties = {
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

const descriptionStyles: React.CSSProperties = {
  fontSize: '0.9rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
};

const topicsRowStyles: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
};

const topicPillStyles: React.CSSProperties = {
  fontSize: '0.75rem',
  padding: '0.25rem 0.5rem',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'var(--bg-surface)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-muted)',
};

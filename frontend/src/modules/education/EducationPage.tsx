import React, { useEffect, useState } from 'react';
import { GraduationCap, Calendar, Award, BookOpen } from 'lucide-react';
import { getEducation } from '../../core/api/portfolioApi';
import { PublicEducation } from '../../core/api/types';

export const EducationPage: React.FC = () => {
  const [educations, setEducations] = useState<PublicEducation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getEducation()
      .then((data) => {
        if (mounted) {
          setEducations(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div style={containerStyles}>
        <div style={loadingStyles}>
          <p>Loading academic credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyles}>
      <header style={headerStyles}>
        <div style={taglineBadgeStyles}>
          <GraduationCap size={14} color="var(--accent-cyan)" />
          <span>ACADEMIC FOUNDATIONS</span>
        </div>
        <h1 style={titleStyles}>Education & Credentials</h1>
        <p style={subtitleStyles}>
          Formal computer science foundations, algorithms, systems design, and academic achievements.
        </p>
      </header>

      <div style={cardsContainerStyles}>
        {educations.map((edu, index) => (
          <article
            key={index}
            style={cardStyles}
            aria-labelledby={`edu-${index}-degree`}
          >
            <div style={cardHeaderStyles}>
              <div>
                <h2 id={`edu-${index}-degree`} style={degreeTitleStyles}>
                  {edu.degree}
                </h2>
                <h3 style={institutionStyles}>{edu.institution}</h3>
                <p style={fieldStyles}>{edu.fieldOfStudy}</p>
              </div>

              <div style={metaColumnStyles}>
                <span style={yearBadgeStyles}>
                  <Calendar size={13} />
                  {edu.startYear} — {edu.endYear ? edu.endYear : 'Present'}
                </span>
                {edu.gradeOrGpa && (
                  <span style={gradeBadgeStyles}>
                    <Award size={13} color="var(--accent-cyan)" />
                    {edu.gradeOrGpa}
                  </span>
                )}
              </div>
            </div>

            {edu.description && (
              <div style={descriptionBoxStyles}>
                <BookOpen size={16} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                <p style={descriptionTextStyles}>{edu.description}</p>
              </div>
            )}
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

const cardsContainerStyles: React.CSSProperties = {
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
  gap: '1.25rem',
};

const cardHeaderStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  gap: '1rem',
};

const degreeTitleStyles: React.CSSProperties = {
  fontSize: '1.3rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
};

const institutionStyles: React.CSSProperties = {
  fontSize: '1.05rem',
  color: 'var(--accent-cyan)',
  fontWeight: 600,
  marginTop: '0.25rem',
};

const fieldStyles: React.CSSProperties = {
  fontSize: '0.9rem',
  color: 'var(--text-muted)',
  marginTop: '0.2rem',
};

const metaColumnStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '0.4rem',
};

const yearBadgeStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  padding: '0.3rem 0.65rem',
  borderRadius: 'var(--radius-sm)',
  fontWeight: 600,
};

const gradeBadgeStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.8rem',
  color: 'var(--accent-cyan)',
  backgroundColor: 'rgba(0, 255, 204, 0.1)',
  padding: '0.25rem 0.6rem',
  borderRadius: 'var(--radius-sm)',
  fontWeight: 600,
};

const descriptionBoxStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.75rem',
  backgroundColor: 'rgba(255, 255, 255, 0.02)',
  padding: '1rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid rgba(255, 255, 255, 0.04)',
};

const descriptionTextStyles: React.CSSProperties = {
  fontSize: '0.9rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
};

const loadingStyles: React.CSSProperties = {
  padding: '4rem 1rem',
  textAlign: 'center',
  color: 'var(--text-muted)',
};

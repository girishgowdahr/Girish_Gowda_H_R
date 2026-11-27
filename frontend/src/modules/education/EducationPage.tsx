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
          <GraduationCap size={14} color="var(--accent-primary)" />
          <span>ACADEMIC FOUNDATION</span>
        </div>
        <h1 style={titleStyles}>Education &amp; Credentials</h1>
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
                  {edu.startYear && edu.startYear > 0
                    ? `${edu.startYear} — ${edu.endYear ? edu.endYear : 'Present'}`
                    : `Completed ${edu.endYear}`}
                </span>
                {edu.gradeOrGpa && (
                  <span style={gradeBadgeStyles}>
                    <Award size={13} color="var(--accent-primary)" />
                    {edu.gradeOrGpa}
                  </span>
                )}
              </div>
            </div>

            {edu.description && (
              <div style={descriptionBoxStyles}>
                <BookOpen size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
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
  letterSpacing: '0.08em',
  color: 'var(--accent-primary)',
  backgroundColor: 'rgba(165, 180, 252, 0.08)',
  padding: '0.3rem 0.7rem',
  borderRadius: '9999px',
  border: '1px solid rgba(165, 180, 252, 0.25)',
  alignSelf: 'flex-start',
};

const titleStyles: React.CSSProperties = {
  fontSize: '2.5rem',
  fontWeight: 800,
  letterSpacing: '-0.02em',
  color: 'var(--text-primary)',
};

const subtitleStyles: React.CSSProperties = {
  fontSize: '1.05rem',
  color: 'var(--text-muted)',
};

const cardsContainerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

const cardStyles: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '12px',
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
  color: 'var(--accent-primary)',
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
  borderRadius: '4px',
  fontWeight: 600,
};

const gradeBadgeStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.8rem',
  color: 'var(--accent-primary)',
  backgroundColor: 'rgba(165, 180, 252, 0.1)',
  padding: '0.25rem 0.6rem',
  borderRadius: '4px',
  border: '1px solid rgba(165, 180, 252, 0.2)',
  fontWeight: 600,
};

const descriptionBoxStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.75rem',
  backgroundColor: 'var(--bg-card-subtle)',
  padding: '1rem',
  borderRadius: '8px',
  border: '1px solid var(--border-subtle)',
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

import React, { useEffect, useState } from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { getExperience } from '../../core/api/portfolioApi';
import { PublicExperience } from '../../core/api/types';

export const ExperiencePage: React.FC = () => {
  const [experiences, setExperiences] = useState<PublicExperience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getExperience()
      .then((data) => {
        if (mounted) {
          setExperiences(data);
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
          <p>Loading operational career history...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyles}>
      <header style={headerStyles}>
        <div style={taglineBadgeStyles}>
          <Briefcase size={14} color="var(--accent-primary)" />
          <span>CAREER TIMELINE</span>
        </div>
        <h1 style={titleStyles}>Professional Experience</h1>
        <p style={subtitleStyles}>
          Engineering roles, distributed systems ownership, and software delivery track record.
        </p>
      </header>

      {experiences.length === 0 ? (
        <section style={timelineCardStyles} aria-label="Current Career Status">
          <h2 style={roleTitleStyles}>University Hire Software Engineer Candidate</h2>
          <h3 style={companyNameStyles}>RV College of Engineering, Bengaluru</h3>
          <p style={descriptionStyles}>
            Currently enrolled as a full-time Master of Computer Applications (MCA) student (2025 – 2027) with a strong foundation in Java, SQL, and full-stack development.
          </p>
          <p style={descriptionStyles}>
            Co-authored an IEEE-published research paper on a Digital Twin-enabled self-healing web application. Seeking a University Hire Software Engineer role to deliver innovative digital solutions within a global engineering team.
          </p>
        </section>
      ) : (
        <div style={timelineContainerStyles}>
          {experiences.map((exp, index) => (
            <article
              key={index}
              style={timelineItemStyles}
              aria-labelledby={`exp-${index}-title`}
            >
              <div style={timelineMarkerWrapperStyles}>
                <div style={timelineDotStyles} />
                {index < experiences.length - 1 && <div style={timelineLineStyles} />}
              </div>

              <div style={timelineCardStyles}>
                <div style={cardHeaderStyles}>
                  <div>
                    <h2 id={`exp-${index}-title`} style={roleTitleStyles}>
                      {exp.roleTitle}
                    </h2>
                    <h3 style={companyNameStyles}>{exp.companyName}</h3>
                  </div>

                  <div style={badgeColumnStyles}>
                    {exp.isCurrent ? (
                      <span style={currentBadgeStyles}>Current Position</span>
                    ) : (
                      <span style={pastBadgeStyles}>Completed</span>
                    )}
                    <span style={dateRangeStyles}>
                      <Calendar size={13} />
                      {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                  </div>
                </div>

                {exp.location && (
                  <div style={locationRowStyles}>
                    <MapPin size={13} color="var(--accent-primary)" />
                    <span>{exp.location}</span>
                    {exp.employmentType && <span>• {exp.employmentType}</span>}
                  </div>
                )}

                <p style={descriptionStyles}>{exp.description}</p>

                {exp.highlights && exp.highlights.length > 0 && (
                  <div style={highlightsSectionStyles}>
                    <h4 style={highlightsHeadingStyles}>Key Technical Contributions</h4>
                    <ul style={highlightsListStyles}>
                      {exp.highlights.map((h, hIdx) => (
                        <li key={hIdx} style={highlightItemStyles}>
                          <CheckCircle2 size={14} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {exp.technologies && exp.technologies.length > 0 && (
                  <div style={techRowStyles}>
                    {exp.technologies.map((tech) => (
                      <span key={tech} style={techBadgeStyles}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
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

const timelineContainerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

const timelineItemStyles: React.CSSProperties = {
  display: 'flex',
  gap: '1.25rem',
  position: 'relative',
};

const timelineMarkerWrapperStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '24px',
  flexShrink: 0,
};

const timelineDotStyles: React.CSSProperties = {
  width: '14px',
  height: '14px',
  borderRadius: '50%',
  backgroundColor: 'var(--accent-primary)',
  boxShadow: '0 0 10px rgba(165, 180, 252, 0.4)',
  marginTop: '1.5rem',
  zIndex: 1,
};

const timelineLineStyles: React.CSSProperties = {
  width: '2px',
  flexGrow: 1,
  backgroundColor: 'var(--border-subtle)',
  marginTop: '0.5rem',
};

const timelineCardStyles: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '12px',
  padding: '1.75rem',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const cardHeaderStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  gap: '0.75rem',
};

const roleTitleStyles: React.CSSProperties = {
  fontSize: '1.3rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
};

const companyNameStyles: React.CSSProperties = {
  fontSize: '1rem',
  color: 'var(--accent-primary)',
  fontWeight: 600,
  marginTop: '0.2rem',
};

const badgeColumnStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '0.35rem',
};

const currentBadgeStyles: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 700,
  color: '#020617',
  backgroundColor: 'var(--accent-primary)',
  padding: '0.2rem 0.55rem',
  borderRadius: '4px',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const pastBadgeStyles: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 600,
  color: 'var(--text-muted)',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  padding: '0.2rem 0.5rem',
  borderRadius: '4px',
};

const dateRangeStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.3rem',
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
};

const locationRowStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
};

const descriptionStyles: React.CSSProperties = {
  fontSize: '0.95rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
};

const highlightsSectionStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  backgroundColor: 'var(--bg-card-subtle)',
  padding: '1rem',
  borderRadius: '8px',
  border: '1px solid var(--border-subtle)',
};

const highlightsHeadingStyles: React.CSSProperties = {
  fontSize: '0.85rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const highlightsListStyles: React.CSSProperties = {
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',
};

const highlightItemStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.5rem',
  fontSize: '0.9rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.5,
};

const techRowStyles: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.4rem',
  marginTop: '0.25rem',
};

const techBadgeStyles: React.CSSProperties = {
  fontSize: '0.75rem',
  backgroundColor: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-secondary)',
  padding: '0.2rem 0.5rem',
  borderRadius: '4px',
};

const loadingStyles: React.CSSProperties = {
  padding: '4rem 1rem',
  textAlign: 'center',
  color: 'var(--text-muted)',
};

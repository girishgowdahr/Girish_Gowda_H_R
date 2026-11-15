import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, Star, Sparkles } from 'lucide-react';
import { getSkills } from '../../core/api/portfolioApi';
import { PublicSkillCategory } from '../../core/api/types';

export const SkillsPage: React.FC = () => {
  const [categories, setCategories] = useState<PublicSkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    let mounted = true;
    getSkills()
      .then((data) => {
        if (mounted) {
          setCategories(data);
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
          <p>Loading technical capabilities matrix...</p>
        </div>
      </div>
    );
  }

  const categoryNames = ['all', ...categories.map((c) => c.name)];
  const displayedCategories =
    activeFilter === 'all' ? categories : categories.filter((c) => c.name === activeFilter);

  return (
    <div style={containerStyles}>
      <header style={headerStyles}>
        <div style={taglineBadgeStyles}>
          <Cpu size={14} color="var(--accent-cyan)" />
          <span>TECHNICAL LOADOUT</span>
        </div>
        <h1 style={titleStyles}>Skills & Competencies</h1>
        <p style={subtitleStyles}>
          Full-stack capabilities, cloud runtimes, distributed persistence, and 3D graphics tooling.
        </p>
      </header>

      {/* Filter Tabs */}
      <div style={filterBarStyles} role="tablist" aria-label="Skill categories filter">
        {categoryNames.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={activeFilter === cat}
            onClick={() => setActiveFilter(cat)}
            style={{
              ...filterButtonStyles,
              ...(activeFilter === cat ? activeFilterButtonStyles : {}),
            }}
          >
            {cat === 'all' ? 'All Specializations' : cat}
          </button>
        ))}
      </div>

      <div style={categoriesGridStyles}>
        {displayedCategories.map((category) => (
          <section key={category.name} style={categoryCardStyles} aria-labelledby={`cat-${category.name}`}>
            <div style={categoryHeaderStyles}>
              <h2 id={`cat-${category.name}`} style={categoryTitleStyles}>
                {category.name}
              </h2>
              <span style={itemCountBadgeStyles}>{category.items.length} competencies</span>
            </div>

            <div style={skillGridStyles}>
              {category.items.map((skill) => (
                <div key={skill.name} style={skillItemCardStyles}>
                  <div style={skillItemHeaderStyles}>
                    <div style={skillNameWrapperStyles}>
                      {skill.isFeatured && (
                        <Star size={14} color="#f59e0b" fill="#f59e0b" aria-label="Featured competency" />
                      )}
                      <span style={skillNameStyles}>{skill.name}</span>
                    </div>
                    {skill.proficiency && (
                      <span
                        style={{
                          ...proficiencyBadgeStyles,
                          ...(skill.proficiency === 'Advanced' ? advancedBadgeStyles : {}),
                        }}
                      >
                        {skill.proficiency}
                      </span>
                    )}
                  </div>

                  <div style={skillMetaRowStyles}>
                    <span style={metaTextStyles}>
                      <CheckCircle2 size={12} color="var(--accent-cyan)" />
                      {skill.yearsOfExperience} yrs experience
                    </span>
                    {skill.isFeatured && (
                      <span style={featuredFlagStyles}>
                        <Sparkles size={11} /> Featured
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
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

const filterBarStyles: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  paddingBottom: '0.5rem',
};

const filterButtonStyles: React.CSSProperties = {
  padding: '0.5rem 1rem',
  borderRadius: 'var(--radius-full)',
  backgroundColor: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-secondary)',
  fontSize: '0.85rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
};

const activeFilterButtonStyles: React.CSSProperties = {
  backgroundColor: 'var(--accent-cyan)',
  color: '#0a0f1d',
  borderColor: 'var(--accent-cyan)',
};

const categoriesGridStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.75rem',
};

const categoryCardStyles: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-lg)',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
};

const categoryHeaderStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid var(--border-subtle)',
  paddingBottom: '0.75rem',
};

const categoryTitleStyles: React.CSSProperties = {
  fontSize: '1.2rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
};

const itemCountBadgeStyles: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  padding: '0.2rem 0.6rem',
  borderRadius: 'var(--radius-sm)',
};

const skillGridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: '1rem',
};

const skillItemCardStyles: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-md)',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const skillItemHeaderStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '0.5rem',
};

const skillNameWrapperStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
};

const skillNameStyles: React.CSSProperties = {
  fontWeight: 700,
  fontSize: '0.95rem',
  color: 'var(--text-primary)',
};

const proficiencyBadgeStyles: React.CSSProperties = {
  fontSize: '0.7rem',
  padding: '0.15rem 0.45rem',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'rgba(255, 255, 255, 0.06)',
  color: 'var(--text-secondary)',
  fontWeight: 600,
};

const advancedBadgeStyles: React.CSSProperties = {
  backgroundColor: 'rgba(0, 255, 204, 0.12)',
  color: 'var(--accent-cyan)',
};

const skillMetaRowStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
};

const metaTextStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.3rem',
};

const featuredFlagStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.2rem',
  color: '#f59e0b',
  fontWeight: 600,
  fontSize: '0.75rem',
};

const loadingStyles: React.CSSProperties = {
  padding: '4rem 1rem',
  textAlign: 'center',
  color: 'var(--text-muted)',
};

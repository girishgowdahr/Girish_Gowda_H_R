import React, { useEffect, useState } from 'react';
import { Layers, FolderGit2, ExternalLink, Star, Filter, Terminal } from 'lucide-react';
import { GithubIcon } from '../../design-system/components/SocialIcons';
import { getProjects } from '../../core/api/portfolioApi';
import { PublicProject } from '../../core/api/types';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    let mounted = true;
    getProjects()
      .then((data) => {
        if (mounted) {
          setProjects(data);
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
          <p>Loading projects inventory...</p>
        </div>
      </div>
    );
  }

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];
  const filteredProjects =
    activeCategory === 'All' ? projects : projects.filter((p) => p.category === activeCategory);

  return (
    <div style={containerStyles}>
      <header style={headerStyles}>
        <div style={taglineBadgeStyles}>
          <Layers size={14} color="var(--accent-cyan)" />
          <span>ENGINEERING PORTFOLIO</span>
        </div>
        <h1 style={titleStyles}>Featured Projects</h1>
        <p style={subtitleStyles}>
          Architectural designs, high-throughput microservices, 3D WebGL lobbies, and client-side encryption.
        </p>
      </header>

      {/* Coding Operative Hero Spotlight */}
      <section style={operativeHeroStyles} aria-label="Lead Developer Operative Spotlight">
        <div style={operativeHeroContentStyles}>
          <div style={taglineBadgeStyles}>
            <Terminal size={14} color="var(--accent-cyan)" />
            <span>CODING OPERATIVE // LEAD DEVELOPER</span>
          </div>
          <h2 style={operativeHeroTitleStyles}>Systems Engineering &amp; Architecture</h2>
          <p style={operativeHeroDescStyles}>
            Hands-on full-stack development featuring high-performance Java Spring Boot services, responsive React &amp; TypeScript interfaces, resilient database schemas, and interactive 3D WebGL scenes.
          </p>
          <div style={operativeTechPillsStyles}>
            <span style={pillStyles}>Java 21 / Spring Boot</span>
            <span style={pillStyles}>React 18 / TypeScript</span>
            <span style={pillStyles}>PostgreSQL &amp; Redis</span>
            <span style={pillStyles}>Three.js 3D Engine</span>
          </div>
        </div>
        <div style={operativeAvatarWrapperStyles}>
          <img
            src={`${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/assets/avatar/avatar_coding.png`}
            alt="Girish Gowda H R - Coding Operative Standing Portrait"
            style={operativeAvatarImgStyles}
          />
        </div>
      </section>

      {/* Filter Chips */}
      <div style={filterContainerStyles} role="toolbar" aria-label="Project category filter">
        <div style={filterLabelStyles}>
          <Filter size={14} />
          <span>Category:</span>
        </div>
        <div style={filterChipsStyles}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              style={{
                ...filterChipStyles,
                ...(activeCategory === cat ? activeChipStyles : {}),
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={gridStyles}>
        {filteredProjects.map((project) => (
          <article
            key={project.slug}
            style={cardStyles}
            aria-labelledby={`project-${project.slug}-title`}
          >
            <div style={cardHeaderStyles}>
              <div style={headerTopStyles}>
                <span style={categoryBadgeStyles}>{project.category}</span>
                {project.featured && (
                  <span style={featuredBadgeStyles}>
                    <Star size={12} fill="#f59e0b" color="#f59e0b" />
                    <span>Featured System</span>
                  </span>
                )}
              </div>

              <h2 id={`project-${project.slug}-title`} style={projectTitleStyles}>
                {project.title}
              </h2>
              <p style={taglineStyles}>{project.tagline}</p>
            </div>

            <p style={descriptionStyles}>{project.description}</p>

            <div style={techContainerStyles}>
              {project.technologies.map((tech) => (
                <span key={tech} style={techBadgeStyles}>
                  {tech}
                </span>
              ))}
            </div>

            <div style={actionRowStyles}>
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkButtonStyles}
                  aria-label={`Source code for ${project.title} on GitHub`}
                >
                  <GithubIcon size={15} />
                  <span>Source Code</span>
                  <ExternalLink size={12} />
                </a>
              )}

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={primaryLinkButtonStyles}
                  aria-label={`Launch live interactive demo for ${project.title}`}
                >
                  <FolderGit2 size={15} />
                  <span>Launch Live</span>
                  <ExternalLink size={12} />
                </a>
              )}
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

const filterContainerStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '0.75rem',
};

const filterLabelStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
  fontWeight: 600,
};

const filterChipsStyles: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
};

const filterChipStyles: React.CSSProperties = {
  padding: '0.4rem 0.85rem',
  borderRadius: 'var(--radius-full)',
  backgroundColor: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-secondary)',
  fontSize: '0.8rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
};

const activeChipStyles: React.CSSProperties = {
  backgroundColor: 'var(--accent-cyan)',
  color: '#0a0f1d',
  borderColor: 'var(--accent-cyan)',
};

const gridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
  gap: '1.5rem',
};

const cardStyles: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-lg)',
  padding: '1.75rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: '1.25rem',
  transition: 'border-color 0.2s ease',
};

const cardHeaderStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const headerTopStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '0.5rem',
};

const categoryBadgeStyles: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 700,
  color: 'var(--accent-cyan)',
  backgroundColor: 'rgba(0, 255, 204, 0.08)',
  padding: '0.2rem 0.5rem',
  borderRadius: 'var(--radius-sm)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const featuredBadgeStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  fontSize: '0.7rem',
  color: '#f59e0b',
  backgroundColor: 'rgba(245, 158, 11, 0.1)',
  padding: '0.2rem 0.5rem',
  borderRadius: 'var(--radius-sm)',
  fontWeight: 600,
};

const projectTitleStyles: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
};

const taglineStyles: React.CSSProperties = {
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
};

const descriptionStyles: React.CSSProperties = {
  fontSize: '0.9rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
  flexGrow: 1,
};

const techContainerStyles: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.4rem',
};

const techBadgeStyles: React.CSSProperties = {
  fontSize: '0.75rem',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)',
  padding: '0.2rem 0.5rem',
  borderRadius: 'var(--radius-sm)',
  fontWeight: 500,
};

const actionRowStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  borderTop: '1px solid var(--border-subtle)',
  paddingTop: '1rem',
};

const linkButtonStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid var(--border-subtle)',
  padding: '0.45rem 0.8rem',
  borderRadius: 'var(--radius-md)',
  textDecoration: 'none',
  fontWeight: 600,
  transition: 'color 0.15s ease',
};

const primaryLinkButtonStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  fontSize: '0.85rem',
  color: '#0a0f1d',
  backgroundColor: 'var(--accent-cyan)',
  padding: '0.45rem 0.85rem',
  borderRadius: 'var(--radius-md)',
  textDecoration: 'none',
  fontWeight: 700,
};

const loadingStyles: React.CSSProperties = {
  padding: '4rem 1rem',
  textAlign: 'center',
  color: 'var(--text-muted)',
};

const operativeHeroStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '2rem',
  padding: '2rem',
  backgroundColor: 'var(--bg-surface)',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid rgba(0, 240, 255, 0.25)',
  background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.05) 0%, rgba(13, 17, 26, 0.95) 100%)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 24px rgba(0, 240, 255, 0.1)',
};

const operativeHeroContentStyles: React.CSSProperties = {
  flex: '1 1 360px',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.85rem',
};

const operativeHeroTitleStyles: React.CSSProperties = {
  fontSize: '1.6rem',
  fontWeight: 800,
  letterSpacing: '-0.01em',
  color: 'var(--text-primary)',
};

const operativeHeroDescStyles: React.CSSProperties = {
  fontSize: '0.95rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
  maxWidth: '600px',
};

const operativeTechPillsStyles: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap',
  marginTop: '0.25rem',
};

const pillStyles: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--accent-cyan)',
  backgroundColor: 'rgba(0, 240, 255, 0.08)',
  border: '1px solid rgba(0, 240, 255, 0.2)',
  padding: '0.25rem 0.65rem',
  borderRadius: '4px',
};

const operativeAvatarWrapperStyles: React.CSSProperties = {
  flex: '0 0 auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  maxHeight: '380px',
};

const operativeAvatarImgStyles: React.CSSProperties = {
  maxHeight: '360px',
  width: 'auto',
  maxWidth: '100%',
  objectFit: 'contain',
  borderRadius: '8px',
  filter: 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 16px rgba(0, 240, 255, 0.25))',
};

// frontend/src/modules/lobby/LobbyPage.tsx
// AAA Battle Royale Immersive 3D Portfolio Lobby

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Terminal, ArrowRight, Code, Dumbbell, Lock, Box } from 'lucide-react';
import { LobbyAvatarScene, LobbyCategory, LOBBY_CATEGORIES } from '../../scene3d/avatar/LobbyAvatarScene';

export const LobbyPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [activeCategory, setActiveCategory] = useState<LobbyCategory>('projects');

  const activeConfig = LOBBY_CATEGORIES.find((c) => c.id === activeCategory) || LOBBY_CATEGORIES[5];

  return (
    <div style={lobbyContainerStyles}>
      {/* Accessible Hero Heading for Screen Readers & Tests */}
      <section style={heroSectionStyles} aria-labelledby="hero-title">
        <div style={badgeContainerStyles}>
          <span style={heroBadgeStyles(activeConfig.themeColor)}>
            <Sparkles size={14} color={activeConfig.themeColor} />
            <span>OPERATIONAL // AAA 3D BATTLE ROYALE LOBBY ACTIVE</span>
          </span>
        </div>

        <h1 id="hero-title" style={heroTitleStyles}>
          Welcome to <span style={highlightTitleStyles(activeConfig.themeColor)}>GIRISH</span>
        </h1>
        <p style={heroSubtitleStyles}>
          Personal Identity Platform, Public Portfolio &amp; Quantified-Self Battle-Lobby.
        </p>

        <div style={heroCtaRowStyles}>
          <Link to="/projects" style={primaryButtonStyles(activeConfig.themeColor)}>
            <span>Explore Projects</span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/about" style={secondaryButtonStyles}>
            <span>Read Bio &amp; Background</span>
          </Link>
        </div>
      </section>

      {/* Main 3D Game Lobby Stage */}
      <section style={stageSectionStyles} aria-label="Interactive 3D Avatar Game Lobby">
        {/* Stage Header Toolbar */}
        <div style={stageHeaderBarStyles}>
          <div style={stageHeaderLeftStyles}>
            <Terminal size={18} color={activeConfig.themeColor} />
            <span style={stageHeaderTextStyles}>
              BATTLE ROYALE 3D LOBBY // INTERACTIVE AVATAR STAGE
            </span>
          </div>
          <div style={viewToggleGroupStyles}>
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              style={toggleButtonStyles(viewMode === '3d', activeConfig.themeColor)}
            >
              3D Interactive Stage
            </button>
            <button
              type="button"
              onClick={() => setViewMode('2d')}
              style={toggleButtonStyles(viewMode === '2d', activeConfig.themeColor)}
            >
              2D Accessible Fallback
            </button>
          </div>
        </div>

        {/* 3D Immersive Viewport OR 2D Fallback */}
        {viewMode === '3d' ? (
          <LobbyAvatarScene
            initialCategory={activeCategory}
            onNavigate={(url) => navigate(url)}
          />
        ) : (
          <div style={fallbackCardStyles(activeConfig.themeColor)}>
            <div style={fallbackAvatarWrapperStyles}>
              <img
                src={`${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/assets/avatar/avatar_coding.png`}
                alt="Girish Gowda H R - Tactical Hero Avatar"
                style={fallbackAvatarImgStyles(activeConfig.themeColor)}
              />
            </div>
            <div style={fallbackDetailsStyles}>
              <div style={fallbackBadgeStyles(activeConfig.themeColor)}>
                <span>2D ACCESSIBLE LOBBY MODE</span>
              </div>
              <h2 style={avatarNameStyles}>GIRISH GOWDA H R</h2>
              <p style={avatarRoleStyles}>
                Software Engineer // Java, Spring Boot, Full-Stack Architecture &amp; 3D Graphics
              </p>
              <div style={avatarPillsStyles}>
                <span style={pillStyles}>Full-Body Standing Character</span>
                <span style={pillStyles}>Accessible High-Contrast Mode</span>
                <span style={pillStyles}>Direct Category Portals</span>
              </div>

              {/* 2D Categories Grid */}
              <div style={fallbackCategoriesGridStyles}>
                {LOBBY_CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    style={fallbackCategoryItemStyles(cat.id === activeCategory, cat.themeColor)}
                  >
                    <span style={fallbackCatCodeStyles(cat.themeColor)}>{cat.code}</span>
                    <div>
                      <h4 style={fallbackCatTitleStyles(cat.themeColor)}>{cat.title}</h4>
                      <p style={fallbackCatSubStyles}>{cat.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Platform Architecture Security & Quantified-Self Highlights */}
      <section style={pillarsGridStyles} aria-label="Platform Architecture Highlights">
        <article style={pillarCardStyles}>
          <div style={cardHeaderRowStyles}>
            <div style={cardIconStyles}>
              <Code size={22} color="var(--accent-cyan)" />
            </div>
            <span style={miniBadgeStyles('var(--accent-cyan)')}>PUBLIC GATEWAY</span>
          </div>
          <h3 style={cardTitleStyles}>1. Public Portfolio</h3>
          <p style={cardTextStyles}>
            Recruiter-friendly showcase of verified projects, technical proficiencies, education, and credentials. Only explicitly published snapshots are accessible.
          </p>
          <Link to="/projects" style={cardLinkStyles}>
            Browse Projects &rarr;
          </Link>
        </article>

        <article style={pillarCardStyles}>
          <div style={cardHeaderRowStyles}>
            <div style={cardIconStyles}>
              <Dumbbell size={22} color="var(--accent-emerald)" />
            </div>
            <span style={miniBadgeStyles('var(--accent-emerald)')}>AUTHENTICATED</span>
          </div>
          <h3 style={cardTitleStyles}>2. Private Dashboard</h3>
          <p style={cardTextStyles}>
            Quantified self tracking for workouts, athletic discipline, study sessions, journal reflections, and personal milestones. Protected by strict session authentication.
          </p>
          <span style={lockedBadgeStyles}>
            <Lock size={12} /> Owner Authenticated
          </span>
        </article>

        <article style={pillarCardStyles}>
          <div style={cardHeaderRowStyles}>
            <div style={cardIconStyles}>
              <Lock size={22} color="var(--accent-purple)" />
            </div>
            <span style={miniBadgeStyles('var(--accent-purple)')}>ENCLAVE</span>
          </div>
          <h3 style={cardTitleStyles}>3. Secure Vault</h3>
          <p style={cardTextStyles}>
            Zero-knowledge client-side encryption (libsodium/WebCrypto) for confidential records and documents. Master Key is never transmitted to the server.
          </p>
          <span style={lockedBadgeStyles}>
            <Lock size={12} /> Gated Boundary
          </span>
        </article>

        <article style={pillarCardStyles}>
          <div style={cardHeaderRowStyles}>
            <div style={cardIconStyles}>
              <Box size={22} color={activeConfig.themeColor} />
            </div>
            <span style={miniBadgeStyles(activeConfig.themeColor)}>AAA 3D ENGINE</span>
          </div>
          <h3 style={cardTitleStyles}>4. 3D Avatar Lobby</h3>
          <p style={cardTextStyles}>
            Genuine full-body 3D human character with 360-degree rotation, smooth inertia, zoom, realistic lighting, and dynamic environment morphing.
          </p>
          <span style={activeBadgeStyles(activeConfig.themeColor)}>
            <Sparkles size={12} /> Live Interactive Stage
          </span>
        </article>
      </section>
    </div>
  );
};

// =============================================================================
// Styles
// =============================================================================

const lobbyContainerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2.5rem',
  width: '100%',
};

const heroSectionStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: '1.25rem 1rem 0.25rem',
  gap: '1rem',
};

const badgeContainerStyles: React.CSSProperties = {
  display: 'inline-flex',
};

const heroBadgeStyles = (color: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.78rem',
  fontWeight: 800,
  letterSpacing: '0.08em',
  padding: '0.35rem 0.85rem',
  background: `${color}15`,
  color: color,
  borderRadius: '4px',
  border: `1px solid ${color}44`,
  boxShadow: `0 0 16px ${color}22`,
});

const heroTitleStyles: React.CSSProperties = {
  fontSize: 'clamp(2.4rem, 5vw, 3.4rem)',
  fontWeight: 900,
  letterSpacing: '-0.02em',
  lineHeight: 1.1,
  color: 'var(--text-primary)',
};

const highlightTitleStyles = (color: string): React.CSSProperties => ({
  color: color,
  textShadow: `0 0 28px ${color}55`,
});

const heroSubtitleStyles: React.CSSProperties = {
  fontSize: '1.15rem',
  color: 'var(--text-secondary)',
  maxWidth: '680px',
  lineHeight: 1.5,
};

const heroCtaRowStyles: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  marginTop: '0.5rem',
  flexWrap: 'wrap',
  justifyContent: 'center',
};

const primaryButtonStyles = (color: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  backgroundColor: color,
  color: '#05070c',
  padding: '0.75rem 1.4rem',
  borderRadius: 'var(--radius-md)',
  fontWeight: 800,
  fontSize: '0.9rem',
  letterSpacing: '0.02em',
  textDecoration: 'none',
  boxShadow: `0 4px 18px ${color}44`,
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
});

const secondaryButtonStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  backgroundColor: 'rgba(255, 255, 255, 0.04)',
  color: 'var(--text-primary)',
  border: '1px solid var(--border-subtle)',
  padding: '0.75rem 1.4rem',
  borderRadius: 'var(--radius-md)',
  fontWeight: 600,
  fontSize: '0.9rem',
  textDecoration: 'none',
  backdropFilter: 'blur(12px)',
};

const stageSectionStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  width: '100%',
};

const stageHeaderBarStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '1rem',
  padding: '0.55rem 0.95rem',
  backgroundColor: 'rgba(14, 18, 30, 0.75)',
  backdropFilter: 'blur(16px)',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-subtle)',
};

const stageHeaderLeftStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.55rem',
};

const stageHeaderTextStyles: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 800,
  letterSpacing: '0.08em',
  color: 'var(--text-secondary)',
};

const viewToggleGroupStyles: React.CSSProperties = {
  display: 'flex',
  gap: '0.35rem',
};

const toggleButtonStyles = (active: boolean, color: string): React.CSSProperties => ({
  fontSize: '0.75rem',
  fontWeight: 800,
  letterSpacing: '0.04em',
  padding: '0.35rem 0.75rem',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: active ? `${color}22` : 'transparent',
  color: active ? color : 'var(--text-muted)',
  border: active ? `1px solid ${color}` : '1px solid transparent',
  cursor: 'pointer',
  transition: 'all 180ms ease',
});

// Fallback 2D Card Styles
const fallbackCardStyles = (color: string): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '2.5rem',
  flexWrap: 'wrap',
  justifyContent: 'center',
  padding: '3rem 2rem',
  backgroundColor: '#0a0d17',
  borderRadius: 'var(--radius-xl)',
  border: `1px solid ${color}44`,
  boxShadow: `0 12px 40px rgba(0, 0, 0, 0.9), 0 0 25px ${color}22`,
  minHeight: '480px',
});

const fallbackAvatarWrapperStyles: React.CSSProperties = {
  maxHeight: '440px',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const fallbackAvatarImgStyles = (color: string): React.CSSProperties => ({
  maxHeight: '420px',
  width: 'auto',
  borderRadius: 'var(--radius-lg)',
  boxShadow: `0 12px 35px rgba(0, 0, 0, 0.8), 0 0 25px ${color}33`,
  border: `1px solid ${color}44`,
});

const fallbackDetailsStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.85rem',
  maxWidth: '560px',
};

const fallbackBadgeStyles = (color: string): React.CSSProperties => ({
  fontSize: '0.72rem',
  fontWeight: 800,
  letterSpacing: '0.08em',
  color: color,
  backgroundColor: `${color}18`,
  border: `1px solid ${color}44`,
  padding: '0.25rem 0.65rem',
  borderRadius: '4px',
  alignSelf: 'flex-start',
});

const avatarNameStyles: React.CSSProperties = {
  fontSize: '1.75rem',
  fontWeight: 900,
  letterSpacing: '0.04em',
  margin: 0,
};

const avatarRoleStyles: React.CSSProperties = {
  fontSize: '0.95rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.5,
  margin: 0,
};

const avatarPillsStyles: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap',
};

const pillStyles: React.CSSProperties = {
  fontSize: '0.72rem',
  fontWeight: 700,
  color: 'var(--accent-cyan)',
  backgroundColor: 'rgba(0, 240, 255, 0.08)',
  border: '1px solid rgba(0, 240, 255, 0.25)',
  padding: '0.25rem 0.65rem',
  borderRadius: '4px',
};

const fallbackCategoriesGridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '0.75rem',
  marginTop: '0.5rem',
};

const fallbackCategoryItemStyles = (active: boolean, color: string): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.75rem 1rem',
  backgroundColor: active ? `${color}20` : 'rgba(255, 255, 255, 0.03)',
  border: active ? `1px solid ${color}` : '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: 'var(--radius-md)',
  cursor: 'pointer',
  transition: 'all 180ms ease',
});

const fallbackCatCodeStyles = (color: string): React.CSSProperties => ({
  fontSize: '0.85rem',
  fontWeight: 900,
  color: color,
});

const fallbackCatTitleStyles = (color: string): React.CSSProperties => ({
  fontSize: '0.84rem',
  fontWeight: 800,
  color: color,
  margin: 0,
});

const fallbackCatSubStyles: React.CSSProperties = {
  fontSize: '0.68rem',
  color: 'var(--text-muted)',
  margin: 0,
};

// Pillars Grid Styles
const pillarsGridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: '1.5rem',
  width: '100%',
};

const pillarCardStyles: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-lg)',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.85rem',
  boxShadow: 'var(--shadow-card)',
};

const cardHeaderRowStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const cardIconStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '42px',
  height: '42px',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid var(--border-subtle)',
};

const miniBadgeStyles = (color: string): React.CSSProperties => ({
  fontSize: '0.65rem',
  fontWeight: 800,
  letterSpacing: '0.06em',
  color: color,
  backgroundColor: `${color}15`,
  border: `1px solid ${color}33`,
  padding: '0.2rem 0.5rem',
  borderRadius: '3px',
});

const cardTitleStyles: React.CSSProperties = {
  fontSize: '1.1rem',
  fontWeight: 800,
  letterSpacing: '-0.01em',
  margin: 0,
};

const cardTextStyles: React.CSSProperties = {
  fontSize: '0.88rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.5,
  flex: 1,
  margin: 0,
};

const cardLinkStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.85rem',
  fontWeight: 700,
  color: 'var(--accent-cyan)',
  textDecoration: 'none',
};

const lockedBadgeStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.74rem',
  fontWeight: 700,
  color: 'var(--text-muted)',
  padding: '0.25rem 0.5rem',
  backgroundColor: 'rgba(255, 255, 255, 0.04)',
  borderRadius: 'var(--radius-sm)',
  alignSelf: 'flex-start',
};

const activeBadgeStyles = (color: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.74rem',
  fontWeight: 700,
  color: color,
  padding: '0.25rem 0.5rem',
  backgroundColor: `${color}18`,
  border: `1px solid ${color}44`,
  borderRadius: 'var(--radius-sm)',
  alignSelf: 'flex-start',
});

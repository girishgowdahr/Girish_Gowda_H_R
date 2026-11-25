import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Box, Code, Dumbbell, Lock, Sparkles } from 'lucide-react';
import { LobbyAvatarScene, OutfitId } from '../../scene3d/avatar/LobbyAvatarScene';

export const LobbyPage: React.FC = () => {
  const [outfit, setOutfit] = useState<OutfitId>('dev-hoodie');

  return (
    <div style={lobbyContainerStyles}>
      {/* Hero Header */}
      <section style={heroSectionStyles} aria-labelledby="hero-title">
        <div style={badgeContainerStyles}>
          <span style={heroBadgeStyles}>
            <Sparkles size={14} color="var(--accent-cyan)" />
            <span>OPERATIONAL // PHASE 1 &amp; 3D LOBBY ENGINE ACTIVE</span>
          </span>
        </div>

        <h1 id="hero-title" style={heroTitleStyles}>
          Welcome to <span style={highlightTitleStyles}>GIRISH</span>
        </h1>
        <p style={heroSubtitleStyles}>
          Personal Identity Platform, Public Portfolio &amp; Quantified-Self Battle-Lobby.
        </p>

        <div style={heroCtaRowStyles}>
          <Link to="/projects" style={primaryButtonStyles}>
            <span>Explore Projects</span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/about" style={secondaryButtonStyles}>
            <span>Read Bio &amp; Background</span>
          </Link>
        </div>
      </section>

      {/* 3D Interactive Avatar Stage */}
      <section style={stageSectionStyles} aria-label="Interactive 3D Avatar Game Lobby">
        <LobbyAvatarScene
          outfit={outfit}
          onOutfitChange={setOutfit}
        />
      </section>

      {/* Four Platform Pillars */}
      <section style={pillarsGridStyles} aria-label="Platform Architecture Pillars">
        <article style={cardStyles}>
          <div style={cardHeaderRowStyles}>
            <div style={cardIconStyles}>
              <Code size={24} color="var(--accent-cyan)" />
            </div>
            <img
              src={`${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/assets/avatar/avatar_professional.png`}
              alt="Executive Vanguard Persona"
              style={miniAvatarPreviewStyles('rgba(245, 158, 11, 0.45)')}
              title="Executive Vanguard Persona"
            />
          </div>
          <h3 style={cardTitleStyles}>1. Public Portfolio</h3>
          <p style={cardTextStyles}>
            Recruiter-friendly showcase of verified projects, technical proficiencies, education, and credentials. Only explicitly published snapshots are accessible.
          </p>
          <Link to="/projects" style={cardLinkStyles}>
            Browse Projects &rarr;
          </Link>
        </article>

        <article style={cardStyles}>
          <div style={cardHeaderRowStyles}>
            <div style={cardIconStyles}>
              <Dumbbell size={24} color="var(--accent-emerald)" />
            </div>
            <img
              src={`${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/assets/avatar/avatar_fitness.png`}
              alt="Fitness Titan Persona"
              style={miniAvatarPreviewStyles('rgba(16, 185, 129, 0.45)')}
              title="Fitness Titan Persona"
            />
          </div>
          <h3 style={cardTitleStyles}>2. Private Dashboard</h3>
          <p style={cardTextStyles}>
            Quantified self tracking for workouts, athletic discipline, study sessions, journal reflections, and personal milestones. Protected by strict session authentication.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginTop: 'auto', flexWrap: 'wrap' }}>
            <Link to="/dashboard" style={cardLinkStyles}>
              Access Dashboard &rarr;
            </Link>
            <span style={lockedBadgeStyles}>
              <Lock size={12} /> Master Password Protected
            </span>
          </div>
        </article>

        <article style={cardStyles}>
          <div style={cardIconStyles}>
            <Lock size={24} color="var(--accent-purple)" />
          </div>
          <h3 style={cardTitleStyles}>3. Secure Vault</h3>
          <p style={cardTextStyles}>
            Zero-knowledge client-side encryption (libsodium/WebCrypto) for confidential records and documents. Master Key is never transmitted to the server.
          </p>
          <span style={lockedBadgeStyles}>
            <Lock size={12} /> Gated Boundary (Phase 6)
          </span>
        </article>

        <article style={cardStyles}>
          <div style={cardHeaderRowStyles}>
            <div style={cardIconStyles}>
              <Box size={24} color="var(--accent-amber)" />
            </div>
            <img
              src={`${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/assets/avatar/avatar_coding.png`}
              alt="Coding Operative Persona"
              style={miniAvatarPreviewStyles('rgba(0, 240, 255, 0.45)')}
              title="Coding Operative Persona"
            />
          </div>
          <h3 style={cardTitleStyles}>4. 3D Avatar Identity</h3>
          <p style={cardTextStyles}>
            Single continuous avatar adapting outfits and scenes across modules. Strictly optional with zero WebGL lock-in and full reduced-motion support.
          </p>
          <span style={activeBadgeStyles}>
            <Sparkles size={12} /> Live in Lobby Above
          </span>
        </article>
      </section>
    </div>
  );
};

const lobbyContainerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '3rem',
};

const heroSectionStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: '1.5rem 1rem 0.5rem',
  gap: '1.25rem',
};

const badgeContainerStyles: React.CSSProperties = {
  display: 'inline-flex',
};

const heroBadgeStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.8rem',
  fontWeight: 700,
  letterSpacing: '0.06em',
  padding: '0.35rem 0.85rem',
  background: 'rgba(0, 240, 255, 0.08)',
  color: 'var(--accent-cyan)',
  border: '1px solid rgba(0, 240, 255, 0.25)',
  borderRadius: 'var(--radius-full)',
};

const heroTitleStyles: React.CSSProperties = {
  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
  fontWeight: 900,
  letterSpacing: '-0.03em',
  maxWidth: '800px',
};

const highlightTitleStyles: React.CSSProperties = {
  background: 'linear-gradient(135deg, var(--accent-cyan) 0%, #0080ff 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const heroSubtitleStyles: React.CSSProperties = {
  fontSize: 'clamp(1rem, 2vw, 1.25rem)',
  color: 'var(--text-secondary)',
  maxWidth: '650px',
  lineHeight: 1.6,
};

const heroCtaRowStyles: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
  justifyContent: 'center',
  marginTop: '0.5rem',
};

const primaryButtonStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.75rem 1.5rem',
  backgroundColor: 'var(--accent-cyan)',
  color: 'var(--text-inverse)',
  fontWeight: 700,
  fontSize: '0.95rem',
  borderRadius: 'var(--radius-md)',
  boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)',
  textDecoration: 'none',
  transition: 'transform var(--transition-fast)',
};

const secondaryButtonStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.75rem 1.5rem',
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-primary)',
  fontWeight: 600,
  fontSize: '0.95rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-subtle)',
  textDecoration: 'none',
};

const stageSectionStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
};

const pillarsGridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: '1.5rem',
};

const cardStyles: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-lg)',
  padding: '1.75rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.85rem',
  boxShadow: 'var(--shadow-card)',
};

const cardIconStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '44px',
  height: '44px',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid var(--border-subtle)',
};

const cardTitleStyles: React.CSSProperties = {
  fontSize: '1.15rem',
  fontWeight: 700,
};

const cardTextStyles: React.CSSProperties = {
  fontSize: '0.9rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.5,
  flex: 1,
};

const cardLinkStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.9rem',
  fontWeight: 600,
  color: 'var(--accent-cyan)',
};

const lockedBadgeStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--text-muted)',
  padding: '0.25rem 0.5rem',
  backgroundColor: 'rgba(255, 255, 255, 0.04)',
  borderRadius: 'var(--radius-sm)',
  alignSelf: 'flex-start',
};

const activeBadgeStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--accent-cyan)',
  padding: '0.25rem 0.5rem',
  backgroundColor: 'rgba(0, 240, 255, 0.1)',
  border: '1px solid rgba(0, 240, 255, 0.3)',
  borderRadius: 'var(--radius-sm)',
  alignSelf: 'flex-start',
};

const cardHeaderRowStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '0.25rem',
};

const miniAvatarPreviewStyles = (accentGlow: string): React.CSSProperties => ({
  height: '52px',
  width: '26px',
  objectFit: 'cover',
  borderRadius: '4px',
  border: `1px solid ${accentGlow}`,
  boxShadow: `0 4px 12px rgba(0, 0, 0, 0.5), 0 0 10px ${accentGlow}`,
});

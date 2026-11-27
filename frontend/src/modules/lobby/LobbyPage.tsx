import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Database,
  Download,
  ExternalLink,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  Sparkles,
  Terminal,
} from 'lucide-react';

export const LobbyPage: React.FC = () => {
  const baseUrl = useMemo(() => {
    return (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  }, []);

  const photoUrl = useMemo(() => {
    return `${baseUrl}/assets/girish_portrait.jpg`;
  }, [baseUrl]);

  return (
    <div style={pageContainerStyles}>
      {/* =====================================================================
          1. HERO SECTION (Ben Roach-Inspired Premium Software Engineer Showcase)
          ===================================================================== */}
      <section style={heroSectionStyles} aria-labelledby="hero-title">
        <div style={heroContentColStyles}>
          {/* Status Badge */}
          <div style={statusBadgeContainerStyles}>
            <span style={statusBadgeStyles}>
              <span style={statusDotStyles} />
              <span>Available for Software Engineering Roles (2027) · RVCE MCA Scholar</span>
            </span>
          </div>

          {/* Primary Typographic Headline */}
          <h1 id="hero-title" style={heroTitleStyles}>
            Welcome to <span style={highlightNameStyles}>Girish Gowda H R</span>
          </h1>

          <p style={heroMottoStyles}>
            Engineering Resilient Distributed Systems, Modern Full-Stack Architectures &amp; Intelligent Applications.
          </p>

          <p style={heroBioStyles}>
            Master of Computer Applications candidate at <strong>RV College of Engineering, Bengaluru</strong>.
            Co-author of an <strong>IEEE-published research paper</strong> on Digital Twin self-healing distributed
            systems. Grounded in core computer science fundamentals across Java, SQL, C, and full-stack development,
            with a commitment to writing clean, maintainable, and high-performance software.
          </p>

          {/* Call to Actions */}
          <div style={heroActionsRowStyles}>
            <Link to="/projects" style={primaryButtonStyles}>
              <span>Explore Featured Projects</span>
              <ArrowRight size={16} />
            </Link>

            <a
              href={`${baseUrl}/resume/Girish_Gowda_H_R_Resume.pdf`}
              download="Girish_Gowda_H_R_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={secondaryButtonStyles}
              aria-label="Download Girish Gowda H R resume PDF"
            >
              <Download size={15} />
              <span>Download Resume (PDF)</span>
            </a>
          </div>

          {/* Recruiter Quick Connect Strip */}
          <div style={quickMetaRowStyles}>
            <span style={metaItemStyles}>
              <MapPin size={14} color="var(--accent-lavender)" />
              <span>Bengaluru, Karnataka, India</span>
            </span>
            <span style={metaDividerStyles}>•</span>
            <a
              href="mailto:girishgowdahr.mca25@rvce.edu.in"
              style={metaLinkStyles}
              title="Send email to Girish Gowda H R"
            >
              <Mail size={14} color="var(--accent-lavender)" />
              <span>girishgowdahr.mca25@rvce.edu.in</span>
            </a>
            <span style={metaDividerStyles}>•</span>
            <a
              href="https://github.com/girishgowdahr"
              target="_blank"
              rel="noopener noreferrer"
              style={metaLinkStyles}
              title="View Girish Gowda H R on GitHub"
            >
              <Terminal size={14} color="var(--accent-lavender)" />
              <span>github.com/girishgowdahr</span>
            </a>
          </div>
        </div>

        {/* Hero Visual: Authentic Professional Portrait */}
        <div style={heroPortraitColStyles}>
          <div style={portraitCardWrapperStyles}>
            <div style={portraitGlowBackdropStyles} />
            <div style={portraitContainerStyles}>
              <img
                src={photoUrl}
                alt="Girish Gowda H R - Aspiring Software Engineer"
                style={portraitImageStyles}
                loading="eager"
              />
              <div style={portraitCaptionOverlayStyles}>
                <div style={portraitCaptionTextColStyles}>
                  <span style={portraitNameTagStyles}>Girish Gowda H R</span>
                  <span style={portraitRoleTagStyles}>
                    Aspiring Software Engineer · RVCE MCA '27
                  </span>
                </div>
                <div style={verifiedBadgeStyles}>
                  <CheckCircle2 size={13} color="var(--accent-lavender)" />
                  <span>Verified Profile</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. KEY IMPACT METRICS (The Proof Points)
          ===================================================================== */}
      <section style={metricsSectionStyles} aria-label="Key Engineering Metrics">
        <div style={metricCardStyles}>
          <span style={metricNumberStyles}>1</span>
          <span style={metricLabelStyles}>IEEE Research Publication</span>
          <p style={metricDescStyles}>Co-authored paper on Digital Twin self-healing distributed web architectures.</p>
        </div>

        <div style={metricCardStyles}>
          <span style={metricNumberStyles}>8.91</span>
          <span style={metricLabelStyles}>BCA Degree CGPA</span>
          <p style={metricDescStyles}>Vidyavahini First Grade College (Academic distinction in Computer Applications).</p>
        </div>

        <div style={metricCardStyles}>
          <span style={metricNumberStyles}>2027</span>
          <span style={metricLabelStyles}>Expected MCA Graduation</span>
          <p style={metricDescStyles}>RV College of Engineering, Bengaluru (Targeting University Hire SWE roles).</p>
        </div>

        <div style={metricCardStyles}>
          <span style={metricNumberStyles}>100%</span>
          <span style={metricLabelStyles}>Full SDLC Ownership</span>
          <p style={metricDescStyles}>Experience spanning requirements, architectural design, coding, testing, and deployment.</p>
        </div>
      </section>

      {/* =====================================================================
          3. FEATURED ENGINEERING PROJECTS
          ===================================================================== */}
      <section style={sectionStyles} aria-labelledby="featured-projects-title">
        <div style={sectionHeaderStyles}>
          <div style={sectionEyebrowStyles}>
            <Code2 size={16} color="var(--accent-lavender)" />
            <span>APPLIED SYSTEM DESIGN &amp; RESEARCH</span>
          </div>
          <h2 id="featured-projects-title" style={sectionTitleStyles}>
            Featured Engineering Projects
          </h2>
          <p style={sectionSubtitleStyles}>
            Real-world systems, distributed recovery frameworks, and high-performance applications built with focus on engineering rigor.
          </p>
        </div>

        <div style={projectsGridStyles}>
          {/* Project 1: Digital Twin */}
          <article style={projectCardStyles}>
            <div style={projectCardHeaderStyles}>
              <div style={projectTaglineBadgeStyles}>
                <Sparkles size={12} color="var(--accent-lavender)" />
                <span>IEEE PUBLISHED RESEARCH (2026)</span>
              </div>
              <span style={projectTypeTagStyles}>Distributed Systems</span>
            </div>

            <h3 style={projectTitleStyles}>
              Digital Twin-Enabled Self-Healing Web Application
            </h3>

            <p style={projectDescStyles}>
              Architected and developed a distributed self-healing web framework leveraging Digital Twin concepts
              to continuously monitor system telemetry and auto-recover from runtime failures without manual intervention.
            </p>

            <ul style={bulletListStyles}>
              <li style={bulletItemStyles}>
                Engineered real-time telemetry pipelines and state synchronization between the physical production service and its virtual twin model.
              </li>
              <li style={bulletItemStyles}>
                Implemented automated fault detection routines, health monitoring algorithms, and automatic service recovery flows.
              </li>
              <li style={bulletItemStyles}>
                Co-authored an IEEE-approved and published research paper (2026) validating the resilience and fault tolerance of the architecture.
              </li>
            </ul>

            <div style={techPillsRowStyles}>
              <span style={techPillStyles}>Java</span>
              <span style={techPillStyles}>Java EE Servlets</span>
              <span style={techPillStyles}>SQL</span>
              <span style={techPillStyles}>Distributed State Sync</span>
              <span style={techPillStyles}>HTML5 / CSS3</span>
            </div>

            <div style={projectCardFooterStyles}>
              <Link to="/projects" style={projectCardLinkStyles}>
                <span>View System Architecture &amp; Case Study</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </article>

          {/* Project 2: Karnataka Population Engine */}
          <article style={projectCardStyles}>
            <div style={projectCardHeaderStyles}>
              <div style={projectTaglineBadgeStyles}>
                <Terminal size={12} color="var(--accent-lavender)" />
                <span>SYSTEMS PROGRAMMING</span>
              </div>
              <span style={projectTypeTagStyles}>C / Systems</span>
            </div>

            <h3 style={projectTitleStyles}>
              Population Analysis Engine of Karnataka Districts
            </h3>

            <p style={projectDescStyles}>
              High-performance CLI data processing application built in C to ingest, validate, and compute
              statistical analytics across census demographic datasets for Karnataka districts.
            </p>

            <ul style={bulletListStyles}>
              <li style={bulletItemStyles}>
                Developed custom low-overhead file streaming and parsing algorithms for rapid record validation.
              </li>
              <li style={bulletItemStyles}>
                Implemented structured memory management, sorting mechanisms, and formatted tabular terminal output.
              </li>
              <li style={bulletItemStyles}>
                Enforced rigorous error handling, input verification, and memory safety practices.
              </li>
            </ul>

            <div style={techPillsRowStyles}>
              <span style={techPillStyles}>C</span>
              <span style={techPillStyles}>File Handling</span>
              <span style={techPillStyles}>Memory Management</span>
              <span style={techPillStyles}>CLI Architecture</span>
              <span style={techPillStyles}>Data Structures</span>
            </div>

            <div style={projectCardFooterStyles}>
              <Link to="/projects" style={projectCardLinkStyles}>
                <span>View Technical Details</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* =====================================================================
          4. TECHNICAL COMPETENCIES (Categorized Skills Matrix)
          ===================================================================== */}
      <section style={sectionStyles} aria-labelledby="skills-matrix-title">
        <div style={sectionHeaderStyles}>
          <div style={sectionEyebrowStyles}>
            <Layers size={16} color="var(--accent-lavender)" />
            <span>CORE COMPETENCIES</span>
          </div>
          <h2 id="skills-matrix-title" style={sectionTitleStyles}>
            Technical Skills &amp; Engineering Disciplines
          </h2>
          <p style={sectionSubtitleStyles}>
            Strong foundational computer science concepts paired with hands-on full-stack implementation capabilities.
          </p>
        </div>

        <div style={skillsGridStyles}>
          <div style={skillCardStyles}>
            <div style={skillCardHeaderStyles}>
              <Code2 size={20} color="var(--accent-lavender)" />
              <h3 style={skillGroupTitleStyles}>Programming Languages</h3>
            </div>
            <div style={skillListStyles}>
              <span style={skillPillStyles}>Java (OOP, Collections, Exceptions, File I/O)</span>
              <span style={skillPillStyles}>Python</span>
              <span style={skillPillStyles}>C (Pointers, Memory, CLI)</span>
              <span style={skillPillStyles}>SQL</span>
            </div>
          </div>

          <div style={skillCardStyles}>
            <div style={skillCardHeaderStyles}>
              <Layers size={20} color="var(--accent-lavender)" />
              <h3 style={skillGroupTitleStyles}>Web &amp; Full-Stack</h3>
            </div>
            <div style={skillListStyles}>
              <span style={skillPillStyles}>React 19 &amp; TypeScript</span>
              <span style={skillPillStyles}>Java Servlets (Java EE)</span>
              <span style={skillPillStyles}>HTML5 &amp; CSS3</span>
              <span style={skillPillStyles}>RESTful API Design</span>
              <span style={skillPillStyles}>Reusable Component Architecture</span>
            </div>
          </div>

          <div style={skillCardStyles}>
            <div style={skillCardHeaderStyles}>
              <Database size={20} color="var(--accent-lavender)" />
              <h3 style={skillGroupTitleStyles}>Databases &amp; Systems</h3>
            </div>
            <div style={skillListStyles}>
              <span style={skillPillStyles}>SQL (DDL, DML, DQL, DCL, TCL)</span>
              <span style={skillPillStyles}>Sub-queries &amp; Complex Joins</span>
              <span style={skillPillStyles}>Schema Normalization</span>
              <span style={skillPillStyles}>Data Structures &amp; Algorithms</span>
              <span style={skillPillStyles}>Distributed Systems Fundamentals</span>
            </div>
          </div>

          <div style={skillCardStyles}>
            <div style={skillCardHeaderStyles}>
              <Terminal size={20} color="var(--accent-lavender)" />
              <h3 style={skillGroupTitleStyles}>Tools, Practices &amp; AI</h3>
            </div>
            <div style={skillListStyles}>
              <span style={skillPillStyles}>Git &amp; GitHub Version Control</span>
              <span style={skillPillStyles}>Agile / Scrum Collaboration</span>
              <span style={skillPillStyles}>Software Development Lifecycle (SDLC)</span>
              <span style={skillPillStyles}>Machine Learning (scikit-learn)</span>
              <span style={skillPillStyles}>Computer Vision Fundamentals</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. ACADEMIC & RESEARCH FOUNDATION
          ===================================================================== */}
      <section style={sectionStyles} aria-labelledby="academic-foundation-title">
        <div style={sectionHeaderStyles}>
          <div style={sectionEyebrowStyles}>
            <GraduationCap size={16} color="var(--accent-lavender)" />
            <span>ACADEMIC MERIT &amp; RESEARCH</span>
          </div>
          <h2 id="academic-foundation-title" style={sectionTitleStyles}>
            Education &amp; Research Credentials
          </h2>
        </div>

        <div style={timelineGridStyles}>
          {/* RVCE */}
          <div style={timelineCardStyles}>
            <div style={timelineHeaderStyles}>
              <span style={timelineYearBadgeStyles}>2025 – 2027 (Expected)</span>
              <span style={timelineStatusTagStyles}>In Progress</span>
            </div>
            <h3 style={timelineDegreeStyles}>Master of Computer Applications (MCA)</h3>
            <p style={timelineInstitutionStyles}>RV College of Engineering, Bengaluru</p>
            <p style={timelineDescStyles}>
              Advanced coursework in Distributed Systems, System Design, Advanced Algorithms, and Cloud Computing.
            </p>
          </div>

          {/* Vidyavahini */}
          <div style={timelineCardStyles}>
            <div style={timelineHeaderStyles}>
              <span style={timelineYearBadgeStyles}>2021 – 2024</span>
              <span style={timelineDistinctionTagStyles}>CGPA 8.91 / 10.0</span>
            </div>
            <h3 style={timelineDegreeStyles}>Bachelor of Computer Applications (BCA)</h3>
            <p style={timelineInstitutionStyles}>Vidyavahini First Grade College, Tumkur</p>
            <p style={timelineDescStyles}>
              Graduated with Academic Distinction. Coursework in Data Structures, Java, C, Database Management Systems, and Software Engineering.
            </p>
          </div>

          {/* IEEE Publication */}
          <div style={timelineCardStyles}>
            <div style={timelineHeaderStyles}>
              <span style={timelineYearBadgeStyles}>IEEE Published · 2026</span>
              <span style={timelinePublicationTagStyles}>Research Co-Author</span>
            </div>
            <h3 style={timelineDegreeStyles}>Digital Twin-Enabled Self-Healing Web Application</h3>
            <p style={timelineInstitutionStyles}>Institute of Electrical and Electronics Engineers (IEEE)</p>
            <p style={timelineDescStyles}>
              Published research proposing an AI-augmented telemetry and self-healing architecture for distributed web systems.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. RECRUITER CONTACT BANNER
          ===================================================================== */}
      <section style={contactBannerStyles} aria-label="Recruiter Contact Card">
        <div style={contactContentStyles}>
          <h2 style={contactTitleStyles}>Looking for an ambitious, fundamentals-focused Software Engineer?</h2>
          <p style={contactSubtitleStyles}>
            I am actively seeking University Hire Software Engineer roles starting in 2027. Open to discussing internships,
            graduate programs, and full-time engineering opportunities at Google, Amazon, Cisco, NetApp, Samsung R&amp;D, and leading tech companies.
          </p>
          <div style={contactActionsRowStyles}>
            <a
              href="mailto:girishgowdahr.mca25@rvce.edu.in"
              style={primaryButtonStyles}
            >
              <Mail size={16} />
              <span>Connect via Email</span>
            </a>
            <a
              href={`${baseUrl}/resume/Girish_Gowda_H_R_Resume.pdf`}
              download="Girish_Gowda_H_R_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={secondaryButtonStyles}
            >
              <Download size={15} />
              <span>Download Official Resume</span>
            </a>
            <a
              href="https://github.com/girishgowdahr"
              target="_blank"
              rel="noopener noreferrer"
              style={secondaryButtonStyles}
            >
              <ExternalLink size={15} />
              <span>View GitHub Repositories</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

// =============================================================================
// MIDNIGHT NAVY & BEN ROACH STYLING SYSTEM
// =============================================================================

const pageContainerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4.5rem',
  width: '100%',
};

const heroSectionStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '3rem',
  alignItems: 'center',
  padding: '1rem 0 2rem',
};

const heroContentColStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
};

const statusBadgeContainerStyles: React.CSSProperties = {
  display: 'inline-flex',
};

const statusBadgeStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.4rem 0.85rem',
  fontSize: '0.8rem',
  fontWeight: 600,
  letterSpacing: '0.03em',
  color: 'var(--accent-lavender)',
  backgroundColor: 'var(--accent-lavender-dim)',
  border: '1px solid rgba(165, 180, 252, 0.28)',
  borderRadius: 'var(--radius-full)',
};

const statusDotStyles: React.CSSProperties = {
  width: '7px',
  height: '7px',
  borderRadius: '50%',
  backgroundColor: 'var(--accent-emerald)',
  boxShadow: '0 0 8px rgba(16, 185, 129, 0.7)',
};

const heroTitleStyles: React.CSSProperties = {
  fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
  fontWeight: 800,
  lineHeight: 1.15,
  letterSpacing: '-0.025em',
  color: 'var(--text-primary)',
};

const highlightNameStyles: React.CSSProperties = {
  color: 'var(--accent-lavender)',
  display: 'inline-block',
};

const heroMottoStyles: React.CSSProperties = {
  fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
  fontWeight: 600,
  lineHeight: 1.4,
  color: 'var(--text-primary)',
};

const heroBioStyles: React.CSSProperties = {
  fontSize: '1rem',
  lineHeight: 1.7,
  color: 'var(--text-secondary)',
  maxWidth: '640px',
};

const heroActionsRowStyles: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
  alignItems: 'center',
  marginTop: '0.5rem',
};

const primaryButtonStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.75rem 1.4rem',
  fontSize: '0.9rem',
  fontWeight: 600,
  color: '#020617',
  backgroundColor: 'var(--accent-lavender)',
  border: '1px solid var(--accent-lavender)',
  borderRadius: 'var(--radius-sm)',
  textDecoration: 'none',
  transition: 'transform var(--transition-fast), background-color var(--transition-fast), box-shadow var(--transition-fast)',
  boxShadow: '0 4px 14px rgba(165, 180, 252, 0.25)',
  cursor: 'pointer',
};

const secondaryButtonStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.75rem 1.4rem',
  fontSize: '0.9rem',
  fontWeight: 600,
  color: 'var(--text-primary)',
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-sm)',
  textDecoration: 'none',
  transition: 'all var(--transition-fast)',
  cursor: 'pointer',
};

const quickMetaRowStyles: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '0.75rem',
  marginTop: '0.75rem',
  fontSize: '0.825rem',
  color: 'var(--text-muted)',
};

const metaItemStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
};

const metaLinkStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  transition: 'color var(--transition-fast)',
};

const metaDividerStyles: React.CSSProperties = {
  color: 'var(--border-subtle)',
};

/* Portrait Visual */
const heroPortraitColStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const portraitCardWrapperStyles: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  maxWidth: '400px',
};

const portraitGlowBackdropStyles: React.CSSProperties = {
  position: 'absolute',
  inset: '-8px',
  background: 'radial-gradient(circle at 50% 50%, rgba(165, 180, 252, 0.15) 0%, transparent 70%)',
  borderRadius: 'var(--radius-xl)',
  filter: 'blur(20px)',
  zIndex: 0,
};

const portraitContainerStyles: React.CSSProperties = {
  position: 'relative',
  zIndex: 1,
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-lg)',
  overflow: 'hidden',
  boxShadow: 'var(--shadow-card)',
};

const portraitImageStyles: React.CSSProperties = {
  width: '100%',
  height: '440px',
  objectFit: 'cover',
  objectPosition: 'center 15%',
  display: 'block',
  backgroundColor: '#0B1120',
};

const portraitCaptionOverlayStyles: React.CSSProperties = {
  padding: '1rem 1.25rem',
  backgroundColor: 'var(--bg-secondary)',
  borderTop: '1px solid var(--border-subtle)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.75rem',
};

const portraitCaptionTextColStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

const portraitNameTagStyles: React.CSSProperties = {
  fontSize: '0.9rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
};

const portraitRoleTagStyles: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 500,
  color: 'var(--accent-lavender)',
};

const verifiedBadgeStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.72rem',
  fontWeight: 600,
  color: 'var(--accent-lavender)',
  backgroundColor: 'var(--accent-lavender-dim)',
  padding: '0.25rem 0.6rem',
  borderRadius: 'var(--radius-full)',
  border: '1px solid rgba(165, 180, 252, 0.25)',
};

/* Metrics Section */
const metricsSectionStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '1.25rem',
};

const metricCardStyles: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-md)',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
  transition: 'border-color var(--transition-fast), transform var(--transition-fast)',
};

const metricNumberStyles: React.CSSProperties = {
  fontSize: '2.25rem',
  fontWeight: 800,
  letterSpacing: '-0.025em',
  color: 'var(--accent-lavender)',
  lineHeight: 1.1,
};

const metricLabelStyles: React.CSSProperties = {
  fontSize: '0.95rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
};

const metricDescStyles: React.CSSProperties = {
  fontSize: '0.8rem',
  lineHeight: 1.5,
  color: 'var(--text-secondary)',
  marginTop: '0.25rem',
};

/* Section Common */
const sectionStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
};

const sectionHeaderStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const sectionEyebrowStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  color: 'var(--accent-lavender)',
  textTransform: 'uppercase',
};

const sectionTitleStyles: React.CSSProperties = {
  fontSize: 'clamp(1.5rem, 2.8vw, 2rem)',
  fontWeight: 800,
  letterSpacing: '-0.02em',
  color: 'var(--text-primary)',
};

const sectionSubtitleStyles: React.CSSProperties = {
  fontSize: '0.95rem',
  lineHeight: 1.6,
  color: 'var(--text-secondary)',
  maxWidth: '700px',
};

/* Projects Grid */
const projectsGridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
  gap: '1.5rem',
};

const projectCardStyles: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-lg)',
  padding: '1.75rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  transition: 'border-color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast)',
};

const projectCardHeaderStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.75rem',
};

const projectTaglineBadgeStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.06em',
  color: 'var(--accent-lavender)',
  backgroundColor: 'var(--accent-lavender-dim)',
  padding: '0.25rem 0.55rem',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid rgba(165, 180, 252, 0.25)',
};

const projectTypeTagStyles: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  fontWeight: 500,
};

const projectTitleStyles: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
  lineHeight: 1.35,
};

const projectDescStyles: React.CSSProperties = {
  fontSize: '0.9rem',
  lineHeight: 1.6,
  color: 'var(--text-secondary)',
};

const bulletListStyles: React.CSSProperties = {
  paddingLeft: '1.2rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.45rem',
  margin: '0.25rem 0',
};

const bulletItemStyles: React.CSSProperties = {
  fontSize: '0.85rem',
  lineHeight: 1.55,
  color: 'var(--text-secondary)',
};

const techPillsRowStyles: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.4rem',
  marginTop: 'auto',
  paddingTop: '0.5rem',
};

const techPillStyles: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--text-primary)',
  backgroundColor: 'var(--bg-secondary)',
  border: '1px solid var(--border-subtle)',
  padding: '0.25rem 0.6rem',
  borderRadius: 'var(--radius-sm)',
};

const projectCardFooterStyles: React.CSSProperties = {
  paddingTop: '0.75rem',
  borderTop: '1px solid var(--border-subtle)',
};

const projectCardLinkStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  fontSize: '0.85rem',
  fontWeight: 600,
  color: 'var(--accent-lavender)',
  textDecoration: 'none',
};

/* Skills Grid */
const skillsGridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: '1.25rem',
};

const skillCardStyles: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-md)',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const skillCardHeaderStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
};

const skillGroupTitleStyles: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
};

const skillListStyles: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.4rem',
};

const skillPillStyles: React.CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--text-secondary)',
  backgroundColor: 'var(--bg-secondary)',
  border: '1px solid var(--border-subtle)',
  padding: '0.3rem 0.65rem',
  borderRadius: 'var(--radius-sm)',
};

/* Timeline Grid */
const timelineGridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '1.25rem',
};

const timelineCardStyles: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-md)',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const timelineHeaderStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.5rem',
  marginBottom: '0.25rem',
};

const timelineYearBadgeStyles: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: 'var(--accent-lavender)',
};

const timelineStatusTagStyles: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 600,
  color: 'var(--accent-emerald)',
  backgroundColor: 'rgba(16, 185, 129, 0.1)',
  padding: '0.15rem 0.45rem',
  borderRadius: 'var(--radius-xs)',
  border: '1px solid rgba(16, 185, 129, 0.25)',
};

const timelineDistinctionTagStyles: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 600,
  color: 'var(--accent-blue)',
  backgroundColor: 'var(--accent-blue-dim)',
  padding: '0.15rem 0.45rem',
  borderRadius: 'var(--radius-xs)',
  border: '1px solid rgba(56, 189, 248, 0.25)',
};

const timelinePublicationTagStyles: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 600,
  color: 'var(--accent-orange)',
  backgroundColor: 'var(--accent-orange-dim)',
  padding: '0.15rem 0.45rem',
  borderRadius: 'var(--radius-xs)',
  border: '1px solid rgba(249, 115, 22, 0.25)',
};

const timelineDegreeStyles: React.CSSProperties = {
  fontSize: '1.05rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
};

const timelineInstitutionStyles: React.CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'var(--text-secondary)',
};

const timelineDescStyles: React.CSSProperties = {
  fontSize: '0.825rem',
  lineHeight: 1.55,
  color: 'var(--text-muted)',
  marginTop: '0.25rem',
};

/* Contact Card Banner */
const contactBannerStyles: React.CSSProperties = {
  backgroundColor: 'var(--bg-secondary)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-xl)',
  padding: 'clamp(2rem, 4vw, 3.5rem)',
  boxShadow: 'var(--shadow-card)',
};

const contactContentStyles: React.CSSProperties = {
  maxWidth: '780px',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const contactTitleStyles: React.CSSProperties = {
  fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
  fontWeight: 800,
  color: 'var(--text-primary)',
  lineHeight: 1.25,
};

const contactSubtitleStyles: React.CSSProperties = {
  fontSize: '0.95rem',
  lineHeight: 1.65,
  color: 'var(--text-secondary)',
};

const contactActionsRowStyles: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.75rem',
  marginTop: '0.75rem',
  alignItems: 'center',
};

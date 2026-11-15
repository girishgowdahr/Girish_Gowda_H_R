import React, { useEffect, useState } from 'react';
import { User, Terminal, Mail, MapPin, Download, Award, ExternalLink, ShieldCheck, BookOpen } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../../design-system/components/SocialIcons';
import { getPortfolioSummary } from '../../core/api/portfolioApi';
import { PublicProfile, PublicCertificate, PublicPublication } from '../../core/api/types';

export const AboutPage: React.FC = () => {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [certificates, setCertificates] = useState<PublicCertificate[]>([]);
  const [publications, setPublications] = useState<PublicPublication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getPortfolioSummary()
      .then((data) => {
        if (mounted) {
          setProfile(data.profile);
          setCertificates(data.certificates || []);
          setPublications(data.publications || []);
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
          <div className="spinner" />
          <p>Loading operator profile...</p>
        </div>
      </div>
    );
  }

  const name = profile?.fullName || 'Girish Gowda H R';
  const headline = profile?.headline || 'Software Engineer | Java, SQL & Full-Stack Development';
  const bio = profile?.bio || 'MCA student at RV College of Engineering with a strong foundation in Java, SQL, and web development.';
  const email = profile?.email;
  const location = profile?.location || 'Bengaluru, Karnataka';
  const github = profile?.githubUrl;
  const linkedin = profile?.linkedinUrl;

  return (
    <div style={containerStyles}>
      <header style={headerStyles}>
        <div style={taglineBadgeStyles}>
          <User size={14} color="var(--accent-cyan)" />
          <span>OPERATOR BIOGRAPHY</span>
        </div>
        <h1 style={titleStyles}>About Me</h1>
        <p style={subtitleStyles}>{headline}</p>
      </header>

      <div style={gridStyles}>
        {/* Full-Body Professional Standing Portrait */}
        <aside style={portraitCardStyles} aria-label="Official Executive Portrait">
          <div style={portraitWrapperStyles}>
            <img
              src={`${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/assets/avatar/avatar_professional.png`}
              alt="Girish Gowda H R - Executive Professional Portrait"
              style={portraitImageStyles}
            />
          </div>
          <div style={portraitMetaStyles}>
            <div style={portraitTagStyles}>
              <Award size={14} color="#f59e0b" />
              <span>EXECUTIVE VANGUARD</span>
            </div>
            <p style={portraitCaptionStyles}>Girish Gowda H R · Full-Body Standing Identity</p>
          </div>
        </aside>

        <section style={cardStyles} aria-labelledby="bio-heading">
          <h2 id="bio-heading" style={sectionTitleStyles}>
            <Terminal size={18} color="var(--accent-cyan)" />
            <span>Profile Overview</span>
          </h2>

          <p style={paragraphStyles}>{bio}</p>

          <p style={paragraphStyles}>
            Comfortable working in agile, collaborative team environments and building reusable software components. Seeking a University Hire Software Engineer role to deliver innovative digital solutions and grow within a global engineering team.
          </p>

          <div style={actionRowStyles}>
            <a
              href="/api/v1/public/portfolio/resume"
              download="Girish_Gowda_H_R_Resume.md"
              style={primaryButtonStyles}
              aria-label="Download Girish Gowda H R resume document"
            >
              <Download size={16} />
              <span>Download Resume</span>
            </a>

            {email && (
              <a
                href={`mailto:${email}`}
                style={secondaryButtonStyles}
                aria-label={`Send email to ${email}`}
              >
                <Mail size={16} />
                <span>Contact Directly</span>
              </a>
            )}
          </div>
        </section>

        <aside style={cardStyles} aria-labelledby="info-heading">
          <h2 id="info-heading" style={sectionTitleStyles}>
            <ShieldCheck size={18} color="var(--accent-cyan)" />
            <span>Identity & Channels</span>
          </h2>
          <ul style={infoListStyles}>
            <li style={infoItemStyles}>
              <span style={infoLabelStyles}>Full Name</span>
              <span style={infoValueStyles}>{name}</span>
            </li>
            {location && (
              <li style={infoItemStyles}>
                <span style={infoLabelStyles}>Location</span>
                <span style={infoValueStyles}>
                  <MapPin size={14} color="var(--accent-cyan)" />
                  {location}
                </span>
              </li>
            )}
            {email && (
              <li style={infoItemStyles}>
                <span style={infoLabelStyles}>Primary Email</span>
                <span style={infoValueStyles}>
                  <a href={`mailto:${email}`} style={contactLinkStyles}>
                    <Mail size={14} />
                    {email}
                  </a>
                </span>
              </li>
            )}
            {github && (
              <li style={infoItemStyles}>
                <span style={infoLabelStyles}>GitHub</span>
                <span style={infoValueStyles}>
                  <a href={github} target="_blank" rel="noopener noreferrer" style={contactLinkStyles}>
                    <GithubIcon size={14} />
                    girishgowdahr
                    <ExternalLink size={12} />
                  </a>
                </span>
              </li>
            )}
            {linkedin && (
              <li style={infoItemStyles}>
                <span style={infoLabelStyles}>LinkedIn</span>
                <span style={infoValueStyles}>
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" style={contactLinkStyles}>
                    <LinkedinIcon size={14} />
                    girishgowdahr
                    <ExternalLink size={12} />
                  </a>
                </span>
              </li>
            )}
          </ul>
        </aside>
      </div>

      {/* Publications Section */}
      {publications.length > 0 && (
        <section style={cardStyles} aria-labelledby="pubs-heading">
          <h2 id="pubs-heading" style={sectionTitleStyles}>
            <BookOpen size={18} color="var(--accent-cyan)" />
            <span>Research &amp; Publications</span>
          </h2>
          <div style={certGridStyles}>
            {publications.map((pub, index) => (
              <div key={index} style={certCardStyles}>
                <div style={certHeaderStyles}>
                  <h3 style={certTitleStyles}>{pub.title}</h3>
                  <span style={certDateBadgeStyles}>{pub.publisher} ({pub.year})</span>
                </div>
                {pub.role && <p style={certOrgStyles}>{pub.role} • {pub.state}</p>}
                {pub.abstractSummary && <p style={paragraphStyles}>{pub.abstractSummary}</p>}
                {pub.doi && (
                  <p style={certIdStyles}>
                    DOI: <code>{pub.doi}</code>
                  </p>
                )}
                {pub.url && (
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={certLinkStyles}
                  >
                    <span>View Publication</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications Section */}
      {certificates.length > 0 && (
        <section style={cardStyles} aria-labelledby="certs-heading">
          <h2 id="certs-heading" style={sectionTitleStyles}>
            <Award size={18} color="var(--accent-cyan)" />
            <span>Verified Certifications</span>
          </h2>
          <div style={certGridStyles}>
            {certificates.map((cert, index) => (
              <div key={index} style={certCardStyles}>
                <div style={certHeaderStyles}>
                  <h3 style={certTitleStyles}>{cert.name}</h3>
                  {cert.issueDate && <span style={certDateBadgeStyles}>Issued {cert.issueDate}</span>}
                </div>
                <p style={certOrgStyles}>{cert.issuingOrganization}</p>
                {cert.description && <p style={paragraphStyles}>{cert.description}</p>}
                {cert.credentialId && (
                  <p style={certIdStyles}>
                    Credential ID: <code>{cert.credentialId}</code>
                  </p>
                )}
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={certLinkStyles}
                  >
                    <span>Verify Credential</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const containerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2.5rem',
};

const loadingStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4rem 1rem',
  gap: '1rem',
  color: 'var(--text-muted)',
};

const headerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
};

const taglineBadgeStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  color: 'var(--accent-cyan)',
  backgroundColor: 'rgba(0, 240, 255, 0.08)',
  padding: '0.35rem 0.75rem',
  borderRadius: '4px',
  border: '1px solid rgba(0, 240, 255, 0.25)',
  alignSelf: 'flex-start',
};

const titleStyles: React.CSSProperties = {
  fontSize: '2.5rem',
  fontWeight: 800,
  letterSpacing: '-0.02em',
  color: 'var(--text-primary)',
};

const subtitleStyles: React.CSSProperties = {
  fontSize: '1.15rem',
  color: 'var(--text-muted)',
  maxWidth: '750px',
  lineHeight: 1.5,
};

const gridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '1.75rem',
};

const cardStyles: React.CSSProperties = {
  backgroundColor: 'var(--bg-surface)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '8px',
  padding: '1.75rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
};

const sectionTitleStyles: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: '0.65rem',
  color: 'var(--text-primary)',
  borderBottom: '1px solid var(--border-subtle)',
  paddingBottom: '0.75rem',
};

const paragraphStyles: React.CSSProperties = {
  fontSize: '0.95rem',
  lineHeight: 1.65,
  color: 'var(--text-secondary)',
};

const actionRowStyles: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
  marginTop: '0.5rem',
};

const primaryButtonStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.65rem 1.25rem',
  backgroundColor: 'var(--accent-cyan)',
  color: '#030712',
  fontWeight: 700,
  fontSize: '0.9rem',
  borderRadius: '6px',
  textDecoration: 'none',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
};

const secondaryButtonStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.65rem 1.25rem',
  backgroundColor: 'transparent',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)',
  fontWeight: 600,
  fontSize: '0.9rem',
  borderRadius: '6px',
  textDecoration: 'none',
};

const infoListStyles: React.CSSProperties = {
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: 0,
  margin: 0,
};

const infoItemStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
};

const infoLabelStyles: React.CSSProperties = {
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--text-muted)',
  fontWeight: 600,
};

const infoValueStyles: React.CSSProperties = {
  fontSize: '0.95rem',
  fontWeight: 600,
  color: 'var(--text-primary)',
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
};

const contactLinkStyles: React.CSSProperties = {
  color: 'var(--accent-cyan)',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
};

const certGridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1.25rem',
};

const certCardStyles: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '6px',
  padding: '1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const certHeaderStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '0.5rem',
};

const certTitleStyles: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
};

const certDateBadgeStyles: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--accent-cyan)',
  backgroundColor: 'rgba(0, 240, 255, 0.08)',
  padding: '0.2rem 0.5rem',
  borderRadius: '4px',
  border: '1px solid rgba(0, 240, 255, 0.2)',
  whiteSpace: 'nowrap',
};

const certOrgStyles: React.CSSProperties = {
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
};

const certIdStyles: React.CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
  fontFamily: 'monospace',
};

const certLinkStyles: React.CSSProperties = {
  fontSize: '0.85rem',
  color: 'var(--accent-cyan)',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  marginTop: '0.25rem',
};

const portraitCardStyles: React.CSSProperties = {
  backgroundColor: 'var(--bg-surface)',
  border: '1px solid rgba(245, 158, 11, 0.3)',
  borderRadius: '8px',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.05) 0%, rgba(13, 17, 26, 0.85) 100%)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 24px rgba(245, 158, 11, 0.12)',
};

const portraitWrapperStyles: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '0.25rem 0',
};

const portraitImageStyles: React.CSSProperties = {
  maxHeight: '460px',
  width: 'auto',
  maxWidth: '100%',
  objectFit: 'contain',
  borderRadius: '6px',
  filter: 'drop-shadow(0 14px 28px rgba(0, 0, 0, 0.8))',
};

const portraitMetaStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.35rem',
  textAlign: 'center',
};

const portraitTagStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  fontSize: '0.75rem',
  fontWeight: 800,
  letterSpacing: '0.08em',
  color: '#f59e0b',
  backgroundColor: 'rgba(245, 158, 11, 0.1)',
  padding: '0.3rem 0.75rem',
  borderRadius: '4px',
  border: '1px solid rgba(245, 158, 11, 0.3)',
};

const portraitCaptionStyles: React.CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--text-secondary)',
  margin: 0,
};

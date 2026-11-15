import React, { useEffect, useState } from 'react';
import { User, Terminal, Mail, MapPin, Download, Award, ExternalLink, ShieldCheck } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../../design-system/components/SocialIcons';
import { getPortfolioSummary } from '../../core/api/portfolioApi';
import { PublicProfile, PublicCertificate } from '../../core/api/types';

export const AboutPage: React.FC = () => {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [certificates, setCertificates] = useState<PublicCertificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getPortfolioSummary()
      .then((data) => {
        if (mounted) {
          setProfile(data.profile);
          setCertificates(data.certificates);
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
  const headline = profile?.headline || 'Full-Stack Software Engineer & Distributed Systems Developer';
  const bio = profile?.bio || 'Passionate engineer specializing in modern enterprise architectures, cloud platforms, robust Spring Boot services, interactive React/Three.js interfaces, and secure zero-knowledge systems.';
  const email = profile?.email || 'girishgowda0428@gmail.com';
  const location = profile?.location || 'Bengaluru, India';
  const github = profile?.githubUrl || 'https://github.com/girishgowdahr';
  const linkedin = profile?.linkedinUrl || 'https://linkedin.com/in/girishgowdahr';

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
        <section style={cardStyles} aria-labelledby="bio-heading">
          <h2 id="bio-heading" style={sectionTitleStyles}>
            <Terminal size={18} color="var(--accent-cyan)" />
            <span>Profile Overview</span>
          </h2>

          <p style={paragraphStyles}>{bio}</p>

          <p style={paragraphStyles}>
            My engineering philosophy focuses on strict modular architecture, verifiable security boundaries, high-concurrency microservices, and immersive 3D web applications. I design software that is observable, fault-tolerant, and accessible across devices.
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

            <a
              href={`mailto:${email}`}
              style={secondaryButtonStyles}
              aria-label={`Send email to ${email}`}
            >
              <Mail size={16} />
              <span>Contact Directly</span>
            </a>
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
            <li style={infoItemStyles}>
              <span style={infoLabelStyles}>Location</span>
              <span style={infoValueStyles}>
                <MapPin size={14} color="var(--accent-cyan)" />
                {location}
              </span>
            </li>
            <li style={infoItemStyles}>
              <span style={infoLabelStyles}>Primary Email</span>
              <span style={infoValueStyles}>
                <a href={`mailto:${email}`} style={contactLinkStyles}>
                  <Mail size={14} />
                  {email}
                </a>
              </span>
            </li>
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
          </ul>
        </aside>
      </div>

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
                  <span style={certDateBadgeStyles}>Issued {cert.issueDate}</span>
                </div>
                <p style={certOrgStyles}>{cert.issuingOrganization}</p>
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

const gridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
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

const sectionTitleStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '1.2rem',
  fontWeight: 700,
  borderBottom: '1px solid var(--border-subtle)',
  paddingBottom: '0.75rem',
};

const paragraphStyles: React.CSSProperties = {
  fontSize: '0.95rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.7,
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
  backgroundColor: 'var(--accent-cyan)',
  color: '#0a0f1d',
  padding: '0.75rem 1.25rem',
  borderRadius: 'var(--radius-md)',
  fontWeight: 700,
  fontSize: '0.9rem',
  textDecoration: 'none',
  transition: 'transform 0.15s ease',
};

const secondaryButtonStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)',
  padding: '0.75rem 1.25rem',
  borderRadius: 'var(--radius-md)',
  fontWeight: 600,
  fontSize: '0.9rem',
  textDecoration: 'none',
};

const infoListStyles: React.CSSProperties = {
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const infoItemStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  paddingBottom: '0.75rem',
  fontSize: '0.9rem',
};

const infoLabelStyles: React.CSSProperties = {
  color: 'var(--text-muted)',
  fontWeight: 500,
};

const infoValueStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  color: 'var(--text-primary)',
  fontWeight: 600,
};

const contactLinkStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  color: 'var(--accent-cyan)',
  textDecoration: 'none',
};

const certGridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1rem',
};

const certCardStyles: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-md)',
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
  backgroundColor: 'rgba(0, 255, 204, 0.1)',
  padding: '0.2rem 0.5rem',
  borderRadius: 'var(--radius-sm)',
  whiteSpace: 'nowrap',
};

const certOrgStyles: React.CSSProperties = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
};

const certIdStyles: React.CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
};

const certLinkStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.3rem',
  fontSize: '0.85rem',
  color: 'var(--accent-cyan)',
  textDecoration: 'none',
  marginTop: '0.25rem',
};

const loadingStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4rem 1rem',
  color: 'var(--text-muted)',
  gap: '1rem',
};

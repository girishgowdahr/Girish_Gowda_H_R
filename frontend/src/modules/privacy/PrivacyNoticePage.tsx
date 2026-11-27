import React from 'react';
import { ShieldCheck, Lock, EyeOff, FileText, CheckCircle } from 'lucide-react';

export const PrivacyNoticePage: React.FC = () => {
  return (
    <div style={containerStyles}>
      <header style={headerStyles}>
        <div style={taglineBadgeStyles}>
          <ShieldCheck size={14} color="var(--accent-primary)" />
          <span>ZERO-KNOWLEDGE COMMITMENT</span>
        </div>
        <h1 style={titleStyles}>Privacy Notice &amp; Principles</h1>
        <p style={subtitleStyles}>
          Transparent declaration of data handling practices for the GIRISH platform.
        </p>
      </header>

      <div style={contentGridStyles}>
        <section style={cardStyles} aria-labelledby="public-browsing">
          <h2 id="public-browsing" style={sectionTitleStyles}>
            <EyeOff size={18} color="var(--accent-primary)" />
            <span>Public Portfolio Browsing</span>
          </h2>
          <ul style={principleListStyles}>
            <li style={principleItemStyles}>
              <CheckCircle size={16} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
              <div>
                <strong>Zero Commercial Trackers:</strong> No Google Analytics, Meta Pixel, tracking pixels, or third-party advertising SDKs are loaded.
              </div>
            </li>
            <li style={principleItemStyles}>
              <CheckCircle size={16} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
              <div>
                <strong>No Cookie Banners Needed:</strong> Public browsing requires no cookies. Sessions are only established for authorized administrative operations.
              </div>
            </li>
            <li style={principleItemStyles}>
              <CheckCircle size={16} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
              <div>
                <strong>Strict Content Security Policy:</strong> All resources execute under strict CSP restricting script execution solely to trusted origin bundles.
              </div>
            </li>
          </ul>
        </section>

        <section style={cardStyles} aria-labelledby="zero-knowledge">
          <h2 id="zero-knowledge" style={sectionTitleStyles}>
            <Lock size={18} color="var(--accent-primary)" />
            <span>Encrypted Vault Security</span>
          </h2>
          <p style={paragraphStyles}>
            The personal vault is engineered with true end-to-end client-side encryption using <strong>XChaCha20-Poly1305</strong> and <strong>Argon2id</strong>. Decryption keys are derived exclusively inside the browser and never leave memory to touch the backend server.
          </p>
          <div style={infoBoxStyles}>
            <strong>Owner Sovereign Guarantee:</strong> Even if the backend database were intercepted, ciphertext remains mathematically unreadable without the owner Master Key.
          </div>
        </section>

        <section style={cardStyles} aria-labelledby="contact-inquiries">
          <h2 id="contact-inquiries" style={sectionTitleStyles}>
            <FileText size={18} color="var(--accent-primary)" />
            <span>Contact &amp; Inquiries</span>
          </h2>
          <p style={paragraphStyles}>
            For questions regarding privacy, security vulnerability reports, or architectural inquiries, contact Girish directly at:
          </p>
          <p style={emailBadgeStyles}>
            <a href="mailto:girishgowda0428@gmail.com" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
              girishgowda0428@gmail.com
            </a>
          </p>
        </section>
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

const contentGridStyles: React.CSSProperties = {
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

const sectionTitleStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '1.2rem',
  fontWeight: 700,
  borderBottom: '1px solid var(--border-subtle)',
  paddingBottom: '0.75rem',
  color: 'var(--text-primary)',
};

const principleListStyles: React.CSSProperties = {
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: 0,
  margin: 0,
};

const principleItemStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.75rem',
  fontSize: '0.95rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
};

const paragraphStyles: React.CSSProperties = {
  fontSize: '0.95rem',
  lineHeight: 1.6,
  color: 'var(--text-secondary)',
};

const infoBoxStyles: React.CSSProperties = {
  backgroundColor: 'var(--bg-card-subtle)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '8px',
  padding: '1rem',
  fontSize: '0.9rem',
  color: 'var(--text-secondary)',
};

const emailBadgeStyles: React.CSSProperties = {
  fontSize: '0.95rem',
  fontWeight: 600,
};

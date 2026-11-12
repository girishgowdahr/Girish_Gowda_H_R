import React from 'react';
import { Cpu, CheckCircle2, Code2, Database, ShieldCheck, Terminal } from 'lucide-react';

export const SkillsPage: React.FC = () => {
  const skillCategories = [
    {
      title: 'Languages & Core Runtimes',
      icon: <Code2 size={20} color="var(--accent-cyan)" />,
      skills: ['Java 21 / 25 LTS', 'TypeScript / JavaScript', 'SQL (PostgreSQL)', 'HTML5 & Accessible DOM', 'Bash / Shell Scripting'],
    },
    {
      title: 'Frameworks & Frontend',
      icon: <Terminal size={20} color="var(--accent-blue)" />,
      skills: ['Spring Boot 3 / 4', 'React 19', 'Vite & Vitest', 'React Router', 'Three.js / React Three Fiber'],
    },
    {
      title: 'Databases & Infrastructure',
      icon: <Database size={20} color="var(--accent-emerald)" />,
      skills: ['PostgreSQL 16+ & RLS', 'Flyway Migrations', 'Docker & Compose', 'Object Storage (S3 API / MinIO)', 'Testcontainers'],
    },
    {
      title: 'Security & Protocols',
      icon: <ShieldCheck size={20} color="var(--accent-purple)" />,
      skills: ['Argon2id Password Hashing', 'TOTP (RFC 6238)', 'WebAuthn / Passkeys', 'CSP & Security Headers', 'Libsodium / WebCrypto'],
    },
  ];

  return (
    <div style={containerStyles}>
      <header style={headerStyles}>
        <div style={taglineBadgeStyles}>
          <Cpu size={14} color="var(--accent-cyan)" />
          <span>TECHNICAL PROFICIENCIES</span>
        </div>
        <h1 style={titleStyles}>Skills & Capabilities</h1>
        <p style={subtitleStyles}>
          Curated technical stack spanning frontend engineering, backend modular systems, and rigorous security boundaries.
        </p>
      </header>

      <div style={gridStyles}>
        {skillCategories.map((cat, idx) => (
          <section key={idx} style={cardStyles} aria-labelledby={`skill-cat-${idx}`}>
            <div style={cardHeaderStyles}>
              <div style={iconBoxStyles}>{cat.icon}</div>
              <h2 id={`skill-cat-${idx}`} style={catTitleStyles}>{cat.title}</h2>
            </div>
            <ul style={skillsListStyles}>
              {cat.skills.map((skill, sIdx) => (
                <li key={sIdx} style={skillItemStyles}>
                  <CheckCircle2 size={16} color="var(--accent-cyan)" />
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
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

const gridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1.5rem',
};

const cardStyles: React.CSSProperties = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-lg)',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
};

const cardHeaderStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  borderBottom: '1px solid var(--border-subtle)',
  paddingBottom: '0.75rem',
};

const iconBoxStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
};

const catTitleStyles: React.CSSProperties = {
  fontSize: '1.05rem',
  fontWeight: 700,
};

const skillsListStyles: React.CSSProperties = {
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
};

const skillItemStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  fontSize: '0.9rem',
  color: 'var(--text-secondary)',
};

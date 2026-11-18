import React, { useState } from 'react';
import { useAuth } from '../../core/auth/AuthContext';
import { PersonalBioModule } from './components/PersonalBioModule';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import {
  Shield, Lock, LogOut, KeyRound, UserCheck, Clock,
  Database, ShieldAlert, Cpu, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

type ActiveTab = 'bio' | 'security' | 'isolation';

export const DashboardPage: React.FC = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('bio');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  return (
    <div style={pageContainerStyles}>
      {/* Top Enclave Header */}
      <header style={headerStyles}>
        <div style={headerTopRowStyles}>
          <div style={brandBadgeGroupStyles}>
            <div style={enclaveIconWrapperStyles}>
              <Shield size={24} color="var(--accent-cyan)" />
            </div>
            <div>
              <div style={statusRowStyles}>
                <span style={pulseDotStyles} />
                <span style={enclaveTagStyles}>SECURE ENCLAVE ACTIVE</span>
                <span style={securitySpecBadgeStyles}>ARGON2id • ZERO PUBLIC LEAKAGE</span>
              </div>
              <h1 style={titleStyles}>Private Dashboard & Bio</h1>
            </div>
          </div>

          <div style={headerActionGroupStyles}>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              style={actionButtonStyles}
              title="Change your Master Password"
            >
              <KeyRound size={16} color="var(--accent-cyan)" />
              <span>Change Password</span>
            </button>
            <button
              onClick={logout}
              style={logoutButtonStyles}
              title="Terminate private session immediately"
            >
              <LogOut size={16} />
              <span>Lock Enclave</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <nav style={tabNavStyles} aria-label="Private Dashboard Navigation">
          <button
            onClick={() => setActiveTab('bio')}
            style={tabButtonStyles(activeTab === 'bio')}
          >
            <UserCheck size={16} />
            <span>My Personal Bio</span>
            <span style={pillBadgeStyles(activeTab === 'bio')}>Categories A–F</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            style={tabButtonStyles(activeTab === 'security')}
          >
            <Lock size={16} />
            <span>Security & Sessions</span>
          </button>
          <button
            onClick={() => setActiveTab('isolation')}
            style={tabButtonStyles(activeTab === 'isolation')}
          >
            <Database size={16} />
            <span>Privacy & Isolation Matrix</span>
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main style={mainContentStyles}>
        {activeTab === 'bio' && (
          <section aria-label="Personal Bio Management">
            <PersonalBioModule />
          </section>
        )}

        {activeTab === 'security' && (
          <section style={panelContainerStyles} aria-label="Security and Session Status">
            <div style={panelHeaderStyles}>
              <h2 style={panelTitleStyles}>Enclave Security & Authentication State</h2>
              <p style={panelSubtitleStyles}>
                Review your session parameters, Argon2id cryptographic settings, and active protections.
              </p>
            </div>

            <div style={gridTwoColStyles}>
              <div style={cardStyles}>
                <div style={cardHeaderStyles}>
                  <Clock size={20} color="var(--accent-cyan)" />
                  <h3 style={cardTitleStyles}>Session Inactivity Timeout</h3>
                </div>
                <p style={cardTextStyles}>
                  For optimal confidentiality, sessions automatically expire after <strong>30 minutes</strong> of inactivity.
                  User interactions (clicks, keyboard strokes) slide the active lease window automatically.
                </p>
                <div style={specRowStyles}>
                  <span style={specLabelStyles}>Current Status:</span>
                  <span style={statusActiveBadgeStyles}>Session Authenticated</span>
                </div>
                <div style={specRowStyles}>
                  <span style={specLabelStyles}>Cookie Flags:</span>
                  <span style={specValStyles}>HttpOnly, SameSite=Lax, Secure</span>
                </div>
              </div>

              <div style={cardStyles}>
                <div style={cardHeaderStyles}>
                  <Cpu size={20} color="#818cf8" />
                  <h3 style={cardTitleStyles}>Argon2id Cryptographic Standard</h3>
                </div>
                <p style={cardTextStyles}>
                  Master Passwords are never stored in plaintext. They are protected using RFC 9106 Argon2id with 64MB memory cost, 3 iterations, and 4 parallelism threads.
                </p>
                <div style={specRowStyles}>
                  <span style={specLabelStyles}>Algorithm:</span>
                  <span style={specValStyles}>Argon2id (RFC 9106)</span>
                </div>
                <div style={specRowStyles}>
                  <span style={specLabelStyles}>Target Storage:</span>
                  <span style={specValStyles}>core.auth_credential</span>
                </div>
              </div>

              <div style={cardStyles}>
                <div style={cardHeaderStyles}>
                  <ShieldAlert size={20} color="#f59e0b" />
                  <h3 style={cardTitleStyles}>Rate Limiting & Lockout Protection</h3>
                </div>
                <p style={cardTextStyles}>
                  Brute-force attempts against the Master Password trigger progressive backoff. Exceeding 5 consecutive failed attempts results in an automatic 15-minute enclave lockout.
                </p>
                <div style={specRowStyles}>
                  <span style={specLabelStyles}>Max Threshold:</span>
                  <span style={specValStyles}>5 attempts</span>
                </div>
                <div style={specRowStyles}>
                  <span style={specLabelStyles}>Lockout Duration:</span>
                  <span style={specValStyles}>15 minutes</span>
                </div>
              </div>

              <div style={cardStyles}>
                <div style={cardHeaderStyles}>
                  <KeyRound size={20} color="var(--accent-emerald)" />
                  <h3 style={cardTitleStyles}>Master Password Management</h3>
                </div>
                <p style={cardTextStyles}>
                  Update your Master Password at any time. Updating requires immediate verification of your current password before committing the new Argon2id hash.
                </p>
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  style={primaryActionBtnStyles}
                >
                  <KeyRound size={16} />
                  <span>Update Master Password Now</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'isolation' && (
          <section style={panelContainerStyles} aria-label="Privacy and Isolation Architecture">
            <div style={panelHeaderStyles}>
              <h2 style={panelTitleStyles}>Private Data Isolation Matrix</h2>
              <p style={panelSubtitleStyles}>
                Architecture guarantee: Personal Bio data is strictly isolated from public visitors and search engine indexing.
              </p>
            </div>

            <div style={gridTwoColStyles}>
              <div style={cardStyles}>
                <h3 style={cardTitleStyles}>Public vs. Private Boundaries</h3>
                <ul style={checklistStyles}>
                  <li style={checkItemStyles}>
                    <span style={checkBulletStyles}>✓</span>
                    <span><strong>Public API:</strong> <code>/api/v1/public/portfolio/**</code> delivers published resume and showcase snapshots only.</span>
                  </li>
                  <li style={checkItemStyles}>
                    <span style={checkBulletStyles}>✓</span>
                    <span><strong>Private API:</strong> <code>/api/v1/private/**</code> strictly mandates active session authentication (Spring Security Filter).</span>
                  </li>
                  <li style={checkItemStyles}>
                    <span style={checkBulletStyles}>✓</span>
                    <span><strong>Database Schema:</strong> Private bio is stored in schema <code>personal.personal_bio</code>, segregated from public tables.</span>
                  </li>
                </ul>
              </div>

              <div style={cardStyles}>
                <h3 style={cardTitleStyles}>Quick Links & Navigation</h3>
                <p style={cardTextStyles}>
                  You can transition between your private enclave and the public Free Fire 3D character stage at any time:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                  <Link to="/" style={quickLinkStyles}>
                    <ExternalLink size={16} />
                    <span>Return to Public Lobby & 3D Character</span>
                  </Link>
                  <Link to="/projects" style={quickLinkStyles}>
                    <ExternalLink size={16} />
                    <span>Browse Public Projects</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};

const pageContainerStyles: React.CSSProperties = {
  maxWidth: '1240px',
  margin: '0 auto',
  padding: '1.5rem 1.25rem 4rem',
  minHeight: '85vh',
};

const headerStyles: React.CSSProperties = {
  marginBottom: '2rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid var(--border-subtle)',
};

const headerTopRowStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '1.5rem',
  marginBottom: '1.5rem',
};

const brandBadgeGroupStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
};

const enclaveIconWrapperStyles: React.CSSProperties = {
  width: '48px',
  height: '48px',
  borderRadius: '10px',
  backgroundColor: 'rgba(0, 240, 255, 0.1)',
  border: '1px solid rgba(0, 240, 255, 0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const statusRowStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  marginBottom: '0.25rem',
};

const pulseDotStyles: React.CSSProperties = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: 'var(--accent-emerald)',
  boxShadow: '0 0 10px var(--accent-emerald)',
};

const enclaveTagStyles: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 800,
  letterSpacing: '0.08em',
  color: 'var(--accent-emerald)',
};

const securitySpecBadgeStyles: React.CSSProperties = {
  fontSize: '0.65rem',
  fontWeight: 700,
  letterSpacing: '0.06em',
  padding: '0.15rem 0.5rem',
  borderRadius: '4px',
  backgroundColor: 'rgba(0, 240, 255, 0.08)',
  color: 'var(--accent-cyan)',
  border: '1px solid rgba(0, 240, 255, 0.2)',
};

const titleStyles: React.CSSProperties = {
  fontSize: '1.75rem',
  fontWeight: 800,
  color: '#f8fafc',
  margin: 0,
};

const headerActionGroupStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  flexWrap: 'wrap',
};

const actionButtonStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.55rem 1rem',
  backgroundColor: 'rgba(15, 23, 42, 0.7)',
  border: '1px solid rgba(0, 240, 255, 0.3)',
  borderRadius: '6px',
  color: '#f8fafc',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const logoutButtonStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.55rem 1rem',
  backgroundColor: 'rgba(239, 68, 68, 0.12)',
  border: '1px solid rgba(239, 68, 68, 0.35)',
  borderRadius: '6px',
  color: '#f87171',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const tabNavStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  flexWrap: 'wrap',
  marginTop: '1rem',
};

const tabButtonStyles = (isActive: boolean): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.6rem',
  padding: '0.65rem 1.15rem',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  backgroundColor: isActive ? 'rgba(0, 240, 255, 0.12)' : 'rgba(15, 23, 42, 0.6)',
  border: isActive ? '1px solid rgba(0, 240, 255, 0.4)' : '1px solid var(--border-subtle)',
  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
});

const pillBadgeStyles = (isActive: boolean): React.CSSProperties => ({
  fontSize: '0.7rem',
  padding: '0.1rem 0.45rem',
  borderRadius: '10px',
  backgroundColor: isActive ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)',
  color: isActive ? '#f8fafc' : 'var(--text-muted)',
});

const mainContentStyles: React.CSSProperties = {
  marginTop: '1.5rem',
};

const panelContainerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

const panelHeaderStyles: React.CSSProperties = {
  marginBottom: '0.5rem',
};

const panelTitleStyles: React.CSSProperties = {
  fontSize: '1.35rem',
  fontWeight: 700,
  color: '#f8fafc',
  margin: '0 0 0.35rem 0',
};

const panelSubtitleStyles: React.CSSProperties = {
  fontSize: '0.9rem',
  color: 'var(--text-secondary)',
  margin: 0,
};

const gridTwoColStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '1.25rem',
};

const cardStyles: React.CSSProperties = {
  backgroundColor: 'rgba(15, 23, 42, 0.7)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '10px',
  padding: '1.5rem',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  flexDirection: 'column',
};

const cardHeaderStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginBottom: '0.75rem',
};

const cardTitleStyles: React.CSSProperties = {
  fontSize: '1.05rem',
  fontWeight: 700,
  color: '#f8fafc',
  margin: 0,
};

const cardTextStyles: React.CSSProperties = {
  fontSize: '0.875rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
  marginBottom: '1rem',
};

const specRowStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.45rem 0',
  borderTop: '1px solid rgba(148, 163, 184, 0.1)',
  fontSize: '0.825rem',
};

const specLabelStyles: React.CSSProperties = {
  color: 'var(--text-muted)',
  fontWeight: 600,
};

const specValStyles: React.CSSProperties = {
  color: 'var(--accent-cyan)',
  fontFamily: 'monospace',
  fontWeight: 600,
};

const statusActiveBadgeStyles: React.CSSProperties = {
  color: 'var(--accent-emerald)',
  fontWeight: 700,
  fontSize: '0.8rem',
};

const primaryActionBtnStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  marginTop: 'auto',
  padding: '0.65rem 1rem',
  backgroundColor: 'rgba(0, 240, 255, 0.15)',
  border: '1px solid rgba(0, 240, 255, 0.4)',
  borderRadius: '6px',
  color: 'var(--accent-cyan)',
  fontSize: '0.875rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const checklistStyles: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
};

const checkItemStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.65rem',
  fontSize: '0.875rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.5,
};

const checkBulletStyles: React.CSSProperties = {
  color: 'var(--accent-emerald)',
  fontWeight: 800,
};

const quickLinkStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.65rem 1rem',
  backgroundColor: 'rgba(15, 23, 42, 0.6)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '6px',
  color: 'var(--accent-cyan)',
  textDecoration: 'none',
  fontSize: '0.875rem',
  fontWeight: 600,
  transition: 'all 0.2s ease',
};

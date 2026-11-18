import React, { useState } from 'react';
import { useAuth } from '../../../core/auth/AuthContext';
import { X, Lock, KeyRound, Eye, EyeOff, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const { changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword) {
      setError('Current Master Password is required.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New Master Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await changePassword(currentPassword, newPassword);
    setLoading(false);

    if (result.success) {
      setSuccess(result.message || 'Password changed successfully. Please log in with your new password.');
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setError(result.error || 'Failed to update Master Password.');
    }
  };

  return (
    <div style={overlayStyles} role="dialog" aria-modal="true" aria-labelledby="change-pass-title">
      <div style={modalCardStyles}>
        <div style={modalHeaderStyles}>
          <div style={titleRowStyles}>
            <KeyRound size={22} color="var(--accent-cyan)" />
            <h2 id="change-pass-title" style={modalTitleStyles}>Change Master Password</h2>
          </div>
          <button onClick={onClose} style={closeButtonStyles} aria-label="Close modal">
            <X size={20} color="var(--text-muted)" />
          </button>
        </div>

        <p style={modalDescStyles}>
          Updating your Master Password re-encrypts your credentials using Argon2id and revokes all active sessions for maximum security.
        </p>

        {error && (
          <div style={errorBannerStyles} role="alert">
            <AlertTriangle size={16} color="#ef4444" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={successBannerStyles} role="alert">
            <CheckCircle2 size={16} color="#10b981" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={formStyles}>
          <div style={inputGroupStyles}>
            <label htmlFor="modal-current-pass" style={labelStyles}>Current Master Password</label>
            <div style={inputWrapStyles}>
              <input
                id="modal-current-pass"
                type={showPass ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter existing password..."
                style={inputStyles}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={eyeBtnStyles}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff size={16} color="var(--text-muted)" /> : <Eye size={16} color="var(--text-muted)" />}
              </button>
            </div>
          </div>

          <div style={inputGroupStyles}>
            <label htmlFor="modal-new-pass" style={labelStyles}>New Master Password (min 8 chars)</label>
            <div style={inputWrapStyles}>
              <input
                id="modal-new-pass"
                type={showPass ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new strong password..."
                style={inputStyles}
                required
              />
            </div>
          </div>

          <div style={inputGroupStyles}>
            <label htmlFor="modal-confirm-pass" style={labelStyles}>Confirm New Master Password</label>
            <div style={inputWrapStyles}>
              <input
                id="modal-confirm-pass"
                type={showPass ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password..."
                style={inputStyles}
                required
              />
            </div>
          </div>

          <div style={actionRowStyles}>
            <button type="button" onClick={onClose} style={cancelBtnStyles}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={saveBtnStyles(loading)}>
              <Lock size={16} />
              <span>{loading ? 'SAVING...' : 'UPDATE PASSWORD'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const overlayStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  backdropFilter: 'blur(8px)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
};

const modalCardStyles: React.CSSProperties = {
  width: '100%',
  maxWidth: '460px',
  backgroundColor: '#0f172a',
  border: '1px solid rgba(0, 240, 255, 0.3)',
  borderRadius: '14px',
  padding: '2rem',
  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 240, 255, 0.15)',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
};

const modalHeaderStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const titleRowStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
};

const modalTitleStyles: React.CSSProperties = {
  fontSize: '1.15rem',
  fontWeight: 700,
  color: '#f8fafc',
  margin: 0,
};

const closeButtonStyles: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '0.25rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const modalDescStyles: React.CSSProperties = {
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
  lineHeight: 1.4,
  margin: 0,
};

const errorBannerStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  padding: '0.75rem',
  backgroundColor: 'rgba(239, 68, 68, 0.12)',
  border: '1px solid rgba(239, 68, 68, 0.3)',
  borderRadius: '6px',
  fontSize: '0.825rem',
  color: '#fca5a5',
};

const successBannerStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  padding: '0.75rem',
  backgroundColor: 'rgba(16, 185, 129, 0.12)',
  border: '1px solid rgba(16, 185, 129, 0.3)',
  borderRadius: '6px',
  fontSize: '0.825rem',
  color: '#6ee7b7',
};

const formStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const inputGroupStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
};

const labelStyles: React.CSSProperties = {
  fontSize: '0.825rem',
  fontWeight: 600,
  color: '#cbd5e1',
};

const inputWrapStyles: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
};

const inputStyles: React.CSSProperties = {
  width: '100%',
  padding: '0.65rem 2.5rem 0.65rem 0.85rem',
  backgroundColor: 'rgba(9, 14, 26, 0.8)',
  border: '1px solid rgba(148, 163, 184, 0.25)',
  borderRadius: '6px',
  color: '#f8fafc',
  fontSize: '0.9rem',
  outline: 'none',
};

const eyeBtnStyles: React.CSSProperties = {
  position: 'absolute',
  right: '0.6rem',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const actionRowStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '0.75rem',
  marginTop: '0.5rem',
};

const cancelBtnStyles: React.CSSProperties = {
  padding: '0.65rem 1.25rem',
  backgroundColor: 'transparent',
  border: '1px solid rgba(148, 163, 184, 0.3)',
  borderRadius: '6px',
  color: 'var(--text-muted)',
  cursor: 'pointer',
  fontSize: '0.875rem',
};

const saveBtnStyles = (loading: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.65rem 1.25rem',
  backgroundColor: 'var(--accent-cyan)',
  color: '#090a0f',
  fontWeight: 700,
  fontSize: '0.875rem',
  border: 'none',
  borderRadius: '6px',
  cursor: loading ? 'not-allowed' : 'pointer',
  opacity: loading ? 0.7 : 1,
});

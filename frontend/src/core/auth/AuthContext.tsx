import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  setupRequired: boolean;
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  remainingAttempts: number | null;
  lockoutSeconds: number | null;
  login: (password: string) => Promise<boolean>;
  setup: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  changePassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 30-minute idle inactivity timeout
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [setupRequired, setSetupRequired] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState<number | null>(null);

  const idleTimerRef = useRef<number | null>(null);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
    }
    if (isAuthenticated) {
      idleTimerRef.current = window.setTimeout(() => {
        handleInactivityLogout();
      }, INACTIVITY_TIMEOUT_MS);
    }
  }, [isAuthenticated]);

  const handleInactivityLogout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { credentials: 'include', method: 'POST' });
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setUser(null);
    setError('Session expired due to inactivity. Please enter your Master Password to resume.');
  };

  const checkAuthStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/status', {
        credentials: 'include',
        headers: { 'Accept': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(Boolean(data.authenticated));
        setSetupRequired(Boolean(data.setupRequired));
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        // Fallback check if backend is not running (e.g. static Vite dev / preview)
        checkLocalFallbackStatus();
      }
    } catch {
      // Backend not running, check local fallback
      checkLocalFallbackStatus();
    } finally {
      setLoading(false);
    }
  }, []);

  const checkLocalFallbackStatus = () => {
    const localHash = sessionStorage.getItem('girish_master_session');
    const hasConfigured = localStorage.getItem('girish_master_configured') === 'true';
    if (!hasConfigured) {
      setSetupRequired(true);
      setIsAuthenticated(false);
    } else if (localHash === 'authenticated') {
      setIsAuthenticated(true);
      setSetupRequired(false);
      setUser({
        id: 'owner-local',
        email: 'girishgowdahr07@gmail.com',
        displayName: 'Girish Gowda H R',
        role: 'OWNER',
      });
    } else {
      setIsAuthenticated(false);
      setSetupRequired(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Track user activity for sliding inactivity timeout
  useEffect(() => {
    const handleActivity = () => resetIdleTimer();
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    resetIdleTimer();

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
    };
  }, [resetIdleTimer]);

  const login = async (password: string): Promise<boolean> => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setUser(data.user);
        setRemainingAttempts(null);
        setLockoutSeconds(null);
        sessionStorage.setItem('girish_master_session', 'authenticated');
        return true;
      } else {
        const errorMsg = data.error || 'Invalid Master Password';
        setError(errorMsg);
        if (res.status === 401 && errorMsg.includes('attempts remaining')) {
          const match = errorMsg.match(/(\d+) attempts remaining/);
          if (match) setRemainingAttempts(parseInt(match[1], 10));
        }
        return false;
      }
    } catch {
      // Local fallback for offline/static preview
      const storedPass = localStorage.getItem('girish_master_password_vault');
      if (storedPass && password === storedPass) {
        setIsAuthenticated(true);
        setUser({
          id: 'owner-local',
          email: 'girishgowdahr07@gmail.com',
          displayName: 'Girish Gowda H R',
          role: 'OWNER',
        });
        sessionStorage.setItem('girish_master_session', 'authenticated');
        return true;
      } else {
        setError('Invalid Master Password.');
        return false;
      }
    } finally {
      setLoading(false);
    }
  };

  const setup = async (password: string): Promise<boolean> => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setSetupRequired(false);
        setUser(data.user);
        sessionStorage.setItem('girish_master_session', 'authenticated');
        localStorage.setItem('girish_master_configured', 'true');
        return true;
      } else {
        setError(data.error || 'Failed to setup Master Password');
        return false;
      }
    } catch {
      // Local fallback setup
      localStorage.setItem('girish_master_password_vault', password);
      localStorage.setItem('girish_master_configured', 'true');
      sessionStorage.setItem('girish_master_session', 'authenticated');
      setIsAuthenticated(true);
      setSetupRequired(false);
      setUser({
        id: 'owner-local',
        email: 'girishgowdahr07@gmail.com',
        displayName: 'Girish Gowda H R',
        role: 'OWNER',
      });
      return true;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // ignore
    } finally {
      sessionStorage.removeItem('girish_master_session');
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    }
  };

  const changePassword = async (currentPass: string, newPass: string) => {
    setError(null);
    try {
      const res = await fetch('/api/v1/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.removeItem('girish_master_session');
        setIsAuthenticated(false);
        setUser(null);
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error || 'Failed to update password' };
      }
    } catch {
      const stored = localStorage.getItem('girish_master_password_vault');
      if (stored === currentPass) {
        localStorage.setItem('girish_master_password_vault', newPass);
        sessionStorage.removeItem('girish_master_session');
        setIsAuthenticated(false);
        setUser(null);
        return { success: true, message: 'Password updated. Please log in again.' };
      }
      return { success: false, error: 'Current password does not match.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setupRequired,
        user,
        loading,
        error,
        remainingAttempts,
        lockoutSeconds,
        login,
        setup,
        logout,
        changePassword,
        clearError: () => setError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

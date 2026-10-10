/**
 * Admin Authentication Service for Free Drama
 * Protected with Email: asifyt265@gmail.com, Password: asif9898
 */

const ADMIN_CREDS_STORAGE_KEY = 'free_drama_admin_credentials';
const ADMIN_SESSION_STORAGE_KEY = 'free_drama_admin_session';

export interface AdminCredentials {
  email: string;
  password: string;
}

export const DEFAULT_ADMIN_CREDENTIALS: AdminCredentials = {
  email: 'asifyt265@gmail.com',
  password: 'asif9898',
};

export function getStoredAdminCredentials(): AdminCredentials {
  try {
    const raw = localStorage.getItem(ADMIN_CREDS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.email && parsed.password) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse admin credentials:', e);
  }
  // Default to user's exact credentials
  return DEFAULT_ADMIN_CREDENTIALS;
}

export function saveStoredAdminCredentials(creds: AdminCredentials): void {
  localStorage.setItem(ADMIN_CREDS_STORAGE_KEY, JSON.stringify(creds));
}

export function verifyAdminLogin(emailInput: string, passwordInput: string): boolean {
  const currentCreds = getStoredAdminCredentials();
  const cleanEmail = emailInput.trim().toLowerCase();
  const targetEmail = currentCreds.email.trim().toLowerCase();
  
  return cleanEmail === targetEmail && passwordInput === currentCreds.password;
}

export function isAdminLoggedIn(): boolean {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

export function setAdminLoggedInSession(loggedIn: boolean): void {
  try {
    if (loggedIn) {
      sessionStorage.setItem(ADMIN_SESSION_STORAGE_KEY, 'true');
    } else {
      sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    }
  } catch (e) {
    console.error(e);
  }
}

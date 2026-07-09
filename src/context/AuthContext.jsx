import { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../config/constants';
import axiosInstance from '../services/axiosInstance';

const TOKEN_KEY = STORAGE_KEYS.TOKEN;

function parseJwtPayload(token) {
  try {
    const body = token.split('.')[1];
    // JWT uses base64url; convert to standard base64 before decoding
    const base64 = body.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '=='.slice(0, (4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

function isTokenValid(token) {
  if (!token) return false;
  const payload = parseJwtPayload(token);
  if (!payload) return false;
  // exp is in seconds for real JWTs, milliseconds for mock — handle both
  const exp = payload.exp > 1e10 ? payload.exp : payload.exp * 1000;
  return exp > Date.now();
}

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    return isTokenValid(t) ? t : null;
  });
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Fetch profile when token is available
  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const res = await axiosInstance.get('/api/v1/auth/profile');
      const profileData = res.data?.data || res.data;
      setProfile(profileData);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post('/api/v1/auth/login', { email, password });
      const d = res.data;
      const jwt = d?.data?.tokens?.accessToken;
      if (!jwt) return { ok: false, error: 'No token received' };
      localStorage.setItem(TOKEN_KEY, jwt);
      setToken(jwt);
      return { ok: true };
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      const msg = err.response?.data?.message || err.message || 'Login failed';
      return { ok: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setProfile(null);
  };

  const user = token ? parseJwtPayload(token) : null;

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, login, logout, profile, profileLoading, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

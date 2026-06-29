import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthUser, SignupData, AuthContextType } from './auth.types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API       = 'http://localhost:5000/api/auth';
const TOKEN_KEY = 'tally_jwt_token';
const USER_KEY  = 'tally_auth_user';
const ID_KEY    = 'tally_saved_identifiers';

function saveIdentifier(id: string) {
  try {
    const raw  = localStorage.getItem(ID_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(id)) { list.unshift(id); localStorage.setItem(ID_KEY, JSON.stringify(list.slice(0, 5))); }
  } catch {}
}

function normalise(raw: any): AuthUser {
  return {
    id:               String(raw.id),
    fullName:         raw.fullName  || raw.full_name || '',
    username:         raw.username  || '',
    email:            raw.email     || null,
    phone:            raw.phone     || null,
    avatar:           raw.avatar    || null,
    name:             raw.fullName  || raw.full_name || raw.username || '',
    purchasedCourses: raw.purchasedCourses || [],
    purchasedVideos:  raw.purchasedVideos  || [],
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,      setUser]      = useState<AuthUser | null>(null);
  const [token,     setToken]     = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const t = localStorage.getItem(TOKEN_KEY);
      const u = localStorage.getItem(USER_KEY);
      if (t && u) { setToken(t); setUser(JSON.parse(u)); }
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  function persist(u: AuthUser, t: string) {
    setUser(u); setToken(t);
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  }

  function clear() {
    setUser(null); setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  const signup = async (data: SignupData) => {
    try {
      const res  = await fetch(`${API}/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const json = await res.json();
      if (json.success) {
        persist(normalise(json.user), json.token);
        const id = data.email || data.phone || data.username;
        if (id) saveIdentifier(id);
        return { success: true, message: json.message };
      }
      return { success: false, message: json.message || 'Signup failed' };
    } catch {
      return { success: false, message: 'Cannot reach server. Make sure the backend is running.' };
    }
  };

  const login = async (identifier: string, password: string) => {
    try {
      const res  = await fetch(`${API}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identifier, password }) });
      const json = await res.json();
      if (json.success) {
        persist(normalise(json.user), json.token);
        return { success: true, message: json.message };
      }
      return { success: false, message: json.message || 'Login failed' };
    } catch {
      return { success: false, message: 'Cannot reach server. Make sure the backend is running.' };
    }
  };

  const logout = () => {
    if (token) fetch(`${API}/logout`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    clear();
  };

  const updateProfile = (updates: Partial<Pick<AuthUser, 'fullName' | 'avatar'>>) => {
    if (!user || !token) return;
    const updated: AuthUser = { ...user, ...updates, name: updates.fullName ?? user.fullName };
    persist(updated, token);
  };

  const hasPurchased = (contentId: string, type: 'course' | 'video') => {
    if (!user) return false;
    return type === 'course' ? user.purchasedCourses.includes(contentId) : user.purchasedVideos.includes(contentId);
  };

  const purchaseContent = (contentId: string, type: 'course' | 'video') => {
    if (!user) return;
    const updated = { ...user };
    if (type === 'course') { if (!updated.purchasedCourses.includes(contentId)) updated.purchasedCourses.push(contentId); }
    else { if (!updated.purchasedVideos.includes(contentId)) updated.purchasedVideos.push(contentId); }
    setUser(updated);
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, signup, login, logout, updateProfile, hasPurchased, purchaseContent }}>
      {children}
    </AuthContext.Provider>
  );
}

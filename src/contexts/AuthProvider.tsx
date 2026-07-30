import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthUser, SignupData, AuthContextType } from './auth.types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// DUMMY AUTHENTICATION - LOCAL STORAGE ONLY
// No backend server required!
// ============================================

const TOKEN_KEY = 'tally_jwt_token';
const USER_KEY  = 'tally_auth_user';
const ID_KEY    = 'tally_saved_identifiers';
const USERS_DB  = 'tally_users_db'; // Simulated user database

// Safe localStorage helpers (SSR-safe)
function lsGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  try { return localStorage.getItem(key); } catch { return null; }
}
function lsSet(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, value); } catch {}
}
function lsRemove(key: string): void {
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(key); } catch {}
}

function saveIdentifier(id: string) {
  try {
    const raw  = lsGet(ID_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(id)) { list.unshift(id); lsSet(ID_KEY, JSON.stringify(list.slice(0, 5))); }
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

// Get all registered users from localStorage
function getUsersDB(): any[] {
  try {
    const raw = lsGet(USERS_DB);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveUsersDB(users: any[]) {
  try { lsSet(USERS_DB, JSON.stringify(users)); } catch {}
}

// Find user by identifier (username, email, or phone)
function findUser(identifier: string): any | null {
  const users = getUsersDB();
  return users.find(u => 
    u.username === identifier || 
    u.email === identifier || 
    u.phone === identifier
  ) || null;
}

// Generate dummy JWT token
function generateToken(userId: string): string {
  return `dummy_token_${userId}_${Date.now()}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,      setUser]      = useState<AuthUser | null>(null);
  const [token,     setToken]     = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") { setIsLoading(false); return; }
    try {
      const t = lsGet(TOKEN_KEY);
      const u = lsGet(USER_KEY);
      if (t && u) { setToken(t); setUser(JSON.parse(u)); }
    } catch {
      lsRemove(TOKEN_KEY);
      lsRemove(USER_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  function persist(u: AuthUser, t: string) {
    setUser(u); setToken(t);
    lsSet(TOKEN_KEY, t);
    lsSet(USER_KEY, JSON.stringify(u));
  }

  function clear() {
    setUser(null); setToken(null);
    lsRemove(TOKEN_KEY);
    lsRemove(USER_KEY);
  }

  const signup = async (data: SignupData): Promise<{ success: boolean; message: string }> => {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = getUsersDB();

    // Check if username already exists
    if (users.some(u => u.username === data.username)) {
      return { success: false, message: 'Username already taken' };
    }

    // Check if email already exists
    if (data.email && users.some(u => u.email === data.email)) {
      return { success: false, message: 'Email already registered' };
    }

    // Check if phone already exists
    if (data.phone && users.some(u => u.phone === data.phone)) {
      return { success: false, message: 'Phone number already registered' };
    }

    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      fullName: data.fullName,
      username: data.username,
      email: data.email || null,
      phone: data.phone || null,
      password: data.password, // In real app, this would be hashed!
      avatar: null,
      purchasedCourses: [],
      purchasedVideos: [],
      createdAt: new Date().toISOString(),
    };

    // Save to "database"
    users.push(newUser);
    saveUsersDB(users);

    // Generate token and persist session
    const token = generateToken(newUser.id);
    const authUser = normalise(newUser);
    persist(authUser, token);

    // Save identifier for autocomplete
    const id = data.email || data.phone || data.username;
    if (id) saveIdentifier(id);

    return { success: true, message: 'Account created successfully!' };
  };

  const login = async (identifier: string, password: string): Promise<{ success: boolean; message: string }> => {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = findUser(identifier);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Incorrect password' };
    }

    // Generate token and persist session
    const token = generateToken(user.id);
    const authUser = normalise(user);
    persist(authUser, token);

    // Save identifier for autocomplete
    saveIdentifier(identifier);

    return { success: true, message: 'Welcome back!' };
  };

  const logout = () => {
    clear();
  };

  const updateProfile = (updates: Partial<Pick<AuthUser, 'fullName' | 'avatar'>>) => {
    if (!user || !token) return;
    const updated: AuthUser = { ...user, ...updates, name: updates.fullName ?? user.fullName };
    persist(updated, token);
    // Also update in users DB
    const users = getUsersDB();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) { users[idx] = { ...users[idx], ...updates }; saveUsersDB(users); }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    if (!user) return { success: false, message: 'Not logged in' };
    const users = getUsersDB();
    const dbUser = users.find(u => u.id === user.id);
    if (!dbUser) return { success: false, message: 'User not found' };
    if (dbUser.password !== currentPassword) return { success: false, message: 'Current password is incorrect' };
    if (newPassword.length < 6) return { success: false, message: 'New password must be at least 6 characters' };
    const idx = users.findIndex(u => u.id === user.id);
    users[idx].password = newPassword;
    saveUsersDB(users);
    return { success: true, message: 'Password changed successfully!' };
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
    lsSet(USER_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, signup, login, logout, updateProfile, changePassword, hasPurchased, purchaseContent }}>
      {children}
    </AuthContext.Provider>
  );
}

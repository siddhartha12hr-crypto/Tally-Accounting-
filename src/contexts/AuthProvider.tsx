import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AuthUser, SignupData, AuthContextType, AdminUser, PurchaseCode } from './auth.types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// DUMMY AUTHENTICATION - LOCAL STORAGE ONLY
// No backend server required!
// ============================================

const TOKEN_KEY = 'tally_jwt_token';
const USER_KEY  = 'tally_auth_user';
const ID_KEY    = 'tally_saved_identifiers';
const USERS_DB  = 'tally_users_db'; // Simulated user database
const CODES_DB  = 'tally_purchase_codes'; // Purchase codes database

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

// ── Purchase code helpers ─────────────────────────────────
function getCodesDB(): any[] {
  try {
    const raw = lsGet(CODES_DB);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveCodesDB(codes: any[]) {
  try { lsSet(CODES_DB, JSON.stringify(codes)); } catch {}
}

function generateCodeString(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `TALLY-${seg()}-${seg()}`;
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
      if (t && u) {
        const parsed = JSON.parse(u);
        // Check if the user is blocked in the DB — force logout if so
        const dbUser = getUsersDB().find(dbU => dbU.id === parsed.id);
        if (dbUser?.status === 'blocked') {
          lsRemove(TOKEN_KEY);
          lsRemove(USER_KEY);
        } else {
          setToken(t); setUser(parsed);
        }
      }
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
      courseBlocks: [],
      status: 'active' as const,
      lastLogin: null,
      blockedAt: null,
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

    // Block check
    if (user.status === 'blocked') {
      return { success: false, message: 'Your account has been blocked. Please contact support.' };
    }

    // Update last login timestamp
    const users = getUsersDB();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx].lastLogin = new Date().toISOString();
      users[idx].status = users[idx].status || 'active';
      saveUsersDB(users);
    }

    // Generate token and persist session
    const token = generateToken(user.id);
    const authUser = normalise({ ...user, lastLogin: users[idx]?.lastLogin });
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
    // Course-specific block overrides everything
    if (type === 'course') {
      const users = getUsersDB();
      const dbUser = users.find(u => u.id === user.id);
      if (dbUser?.courseBlocks?.includes(contentId)) return false;
    }
    // Check both in-memory state AND localStorage directly (handles race after purchaseContent)
    const inMemory = type === 'course' ? user.purchasedCourses.includes(contentId) : user.purchasedVideos.includes(contentId);
    if (inMemory) {
      // For courses, also verify there's a non-expired purchase code (if any codes exist)
      if (type === 'course') {
        const codes = getCodesDB().filter((c: any) =>
          c.userId === user.id && c.courseIds.includes(contentId) && c.status === 'active'
        );
        if (codes.length > 0) {
          // If codes exist, at least one must be non-expired
          const hasValid = codes.some((c: any) =>
            !c.expiresAt || new Date(c.expiresAt).getTime() > Date.now()
          );
          if (!hasValid) return false;
        }
      }
      return true;
    }
    // Fallback: check localStorage directly in case state hasn't updated yet
    try {
      const raw = lsGet(USER_KEY);
      if (raw) {
        const stored = JSON.parse(raw);
        return type === 'course'
          ? (stored.purchasedCourses || []).includes(contentId)
          : (stored.purchasedVideos || []).includes(contentId);
      }
    } catch {}
    return false;
  };

  const purchaseContent = (contentId: string, type: 'course' | 'video') => {
    if (!user) return;
    const updated: AuthUser = type === 'course'
      ? {
          ...user,
          purchasedCourses: user.purchasedCourses.includes(contentId)
            ? user.purchasedCourses
            : [...user.purchasedCourses, contentId],
        }
      : {
          ...user,
          purchasedVideos: user.purchasedVideos.includes(contentId)
            ? user.purchasedVideos
            : [...user.purchasedVideos, contentId],
        };
    setUser(updated);
    lsSet(USER_KEY, JSON.stringify(updated));
    // Also persist to usersDB so it survives logout/login
    const users = getUsersDB();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx].purchasedCourses = updated.purchasedCourses;
      users[idx].purchasedVideos  = updated.purchasedVideos;
      saveUsersDB(users);
    }
  };

  /* ═══════════════════════════════════════════════════════
     ADMIN USER MANAGEMENT
     ═══════════════════════════════════════════════════════ */

  const getAllUsers = useCallback((): AdminUser[] => {
    return getUsersDB().map(u => ({
      id:               String(u.id),
      fullName:         u.fullName  || '',
      username:         u.username  || '',
      email:            u.email     || null,
      phone:            u.phone     || null,
      avatar:           u.avatar    || null,
      password:         u.password  || '',
      purchasedCourses: u.purchasedCourses || [],
      purchasedVideos:  u.purchasedVideos  || [],
      courseBlocks:      u.courseBlocks     || [],
      status:           u.status    || 'active',
      lastLogin:        u.lastLogin || null,
      blockedAt:        u.blockedAt || null,
      createdAt:        u.createdAt || new Date().toISOString(),
    }));
  }, []);

  const blockUser = useCallback((userId: string) => {
    const users = getUsersDB();
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx].status = 'blocked';
      users[idx].blockedAt = new Date().toISOString();
      saveUsersDB(users);
      // Force logout if the blocked user is currently logged in
      if (user?.id === userId) clear();
    }
  }, [user]);

  const unblockUser = useCallback((userId: string) => {
    const users = getUsersDB();
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx].status = 'active';
      users[idx].blockedAt = null;
      saveUsersDB(users);
    }
  }, []);

  const deleteUser = useCallback((userId: string) => {
    const users = getUsersDB().filter(u => u.id !== userId);
    saveUsersDB(users);
    // Force logout if the deleted user is currently logged in
    if (user?.id === userId) clear();
  }, [user]);

  const grantCourseAccess = useCallback((userId: string, courseId: string) => {
    const users = getUsersDB();
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      if (!users[idx].purchasedCourses) users[idx].purchasedCourses = [];
      if (!users[idx].purchasedCourses.includes(courseId)) {
        users[idx].purchasedCourses.push(courseId);
        saveUsersDB(users);
      }
      // If granting to the currently logged-in user, update their session too
      if (user?.id === userId) {
        const updated = { ...user, purchasedCourses: [...(user.purchasedCourses || []), courseId] };
        if (token) persist(updated, token);
      }
    }
  }, [user, token]);

  const revokeCourseAccess = useCallback((userId: string, courseId: string) => {
    const users = getUsersDB();
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx].purchasedCourses = (users[idx].purchasedCourses || []).filter((id: string) => id !== courseId);
      saveUsersDB(users);
      // If revoking from the currently logged-in user, update their session too
      if (user?.id === userId) {
        const updated = { ...user, purchasedCourses: (user.purchasedCourses || []).filter(id => id !== courseId) };
        if (token) persist(updated, token);
      }
    }
  }, [user, token]);

  /* ═══════════════════════════════════════════════════════
     PURCHASE CODE MANAGEMENT
     ═══════════════════════════════════════════════════════ */

  const generatePurchaseCode = useCallback((userId: string, courseIds: string[], durationDays: number): PurchaseCode => {
    const now = new Date();
    const expiresAt = durationDays > 0
      ? new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString()
      : null; // lifetime

    const newCode: PurchaseCode = {
      code:        generateCodeString(),
      userId,
      courseIds,
      durationDays,
      createdAt:   now.toISOString(),
      expiresAt,
      status:      'active',
      revokedAt:   null,
      redeemed:     false,
      redeemedAt:   null,
    };

    const codes = getCodesDB();
    codes.push(newCode);
    saveCodesDB(codes);

    // NOTE: Access is NOT granted here — the user must redeem the code.
    return newCode;
  }, []);

  const redeemPurchaseCode = useCallback(async (codeStr: string): Promise<{ success: boolean; message: string }> => {
    await new Promise(r => setTimeout(r, 600));
    if (!user) return { success: false, message: 'Please login to redeem a code' };

    const codes = getCodesDB();
    const idx = codes.findIndex((c: any) => c.code === codeStr.trim().toUpperCase());
    if (idx === -1) return { success: false, message: 'Invalid code. Please check and try again.' };

    const code = codes[idx];
    if (code.status === 'revoked')  return { success: false, message: 'This code has been revoked.' };
    if (code.status === 'expired')   return { success: false, message: 'This code has expired.' };
    if (code.expiresAt && new Date(code.expiresAt).getTime() < Date.now()) {
      codes[idx].status = 'expired';
      saveCodesDB(codes);
      return { success: false, message: 'This code has expired.' };
    }
    if (code.redeemed) return { success: false, message: 'This code has already been used.' };
    if (code.userId !== user.id) return { success: false, message: 'This code was not assigned to your account.' };

    // Mark as redeemed
    codes[idx].redeemed = true;
    codes[idx].redeemedAt = new Date().toISOString();
    saveCodesDB(codes);

    // Grant course access
    const users = getUsersDB();
    const uIdx = users.findIndex(u => u.id === user.id);
    if (uIdx !== -1) {
      if (!users[uIdx].purchasedCourses) users[uIdx].purchasedCourses = [];
      for (const cid of code.courseIds) {
        if (!users[uIdx].purchasedCourses.includes(cid)) {
          users[uIdx].purchasedCourses.push(cid);
        }
      }
      // Remove from courseBlocks
      if (users[uIdx].courseBlocks) {
        users[uIdx].courseBlocks = users[uIdx].courseBlocks.filter((id: string) => !code.courseIds.includes(id));
      }
      saveUsersDB(users);
    }

    // Update session
    if (token) {
      const updated: AuthUser = {
        ...user,
        purchasedCourses: [...new Set([...(user.purchasedCourses || []), ...code.courseIds])],
      };
      persist(updated, token);
    }

    return { success: true, message: `Code redeemed! ${code.courseIds.length} course${code.courseIds.length > 1 ? 's' : ''} unlocked.` };
  }, [user, token]);

  const revokePurchaseCode = useCallback((code: string) => {
    const codes = getCodesDB();
    const idx = codes.findIndex((c: any) => c.code === code);
    if (idx !== -1) {
      codes[idx].status = 'revoked';
      codes[idx].revokedAt = new Date().toISOString();
      saveCodesDB(codes);
      // Also remove the courses from the user's purchased list
      // (only if no other active codes cover them)
      const revokedCode = codes[idx];
      const userId = revokedCode.userId;
      const otherActiveCodes = codes.filter((c: any) =>
        c.userId === userId && c.status === 'active' && c.code !== code
      );
      const stillCovered = new Set<string>();
      otherActiveCodes.forEach((c: any) => c.courseIds.forEach((id: string) => stillCovered.add(id)));
      const coursesToRemove = revokedCode.courseIds.filter((id: string) => !stillCovered.has(id));
      if (coursesToRemove.length > 0) {
        const users = getUsersDB();
        const uIdx = users.findIndex(u => u.id === userId);
        if (uIdx !== -1) {
          users[uIdx].purchasedCourses = (users[uIdx].purchasedCourses || []).filter(
            (id: string) => !coursesToRemove.includes(id)
          );
          saveUsersDB(users);
          if (user && user.id === userId && token) {
            const updated: AuthUser = { ...user, purchasedCourses: (user.purchasedCourses || []).filter(id => !coursesToRemove.includes(id)) };
            persist(updated, token);
          }
        }
      }
    }
  }, [user, token]);

  const getPurchaseCodes = useCallback((userId?: string): PurchaseCode[] => {
    const codes = getCodesDB();
    // Mark expired codes
    const now = Date.now();
    let needsSave = false;
    const result = codes.map((c: any) => {
      if (c.status === 'active' && c.expiresAt && new Date(c.expiresAt).getTime() < now) {
        c.status = 'expired';
        needsSave = true;
      }
      return c;
    });
    if (needsSave) saveCodesDB(result);
    return (userId ? result.filter((c: any) => c.userId === userId) : result).map((c: any) => ({
      code:        c.code,
      userId:      c.userId,
      courseIds:   c.courseIds   || [],
      durationDays: c.durationDays || 0,
      createdAt:   c.createdAt,
      expiresAt:   c.expiresAt    || null,
      status:      c.status       || 'active',
      revokedAt:   c.revokedAt    || null,
      redeemed:     c.redeemed     || false,
      redeemedAt:   c.redeemedAt   || null,
    }));
  }, []);

  /* ═══════════════════════════════════════════════════════
     COURSE-SPECIFIC BLOCK
     ═══════════════════════════════════════════════════════ */

  const blockCourseForUser = useCallback((userId: string, courseId: string) => {
    const users = getUsersDB();
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      if (!users[idx].courseBlocks) users[idx].courseBlocks = [];
      if (!users[idx].courseBlocks.includes(courseId)) {
        users[idx].courseBlocks.push(courseId);
        saveUsersDB(users);
      }
    }
  }, []);

  const unblockCourseForUser = useCallback((userId: string, courseId: string) => {
    const users = getUsersDB();
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx].courseBlocks = (users[idx].courseBlocks || []).filter((id: string) => id !== courseId);
      saveUsersDB(users);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, signup, login, logout, updateProfile, changePassword, hasPurchased, purchaseContent, getAllUsers, blockUser, unblockUser, deleteUser, grantCourseAccess, revokeCourseAccess, generatePurchaseCode, redeemPurchaseCode, revokePurchaseCode, getPurchaseCodes, blockCourseForUser, unblockCourseForUser }}>
      {children}
    </AuthContext.Provider>
  );
}

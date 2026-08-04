/**
 * ============================================================
 * useAdminUsers — Admin hook for user & session management
 *
 * Wraps the AuthContext admin functions and provides:
 *  - Live user list with a refresh counter
 *  - Session statistics (total, active now, blocked, purchases)
 *  - Purchase code management (generate, revoke, list)
 *  - Course-specific block / unblock
 *  - Convenience wrappers that auto-refresh after mutations
 * ============================================================
 */

import { useState, useMemo, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { AdminUser, PurchaseCode } from "@/contexts/auth.types";

/** A user is considered "online" if they logged in within this window */
const SESSION_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

export interface UserSessionStats {
  total:          number;
  activeNow:      number;
  blocked:        number;
  totalPurchases: number;
  withPurchases:  number;
  activeCodes:     number;
}

export function useAdminUsers() {
  const {
    getAllUsers, blockUser, unblockUser,
    deleteUser, grantCourseAccess, revokeCourseAccess,
    generatePurchaseCode, redeemPurchaseCode, revokePurchaseCode, getPurchaseCodes,
    blockCourseForUser, unblockCourseForUser,
    user: currentUser,
  } = useAuth();

  // Bump this counter after every mutation to force a re-read
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick(t => t + 1), []);

  // Auto-poll every 15 s so the admin sees live session updates
  useEffect(() => {
    const id = setInterval(refresh, 15_000);
    return () => clearInterval(id);
  }, [refresh]);

  const users: AdminUser[] = useMemo(() => {
    // tick is read here so the memo re-computes when refresh() fires
    void tick;
    return getAllUsers();
  }, [getAllUsers, tick]);

  const allCodes: PurchaseCode[] = useMemo(() => {
    void tick;
    return getPurchaseCodes();
  }, [getPurchaseCodes, tick]);

  const isOnline = useCallback((u: AdminUser) => {
    if (!u.lastLogin) return false;
    return Date.now() - new Date(u.lastLogin).getTime() < SESSION_WINDOW_MS;
  }, []);

  const stats: UserSessionStats = useMemo(() => {
    let activeNow     = 0;
    let blocked       = 0;
    let totalPurchases = 0;
    let withPurchases  = 0;

    for (const u of users) {
      if (u.status === "blocked") { blocked++; continue; }
      if (isOnline(u)) activeNow++;
      const count = u.purchasedCourses.length;
      totalPurchases += count;
      if (count > 0) withPurchases++;
    }

    const activeCodes = allCodes.filter(c => c.status === "active").length;

    return { total: users.length, activeNow, blocked, totalPurchases, withPurchases, activeCodes };
  }, [users, isOnline, allCodes]);

  /** Get purchase codes for a specific user */
  const getUserCodes = useCallback((userId: string): PurchaseCode[] => {
    return allCodes.filter(c => c.userId === userId);
  }, [allCodes]);

  // ── Wrapped mutations (auto-refresh after) ──────────────
  const handleBlock = useCallback((id: string) => {
    blockUser(id);
    refresh();
  }, [blockUser, refresh]);

  const handleUnblock = useCallback((id: string) => {
    unblockUser(id);
    refresh();
  }, [unblockUser, refresh]);

  const handleDelete = useCallback((id: string) => {
    deleteUser(id);
    refresh();
  }, [deleteUser, refresh]);

  const handleGrant = useCallback((id: string, courseId: string) => {
    grantCourseAccess(id, courseId);
    refresh();
  }, [grantCourseAccess, refresh]);

  const handleRevoke = useCallback((id: string, courseId: string) => {
    revokeCourseAccess(id, courseId);
    refresh();
  }, [revokeCourseAccess, refresh]);

  const handleGenerateCode = useCallback((userId: string, courseIds: string[], durationDays: number): PurchaseCode => {
    const code = generatePurchaseCode(userId, courseIds, durationDays);
    refresh();
    return code;
  }, [generatePurchaseCode, refresh]);

  const handleRevokeCode = useCallback((code: string) => {
    revokePurchaseCode(code);
    refresh();
  }, [revokePurchaseCode, refresh]);

  const handleBlockCourse = useCallback((userId: string, courseId: string) => {
    blockCourseForUser(userId, courseId);
    refresh();
  }, [blockCourseForUser, refresh]);

  const handleUnblockCourse = useCallback((userId: string, courseId: string) => {
    unblockCourseForUser(userId, courseId);
    refresh();
  }, [unblockCourseForUser, refresh]);

  return {
    users,
    allCodes,
    stats,
    isOnline,
    currentUser,
    refresh,
    getUserCodes,
    blockUser:          handleBlock,
    unblockUser:        handleUnblock,
    deleteUser:         handleDelete,
    grantCourseAccess:  handleGrant,
    revokeCourseAccess: handleRevoke,
    generatePurchaseCode: handleGenerateCode,
    redeemPurchaseCode,
    revokePurchaseCode:   handleRevokeCode,
    blockCourseForUser:   handleBlockCourse,
    unblockCourseForUser: handleUnblockCourse,
  };
}

/**
 * Notification Context
 * - localStorage persistence per user
 * - real-time via events from other parts of the app
 * - sorted newest first
 * - navigation support via link field
 */

import {
  createContext, useContext, useState,
  useEffect, useCallback, type ReactNode,
} from "react";
import { useAuth } from "@/contexts/AuthContext";

/* ── Types ─────────────────────────────────────────────── */
export type NotificationType =
  | "course"
  | "quiz"
  | "certificate"
  | "payment"
  | "note"
  | "system"
  | "live";

export interface Notification {
  id:        string;
  type:      NotificationType;
  title:     string;
  body:      string;
  time:      string;        // ISO string
  read:      boolean;
  link?:     string;        // route to navigate on tap
  userId:    string;        // owner's user id
}

interface NotificationContextType {
  notifications:  Notification[];
  unreadCount:    number;
  add:            (n: Omit<Notification, "id" | "time" | "read" | "userId">) => void;
  markRead:       (id: string) => void;
  markAllRead:    () => void;
  remove:         (id: string) => void;
  clearAll:       () => void;
}

/* ── Helpers ────────────────────────────────────────────── */
const BASE_KEY = "tally_notifications";

function storageKey(userId: string) {
  return `${BASE_KEY}_${userId}`;
}

function lsLoad(userId: string): Notification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function lsSave(userId: string, data: Notification[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(storageKey(userId), JSON.stringify(data)); } catch {}
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60)  return "just now";
  const m = Math.floor(s / 60);
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/* ── Context ────────────────────────────────────────────── */
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  /* Load when user changes */
  useEffect(() => {
    if (!user) { setNotifications([]); return; }
    const stored = lsLoad(user.id);
    setNotifications(stored.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()));
  }, [user?.id]);

  /* Persist on change */
  useEffect(() => {
    if (!user) return;
    lsSave(user.id, notifications);
  }, [notifications, user?.id]);

  /* Seed initial notifications for new users */
  useEffect(() => {
    if (!user) return;
    const stored = lsLoad(user.id);
    if (stored.length === 0) {
      const seed: Notification[] = [
        {
          id: "seed-1",
          type: "course",
          title: "Welcome to Tally Hub Pro! 🎉",
          body: "Start with the free Tally ERP course to begin your journey.",
          time: new Date(Date.now() - 60_000).toISOString(),
          read: false,
          link: "/learn",
          userId: user.id,
        },
        {
          id: "seed-2",
          type: "quiz",
          title: "Quiz Available",
          body: "Test your Tally knowledge with our interactive quiz.",
          time: new Date(Date.now() - 3_600_000).toISOString(),
          read: false,
          link: "/quiz",
          userId: user.id,
        },
        {
          id: "seed-3",
          type: "note",
          title: "Study Notes Ready",
          body: "New Tally & GST notes are available to download.",
          time: new Date(Date.now() - 86_400_000).toISOString(),
          read: false,
          link: "/notes",
          userId: user.id,
        },
      ];
      setNotifications(seed);
    }
  }, [user?.id]);

  const add = useCallback((n: Omit<Notification, "id" | "time" | "read" | "userId">) => {
    if (!user) return;
    const newN: Notification = {
      ...n,
      id:     `notif_${Date.now()}`,
      time:   new Date().toISOString(),
      read:   false,
      userId: user.id,
    };
    setNotifications(prev => [newN, ...prev].slice(0, 50)); // keep last 50
  }, [user]);

  const markRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const remove = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications, unreadCount,
      add, markRead, markAllRead, remove, clearAll,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used inside <NotificationProvider>");
  return ctx;
}

export { relativeTime };

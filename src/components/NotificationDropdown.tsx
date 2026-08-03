import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { useNotifications, relativeTime, type NotificationType } from "@/contexts/NotificationContext";
import {
  GraduationCap, HelpCircle, Award, CreditCard,
  FileText, Bell, Radio, X, CheckCheck, Trash2,
} from "lucide-react";

/* ── Icon per type ──────────────────────────────────────── */
const TYPE_CONFIG: Record<NotificationType, { icon: React.ElementType; color: string; bg: string }> = {
  course:      { icon: GraduationCap, color: "#1a3a8f", bg: "#e8f0fe" },
  quiz:        { icon: HelpCircle,    color: "#7c3aed", bg: "#f5f3ff" },
  certificate: { icon: Award,         color: "#b45309", bg: "#fef9c3" },
  payment:     { icon: CreditCard,    color: "#059669", bg: "#ecfdf5" },
  note:        { icon: FileText,      color: "#ea580c", bg: "#fff7ed" },
  live:        { icon: Radio,         color: "#dc2626", bg: "#fef2f2" },
  system:      { icon: Bell,          color: "#6b7280", bg: "#f3f4f6" },
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export function NotificationDropdown({ open, onClose }: Props) {
  const navigate = useNavigate();
  const { notifications, unreadCount, markRead, markAllRead, remove, clearAll } = useNotifications();

  const handleTap = (id: string, link?: string) => {
    markRead(id);
    if (link) {
      navigate({ to: link as any });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="notif-panel"
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ type: "spring", damping: 24, stiffness: 320 }}
          onClick={e => e.stopPropagation()}
          className="fixed top-[68px] right-3 z-[60] w-[340px] max-w-[calc(100vw-1.5rem)] rounded-2xl shadow-elegant overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.97)",
            border: "1px solid rgba(0,0,0,0.07)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary/70 px-2 py-1 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  All read
                </button>
              )}
              <button
                onClick={onClose}
                className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <X className="h-3.5 w-3.5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <Bell className="h-10 w-10 text-gray-200 mb-3" />
                <p className="text-sm font-bold text-gray-400">No notifications yet</p>
                <p className="text-xs text-gray-300 mt-1">We'll notify you when something happens</p>
              </div>
            ) : (
              notifications.map((n, idx) => {
                const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.system;
                const Icon = cfg.icon;
                return (
                  <div key={n.id}>
                    <motion.button
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => handleTap(n.id, n.link)}
                      className="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
                      style={{ opacity: n.read ? 0.65 : 1 }}
                    >
                      {/* Icon */}
                      <div
                        className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: cfg.bg }}
                      >
                        <Icon className="h-4 w-4" style={{ color: cfg.color }} />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-[13px] leading-snug ${n.read ? "font-medium text-gray-500" : "font-bold text-gray-900"}`}>
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5 leading-snug line-clamp-2">{n.body}</p>
                        <p className="text-[10px] text-gray-300 mt-1 font-medium">{relativeTime(n.time)}</p>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={e => { e.stopPropagation(); remove(n.id); }}
                        className="h-6 w-6 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100 mt-0.5"
                        style={{ opacity: 0.4 }}
                      >
                        <Trash2 className="h-3 w-3 text-gray-400" />
                      </button>
                    </motion.button>
                    {idx < notifications.length - 1 && (
                      <div className="h-px bg-gray-100 mx-4" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between">
              <p className="text-[10px] text-gray-300">{notifications.length} notifications</p>
              <button
                onClick={clearAll}
                className="text-[11px] text-gray-400 hover:text-gray-600 font-medium transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

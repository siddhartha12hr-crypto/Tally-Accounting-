import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BookOpen, User, FileText, Gift } from "lucide-react";
import { motion } from "framer-motion";

const ORANGE = "#FF6B00";

const items = [
  { to: "/",         label: "Home",    icon: Home     },
  { to: "/learn",    label: "Learn",   icon: BookOpen },
  { to: "/it-hero",  label: "IT Hero", icon: Gift,  special: true },
  { to: "/notes",    label: "Notes",   icon: FileText },
  { to: "/contact",  label: "Profile", icon: User     },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50" style={{ margin: 0, padding: 0 }}>
      <div
        className="w-full flex items-center justify-around border-t border-border/50"
        style={{
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(20px)",
          margin: 0,
          padding: "8px 0 0 0",
          paddingBottom: "max(env(safe-area-inset-bottom), 8px)",
        }}
      >
        {items.map(({ to, label, icon: Icon, ...rest }) => {
          const isSpecial = (rest as any).special === true;
          const active    = to === "/" ? pathname === "/" : pathname.startsWith(to);

          if (isSpecial) {
            return (
              <Link key={to} to={to} style={{ flex: 1 }}>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center gap-1 py-1"
                >
                  {/* Lifted orange circle for IT Hero */}
                  <div
                    className="h-12 w-12 rounded-full flex items-center justify-center shadow-md -mt-5"
                    style={{
                      background: active
                        ? `linear-gradient(135deg, ${ORANGE}, #9B1C1C)`
                        : `linear-gradient(135deg, ${ORANGE}, #EA580C)`,
                      boxShadow: `0 4px 16px ${ORANGE}55`,
                    }}
                  >
                    <Icon className="h-6 w-6 text-white" strokeWidth={2} />
                  </div>
                  <span
                    className="text-[11px] font-bold"
                    style={{ color: active ? ORANGE : "#9CA3AF" }}
                  >
                    {label}
                  </span>
                </motion.div>
              </Link>
            );
          }

          return (
            <Link key={to} to={to} style={{ flex: 1 }}>
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center gap-1 py-1"
              >
                <Icon
                  className="h-6 w-6 transition-all duration-200"
                  strokeWidth={active ? 2.5 : 2}
                  style={{ color: active ? ORANGE : "#9CA3AF" }}
                />
                <span
                  className="text-[11px] font-bold transition-all duration-200"
                  style={{ color: active ? ORANGE : "#9CA3AF" }}
                >
                  {label}
                </span>
                {active && (
                  <motion.div
                    layoutId="nav-dot"
                    className="h-1 w-1 rounded-full"
                    style={{ background: ORANGE }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

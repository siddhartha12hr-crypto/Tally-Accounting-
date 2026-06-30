import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BookOpen, User, FileText } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { to: "/",        label: "Home",    icon: Home     },
  { to: "/learn",   label: "Learn",   icon: BookOpen },
  { to: "/notes",   label: "Notes",   icon: FileText },
  { to: "/contact", label: "Profile", icon: User     },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50"
      style={{ margin: 0, padding: 0 }}
    >
      <div
        className="w-full flex items-center justify-around backdrop-blur-2xl border-t border-border/50"
        style={{
          background: "rgba(255,255,255,0.92)",
          margin: 0,
          padding: "8px 0 0 0",
          paddingBottom: "max(env(safe-area-inset-bottom), 8px)",
        }}
      >
        {items.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link key={to} to={to} style={{ flex: 1 }}>
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="relative flex flex-col items-center gap-1 py-1"
              >
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-2xl gradient-hero shadow-glow"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}

                <div className="relative z-10">
                  <Icon
                    className={`h-6 w-6 transition-all duration-200 ${
                      active ? "text-white drop-shadow-lg" : "text-muted-foreground"
                    }`}
                    strokeWidth={active ? 2.5 : 2}
                  />
                </div>

                <motion.span
                  className={`relative z-10 text-[11px] font-bold transition-all duration-200 ${
                    active ? "text-white drop-shadow" : "text-muted-foreground"
                  }`}
                  animate={{ scale: active ? 1.05 : 1, y: active ? -1 : 0 }}
                >
                  {label}
                </motion.span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

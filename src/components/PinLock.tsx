import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Delete } from "lucide-react";
import { BottomNav } from "./BottomNav";

const CORRECT_PIN = "9090";

export function PinLock({ title, pin: correctPin = CORRECT_PIN, children }: { title: string; pin?: string; children: ReactNode }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const press = (d: string) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    setError(false);
    if (next.length === 4) {
      setTimeout(() => {
        if (next === correctPin) setUnlocked(true);
        else { setError(true); setPin(""); }
      }, 200);
    }
  };
  const back = () => setPin((p) => p.slice(0, -1));

  if (unlocked) return <>{children}</>;

  return (
    <div className="relative min-h-screen pb-28">
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-sm rounded-3xl glass shadow-elegant p-7 text-center"
      >
        <motion.div
          animate={{ rotate: [0, -8, 8, -6, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.5 }}
          className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl gradient-hero shadow-glow"
        >
          <Lock className="h-7 w-7 text-white" />
        </motion.div>
        <h2 className="text-xl font-black">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">Enter Access PIN</p>

        <div className="my-6 flex justify-center gap-3">
          {[0, 1, 2, 3].map((idx) => (
            <motion.div
              key={idx}
              animate={error ? { x: [0, -8, 8, -6, 6, 0] } : {}}
              className={`h-4 w-4 rounded-full border-2 ${
                pin.length > idx ? "border-primary gradient-saffron" : "border-border bg-transparent"
              }`}
            />
          ))}
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-3 text-sm font-semibold text-destructive"
            >
              Invalid PIN. Please try again.
            </motion.p>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-3 gap-2.5">
          {["1","2","3","4","5","6","7","8","9"].map((d) => (
            <button
              key={d}
              onClick={() => press(d)}
              className="h-14 rounded-2xl glass text-lg font-bold transition-all hover:shadow-glow active:scale-95"
            >{d}</button>
          ))}
          <div />
          <button onClick={() => press("0")} className="h-14 rounded-2xl glass text-lg font-bold transition-all hover:shadow-glow active:scale-95">0</button>
          <button onClick={back} className="h-14 rounded-2xl glass grid place-items-center transition-all hover:shadow-glow active:scale-95"><Delete className="h-5 w-5" /></button>
        </div>
      </motion.div>
    </div>
      <BottomNav />
    </div>
  );
}

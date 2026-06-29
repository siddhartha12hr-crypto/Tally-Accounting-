import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LogIn, User, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Tally Accounting Hub Pro" },
      { name: "description", content: "Login to access premium content" },
    ],
  }),
  component: LoginPage,
});

const SAVED_KEY = "tally_saved_identifiers";

function getSaved(): string[] {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [identifier,   setIdentifier]   = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);
  const [errorMsg,     setErrorMsg]     = useState("");
  const [suggestions,  setSuggestions]  = useState<string[]>([]);
  const [showSuggest,  setShowSuggest]  = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = getSaved();
    if (identifier.trim().length > 0) {
      const filtered = saved.filter(s => s.toLowerCase().includes(identifier.toLowerCase()));
      setSuggestions(filtered);
      setShowSuggest(filtered.length > 0);
    } else {
      setSuggestions(saved);
    }
  }, [identifier]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setShowSuggest(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (isAuthenticated) {
    navigate({ to: "/" });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!identifier.trim()) { setErrorMsg("Please enter your username, email or phone"); return; }
    if (!password.trim())   { setErrorMsg("Please enter your password"); return; }

    setIsLoading(true);
    const result = await login(identifier.trim(), password);
    setIsLoading(false);

    if (result.success) {
      toast.success(result.message || "Login successful!");
      navigate({ to: "/" });
    } else {
      setErrorMsg(result.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: "var(--color-background)" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }} className="w-full max-w-sm"
      >
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl mb-4 shadow-glow"
            style={{ background: "linear-gradient(135deg,#f59e0b,#ea580c)" }}>
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-black">Welcome Back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to Tally Accounting Hub</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl glass p-7 shadow-elegant">

          {/* Error banner */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="flex items-start gap-3 mb-5 px-4 py-3 rounded-2xl border"
                style={{ background: "#fef2f2", borderColor: "#fca5a5" }}
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: "#dc2626" }} />
                <p className="text-sm font-semibold" style={{ color: "#dc2626" }}>{errorMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">

            {/* Identifier with suggestion dropdown */}
            <div>
              <Label className="text-sm font-bold">Username / Email / Phone</Label>
              <div className="relative mt-2" ref={wrapRef}>
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                <input
                  value={identifier}
                  onChange={e => { setIdentifier(e.target.value); setErrorMsg(""); }}
                  onFocus={() => {
                    const saved = getSaved();
                    if (saved.length > 0) { setSuggestions(saved); setShowSuggest(true); }
                  }}
                  placeholder="username, email or phone number"
                  autoComplete="off"
                  disabled={isLoading}
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
                <AnimatePresence>
                  {showSuggest && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-border shadow-elegant z-50 overflow-hidden"
                      style={{ background: "var(--color-card)" }}
                    >
                      <p className="text-[10px] font-bold text-muted-foreground px-3 pt-2 pb-1 uppercase tracking-wide">
                        Saved accounts
                      </p>
                      {suggestions.map(s => (
                        <button key={s} type="button"
                          onMouseDown={() => { setIdentifier(s); setShowSuggest(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-accent transition-colors text-left"
                        >
                          <div className="h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-black"
                            style={{ background: "linear-gradient(135deg,#1a3a8f,#0e6b8f)" }}>
                            {s[0].toUpperCase()}
                          </div>
                          <span className="text-sm font-medium truncate">{s}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Password */}
            <div>
              <Label className="text-sm font-bold">Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrorMsg(""); }}
                  placeholder="Enter your password"
                  autoComplete="off"
                  disabled={isLoading}
                  className="w-full h-10 pl-10 pr-10 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={isLoading}
              className="w-full rounded-xl text-white font-bold shadow-glow"
              style={{ background: "linear-gradient(135deg,#1a3a8f,#0e6b8f)" }}>
              {isLoading
                ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Signing in…</>
                : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <button onClick={() => navigate({ to: "/signup" })}
              className="font-bold text-primary hover:underline">
              Sign Up
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          🔒 Your credentials are stored securely
        </p>
      </motion.div>
    </div>
  );
}

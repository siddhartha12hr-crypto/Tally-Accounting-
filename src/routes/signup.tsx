import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  UserPlus, User, Mail, Phone, Lock,
  Eye, EyeOff, Loader2, Camera, X,
} from "lucide-react";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — Tally Accounting Hub Pro" },
      { name: "description", content: "Create your account" },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { signup, updateProfile, isAuthenticated } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [avatar,          setAvatar]          = useState<string | null>(null);
  const [fullName,        setFullName]        = useState("");
  const [username,        setUsername]        = useState("");
  const [email,           setEmail]           = useState("");
  const [phone,           setPhone]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword,    setShowPassword]    = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [isLoading,       setIsLoading]       = useState(false);
  const [avatarHover,     setAvatarHover]     = useState(false);

  if (isAuthenticated) {
    navigate({ to: "/" });
    return null;
  }

  /* ── Avatar picker ── */
  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5 MB"); return; }
    const reader = new FileReader();
    reader.onload = ev => setAvatar(ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  /* ── initials fallback ── */
  const initials = fullName.trim()
    ? fullName.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : username.trim() ? username[0].toUpperCase() : "?";

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim())    { toast.error("Full name is required"); return; }
    if (!username.trim())    { toast.error("Username is required"); return; }
    if (username.trim().length < 3) { toast.error("Username must be at least 3 characters"); return; }
    if (!email.trim() && !phone.trim()) { toast.error("Email or phone number is required"); return; }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address"); return;
    }
    if (!password.trim())    { toast.error("Password is required"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (password !== confirmPassword) { toast.error("Passwords do not match"); return; }

    setIsLoading(true);
    const result = await signup({
      fullName: fullName.trim(),
      username: username.trim(),
      email:    email.trim()  || undefined,
      phone:    phone.trim()  || undefined,
      password,
    });

    if (result.success && avatar) {
      updateProfile({ avatar });
    }

    setIsLoading(false);

    if (result.success) {
      toast.success(result.message || "Account created successfully!");
      navigate({ to: "/" });
    } else {
      toast.error(result.message || "Signup failed. Please try again.");
    }
  };

  /* ── Create Demo Account ── */
  const handleCreateDemoAccount = async () => {
    setIsLoading(true);
    
    const demoData = {
      fullName: "Demo User",
      username: "demo",
      email: "demo@example.com",
      phone: "1234567890",
      password: "demo123",
    };

    const result = await signup(demoData);
    setIsLoading(false);

    if (result.success) {
      toast.success("Demo account created and logged in!");
      navigate({ to: "/" });
    } else {
      if (result.message?.includes("already")) {
        // Demo account already exists, try to login
        toast.info("Demo account already exists. Redirecting to login...");
        setTimeout(() => navigate({ to: "/login" }), 1000);
      } else {
        toast.error(result.message || "Failed to create demo account");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: "var(--color-background)" }}>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Brand */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black">Create Account</h1>
          <p className="text-sm text-muted-foreground mt-1">Join Tally Accounting Hub Pro</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl glass p-7 shadow-elegant">

          {/* ── Profile picture picker ── */}
          <div className="flex flex-col items-center mb-6">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
              Profile Photo <span className="font-normal normal-case">(optional)</span>
            </p>

            <div
              className="relative cursor-pointer select-none"
              onMouseEnter={() => setAvatarHover(true)}
              onMouseLeave={() => setAvatarHover(false)}
              onClick={() => !isLoading && fileRef.current?.click()}
            >
              {/* Circle */}
              <div className="h-20 w-20 rounded-full overflow-hidden shadow-md"
                style={{ border: "2.5px solid var(--color-primary)" }}>
                {avatar ? (
                  <img src={avatar} alt="avatar preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-2xl font-black"
                    style={{ background: "linear-gradient(135deg,#1a3a8f,#0e6b8f)" }}>
                    {initials}
                  </div>
                )}
              </div>

              {/* Hover overlay */}
              <AnimatePresence>
                {avatarHover && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.5)" }}
                  >
                    <Camera className="h-5 w-5 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Camera badge */}
              <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full flex items-center justify-center shadow"
                style={{ background: "linear-gradient(135deg,#f59e0b,#ea580c)" }}>
                <Camera className="h-3 w-3 text-white" />
              </div>
            </div>

            {/* Hidden input */}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />

            {/* Actions */}
            <div className="flex gap-2 mt-2.5">
              <button type="button" onClick={() => fileRef.current?.click()} disabled={isLoading}
                className="text-xs font-semibold px-3 py-1 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors">
                {avatar ? "Change" : "Upload Photo"}
              </button>
              {avatar && (
                <button type="button" onClick={() => setAvatar(null)} disabled={isLoading}
                  className="text-xs font-semibold px-3 py-1 rounded-full border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-1">
                  <X className="h-3 w-3" /> Remove
                </button>
              )}
            </div>
          </div>

          {/* ── Form fields ── */}
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">

            {/* Full Name */}
            <div>
              <Label className="text-sm font-bold">Full Name</Label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={fullName} onChange={e => setFullName(e.target.value)}
                  placeholder="John Doe" className="pl-10 rounded-xl" disabled={isLoading} />
              </div>
            </div>

            {/* Username */}
            <div>
              <Label className="text-sm font-bold">Username</Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">@</span>
                <Input value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="johndoe" className="pl-8 rounded-xl" disabled={isLoading}
                  autoComplete="off" />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label className="text-sm font-bold">
                Email <span className="text-muted-foreground font-normal">(or phone)</span>
              </Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" className="pl-10 rounded-xl" disabled={isLoading}
                  autoComplete="off" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <Label className="text-sm font-bold">
                Phone <span className="text-muted-foreground font-normal">(or email)</span>
              </Label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="9876543210" className="pl-10 rounded-xl" disabled={isLoading}
                  autoComplete="off" />
              </div>
            </div>

            {/* Password */}
            <div>
              <Label className="text-sm font-bold">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type={showPassword ? "text" : "password"} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 6 characters" className="pl-10 pr-10 rounded-xl" disabled={isLoading}
                  autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <Label className="text-sm font-bold">Confirm Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type={showConfirm ? "text" : "password"} value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password" className="pl-10 pr-10 rounded-xl" disabled={isLoading}
                  autoComplete="new-password" />
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Password strength bar */}
            {password.length > 0 && (
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-1 flex-1 rounded-full transition-all"
                    style={{
                      background: password.length > i * 2
                        ? password.length < 6 ? "#f59e0b" : "#22c55e"
                        : "var(--color-border)"
                    }} />
                ))}
              </div>
            )}

            <Button type="submit" disabled={isLoading}
              className="w-full rounded-xl text-white font-bold shadow-glow mt-1"
              style={{ background: "linear-gradient(135deg,#f59e0b,#ea580c)" }}>
              {isLoading
                ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating account…</>
                : "Create Account"}
            </Button>

            {/* Demo Account Button */}
            <Button
              type="button"
              onClick={handleCreateDemoAccount}
              disabled={isLoading}
              variant="outline"
              className="w-full rounded-xl border-2 font-bold"
            >
              🎭 Create Demo Account
            </Button>
          </form>

          <div className="mt-5 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <button onClick={() => navigate({ to: "/login" })}
              className="font-bold text-primary hover:underline">
              Login
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          🔒 Your data is saved securely
        </p>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          💡 Demo account creates: <span className="font-bold">demo</span> / <span className="font-bold">demo123</span>
        </p>
      </motion.div>
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  UserPlus, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Shield,
  ArrowRight,
  Check
} from "lucide-react";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — Tally Accounting Hub Pro" },
      { name: "description", content: "Create your account to access premium content" },
    ],
  }),
  component: SignupPage,
});

// Simulated OTP service - In production, this would be a backend API
const OTP_SERVICE_KEY = import.meta.env.VITE_OTP_SERVICE_KEY || "";
const OTP_ENABLED = OTP_SERVICE_KEY.trim().length > 0;

function SignupPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  
  const [step, setStep] = useState<"signup" | "otp">("signup");
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // OTP state
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState("");

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate({ to: "/" });
  }

  // Generate 6-digit OTP
  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Simulate sending OTP email
  const sendOtp = async (userEmail: string) => {
    const otpCode = generateOtp();
    setGeneratedOtp(otpCode);
    
    // In production, this would call your email service
    console.log(`📧 OTP sent to ${userEmail}: ${otpCode}`);
    
    // Show OTP in toast for demo purposes
    toast.success(
      `OTP sent to ${userEmail}`,
      { 
        description: `For demo: Your OTP is ${otpCode}`,
        duration: 10000 
      }
    );
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }
    
    if (username.trim().length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }
    
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate account creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // If OTP is enabled, send OTP and go to verification step
      if (OTP_ENABLED) {
        await sendOtp(email);
        setStep("otp");
        toast.success("Account created! Please verify your email.");
      } else {
        // If OTP is disabled, directly login
        const success = await login(email, password);
        
        if (success) {
          toast.success("Account created successfully!");
          navigate({ to: "/" });
        } else {
          toast.error("Failed to create account. Please try again.");
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only last character
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    
    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    document.getElementById(`otp-${lastIndex}`)?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const enteredOtp = otp.join("");
    
    if (enteredOtp.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verify OTP
      if (enteredOtp === generatedOtp) {
        // OTP correct, login user
        const success = await login(email, password);
        
        if (success) {
          toast.success("Email verified! Welcome aboard! 🎉");
          navigate({ to: "/" });
        } else {
          toast.error("Failed to login. Please try again.");
        }
      } else {
        toast.error("Invalid OTP. Please try again.");
        setOtp(["", "", "", "", "", ""]);
        document.getElementById("otp-0")?.focus();
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await sendOtp(email);
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0")?.focus();
    } catch (error) {
      toast.error("Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="min-h-[80vh] flex items-center justify-center py-8">
        <AnimatePresence mode="wait">
          {step === "signup" ? (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              {/* Signup Card */}
              <div className="rounded-3xl glass p-8 shadow-elegant">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full gradient-hero mb-4 shadow-glow">
                    <UserPlus className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-black text-gradient mb-2">Create Account</h1>
                  <p className="text-sm text-muted-foreground">
                    Sign up to access premium courses and videos
                  </p>
                </div>

                {/* OTP Status Badge */}
                <div className={`mb-6 p-3 rounded-xl border-2 ${
                  OTP_ENABLED 
                    ? "bg-green-500/10 border-green-500/30" 
                    : "bg-orange-500/10 border-orange-500/30"
                }`}>
                  <div className="flex items-center gap-2">
                    <Shield className={`h-4 w-4 ${
                      OTP_ENABLED ? "text-green-600" : "text-orange-600"
                    }`} />
                    <div className="flex-1">
                      <p className={`text-xs font-bold ${
                        OTP_ENABLED ? "text-green-600" : "text-orange-600"
                      }`}>
                        {OTP_ENABLED ? "Two-Factor Authentication Enabled" : "Two-Factor Authentication Disabled"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {OTP_ENABLED 
                          ? "Email verification required after signup" 
                          : "Email verification is optional"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSignup} className="space-y-5">
                  {/* Username Field */}
                  <div>
                    <Label htmlFor="username" className="text-sm font-bold">
                      Username
                    </Label>
                    <div className="relative mt-2">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="johndoe"
                        className="pl-10 rounded-xl"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <Label htmlFor="email" className="text-sm font-bold">
                      Email Address
                    </Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="pl-10 rounded-xl"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <Label htmlFor="password" className="text-sm font-bold">
                      Password
                    </Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password (min 6 characters)"
                        className="pl-10 pr-10 rounded-xl"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <Label htmlFor="confirmPassword" className="text-sm font-bold">
                      Confirm Password
                    </Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        className="pl-10 pr-10 rounded-xl"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-xl gradient-hero text-white shadow-glow font-bold"
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center text-sm">
                  <span className="text-muted-foreground">Already have an account? </span>
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/login" })}
                    className="font-bold text-primary hover:underline"
                  >
                    Login
                  </button>
                </div>
              </div>

              {/* Info Box */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 rounded-2xl glass p-4 text-center"
              >
                <p className="text-xs text-muted-foreground">
                  🔒 Your data is secure and encrypted
                </p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              {/* OTP Verification Card */}
              <div className="rounded-3xl glass p-8 shadow-elegant">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full gradient-hero mb-4 shadow-glow">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-black text-gradient mb-2">Verify Your Email</h1>
                  <p className="text-sm text-muted-foreground">
                    We've sent a 6-digit code to
                  </p>
                  <p className="text-sm font-bold text-primary mt-1">{email}</p>
                </div>

                {/* OTP Form */}
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  {/* OTP Input */}
                  <div>
                    <Label className="text-sm font-bold mb-3 block text-center">
                      Enter Verification Code
                    </Label>
                    <div className="flex gap-2 justify-center">
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          onPaste={index === 0 ? handleOtpPaste : undefined}
                          className="w-12 h-14 text-center text-2xl font-bold rounded-xl"
                          disabled={isLoading}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Verify Button */}
                  <Button
                    type="submit"
                    disabled={isLoading || otp.join("").length !== 6}
                    className="w-full rounded-xl gradient-hero text-white shadow-glow font-bold"
                  >
                    {isLoading ? (
                      "Verifying..."
                    ) : (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        Verify Email
                      </>
                    )}
                  </Button>

                  {/* Resend OTP */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isLoading}
                      className="text-sm font-bold text-primary hover:underline disabled:opacity-50"
                    >
                      Resend Code
                    </button>
                  </div>
                </form>

                {/* Back Button */}
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => setStep("signup")}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Back to signup
                  </button>
                </div>
              </div>

              {/* Info Box */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 rounded-2xl glass p-4"
              >
                <p className="text-xs text-muted-foreground text-center">
                  💡 Didn't receive the code? Check your spam folder or click resend
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}

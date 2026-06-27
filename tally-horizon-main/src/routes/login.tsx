import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Tally Accounting Hub Pro" },
      { name: "description", content: "Login to access premium content" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const search = useSearch({ from: "/login" }) as { redirect?: string };
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate({ to: search.redirect || "/" });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    
    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        toast.success("Login successful!");
        // Redirect to the page they were trying to access, or home
        navigate({ to: search.redirect || "/" });
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail("demo@tallyacademy.com");
    setPassword("demo123");
    
    setIsLoading(true);
    
    try {
      const success = await login("demo@tallyacademy.com", "demo123");
      
      if (success) {
        toast.success("Demo login successful!");
        navigate({ to: search.redirect || "/" });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="min-h-[80vh] flex items-center justify-center py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Login Card */}
          <div className="rounded-3xl glass p-8 shadow-elegant">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full gradient-hero mb-4 shadow-glow">
                <LogIn className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-black text-gradient mb-2">Welcome Back</h1>
              <p className="text-sm text-muted-foreground">
                Login to access premium courses and videos
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
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
                    placeholder="Enter your password"
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

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl gradient-hero text-white shadow-glow font-bold"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-3 text-muted-foreground font-semibold">
                  OR
                </span>
              </div>
            </div>

            {/* Demo Login */}
            <Button
              type="button"
              variant="outline"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full rounded-xl font-bold"
            >
              Try Demo Account
            </Button>

            {/* Additional Info */}
            <div className="mt-6 text-center text-xs text-muted-foreground">
              <p>Demo credentials work for testing purposes</p>
              <p className="mt-2 font-semibold text-primary">
                Any email/password combination will work for demo
              </p>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <button
                type="button"
                onClick={() => navigate({ to: "/signup" })}
                className="font-bold text-primary hover:underline"
              >
                Sign Up
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
      </div>
    </AppShell>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { toast } from "sonner";
import {
  Camera, Crown, ChevronRight, ChevronLeft,
  BookOpen, Target, Bookmark, X,
  UserCircle, Lock, Award, ShieldCheck, Info,
  Eye, EyeOff, CheckCircle2, Download, Share2,
  GraduationCap, FileText, Mail, Globe,
} from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Profile — Tally Hub Pro" }] }),
  component: Profile,
});

const ORANGE = "#EA580C";
const ORANGE_LIGHT = "#FFF3E8";

/* ══════════════════════════════════════════
   MODAL SHELL — slides up from bottom
══════════════════════════════════════════ */
function Modal({
  open, onClose, title, children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[91] bg-white rounded-t-3xl shadow-2xl max-h-[92vh] flex flex-col"
          >
            {/* Handle */}
            <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mt-3 mb-1 flex-shrink-0" />
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-base font-black text-gray-900">{title}</h2>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════
   CHANGE PASSWORD MODAL
══════════════════════════════════════════ */
function ChangePasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { changePassword } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext]       = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = next.length === 0 ? 0 : next.length < 6 ? 1 : next.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Good", "Strong"][strength];
  const strengthColor = ["", "#EF4444", "#F59E0B", "#22C55E"][strength];

  const reset = () => { setCurrent(""); setNext(""); setConfirm(""); setLoading(false); };

  const handleSave = async () => {
    if (!current) { toast.error("Enter your current password"); return; }
    if (next.length < 6) { toast.error("New password must be at least 6 characters"); return; }
    if (next !== confirm) { toast.error("Passwords don't match"); return; }
    setLoading(true);
    const res = await changePassword(current, next);
    setLoading(false);
    if (res.success) {
      toast.success(res.message);
      reset();
      onClose();
    } else {
      toast.error(res.message);
    }
  };

  const Field = ({
    label, value, onChange, show, setShow, placeholder,
  }: {
    label: string; value: string; onChange: (v: string) => void;
    show: boolean; setShow: (v: boolean) => void; placeholder: string;
  }) => (
    <div>
      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</label>
      <div className="relative mt-1.5">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 text-sm font-semibold outline-none pr-12 focus:border-orange-400 transition-colors"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2"
        >
          {show ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
        </button>
      </div>
    </div>
  );

  return (
    <Modal open={open} onClose={() => { reset(); onClose(); }} title="Change Password">
      <div className="px-5 py-4 space-y-4">
        <Field label="Current Password" value={current} onChange={setCurrent}
          show={showCurrent} setShow={setShowCurrent} placeholder="Enter current password" />
        <Field label="New Password" value={next} onChange={setNext}
          show={showNext} setShow={setShowNext} placeholder="Enter new password" />

        {/* Strength */}
        {next.length > 0 && (
          <div>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-1.5 flex-1 rounded-full transition-all"
                  style={{ background: i <= strength ? strengthColor : "#E5E7EB" }} />
              ))}
            </div>
            <p className="text-xs font-semibold mt-1" style={{ color: strengthColor }}>{strengthLabel}</p>
          </div>
        )}

        <Field label="Confirm Password" value={confirm} onChange={setConfirm}
          show={showConfirm} setShow={setShowConfirm} placeholder="Re-enter new password" />

        {confirm && next !== confirm && (
          <p className="text-xs text-red-500 font-semibold">Passwords don't match</p>
        )}
        {confirm && next === confirm && confirm.length > 0 && (
          <p className="text-xs text-green-500 font-semibold flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Passwords match
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-4 rounded-2xl text-white font-black text-sm mt-2 disabled:opacity-60"
          style={{ background: `linear-gradient(135deg, ${ORANGE}, #9B1C1C)` }}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </Modal>
  );
}

/* ══════════════════════════════════════════
   CERTIFICATES MODAL
══════════════════════════════════════════ */
function CertificatesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const { courses } = useData();

  const purchasedCourses = courses.filter(c =>
    user?.purchasedCourses?.includes(c.id)
  );

  return (
    <Modal open={open} onClose={onClose} title="My Certificates">
      <div className="px-5 py-4">
        {purchasedCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-base font-black text-gray-800">No Certificates Yet</h3>
            <p className="text-sm text-gray-400 mt-1">Complete a course to earn your first certificate.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {purchasedCourses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-2xl p-4 flex items-center gap-4"
                style={{ background: ORANGE_LIGHT, border: `1px solid ${ORANGE}20` }}
              >
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${ORANGE}, #9B1C1C)` }}
                >
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-gray-900 truncate">{course.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{course.instructor}</p>
                  <p className="text-[10px] font-bold mt-1" style={{ color: ORANGE }}>
                    Certificate #{course.id.slice(-6).toUpperCase()}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => toast.info("Certificate download coming soon!")}
                    className="h-8 w-8 rounded-xl flex items-center justify-center"
                    style={{ background: `${ORANGE}15` }}
                  >
                    <Download className="h-3.5 w-3.5" style={{ color: ORANGE }} />
                  </button>
                  <button
                    onClick={() => { navigator.clipboard.writeText(`Certificate-${course.id}`); toast.success("Certificate ID copied!"); }}
                    className="h-8 w-8 rounded-xl flex items-center justify-center"
                    style={{ background: `${ORANGE}15` }}
                  >
                    <Share2 className="h-3.5 w-3.5" style={{ color: ORANGE }} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ══════════════════════════════════════════
   PRIVACY POLICY MODAL
══════════════════════════════════════════ */
function PrivacyPolicyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Privacy Policy">
      <div className="px-5 py-4 space-y-5 text-sm text-gray-600 leading-relaxed">
        <p className="text-xs text-gray-400 font-semibold">Last updated: July 2026</p>

        {[
          {
            title: "1. Information We Collect",
            body: "We collect information you provide directly to us, such as your name, email address, phone number, and profile picture when you create an account.",
          },
          {
            title: "2. How We Use Your Information",
            body: "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages.",
          },
          {
            title: "3. Information Sharing",
            body: "We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification.",
          },
          {
            title: "4. Data Security",
            body: "We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information.",
          },
          {
            title: "5. Your Rights",
            body: "You have the right to access, update or delete the information we have on you. You may update or correct information about yourself by logging into your account.",
          },
          {
            title: "6. Cookies",
            body: "Our app may use 'cookies' to enhance user experience. You may choose to set your web browser to refuse cookies, but this may prevent some features from working correctly.",
          },
          {
            title: "7. Contact Us",
            body: "If you have any questions about this Privacy Policy, please contact us at:",
          },
        ].map(section => (
          <div key={section.title}>
            <h3 className="font-black text-gray-900 mb-1">{section.title}</h3>
            <p>{section.body}</p>
            {section.title === "7. Contact Us" && (
              <a href="mailto:support@tallyhub.app"
                className="font-bold mt-1 block"
                style={{ color: ORANGE }}>
                support@tallyhub.app
              </a>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}

/* ══════════════════════════════════════════
   ABOUT MODAL
══════════════════════════════════════════ */
function AboutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="About">
      <div className="px-5 py-6">
        {/* App logo + name */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="h-20 w-20 rounded-3xl flex items-center justify-center shadow-lg mb-3"
            style={{ background: `linear-gradient(135deg, ${ORANGE}, #9B1C1C)` }}
          >
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-xl font-black text-gray-900">Tally Hub Pro</h3>
          <p className="text-xs text-gray-400 mt-0.5">Version 1.0.0</p>
        </div>

        <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
          The premium learning hub for Tally, Accounting, GST, Business Skills, Sports and Entertainment in Hindi & Nepali.
        </p>

        <div className="space-y-3">
          {[
            { icon: Info, label: "Version", value: "1.0.0" },
            { icon: FileText, label: "Developer", value: "Siddhartha Chaudhary" },
            { icon: Mail, label: "Support Email", value: "support@tallyhub.app", href: "mailto:support@tallyhub.app" },
            { icon: Globe, label: "Website", value: "tallyhub.app", href: "https://tallyhub.app" },
          ].map(item => (
            <div
              key={item.label}
              className="flex items-center gap-4 rounded-2xl px-4 py-3.5"
              style={{ background: ORANGE_LIGHT }}
            >
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${ORANGE}20` }}
              >
                <item.icon className="h-4 w-4" style={{ color: ORANGE }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-semibold">{item.label}</p>
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer"
                    className="text-sm font-bold" style={{ color: ORANGE }}>
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm font-bold text-gray-800">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 Tally Hub Pro. All rights reserved.
        </p>
      </div>
    </Modal>
  );
}

/* ══════════════════════════════════════════
   MAIN PROFILE COMPONENT
══════════════════════════════════════════ */
function Profile() {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const { notes, courses } = useData();
  const navigate = useNavigate();
  const fileRef  = useRef<HTMLInputElement>(null);

  /* Modal states */
  const [showChangePwd,  setShowChangePwd]  = useState(false);
  const [showCerts,      setShowCerts]      = useState(false);
  const [showPrivacy,    setShowPrivacy]    = useState(false);
  const [showAbout,      setShowAbout]      = useState(false);

  const initials = (user?.fullName || user?.username || "U")
    .split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5 MB"); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      updateProfile({ avatar: ev.target?.result as string });
      toast.success("Profile photo updated!");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  /* Live stats */
  const purchasedCount = (user?.purchasedCourses?.length || 0) + (user?.purchasedVideos?.length || 0);
  const savedNotes     = notes.filter(n => n.status === "published").length;
  // Quiz progress: count of take-quiz sessions stored in localStorage
  const quizScores: number[] = (() => {
    try { return JSON.parse(localStorage.getItem("tally_quiz_scores") || "[]"); } catch { return []; }
  })();
  const quizProgress = quizScores.length === 0 ? "0%" : `${quizScores.length} done`;

  /* ── menu items — all wired ── */
  const menuItems = [
    {
      icon: UserCircle,
      label: "Edit Profile",
      onPress: () => navigate({ to: "/profile" }),
    },
    {
      icon: Lock,
      label: "Change Password",
      onPress: () => setShowChangePwd(true),
    },
    {
      icon: Award,
      label: "Certificates",
      onPress: () => setShowCerts(true),
    },
    {
      icon: ShieldCheck,
      label: "Privacy Policy",
      onPress: () => setShowPrivacy(true),
    },
    {
      icon: Info,
      label: "About",
      onPress: () => setShowAbout(true),
    },
  ];

  /* ── not logged in ── */
  if (!isAuthenticated) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6 gap-5">
          <div className="h-20 w-20 rounded-full gradient-hero flex items-center justify-center shadow-glow">
            <UserCircle className="h-10 w-10 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black">You're not logged in</h2>
            <p className="text-sm text-muted-foreground mt-1">Login to access your profile and content</p>
          </div>
          <button
            onClick={() => navigate({ to: "/login" })}
            className="px-8 py-3 rounded-2xl gradient-hero text-white font-bold text-sm shadow-glow"
          >
            Login Now
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Modals */}
      <ChangePasswordModal open={showChangePwd} onClose={() => setShowChangePwd(false)} />
      <CertificatesModal   open={showCerts}     onClose={() => setShowCerts(false)} />
      <PrivacyPolicyModal  open={showPrivacy}   onClose={() => setShowPrivacy(false)} />
      <AboutModal          open={showAbout}     onClose={() => setShowAbout(false)} />

      {/* ── Top bar ── */}
      <div className="flex items-center pt-4 pb-2">
        <h1 className="text-2xl font-black">Profile</h1>
      </div>

      {/* ── Avatar + name block ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center pt-4 pb-6"
      >
        {/* Avatar */}
        <div
          className="relative cursor-pointer mb-4"
          onClick={() => fileRef.current?.click()}
        >
          <div
            className="h-24 w-24 rounded-full overflow-hidden shadow-glow"
            style={{ border: `3px solid ${ORANGE}` }}
          >
            {user.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white text-3xl font-black"
                style={{ background: `linear-gradient(135deg, ${ORANGE}, #9B1C1C)` }}
              >
                {initials}
              </div>
            )}
          </div>
          {/* Camera badge */}
          <div
            className="absolute bottom-0.5 right-0.5 h-7 w-7 rounded-full bg-white flex items-center justify-center shadow-md"
            style={{ border: `1.5px solid ${ORANGE}` }}
          >
            <Camera className="h-3.5 w-3.5" style={{ color: ORANGE }} />
          </div>
        </div>

        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />

        <h2 className="text-xl font-black text-foreground">{user.fullName || user.name || user.username}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{user.email || user.phone || ""}</p>

        <div
          className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold"
          style={{ background: `${ORANGE}18`, color: ORANGE }}
        >
          <Crown className="h-3.5 w-3.5" />
          Premium Member
        </div>
      </motion.div>

      {/* ── Stats card ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl bg-white shadow-card mb-4 overflow-hidden"
        style={{ border: "1px solid #f3f4f6" }}
      >
        {[
          {
            icon: BookOpen,
            label: "Purchased Courses",
            display: String(purchasedCount),
            onPress: () => navigate({ to: "/courses" }),
          },
          {
            icon: Target,
            label: "Quiz Progress",
            display: quizProgress,
            onPress: () => navigate({ to: "/quiz" }),
          },
          {
            icon: Bookmark,
            label: "Saved Notes",
            display: String(savedNotes),
            onPress: () => navigate({ to: "/notes" }),
          },
        ].map((item, idx, arr) => (
          <div key={item.label}>
            <button
              onClick={item.onPress}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-orange-50/40 transition-colors active:bg-orange-50"
            >
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${ORANGE}15` }}
              >
                <item.icon className="h-4.5 w-4.5" style={{ color: ORANGE }} />
              </div>
              <span className="flex-1 text-sm font-semibold text-left text-foreground">
                {item.label}
              </span>
              <span className="text-sm font-bold" style={{ color: ORANGE }}>{item.display}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground ml-1" />
            </button>
            {idx < arr.length - 1 && (
              <div className="h-px mx-5" style={{ background: "#f3f4f6" }} />
            )}
          </div>
        ))}
      </motion.div>

      {/* ── Menu list ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-white shadow-card mb-8 overflow-hidden"
        style={{ border: "1px solid #f3f4f6" }}
      >
        {menuItems.map((item, idx, arr) => (
          <div key={item.label}>
            <button
              onClick={item.onPress}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-orange-50/40 transition-colors active:bg-orange-50"
            >
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${ORANGE}15` }}
              >
                <item.icon className="h-4.5 w-4.5" style={{ color: ORANGE }} />
              </div>
              <span className="flex-1 text-sm font-semibold text-left text-foreground">
                {item.label}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
            {idx < arr.length - 1 && (
              <div className="h-px mx-5" style={{ background: "#f3f4f6" }} />
            )}
          </div>
        ))}
      </motion.div>
    </AppShell>
  );
}

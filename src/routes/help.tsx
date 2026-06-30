import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import {
  ChevronLeft, MessageCircle, Phone, Mail,
  HelpCircle, Star, Users,
  CheckCircle2, X, Send, ChevronDown,
} from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & Support — Tally Hub" },
      { name: "description", content: "Get help, support and answers to your questions." },
    ],
  }),
  component: HelpSupport,
});

const faqs = [
  { q: "How do I access my courses?", a: "After logging in, go to the 'My Courses' section. All your purchased courses will be listed there." },
  { q: "What should I do if my payment fails?", a: "If a payment fails, the amount is automatically refunded within 5-7 business days. Please contact support if you don't receive it." },
  { q: "When will I receive my certificate?", a: "Your certificate is automatically generated in the 'Certificates' section once you complete the course." },
  { q: "My video is buffering or not playing?", a: "Please check your internet connection. Try switching to WiFi or lowering the video quality in settings." },
  { q: "I forgot my password. What do I do?", a: "Use the 'Forgot Password' option on the login page. A reset link will be sent to your registered email." },
  { q: "Is a course refund possible?", a: "You can request a refund within 7 days of purchase, provided your course progress is less than 80%." },
];




// ── Live Chat Modal ──────────────────────────────────────────────
type ChatMsg = { from: "user" | "bot"; text: string };
const botReplies = [
  "Thanks for reaching out! Let me connect you with a support agent.",
  "I understand your concern. Our team will get back to you shortly.",
  "Got it! Can you share more details so we can help you faster?",
  "Our average response time is under 2 minutes. Hang tight! 🙌",
];

function LiveChatModal({ onClose }: { onClose: () => void }) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { from: "bot", text: "Hi! 👋 Welcome to Tally Hub Support. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMsgs(p => [...p, { from: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(p => [...p, { from: "bot", text: botReplies[Math.floor(Math.random() * botReplies.length)] }]);
    }, 1200);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm px-4 pb-4">
      <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-md bg-background rounded-2xl shadow-elegant overflow-hidden flex flex-col"
        style={{ maxHeight: "75vh" }}>
        {/* header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border"
          style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
          <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-white">Live Chat Support</p>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-300 animate-pulse" />
              <span className="text-[10px] text-white/70">Online · ~2 min reply</span>
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
        {/* messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                m.from === "user"
                  ? "text-white rounded-br-sm"
                  : "bg-accent text-foreground rounded-bl-sm"
              }`} style={m.from === "user" ? { background: "linear-gradient(135deg,#667eea,#764ba2)" } : {}}>
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-accent px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
                {[0, 1, 2].map(i => (
                  <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                    animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                ))}
              </div>
            </div>
          )}
        </div>
        {/* input */}
        <div className="flex gap-2 p-3 border-t border-border">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Type your message..."
            className="flex-1 bg-accent rounded-xl px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground" />
          <button onClick={send}
            className="h-10 w-10 rounded-xl flex items-center justify-center text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#667eea,#764ba2)" }}>
            <Send className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────
function HelpSupport() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showChat, setShowChat]   = useState(false);

  const handleContact = (label: string) => {
    if (label === "Live Chat")  { setShowChat(true); return; }
    if (label === "Call Us")    { window.open("tel:+9779823415625", "_self"); return; }
    if (label === "Email")      { window.open("mailto:contact.tallynp@gmail.com", "_self"); return; }
  };

  const contactOptions = [
    { icon: MessageCircle, label: "Live Chat",  desc: "~2 mins reply",    gradient: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)" },
    { icon: Phone,         label: "Call Us",    desc: "Mon–Sat 9–6 PM",   gradient: "linear-gradient(135deg,#11998e 0%,#38ef7d 100%)" },
    { icon: Mail,          label: "Email",      desc: "24 hr reply",      gradient: "linear-gradient(135deg,#f093fb 0%,#f5576c 100%)" },
  ];

  return (
    <AppShell>
      <AnimatePresence>{showChat && <LiveChatModal onClose={() => setShowChat(false)} />}</AnimatePresence>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="mx-auto max-w-2xl px-4 h-16 flex items-center gap-3">
          <button onClick={() => navigate({ to: "/" })}
            className="h-10 w-10 rounded-xl glass flex items-center justify-center hover:bg-accent transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-black leading-tight">Help & Support</h1>
            <p className="text-[10px] text-muted-foreground">We're here to help you</p>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-10 space-y-5">
        {/* Hero Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="mx-4 rounded-2xl overflow-hidden relative"
          style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)" }}>
          <div className="absolute inset-0 opacity-20"
            style={{ background: "radial-gradient(circle at 80% 20%,#667eea 0%,transparent 60%)" }} />
          <div className="relative p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <HelpCircle className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">Support Center</span>
            </div>
            <h2 className="text-2xl font-black text-white leading-snug">How can we<br />help you? 🙏</h2>
            <p className="text-sm text-white/60 mt-2">Course, payment, or any issue — we're available 24/7.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { icon: CheckCircle2, text: "Fast Response", color: "text-green-400" },
                { icon: Star,         text: "4.9 Rating",    color: "text-yellow-400" },
                { icon: Users,        text: "Multilingual",  color: "text-blue-400"  },
              ].map(b => (
                <div key={b.text} className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
                  <b.icon className={`h-3 w-3 ${b.color}`} />
                  <span className="text-xs text-white/80">{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Contact Options */}
        <div className="px-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-3">Contact Us</h3>
          <div className="grid grid-cols-3 gap-3">
            {contactOptions.map((opt, idx) => (
              <motion.button key={opt.label}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, type: "spring", stiffness: 300 }}
                whileTap={{ scale: 0.92 }} whileHover={{ scale: 1.04 }}
                onClick={() => handleContact(opt.label)}
                className="flex flex-col items-center gap-2 rounded-2xl p-4 shadow-card transition-all"
                style={{ background: opt.gradient }}>
                <motion.div whileTap={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.3 }}
                  className="h-11 w-11 rounded-xl bg-white/20 flex items-center justify-center">
                  <opt.icon className="h-5 w-5 text-white" />
                </motion.div>
                <span className="text-xs font-black text-white text-center">{opt.label}</span>
                <span className="text-[9px] text-white/70 text-center leading-tight">{opt.desc}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="px-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-3">Frequently Asked Questions</h3>
          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <motion.div key={idx}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * idx }}
                className="rounded-2xl border border-border overflow-hidden">
                <button onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center gap-3 px-4 py-4 hover:bg-accent transition-colors text-left">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="flex-1 text-sm font-semibold">{faq.q}</span>
                  <motion.div animate={{ rotate: activeFaq === idx ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === idx && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                      className="overflow-hidden">
                      <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  );
}

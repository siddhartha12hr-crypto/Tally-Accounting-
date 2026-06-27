import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Mail, MessageCircle, Send, Instagram, Facebook, Youtube, Twitter, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — Tally Accounting Hub Pro" }] }),
  component: Contact,
});

const faqs = [
  { q: "How do I access Sports and Entertainment?", a: "Both sections are PIN-protected. Use your access PIN to unlock them." },
  { q: "Can I learn in Nepali?", a: "Yes! Toggle between Hindi and Nepali inside the Learn section." },
  { q: "Do I get a certificate?", a: "Every premium course awards a downloadable certificate on completion." },
  { q: "What is Tally AI Guru?", a: "Your AI assistant for accounting, Tally and course doubts in Hindi and Nepali." },
];

function Contact() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <AppShell>
      <PageHeader eyebrow="Contact" title="Get in touch" subtitle="We'd love to hear from you. Drop a message or reach us directly." />

      <form
        onSubmit={(e) => { e.preventDefault(); alert("Message sent! 🙏"); }}
        className="rounded-3xl glass p-5 shadow-card space-y-3"
      >
        <input className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Your name" required maxLength={100} />
        <input type="email" className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Email address" required maxLength={255} />
        <textarea rows={4} className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Your message" required maxLength={1000} />
        <button className="w-full inline-flex items-center justify-center gap-2 rounded-full gradient-hero px-4 py-3 text-sm font-bold text-white shadow-glow">
          <Send className="h-4 w-4" /> Send Message
        </button>
      </form>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <a href="https://wa.me/0" className="flex items-center gap-2 rounded-2xl glass p-4 shadow-card">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-green-500 text-white"><MessageCircle className="h-5 w-5" /></div>
          <div><p className="text-xs font-bold">WhatsApp</p><p className="text-[10px] text-muted-foreground">Chat with us</p></div>
        </a>
        <a href="mailto:support@tallyhub.app" className="flex items-center gap-2 rounded-2xl glass p-4 shadow-card">
          <div className="grid h-10 w-10 place-items-center rounded-xl gradient-royal text-white"><Mail className="h-5 w-5" /></div>
          <div className="min-w-0"><p className="text-xs font-bold">Support</p><p className="truncate text-[10px] text-muted-foreground">support@tallyhub.app</p></div>
        </a>
      </div>

      <div className="mt-4 flex justify-center gap-3">
        {[Instagram, Facebook, Youtube, Twitter].map((Icon, idx) => (
          <a key={idx} href="#" className="grid h-11 w-11 place-items-center rounded-2xl glass shadow-card transition-transform hover:-translate-y-0.5">
            <Icon className="h-4 w-4" />
          </a>
        ))}
      </div>

      <section className="mt-7">
        <h2 className="mb-3 text-lg font-black">Frequently Asked</h2>
        <div className="space-y-2">
          {faqs.map((f, idx) => (
            <div key={idx} className="overflow-hidden rounded-2xl glass shadow-card">
              <button onClick={() => setOpen(open === idx ? null : idx)} className="flex w-full items-center justify-between p-4 text-left">
                <span className="text-sm font-bold">{f.q}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open === idx ? "rotate-180" : ""}`} />
              </button>
              <motion.div
                initial={false}
                animate={{ height: open === idx ? "auto" : 0 }}
                className="overflow-hidden"
              >
                <p className="px-4 pb-4 text-xs text-muted-foreground">{f.a}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

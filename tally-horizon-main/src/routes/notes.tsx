import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Search, BookOpen, Clock, Tag, ChevronRight, Pin, Star, FileText, Calculator, FileSpreadsheet, Briefcase } from "lucide-react";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Notes — Tally Accounting Hub Pro" },
      { name: "description", content: "Your personal study notes library." },
    ],
  }),
  component: Notes,
});

export const notesData = [
  {
    id: 1,
    title: "GST Return Filing Process",
    category: "gst",
    categoryLabel: "GST & Tax",
    description: "Step-by-step guide for filing GSTR-1, GSTR-3B monthly returns with reconciliation tips and deadline reminders.",
    date: "2 days ago",
    readTime: "5 min read",
    isPinned: true,
    isFavorite: true,
    tags: ["GST", "Returns", "Filing"],
    accentColor: "#FF9933",
  },
  {
    id: 2,
    title: "Tally Keyboard Shortcuts",
    category: "tally",
    categoryLabel: "Tally Prime",
    description: "Essential shortcuts: Alt+G (Go To), Alt+C (Create), Alt+D (Delete), Alt+P (Print) and 30+ more productivity shortcuts.",
    date: "3 days ago",
    readTime: "3 min read",
    isPinned: true,
    isFavorite: false,
    tags: ["Tally", "Shortcuts", "Productivity"],
    accentColor: "#4169E1",
  },
  {
    id: 3,
    title: "Balance Sheet Learning Guide",
    category: "accounting",
    categoryLabel: "Accounting",
    description: "Assets = Liabilities + Capital. A complete guide to understanding balance sheet structure, assets, liabilities, and capital with worked examples.",
    date: "5 days ago",
    readTime: "8 min read",
    isPinned: false,
    isFavorite: true,
    tags: ["Accounting", "Financial Statements", "Balance Sheet"],
    accentColor: "#FFD700",
  },
  {
    id: 4,
    title: "Journal Entry Rules",
    category: "accounting",
    categoryLabel: "Accounting",
    description: "Debit what comes in, Credit what goes out. Debit all expenses and losses, Credit all incomes and gains — with real examples.",
    date: "1 week ago",
    readTime: "4 min read",
    isPinned: false,
    isFavorite: false,
    tags: ["Accounting", "Basics", "Journal"],
    accentColor: "#FF9933",
  },
  {
    id: 5,
    title: "Tally Prime Multi-Currency Setup",
    category: "tally",
    categoryLabel: "Tally Prime",
    description: "Enable multi-currency in F11 features. Configure exchange rates and handle forex transactions in Tally Prime.",
    date: "1 week ago",
    readTime: "6 min read",
    isPinned: false,
    isFavorite: false,
    tags: ["Tally", "Multi-Currency", "Advanced"],
    accentColor: "#4169E1",
  },
  {
    id: 6,
    title: "Business Model Canvas",
    category: "business",
    categoryLabel: "Business",
    description: "Key partners, activities, resources. Value proposition, customer relationships, segments, revenue streams and cost structure.",
    date: "2 weeks ago",
    readTime: "7 min read",
    isPinned: false,
    isFavorite: true,
    tags: ["Business", "Strategy", "Planning"],
    accentColor: "#DC143C",
  },
];

const categories = [
  { id: "all",        label: "All",        icon: FileText },
  { id: "accounting", label: "Accounting", icon: Calculator },
  { id: "tally",      label: "Tally",      icon: BookOpen },
  { id: "gst",        label: "GST & Tax",  icon: FileSpreadsheet },
  { id: "business",   label: "Business",   icon: Briefcase },
];

function Notes() {
  const navigate = useNavigate();
  const [search, setSearch]       = useState("");
  const [category, setCategory]   = useState("all");

  const filtered = notesData.filter(n => {
    const matchCat  = category === "all" || n.category === category;
    const matchText = n.title.toLowerCase().includes(search.toLowerCase()) ||
                      n.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchText;
  });

  const pinned  = filtered.filter(n => n.isPinned);
  const regular = filtered.filter(n => !n.isPinned);

  return (
    <AppShell>
      <div className="pt-20 pb-24 px-4 max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">Your Knowledge Base</p>
          <h1 className="text-3xl font-black mb-1">Study Notes</h1>
          <p className="text-sm text-muted-foreground">Tap any note to open the full document reader</p>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-2xl glass border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all"
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-7 scrollbar-hide">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  category === cat.id
                    ? "bg-primary text-white border-primary shadow-glow"
                    : "glass border-border hover:border-primary/40"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Pinned */}
        {pinned.length > 0 && (
          <section className="mb-7">
            <div className="flex items-center gap-1.5 mb-3">
              <Pin className="h-3.5 w-3.5 text-primary fill-primary" />
              <span className="text-xs font-black uppercase tracking-widest text-primary">Pinned</span>
            </div>
            <div className="space-y-2">
              {pinned.map(note => (
                <NoteRow key={note.id} note={note} onOpen={() => navigate({ to: "/note/$noteId", params: { noteId: String(note.id) } })} />
              ))}
            </div>
          </section>
        )}

        {/* All Notes */}
        {regular.length > 0 && (
          <section>
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground block mb-3">
              {category === "all" ? `All Notes (${regular.length})` : `${categories.find(c=>c.id===category)?.label} (${regular.length})`}
            </span>
            <div className="space-y-2">
              {regular.map(note => (
                <NoteRow key={note.id} note={note} onOpen={() => navigate({ to: "/note/$noteId", params: { noteId: String(note.id) } })} />
              ))}
            </div>
          </section>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
            <p className="text-sm font-bold text-muted-foreground">No notes found</p>
          </div>
        )}

      </div>
    </AppShell>
  );
}

function NoteRow({ note, onOpen }: { note: typeof notesData[0]; onOpen: () => void }) {
  return (
    <div
      className="relative flex items-center gap-4 px-4 py-4 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-card transition-all group cursor-pointer"
      style={{ borderLeftWidth: "4px", borderLeftColor: note.accentColor }}
      onClick={onOpen}
    >
      {/* Coloured initial icon */}
      <div
        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white text-base font-black"
        style={{ background: `linear-gradient(135deg, ${note.accentColor}cc, ${note.accentColor}88)` }}
      >
        {note.title.charAt(0)}
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          {note.isFavorite && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 flex-shrink-0" />}
          <span className="text-sm font-bold truncate">{note.title}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{note.readTime}</span>
          <span className="flex items-center gap-1"><Tag className="h-3 w-3" />{note.categoryLabel}</span>
          <span>{note.date}</span>
        </div>
        {/* View Note button */}
        <button
          onClick={e => { e.stopPropagation(); onOpen(); }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
          style={{
            background: `linear-gradient(135deg, ${note.accentColor}22, ${note.accentColor}11)`,
            color: note.accentColor,
            border: `1px solid ${note.accentColor}44`,
          }}
        >
          View Note <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      {/* Right arrow */}
      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
    </div>
  );
}

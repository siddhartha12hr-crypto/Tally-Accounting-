import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { 
  FileText, Plus, Search, Filter, Star, Clock, Tag, 
  BookOpen, Calculator, FileSpreadsheet, Briefcase, Download,
  Eye, Edit, Trash2, Share2, Pin, MoreVertical
} from "lucide-react";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Notes — Tally Accounting Hub Pro" },
      { name: "description", content: "Your personal notes library for accounting, Tally, GST, and business topics." },
    ],
  }),
  component: Notes,
});

const noteCategories = [
  { id: "all", label: "All Notes", icon: FileText, count: 24, color: "gradient-hero" },
  { id: "accounting", label: "Accounting", icon: Calculator, count: 8, color: "gradient-saffron" },
  { id: "tally", label: "Tally Prime", icon: BookOpen, count: 10, color: "gradient-royal" },
  { id: "gst", label: "GST & Tax", icon: FileSpreadsheet, count: 4, color: "gradient-gold" },
  { id: "business", label: "Business", icon: Briefcase, count: 2, color: "gradient-hero" },
];

const notesData = [
  {
    id: 1,
    title: "GST Return Filing Process",
    category: "gst",
    excerpt: "Step-by-step guide for filing GSTR-1, GSTR-3B monthly returns with reconciliation tips...",
    date: "2 days ago",
    isPinned: true,
    isFavorite: true,
    tags: ["GST", "Returns", "Filing"],
    color: "border-l-[#FF9933]",
  },
  {
    id: 2,
    title: "Tally Keyboard Shortcuts",
    category: "tally",
    excerpt: "Essential shortcuts: Alt+G (Go To), Alt+C (Create), Alt+D (Delete), Alt+P (Print)...",
    date: "3 days ago",
    isPinned: true,
    isFavorite: false,
    tags: ["Tally", "Shortcuts", "Productivity"],
    color: "border-l-[#4169E1]",
  },
  {
    id: 3,
    title: "Balance Sheet Format",
    category: "accounting",
    excerpt: "Assets = Liabilities + Capital. Current assets, fixed assets, provisions, reserves...",
    date: "5 days ago",
    isPinned: false,
    isFavorite: true,
    tags: ["Accounting", "Financial Statements"],
    color: "border-l-[#FFD700]",
  },
  {
    id: 4,
    title: "Journal Entry Rules",
    category: "accounting",
    excerpt: "Debit what comes in, Credit what goes out. Debit all expenses and losses...",
    date: "1 week ago",
    isPinned: false,
    isFavorite: false,
    tags: ["Accounting", "Basics", "Journal"],
    color: "border-l-[#FF9933]",
  },
  {
    id: 5,
    title: "Tally Prime Multi-Currency Setup",
    category: "tally",
    excerpt: "Enable multi-currency in F11 features. Configure exchange rates. Handle forex transactions...",
    date: "1 week ago",
    isPinned: false,
    isFavorite: false,
    tags: ["Tally", "Multi-Currency", "Advanced"],
    color: "border-l-[#4169E1]",
  },
  {
    id: 6,
    title: "Business Model Canvas",
    category: "business",
    excerpt: "Key partners, activities, resources. Value proposition, customer relationships, segments...",
    date: "2 weeks ago",
    isPinned: false,
    isFavorite: true,
    tags: ["Business", "Strategy", "Planning"],
    color: "border-l-[#DC143C]",
  },
];

function Notes() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const filteredNotes = notesData.filter((note) => {
    const matchesCategory = selectedCategory === "all" || note.category === selectedCategory;
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const pinnedNotes = filteredNotes.filter(n => n.isPinned);
  const regularNotes = filteredNotes.filter(n => !n.isPinned);

  return (
    <AppShell>
      <div className="pt-20 pb-6">
        <PageHeader 
          eyebrow="Your Knowledge Base" 
          title="Notes" 
          subtitle="Organize and access your study notes anytime"
        />

        {/* Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide"
        >
          <div className="glass rounded-2xl px-4 py-3 min-w-[120px]">
            <p className="text-2xl font-black text-gradient">{notesData.length}</p>
            <p className="text-xs text-muted-foreground">Total Notes</p>
          </div>
          <div className="glass rounded-2xl px-4 py-3 min-w-[120px]">
            <p className="text-2xl font-black text-primary">{notesData.filter(n => n.isPinned).length}</p>
            <p className="text-xs text-muted-foreground">Pinned</p>
          </div>
          <div className="glass rounded-2xl px-4 py-3 min-w-[120px]">
            <p className="text-2xl font-black text-saffron">{notesData.filter(n => n.isFavorite).length}</p>
            <p className="text-xs text-muted-foreground">Favorites</p>
          </div>
        </motion.div>

        {/* Search and Create */}
        <div className="mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-2xl glass border-0 focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
          <button className="h-12 w-12 rounded-2xl gradient-saffron text-white flex items-center justify-center shadow-glow hover:shadow-elegant transition-all">
            <Plus className="h-6 w-6" />
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {noteCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-2 border-primary"
                    : "glass hover:bg-accent"
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.label}
                <span className="text-xs opacity-70">({cat.count})</span>
              </motion.button>
            );
          })}
        </div>

        {/* Pinned Notes Section */}
        {pinnedNotes.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Pin className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-black uppercase tracking-wide text-primary">Pinned Notes</h3>
            </div>
            <div className="space-y-3">
              {pinnedNotes.map((note, idx) => (
                <NoteCard key={note.id} note={note} index={idx} />
              ))}
            </div>
          </div>
        )}

        {/* Regular Notes */}
        {regularNotes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black uppercase tracking-wide text-muted-foreground">
                All Notes ({regularNotes.length})
              </h3>
            </div>
            <div className="space-y-3">
              {regularNotes.map((note, idx) => (
                <NoteCard key={note.id} note={note} index={idx + pinnedNotes.length} />
              ))}
            </div>
          </div>
        )}

        {filteredNotes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 glass rounded-3xl"
          >
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-bold mb-2">No notes found</h3>
            <p className="text-sm text-muted-foreground mb-6">Try adjusting your search or filter</p>
            <button className="px-6 py-3 rounded-xl gradient-saffron text-white font-bold shadow-glow">
              Create New Note
            </button>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}

function NoteCard({ note, index }: { note: typeof notesData[0]; index: number }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`relative glass rounded-2xl p-5 shadow-card hover:shadow-elegant transition-all border-l-4 ${note.color}`}
    >
      {/* Note Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {note.isPinned && <Pin className="h-4 w-4 text-primary fill-primary" />}
            <h3 className="text-base font-bold truncate">{note.title}</h3>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <Clock className="h-3 w-3" />
            {note.date}
          </p>
        </div>
        
        <div className="flex items-center gap-1">
          {note.isFavorite && (
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          )}
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="h-8 w-8 rounded-lg hover:bg-accent flex items-center justify-center transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {showMenu && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute right-5 top-14 w-48 glass rounded-xl shadow-elegant p-2 z-10"
        >
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm font-semibold">
            <Eye className="h-4 w-4" /> View
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm font-semibold">
            <Edit className="h-4 w-4" /> Edit
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm font-semibold">
            <Share2 className="h-4 w-4" /> Share
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm font-semibold">
            <Download className="h-4 w-4" /> Download
          </button>
          <div className="h-px bg-border my-2" />
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm font-semibold text-destructive">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </motion.div>
      )}

      {/* Note Excerpt */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {note.excerpt}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {note.tags.map((tag) => (
          <span 
            key={tag} 
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold"
          >
            <Tag className="h-3 w-3" />
            {tag}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Link to={`/notes/${note.id}`} className="flex-1">
          <button className="w-full py-2.5 rounded-xl glass hover:bg-accent transition-colors text-sm font-bold">
            View Note
          </button>
        </Link>
        <button className="px-4 py-2.5 rounded-xl gradient-saffron text-white font-bold shadow-glow hover:shadow-elegant transition-all">
          Edit
        </button>
      </div>
    </motion.div>
  );
}

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit, Trash2, Eye, EyeOff, Search, FileText,
  UploadCloud, X, CheckCircle, Loader, Link,
} from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/contexts/DataContext";
import type { Note } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES  = ["Tally", "Accounting", "GST & Tax", "Business", "Finance", "Excel", "Other"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"] as const;

const EMPTY_FORM = {
  title:        "",
  description:  "",
  category:     "",
  thumbnailUrl: "",
  pdfUrl:       "",
  tags:         "",
  difficulty:   "Beginner" as Note["difficulty"],
  readingTime:  "",
  pageCount:    0,
  author:       "",
  status:       "draft" as Note["status"],
};

/* ─── PDF Upload Zone ─── */
function PdfUploadZone({
  value,
  fileName,
  uploading,
  onFile,
  onUrlChange,
  onClear,
}: {
  value: string;
  fileName: string;
  uploading: boolean;
  onFile: (file: File) => void;
  onUrlChange: (url: string) => void;
  onClear: () => void;
}) {
  const [dragging, setDragging]   = useState(false);
  const [urlMode, setUrlMode]     = useState(false);
  const fileInputRef              = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      onFile(file);
    } else {
      toast.error("Please drop a PDF file.");
    }
  }, [onFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      onFile(file);
    } else {
      toast.error("Please select a PDF file.");
    }
  };

  // Already has a file/URL
  if (value && !uploading) {
    return (
      <div className="rounded-2xl border-2 border-green-500/40 bg-green-500/5 p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-green-500/15 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-green-700 truncate">
              {fileName || "PDF linked"}
            </p>
            <p className="text-[11px] text-green-600 truncate">{value.slice(0, 60)}{value.length > 60 ? "…" : ""}</p>
          </div>
          <button
            onClick={onClear}
            className="h-8 w-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-destructive transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <a href={value} target="_blank" rel="noopener noreferrer"
          className="mt-2 text-[11px] text-primary font-semibold underline block">
          Preview PDF ↗
        </a>
      </div>
    );
  }

  // Uploading spinner
  if (uploading) {
    return (
      <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 flex flex-col items-center gap-3">
        <Loader className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm font-bold text-primary">Reading PDF…</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Toggle row */}
      <div className="flex gap-2">
        <button
          onClick={() => setUrlMode(false)}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
            !urlMode ? "gradient-hero text-white border-transparent shadow-glow" : "glass border-border"
          }`}
        >
          <UploadCloud className="inline h-3.5 w-3.5 mr-1.5" />
          Upload File
        </button>
        <button
          onClick={() => setUrlMode(true)}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
            urlMode ? "gradient-hero text-white border-transparent shadow-glow" : "glass border-border"
          }`}
        >
          <Link className="inline h-3.5 w-3.5 mr-1.5" />
          Paste URL
        </button>
      </div>

      {/* Upload drop zone */}
      {!urlMode && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed cursor-pointer transition-all py-8 px-4 ${
            dragging
              ? "border-primary bg-primary/10 scale-[1.01]"
              : "border-border hover:border-primary/50 hover:bg-primary/3"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleChange}
          />
          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all ${
            dragging ? "gradient-hero shadow-glow" : "bg-primary/10"
          }`}>
            <UploadCloud className={`h-7 w-7 ${dragging ? "text-white" : "text-primary"}`} />
          </div>
          <div className="text-center">
            <p className="text-sm font-black text-foreground">
              {dragging ? "Drop your PDF here!" : "Drag & Drop PDF here"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              or <span className="text-primary font-bold underline">click to browse</span> from your computer
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">PDF files only · Max 50 MB</p>
          </div>
        </motion.div>
      )}

      {/* URL input */}
      {urlMode && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
          <Input
            placeholder="https://drive.google.com/file/d/.../view"
            className="rounded-xl"
            onChange={e => onUrlChange(e.target.value)}
          />
          <p className="text-[10px] text-muted-foreground mt-1">
            Paste a public Google Drive, Dropbox, or direct PDF link.
          </p>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Main component ─── */
export function AdminNotes() {
  const { notes, addNote, updateNote, deleteNote } = useData();

  const [search, setSearch]           = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [isFormOpen, setIsFormOpen]   = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [form, setForm]               = useState({ ...EMPTY_FORM });
  const [pdfFileName, setPdfFileName] = useState("");
  const [uploading, setUploading]     = useState(false);

  /* ── helpers ── */
  const filtered = notes.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
                        n.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || n.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const resetForm = () => {
    setForm({ ...EMPTY_FORM });
    setEditingNote(null);
    setPdfFileName("");
  };

  const openAdd = () => { resetForm(); setIsFormOpen(true); };

  const openEdit = (note: Note) => {
    setEditingNote(note);
    setForm({
      title:        note.title,
      description:  note.description,
      category:     note.category,
      thumbnailUrl: note.thumbnailUrl,
      pdfUrl:       note.pdfUrl,
      tags:         note.tags.join(", "),
      difficulty:   note.difficulty,
      readingTime:  note.readingTime,
      pageCount:    note.pageCount,
      author:       note.author,
      status:       note.status,
    });
    setPdfFileName(note.pdfUrl.startsWith("data:") ? "Uploaded file" : "");
    setIsFormOpen(true);
  };

  /* convert file → base64 data URL */
  const handleFileUpload = (file: File) => {
    setUploading(true);
    const reader = new FileReader();
    reader.onload = e => {
      const dataUrl = e.target?.result as string;
      setForm(prev => ({ ...prev, pdfUrl: dataUrl }));
      setPdfFileName(file.name);
      // Auto-fill reading time from file size (rough estimate: 1 page ≈ 50 KB)
      const estPages = Math.max(1, Math.round(file.size / 51200));
      setForm(prev => ({
        ...prev,
        pdfUrl:      dataUrl,
        pageCount:   prev.pageCount || estPages,
        readingTime: prev.readingTime || `${Math.max(1, Math.round(estPages * 1.5))} min`,
        title:       prev.title || file.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " "),
      }));
      setPdfFileName(file.name);
      setUploading(false);
      toast.success(`"${file.name}" loaded successfully!`);
    };
    reader.onerror = () => {
      setUploading(false);
      toast.error("Failed to read file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (url: string) => {
    setForm(prev => ({ ...prev, pdfUrl: url }));
    setPdfFileName("");
  };

  const clearPdf = () => {
    setForm(prev => ({ ...prev, pdfUrl: "" }));
    setPdfFileName("");
  };

  const validate = () => {
    if (!form.title.trim())  { toast.error("Title is required");    return false; }
    if (!form.category)      { toast.error("Category is required"); return false; }
    if (!form.pdfUrl.trim()) { toast.error("Please upload a PDF or paste a URL"); return false; }
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;
    const now  = new Date().toISOString();
    const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);

    if (editingNote) {
      updateNote(editingNote.id, { ...form, tags, updatedAt: now });
      toast.success("Note updated!");
    } else {
      const newNote: Note = {
        id:           Date.now().toString(),
        title:        form.title,
        description:  form.description,
        category:     form.category,
        thumbnailUrl: form.thumbnailUrl,
        pdfUrl:       form.pdfUrl,
        tags,
        difficulty:   form.difficulty,
        readingTime:  form.readingTime || "—",
        pageCount:    form.pageCount,
        author:       form.author,
        createdAt:    now,
        updatedAt:    now,
        status:       form.status,
      };
      addNote(newNote);
      toast.success("Note added!");
    }
    setIsFormOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this note? This cannot be undone.")) return;
    deleteNote(id);
    toast.success("Note deleted.");
  };

  const togglePublish = (note: Note) => {
    const next = note.status === "published" ? "draft" : "published";
    updateNote(note.id, { status: next });
    toast.success(next === "published" ? "Note published!" : "Note unpublished.");
  };

  /* ─── Render ─── */
  return (
    <div className="space-y-4">

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search notes..." value={search}
            onChange={e => setSearch(e.target.value)} className="pl-9 rounded-xl glass border-0" />
        </div>
        <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
          <SelectTrigger className="w-[130px] rounded-xl glass border-0"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={openAdd} className="rounded-xl gradient-hero text-white shadow-glow shrink-0">
          <Plus className="h-4 w-4 mr-1" /> Add Note
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Total",     value: notes.length,                                       color: "text-primary" },
          { label: "Published", value: notes.filter(n => n.status === "published").length, color: "text-green-600" },
          { label: "Draft",     value: notes.filter(n => n.status === "draft").length,     color: "text-orange-500" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl glass p-3 text-center shadow-card">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground font-semibold">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Note list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl glass">
          <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
          <p className="font-bold text-muted-foreground">No notes found</p>
          <p className="text-xs text-muted-foreground mt-1">
            {notes.length === 0
              ? "Click 'Add Note' to upload your first PDF note."
              : "Try a different filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((note, idx) => (
            <motion.div key={note.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="rounded-2xl glass p-4 shadow-card"
            >
              <div className="flex gap-3">
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-xl bg-muted flex-shrink-0 overflow-hidden">
                  {note.thumbnailUrl ? (
                    <img src={note.thumbnailUrl} alt={note.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full gradient-hero flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white opacity-60" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-black text-sm leading-tight truncate">{note.title}</h4>
                    <span className={`flex-shrink-0 text-[9px] font-black px-2 py-0.5 rounded-full ${
                      note.status === "published"
                        ? "bg-green-500/15 text-green-600"
                        : "bg-orange-500/15 text-orange-600"
                    }`}>
                      {note.status === "published" ? "● Published" : "○ Draft"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{note.description}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] text-muted-foreground font-semibold">
                    <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold">{note.category}</span>
                    <span>{note.difficulty}</span>·<span>{note.readingTime}</span>
                    {note.pageCount > 0 && <><span>·</span><span>{note.pageCount}p</span></>}
                  </div>
                  {note.pdfUrl.startsWith("data:") ? (
                    <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full font-bold">
                      <CheckCircle className="h-2.5 w-2.5" /> File uploaded
                    </span>
                  ) : note.pdfUrl ? (
                    <a href={note.pdfUrl} target="_blank" rel="noopener noreferrer"
                      className="mt-1.5 text-[10px] text-primary font-semibold underline block truncate">
                      {note.pdfUrl.slice(0, 50)}…
                    </a>
                  ) : null}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg" onClick={() => openEdit(note)}>
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost"
                    className={`h-8 w-8 p-0 rounded-lg ${note.status === "published" ? "text-green-600" : "text-muted-foreground"}`}
                    onClick={() => togglePublish(note)}
                    title={note.status === "published" ? "Unpublish" : "Publish"}
                  >
                    {note.status === "published" ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </Button>
                  <Button size="sm" variant="ghost"
                    className="h-8 w-8 p-0 rounded-lg text-destructive hover:text-destructive"
                    onClick={() => handleDelete(note.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={open => { if (!open) { setIsFormOpen(false); resetForm(); } }}>
        <DialogContent className="sm:max-w-[560px] rounded-3xl glass border-0 max-h-[94vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">
              {editingNote ? "Edit Note" : "Add New Note"}
            </DialogTitle>
            <DialogDescription>
              {editingNote
                ? "Update note information."
                : "Upload a PDF or paste a link, then fill in the details."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-1">

            {/* ── PDF Upload (top, most important) ── */}
            <div>
              <Label className="mb-2 block">
                PDF File <span className="text-destructive">*</span>
              </Label>
              <PdfUploadZone
                value={form.pdfUrl}
                fileName={pdfFileName}
                uploading={uploading}
                onFile={handleFileUpload}
                onUrlChange={handleUrlChange}
                onClear={clearPdf}
              />
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="n-title">Title <span className="text-destructive">*</span></Label>
              <Input id="n-title" value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="mt-1.5 rounded-xl" placeholder="e.g. Tally Prime Complete Notes" />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="n-desc">Description</Label>
              <Textarea id="n-desc" value={form.description} rows={2}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="mt-1.5 rounded-xl" placeholder="Short description of this note" />
            </div>

            {/* Category + Difficulty */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category <span className="text-destructive">*</span></Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Difficulty</Label>
                <Select value={form.difficulty} onValueChange={(v: any) => setForm({ ...form, difficulty: v })}>
                  <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DIFFICULTIES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Thumbnail URL */}
            <div>
              <Label htmlFor="n-thumb">Thumbnail URL</Label>
              <Input id="n-thumb" value={form.thumbnailUrl}
                onChange={e => setForm({ ...form, thumbnailUrl: e.target.value })}
                className="mt-1.5 rounded-xl" placeholder="https://... (cover image for the card)" />
            </div>

            {/* Author + Reading Time + Pages */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="n-author">Author</Label>
                <Input id="n-author" value={form.author}
                  onChange={e => setForm({ ...form, author: e.target.value })}
                  className="mt-1.5 rounded-xl" placeholder="Name" />
              </div>
              <div>
                <Label htmlFor="n-time">Reading Time</Label>
                <Input id="n-time" value={form.readingTime}
                  onChange={e => setForm({ ...form, readingTime: e.target.value })}
                  className="mt-1.5 rounded-xl" placeholder="5 min" />
              </div>
              <div>
                <Label htmlFor="n-pages">Pages</Label>
                <Input id="n-pages" type="number" min={0} value={form.pageCount}
                  onChange={e => setForm({ ...form, pageCount: parseInt(e.target.value) || 0 })}
                  className="mt-1.5 rounded-xl" placeholder="0" />
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="n-tags">Tags</Label>
              <Input id="n-tags" value={form.tags}
                onChange={e => setForm({ ...form, tags: e.target.value })}
                className="mt-1.5 rounded-xl" placeholder="Tally, GST, Accounting (comma separated)" />
            </div>

            {/* Publish toggle */}
            <div className="flex items-center justify-between rounded-xl glass p-3 border border-border">
              <div>
                <Label className="font-bold">Publish Note</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Published notes are visible to all users in the app.
                </p>
              </div>
              <Switch
                checked={form.status === "published"}
                onCheckedChange={c => setForm({ ...form, status: c ? "published" : "draft" })}
                className="data-[state=checked]:bg-green-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-1">
              <Button onClick={handleSave} disabled={uploading}
                className="flex-1 rounded-xl gradient-hero text-white shadow-glow">
                {editingNote ? "Update Note" : "Save Note"}
              </Button>
              <Button variant="outline" className="flex-1 rounded-xl"
                onClick={() => { setIsFormOpen(false); resetForm(); }}>
                Cancel
              </Button>
            </div>

          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

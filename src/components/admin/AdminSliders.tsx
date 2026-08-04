import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Images,
  UploadCloud,
  X,
  CheckCircle,
  Loader,
  Link,
  ArrowUp,
  ArrowDown,
  MousePointerClick,
} from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/contexts/DataContext";
import type { Slide } from "@/contexts/DataContext";
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

const EMPTY_FORM = {
  image: "",
  title: "",
  subtitle: "",
  buttonText: "",
  buttonLink: "",
  hasButton: true,
  isActive: true,
};

type SlideForm = typeof EMPTY_FORM;

/* ─── Image Upload Zone ─── */
function ImageUploadZone({
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
  const [dragging, setDragging] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onFile(file);
      } else {
        toast.error("Please drop an image file.");
      }
    },
    [onFile],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onFile(file);
    } else {
      toast.error("Please select an image file.");
    }
  };

  // Already has an image
  if (value && !uploading) {
    return (
      <div className="rounded-2xl border-2 border-green-500/40 bg-green-500/5 p-3">
        <div className="relative rounded-xl overflow-hidden aspect-[16/7]">
          <img src={value} alt="Slide preview" className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 flex gap-1.5">
            <button
              onClick={() => setUrlMode(false)}
              title="Replace image"
              className="h-8 w-8 rounded-lg bg-black/60 backdrop-blur flex items-center justify-center text-white hover:bg-black/80 transition-colors"
            >
              <UploadCloud className="h-4 w-4" />
            </button>
            <button
              onClick={onClear}
              title="Remove image"
              className="h-8 w-8 rounded-lg bg-black/60 backdrop-blur flex items-center justify-center text-red-400 hover:bg-black/80 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        {fileName && (
          <p className="mt-2 text-[11px] font-semibold text-green-700 truncate">
            <CheckCircle className="inline h-3 w-3 mr-1" />
            {fileName}
          </p>
        )}
      </div>
    );
  }

  // Uploading spinner
  if (uploading) {
    return (
      <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 flex flex-col items-center gap-3">
        <Loader className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm font-bold text-primary">Loading image…</p>
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
            !urlMode
              ? "gradient-hero text-white border-transparent shadow-glow"
              : "glass border-border"
          }`}
        >
          <UploadCloud className="inline h-3.5 w-3.5 mr-1.5" />
          Upload Image
        </button>
        <button
          onClick={() => setUrlMode(true)}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
            urlMode
              ? "gradient-hero text-white border-transparent shadow-glow"
              : "glass border-border"
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
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
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
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />
          <div
            className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all ${
              dragging ? "gradient-hero shadow-glow" : "bg-primary/10"
            }`}
          >
            <UploadCloud className={`h-7 w-7 ${dragging ? "text-white" : "text-primary"}`} />
          </div>
          <div className="text-center">
            <p className="text-sm font-black text-foreground">
              {dragging ? "Drop your image here!" : "Drag & Drop image here"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              or <span className="text-primary font-bold underline">click to browse</span> from your
              computer
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              JPG / PNG / WebP · Best at 1600×700 · Max 5 MB
            </p>
          </div>
        </motion.div>
      )}

      {/* URL input */}
      {urlMode && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
          <Input
            placeholder="https://example.com/banner.jpg"
            className="rounded-xl"
            onChange={(e) => onUrlChange(e.target.value)}
          />
          <p className="text-[10px] text-muted-foreground mt-1">
            Paste a public image URL to use directly.
          </p>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Main component ─── */
export function AdminSliders() {
  const { sliders, addSlide, updateSlide, deleteSlide } = useData();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "hidden">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [form, setForm] = useState<SlideForm>({ ...EMPTY_FORM });
  const [imgFileName, setImgFileName] = useState("");
  const [uploading, setUploading] = useState(false);

  const orderedSliders = [...sliders].sort((a, b) => a.order - b.order);

  const filtered = orderedSliders.filter((s) => {
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.subtitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && s.isActive) ||
      (filterStatus === "hidden" && !s.isActive);
    return matchSearch && matchStatus;
  });

  const resetForm = () => {
    setForm({ ...EMPTY_FORM });
    setEditingSlide(null);
    setImgFileName("");
  };

  const openAdd = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEdit = (slide: Slide) => {
    setEditingSlide(slide);
    setForm({
      image: slide.image,
      title: slide.title,
      subtitle: slide.subtitle,
      buttonText: slide.buttonText,
      buttonLink: slide.buttonLink,
      hasButton: slide.hasButton,
      isActive: slide.isActive,
    });
    setImgFileName(slide.image.startsWith("data:") ? "Uploaded image" : "");
    setIsFormOpen(true);
  };

  /* convert file → base64 data URL */
  const handleFileUpload = (file: File) => {
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setForm((prev) => ({ ...prev, image: dataUrl }));
      setImgFileName(file.name);
      setUploading(false);
      toast.success(`"${file.name}" loaded successfully!`);
    };
    reader.onerror = () => {
      setUploading(false);
      toast.error("Failed to read file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    if (!form.image.trim()) {
      toast.error("Please upload an image or paste a URL");
      return false;
    }
    if (
      form.hasButton &&
      form.buttonLink.trim() &&
      !form.buttonLink.startsWith("/") &&
      !form.buttonLink.startsWith("http")
    ) {
      toast.error("Button link must start with / or http");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      if (editingSlide) {
        await updateSlide(editingSlide.id, form);
        toast.success("Slide updated!");
      } else {
        const nextOrder = sliders.length > 0 ? Math.max(...sliders.map((s) => s.order)) + 1 : 1;
        await addSlide({ ...form, order: nextOrder });
        toast.success("Slide added!");
      }
      setIsFormOpen(false);
      resetForm();
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Failed to save slide. Check console for details.");
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this slide? This cannot be undone.")) return;
    deleteSlide(id);
    toast.success("Slide deleted.");
  };

  const toggleActive = (slide: Slide) => {
    const next = !slide.isActive;
    updateSlide(slide.id, { isActive: next });
    toast.success(
      next ? "Slide is now visible on the home page." : "Slide hidden from the home page.",
    );
  };

  const moveSlide = (slide: Slide, dir: -1 | 1) => {
    const idx = orderedSliders.findIndex((s) => s.id === slide.id);
    const swapIdx = idx + dir;
    if (idx < 0 || swapIdx < 0 || swapIdx >= orderedSliders.length) return;
    const next = [...orderedSliders];
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
    const orderedIds = next.map((s) => s.id);
    orderedIds.forEach((id, i) => updateSlide(id, { order: i + 1 }));
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search slides..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl glass border-0"
          />
        </div>
        <div className="flex gap-1.5 glass rounded-xl p-1">
          {(["all", "active", "hidden"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all ${
                filterStatus === status
                  ? "gradient-hero text-white shadow-glow"
                  : "text-muted-foreground"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <Button
          onClick={openAdd}
          className="rounded-xl gradient-hero text-white shadow-glow shrink-0"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Slide
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Total", value: sliders.length, color: "text-primary" },
          {
            label: "Active",
            value: sliders.filter((s) => s.isActive).length,
            color: "text-green-600",
          },
          {
            label: "Hidden",
            value: sliders.filter((s) => !s.isActive).length,
            color: "text-orange-500",
          },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl glass p-3 text-center shadow-card">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground font-semibold">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Slide list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl glass">
          <Images className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
          <p className="font-bold text-muted-foreground">No slides found</p>
          <p className="text-xs text-muted-foreground mt-1">
            {sliders.length === 0
              ? "Click 'Add Slide' to upload your first home page banner."
              : "Try a different filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((slide, idx) => (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className={`rounded-2xl glass overflow-hidden shadow-card ${!slide.isActive ? "opacity-70" : ""}`}
            >
              <div className="relative aspect-[16/7] bg-gradient-hero overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title || `Slide ${slide.order}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* Order badge */}
                <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur px-2 py-0.5 text-[10px] font-black text-white">
                  #{slide.order}
                </span>

                {/* Status badge */}
                <span
                  className={`absolute top-2 right-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black backdrop-blur ${
                    slide.isActive ? "bg-green-500/80 text-white" : "bg-orange-500/80 text-white"
                  }`}
                >
                  {slide.isActive ? "● Active" : "○ Hidden"}
                </span>

                {/* Text overlay */}
                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  {slide.title && (
                    <h4 className="text-sm font-black leading-tight truncate">{slide.title}</h4>
                  )}
                  {slide.subtitle && (
                    <p className="text-[10px] opacity-80 truncate mt-0.5">{slide.subtitle}</p>
                  )}
                  {slide.hasButton && slide.buttonText && (
                    <span className="inline-flex items-center gap-1 mt-1.5 rounded-lg bg-white/90 px-2.5 py-1 text-[10px] font-bold text-foreground">
                      <MousePointerClick className="h-2.5 w-2.5" />
                      {slide.buttonText} · {slide.buttonLink}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions bar */}
              <div className="flex items-center gap-1 p-2">
                <div className="flex items-center gap-1 mr-auto">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 rounded-lg"
                    onClick={() => moveSlide(slide, -1)}
                    disabled={slide.order <= 1}
                    title="Move up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 rounded-lg"
                    onClick={() => moveSlide(slide, 1)}
                    disabled={slide.order >= orderedSliders.length}
                    title="Move down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-lg"
                  onClick={() => openEdit(slide)}
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className={`h-8 w-8 p-0 rounded-lg ${slide.isActive ? "text-green-600" : "text-muted-foreground"}`}
                  onClick={() => toggleActive(slide)}
                  title={slide.isActive ? "Hide slide" : "Show slide"}
                >
                  {slide.isActive ? (
                    <Eye className="h-3.5 w-3.5" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-lg text-destructive hover:text-destructive"
                  onClick={() => handleDelete(slide.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog
        open={isFormOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsFormOpen(false);
            resetForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-[560px] rounded-3xl glass border-0 max-h-[94vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">
              {editingSlide ? "Edit Slide" : "Add New Slide"}
            </DialogTitle>
            <DialogDescription>
              {editingSlide
                ? "Update this home page banner."
                : "Upload a banner image, then add the text and button."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-1">
            {/* ── Image (most important) ── */}
            <div>
              <Label className="mb-2 block">
                Banner Image <span className="text-destructive">*</span>
              </Label>
              <ImageUploadZone
                value={form.image}
                fileName={imgFileName}
                uploading={uploading}
                onFile={handleFileUpload}
                onUrlChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
                onClear={() => setForm((prev) => ({ ...prev, image: "" }))}
              />
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="s-title">Title</Label>
              <Input
                id="s-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-1.5 rounded-xl"
                placeholder="e.g. Learn Tally Prime Today"
              />
            </div>

            {/* Subtitle */}
            <div>
              <Label htmlFor="s-subtitle">Subtitle</Label>
              <Textarea
                id="s-subtitle"
                value={form.subtitle}
                rows={2}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="mt-1.5 rounded-xl"
                placeholder="Short description shown on the banner"
              />
            </div>

            {/* Button section */}
            <div className="flex items-center justify-between rounded-xl glass p-3 border border-border">
              <div>
                <Label className="font-bold">Show Action Button</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Display a call-to-action button on this slide.
                </p>
              </div>
              <Switch
                checked={form.hasButton}
                onCheckedChange={(c) => setForm({ ...form, hasButton: c })}
                className="data-[state=checked]:bg-blue-500"
              />
            </div>

            <AnimatePresence>
              {form.hasButton && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 gap-3 overflow-hidden"
                >
                  <div>
                    <Label htmlFor="s-btn-text">Button Text</Label>
                    <Input
                      id="s-btn-text"
                      value={form.buttonText}
                      onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                      className="mt-1.5 rounded-xl"
                      placeholder="Enroll Now"
                    />
                  </div>
                  <div>
                    <Label htmlFor="s-btn-link">Button Link</Label>
                    <Input
                      id="s-btn-link"
                      value={form.buttonLink}
                      onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
                      className="mt-1.5 rounded-xl"
                      placeholder="/courses"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active toggle */}
            <div className="flex items-center justify-between rounded-xl glass p-3 border border-border">
              <div>
                <Label className="font-bold">Show on Home Page</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Active slides appear in the home page hero slider.
                </p>
              </div>
              <Switch
                checked={form.isActive}
                onCheckedChange={(c) => setForm({ ...form, isActive: c })}
                className="data-[state=checked]:bg-green-500"
              />
            </div>

            {/* Live preview */}
            {form.image && (
              <div>
                <Label className="mb-2 block">Live Preview</Label>
                <div className="relative aspect-[16/7] rounded-xl overflow-hidden bg-gradient-hero">
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 text-white">
                    {form.title && <p className="text-sm font-black">{form.title}</p>}
                    {form.subtitle && <p className="text-[10px] opacity-80">{form.subtitle}</p>}
                    {form.hasButton && form.buttonText && (
                      <span className="inline-flex items-center mt-1.5 rounded-lg bg-white px-3 py-1.5 text-[11px] font-bold text-foreground">
                        {form.buttonText}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-2 pt-1">
              <Button
                onClick={handleSave}
                disabled={uploading}
                className="flex-1 rounded-xl gradient-hero text-white shadow-glow"
              >
                {editingSlide ? "Update Slide" : "Save Slide"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => {
                  setIsFormOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

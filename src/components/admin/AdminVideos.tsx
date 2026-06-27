import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye, Search, X } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  url: string;
  thumbnail: string;
  views: number;
  uploadDate: string;
  price: string;
}

export function AdminVideos() {
  // Use global state instead of local state
  const { videos, addVideo, updateVideo, deleteVideo } = useData();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    duration: "",
    url: "",
    thumbnail: "",
    isFree: false,
    price: "",
  });

  const categories = [
    "Accounting Basics",
    "Tally Prime Tutorials",
    "GST Learning",
    "Business Skills",
    "Computer Skills",
    "Excel Tutorials",
    "Financial Education",
    "Digital Skills",
  ];

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    try {
      // Validate form data
      if (!formData.title?.trim()) {
        toast.error("Please enter a video title");
        return;
      }
      if (!formData.category) {
        toast.error("Please select a category");
        return;
      }
      if (!formData.url?.trim()) {
        toast.error("Please enter a video URL");
        return;
      }
      if (!formData.isFree && !formData.price?.trim()) {
        toast.error("Please enter a price or mark the video as free");
        return;
      }

      const newVideo: Video = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description || "",
        category: formData.category,
        duration: formData.duration || "0m",
        url: formData.url,
        thumbnail: formData.thumbnail || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400",
        views: 0,
        uploadDate: new Date().toISOString().split('T')[0],
        price: formData.isFree ? "Free" : formData.price,
      };
      
      addVideo(newVideo);
      resetForm();
      setIsAddOpen(false);
      toast.success("Video added successfully!");
    } catch (error) {
      console.error("Error adding video:", error);
      toast.error("Failed to add video. Please try again.");
    }
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      category: video.category,
      duration: video.duration,
      url: video.url,
      thumbnail: video.thumbnail,
      isFree: video.price === "Free" || video.price === "₹0",
      price: video.price,
    });
  };

  const handleUpdate = () => {
    try {
      // Validate form data
      if (!formData.title?.trim()) {
        toast.error("Please enter a video title");
        return;
      }
      if (!formData.category) {
        toast.error("Please select a category");
        return;
      }
      if (!formData.url?.trim()) {
        toast.error("Please enter a video URL");
        return;
      }
      if (!formData.isFree && !formData.price?.trim()) {
        toast.error("Please enter a price or mark the video as free");
        return;
      }

      if (editingVideo) {
        const updatedFields = {
          title: formData.title,
          description: formData.description || editingVideo.description,
          category: formData.category,
          duration: formData.duration || editingVideo.duration,
          url: formData.url,
          thumbnail: formData.thumbnail || editingVideo.thumbnail,
          price: formData.isFree ? "Free" : formData.price,
        };
        
        updateVideo(editingVideo.id, updatedFields);
        resetForm();
        setEditingVideo(null);
        toast.success("Video updated successfully!");
      }
    } catch (error) {
      console.error("Error updating video:", error);
      toast.error("Failed to update video. Please try again.");
    }
  };

  const handleDelete = (id: string) => {
    try {
      if (confirm("Are you sure you want to delete this video?")) {
        deleteVideo(id);
        toast.success("Video deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      duration: "",
      url: "",
      thumbnail: "",
      isFree: false,
      price: "",
    });
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-xl glass border-0"
          />
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl gradient-hero text-white shadow-glow shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-3xl glass border-0">
            <DialogHeader>
              <DialogTitle className="text-xl font-black">Add New Video</DialogTitle>
              <DialogDescription>Upload a new video to the learning platform</DialogDescription>
            </DialogHeader>
            <VideoForm 
              formData={formData} 
              setFormData={setFormData} 
              categories={categories}
              onSubmit={handleAdd}
              onCancel={() => { setIsAddOpen(false); resetForm(); }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Videos List */}
      <div className="grid gap-3">
        {filteredVideos.map((video, idx) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-2xl glass p-4 shadow-card"
          >
            <div className="flex gap-4">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-32 h-20 object-cover rounded-xl shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-sm truncate">{video.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {video.description}
                </p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground font-semibold">
                  <span>{video.category}</span>
                  <span>•</span>
                  <span>{video.duration}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {video.views.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 rounded-lg"
                      onClick={() => handleEdit(video)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] rounded-3xl glass border-0">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-black">Edit Video</DialogTitle>
                      <DialogDescription>Update video information</DialogDescription>
                    </DialogHeader>
                    <VideoForm 
                      formData={formData} 
                      setFormData={setFormData} 
                      categories={categories}
                      onSubmit={handleUpdate}
                      onCancel={() => { setEditingVideo(null); resetForm(); }}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-lg text-destructive hover:text-destructive"
                  onClick={() => handleDelete(video.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-12 rounded-2xl glass">
          <p className="text-muted-foreground">No videos found</p>
        </div>
      )}
    </div>
  );
}

function VideoForm({ 
  formData, 
  setFormData, 
  categories, 
  onSubmit, 
  onCancel 
}: {
  formData: any;
  setFormData: (data: any) => void;
  categories: string[];
  onSubmit: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1.5 rounded-xl"
          placeholder="Enter video title"
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1.5 rounded-xl"
          placeholder="Enter video description"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger className="mt-1.5 rounded-xl">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="duration">Duration</Label>
        <Input
          id="duration"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          className="mt-1.5 rounded-xl"
          placeholder="e.g., 5h 30m"
        />
      </div>
      <div>
        <Label htmlFor="url">Video URL</Label>
        <Input
          id="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          className="mt-1.5 rounded-xl"
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>
      <div>
        <Label htmlFor="thumbnail">Thumbnail URL</Label>
        <Input
          id="thumbnail"
          value={formData.thumbnail}
          onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
          className="mt-1.5 rounded-xl"
          placeholder="https://..."
        />
      </div>
      
      {/* FREE VIDEO TOGGLE - NEW FEATURE */}
      <div className="rounded-xl glass p-4 border-2 border-primary/20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <Label htmlFor="isFree" className="text-base font-bold">Free Video</Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Make this video available to all users at no cost
            </p>
          </div>
          <Switch
            id="isFree"
            checked={formData.isFree}
            onCheckedChange={(checked) => setFormData({ 
              ...formData, 
              isFree: checked,
              price: checked ? "Free" : "" 
            })}
            className="data-[state=checked]:bg-green-500"
          />
        </div>
        
        {/* Show pricing field only if NOT free */}
        {!formData.isFree && (
          <div className="pt-3 border-t border-border/50">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="mt-1.5 rounded-xl"
              placeholder="₹999"
            />
          </div>
        )}
        
        {formData.isFree && (
          <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm font-semibold text-green-600 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
              This video will be free for all users
            </p>
          </div>
        )}
      </div>
      
      <div className="flex gap-2 pt-2">
        <Button onClick={onSubmit} className="flex-1 rounded-xl gradient-hero text-white shadow-glow">
          Save Video
        </Button>
        <Button onClick={onCancel} variant="outline" className="flex-1 rounded-xl">
          Cancel
        </Button>
      </div>
    </div>
  );
}

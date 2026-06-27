import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Users, Clock, BookOpen, Search } from "lucide-react";
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

interface Course {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  lessons: number;
  rating: number;
  students: string;
  description: string;
  thumbnail: string;
  category: string;
  price: string;
}

export function AdminCourses() {
  // Use global state instead of local state
  const { courses, addCourse, updateCourse, deleteCourse } = useData();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    instructor: "",
    duration: "",
    lessons: 0,
    rating: 0,
    students: "",
    description: "",
    thumbnail: "",
    category: "",
    price: "",
    isFree: false,
  });

  const categories = [
    "Tally Prime",
    "Accounting",
    "GST",
    "Business Skills",
    "Excel",
    "Computer Skills",
    "Finance",
    "Digital Marketing",
  ];

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    try {
      // Validate form data
      if (!formData.title?.trim()) {
        toast.error("Please enter a course title");
        return;
      }
      if (!formData.instructor?.trim()) {
        toast.error("Please enter an instructor name");
        return;
      }
      if (!formData.category) {
        toast.error("Please select a category");
        return;
      }
      if (!formData.isFree && !formData.price?.trim()) {
        toast.error("Please enter a price or mark the course as free");
        return;
      }

      const newCourse: Course = {
        id: Date.now().toString(),
        title: formData.title,
        instructor: formData.instructor,
        duration: formData.duration || "0h",
        lessons: formData.lessons || 0,
        rating: formData.rating || 0,
        students: formData.students || "0",
        description: formData.description || "",
        thumbnail: formData.thumbnail || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400",
        category: formData.category,
        price: formData.isFree ? "Free" : formData.price,
      };
      
      addCourse(newCourse);
      resetForm();
      setIsAddOpen(false);
      toast.success("Course added successfully!");
    } catch (error) {
      console.error("Error adding course:", error);
      toast.error("Failed to add course. Please try again.");
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      instructor: course.instructor,
      duration: course.duration,
      lessons: course.lessons,
      rating: course.rating,
      students: course.students,
      description: course.description,
      thumbnail: course.thumbnail,
      category: course.category,
      price: course.price,
      isFree: course.price === "Free" || course.price === "₹0",
    });
  };

  const handleUpdate = () => {
    try {
      // Validate form data
      if (!formData.title?.trim()) {
        toast.error("Please enter a course title");
        return;
      }
      if (!formData.instructor?.trim()) {
        toast.error("Please enter an instructor name");
        return;
      }
      if (!formData.category) {
        toast.error("Please select a category");
        return;
      }
      if (!formData.isFree && !formData.price?.trim()) {
        toast.error("Please enter a price or mark the course as free");
        return;
      }

      if (editingCourse) {
        const updatedFields = {
          title: formData.title,
          instructor: formData.instructor,
          duration: formData.duration || editingCourse.duration,
          lessons: formData.lessons || editingCourse.lessons,
          rating: formData.rating || editingCourse.rating,
          students: formData.students || editingCourse.students,
          description: formData.description || editingCourse.description,
          thumbnail: formData.thumbnail || editingCourse.thumbnail,
          category: formData.category,
          price: formData.isFree ? "Free" : formData.price,
        };
        
        updateCourse(editingCourse.id, updatedFields);
        resetForm();
        setEditingCourse(null);
        toast.success("Course updated successfully!");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Failed to update course. Please try again.");
    }
  };

  const handleDelete = (id: string) => {
    try {
      if (confirm("Are you sure you want to delete this course?")) {
        deleteCourse(id);
        toast.success("Course deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      instructor: "",
      duration: "",
      lessons: 0,
      rating: 0,
      students: "",
      description: "",
      thumbnail: "",
      category: "",
      price: "",
      isFree: false,
    });
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-xl glass border-0"
          />
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl gradient-hero text-white shadow-glow shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-3xl glass border-0 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-black">Add New Course</DialogTitle>
              <DialogDescription>Create a new course for the platform</DialogDescription>
            </DialogHeader>
            <CourseForm 
              formData={formData} 
              setFormData={setFormData} 
              categories={categories}
              onSubmit={handleAdd}
              onCancel={() => { setIsAddOpen(false); resetForm(); }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Courses List */}
      <div className="grid gap-3">
        {filteredCourses.map((course, idx) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-2xl glass p-4 shadow-card"
          >
            <div className="flex gap-4">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-28 h-28 object-cover rounded-xl shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-sm truncate">{course.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">by {course.instructor}</p>
                  </div>
                  <span className="text-sm font-black text-primary shrink-0">{course.price}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
                  {course.description}
                </p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground font-semibold">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {course.duration}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <BookOpen className="h-3 w-3" /> {course.lessons} lessons
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3 w-3" /> {course.students}
                  </span>
                  <span>•</span>
                  <span>⭐ {course.rating}</span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {course.category}
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
                      onClick={() => handleEdit(course)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] rounded-3xl glass border-0 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-black">Edit Course</DialogTitle>
                      <DialogDescription>Update course information</DialogDescription>
                    </DialogHeader>
                    <CourseForm 
                      formData={formData} 
                      setFormData={setFormData} 
                      categories={categories}
                      onSubmit={handleUpdate}
                      onCancel={() => { setEditingCourse(null); resetForm(); }}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-lg text-destructive hover:text-destructive"
                  onClick={() => handleDelete(course.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12 rounded-2xl glass">
          <p className="text-muted-foreground">No courses found</p>
        </div>
      )}
    </div>
  );
}

function CourseForm({ 
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
        <Label htmlFor="title">Course Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1.5 rounded-xl"
          placeholder="Enter course title"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="instructor">Instructor</Label>
          <Input
            id="instructor"
            value={formData.instructor}
            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
            className="mt-1.5 rounded-xl"
            placeholder="Instructor name"
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger className="mt-1.5 rounded-xl">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1.5 rounded-xl"
          placeholder="Enter course description"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            className="mt-1.5 rounded-xl"
            placeholder="18h"
          />
        </div>
        <div>
          <Label htmlFor="lessons">Lessons</Label>
          <Input
            id="lessons"
            type="number"
            value={formData.lessons}
            onChange={(e) => setFormData({ ...formData, lessons: parseInt(e.target.value) || 0 })}
            className="mt-1.5 rounded-xl"
            placeholder="64"
          />
        </div>
        <div>
          <Label htmlFor="rating">Rating</Label>
          <Input
            id="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
            className="mt-1.5 rounded-xl"
            placeholder="4.9"
          />
        </div>
      </div>
      
      {/* FREE COURSE TOGGLE - NEW FEATURE */}
      <div className="rounded-xl glass p-4 border-2 border-primary/20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <Label htmlFor="isFree" className="text-base font-bold">Free Course</Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Make this course available to all users at no cost
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
        
        {/* Show pricing fields only if NOT free */}
        {!formData.isFree && (
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/50">
            <div>
              <Label htmlFor="students">Students</Label>
              <Input
                id="students"
                value={formData.students}
                onChange={(e) => setFormData({ ...formData, students: e.target.value })}
                className="mt-1.5 rounded-xl"
                placeholder="12,430"
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="mt-1.5 rounded-xl"
                placeholder="₹4,999"
              />
            </div>
          </div>
        )}
        
        {formData.isFree && (
          <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm font-semibold text-green-600 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
              This course will be free for all users
            </p>
          </div>
        )}
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
      <div className="flex gap-2 pt-2">
        <Button onClick={onSubmit} className="flex-1 rounded-xl gradient-hero text-white shadow-glow">
          Save Course
        </Button>
        <Button onClick={onCancel} variant="outline" className="flex-1 rounded-xl">
          Cancel
        </Button>
      </div>
    </div>
  );
}

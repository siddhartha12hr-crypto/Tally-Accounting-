import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Star, Clock, Users, BookOpen, Lock } from "lucide-react";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Premium Courses — Tally Accounting Hub Pro" },
      { name: "description", content: "Hand-picked premium courses for Tally, accounting, GST, Excel and more." },
    ],
  }),
  component: Courses,
});

const palettes = ["gradient-saffron", "gradient-royal", "gradient-hero", "gradient-gold"];

function Courses() {
  const { courses } = useData();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleEnroll = (courseId: string, price: string) => {
    const isFree = price === "Free" || price === "₹0";
    
    if (!isFree && !isAuthenticated) {
      toast.info("Please login to access this premium course");
      navigate({ 
        to: "/login",
        search: { redirect: `/watch/${courseId}` }
      });
      return;
    }
    
    navigate({ to: `/watch/${courseId}` });
  };
  
  return (
    <AppShell>
      <PageHeader eyebrow="Courses" title="Premium Courses" subtitle="Master-level programs taught by top instructors." />
      <div className="grid gap-4">
        {courses.map((course, idx) => (
          <motion.article
            key={course.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="overflow-hidden rounded-3xl glass shadow-card"
          >
            {/* Course Header with Thumbnail */}
            <div className="relative h-32">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex items-end p-4 text-white">
                <h3 className="text-lg font-black leading-tight drop-shadow-lg">{course.title}</h3>
              </div>
              <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-foreground shadow-lg">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {course.rating}
              </div>
              {/* Price Badge */}
              <div className="absolute top-3 left-3 rounded-full bg-primary/90 backdrop-blur px-3 py-1 text-xs font-bold text-white shadow-lg flex items-center gap-1">
                {course.price !== "Free" && course.price !== "₹0" && !isAuthenticated && (
                  <Lock className="h-3 w-3" />
                )}
                {course.price}
              </div>
            </div>
            
            {/* Course Details */}
            <div className="p-4">
              <p className="text-xs text-muted-foreground">
                By <span className="font-semibold text-foreground">{course.instructor}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{course.description}</p>
              
              {/* Stats */}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground font-semibold">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {course.duration}
                </span>
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="h-3 w-3" /> {course.lessons} lessons
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3 w-3" /> {course.students}
                </span>
              </div>
              
              {/* Category Badge */}
              <div className="mt-3">
                <span className="inline-block text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {course.category}
                </span>
              </div>
              
              {/* Enroll Button */}
              <button 
                onClick={() => handleEnroll(course.id, course.price)}
                className="mt-4 w-full rounded-full gradient-hero px-4 py-2.5 text-xs font-bold text-white shadow-glow"
              >
                {course.price === "Free" || course.price === "₹0" 
                  ? "Start Learning Free" 
                  : isAuthenticated 
                  ? "Enroll Now" 
                  : "Login to Enroll"}
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Empty State */}
      {courses.length === 0 && (
        <div className="text-center py-12 rounded-2xl glass">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground font-semibold">No courses available yet</p>
          <p className="text-xs text-muted-foreground mt-1">New courses coming soon!</p>
        </div>
      )}
    </AppShell>
  );
}

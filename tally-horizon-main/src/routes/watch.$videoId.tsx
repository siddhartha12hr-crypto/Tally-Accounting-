import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  BookmarkPlus,
  Play,
  Clock,
  Eye,
  Star,
  Lock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from "lucide-react";

export const Route = createFileRoute("/watch/$videoId")({
  head: ({ params }) => ({
    meta: [
      { title: `Watch Video — Tally Accounting Hub Pro` },
      { name: "description", content: "Watch premium educational content" },
    ],
  }),
  component: WatchPage,
});

function WatchPage() {
  const { videoId } = Route.useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, hasPurchased, purchaseContent } = useAuth();
  const { videos, courses } = useData();
  
  const [showDescription, setShowDescription] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [saved, setSaved] = useState(false);

  // Find the video or course
  const video = videos.find(v => v.id === videoId);
  const course = courses.find(c => c.id === videoId);
  const content = video || course;

  useEffect(() => {
    if (!content) {
      toast.error("Content not found");
      navigate({ to: "/learn" });
      return;
    }

    const isFree = content.price === "Free" || content.price === "₹0";
    const isPurchased = video 
      ? hasPurchased(videoId, 'video')
      : hasPurchased(videoId, 'course');

    // Allow free content immediately
    if (isFree) {
      return;
    }

    // For paid content, check authentication
    if (!isAuthenticated) {
      toast.info("Please login to watch this content");
      navigate({ 
        to: "/login",
        search: { redirect: `/watch/${videoId}` }
      });
      return;
    }

    // For paid content, check if purchased
    // If not purchased, ALWAYS redirect to payment (no auto-purchase)
    if (!isPurchased) {
      toast.info("This is premium content. Complete payment to unlock.");
      navigate({ to: `/payment/${videoId}` });
      return;
    }

    // If purchased, user can watch (this code is reached)
  }, [content, videoId, isAuthenticated, hasPurchased, navigate, video]);

  if (!content) {
    return null;
  }

  const isFree = content.price === "Free" || content.price === "₹0";
  const isPurchased = video 
    ? hasPurchased(videoId, 'video')
    : hasPurchased(videoId, 'course');

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
    toast.success(liked ? "Like removed" : "Added to liked videos");
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  const handleSave = () => {
    setSaved(!saved);
    toast.success(saved ? "Removed from saved" : "Saved to watch later");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  // Get unique related content (avoid duplicates)
  const relatedContent = React.useMemo(() => {
    const allContent = [...videos, ...courses];
    const uniqueContent = allContent.filter((item, index, self) => 
      index === self.findIndex(t => t.id === item.id) && item.id !== videoId
    );
    return uniqueContent.slice(0, 8);
  }, [videos, courses, videoId]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Video Player Section */}
      <div className="relative bg-black">
        <div className="mx-auto max-w-7xl">
          {/* Video Player */}
          <div className="relative aspect-video bg-black">
            {isFree || isPurchased ? (
              // Actual video player (using placeholder for demo)
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 blur-3xl opacity-30">
                      <div className="h-full w-full bg-gradient-to-r from-primary via-purple-500 to-primary animate-pulse"></div>
                    </div>
                    <Play className="relative h-24 w-24 mx-auto text-white/80 mb-4 drop-shadow-2xl" />
                  </motion.div>
                  <p className="text-white/90 text-sm font-semibold mb-2">
                    {video ? "Video URL: " + video.url : "Course content ready"}
                  </p>
                  <p className="text-white/60 text-xs mt-2">
                    (In production, embed actual video player here)
                  </p>
                </div>
              </div>
            ) : (
              // Locked content
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-center px-4"
                >
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 blur-2xl opacity-30 bg-gradient-to-r from-red-500 to-orange-500"></div>
                    <Lock className="relative h-20 w-20 mx-auto text-white/80 drop-shadow-2xl" />
                  </div>
                  <h3 className="text-white text-2xl font-black mb-2 drop-shadow-lg">
                    Premium Content
                  </h3>
                  <p className="text-white/80 text-sm mb-6 max-w-sm mx-auto">
                    Unlock this content to start learning today
                  </p>
                  <Button className="gradient-hero text-white shadow-glow font-bold px-8 py-6 text-base rounded-full">
                    <Lock className="h-5 w-5 mr-2" />
                    Purchase for {content.price}
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Scrollable */}
          <div className="lg:col-span-2 space-y-4">
            {/* Title and Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl glass p-5 shadow-card"
            >
              <h1 className="text-2xl font-black mb-3 leading-tight">{content.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                {video && (
                  <>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span className="font-semibold">{video.views.toLocaleString()} views</span>
                    </span>
                    <span className="text-border">•</span>
                    <span className="text-muted-foreground font-semibold">{video.uploadDate}</span>
                  </>
                )}
                {course && (
                  <>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-semibold">{course.rating}</span>
                    </span>
                    <span className="text-border">•</span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="font-semibold">{course.duration}</span>
                    </span>
                    <span className="text-border">•</span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span className="font-semibold">{course.lessons} lessons</span>
                    </span>
                  </>
                )}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl glass p-4 shadow-card"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={`rounded-full transition-all ${liked ? "bg-primary/10 text-primary border-primary/30" : ""}`}
                  onClick={handleLike}
                >
                  <ThumbsUp className={`h-4 w-4 mr-2 transition-all ${liked ? "fill-current" : ""}`} />
                  <span className="font-bold">Like</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className={`rounded-full transition-all ${disliked ? "bg-destructive/10 text-destructive border-destructive/30" : ""}`}
                  onClick={handleDislike}
                >
                  <ThumbsDown className={`h-4 w-4 mr-2 transition-all ${disliked ? "fill-current" : ""}`} />
                  <span className="font-bold">Dislike</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  <span className="font-bold">Share</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className={`rounded-full transition-all ${saved ? "bg-primary/10 text-primary border-primary/30" : ""}`}
                  onClick={handleSave}
                >
                  <BookmarkPlus className={`h-4 w-4 mr-2 transition-all ${saved ? "fill-current" : ""}`} />
                  <span className="font-bold">Save</span>
                </Button>

                {(isFree || isPurchased) && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    <span className="font-bold">Download</span>
                  </Button>
                )}

                {/* Price Badge */}
                <div className="ml-auto shrink-0">
                  <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold ${
                    isFree 
                      ? "bg-green-500/20 text-green-600 border-2 border-green-500/30" 
                      : isPurchased
                      ? "bg-blue-500/20 text-blue-600 border-2 border-blue-500/30"
                      : "bg-primary/20 text-primary border-2 border-primary/30"
                  }`}>
                    {isFree ? "FREE" : isPurchased ? "PURCHASED" : content.price}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Instructor/Creator Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl glass p-5 shadow-card"
            >
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-full gradient-hero flex items-center justify-center text-white font-black text-xl shrink-0 shadow-glow">
                  {('instructor' in content ? content.instructor : 'Instructor')[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-lg">
                    {'instructor' in content ? content.instructor : 'Tally Academy'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {'category' in content ? content.category : 'Education'} • Professional Instructor
                  </p>
                </div>
                <Button size="sm" className="rounded-full gradient-hero text-white font-bold shrink-0 shadow-glow">
                  Subscribe
                </Button>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl glass shadow-card overflow-hidden"
            >
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-accent/10 transition-colors"
              >
                <h3 className="font-black text-lg">Description</h3>
                {showDescription ? (
                  <ChevronUp className="h-5 w-5 transition-transform" />
                ) : (
                  <ChevronDown className="h-5 w-5 transition-transform" />
                )}
              </button>
              
              <AnimatePresence>
                {showDescription && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-sm text-muted-foreground space-y-3 border-t border-border/50 pt-5">
                      <p className="leading-relaxed">{content.description}</p>
                      
                      {course && (
                        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border/50">
                          <div className="rounded-xl glass p-3">
                            <p className="text-xs text-muted-foreground font-semibold">Duration</p>
                            <p className="font-black text-foreground text-lg mt-1">{course.duration}</p>
                          </div>
                          <div className="rounded-xl glass p-3">
                            <p className="text-xs text-muted-foreground font-semibold">Lessons</p>
                            <p className="font-black text-foreground text-lg mt-1">{course.lessons}</p>
                          </div>
                          <div className="rounded-xl glass p-3">
                            <p className="text-xs text-muted-foreground font-semibold">Students</p>
                            <p className="font-black text-foreground text-lg mt-1">{course.students}</p>
                          </div>
                          <div className="rounded-xl glass p-3">
                            <p className="text-xs text-muted-foreground font-semibold">Rating</p>
                            <p className="font-black text-foreground text-lg mt-1">⭐ {course.rating}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Purchase Status */}
            {isPurchased && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl glass p-5 shadow-card border-2 border-green-500/30 bg-green-500/5"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-black text-green-600">You own this content</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Watch anytime, anywhere. Download for offline viewing.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Related Content (Scrollable) */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6 space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-black">Related Content</h3>
                <span className="text-xs font-bold text-muted-foreground">
                  {relatedContent.length} videos
                </span>
              </div>
              
              <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40">
                {relatedContent.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => navigate({ to: `/watch/${item.id}` })}
                    className="rounded-xl glass p-3 hover:bg-accent/50 cursor-pointer transition-all group shadow-card hover:shadow-elegant"
                  >
                    <div className="flex gap-3">
                      <div className="relative w-32 h-20 shrink-0 rounded-lg overflow-hidden">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play className="h-6 w-6 text-white drop-shadow-lg" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1.5 font-semibold">
                          {'instructor' in item ? item.instructor : 'Tally Academy'}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            item.price === "Free" || item.price === "₹0"
                              ? "bg-green-500/20 text-green-600"
                              : "bg-primary/20 text-primary"
                          }`}>
                            {item.price}
                          </span>
                          {('rating' in item) && (
                            <span className="text-xs text-muted-foreground font-semibold">
                              ⭐ {item.rating}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

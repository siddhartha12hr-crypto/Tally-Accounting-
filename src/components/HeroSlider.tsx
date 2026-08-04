import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { heroSlides } from "@/lib/mockData";
import { ArrowRight } from "lucide-react";
import { useData } from "@/contexts/DataContext";

const FALLBACK_SLIDES = heroSlides.map((slide, idx) => ({
  id: `fallback-${idx}`,
  image: slide.image,
  title: "",
  subtitle: "",
  buttonText: slide.hasButton ? slide.buttonText : "",
  buttonLink: slide.hasButton ? slide.buttonLink : "",
  hasButton: slide.hasButton,
  isActive: true,
  order: idx + 1,
  createdAt: "",
}));

export function HeroSlider() {
  const { sliders } = useData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="relative h-64" aria-hidden="true" />;

  const activeSlides = sliders.filter((s) => s.isActive).sort((a, b) => a.order - b.order);

  const slides =
    activeSlides.length > 0 ? activeSlides : sliders.length === 0 ? FALLBACK_SLIDES : [];

  const [i, setI] = useState(0);

  useEffect(() => {
    if (slides.length === 0) return;
    const id = setInterval(() => setI((v) => (v + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const slide = slides[Math.min(i, slides.length - 1)];

  return (
    <div className="relative h-64 overflow-hidden rounded-3xl shadow-elegant group">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Full Image */}
          <img
            src={slide.image}
            alt={slide.title || `Slide ${slide.order}`}
            className="w-full h-full object-cover"
          />

          {/* Subtle gradient overlay for text & button visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

          {/* Text overlay */}
          {(slide.title || slide.subtitle) && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute top-6 left-6 right-6"
            >
              {slide.title && (
                <h2 className="text-2xl font-black text-white drop-shadow-lg leading-tight">
                  {slide.title}
                </h2>
              )}
              {slide.subtitle && (
                <p className="text-xs text-white/90 mt-1.5 max-w-[80%] line-clamp-2">
                  {slide.subtitle}
                </p>
              )}
            </motion.div>
          )}

          {/* Optional Button */}
          {slide.hasButton && slide.buttonText && slide.buttonLink && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-6 left-6 right-6 flex justify-center"
            >
              <Link to={slide.buttonLink}>
                <motion.button
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/95 backdrop-blur-xl px-8 py-3.5 text-sm font-bold text-foreground shadow-2xl hover:bg-white transition-all"
                >
                  {slide.buttonText}
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Enhanced Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-black/30 backdrop-blur-xl rounded-full px-3 py-2">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setI(idx)}
            className={`transition-all rounded-full ${
              idx === i ? "w-8 h-2 bg-white" : "w-2 h-2 bg-white/60 hover:bg-white/80"
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <motion.div
        key={`progress-${slide.id}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 5, ease: "linear" }}
        className="absolute bottom-0 left-0 h-1 bg-white/80 origin-left z-20"
      />
    </div>
  );
}

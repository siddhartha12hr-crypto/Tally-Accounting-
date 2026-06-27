import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { heroSlides } from "@/lib/mockData";
import { ArrowRight } from "lucide-react";

export function HeroSlider() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % heroSlides.length), 5000);
    return () => clearInterval(id);
  }, []);
  const slide = heroSlides[i];
  
  return (
    <div className="relative h-64 overflow-hidden rounded-3xl shadow-elegant group">
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Full Image */}
          <img 
            src={slide.image} 
            alt={`Slide ${i + 1}`}
            className="w-full h-full object-cover"
          />
          
          {/* Subtle gradient overlay for better button visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Optional Button */}
          {slide.hasButton && (
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
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`transition-all rounded-full ${
              idx === i 
                ? "w-8 h-2 bg-white" 
                : "w-2 h-2 bg-white/60 hover:bg-white/80"
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <motion.div 
        key={`progress-${i}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 5, ease: "linear" }}
        className="absolute bottom-0 left-0 h-1 bg-white/80 origin-left z-20"
      />
    </div>
  );
}

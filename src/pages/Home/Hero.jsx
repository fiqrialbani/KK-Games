import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const banners = [
  '/img_home/KKGames.png',
  '/img_home/Bonus PEMBELIAN!.png'
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleDotClick = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Modern slide + fade + scale animation variants
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.05
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.6 },
        scale: { duration: 0.6 }
      }
    },
    exit: (dir) => ({
      x: dir < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.6 },
        scale: { duration: 0.6 }
      }
    })
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)]/50 shadow-2xl shadow-[var(--color-primary)]/5"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Banner Images Container using CSS Grid stack */}
        <div className="grid grid-cols-1 grid-rows-1 overflow-hidden w-full aspect-[2048/768]">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.img
              key={currentIndex}
              src={banners[currentIndex]}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              alt={`KK Games Banner ${currentIndex + 1}`}
              className="col-start-1 row-start-1 w-full h-full object-cover select-none"
            />
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        <AnimatePresence>
          {isHovered && (
            <>
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 border border-white/10 text-white backdrop-blur-md transition hover:bg-black/60 hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 border border-white/10 text-white backdrop-blur-md transition hover:bg-black/60 hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight size={20} />
              </motion.button>
            </>
          )}
        </AnimatePresence>

        {/* Dots Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === index
                  ? 'w-6 bg-[var(--color-primary)]'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}



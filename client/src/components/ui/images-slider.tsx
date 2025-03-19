import { cn } from "../../utils/cn";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useState } from "react";

export const ImagesSlider = ({
  images,
  children,
  overlay = true,
  overlayClassName,
  className,
  autoplay = true,
  direction = "up",
}: {
  images: string[];
  children?: React.ReactNode;
  overlay?: boolean;
  overlayClassName?: string;
  className?: string;
  autoplay?: boolean;
  direction?: "up" | "down" | "left" | "right";
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  useEffect(() => {
    // Preload images
    const preloadImages = async () => {
      const promises = images.map((src) => {
        return new Promise<string>((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(src);
          img.onerror = reject;
        });
      });

      try {
        const loadedImages = await Promise.all(promises);
        setLoadedImages(loadedImages);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load images", error);
        setLoading(false);
      }
    };

    preloadImages();
  }, [images]);

  const transitionDirection = {
    up: "translateY(100%)",
    down: "translateY(-100%)",
    left: "translateX(100%)",
    right: "translateX(-100%)",
  };

  const exitDirection = {
    up: "translateY(-100%)",
    down: "translateY(100%)",
    left: "translateX(-100%)",
    right: "translateX(100%)",
  };

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay, images.length]);

  return (
    <div
      className={cn(
        "overflow-hidden h-full w-full relative",
        className
      )}
    >
      <AnimatePresence>
        {!loading && loadedImages.length > 0 && (
          <motion.img
            key={currentIndex}
            src={loadedImages[currentIndex]}
            initial={{ opacity: 0, transform: transitionDirection[direction] }}
            animate={{ opacity: 1, transform: "translate(0%, 0%)" }}
            exit={{ opacity: 0, transform: exitDirection[direction] }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="h-full w-full object-cover absolute inset-0"
          />
        )}
      </AnimatePresence>
      
      {overlay && (
        <div
          className={cn(
            "absolute inset-0 bg-black/40",
            overlayClassName
          )}
        />
      )}
      
      {children && children}
    </div>
  );
}; 
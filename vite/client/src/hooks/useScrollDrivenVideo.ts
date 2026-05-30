
import { useEffect, useRef, useCallback } from "react";

export function useScrollDrivenVideo(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  containerRef: React.RefObject<HTMLDivElement | null>,
  isActive: boolean = true
) {
  const rafRef = useRef<number | null>(null);

  const scrub = useCallback(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    
    if (!video || !container || !isActive) return;

    const rect = container.getBoundingClientRect();
    const containerTop = rect.top;
    const containerHeight = rect.height;
    
    // Calculate how far through the container the viewport center is
    const viewCenter = window.innerHeight / 2;
    let progress = (viewCenter - containerTop) / containerHeight;
    
    // Clamp between 0 and 1
    progress = Math.min(1, Math.max(0, progress));
    
    // Map to video duration
    if (video.duration) {
      video.currentTime = progress * video.duration;
    }
    
    rafRef.current = requestAnimationFrame(scrub);
  }, [videoRef, containerRef, isActive]);

  useEffect(() => {
    if (!isActive) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      return;
    }

    rafRef.current = requestAnimationFrame(scrub);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [scrub, isActive]);
}
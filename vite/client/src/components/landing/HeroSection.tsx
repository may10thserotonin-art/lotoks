
import React, { useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

interface HeroSectionProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onSentinelChange: (isIntersecting: boolean) => void;
}

export default function HeroSection({ videoRef, onSentinelChange }: HeroSectionProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // When sentinel exits (goes above viewport), start scrubbing
        onSentinelChange(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: "0px 0px 0px 0px",
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [onSentinelChange]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Fixed Video Background */}
      <video
        ref={videoRef}
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/globe_vid.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay for readability */}
      <div className="fixed top-0 left-0 w-full h-full bg-navy/40 z-[1]" />

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl"
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gold"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 2C8 2 4 6 4 12s4 10 8 10 8-4 8-10S16 2 12 2z" fill="currentColor" opacity="0.2" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">
              Lotoks<span className="text-gold">.</span>
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Your global sponsorship{" "}
            <span className="text-gold">journey starts here.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto font-medium">
            Visa. Education. Job. PR. One platform, 4 pathways, worldwide.
          </p>

          {/* CTA Button */}
          <Link
            to="/eligibility"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gold text-navy font-bold text-lg rounded-full hover:bg-gold/90 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gold/20"
          >
            Check Eligibility
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-white/60">
            <span className="text-xs font-semibold uppercase tracking-widest">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-3 bg-white/60 rounded-full"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Sentinel - triggers scrub mode when scrolled past */}
      <div
        ref={sentinelRef}
        id="hero-sentinel"
        className="absolute bottom-0 left-0 w-full h-1"
      />
    </section>
  );
}
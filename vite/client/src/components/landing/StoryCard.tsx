
import React from "react";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

interface StoryCardProps {
  side: "left" | "right" | "center";
  heading: string;
  text: string;
  ctaLabel: string;
  ctaLink: string;
  delay?: number;
}

export default function StoryCard({
  side,
  heading,
  text,
  ctaLabel,
  ctaLink,
  delay = 0,
}: StoryCardProps) {
  const positionClasses = {
    left: "md:ml-12",
    right: "md:mr-auto md:ml-auto md:mr-12",
    center: "mx-auto",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
      className={`w-full max-w-md ${positionClasses[side]}`}
    >
      <div className="backdrop-blur-xl bg-navy/80 border border-gold/20 rounded-2xl p-8 md:p-12 shadow-2xl">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{heading}</h3>
        <p className="text-white/70 text-lg mb-8 leading-relaxed">{text}</p>
        <Link
          to={ctaLink}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-navy font-bold rounded-full hover:bg-gold/90 hover:scale-102 active:scale-98 transition-all"
        >
          {ctaLabel}
          <svg
            className="w-4 h-4"
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
      </div>
    </motion.div>
  );
}

import React, { useRef, useEffect } from "react";
import { useScrollDrivenVideo } from "@/hooks/useScrollDrivenVideo";
import StoryCard from "./StoryCard";

interface ScrubbingSectionsProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isScrubbing: boolean;
}

const sections = [
  {
    id: "dream",
    heading: "Stuck in a dream?",
    text: "There's a world waiting for you. Millions of opportunities across visa, education, jobs, and permanent residency—ready for you to explore.",
    ctaLabel: "Check Eligibility",
    ctaLink: "/eligibility",
    side: "left" as const,
  },
  {
    id: "apply",
    heading: "Apply in 2 minutes",
    text: "Our streamlined system handles the rest. No forms to chase, no endless documents—just submit and let us do the heavy lifting.",
    ctaLabel: "Start Application",
    ctaLink: "/apply",
    side: "right" as const,
  },
  {
    id: "process",
    heading: "We process, you fly",
    text: "We process your sponsorship. Approval in days, not months. Our experts work around the clock to fast-track your journey.",
    ctaLabel: "Get Sponsored Now",
    ctaLink: "/apply",
    side: "left" as const,
  },
  {
    id: "arrival",
    heading: "Welcome home",
    text: "New country. New life. We'll get you there. Your global journey starts with one click.",
    ctaLabel: "Start Your Journey",
    ctaLink: "/apply",
    side: "center" as const,
  },
];

export default function ScrubbingSections({
  videoRef,
  isScrubbing,
}: ScrubbingSectionsProps) {
  const storyRef = useRef<HTMLDivElement>(null);

  // Apply scroll-driven video when scrubbing is active
  useScrollDrivenVideo(videoRef, storyRef, isScrubbing);

  // Pause/play video based on scrub mode
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isScrubbing) {
      video.pause();
    } else {
      video.play();
    }
  }, [isScrubbing, videoRef]);

  return (
    <div ref={storyRef} className="relative">
      {sections.map((section, index) => (
        <section
          key={section.id}
          className="min-h-screen flex items-center justify-center py-20 px-6 relative"
        >
          <StoryCard
            side={section.side}
            heading={section.heading}
            text={section.text}
            ctaLabel={section.ctaLabel}
            ctaLink={section.ctaLink}
            delay={0.2}
          />
        </section>
      ))}
    </div>
  );
}
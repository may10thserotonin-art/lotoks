'use client';

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, 
  Star, 
  Quote, 
  ArrowRight,
  Play
} from "lucide-react";
import { Navbar, SectionWrapper, SectionHeading } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { GlassCard, ElevatedCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { fadeUpVariant, staggerContainer } from "@/components/ui/AnimationUtils";

// Filter options
const filterOptions = [
  { id: "all", label: "All Stories" },
  { id: "visa", label: "Visa Sponsorship" },
  { id: "education", label: "Education" },
  { id: "jobs", label: "Job Placement" },
  { id: "residence", label: "Residence" },
];

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    country: "Singapore",
    flag: "🇸🇬",
    type: "visa",
    typeLabel: "Visa Sponsorship",
    quote: "Lotoks made my dream of working in Europe a reality. The process was smooth and transparent, and I felt supported every step of the way. Now I'm living my best life in Germany!",
    rating: 5,
    hasVideo: false,
  },
  {
    id: 2,
    name: "Marcus Johnson",
    country: "USA",
    flag: "🇺🇸",
    type: "education",
    typeLabel: "Education Scholarship",
    quote: "Got a full scholarship to study in Canada. The team guided me through every step of the application process. couldn't have done it without them!",
    rating: 5,
    hasVideo: true,
  },
  {
    id: 3,
    name: "Amara Okonkwo",
    country: "Nigeria",
    flag: "🇳🇬",
    type: "jobs",
    typeLabel: "Job Placement",
    quote: "Found a tech job in Germany with full sponsorship. Best decision I ever made. The matching algorithm really understands what employers are looking for.",
    rating: 5,
    hasVideo: false,
  },
  {
    id: 4,
    name: "Yuki Tanaka",
    country: "Japan",
    flag: "🇯🇵",
    type: "visa",
    typeLabel: "Visa Sponsorship",
    quote: "The support team was incredible. They helped me navigate the complex visa requirements and now I'm working at my dream company in London.",
    rating: 5,
    hasVideo: false,
  },
  {
    id: 5,
    name: "Carlos Martinez",
    country: "Mexico",
    flag: "🇲🇽",
    type: "education",
    typeLabel: "Education Scholarship",
    quote: "Secured a partial scholarship for my MBA in the UK. The essay review and interview prep made all the difference in my application.",
    rating: 5,
    hasVideo: true,
  },
  {
    id: 6,
    name: "Priya Sharma",
    country: "India",
    flag: "🇮🇳",
    type: "residence",
    typeLabel: "Permanent Residence",
    quote: "The residence pathway program was exactly what I needed. Now I have permanent residency in Canada and my family can join me.",
    rating: 5,
    hasVideo: false,
  },
  {
    id: 7,
    name: "Thomas Berg",
    country: "Sweden",
    flag: "🇸🇪",
    type: "jobs",
    typeLabel: "Job Placement",
    quote: "Moved from Sweden to Australia for a senior engineering role. The relocation assistance made the transition so much easier.",
    rating: 4,
    hasVideo: false,
  },
  {
    id: 8,
    name: "Fatima Al-Hassan",
    country: "UAE",
    flag: "🇦🇪",
    type: "visa",
    typeLabel: "Visa Sponsorship",
    quote: "Got sponsored for a healthcare position in the UK. The verification process for my credentials was handled perfectly.",
    rating: 5,
    hasVideo: true,
  },
  {
    id: 9,
    name: "James Wilson",
    country: "UK",
    flag: "🇬🇧",
    type: "education",
    typeLabel: "Education Scholarship",
    quote: "Completed my PhD in the USA with full funding. The team helped me find programs that matched my research interests.",
    rating: 5,
    hasVideo: false,
  },
];

// Featured testimonials (for the top section)
const featuredTestimonials = testimonials.slice(0, 3);

// Testimonial Card Component
function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <GlassCard hoverable className="h-full relative">
        {/* Quote Icon */}
        <Quote className="w-12 h-12 text-gold/20 absolute top-6 right-6" />
        
        {/* Type Badge */}
        <div className="inline-block px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-medium mb-4">
          {testimonial.typeLabel}
        </div>
        
        {/* Rating */}
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < testimonial.rating ? 'text-gold fill-gold' : 'text-gold/30'}`} 
            />
          ))}
        </div>
        
        {/* Quote */}
        <p className="text-white/80 mb-6 italic text-lg leading-relaxed">
          "{testimonial.quote}"
        </p>
        
        {/* Video indicator */}
        {testimonial.hasVideo && (
          <div className="absolute top-6 right-20">
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
              <Play className="w-4 h-4 text-gold ml-0.5" />
            </div>
          </div>
        )}
        
        {/* Author */}
        <div className="flex items-center gap-4 pt-6 border-t border-white/10">
          <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center text-2xl">
            {testimonial.flag}
          </div>
          <div>
            <div className="font-semibold text-white text-lg">{testimonial.name}</div>
            <div className="text-white/50 text-sm">{testimonial.country}</div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

// Filter Buttons
function FilterButtons({ activeFilter, onFilterChange }: { activeFilter: string; onFilterChange: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-12">
      {filterOptions.map((option) => (
        <motion.button
          key={option.id}
          onClick={() => onFilterChange(option.id)}
          className={`
            px-6 py-3 rounded-xl font-medium transition-all
            ${activeFilter === option.id 
              ? 'bg-gold text-navy shadow-lg shadow-gold/30' 
              : 'bg-white text-navy/70 border-2 border-navy/10 hover:border-gold/30'
            }
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {option.label}
        </motion.button>
      ))}
    </div>
  );
}

// Featured Testimonials Section
function FeaturedSection() {
  return (
    <SectionWrapper className="bg-navy">
      <SectionHeading 
        title="Success Stories"
        subtitle="Real experiences from real people who transformed their lives"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {featuredTestimonials.map((testimonial, index) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
        ))}
      </div>
    </SectionWrapper>
  );
}

// Video Testimonials Section
function VideoTestimonials() {
  const videoTestimonials = testimonials.filter(t => t.hasVideo);
  
  return (
    <SectionWrapper className="bg-gradient-to-b from-white to-surface">
      <SectionHeading 
        title="Video Testimonials"
        subtitle="Hear directly from our successful applicants"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {videoTestimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
          >
            <ElevatedCard className="p-0 overflow-hidden">
              {/* Video thumbnail */}
              <div className="relative aspect-video bg-navy">
                <img 
                  src={`/images/unsplash/${index === 0 ? '1573496359142-b8d87734a5a2' : index === 1 ? '1523050854058-8df90110c9f1' : '1573497019940-1c28c88b4f3e'}-600x400.jpg`}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 bg-navy/30 flex items-center justify-center group-hover:bg-navy/50 transition-colors">
                  <motion.div 
                    className="w-16 h-16 rounded-full bg-gold flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Play className="w-6 h-6 text-navy ml-1" />
                  </motion.div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{testimonial.flag}</span>
                  <div>
                    <div className="font-semibold text-navy">{testimonial.name}</div>
                    <div className="text-navy/50 text-sm">{testimonial.country}</div>
                  </div>
                </div>
                <p className="text-navy/70 text-sm line-clamp-2">{testimonial.quote}</p>
              </div>
            </ElevatedCard>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// All Testimonials Grid
function TestimonialsGrid() {
  const [activeFilter, setActiveFilter] = useState("all");
  
  const filteredTestimonials = activeFilter === "all" 
    ? testimonials 
    : testimonials.filter(t => t.type === activeFilter);

  return (
    <SectionWrapper className="bg-gradient-to-b from-surface to-white">
      <SectionHeading 
        title="All Success Stories"
        subtitle="Browse through hundreds of journeys that started with Lotoks"
      />

      <FilterButtons 
        activeFilter={activeFilter} 
        onFilterChange={setActiveFilter} 
      />

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <TestimonialCard testimonial={testimonial} index={index} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </SectionWrapper>
  );
}

// Stats / Numbers Section
function StatsSection() {
  const stats = [
    { number: "50K+", label: "Happy Applicants" },
    { number: "98%", label: "Success Rate" },
    { number: "150+", label: "Countries" },
    { number: "4.9", label: "Average Rating" },
  ];

  return (
    <section className="py-20 bg-navy/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-gold mb-2">{stat.number}</div>
              <div className="text-navy/70">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <SectionWrapper className="bg-navy">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-heading font-bold text-white mb-6">
          Share Your Success Story
        </h2>
        <p className="text-xl text-white/70 mb-10">
          Join thousands of others who have achieved their dreams. Your journey could inspire others.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/eligibility">
            <Button variant="primary" size="lg">
              Start Your Journey
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="secondary" size="lg">
              Get in Touch
            </Button>
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
}

// Main Page Component
export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-surface">
      <Navbar />
      
      {/* Hero */}
      <section className="relative min-h-[40vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/Testimonials.png" alt="Testimonials" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/60 to-navy" />
        </div>
        
        {/* Decorative globe pattern */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full" />
        
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-heading font-bold text-white mb-4"
          >
            Success Stories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/70"
          >
            Real journeys from real people who achieved their global dreams
          </motion.p>
        </div>
      </section>

      <FeaturedSection />
      <VideoTestimonials />
      <StatsSection />
      <TestimonialsGrid />
      <CTASection />
      
      <Footer />
    </main>
  );
}
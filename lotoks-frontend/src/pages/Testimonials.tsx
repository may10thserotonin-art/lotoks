import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, 
  Star, 
  Quote, 
  ArrowRight,
  Play,
  X,
  Eye,
  Download,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  FileCheck
} from "lucide-react";
import { Navbar, SectionWrapper, SectionHeading } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { GlassCard, ElevatedCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { fadeUpVariant, staggerContainer } from "@/components/ui/AnimationUtils";

// Filter options for the stories grid
const filterOptions = [
  { id: "all", label: "All Stories" },
  { id: "visa", label: "Visa Sponsorship" },
  { id: "education", label: "Education" },
  { id: "jobs", label: "Job Placement" },
  { id: "residence", label: "Residence" },
];

// Testimonials data mapping real graduation and general UGC videos
const testimonials = [
  {
    id: 0,
    name: "Clyde",
    country: "Poland (via South Africa)",
    flag: "🇿🇦",
    type: "education",
    typeLabel: "Education & Visa",
    quote: "My name is Clyde, and this photo was taken at Basel International Airport, Switzerland/France, on my way to Poland to begin my studies. The journey to this point was not an easy one. After completing my A-Level studies in 2023, I applied to study in Poland and initially thought the process would be straightforward. However, I soon encountered a major challenge: securing a visa appointment at the Polish Embassy in Pretoria. Despite my efforts, I struggled for a long time without success. Everything changed in late July 2025 when a close friend referred me to Lotoks Consulting Agency. From that moment, the process became much smoother. Within just two weeks, the Lotoks team helped me secure a visa appointment and assisted me with all the necessary supporting documents. Their professionalism, efficiency, and guidance made what seemed impossible become a reality. If you are struggling with your study abroad process and feel like you've run out of options, don't give up. There is a way forward, and I highly recommend Lotoks Consulting Agency for their outstanding support and reliable services.",
    rating: 5,
    hasVideo: false,
    image: "/Clyde-Testimonials/Clyde.png",
  },
  {
    id: 1,
    name: "Aline Mwiza",
    country: "Poland (via Rwanda)",
    flag: "🇵🇱",
    type: "education",
    typeLabel: "Education Visa & Degree",
    quote: "So happy to share my graduation moment! Lotoks supported me from my application, throughout the visa process, all the way to my graduation day. They are truly the best agency!",
    rating: 5,
    hasVideo: true,
    videoUrl: "/ugc-testimonials/Graduating-videos/WhatsApp Video 2026-05-29 at 00.16.02.mp4",
    poster: "/ugc-testimonials/Graduation-photos/WhatsApp Image 2026-05-29 at 00.16.02.jpeg",
  },
  {
    id: 2,
    name: "Jonathan Kabeza",
    country: "Poland (via Rwanda)",
    flag: "🇵🇱",
    type: "education",
    typeLabel: "Education Scholarship",
    quote: "I am officially a graduate! Lotoks helped me secure my university admission and guided me through a flawless visa application. Highly recommend their services.",
    rating: 5,
    hasVideo: true,
    videoUrl: "/ugc-testimonials/Graduating-videos/WhatsApp Video 2026-05-29 at 00.54.33.mp4",
    poster: "/ugc-testimonials/Graduation-photos/WhatsApp Image 2026-05-29 at 00.54.29.jpeg",
  },
  {
    id: 3,
    name: "Emmanuel Nkurunziza",
    country: "Poland (via Rwanda)",
    flag: "🇵🇱",
    type: "education",
    typeLabel: "University Graduation",
    quote: "Holding my university degree is a dream come true. Thank you to the entire Lotoks team for helping me get admitted and visa sponsored. You changed my life!",
    rating: 5,
    hasVideo: true,
    videoUrl: "/ugc-testimonials/Graduating-videos/WhatsApp Video 2026-05-29 at 00.55.45.mp4",
    poster: "/ugc-testimonials/Graduation-photos/WhatsApp Image 2026-05-29 at 00.54.34.jpeg",
  },
  {
    id: 4,
    name: "David Ochieng",
    country: "Poland (via Kenya)",
    flag: "🇵🇱",
    type: "visa",
    typeLabel: "Work Visa Sponsorship",
    quote: "My work permit visa was successfully approved! Lotoks handled all the paperwork and connected me with my current employer. Their team is extremely professional and transparent.",
    rating: 5,
    hasVideo: true,
    videoUrl: "/ugc-testimonials/ugc-testimonias-video/WhatsApp Video 2026-05-28 at 22.19.20.mp4",
    poster: "/ugc-testimonials/Graduation-photos/a338a2c3-23fa-4588-ae92-fec3bbb1c0c8.jfif",
  },
  {
    id: 5,
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
    id: 6,
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
    id: 7,
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
    id: 8,
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
    id: 9,
    name: "Fatima Al-Hassan",
    country: "UAE",
    flag: "🇦🇪",
    type: "visa",
    typeLabel: "Visa Sponsorship",
    quote: "Got sponsored for a healthcare position in the UK. The verification process for my credentials was handled perfectly.",
    rating: 5,
    hasVideo: false,
  },
];

// Verified Visa approvals gathered from the truck-drivers and legal paths
const visaProofs = [
  {
    id: 1,
    title: "Permanent Residence Certificate",
    category: "residence",
    image: "/ugc-testimonials/Truck-drivers/Parmanent resident.jpg",
    description: "Official Permanent Residence (PR) confirmation approval issued for a commercial heavy transport candidate.",
  },
  {
    id: 2,
    title: "Skilled Driver Visa Confirmation",
    category: "visa",
    image: "/ugc-testimonials/Truck-drivers/WhatsApp Image 2026-05-29 at 00.05.50.jpeg",
    description: "Successful Work Visa Grant and Passport Stamp package verifying European relocation path.",
  },
  {
    id: 3,
    title: "Federal Skilled Entry Approval",
    category: "residence",
    image: "/ugc-testimonials/Truck-drivers/WhatsApp Image 2026-05-29 at 00.07.53.jpeg",
    description: "Federal Skilled Worker Invitation to Apply (ITA) letter with official consular registration seals.",
  },
  {
    id: 4,
    title: "LMIA positive Assessment Letter",
    category: "jobs",
    image: "/ugc-testimonials/Truck-drivers/WhatsApp Image 2026-05-29 at 00.07.54.jpeg",
    description: "Labour Market Impact Assessment (LMIA) positive decision confirming the positive job recruitment clearance.",
  },
  {
    id: 5,
    title: "Employment Visa Grant Stamp",
    category: "visa",
    image: "/ugc-testimonials/Truck-drivers/WhatsApp Image 2026-05-29 at 00.07.54 (1).jpeg",
    description: "Visa grant document confirming high-skilled commercial driver employment authorization.",
  },
  {
    id: 6,
    title: "Schengen Visa Residence Seal",
    category: "residence",
    image: "/ugc-testimonials/Truck-drivers/WhatsApp Image 2026-05-29 at 00.07.55.jpeg",
    description: "Passport copy displaying the official border agency temporary resident clearance permit.",
  },
  {
    id: 7,
    title: "Sponsorship Allocation Confirmation",
    category: "visa",
    image: "/ugc-testimonials/Truck-drivers/WhatsApp Image 2026-05-29 at 00.07.55 (2).jpeg",
    description: "Direct logistics corporation employer allocation clearance confirming sponsorship certificate.",
  },
  {
    id: 8,
    title: "Logistics Skilled Class Visa",
    category: "visa",
    image: "/ugc-testimonials/Truck-drivers/WhatsApp Image 2026-05-29 at 00.07.56.jpeg",
    description: "Official consulate entry visa foil stamped in the applicant passport enabling skilled work.",
  },
  {
    id: 9,
    title: "Consular Application Receipt",
    category: "residence",
    image: "/ugc-testimonials/Truck-drivers/WhatsApp Image 2026-05-29 at 00.07.56 (1).jpeg",
    description: "Verified biometric file confirmation and official case registration receipt from immigration services.",
  },
  {
    id: 10,
    title: "Corporate Work Placement Contract",
    category: "jobs",
    image: "/ugc-testimonials/Truck-drivers/WhatsApp Image 2026-05-29 at 00.50.24.jpeg",
    description: "Verified employment contract signed by European logistics enterprise sponsoring class 1 drivers.",
  },
  {
    id: 11,
    title: "Professional Driver Work Stamp",
    category: "visa",
    image: "/ugc-testimonials/Truck-drivers/WhatsApp Image 2026-05-29 at 00.50.24 (1).jpeg",
    description: "Verified transport authority work authorization certificate enabling heavy machinery logistics operations.",
  },
  {
    id: 12,
    title: "EU Biometric Residence Permit",
    category: "residence",
    image: "/ugc-testimonials/Truck-drivers/WhatsApp Image 2026-05-29 at 00.50.24 (2).jpeg",
    description: "Official biometric temporary residence permit card confirming local residency status.",
  },
  {
    id: 13,
    title: "Travel Visa stamp & Border Clearance",
    category: "visa",
    image: "/ugc-testimonials/Truck-drivers/WhatsApp Image 2026-05-29 at 00.50.25 (1).jpeg",
    description: "Border control confirmation stamp on official visa sheet validating legal employment arrival.",
  }
];

// Featured testimonials (for the top section)
const featuredTestimonials = testimonials.slice(0, 3);

// Testimonial Card Component
function TestimonialCard({ testimonial, index }: { testimonial: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      <GlassCard hoverable className="h-full relative overflow-hidden flex flex-col justify-between">
        <div>
          {/* Quote Icon */}
          <Quote className="w-12 h-12 text-gold/20 absolute top-6 right-6 z-10" />
          
          {/* Optional Image */}
          {testimonial.image && (
            <div className="w-full h-56 mb-5 rounded-xl overflow-hidden relative">
              <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
            </div>
          )}
          
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
        </div>
        
        {/* Author */}
        <div className="flex items-center gap-4 pt-6 border-t border-white/10 mt-auto">
          <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center text-2xl shadow-inner select-none">
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
            px-6 py-3 rounded-xl font-medium transition-all text-sm tracking-wide
            ${activeFilter === option.id 
              ? 'bg-gold text-navy shadow-lg shadow-gold/30 font-bold' 
              : 'bg-white text-navy/70 border border-navy/10 hover:border-gold/30'
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

// Video Testimonials Section with Playback Action
function VideoTestimonials({ onPlayVideo }: { onPlayVideo: (url: string) => void }) {
  const videoTestimonials = testimonials.filter(t => t.hasVideo);
  
  return (
    <SectionWrapper className="bg-gradient-to-b from-white to-surface">
      <SectionHeading 
        title="Real Video Testimonials"
        subtitle="Hear and see directly from our successful graduates and sponsored candidates"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {videoTestimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer flex flex-col h-full"
            onClick={() => testimonial.videoUrl && onPlayVideo(testimonial.videoUrl)}
          >
            <ElevatedCard className="p-0 overflow-hidden flex flex-col h-full bg-white border border-navy/5 shadow-md hover:shadow-xl hover:border-gold/40 transition-all duration-300">
              {/* Video thumbnail and Play trigger */}
              <div className="relative aspect-[4/3] bg-black overflow-hidden flex items-center justify-center">
                {testimonial.poster ? (
                  <img 
                    src={testimonial.poster}
                    alt={testimonial.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-navy to-navy/80" />
                )}
                {/* Play button overlay with modern ripple scale */}
                <div className="absolute inset-0 bg-navy/30 flex items-center justify-center group-hover:bg-navy/50 transition-colors duration-300">
                  <motion.div 
                    className="w-14 h-14 rounded-full bg-[#b7974a] text-white flex items-center justify-center shadow-lg border border-white/20"
                    whileHover={{ scale: 1.15 }}
                  >
                    <Play className="w-5 h-5 text-navy fill-navy ml-0.5" />
                  </motion.div>
                </div>
                {/* Duration Badge / Video indicator */}
                <span className="absolute bottom-3 right-3 text-xs bg-navy/80 text-white font-medium px-2 py-0.5 rounded backdrop-blur-sm">
                  UGC Video
                </span>
              </div>
              
              {/* Content */}
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xl select-none">{testimonial.flag}</span>
                    <div>
                      <div className="font-extrabold text-navy text-base leading-tight">{testimonial.name}</div>
                      <div className="text-navy/50 text-xs font-semibold">{testimonial.country}</div>
                    </div>
                  </div>
                  <p className="text-navy/70 text-sm italic leading-relaxed mb-4 line-clamp-3">
                    "{testimonial.quote}"
                  </p>
                </div>
                <div className="inline-flex self-start text-[11px] font-bold text-[#b7974a] bg-[#b7974a]/10 border border-[#b7974a]/20 px-2 py-0.5 rounded-full">
                  {testimonial.typeLabel}
                </div>
              </div>
            </ElevatedCard>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// Interactive Visa and PR Gallery for Genuine Success proof (from ugc-testimonials/Truck-drivers)
function VisaGallery({ onViewImage }: { onViewImage: (src: string, title: string, desc: string) => void }) {
  const [galleryFilter, setGalleryFilter] = useState("all");
  
  const filteredProofs = galleryFilter === "all"
    ? visaProofs
    : visaProofs.filter(p => p.category === galleryFilter);

  return (
    <SectionWrapper className="bg-navy relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#b7974a]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal/5 rounded-full blur-3xl pointer-events-none" />

      <SectionHeading 
        title="Verified Consular & PR Approvals"
        subtitle="Complete honesty and transparency. Review actual, verified Permanent Resident (PR) cards, job offer approvals, and visas granted to our professional candidates."
      />

      {/* Gallery Filter buttons */}
      <div className="flex flex-wrap gap-2.5 justify-center mb-10">
        {[
          { id: "all", label: "All Documents" },
          { id: "visa", label: "Visa Stamping" },
          { id: "residence", label: "Permanent Residence" },
          { id: "jobs", label: "Employment Approvals" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setGalleryFilter(tab.id)}
            className={`
              px-5 py-2 rounded-xl text-xs font-bold transition-all border
              ${galleryFilter === tab.id
                ? 'bg-[#b7974a] text-navy border-transparent shadow-md'
                : 'bg-white/5 text-white/70 border-white/10 hover:border-white/30 hover:text-white'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid gallery */}
      <motion.div 
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
      >
        <AnimatePresence mode="popLayout">
          {filteredProofs.map((proof) => (
            <motion.div
              key={proof.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              whileHover={{ y: -5 }}
              className="group cursor-pointer relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2 transition-all duration-300 hover:border-[#b7974a]/40"
              onClick={() => onViewImage(proof.image, proof.title, proof.description)}
            >
              {/* Image backdrop */}
              <div className="relative aspect-[3/4] bg-navy-dark overflow-hidden rounded-lg">
                <img 
                  src={proof.image} 
                  alt={proof.title}
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Hover overlay details */}
                <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-4 transition-all duration-300">
                  <div className="w-8 h-8 rounded-full bg-[#b7974a] flex items-center justify-center mb-3 shadow-md text-navy">
                    <Eye className="w-4 h-4" />
                  </div>
                  <h4 className="text-white font-bold text-sm leading-snug mb-1">{proof.title}</h4>
                  <p className="text-white/60 text-[11px] leading-normal line-clamp-2">{proof.description}</p>
                </div>
              </div>
              
              {/* Card Bottom Tag */}
              <div className="p-3">
                <h4 className="text-white font-bold text-xs leading-tight mb-1 truncate">{proof.title}</h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-[#b7974a] font-bold uppercase tracking-wider">
                    {proof.category}
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#b7974a]" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
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
          <Link to="/eligibility">
            <Button variant="primary" size="lg">
              Start Your Journey
            </Button>
          </Link>
          <Link to="/contact">
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
  // Modal states
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<{ src: string; title: string; desc: string } | null>(null);

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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full animate-[spin_120s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full animate-[spin_80s_linear_infinite_reverse]" />
        
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-heading font-bold text-white mb-4"
          >
            Candidate Success Stories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/70"
          >
            Real user-generated videos, verified legal approvals, and genuine global admissions journeys.
          </motion.p>
        </div>
      </section>

      {/* Video testimonies showing graduating and sponsored candidate clips */}
      <VideoTestimonials onPlayVideo={setActiveVideo} />

      {/* Featured Testimonials */}
      <FeaturedSection />

      {/* Verified Visa & Permanent Resident proof documents */}
      <VisaGallery onViewImage={(src, title, desc) => setActiveImage({ src, title, desc })} />

      {/* Statistics */}
      <StatsSection />

      {/* Filterable story Grid */}
      <TestimonialsGrid />

      {/* CTA Relocation trigger */}
      <CTASection />
      
      <Footer />

      {/* 1. HTML5 Video Player overlay Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/90 backdrop-blur-md"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-navy/70 hover:bg-[#b7974a] text-white flex items-center justify-center transition-all hover:scale-105 shadow-md border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Video container */}
              <div className="aspect-video w-full bg-black flex items-center justify-center">
                <video 
                  controls 
                  autoPlay 
                  playsInline
                  src={activeVideo} 
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Interactive Success Proof Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-navy/95 backdrop-blur-lg"
            onClick={() => setActiveImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-full max-h-[80vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header control buttons */}
              <div className="absolute -top-12 right-0 flex gap-3">
                <a
                  href={activeImage.src}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Download verification document"
                  className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 hover:bg-[#b7974a] hover:text-navy text-white flex items-center justify-center transition-all"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setActiveImage(null)}
                  className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 hover:bg-[#b7974a] hover:text-navy text-white flex items-center justify-center transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Full resolution display */}
              <div className="bg-navy-dark border border-white/10 p-2.5 rounded-2xl shadow-2xl flex items-center justify-center">
                <img 
                  src={activeImage.src} 
                  alt={activeImage.title}
                  className="max-w-[90vw] max-h-[70vh] object-contain rounded-lg"
                />
              </div>

              {/* Description Panel */}
              <div className="mt-4 text-center max-w-xl">
                <h3 className="text-white font-bold text-lg">{activeImage.title}</h3>
                <p className="text-white/60 text-xs mt-1.5 leading-relaxed">{activeImage.desc}</p>
                <div className="inline-flex items-center gap-1.5 mt-3 text-[10px] text-[#b7974a] bg-[#b7974a]/10 border border-[#b7974a]/20 px-2.5 py-0.5 rounded-full font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  VERIFIED OFFICIAL DOCUMENT
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

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
    name: "Brian",
    country: "Poland (via Zimbabwe)",
    flag: "🇿🇼",
    type: "education",
    typeLabel: "Computer Science Major (Mobile Software Engineering)",
    quote: "My name is Brian, and I have been in Poland studying computer science with a major in mobile software engineering. I had a great experience working with Lotoks Consulting. From the beginning, they guided me through the entire study abroad process in a professional and supportive way. They helped me with the application for the course at Uniwersytet WSB Merito in Poznań, assisted me with visa applications, and also helped with travelling arrangements and itinerary planning. Their communication was clear, and they were always available whenever I had questions or needed assistance. Thanks to their guidance, the process became much easier and less stressful. I highly recommend Lotoks Consulting to anyone looking for assistance with studying abroad, as it went very well for me.",
    rating: 5,
    hasVideo: false,
    image: "/ugc-testimonials/Brian-Testimonials/Brian.jpeg",
  },
  {
    id: 2,
    name: "Rethabile Nyathi",
    country: "Poland (via South Africa)",
    flag: "🇿🇦",
    type: "education",
    typeLabel: "Study Abroad (Poland)",
    quote: "Thanks to the dedicated support of Lotoks Consulting, I am now pursuing my education in Poland—a dream I once thought was out of reach. Their team guided me through each stage with professionalism and genuine care. Their partnership with trusted institutions like UITM – University of Information Technology and Management in Rzeszów, Poland, gave me confidence that I was applying to a legitimate and high-quality program. I am deeply grateful to the Lotoks team for making my study abroad journey possible.",
    rating: 5,
    hasVideo: true,
    videoUrl: "/ugc-testimonials/Graduating-videos/WhatsApp Video 2026-05-29 at 00.16.02.mp4",
    poster: "/ugc-testimonials/Graduation-photos/WhatsApp Image 2026-05-29 at 00.16.02.jpeg",
  },
  {
    id: 3,
    name: "Tanaka",
    country: "Capetown South Africa",
    flag: "🇿🇦",
    type: "education",
    typeLabel: "Education Scholarship",
    quote: "I am officially a graduate! Lotoks helped me secure my university admission and guided me through a flawless visa application. Highly recommend their services.",
    rating: 5,
    hasVideo: true,
  },
  {
    id: 4,
    name: "Clyde",
    country: "Poland (via Zimbabwe)",
    flag: "🇿🇼",
    type: "education",
    typeLabel: "Student Visa Success",
    quote: "I'm Clyde from Bulawayo, Zimbabwe. I want to thank Lotoks Consulting for the incredible support they gave me throughout my study abroad journey. From helping with my application to securing my visa and even arranging my travel, every step was handled with care and professionalism. They made my dream of studying in Poland a reality. If you're looking for a trustworthy partner to guide you abroad, Lotoks is the real deal. I highly recommend them!",
    rating: 5,
    hasVideo: true,
    videoUrl: "/ugc-testimonials/ugc-testimonias-video/clyde.mp4",
  },
  {
    id: 5,
    name: "Adolf Hlungwani",
    country: "Lithuania (via South Africa)",
    flag: "🇿🇦",
    type: "visa",
    typeLabel: "Truck Driver (Lithuania)",
    quote: "I'm Adolf Hlungwani, a truck driver based in Lithuania originally from South Africa. I want to thank Lotoks Consulting for helping me secure this incredible opportunity abroad. They connected me with a reputable transport company in Lithuania and handled all the paperwork, visa processing, and logistical arrangements professionally. Their team made the entire relocation process smooth and stress-free. Thanks to their support, I'm now driving international routes across Europe and building a better future for myself and my family. If you're a skilled driver looking for overseas opportunities, I highly recommend reaching out to Lotoks — they deliver results!",
    rating: 5,
    hasVideo: true,
    videoUrl: "/ugc-testimonials/Truck-drivers/truck-testimonial.mp4",
  },
  {
    id: 6,
    name: "Confirm Mpofu",
    country: "Lithuania",
    flag: "🇱🇹",
    type: "residence",
    typeLabel: "Lithuania TRP",
    quote: "SUCCESS ALERT! I am thrilled to announce that I have obtained my 2-Year Lithuania Temporary Residence Permit (TRP). Another dream achieved with the support of LOTOKS Consulting Agency. I am honored to have been guided through this journey and I wish myself all the best as I begin this exciting new chapter in Lithuania. Your journey starts with a single step. Let LOTOKS Consulting Agency guide the way.",
    rating: 5,
    hasVideo: true,
    poster: "/ugc-testimonials/Truck-drivers/2-Year Lithuania Temporary Residence Permit (TRP).png",
  },
  {
    id: 7,
    name: "Khawuleza Ngwenya",
    country: "Lithuania (via Zimbabwe)",
    flag: "🇿🇼",
    type: "visa",
    typeLabel: "Truck Driver (Lithuania)",
    quote: "I'm Khawuleza Ngwenya from Zimbabwe, currently working as a truck driver in Lithuania. Thanks to LOTOKS Consulting Agency, I was able to secure this life-changing opportunity abroad. They handled everything from the paperwork to the placement, making the entire process smooth and stress-free. I'm now driving across Europe and building a better future. If you're looking for genuine assistance to work overseas, I highly recommend LOTOKS!",
    rating: 5,
    hasVideo: true,
    poster: "/ugc-testimonials/Truck-drivers/litua.png",
  },

  {
    id: 8,
    name: "Ruvarashe Vanessa Mashange",
    country: "South Africa",
    flag: "🇿🇦",
    type: "success",
    typeLabel: "Success Story",
    quote: "My journey with Lotoks Consulting has been nothing short of amazing. Their team provided exceptional support and guidance throughout the entire process. I am truly grateful for their professionalism and dedication.",
    rating: 5,
    hasVideo: true,
    videoUrl: "/Ruvarashe-Vanessa-Mashange-video/ruvarashe-vanessa-mashange.mp4",
  },
  {
    id: 9,
    name: "Qhibekani Ngwenya",
    country: "United Kingdom",
    flag: "🇬🇧",
    type: "work",
    typeLabel: "Health-Care Worker (UK)",
    quote: "I want to thank Lotoks Consulting Agency through their help I am able to work as a health-care worker in the UK.",
    rating: 5,
    hasVideo: true,
    poster: "/Care-worker/Qhibekani Ngwenya.png",
  },
];

// Verified Visa approvals gathered from the truck-drivers folder
const truckDriverProofs = [
  {
    id: 1,
    title: "Skilled Driver Visa Confirmation",
    image: "/ugc-testimonials/Truck-drivers/WhatsApp Image 2026-05-29 at 00.05.50.jpeg",
    description: "Successful Work Visa Grant and Passport Stamp package verifying European relocation path.",
  },
  {
    id: 2,
    title: "Federal Skilled Entry Approval",
    image: "/ugc-testimonials/Truck-drivers/WhatsApp Image 2026-05-29 at 00.07.53.jpeg",
    description: "Federal Skilled Worker Invitation to Apply (ITA) letter with official consular registration seals.",
  },
  {
    id: 3,
    title: "LMIA positive Assessment Letter",
    image: "/ugc-testimonials/Truck-drivers/WhatsApp Image 2026-05-29 at 00.07.54.jpeg",
    description: "Labour Market Impact Assessment (LMIA) positive decision confirming the positive job recruitment clearance.",
  },
  {
    id: 4,
    title: "Employment Visa Grant Stamp",
    image: "/ugc-testimonials/Truck-drivers/WhatsApp Image 2026-05-29 at 00.07.54 (1).jpeg",
    description: "Visa grant document confirming high-skilled commercial driver employment authorization.",
  },
  {
    id: 5,
    title: "Schengen Visa Residence Seal",
    image: "/ugc-testimonials/Truck-drivers/WhatsApp Image 2026-05-29 at 00.07.55.jpeg",
    description: "Passport copy displaying the official border agency temporary resident clearance permit.",
  },
  {
    id: 6,
    title: "Sponsorship Allocation Confirmation",
    image: "/ugc-testimonials/Truck-drivers/WhatsApp Image 2026-05-29 at 00.07.55 (2).jpeg",
    description: "Direct logistics corporation employer allocation clearance confirming sponsorship certificate.",
  },
  {
    id: 7,
    title: "Logistics Skilled Class Visa",
    image: "/ugc-testimonials/Truck-drivers/WhatsApp Image 2026-05-29 at 00.07.56.jpeg",
    description: "Official consulate entry visa foil stamped in the applicant passport enabling skilled work.",
  },
  {
    id: 8,
    title: "Consular Application Receipt",
    image: "/ugc-testimonials/Truck-drivers/WhatsApp Image 2026-05-29 at 00.07.56 (1).jpeg",
    description: "Verified biometric file confirmation and official case registration receipt from immigration services.",
  },
  {
    id: 9,
    title: "Corporate Work Placement Contract",
    image: "/ugc-testimonials/Truck-drivers/WhatsApp Image 2026-05-29 at 00.50.24.jpeg",
    description: "Verified employment contract signed by European logistics enterprise sponsoring class 1 drivers.",
  },
  {
    id: 10,
    title: "Professional Driver Work Stamp",
    image: "/ugc-testimonials/Truck-drivers/WhatsApp Image 2026-05-29 at 00.50.24 (1).jpeg",
    description: "Verified transport authority work authorization certificate enabling heavy machinery logistics operations.",
  },
  {
    id: 11,
    title: "EU Biometric Residence Permit",
    image: "/ugc-testimonials/Truck-drivers/WhatsApp Image 2026-05-29 at 00.50.24 (2).jpeg",
    description: "Official biometric temporary residence permit card confirming local residency status.",
  },
  {
    id: 12,
    title: "Travel Visa stamp & Border Clearance",
    image: "/ugc-testimonials/Truck-drivers/WhatsApp Image 2026-05-29 at 00.50.25 (1).jpeg",
    description: "Border control confirmation stamp on official visa sheet validating legal employment arrival.",
  }
];

// Featured testimonials (for the top section)
const featuredTestimonials = testimonials.slice(0, 3);

// Testimonial Card Component
function TestimonialCard({ testimonial, index }: { testimonial: any; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const isLongQuote = testimonial.quote.length > 200;

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
            <div className="w-full h-48 sm:h-56 mb-5 rounded-xl overflow-hidden relative shrink-0">
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
          <div className="mb-6">
            <p className={`text-white/80 italic text-lg leading-relaxed transition-all duration-300 ${!expanded && isLongQuote ? 'line-clamp-4' : ''}`}>
              "{testimonial.quote}"
            </p>
            {isLongQuote && (
              <button 
                onClick={() => setExpanded(!expanded)}
                className="text-gold text-sm font-semibold mt-2 hover:underline focus:outline-none"
              >
                {expanded ? "Read less" : "Read more"}
              </button>
            )}
          </div>
        </div>
        
        {/* Author */}
        <div className="flex items-center gap-4 pt-6 border-t border-white/10 mt-auto">
          <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center text-2xl shadow-inner select-none shrink-0">
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
        lightText
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
    <SectionWrapper className="bg-gradient-to-b from-white to-surface relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-teal/5 rounded-full blur-3xl pointer-events-none" />

      <SectionHeading 
        title="Testimonials"
        subtitle="Hear and see directly from our successful graduates and sponsored candidates"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {videoTestimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.12 }}
            className={`group flex flex-col h-full ${testimonial.videoUrl ? 'cursor-pointer' : ''}`}
            onClick={() => testimonial.videoUrl && onPlayVideo(testimonial.videoUrl)}
          >
            <div className="relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-navy/5 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
              {/* Video thumbnail with cinematic overlay */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-navy/90 to-navy overflow-hidden">
                {testimonial.poster ? (
                  <>
                    <img 
                      src={testimonial.poster}
                      alt={testimonial.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Multi-layer gradient overlay for cinematic look */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-navy to-navy/80" />
                )}
                
                {/* Premium Play / View button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {testimonial.videoUrl ? (
                    <motion.div 
                      className="relative"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {/* Outer ring glow */}
                      <div className="absolute inset-0 rounded-full bg-gold/30 blur-md animate-pulse" />
                      {/* Button */}
                      <div className="relative w-16 h-16 rounded-full bg-gold text-navy flex items-center justify-center shadow-xl border-2 border-white/30 transition-shadow duration-300 group-hover:shadow-gold/50">
                        <Play className="w-6 h-6 ml-0.5 fill-navy" />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="relative"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="relative w-16 h-16 rounded-full bg-white/20 text-white flex items-center justify-center shadow-xl border-2 border-white/40 backdrop-blur-sm transition-shadow duration-300 group-hover:bg-white/30">
                        <Eye className="w-6 h-6" />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Top gradient edge accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />
                
                {/* Bottom metadata bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < testimonial.rating ? 'text-gold fill-gold' : 'text-white/30'}`} 
                        />
                      ))}
                    </div>
                    <span className="ml-auto text-[10px] font-bold text-white/80 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm tracking-wide">
                      {testimonial.videoUrl ? 'Video Story' : 'Success Story'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Content area with glassmorphism */}
              <div className="relative flex flex-col flex-1 p-5 bg-white">
                {/* Subtle top border accent */}
                <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                
                {/* Author info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold to-gold/70 flex items-center justify-center text-base shadow-md shrink-0">
                    {testimonial.flag}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-navy text-base leading-tight truncate">{testimonial.name}</div>
                    <div className="flex items-center gap-1.5 text-navy/50 text-xs font-medium">
                      <Globe className="w-3 h-3" />
                      {testimonial.country}
                    </div>
                  </div>
                </div>

                {/* Quote with decorative mark */}
                <div className="relative flex-1">
                  <Quote className="absolute -top-1 -left-1 w-6 h-6 text-gold/15" />
                  <p className="text-navy/70 text-sm leading-relaxed line-clamp-3 pl-4 italic">
                    "{testimonial.quote}"
                  </p>
                </div>

                {/* Bottom section */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-navy/5">
                  <span className="text-[11px] font-bold text-gold bg-gold/10 px-3 py-1 rounded-full tracking-wide">
                    {testimonial.typeLabel}
                  </span>
                  <span className="text-[11px] font-semibold text-navy/40 flex items-center gap-1.5 group-hover:text-gold transition-colors duration-300">
                    {testimonial.videoUrl ? 'Watch Video' : 'View Story'}
                    {testimonial.videoUrl ? <Play className="w-3 h-3 fill-current" /> : <Eye className="w-3 h-3" />}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// Truck Drivers Gallery (from ugc-testimonials/Truck-drivers)
function TruckDriversGallery({ onViewImage }: { onViewImage: (src: string, title: string, desc: string) => void }) {
  return (
    <SectionWrapper className="bg-navy relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#b7974a]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
          Testing Of Truck Drivers In <span className="text-gold">Zimbabwe</span>
        </h2>
        <p className="text-white/60 text-base max-w-3xl">
          Professional truck driver assessment and certification processes for skilled transportation roles across African routes. Review verified documents from our candidates.
        </p>
      </div>

      {/* Grid gallery */}
      <motion.div 
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
      >
        <AnimatePresence mode="popLayout">
          {truckDriverProofs.map((proof) => (
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
              {/* Image */}
              <div className="relative aspect-[3/4] bg-navy-dark overflow-hidden rounded-lg">
                <img 
                  src={proof.image} 
                  alt={proof.title}
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Hover overlay — Eye icon only */}
                <div className="absolute inset-0 bg-navy/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-[#b7974a] flex items-center justify-center shadow-lg text-navy">
                    <Eye className="w-5 h-5" />
                  </div>
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

// Our Gallery Section
const galleryImages = [
  {
    src: "/Gallery/After a long search of jobs in luxembourg.jpeg",
    title: "After a long search of jobs in Luxembourg",
  },
  {
    src: "/Gallery/after a successful collaboration in warsaw poland.jpeg",
    title: "Successful Collaboration in Warsaw, Poland",
  },
  {
    src: "/Gallery/Another collaboration.jpeg",
    title: "Another Successful Collaboration",
  },
  {
    src: "/Gallery/OLD TOWN in warsaw.jpeg",
    title: "Old Town, Warsaw",
  },
  {
    src: "/Gallery/Poland.jpeg",
    title: "Poland",
  },
  {
    src: "/Gallery/visiting a company that I had a contract with poland.jpeg",
    title: "Partner in Poland for trucking company",
  },
];

function OurGallery() {
  const [activeGalleryImage, setActiveGalleryImage] = useState<string | null>(null);

  return (
    <>
      <SectionWrapper className="bg-gradient-to-b from-white to-surface relative overflow-hidden">
        {/* Ambient background accents */}
        <div className="absolute top-20 left-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-0 w-[500px] h-[500px] bg-teal/5 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-on-surface mb-4">
            Our <span className="text-gold">Gallery</span>
          </h2>
          <p className="text-on-surface-variant text-base max-w-2xl mx-auto font-medium">
            Real moments captured across Europe — from successful collaborations to life-changing milestones
          </p>
        </div>

        {/* Uniform Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setActiveGalleryImage(img.src)}
            >
              <div className="relative bg-white rounded-xl overflow-hidden border border-navy/5 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500">
                {/* Image container with fixed aspect ratio */}
                <div className="relative aspect-[4/3] overflow-hidden bg-navy">
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* View button on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      whileInView={{ scale: 1 }}
                      className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg text-navy"
                    >
                      <Eye className="w-5 h-5" />
                    </motion.div>
                  </div>
                </div>

                {/* Bottom content strip */}
                <div className="p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-gold uppercase tracking-widest block mb-1">
                      Gallery • {String(index + 1).padStart(2, '0')}
                    </span>
                    <h4 className="font-bold text-navy text-sm leading-snug truncate">
                      {img.title}
                    </h4>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors duration-300">
                    <ArrowRight className="w-4 h-4 text-gold" />
                  </div>
                </div>

                {/* Bottom gold accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold/0 via-gold/50 to-gold/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Gallery Lightbox Modal */}
      <AnimatePresence>
        {activeGalleryImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/95 backdrop-blur-lg"
            onClick={() => setActiveGalleryImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeGalleryImage}
                alt="Gallery photo"
                className="w-full h-full object-contain rounded-2xl shadow-2xl"
              />
              <button
                onClick={() => setActiveGalleryImage(null)}
                className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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

      {/* Truck Drivers Testing Gallery */}
      <TruckDriversGallery onViewImage={(src, title, desc) => setActiveImage({ src, title, desc })} />

      {/* Our Gallery */}
      <OurGallery />

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

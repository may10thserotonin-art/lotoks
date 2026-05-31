
import React, { useRef, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from "framer-motion";
import { 
  Globe, 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Award, 
  Building2, 
  GraduationCap,
  Briefcase,
  Home,
  Star,
  Quote,
  ExternalLink,
  Handshake
} from "lucide-react";
import { Navbar, PageHero, SectionWrapper, SectionHeading } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { GlassCard, ElevatedCard, ImageCard, StatCard, ProcessStepCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { fadeUpVariant, staggerContainer, bounceVariant, pulseVariant } from "@/components/ui/AnimationUtils";

// Real partner organisations
const partners = [
  {
    name: "Everest Educational Services",
    logo: "/images/partners/everest-logo.png",
    description: "Your trusted partner for international education. Connecting students worldwide with top academic programs and expert guidance for study abroad.",
    website: "https://everestedu.ca/",
    tag: "Education Partner",
  },
  {
    name: "UITM – University of Information Technology and Management",
    logo: "/images/partners/uitm-logo.svg",
    description: "A leading Polish university offering world-class degree programs in IT and management. Recognised internationally for academic excellence in Rzeszów, Poland.",
    website: "https://en.uitm.edu.eu/",
    tag: "University Partner",
  },
  {
    name: "APSO – African Professional Staffing Organisations",
    logo: "/images/partners/apso-logo.png",
    description: "The Federation of African Professional Staffing Organisations, dedicated to setting ethical standards and empowering staffing professionals across Africa.",
    website: "https://apso.org.za/",
    tag: "Accreditation Body",
  },
];

// Process steps for "How It Works"
const processSteps = [
  {
    step: 1,
    title: "Create Account",
    description: "Sign up in seconds and complete your profile with basic information.",
  },
  {
    step: 2,
    title: "Apply in 2 Minutes",
    description: "Select your desired sponsorship type and fill in your details.",
  },
  {
    step: 3,
    title: "We Process",
    description: "Our team reviews your application and matches you with opportunities.",
  },
  {
    step: 4,
    title: "Get Sponsored",
    description: "Connect with sponsors and start your journey to a new life.",
  },
];

// Services overview
const services = [
  {
    id: "visa",
    title: "Visa Sponsorship",
    description: "Work, study, and travel visas with verified sponsors",
    image: "/images/Visa-sponsorship.jpg",
    icon: Globe,
  },
  {
    id: "education",
    title: "Education Scholarships",
    description: "Full and partial scholarships at top universities worldwide",
    image: "/images/Educational-scholarship.jpg",
    icon: GraduationCap,
  },
  {
    id: "jobs",
    title: "Job Placements",
    description: "Connect with employers offering sponsorship packages",
    image: "/images/job-placement.jpg",
    icon: Briefcase,
  },
  {
    id: "residence",
    title: "Permanent Residence",
    description: "Pathways to citizenship through investment and work",
    image: "/images/permanent-resident.jpg",
    icon: Home,
  },
];

// Testimonials preview
const testimonialsPreview = [
  {
    id: 1,
    name: "Sarah Chen",
    country: "Singapore",
    code: "sg",
    type: "Visa Sponsorship",
    quote: "Lotoks made my dream of working in Europe a reality. The process was smooth and transparent.",
    rating: 5,
  },
  {
    id: 2,
    name: "Marcus Johnson",
    country: "USA",
    code: "us",
    type: "Education Scholarship",
    quote: "Got a full scholarship to study in Canada. The team guided me through every step.",
    rating: 5,
  },
  {
    id: 3,
    name: "Amara Okonkwo",
    country: "Nigeria",
    code: "ng",
    type: "Job Placement",
    quote: "Found a tech job in Germany with full sponsorship. Best decision I ever made.",
    rating: 5,
  },
];

// Stats for the homepage
const stats = [
  { number: 50000, suffix: "+", label: "Applications Processed" },
  { number: 98, suffix: "%", label: "Success Rate" },
  { number: 45, suffix: "+", label: "Partner Countries" },
  { number: 14, suffix: " Days", label: "Average Processing" },
];

// Animated counter component
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    }
  }, [isInView, target]);
  
  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// Hero Section Component
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/bg_hero.png" 
          alt="Lotoks Hero Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/40 to-navy" />
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal/10 rounded-full blur-3xl" />
      
      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 left-10 w-4 h-4 bg-gold/60 rounded-full"
        animate={{ y: [0, -20, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 3 }}
      />
      <motion.div
        className="absolute top-40 right-20 w-3 h-3 bg-gold/40 rounded-full"
        animate={{ y: [0, 15, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
      />
      <motion.div
        className="absolute bottom-32 left-1/3 w-5 h-5 bg-gold/30 rounded-full"
        animate={{ y: [0, -10, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 4 }}
      />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-8"
        >
          <Star className="w-4 h-4 text-gold" />
          <span className="text-sm font-medium text-gold">Trusted by 50,000+ applicants worldwide</span>
        </motion.div>
        
        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6"
        >
          Your Gateway to
          <span className="block text-gold">Global Opportunities</span>
        </motion.h1>
        
        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-10"
        >
          We connect aspirational professionals with visa sponsorships, education scholarships, job placements, and residence programs worldwide.
        </motion.p>
        
        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Link to="/eligibility">
            <Button 
              variant="primary" 
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
            >
              Check Your Eligibility
            </Button>
          </Link>
          <Link to="/services">
            <Button 
              variant="secondary" 
              size="lg"
            >
              Explore Services
            </Button>
          </Link>
        </motion.div>
        
        {/* Floating Stats Card */}
        <motion.div
          variants={bounceVariant}
          animate="animate"
          className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20"
        >
          <div className="flex -space-x-3">
            {[
              { code: "sg", name: "Singapore" },
              { code: "us", name: "USA" },
              { code: "ng", name: "Nigeria" },
              { code: "gb", name: "United Kingdom" },
              { code: "au", name: "Australia" }
            ].map((country, i) => (
              <div 
                key={i}
                className="w-10 h-10 rounded-full bg-navy border-2 border-white flex items-center justify-center overflow-hidden"
                title={country.name}
              >
                <img 
                  src={`https://flagcdn.com/w80/${country.code}.png`}
                  alt={country.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="text-left">
            <div className="text-white font-bold">10,000+</div>
            <div className="text-white/60 text-sm">Active applicants</div>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <motion.div 
            className="w-1.5 h-1.5 bg-gold rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>
      </motion.div>
    </section>
  );
}

// Partners Section Component
function PartnersSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-navy to-navy/95 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-teal/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-5">
            <Handshake className="w-4 h-4 text-gold" />
            <span className="text-sm font-semibold text-gold uppercase tracking-widest">Our Partners &amp; Accreditations</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Trusted by Leading Institutions
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            We collaborate with accredited universities, placement agencies, and professional bodies worldwide to deliver verified, high-quality opportunities.
          </p>
        </motion.div>

        {/* Partner cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                type: "spring",
                stiffness: 80,
                damping: 15,
                delay: index * 0.15 
              }}
              whileHover="hover"
              className="group relative overflow-hidden flex flex-col bg-[#b7974a] border border-[#b7974a]/40 rounded-2xl p-7 hover:border-white/40 hover:shadow-[0_20px_45px_rgba(183,151,74,0.35)] transition-all duration-300"
            >
              {/* Dynamic diagonal shine animation sweep */}
              <motion.div
                className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 pointer-events-none"
                variants={{
                  hover: { left: '100%' }
                }}
                initial={{ left: '-150%' }}
                transition={{ duration: 0.85, ease: "easeOut" }}
              />

              {/* Tag */}
              <span className="inline-flex self-start text-xs font-semibold text-navy bg-navy/10 border border-navy/20 px-3 py-1 rounded-full mb-5">
                {partner.tag}
              </span>

              {/* Logo container with white background to ensure the logo is perfectly crisp */}
              <div className="h-20 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center justify-center mb-6 shadow-md border border-white/20 transition-transform duration-300 group-hover:scale-105">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-16 max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>

              {/* Name */}
              <h3 className="text-navy font-heading font-extrabold text-base mb-3 leading-snug">
                {partner.name}
              </h3>

              {/* Description */}
              <p className="text-navy/85 text-sm leading-relaxed flex-1 font-medium">
                {partner.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Divider strip */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          className="mt-14 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorks() {
  return (
    <SectionWrapper className="bg-gradient-to-b from-surface to-white">
      <SectionHeading 
        title="How It Works"
        subtitle="Get started in four simple steps. Our streamlined process makes your journey to global opportunities effortless."
      />
      
      <div className="relative">
        {/* Connecting line for desktop */}
        <div className="hidden lg:block absolute top-6 left-0 right-0 h-0.5 bg-gradient-to-r from-gold/0 via-gold/50 to-gold/0" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <GlassCard hoverable className="h-full relative">
                {/* Step number */}
                <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-gold text-navy font-bold flex items-center justify-center shadow-lg shadow-gold/30">
                  {step.step}
                </div>
                
                <div className="pt-4">
                  <h3 className="text-lg font-heading font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {step.description}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

// Services Overview Section
function ServicesOverview() {
  return (
    <SectionWrapper className="bg-navy">
      <SectionHeading 
        title="Our Services"
        subtitle="Comprehensive solutions for all your global mobility needs"
        align="left"
        lightText
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={`/services#${service.id}`}>
              <ImageCard 
                imageUrl={service.image}
                overlay
                className="h-80 group cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-gold" />
                  </div>
                </div>
                <h3 className="text-2xl font-heading font-bold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-white/70 mb-4">
                  {service.description}
                </p>
                <div className="flex items-center gap-2 text-gold font-medium group-hover:translate-x-2 transition-transform">
                  Learn more <ArrowRight className="w-4 h-4" />
                </div>
              </ImageCard>
            </Link>
          </motion.div>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <Link to="/services">
          <Button variant="secondary" size="lg">
            View All Services
          </Button>
        </Link>
      </motion.div>
    </SectionWrapper>
  );
}

// Testimonials Preview Section
function TestimonialsPreview() {
  return (
    <SectionWrapper className="bg-gradient-to-b from-white to-surface">
      <SectionHeading 
        title="What Our Applicants Say"
        subtitle="Real stories from real people who achieved their global dreams"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonialsPreview.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
          >
            <GlassCard hoverable className="h-full">
              {/* Quote icon */}
              <Quote className="w-10 h-10 text-gold/30 mb-4" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-white/80 mb-6 italic">
                "{testimonial.quote}"
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-12 h-12 rounded-full bg-navy border border-white/10 flex items-center justify-center overflow-hidden">
                  <img 
                    src={`https://flagcdn.com/w80/${testimonial.code}.png`}
                    alt={testimonial.country}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-white/50 text-sm">{testimonial.country} · {testimonial.type}</div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <Link to="/testimonials">
          <Button variant="primary" size="lg">
            Read More Stories
          </Button>
        </Link>
      </motion.div>
    </SectionWrapper>
  );
}

// Stats Section
function StatsSection() {
  return (
    <section className="py-20 bg-navy/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <StatCard 
                number={<AnimatedCounter target={stat.number as number} suffix={stat.suffix} />}
                label={stat.label}
                className="bg-white"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Final CTA Section
function FinalCTA() {
  return (
    <section className="py-24 px-4 bg-navy relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/95 to-navy" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/10 rounded-full blur-3xl" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
          Start Your <span className="text-gold">Journey</span> Today
        </h2>
        <p className="text-xl text-white/70 mb-10">
          Join thousands of successful applicants who have realized their dreams of global mobility. Your future is just a click away.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.div variants={pulseVariant} animate="animate">
            <Link to="/eligibility">
              <Button variant="primary" size="lg">
                Check Eligibility Now
              </Button>
            </Link>
          </motion.div>
          <Link to="/contact">
            <Button variant="secondary" size="lg">
              Talk to Us
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

// Main Page Component
export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <ServicesOverview />
      <PartnersSection />
      <TestimonialsPreview />
      <StatsSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}


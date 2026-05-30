
import React, { useRef, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { motion, useInView } from "framer-motion";
import { 
  Globe, 
  Target, 
  Heart, 
  Shield, 
  Clock, 
  Users, 
  Award,
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Handshake
} from "lucide-react";
import { Navbar, PageHero, SectionWrapper, SectionHeading } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { GlassCard, ElevatedCard, StatCard, ProcessStepCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { fadeUpVariant, staggerContainer } from "@/components/ui/AnimationUtils";

// Timeline data for company history
const timeline = [
  {
    year: "2019",
    title: "Foundation",
    description: "Lotoks was founded with a vision to democratize global mobility.",
  },
  {
    year: "2020",
    title: "First Partnership",
    description: "Established partnerships with 50+ universities and employers worldwide.",
  },
  {
    year: "2021",
    title: "Tech Platform Launch",
    description: "Launched our proprietary AI-powered matching platform.",
  },
  {
    year: "2022",
    title: "Global Expansion",
    description: "Expanded operations to 100+ countries with 500+ partner organizations.",
  },
  {
    year: "2023",
    title: "50K Milestone",
    description: "Helped 50,000+ applicants achieve their international dreams.",
  },
  {
    year: "2024",
    title: "Industry Leader",
    description: "Recognized as the leading global sponsorship platform worldwide.",
  },
];

// Values data
const values = [
  {
    icon: Shield,
    title: "Transparency",
    description: "We believe in complete honesty and clarity throughout your journey.",
  },
  {
    icon: Clock,
    title: "Speed",
    description: "We optimize every step to get you results as quickly as possible.",
  },
  {
    icon: Globe,
    title: "Global Access",
    description: "We open doors to opportunities across 150+ countries worldwide.",
  },
];

// Team members
const team = [
  {
    name: "Thobekile Ruth Ngwenya",
    role: "CEO & Founder",
    image: "/Team-members/Thobekile-Ruth-Ngwenya-ceo-lotoks.png",
    bio: "Thobekile leads Lotoks with a visionary approach, integrating high-end technological innovations with robust operational strategies to shape the future of global enterprise solutions.",
  },
  {
    name: "Karabo Ngcobo",
    role: "Director of Technology",
    image: "/Team-members/Karabo-Ngcobo.png",
    bio: "Expert in scalable systems architecture, leading our engineering department with modern agile methodologies.",
  },
  {
    name: "Lynette Ndlovu",
    role: "Chief Operations Officer",
    image: "/Team-members/Lynette-Ndlovu.jpeg",
    bio: "Streamlining enterprise processes and driving operational performance across international teams.",
  },
  {
    name: "Rethabile Ruth Nyathi",
    role: "Head of Design & UX",
    image: "/Team-members/Rethabile-Ruth-Nyathi.jpeg",
    bio: "Crafting beautiful, modern, and human-centric user experiences that wow clients at first glance.",
  },
  {
    name: "Ronald Veremu",
    role: "Lead Software Architect",
    image: "/Team-members/Ronald-Veremu.png",
    bio: "Specializing in next-gen interactive systems, cloud computing, and high-performance databases.",
  },
];

// Partners data
const partners = [
  {
    name: "Everest Educational Services",
    logo: "/images/partners/everest-logo.png",
    description: "Your trusted partner for international education. Connecting students worldwide with top academic programs and expert guidance for study abroad.",
    website: "https://everestedu.ca/",
    tag: "Education Partner",
  },
  {
    name: "UITM \u2013 University of Information Technology and Management",
    logo: "/images/partners/uitm-logo.svg",
    description: "A leading Polish university offering world-class degree programs in IT and management. Recognised internationally for academic excellence in Rzesz\u00f3w, Poland.",
    website: "https://en.uitm.edu.eu/",
    tag: "University Partner",
  },
  {
    name: "APSO \u2013 African Professional Staffing Organisations",
    logo: "/images/partners/apso-logo.png",
    description: "The Federation of African Professional Staffing Organisations, dedicated to setting ethical standards and empowering staffing professionals across Africa.",
    website: "https://apso.org.za/",
    tag: "Accreditation Body",
  },
];

// Stats
const stats = [
  { number: "150+", label: "Countries Covered" },
  { number: "98%", label: "Success Rate" },
  { number: "24h", label: "Average Response" },
];

// Animated counter component
function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (isInView) {
      const numericTarget = parseInt(target.replace(/[^0-9]/g, ""));
      const duration = 2000;
      const steps = 60;
      const increment = numericTarget / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericTarget) {
          setCount(numericTarget);
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
      {count}{suffix}
    </span>
  );
}

// Timeline component
function Timeline() {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold/0 via-gold/50 to-gold/0" />

      <div className="space-y-12">
        {timeline.map((item, index) => {
          const isLeft = index % 2 === 0;
          return (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              {/* Dot */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gold shadow-lg shadow-gold/50 z-10" />

              {/* Content */}
              <div className={`ml-12 md:ml-0 md:w-1/2 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                <div className="text-gold font-bold text-lg mb-1">{item.year}</div>
                <h3 className="text-xl font-heading font-bold text-navy mb-2">{item.title}</h3>
                <p className="text-navy/70">{item.description}</p>
              </div>

              {/* Empty space for the other side */}
              <div className="hidden md:block md:w-1/2" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Mission Section
function MissionSection() {
  return (
    <SectionWrapper className="bg-gradient-to-b from-surface to-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gold/10 rounded-full blur-2xl" />
            <h2 className="text-4xl font-heading font-bold text-navy mb-6 relative">
              Our Vision & Mission
            </h2>
            <div className="mb-6">
              <h4 className="text-lg font-heading font-bold text-gold mb-2">Our Vision</h4>
              <p className="text-navy/70 leading-relaxed">
                To become a globally recognized and trusted consulting and recruitment agency that provides professional, efficient, and ethical recruitment solutions while empowering individuals through international employment and educational opportunities.
              </p>
            </div>
            <div className="mb-8">
              <h4 className="text-lg font-heading font-bold text-teal mb-2">Our Mission</h4>
              <p className="text-navy/70 leading-relaxed">
                To provide reliable, transparent, and professional consulting and recruitment services in accordance with international standards, labour regulations, and ethical business practices.
              </p>
            </div>
            <div className="space-y-3">
              {[
                "Federation of African Professional Staffing Organisations (APSO) Accredited",
                "Verified sponsorship opportunities abroad",
                "Transparent, ethical recruitment processes",
                "Dedicated documentation & mobility guidance support"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-teal" />
                  <span className="text-navy/80">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="aspect-square rounded-3xl overflow-hidden">
            <img 
              src="/images/unsplash/1522071820081-009f0129c71c-800x800.jpg"
              alt="Our team"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gold/10 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

// Values Section
function ValuesSection() {
  return (
    <SectionWrapper className="bg-navy">
      <SectionHeading 
        title="Our Values"
        subtitle="The principles that guide everything we do"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {values.map((value, index) => (
          <motion.div
            key={value.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
          >
            <ElevatedCard hoverable className="h-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-6">
                <value.icon className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-heading font-bold text-navy mb-3">
                {value.title}
              </h3>
              <p className="text-navy/70">
                {value.description}
              </p>
            </ElevatedCard>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// Team Section
function TeamSection() {
  return (
    <SectionWrapper className="bg-gradient-to-b from-white to-surface">
      <SectionHeading 
        title="Meet Our Team"
        subtitle="The passionate people behind Lotoks"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {team.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className="relative rounded-2xl overflow-hidden mb-4">
              <img 
                src={member.image}
                alt={member.name}
                className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white text-sm">{member.bio}</p>
              </div>
            </div>
            <h3 className="text-lg font-heading font-bold text-navy">{member.name}</h3>
            <p className="text-gold font-medium">{member.role}</p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// Partners Section
function PartnersSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-navy to-navy/95 relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-teal/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-5">
            <Handshake className="w-4 h-4 text-gold" />
            <span className="text-sm font-semibold text-gold uppercase tracking-widest">Partners &amp; Accreditations</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Institutions We Work With
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            Lotoks is proudly accredited and partnered with leading universities, placement agencies, and professional bodies across the globe.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partners.map((partner, index) => (
            <motion.a
              key={partner.name}
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
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
              className="group relative overflow-hidden flex flex-col bg-[#b7974a] border border-[#b7974a]/40 rounded-2xl p-7 hover:border-white/40 hover:shadow-[0_20px_45px_rgba(183,151,74,0.35)] transition-all duration-300 cursor-pointer"
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

              {/* Link */}
              <div className="flex items-center gap-2 mt-5 text-navy text-sm font-semibold group-hover:gap-3 transition-all border-t border-navy/15 pt-4">
                <span>Visit Website</span>
                <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </motion.a>
          ))}
        </div>

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

// Stats Section
function StatsSection() {
  return (
    <section className="py-20 bg-navy/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <StatCard 
                number={<AnimatedCounter target={stat.number} />}
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

// CTA Section
function CTASection() {
  return (
    <SectionWrapper className="bg-navy">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-heading font-bold text-white mb-6">
          Ready to Start Your Journey?
        </h2>
        <p className="text-xl text-white/70 mb-10">
          Let us help you achieve your global mobility goals. Get in touch today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/eligibility">
            <Button variant="primary" size="lg">
              Check Eligibility
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="secondary" size="lg">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
}

// Main Page Component
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-surface">
      <Navbar />
      
      {/* Hero */}
      <PageHero 
        title="About Us"
        subtitle="Empowering global mobility through innovation and trust"
        backgroundImage="/images/Aboutus-background.png"
      />

      <MissionSection />
      <ValuesSection />
      
      {/* Timeline */}
      <SectionWrapper className="bg-white">
        <SectionHeading 
          title="Our Journey"
          subtitle="From a small startup to a global platform"
        />
        <Timeline />
      </SectionWrapper>
      
      <TeamSection />
      <PartnersSection />
      <StatsSection />
      <CTASection />
      
      <Footer />
    </main>
  );
}

'use client';

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
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
  CheckCircle
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
    name: "David Mitchell",
    role: "CEO & Founder",
    image: "/images/unsplash/1560250097-0b93528c311a-400x400.jpg",
    bio: "Former immigration lawyer with 15+ years of experience in global mobility.",
  },
  {
    name: "Sarah Chen",
    role: "Chief Operations Officer",
    image: "/images/unsplash/1573496359142-b8d87734a5a2-400x400.jpg",
    bio: "Expert in scaling tech platforms and managing global operations.",
  },
  {
    name: "Marcus Johnson",
    role: "Head of Partnerships",
    image: "/images/unsplash/1472099645785-5658abf4ff4e-400x400.jpg",
    bio: "Built partnerships with 500+ organizations across 40 countries.",
  },
  {
    name: "Elena Rodriguez",
    role: "Chief Technology Officer",
    image: "/images/unsplash/1580489944761-15a19d654956-400x400.jpg",
    bio: "Led engineering teams at top tech companies, now revolutionizing mobility.",
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
              Our Mission
            </h2>
            <p className="text-lg text-navy/70 mb-6">
              At Lotoks, we believe that everyone deserves the opportunity to explore, work, and live anywhere in the world. Our mission is to make global mobility accessible, transparent, and stress-free for aspirational professionals like you.
            </p>
            <p className="text-lg text-navy/70 mb-8">
              We combine cutting-edge technology with human expertise to connect individuals with verified sponsors, educational institutions, and employers worldwide.
            </p>
            <div className="space-y-3">
              {[
                "Verified sponsorship opportunities",
                "Transparent application process",
                "Dedicated support team",
                "98% success rate"
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
          <Link href="/eligibility">
            <Button variant="primary" size="lg">
              Check Eligibility
            </Button>
          </Link>
          <Link href="/contact">
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
      <StatsSection />
      <CTASection />
      
      <Footer />
    </main>
  );
}
import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, 
  GraduationCap, 
  Briefcase, 
  Home, 
  ArrowRight, 
  CheckCircle,
  Clock,
  Shield,
  Users,
  FileText,
  ChevronDown,
  Stethoscope,
  Bike,
  Truck,
  Laptop,
  HardHat,
  HeartPulse,
  Settings,
  Factory,
  Package,
  Sprout,
  Hammer,
  Ship,
  Coins,
  TrendingUp
} from "lucide-react";
import { Navbar, SectionWrapper, SectionHeading } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { GlassCard, ElevatedCard, ImageCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { fadeUpVariant, staggerContainer } from "@/components/ui/AnimationUtils";

// Service tabs
const serviceTabs = [
  { id: "visa", label: "Visa Sponsorship", icon: Globe },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "jobs", label: "Job Placements", icon: Briefcase },
  { id: "residence", label: "Residence", icon: Home },
];

const jobListings = [
  {
    title: "Nurse",
    icon: Stethoscope,
    image: "/images/jobs/nurse.jpg",
    description: "ICU, ward & community nursing roles with full sponsorship",
    tag: "Healthcare"
  },
  {
    title: "Bike Riders",
    icon: Bike,
    image: "/images/jobs/bike-rider.jpg",
    description: "Delivery and courier positions across major cities",
    tag: "Logistics"
  },
  {
    title: "Truck Drivers",
    icon: Truck,
    image: "/images/jobs/truck-driver.jpg",
    description: "Long-haul and local freight transport opportunities",
    tag: "Transport"
  },
  {
    title: "IT / Tech Professionals",
    icon: Laptop,
    image: "/images/jobs/it-tech.jpg",
    description: "Software, DevOps, cybersecurity and data roles",
    tag: "Technology"
  },
  {
    title: "Construction Workers",
    icon: HardHat,
    image: "/images/jobs/construction.jpg",
    description: "Site, civil and structural construction positions",
    tag: "Construction"
  },
  {
    title: "Healthcare Workers",
    icon: HeartPulse,
    image: "/images/jobs/healthcare.jpg",
    description: "Doctors, paramedics and allied health professionals",
    tag: "Healthcare"
  },
  {
    title: "Engineers",
    icon: Settings,
    image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&q=80",
    description: "Civil, mechanical, electrical and project engineering",
    tag: "Engineering"
  },
  {
    title: "Factory Workers",
    icon: Factory,
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80",
    description: "Production line and manufacturing plant roles",
    tag: "Manufacturing"
  },
  {
    title: "Warehouse Workers",
    icon: Package,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80",
    description: "Pick, pack, dispatch and inventory management",
    tag: "Logistics"
  },
  {
    title: "Agriculture",
    icon: Sprout,
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80",
    description: "Farming, crop management and agri-tech roles",
    tag: "Agriculture"
  },
  {
    title: "Mining & Resources",
    icon: Hammer,
    image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&q=80",
    description: "Underground, open-cut and resources extraction jobs",
    tag: "Mining"
  },
  {
    title: "Transport & Logistics",
    icon: Ship,
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80",
    description: "Freight, shipping and supply chain coordination",
    tag: "Transport"
  },
  {
    title: "Finance & Accounting",
    icon: Coins,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
    description: "Accounting, audit, banking and financial analyst roles",
    tag: "Finance"
  },
];

// Detailed service data
const services = {
  visa: {
    id: "visa",
    title: "Visa Sponsorship",
    subtitle: "Work, study, and travel visas with verified sponsors",
    description: "Our visa sponsorship program connects you with verified employers and organizations willing to sponsor your visa application. We streamline the entire process, making it seamless and stress-free.",
    image: "/images/Visa-sponsorship.jpg",
    benefits: [
      "Verified sponsor network across 50+ countries",
      "Dedicated case manager for personalized support",
      "Fast-track processing with 98% approval rate",
      "Post-visa relocation assistance included",
      "Legal support throughout the application",
      "Real-time application tracking"
    ],
    process: [
      { step: 1, title: "Profile Assessment", desc: "We evaluate your qualifications" },
      { step: 2, title: "Match with Sponsor", desc: "Find the right sponsor for you" },
      { step: 3, title: "Document Preparation", desc: "We help prepare all required docs" },
      { step: 4, title: "Application Submission", desc: "Submit to immigration authorities" },
      { step: 5, title: "Visa Approval", desc: "Get your visa and start your journey" },
    ]
  },
  education: {
    id: "education",
    title: "Education Scholarships",
    subtitle: "Full and partial scholarships at top universities worldwide",
    description: "Access world-class education with our comprehensive scholarship matching service. We partner with universities and organizations to bring you funded opportunities that match your profile.",
    image: "/images/Educational-scholarship.jpg",
    benefits: [
      "Access to 1000+ scholarship programs",
      "Full and partial funding options",
      "Scholarship guaranteed admission support",
      "Application essay assistance",
      "Interview preparation coaching",
      "Post-admission visa sponsorship"
    ],
    process: [
      { step: 1, title: "Academic Profile Review", desc: "Assess your academic background" },
      { step: 2, title: " scholarship Search", desc: "Find matching opportunities" },
      { step: 3, title: "Application Support", desc: "Complete applications with guidance" },
      { step: 4, title: "Interview Preparation", desc: "Ace your scholarship interviews" },
      { step: 5, title: "Acceptance & Funding", desc: "Secure your scholarship offer" },
    ]
  },
  jobs: {
    id: "jobs",
    title: "Job Placements",
    subtitle: "Connect with employers offering sponsorship packages",
    description: "Find your dream job with companies willing to sponsor your work visa. Our job matching algorithm pairs you with opportunities that align with your skills and career goals.",
    image: "/images/job-placement.jpg",
    benefits: [
      "Exclusive job listings with sponsorship",
      "Direct hiring from top employers",
      "Resume optimization services",
      "Interview preparation and coaching",
      "Salary negotiation support",
      "Relocation assistance"
    ],
    process: [
      { step: 1, title: "Career Assessment", desc: "Understand your career goals" },
      { step: 2, title: "Job Matching", desc: "Get matched with suitable positions" },
      { step: 3, title: "Interview Prep", desc: "Prepare for employer interviews" },
      { step: 4, title: "Offer Negotiation", desc: "Negotiate terms and packages" },
      { step: 5, title: "Visa Sponsorship", desc: "Secure work visa sponsorship" },
    ]
  },
  residence: {
    id: "residence",
    title: "Permanent Residence",
    subtitle: "Pathways to citizenship through investment and work",
    description: "Our residence and citizenship by investment programs help you obtain permanent residency or citizenship in your desired country through legitimate pathways.",
    image: "/images/permanent-resident.jpg",
    benefits: [
      "Multiple pathway options available",
      "Investment-based citizenship programs",
      "Work-based residence permits",
      "Family inclusion options",
      "Tax planning assistance",
      "Post-grant integration support"
    ],
    process: [
      { step: 1, title: "Eligibility Assessment", desc: "Determine best pathway" },
      { step: 2, title: "Program Selection", desc: "Choose your target country" },
      { step: 3, title: "Investment Processing", desc: "Complete required investments" },
      { step: 4, title: "Application Submission", desc: "Submit residence application" },
      { step: 5, title: "Approval & Settlement", desc: "Obtain residence permit" },
    ]
  }
};

// FAQ data
const faqs = [
  {
    question: "How long does the visa sponsorship process take?",
    answer: "The process typically takes 2-6 months depending on the visa type and destination country. Our team works to expedite this timeline wherever possible."
  },
  {
    question: "What documents do I need for the application?",
    answer: "Required documents vary by service but typically include passport, educational certificates, work experience letters, financial documents, and medical records. We'll guide you through the specific requirements."
  },
  {
    question: "Are there any upfront costs?",
    answer: "Our service fees are competitive and transparent. We offer flexible payment plans and only charge for services rendered. No hidden fees or surprise costs."
  },
  {
    question: "What is your success rate?",
    answer: "We maintain a 98% success rate across all our services, supported by our thorough screening process and dedicated support team."
  },
  {
    question: "Can I apply for multiple services at once?",
    answer: "Yes, you can apply for multiple services. Our team will help you prioritize and create a comprehensive strategy for your global mobility goals."
  }
];

// FAQ Accordion Component
function FAQItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-white/10">
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left"
      >
        <span className="text-lg font-medium text-white pr-8">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center"
        >
          <ChevronDown className="w-5 h-5 text-gold" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pb-5 text-white/70">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Service Tab Navigation
function ServiceTabs({ activeService, onServiceChange }: { activeService: string; onServiceChange: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {serviceTabs.map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => onServiceChange(tab.id)}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
            ${activeService === tab.id 
              ? 'bg-gold text-navy shadow-lg shadow-gold/30' 
              : 'bg-white text-navy/70 border-2 border-navy/10 hover:border-gold/30'
            }
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <tab.icon className="w-5 h-5" />
          {tab.label}
        </motion.button>
      ))}
    </div>
  );
}

// Service Detail Section
function ServiceDetail({ service, isActive }: { service: typeof services.visa; isActive: boolean }) {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {/* Hero */}
          <div className="relative rounded-3xl overflow-hidden mb-16">
            <img 
              src={service.image} 
              alt={service.title}
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/80 to-navy/40 flex items-center">
              <div className="p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3">
                  {service.title}
                </h2>
                <p className="text-xl text-white/80">{service.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-16">
            <p className="text-lg text-navy/70 max-w-3xl">
              {service.description}
            </p>
          </div>

          {/* Split layout - Benefits and Process */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Benefits */}
            <div>
              <h3 className="text-2xl font-heading font-bold text-navy mb-6">
                Key Benefits
              </h3>
              <div className="space-y-4">
                {service.benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-teal/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-teal" />
                    </div>
                    <span className="text-navy/80">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Process */}
            <div>
              <h3 className="text-2xl font-heading font-bold text-navy mb-6">
                How It Works
              </h3>
              <div className="space-y-4">
                {service.process.map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-gold text-navy font-bold flex items-center justify-center flex-shrink-0">
                      {step.step}
                    </div>
                    <div>
                      <div className="font-semibold text-navy">{step.title}</div>
                      <div className="text-sm text-navy/60">{step.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link to="/eligibility">
              <Button 
                variant="primary" 
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
              >
                Get Started Now
              </Button>
            </Link>
          </motion.div>

          {/* Job Listings specific to Job Placements */}
          {service.id === 'jobs' && (
            <div className="mt-24 pt-16 border-t border-navy/10">
              <h3 className="text-3xl font-heading font-bold text-navy mb-12 text-center">
                Available Job Categories
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {jobListings.map((job, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="group"
                  >
                    <div className="relative h-72 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer">
                      {/* Background image */}
                      <img
                        src={job.image}
                        alt={job.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />

                      {/* Tag badge */}
                      <div className="absolute top-3 left-3">
                        <span className="text-xs font-bold uppercase tracking-wider bg-gold text-navy px-3 py-1 rounded-full">
                          {job.tag}
                        </span>
                      </div>

                      {/* Icon */}
                      <div className="absolute top-3 right-3 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <job.icon className="w-5 h-5 text-white" />
                      </div>

                      {/* Content at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h4 className="text-white font-bold text-base leading-tight mb-1">{job.title}</h4>
                        <p className="text-white/70 text-xs leading-snug mb-3 line-clamp-2">{job.description}</p>
                        <Link to="/eligibility">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold group-hover:text-white transition-colors">
                            Apply Now <ArrowRight className="w-3 h-3" />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// FAQ Section
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <SectionWrapper className="bg-navy">
      <SectionHeading 
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about our services"
        lightText
      />

      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}

// Enterprise services data
const enterpriseServices = [
  {
    title: "Recruitment",
    tagline: "Hire the best people",
    description: "Finding the right people shouldn't slow your growth plans. We help you secure permanent, contract, and executive talent who fit your business goals.",
    icon: Briefcase,
    color: "gold",
    bgHover: "hover:border-gold/50 shadow-gold/10 hover:shadow-gold/20",
    textAccent: "text-gold",
    bgAccent: "bg-gold/10",
    bullets: [
      "Industry-specific consultants who understand your market",
      "Thorough search and assessment to deliver strong shortlists",
      "Employer branding support to attract the best candidates",
      "A transparent process that saves time and delivers results"
    ]
  },
  {
    title: "Outsourcing",
    tagline: "Scale your talent operations",
    description: "When hiring demands spike, your team needs flexibility. Our outsourcing solutions take the pressure off and keep things moving.",
    icon: Users,
    color: "teal",
    bgHover: "hover:border-teal/50 shadow-teal/10 hover:shadow-teal/20",
    textAccent: "text-teal",
    bgAccent: "bg-teal/10",
    bullets: [
      "RPO models for full, project, or modular recruitment support",
      "MSP programs to manage vendors, compliance, and costs",
      "Direct sourcing combined with trusted supplier networks",
      "Real-time dashboards and analytics for smarter decisions"
    ]
  },
  {
    title: "Talent Advisory",
    tagline: "Make smarter workforce decisions",
    description: "Talent strategies work best when they're backed by data. We turn insights into practical steps that improve attraction, retention, and performance.",
    icon: TrendingUp,
    color: "red",
    bgHover: "hover:border-red/50 shadow-red/10 hover:shadow-red/20",
    textAccent: "text-red",
    bgAccent: "bg-red/10",
    bullets: [
      "Market intelligence to benchmark compensation packages",
      "Diagnostics for diversity and candidate experience",
      "Leadership coaching and development programs",
      "Clear, actionable recommendations for long-term success"
    ]
  }
];

// Enterprise Talent Solutions Section
function EnterpriseTalentSolutionsSection() {
  return (
    <SectionWrapper className="bg-navy relative overflow-hidden py-24">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <SectionHeading 
          title="Enterprise Talent Solutions"
          subtitle="Workforce strategies designed to scale with your growth, drive efficiency, and elevate performance."
          lightText
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
          {enterpriseServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`bg-navy/40 backdrop-blur-md border border-white/10 p-8 rounded-3xl transition-all duration-300 flex flex-col justify-between shadow-2xl ${service.bgHover}`}
            >
              <div>
                {/* Icon & Title Group */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-2xl ${service.bgAccent} flex items-center justify-center flex-shrink-0`}>
                    <service.icon className={`w-7 h-7 ${service.textAccent}`} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white font-heading">
                      {service.title}
                    </h3>
                    <p className={`text-sm font-semibold tracking-wide uppercase ${service.textAccent}`}>
                      {service.tagline}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Bullets */}
                <div className="space-y-3 mb-8">
                  {service.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className={`w-3.5 h-3.5 ${service.textAccent}`} />
                      </div>
                      <span className="text-white/80 text-xs leading-normal">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-white/5">
                <Link to="/contact" className="w-full">
                  <button className="w-full py-3 px-4 rounded-xl border border-white/10 text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 group hover:bg-white hover:text-navy">
                    Partner With Us
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

// Stats Section
function StatsSection() {
  const stats = [
    { number: "50K+", label: "Applications Processed", icon: FileText },
    { number: "98%", label: "Success Rate", icon: Shield },
    { number: "150+", label: "Partner Countries", icon: Globe },
    { number: "24h", label: "Average Response", icon: Clock },
  ];

  return (
    <section className="py-16 bg-gold/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-8 h-8 text-gold mx-auto mb-3" />
              <div className="text-3xl font-bold text-navy">{stat.number}</div>
              <div className="text-navy/60 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main Page Component
export default function ServicesPage() {
  const [activeService, setActiveService] = useState("visa");

  return (
    <main className="min-h-screen bg-surface">
      <Navbar />
      
      {/* Hero */}
      <section className="relative min-h-[40vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/Ourservices-.png" alt="Our Services" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/60 to-navy" />
        </div>
        
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-heading font-bold text-white mb-4"
          >
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/70"
          >
            Comprehensive solutions for all your global mobility needs
          </motion.p>
        </div>
      </section>

      {/* Service Tabs */}
      <SectionWrapper>
        <ServiceTabs 
          activeService={activeService} 
          onServiceChange={setActiveService} 
        />

        <div className="mt-12">
          {Object.entries(services).map(([key, service]) => (
            <ServiceDetail 
              key={key}
              service={service}
              isActive={activeService === key}
            />
          ))}
        </div>
      </SectionWrapper>

      <EnterpriseTalentSolutionsSection />
      <StatsSection />
      <FAQSection />

      {/* Final CTA */}
      <SectionWrapper className="bg-navy">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-heading font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/70 mb-10">
            Check your eligibility or contact us to discuss your options.
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
      
      <Footer />
    </main>
  );
}

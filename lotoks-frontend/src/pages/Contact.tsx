
import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import {
  Globe,
  Globe2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  MessageCircle,
  Briefcase,
  Heart
} from "lucide-react";
import { Navbar, SectionWrapper, SectionHeading } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { GlassCard, ElevatedCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select, FormField } from "@/components/ui/FormElements";
import { fadeUpVariant, staggerContainer } from "@/components/ui/AnimationUtils";

// Contact info cards data
const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    value: "info@lotoks.co.za",
    description: "Alternative: ruth@lotoks.co.za",
    href: "mailto:info@lotoks.co.za"
  },
  {
    icon: Phone,
    title: "WhatsApp Us",
    value: "+48 790 733 839",
    description: "Business WhatsApp (24/7)",
    href: "https://wa.me/48790733839"
  },
  {
    icon: Phone,
    title: "Office Line",
    value: "+27 11 051 8583",
    description: "Cell: +27 81 506 9081",
    href: "tel:+27110518583"
  },
];

// FAQ quick links
const quickLinks = [
  { question: "How do I apply?", answer: "Start with our eligibility check" },
  { question: "What documents do I need?", answer: "View required documents" },
  { question: "How long does it take?", answer: "Learn about processing times" },
  { question: "What are the costs?", answer: "View pricing information" },
];

// Contact form
interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  interest?: string;
  message?: string;
}

function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: "",
    email: "",
    phone: "",
    interest: "",
    message: ""
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.interest) {
      newErrors.interest = "Please select an interest";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-teal" />
        </div>
        <h3 className="text-2xl font-heading font-bold text-navy mb-3">
          Message Sent Successfully!
        </h3>
        <p className="text-navy/70 mb-8 max-w-md mx-auto">
          Thank you for reaching out. Our team will get back to you within 24 hours.
        </p>
        <Button 
          variant="secondary" 
          onClick={() => {
            setIsSubmitted(false);
            setFormData({ fullName: "", email: "", phone: "", interest: "", message: "" });
          }}
        >
          Send Another Message
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField>
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            error={errors.fullName}
          />
        </FormField>
        
        <FormField>
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={errors.email}
          />
        </FormField>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField>
          <Input
            label="Phone Number (Optional)"
            type="tel"
            placeholder="+1 (234) 567-890"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </FormField>
        
        <FormField>
          <Select
            label="Interest"
            value={formData.interest}
            onChange={(e) => handleChange("interest", e.target.value)}
            options={[
              { value: "visa", label: "Visa Sponsorship" },
              { value: "education", label: "Education Scholarship" },
              { value: "jobs", label: "Job Placement" },
              { value: "residence", label: "Permanent Residence" },
              { value: "other", label: "Other Inquiry" },
            ]}
            placeholder="Select your interest"
            error={errors.interest}
          />
        </FormField>
      </div>
      
      <FormField>
        <Textarea
          label="Your Message"
          placeholder="Tell us about your goals and how we can help..."
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          error={errors.message}
          rows={5}
        />
      </FormField>
      
      <motion.button
        type="submit"
        disabled={isSubmitting}
        className={`
          w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2
          transition-all
          ${isSubmitting 
            ? 'bg-navy/50 text-white/50 cursor-not-allowed' 
            : 'bg-gold text-navy hover:bg-gold/90 hover:shadow-lg hover:shadow-gold/30'
          }
        `}
        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending...
          </>
        ) : (
          <>
            Send Message
            <Send className="w-5 h-5" />
          </>
        )}
      </motion.button>
    </form>
  );
}

// Contact Info Cards
function ContactInfoCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {contactInfo.map((info, index) => (
        <motion.div
          key={info.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          <ElevatedCard hoverable className="h-full text-center group">
            <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors">
              <info.icon className="w-8 h-8 text-gold" />
            </div>
            <h3 className="text-lg font-heading font-bold text-navy mb-2">{info.title}</h3>
            {info.href ? (
              <a 
                href={info.href}
                className="text-gold font-medium hover:underline"
              >
                {info.value}
              </a>
            ) : (
              <p className="text-navy/80">{info.value}</p>
            )}
            {info.description && <p className="text-navy/50 text-sm mt-2">{info.description}</p>}
          </ElevatedCard>
        </motion.div>
      ))}
    </div>
  );
}

// Map placeholder
function MapSection() {
  return (
    <div className="relative h-80 rounded-2xl overflow-hidden bg-navy/5">
      {/* Abstract map pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy/10 to-gold/10" />
      
      {/* Animated dots representing locations */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-2xl h-48">
          {[
            { top: "20%", left: "30%", label: "New York" },
            { top: "40%", left: "60%", label: "London" },
            { top: "50%", left: "75%", label: "Dubai" },
            { top: "60%", left: "45%", label: "Singapore" },
            { top: "70%", left: "80%", label: "Sydney" },
          ].map((point, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ top: point.top, left: point.left }}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                className="w-3 h-3 rounded-full bg-gold"
              />
              <span className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-navy/60 whitespace-nowrap">
                {point.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Overlay text */}
      <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
            <Globe className="w-5 h-5 text-gold" />
          </div>
          <div>
            <div className="font-semibold text-navy">Global Presence</div>
            <div className="text-navy/60 text-sm">Serving applicants in 150+ countries</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// FAQ Quick Links
function FAQLinks() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {quickLinks.map((link, index) => (
        <motion.a
          key={index}
          href="#faq"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-4 p-4 rounded-xl bg-white border-2 border-navy/5 hover:border-gold/30 transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
            <AlertCircle className="w-5 h-5 text-gold" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-navy text-sm">{link.question}</div>
            <div className="text-navy/50 text-xs">{link.answer}</div>
          </div>
          <ArrowRight className="w-4 h-4 text-gold ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.a>
      ))}
    </div>
  );
}

// Main Page Component
export default function ContactPage() {
  return (
    <main className="min-h-screen bg-surface">
      <Navbar />
      
      {/* Hero */}
      <section className="relative min-h-[40vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/Contact-us.png" alt="Contact Us" className="w-full h-full object-cover" />
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
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/70"
          >
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </motion.p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <SectionWrapper>
        <ContactInfoCards />
      </SectionWrapper>

      {/* Contact Form and Additional Info */}
      <SectionWrapper className="bg-gradient-to-b from-surface to-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard>
              <h3 className="text-2xl font-heading font-bold text-white mb-6">
                Send Us a Message
              </h3>
              <ContactForm />
            </GlassCard>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Map */}
            <div>
              <h3 className="text-xl font-heading font-bold text-navy mb-4">
                Our Location
              </h3>
              <MapSection />
            </div>

            {/* FAQ Quick Links */}
            <div>
              <h3 className="text-xl font-heading font-bold text-navy mb-4">
                Quick Questions?
              </h3>
              <FAQLinks />
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-xl font-heading font-bold text-navy mb-4">
                Follow Us
              </h3>
              <div className="flex flex-wrap gap-3">
                <motion.a
                  href="https://x.com/LotoksConsult"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 py-3 rounded-xl bg-navy/5 border border-navy/10 hover:bg-navy/10 hover:border-gold/30 transition-all group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle className="w-5 h-5 text-gold" />
                  <span className="text-sm font-medium text-navy/70 group-hover:text-navy">X</span>
                </motion.a>
                <motion.a
                  href="https://www.instagram.com/lotoks_projects/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 py-3 rounded-xl bg-navy/5 border border-navy/10 hover:bg-navy/10 hover:border-gold/30 transition-all group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Heart className="w-5 h-5 text-gold" />
                  <span className="text-sm font-medium text-navy/70 group-hover:text-navy">Instagram</span>
                </motion.a>
                <motion.a
                  href="https://facebook.com/lotoks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 py-3 rounded-xl bg-navy/5 border border-navy/10 hover:bg-navy/10 hover:border-gold/30 transition-all group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Globe2 className="w-5 h-5 text-gold" />
                  <span className="text-sm font-medium text-navy/70 group-hover:text-navy">Facebook</span>
                </motion.a>
                <motion.a
                  href="https://linkedin.com/company/lotoks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 py-3 rounded-xl bg-navy/5 border border-navy/10 hover:bg-navy/10 hover:border-gold/30 transition-all group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Briefcase className="w-5 h-5 text-gold" />
                  <span className="text-sm font-medium text-navy/70 group-hover:text-navy">LinkedIn</span>
                </motion.a>
              </div>
            </div>

            {/* Office Hours */}
            <div className="p-6 rounded-xl bg-navy/5 border border-navy/10">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-gold" />
                <h4 className="font-heading font-bold text-navy">Office Hours</h4>
              </div>
              <div className="space-y-2 text-navy/70">
                <p>Monday - Friday: 9:00 AM - 5:00 PM (EST)</p>
                <p>Saturday - Sunday: Closed</p>
                <p className="text-sm pt-2 text-navy/50">
                  *Our online support is available 24/7 for urgent inquiries
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* CTA Section */}
      <SectionWrapper className="bg-navy">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-heading font-bold text-white mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl text-white/70 mb-10">
            Check our detailed FAQ section or start your application today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/eligibility">
              <Button variant="primary" size="lg">
                Check Eligibility
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="secondary" size="lg">
                View Services
              </Button>
            </Link>
          </div>
        </div>
      </SectionWrapper>
      
      <Footer />
    </main>
  );
}

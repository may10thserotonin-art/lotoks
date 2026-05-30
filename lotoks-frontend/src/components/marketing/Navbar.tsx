import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Navigation links for marketing pages
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Our Services" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact Us" },
];

// Dropdown items
const servicesDropdown = [
  { href: "/services#visa", label: "Visa Sponsorship" },
  { href: "/services#education", label: "Education Scholarships" },
  { href: "/services#jobs", label: "Job Placements" },
  { href: "/services#residence", label: "Permanent Residence" },
  { href: "/requirements", label: "Application Requirements" },
];

export function Navbar() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <motion.header
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled 
          ? "bg-navy/95 backdrop-blur-lg shadow-lg shadow-navy/20 py-3" 
          : "bg-transparent py-5"
        }
      `}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              className="w-10 h-10 rounded-xl overflow-hidden"
              whileHover={{ scale: 1.05 }}
            >
              <img 
                src="/logo.png" 
                alt="Lotoks" 
                className="w-full h-full object-contain"
              />
            </motion.div>
            <span className="text-2xl font-heading font-bold text-white">
              Lotoks<span className="text-gold">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div key={link.href} className="relative">
                {link.label === "Our Services" ? (
                  <div 
                    className="relative"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <button
                      className={`
                        flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-sm
                        transition-colors duration-200
                        ${pathname === link.href 
                          ? "text-gold" 
                          : "text-white/80 hover:text-white hover:bg-white/5"
                        }
                      `}
                    >
                      {link.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Services Dropdown */}
                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-56 py-2 bg-navy/95 backdrop-blur-lg rounded-xl border border-gold/20 shadow-xl shadow-navy/30"
                        >
                          {servicesDropdown.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              className="block px-4 py-2.5 text-white/80 hover:text-gold hover:bg-gold/5 transition-colors text-sm"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={link.href}
                    className={`
                      px-4 py-2 rounded-lg font-medium text-sm
                      transition-colors duration-200
                      ${pathname === link.href 
                        ? "text-gold" 
                        : "text-white/80 hover:text-white hover:bg-white/5"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-white">
                Sign In
              </Button>
            </Link>
            <Link to="/eligibility">
              <Button 
                variant="primary" 
                size="sm"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Check Eligibility
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-navy/98 backdrop-blur-lg border-t border-gold/10"
          >
            <div className="max-w-7xl mx-auto px-4 py-4">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`
                      px-4 py-3 rounded-lg font-medium text-sm
                      transition-colors duration-200
                      ${pathname === link.href 
                        ? "text-gold bg-gold/10" 
                        : "text-white/80 hover:text-white hover:bg-white/5"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {/* Services sub-links in mobile */}
                {pathname === "/services" && (
                  <div className="pl-4 mt-2 space-y-1">
                    {servicesDropdown.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="block px-4 py-2 text-white/60 hover:text-gold text-sm"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}

                <div className="border-t border-white/10 my-3" />
                
                <Link
                  to="/login"
                  className="px-4 py-3 rounded-lg font-medium text-sm text-white/80 hover:text-white hover:bg-white/5"
                >
                  Sign In
                </Link>
                <Link to="/eligibility" className="px-4 py-3">
                  <Button variant="primary" size="md" fullWidth>
                    Check Eligibility
                  </Button>
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// Page Hero Section for marketing pages
interface PageHeroProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  align?: 'center' | 'left';
  backgroundImage?: string;
}

export function PageHero({ 
  title, 
  subtitle, 
  children,
  align = 'center',
  backgroundImage
}: PageHeroProps) {
  return (
    <section className="relative min-h-[50vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background */}
      {backgroundImage ? (
        <div className="absolute inset-0">
          <img src={backgroundImage} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/60 to-navy" />
        </div>
      ) : (
        <>
          <div className="absolute inset-0 bg-navy" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/60 to-navy" />
        </>
      )}
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4"
        >
          {title}
        </motion.h1>
        
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Section wrapper with animation
interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionWrapper({ children, className = '', id }: SectionWrapperProps) {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}

// Section heading component
interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  lightText?: boolean;
}

export function SectionHeading({ title, subtitle, align = 'center', lightText = false }: SectionHeadingProps) {
  const alignment = align === 'center' ? 'text-center' : 'text-left';
  
  return (
    <div className={`mb-12 ${alignment}`}>
      <h2 className={`text-3xl md:text-4xl font-heading font-bold mb-4 ${lightText ? 'text-white' : 'text-navy'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg max-w-2xl mx-auto ${lightText ? 'text-white/70' : 'text-navy/70'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

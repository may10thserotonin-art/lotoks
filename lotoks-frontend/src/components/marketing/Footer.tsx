import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { Globe, Mail, MapPin, Globe2, MessageCircle, Briefcase, Heart, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Footer links
const footerLinks = {
  services: [
    { label: "Visa Sponsorship", href: "/services#visa" },
    { label: "Education Scholarships", href: "/services#education" },
    { label: "Job Placements", href: "/services#jobs" },
    { label: "Permanent Residence", href: "/services#residence" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Team", href: "/about#team" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Contact Us", href: "/contact" },
  ],
  resources: [
    { label: "Eligibility Check", href: "/eligibility" },
    { label: "Application Guide", href: "/apply" },
    { label: "Documents Required", href: "/documents" },
    { label: "FAQ", href: "/contact#faq" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
};

// Social media icons
const socialLinks = [
  { icon: Globe2, href: "https://facebook.com/lotoks", label: "Facebook" },
  { icon: MessageCircle, href: "https://x.com/LotoksConsult", label: "X" },
  { icon: Briefcase, href: "https://linkedin.com/company/lotoks", label: "LinkedIn" },
  { icon: Heart, href: "https://www.instagram.com/lotoks_projects/", label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 group mb-6">
              <motion.div
                className="w-14 h-14 rounded-xl overflow-hidden"
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  src="/logo.png" 
                  alt="Lotoks" 
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <span className="text-2xl font-heading font-bold">
                Lotoks<span className="text-gold">.</span>
              </span>
            </Link>
            
            <p className="text-white/60 mb-6 max-w-sm">
              Your trusted partner for global mobility solutions. We help individuals achieve their dreams of international opportunities through seamless sponsorship services.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <a 
                href="mailto:info@lotoks.co.za" 
                className="flex items-center gap-3 text-white/70 hover:text-gold transition-colors"
              >
                <Mail className="w-5 h-5 text-gold flex-shrink-0" />
                <span>info@lotoks.co.za</span>
              </a>
              <a 
                href="tel:+27110518583" 
                className="flex items-center gap-3 text-white/70 hover:text-gold transition-colors"
              >
                <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                <span>Tel: +27 11 051 8583</span>
              </a>
              <a 
                href="https://wa.me/48790733839" 
                className="flex items-center gap-3 text-white/70 hover:text-gold transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-gold flex-shrink-0" />
                <span>WhatsApp: +48 790 733 839</span>
              </a>
              <div className="flex items-center gap-3 text-white/70">
                <MapPin className="w-5 h-5 text-gold flex-shrink-0" />
                <span>Johannesburg, South Africa</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 text-gold">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-white/60 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 text-gold">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-white/60 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 text-gold">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-white/60 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Newsletter */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 text-gold">Legal</h4>
            <ul className="space-y-3 mb-8">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-white/60 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter CTA */}
            <div className="p-4 rounded-xl bg-gold/10 border border-gold/20">
              <h5 className="font-heading font-semibold mb-2">Stay Updated</h5>
              <p className="text-sm text-white/60 mb-3">Get the latest news and updates</p>
              <Link to="/contact">
                <Button variant="secondary" size="sm" fullWidth>
                  Subscribe
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-white/40 text-sm">
              &copy; {new Date().getFullYear()} Lotoks. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-gold hover:text-navy transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>

            {/* Made with love */}
            <p className="text-white/40 text-sm hidden md:block">
              Made with <span className="text-gold">�T�</span> for global mobility
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Mini footer for login page
export function MiniFooter() {
  return (
    <footer className="bg-navy/50 border-t border-white/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-gold" />
            <span className="text-white/60 text-sm">
              &copy; {new Date().getFullYear()} Lotoks. All rights reserved.
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-white/40 text-sm hover:text-gold transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-white/40 text-sm hover:text-gold transition-colors">
              Terms
            </Link>
            <Link to="/contact" className="text-white/40 text-sm hover:text-gold transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

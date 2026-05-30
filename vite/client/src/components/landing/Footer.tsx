
import React from "react";
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-navy-dark py-16 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="text-2xl font-bold text-white mb-4 block font-heading">
              Lotoks<span className="text-gold">.</span>
            </Link>
            <p className="text-white/60 max-w-sm font-body">
              The all-in-one platform for global sponsorship. Visa, Education,
              Job, and PR — all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/eligibility"
                  className="text-white/60 hover:text-gold transition-colors"
                >
                  Check Eligibility
                </Link>
              </li>
              <li>
                <Link
                  to="/apply"
                  className="text-white/60 hover:text-gold transition-colors"
                >
                  Apply Now
                </Link>
              </li>
              <li>
                <Link
                  to="/opportunities"
                  className="text-white/60 hover:text-gold transition-colors"
                >
                  Opportunities
                </Link>
              </li>
              <li>
                <Link
                  to="/documents"
                  className="text-white/60 hover:text-gold transition-colors"
                >
                  Documents
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-white/60">
              <li>support@lotoks.com</li>
              <li>+1 (555) 123-4567</li>
              <li>Available 24/7</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Lotoks. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-white/40 text-sm hover:text-white">
              Privacy Policy
            </Link>
            <Link to="#" className="text-white/40 text-sm hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
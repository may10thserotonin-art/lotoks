
import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "Lotoks made my dream of working in Canada a reality. The process was surprisingly smooth.",
    name: "Sarah M.",
    country: "Nigeria → Canada",
    role: "Software Developer",
  },
  {
    quote:
      "I got my UK sponsorship in just 3 weeks. The team was incredible throughout the journey.",
    name: "James K.",
    country: "Kenya → UK",
    role: "Healthcare Professional",
  },
  {
    quote:
      "From application to landing, Lotoks guided me every step. Highly recommended!",
    name: "Priya S.",
    country: "India → Australia",
    role: "Engineer",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-navy relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-heading">
            Stories from around the world
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Join thousands who have successfully started their new life through
            Lotoks.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-card p-8 backdrop-blur-sm"
            >
              <p className="text-white/80 text-lg mb-6 italic font-body">
                &quot;{testimonial.quote}&quot;
              </p>
              <div className="border-t border-white/10 pt-4">
                <p className="text-white font-bold">{testimonial.name}</p>
                <p className="text-gold text-sm">{testimonial.country}</p>
                <p className="text-white/50 text-sm">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Filter, 
  GraduationCap, 
  ArrowUpRight,
  ChevronDown
} from "lucide-react";
import { Navbar } from "@/components/marketing/Navbar";

const listings = [
  {
    id: 1,
    title: "Registered Nurse",
    employer: "NHS United Kingdom",
    country: "UK",
    type: "job",
    industry: "Healthcare",
    salary: "£32k - £45k",
    tags: ["Full-time", "Sponsored"]
  },
  {
    id: 2,
    title: "Senior Software Engineer",
    employer: "Shopify Canada",
    country: "Canada",
    type: "job",
    industry: "Tech",
    salary: "$140k - $180k",
    tags: ["Remote", "Relocation"]
  },
  {
    id: 3,
    title: "MSc Computer Science",
    employer: "University of Melbourne",
    country: "Australia",
    type: "edu",
    industry: "Education",
    salary: "Scholarship",
    tags: ["Full Tuition", "Stipend"]
  },
  {
    id: 4,
    title: "Civil Engineer",
    employer: "Arup Australia",
    country: "Australia",
    type: "job",
    industry: "Engineering",
    salary: "$90k - $130k",
    tags: ["Permanent", "Visa Support"]
  }
];

export default function OpportunitiesPage() {
  const [filter, setFilter] = useState("all");

  const filtered = listings.filter(l => filter === "all" || l.type === filter);

  return (
    <main className="min-h-screen bg-surface">
      <Navbar />
      
      <section className="pt-32 pb-12 bg-white border-b border-outline-variant/10">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-on-surface mb-8">Global <span className="text-primary">Opportunities.</span></h2>
          
          <div className="card p-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
              <input 
                type="text" 
                placeholder="Search position, employer, or country..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium text-sm"
              />
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white font-bold text-xs hover:bg-surface-container transition-all">
                <MapPin size={16} className="text-primary" />
                All Countries
                <ChevronDown size={14} className="opacity-50" />
              </button>
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dim transition-all shadow-lg shadow-primary/20">
                Find Sponsorship
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filter === "all" ? "bg-primary text-white" : "bg-white text-on-surface hover:bg-surface-container"}`}
            >
              All Listings
            </button>
            <button 
              onClick={() => setFilter("job")}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filter === "job" ? "bg-primary text-white" : "bg-white text-on-surface hover:bg-surface-container"}`}
            >
              Job Sponsorship
            </button>
            <button 
              onClick={() => setFilter("edu")}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filter === "edu" ? "bg-primary text-white" : "bg-white text-on-surface hover:bg-surface-container"}`}
            >
              Education
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="card p-6 bg-white border border-outline-variant/30 rounded-2xl hover:shadow-xl transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                    {item.type === "job" ? <Briefcase size={24} /> : <GraduationCap size={24} />}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold uppercase tracking-widest">Sponsored</span>
                    <span className="text-xs font-bold text-primary">{item.country}</span>
                  </div>
                </div>

                <h5 className="text-xl font-bold text-on-surface mb-1">{item.title}</h5>
                <p className="text-sm font-semibold text-primary mb-4">{item.employer}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {item.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-bold">{tag}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
                  <div>
                    <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-0.5">Salary/Funding</p>
                    <p className="font-bold text-on-surface">{item.salary}</p>
                  </div>
                  <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary/5 text-primary text-xs font-bold group-hover:bg-primary group-hover:text-white transition-all">
                    Apply Now
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

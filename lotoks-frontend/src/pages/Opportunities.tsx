
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Briefcase,
  GraduationCap,
  ArrowUpRight,
  ChevronDown
} from "lucide-react";
import { useAuthStore } from '@/store/auth';
import { Sidebar, MobileTabBar, MobileMenu } from '@/components/Navigation';
import { apiFetch, apiJson } from '@/lib/api';

interface Listing {
  id: number;
  title: string;
  employer?: string;
  description?: string;
  country: string;
  salary: string;
  type: string;
  sponsorship_type: string;
}

export default function OpportunitiesPage() {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated } = useAuthStore();
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Fetch real listings from backend
  const { data: listingsData, isLoading: listingsLoading } = useQuery({
    queryKey: ['public-listings'],
    queryFn: async () => {
      const res = await apiFetch('/listings/public');
      return apiJson<{ listings: Listing[] }>(res);
    },
    staleTime: 60_000,
  });

  const listings = listingsData?.listings || [];
  const filtered = listings.filter(l => {
    if (filter !== "all" && l.type !== filter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const titleMatch = l.title?.toLowerCase().includes(q);
      const employerMatch = l.employer?.toLowerCase().includes(q);
      const countryMatch = l.country?.toLowerCase().includes(q);
      if (!titleMatch && !employerMatch && !countryMatch) return false;
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-white/60 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-surface">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Menu */}
      <MobileMenu />

      {/* Main Content */}
      <div className="lg:ml-60 min-h-screen pb-20 md:pb-0">
        <section className="py-12 bg-white border-b border-outline-variant/10">
          <div className="px-6 md:px-8 max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-on-surface mb-8">Global <span className="text-primary">Opportunities.</span></h2>
            
            <div className="card p-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
          <div className="px-6 md:px-8 max-w-7xl mx-auto">
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

            {listingsLoading ? (
              <div className="text-center py-20">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="mt-4 text-on-surface-variant text-sm">Loading opportunities…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <Search className="w-12 h-12 text-outline-variant mx-auto mb-3" />
                <p className="text-on-surface-variant font-medium">No listings found</p>
                <p className="text-xs text-outline-variant mt-1">Check back later for new opportunities</p>
              </div>
            ) : (
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
                      <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold uppercase tracking-widest">
                        {item.sponsorship_type || 'Sponsored'}
                      </span>
                      <span className="text-xs font-bold text-primary">{item.country}</span>
                    </div>
                  </div>

                  <h5 className="text-xl font-bold text-on-surface mb-1">{item.title}</h5>
                  {item.employer && (
                    <p className="text-sm font-semibold text-primary mb-4">{item.employer}</p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-bold capitalize">
                      {item.type === 'job' ? 'Full-time' : 'Education'}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-bold capitalize">
                      {item.sponsorship_type?.replace('_', ' ') || 'Sponsored'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
                    <div>
                      <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-0.5">Salary/Funding</p>
                      <p className="font-bold text-on-surface">{item.salary || 'Competitive'}</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary/5 text-primary text-xs font-bold group-hover:bg-primary group-hover:text-white transition-all">
                      Apply Now
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            )}
          </div>
        </section>
      </div>

      {/* Mobile Tab Bar */}
      <MobileTabBar />
    </main>
  );
}


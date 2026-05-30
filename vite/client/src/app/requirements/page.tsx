
import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { Globe, GraduationCap, Briefcase, Home, ChevronDown, CheckCircle, ArrowRight, Info } from "lucide-react";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

// ─── DATA ────────────────────────────────────────────────────────────────────

const tabs = [
  { id: "visa", label: "Visa Sponsorship", icon: Globe, color: "bg-blue-600" },
  { id: "education", label: "Education & Scholarship", icon: GraduationCap, color: "bg-emerald-600" },
  { id: "jobs", label: "Job Placement", icon: Briefcase, color: "bg-amber-600" },
  { id: "residence", label: "Permanent Residence", icon: Home, color: "bg-purple-600" },
];

const requirementsData = {
  visa: {
    intro: "Required for Schengen short-stay visas (Type C) and long-stay national visas (Type D). Requirements vary slightly by destination country and visit purpose — our team will confirm the exact checklist for your case.",
    sections: [
      {
        heading: "Core Documents (All Visa Types)",
        items: [
          "International passport — valid for at least 6 months beyond travel date, with a minimum of 2 blank pages",
          "Completed & signed visa application form (country-specific)",
          "2 recent biometric photos — 35×45 mm, white background, taken within the last 3 months",
          "Travel itinerary — confirmed flight reservation (not necessarily paid)",
          "Proof of accommodation — hotel booking, Airbnb confirmation, or a signed invitation letter from your host",
          "Travel medical insurance — minimum €30,000 cover, valid for the entire Schengen zone and trip duration",
          "Proof of sufficient financial means — 3–6 months bank statements, recent payslips, or a formal sponsorship letter accompanied by the sponsor's bank statements",
          "Visa fee payment receipt",
        ],
      },
      {
        heading: "Purpose-Specific Documents",
        subsections: [
          {
            sub: "Tourism",
            items: [
              "Day-by-day travel itinerary detailing planned activities",
              "Employer leave approval letter (if employed)",
            ],
          },
          {
            sub: "Business",
            items: [
              "Invitation letter from the European company or organisation",
              "Conference or event registration confirmation",
              "Employer letter stating the purpose, duration, and who covers costs",
            ],
          },
          {
            sub: "Visiting Family or Friends",
            items: [
              "Signed invitation letter from your host in Europe",
              "Copy of host's valid passport or residence permit",
              "Proof of relationship — birth certificate, marriage certificate, or other official document",
            ],
          },
          {
            sub: "Medical Treatment",
            items: [
              "Medical report or referral letter from your home-country doctor",
              "Acceptance letter from the European hospital or clinic",
            ],
          },
        ],
      },
      {
        heading: "Proof of Ties to Home Country",
        note: "Consular officers must be confident you will return home. The stronger your ties, the better your chances.",
        items: [
          "Employment letter on company letterhead — stating your position, salary, and approved leave period",
          "If self-employed: business registration certificate and recent tax clearance certificate",
          "Property documents — title deeds, land ownership papers, or mortgage statements",
          "Family ties — marriage certificate and birth certificates of children",
          "Evidence of ongoing studies — student ID or university enrolment letter",
          "Previous travel history — old passports with prior visa stamps",
        ],
      },
    ],
  },
  education: {
    intro: "Used for scholarship applications, university admissions, and sponsorship programmes at European institutions. Exact requirements differ by country, institution, and level of study.",
    sections: [
      {
        heading: "Identity & Eligibility",
        items: [
          "International passport — biodata/photo page (certified copy)",
          "Full birth certificate",
          "Passport-sized photograph (recent)",
        ],
      },
      {
        heading: "Academic Documents",
        items: [
          "Certified copies of all certificates and diplomas (WAEC, NECO, HND, Bachelor's, Master's, etc.)",
          "Full academic transcripts for each qualification",
          "Grading scale explanation document from your institution (if not on a standard 4.0 or 5.0 scale)",
          "All academic documents must be translated and apostilled/legalised where required",
        ],
      },
      {
        heading: "Application Package",
        items: [
          "Detailed curriculum vitae — Europass format is strongly preferred",
          "Statement of purpose / motivation letter — tailored to the programme and institution",
          "2–3 recommendation letters — signed, on official institutional or employer letterhead",
          "Research proposal — required for PhD and post-doctoral applications",
        ],
      },
      {
        heading: "Language Proficiency Certificates",
        items: [
          "English-taught programmes: IELTS Academic or TOEFL iBT (check institution minimums)",
          "French-taught programmes: DELF or DALF certificate",
          "German-taught programmes: TestDaF or Goethe-Zertifikat",
          "Other languages: Equivalent CEFR-aligned certificate as specified by the institution",
        ],
      },
      {
        heading: "Financial & Sponsorship Evidence",
        items: [
          "Parent's or sponsor's bank statements — last 3–6 months, showing sufficient funds",
          "Sponsor's payslips or recent income tax return",
          "Notarised affidavit of financial support",
          "Proof of any existing scholarships, grants, or student loans",
        ],
      },
      {
        heading: "Sponsorship-Specific Documents",
        items: [
          "Official sponsorship letter — clearly detailing coverage (tuition fees, living allowance, travel)",
          "Signed contractual agreement between student and sponsor",
          "Sponsor's registration documents or national ID (for corporate sponsors)",
        ],
      },
      {
        heading: "Additional Documents",
        items: [
          "Medical certificate or health clearance",
          "Police clearance certificate (often required at later admission stages — we will advise when)",
        ],
      },
    ],
  },
  jobs: {
    intro: "For clients seeking sponsored employment in Europe. We match your profile with vetted employers. Documents should reflect your most current experience and qualifications.",
    sections: [
      {
        heading: "Personal Identification",
        items: [
          "International passport — copy of biodata page",
          "Passport-sized photograph (recent)",
          "Birth certificate (required by some employers and countries)",
        ],
      },
      {
        heading: "Professional Profile",
        items: [
          "Up-to-date CV in Europass format",
          "Tailored cover letter(s) aligned to the specific role and country",
          "Certified copies of all educational certificates and diplomas",
          "Professional training certificates and trade/professional licences",
          "Detailed employment reference letters on official company letterhead — must include: job title, start and end dates, key duties, and a performance summary",
          "Portfolio or work samples (required for creative, technical, and IT roles)",
        ],
      },
      {
        heading: "Qualification Recognition",
        items: [
          "Statement of Comparability from your country's NARIC (or EC/ENIC network equivalent)",
          "Credential evaluation report from a recognised body",
          "Proof of application for professional recognition — especially for regulated professions (nursing, engineering, teaching, architecture, etc.)",
        ],
      },
      {
        heading: "Language Proficiency",
        items: [
          "Official language test certificate: IELTS / TOEFL for English-speaking markets",
          "Appropriate CEFR-aligned certificate for the local language of the destination country",
          "Evidence of previous work experience conducted in the target language (reference letters, contracts)",
        ],
      },
      {
        heading: "Pre-Screening & Compliance",
        items: [
          "Police clearance certificate from your home country",
          "Police clearance from every country you have lived in for 6 or more months",
          "Medical fitness certificate (mandatory for healthcare, transport, and some construction roles)",
          "Valid travel medical insurance — until you are enrolled in the national health scheme",
        ],
      },
      {
        heading: "Additional Information Required",
        items: [
          "Notice period at current employer and your earliest available start date",
          "Salary expectations — please specify gross and net preferred",
          "Preferred contract type (permanent, fixed-term, apprenticeship)",
          "EU Blue Card eligibility details — degree level and current gross annual salary",
        ],
      },
    ],
  },
  residence: {
    intro: "For clients seeking long-term residence, citizenship by investment, or family reunification in Europe. Requirements vary significantly by country and route — our advisors will provide a country-specific checklist.",
    sections: [
      {
        heading: "Identity & Civil Status",
        items: [
          "Valid international passport (all applicants in the family unit)",
          "Full birth certificate for each applicant",
          "Marriage certificate — or divorce decree / death certificate of spouse if applicable",
          "Birth certificates of dependent children",
          "Two recent passport-sized photographs per applicant",
        ],
      },
      {
        heading: "Criminal Record & Health",
        items: [
          "Police clearance certificate from your country of nationality",
          "Police clearance from all countries you have resided in during the last 5–10 years (validity: 3–6 months from issue)",
          "Medical certificate from an approved panel physician",
          "Valid health insurance (comprehensive, private or national scheme equivalent)",
        ],
      },
      {
        heading: "Accommodation Evidence",
        items: [
          "Signed rental contract or property title deed in your name",
          "For family reunification: invitation/declaration letter from your host plus a copy of their ID and residence permit",
        ],
      },
      {
        heading: "Financial Means",
        items: [
          "Personal bank statements — last 6 months, clearly showing income and savings",
          "Employment contract and recent payslips (last 3 months)",
          "Proof of regular passive income (pension letter, rental income evidence)",
          "Blocked bank account confirmation (where this route is accepted)",
        ],
      },
      {
        heading: "Route-Specific Documents",
        subsections: [
          {
            sub: "Work-Based Route (EU Blue Card / Skilled Worker Permit)",
            items: [
              "Signed job offer or employment contract meeting the minimum salary threshold of the destination country",
              "Recognised qualifications and NARIC Statement of Comparability",
              "Employer's signed declaration of intent to employ / work permit approval",
            ],
          },
          {
            sub: "Investor / Golden Visa Route",
            items: [
              "Proof of qualifying investment: real estate purchase contract, fund subscription agreement, or capital transfer confirmation",
              "Source-of-funds declaration with supporting evidence (tax returns, audited business accounts)",
              "Business plan and company registration documents (where investment involves a business)",
              "Completed due diligence questionnaires as required by the destination authority",
            ],
          },
          {
            sub: "Family Reunification Route",
            items: [
              "Sponsor's valid residence permit or national ID",
              "Legalised proof of family relationship (birth/marriage certificate)",
              "Evidence that the sponsor has adequate housing and sufficient income",
              "Integration / language certificate at A1 level (if required by destination country)",
            ],
          },
          {
            sub: "Long-Term EU Resident (After 5 Years)",
            items: [
              "All previous residence permits held in the EU",
              "Continuous residence proof — rental history, utility bills, lease agreements",
              "Tax returns and/or fiscal residency documents covering the 5-year period",
              "Integration certificate showing language proficiency and civic knowledge (where applicable)",
            ],
          },
        ],
      },
      {
        heading: "Translation & Legalisation",
        note: "This applies to ALL routes above.",
        items: [
          "Every official document in a language other than the destination country's official language must be translated by a sworn/certified translator",
          "Documents issued outside Europe must be apostilled (for Hague Convention countries) or legalised via the relevant embassy",
          "We coordinate certified translation and legalisation on your behalf — just ask",
        ],
      },
    ],
  },
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function AccordionItem({ heading, items, subsections, note }: {
  heading: string;
  items?: string[];
  subsections?: { sub: string; items: string[] }[];
  note?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left bg-white/5 hover:bg-white/10 transition-colors"
      >
        <span className="font-semibold text-white text-base">{heading}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-gold" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 pt-4">
              {note && (
                <div className="flex items-start gap-2 mb-4 p-3 bg-gold/10 rounded-lg border border-gold/20">
                  <Info className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <p className="text-gold text-sm">{note}</p>
                </div>
              )}
              {items && (
                <ul className="space-y-2">
                  {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" />
                      <span className="text-white/80 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {subsections && (
                <div className="space-y-5">
                  {subsections.map((sub, si) => (
                    <div key={si}>
                      <h4 className="text-gold font-semibold text-sm uppercase tracking-wider mb-3">{sub.sub}</h4>
                      <ul className="space-y-2">
                        {sub.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" />
                            <span className="text-white/80 text-sm leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ServicePanel({ data }: { data: typeof requirementsData.visa }) {
  return (
    <div>
      <p className="text-white/70 text-base leading-relaxed mb-8 max-w-3xl">{data.intro}</p>
      {data.sections.map((section, i) => (
        <AccordionItem
          key={i}
          heading={section.heading}
          items={(section as { heading: string; items?: string[]; subsections?: { sub: string; items: string[] }[]; note?: string }).items}
          subsections={(section as { heading: string; items?: string[]; subsections?: { sub: string; items: string[] }[]; note?: string }).subsections}
          note={(section as { heading: string; items?: string[]; subsections?: { sub: string; items: string[] }[]; note?: string }).note}
        />
      ))}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function RequirementsPage() {
  const [activeTab, setActiveTab] = useState("visa");
  const active = requirementsData[activeTab as keyof typeof requirementsData];
  const activeTabInfo = tabs.find(t => t.id === activeTab)!;

  return (
    <main className="min-h-screen bg-navy">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/Ourservices-.png" alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/80 to-navy" />
        </div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-teal/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-gold/20 text-gold text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
              Before You Apply
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-5">
              Application Requirements
            </h1>
            <p className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
              To give your application the best possible chance of success, please prepare the documents below before your consultation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Important Note Banner */}
      <div className="max-w-5xl mx-auto px-4 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-start gap-4 bg-gold/10 border border-gold/30 rounded-2xl p-5"
        >
          <Info className="w-6 h-6 text-gold flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-semibold mb-1">Important — Translations & Legalisation</p>
            <p className="text-white/70 text-sm leading-relaxed">
              All official documents not written in the official language of your destination country must be translated by a <strong className="text-white">sworn or certified translator</strong>. Documents issued outside Europe must be <strong className="text-white">apostilled</strong> (for countries party to the Hague Convention) or <strong className="text-white">legalised</strong> through the appropriate embassy or consulate. Our team can coordinate this on your behalf.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-4">
        {/* Tab bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-2 px-4 py-4 rounded-2xl font-medium text-sm transition-all border ${
                  isActive
                    ? "bg-gold text-navy border-gold shadow-lg shadow-gold/20"
                    : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-center leading-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 mb-16"
          >
            {/* Panel header */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-gold/20 flex items-center justify-center flex-shrink-0">
                <activeTabInfo.icon className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold text-white">{activeTabInfo.label}</h2>
                <p className="text-gold text-sm font-medium">Document Checklist</p>
              </div>
            </div>

            <ServicePanel data={active} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div className="max-w-3xl mx-auto px-4 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gold/20 to-teal/10 border border-gold/20 rounded-3xl p-10"
        >
          <h2 className="text-3xl font-heading font-bold text-white mb-4">
            Need help gathering these documents?
          </h2>
          <p className="text-white/70 mb-8 leading-relaxed">
            Our experienced consultants will guide you through every document, organise certified translations, and ensure your application is complete before submission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <span className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-8 py-4 rounded-xl hover:bg-gold/90 transition-colors">
                Contact Our Team <ArrowRight className="w-5 h-5" />
              </span>
            </Link>
            <Link to="/eligibility">
              <span className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
                Check My Eligibility
              </span>
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}

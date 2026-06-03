
import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  ChevronLeft, 
  CheckCircle2, 
  Globe,
  GraduationCap,
  Briefcase,
  User,
  Truck,
  HeartPulse,
  Laptop,
  HardHat,
  Utensils,
  Wrench,
  Users,
  Building2
} from "lucide-react";

const jobCategories = [
  { 
    label: "Truck Driving & Logistics", 
    icon: Truck, 
    value: "truck",
    description: "Drive routes across Europe — Lithuania, Poland, Germany & more",
    color: "from-blue-500 to-blue-600"
  },
  { 
    label: "Healthcare & Nursing", 
    icon: HeartPulse, 
    value: "health",
    description: "Nursing, caregiving & medical positions in UK & Europe",
    color: "from-rose-500 to-rose-600"
  },
  { 
    label: "IT & Technology", 
    icon: Laptop, 
    value: "tech",
    description: "Software dev, IT support & tech roles with full sponsorship",
    color: "from-purple-500 to-purple-600"
  },
  { 
    label: "Engineering & Construction", 
    icon: HardHat, 
    value: "engineering",
    description: "Civil, mechanical & electrical engineering opportunities",
    color: "from-amber-500 to-amber-600"
  },
  { 
    label: "Hospitality & Services", 
    icon: Utensils, 
    value: "hospitality",
    description: "Chef, hotel, restaurant & tourism positions abroad",
    color: "from-orange-500 to-orange-600"
  },
  { 
    label: "Skilled Trades & Labor", 
    icon: Wrench, 
    value: "trades",
    description: "Welding, plumbing, electrical & general skilled labor",
    color: "from-teal-500 to-teal-600"
  },
];

const steps = [
  { 
    id: 1, 
    question: "What is your primary goal?", 
    options: [
      { label: "Work Overseas", icon: Briefcase, value: "job" },
      { label: "Study & Scholarship", icon: GraduationCap, value: "edu" },
      { label: "Family Relocation", icon: Globe, value: "visa" },
      { label: "Permanent Residency", icon: User, value: "pr" }
    ]
  },
];

export default function EligibilityPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [showJobs, setShowJobs] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Dynamic step list based on selections
  const getCurrentSteps = () => {
    const baseSteps = [...steps];
    
    if (selectedGoal === "job") {
      // For job seekers: show job categories first, then age+edu
      baseSteps.push(
        { id: 2, question: "Which job category interests you?", options: jobCategories.map(j => ({ label: j.label, icon: j.icon, value: j.value, description: j.description })) },
        { id: 3, question: "What is your current age group?", options: [
          { label: "18 - 24", icon: Users, value: "young" },
          { label: "25 - 34", icon: Users, value: "prime" },
          { label: "35 - 44", icon: Users, value: "mature" },
          { label: "45+", icon: Users, value: "senior" }
        ]},
        { id: 4, question: "Highest level of education?", options: [
          { label: "PhD / Master's", icon: GraduationCap, value: "high" },
          { label: "Bachelor's Degree", icon: GraduationCap, value: "mid" },
          { label: "Diploma / High School", icon: GraduationCap, value: "low" }
        ]}
      );
    } else {
      baseSteps.push(
        { id: 2, question: "What is your current age group?", options: [
          { label: "18 - 24", icon: Users, value: "young" },
          { label: "25 - 34", icon: Users, value: "prime" },
          { label: "35 - 44", icon: Users, value: "mature" },
          { label: "45+", icon: Users, value: "senior" }
        ]},
        { id: 3, question: "Highest level of education?", options: [
          { label: "PhD / Master's", icon: GraduationCap, value: "high" },
          { label: "Bachelor's Degree", icon: GraduationCap, value: "mid" },
          { label: "Diploma / High School", icon: GraduationCap, value: "low" }
        ]}
      );
    }
    
    return baseSteps;
  };

  const currentSteps = getCurrentSteps();
  const progress = ((currentStep + 1) / currentSteps.length) * 100;
  const selectedJob = jobCategories.find(j => j.value === answers[2]);

  const handleSelect = (value: string, stepId: number) => {
    const newAnswers = { ...answers, [stepId]: value };
    setAnswers(newAnswers);

    if (stepId === 1) {
      setSelectedGoal(value);
      if (value === "job") {
        setShowJobs(true);
      }
    }

    if (currentStep < currentSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = currentSteps[currentStep];

  // Calculate match message based on selections
  const getMatchMessage = () => {
    if (selectedGoal === "job" && selectedJob) {
      return `Based on your profile, you have an <strong>85% match</strong> for <strong>${selectedJob.label}</strong> positions in Europe. Our partners are actively hiring in this sector.`;
    }
    return `Based on your profile, you have an <strong>85% match</strong> for skilled worker sponsorship in the UK and Canada.`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-white to-surface py-12 px-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-40 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 -right-20 w-96 h-96 bg-teal/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-outline-variant hover:text-primary transition-colors mb-8 group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
        
        <header className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/5 text-primary text-xs font-bold px-4 py-1.5 rounded-full mb-4 border border-primary/10"
          >
            <Sparkles size={14} /> Eligibility Check
          </motion.div>
          <h2 className="text-4xl font-bold text-on-surface mb-2">
            Find Your <span className="text-primary">Pathway</span>
          </h2>
          <p className="text-sm text-on-surface-variant font-medium">Answer a few questions and discover your global opportunities.</p>
        </header>

        <motion.div 
          layout
          className="card p-8 md:p-10 bg-white/80 backdrop-blur-xl border border-outline-variant/30 rounded-3xl shadow-xl min-h-[520px] flex flex-col"
        >
          <AnimatePresence mode="wait">
            {!isFinished ? (
              <motion.div
                key={`step-${currentStep}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-grow flex flex-col"
              >
                {/* Progress Bar */}
                <div className="flex items-center gap-4 mb-10">
                  <div className="flex-grow h-2.5 bg-surface-container rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full">
                    {currentStep + 1} / {currentSteps.length}
                  </span>
                </div>

                <div className="flex-grow">
                  {/* Question */}
                  <motion.h4 
                    key={step.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold text-on-surface mb-8 flex items-center gap-3"
                  >
                    {step.id === 1 && <Building2 className="w-6 h-6 text-primary" />}
                    {step.id === 2 && selectedGoal === "job" && <Briefcase className="w-6 h-6 text-primary" />}
                    {step.id === 2 && selectedGoal !== "job" && <User className="w-6 h-6 text-primary" />}
                    {step.id === 3 && <GraduationCap className="w-6 h-6 text-primary" />}
                    {step.id === 4 && <GraduationCap className="w-6 h-6 text-primary" />}
                    {step.question}
                  </motion.h4>

                  {/* Options Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {step.options.map((opt: any, i: number) => {
                      const Icon = opt.icon;
                      const isJobCategory = step.id === 2 && selectedGoal === "job";
                      
                      return (
                        <motion.button
                          key={opt.value}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07 }}
                          onClick={() => handleSelect(opt.value, step.id)}
                          className={`group relative p-5 text-left rounded-xl border transition-all duration-300 overflow-hidden
                            ${isJobCategory
                              ? 'bg-white border-navy/10 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5'
                              : 'bg-surface-container-low border-outline-variant/30 hover:border-primary hover:bg-primary/5'
                            }
                          `}
                        >
                          {/* Hover gradient background for job cards */}
                          {isJobCategory && (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          )}

                          <div className="relative z-10 flex items-start gap-4">
                            {Icon && (
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-all duration-300 shrink-0
                                ${isJobCategory 
                                  ? 'bg-gradient-to-br from-primary/10 to-primary/5 text-primary group-hover:shadow-primary/20' 
                                  : 'bg-white text-primary shadow-sm'
                                }
                              `}>
                                <Icon size={22} />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <span className={`font-bold block transition-colors duration-300
                                ${isJobCategory ? 'text-navy group-hover:text-primary text-sm' : 'text-on-surface group-hover:text-primary'}
                              `}>
                                {opt.label}
                              </span>
                              {opt.description && (
                                <span className="text-xs text-outline-variant font-medium mt-1 block leading-relaxed">
                                  {opt.description}
                                </span>
                              )}
                            </div>

                            {/* Arrow indicator */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300
                              ${isJobCategory 
                                ? 'bg-navy/5 text-navy/30 group-hover:bg-primary/10 group-hover:text-primary' 
                                : 'bg-transparent text-outline-variant group-hover:text-primary'
                              }
                            `}>
                              <ArrowRight size={16} />
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Back button */}
                {currentStep > 0 && (
                  <motion.button 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={goBack}
                    className="mt-8 self-start flex items-center gap-2 text-xs font-bold text-outline-variant hover:text-primary transition-colors group"
                  >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Previous Question
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-grow flex flex-col items-center justify-center text-center py-6"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="relative mb-8"
                >
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                    <CheckCircle2 size={64} />
                  </div>
                  <motion.div 
                    animate={{ scale: [1, 1.3, 1], opacity: [0, 0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-green-500/20"
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-3xl font-bold text-on-surface mb-4">You're Eligible!</h3>
                  <p 
                    className="text-on-surface-variant max-w-md mb-6 font-medium leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: getMatchMessage() }}
                  />
                  
                  {selectedJob && (
                    <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4 py-2 mb-8">
                      <Truck className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-primary">{selectedJob.label}</span>
                    </div>
                  )}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="grid gap-3 w-full max-w-sm mt-4"
                >
                  <a 
                    href={`https://wa.me/48790733839?text=${encodeURIComponent(
                      `Hi Lotoks! I just completed the eligibility check.%0a%0a${selectedGoal === "job" && selectedJob ? `Goal: Work Overseas%0aJob Category: ${selectedJob.label}%0a` : "Goal: Study Abroad%0a"}%0aI'd like to continue with my application. Please guide me on the next steps.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-primary/80 text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group"
                  >
                    Continue on WhatsApp
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                  <button onClick={() => { setIsFinished(false); setCurrentStep(0); setAnswers({}); setSelectedGoal(null); setShowJobs(false); }} className="text-xs font-bold text-outline-variant hover:text-primary py-2 transition-colors">
                    Retake Assessment
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}



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
  User
} from "lucide-react";

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
  {
    id: 2,
    question: "What is your current age group?",
    options: [
      { label: "18 – 24", value: "young" },
      { label: "25 – 34", value: "prime" },
      { label: "35 – 44", value: "mature" },
      { label: "45+", value: "senior" }
    ]
  },
  {
    id: 3,
    question: "Highest level of education?",
    options: [
      { label: "PhD / Master's", value: "high" },
      { label: "Bachelor's Degree", value: "mid" },
      { label: "Diploma / High School", value: "low" }
    ]
  }
];

export default function EligibilityPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  const handleSelect = (value: string) => {
    setAnswers({ ...answers, [steps[currentStep].id]: value });
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-surface py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-outline-variant hover:text-primary transition-colors mb-8">
          <ChevronLeft size={16} /> Back to Home
        </Link>
        
        <header className="text-center mb-12">
          <h2 className="text-3xl font-bold text-on-surface mb-2">Eligibility <span className="text-primary">Wizard.</span></h2>
          <p className="text-sm text-on-surface-variant font-medium">Discover your global pathways in 2 minutes.</p>
        </header>

        <div className="card p-8 bg-white border border-outline-variant/30 rounded-2xl shadow-xl min-h-[500px] flex flex-col">
          <AnimatePresence mode="wait">
            {!isFinished ? (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-grow flex flex-col"
              >
                {/* Progress Bar */}
                <div className="flex items-center gap-4 mb-10">
                  <div className="flex-grow h-2 bg-surface-container rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                    {currentStep + 1} / {steps.length}
                  </span>
                </div>

                <div className="flex-grow">
                  <h4 className="text-2xl font-bold text-on-surface mb-8">{steps[currentStep].question}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {steps[currentStep].options.map((opt) => {
                      const Icon = (opt as { icon?: typeof Briefcase }).icon;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => handleSelect(opt.value)}
                          className="group p-6 text-left rounded-xl border border-outline-variant/30 bg-surface-container-low hover:border-primary hover:bg-primary/5 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            {Icon && (
                              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                                <Icon size={20} />
                              </div>
                            )}
                            <span className="font-bold text-on-surface group-hover:text-primary transition-colors">
                              {opt.label}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {currentStep > 0 && (
                  <button 
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="mt-8 flex items-center gap-2 text-xs font-bold text-outline-variant hover:text-primary transition-colors"
                  >
                    <ChevronLeft size={16} /> Previous Question
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-grow flex flex-col items-center justify-center text-center py-10"
              >
                <div className="relative mb-8">
                  <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                    <CheckCircle2 size={64} />
                  </div>
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-green-500/20"
                  />
                </div>
                
                <h3 className="text-3xl font-bold text-on-surface mb-4">You're Eligible!</h3>
                <p className="text-on-surface-variant max-w-md mb-10 font-medium">
                  Based on your profile, you have an <strong>85% match</strong> for skilled worker sponsorship in the UK and Canada.
                </p>

                <div className="grid gap-3 w-full max-w-sm">
                  <button className="w-full py-4 rounded-full bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-primary-dim transition-all shadow-lg shadow-primary/20">
                    Continue to Application
                    <ArrowRight size={18} />
                  </button>
                  <button onClick={() => setIsFinished(false)} className="text-xs font-bold text-outline-variant hover:text-primary py-2 transition-colors">
                    Retake Assessment
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  GraduationCap,
  Globe,
  User,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
  FileText,
  Upload,
  Users,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { Sidebar, MobileTabBar, MobileMenu } from '@/components/Navigation';
import { apiFetch, apiJson } from '@/lib/api';
import InterviewStep from '@/components/apply/InterviewStep';
import DocumentChecklist, { type RequiredDoc } from '@/components/apply/DocumentChecklist';

// ── Types ──

export type QuestionType = 'text' | 'select' | 'textarea';

export interface Question {
  id: string;
  label: string;
  type: QuestionType;
  required: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  types: string[]; // which sponsorship types this applies to
}

interface FormData {
  types: string[];
  category: string;
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    nationality: string;
    phoneNumber: string;
    currentCountry: string;
    destinationCountry: string;
  };
  answers: Record<string, string>;
  documents: { id: string; url: string; name: string }[];
  consented: boolean;
}

// ── Available sponsorship types ──

const SPONSORSHIP_TYPES = [
  { id: 'visa', label: 'Visa Sponsorship', icon: Globe, desc: 'Work, tourist, or family visas' },
  { id: 'job', label: 'Job Sponsorship', icon: Briefcase, desc: 'Employer-sponsored work positions' },
  { id: 'edu', label: 'Education Scholarship', icon: GraduationCap, desc: 'Study abroad funding & scholarships' },
  { id: 'pr', label: 'Permanent Residency', icon: Users, desc: 'PR pathway programs & support' },
];

// ── Interview Questions ──

const INTERVIEW_QUESTIONS: Question[] = [
  // Visa questions
  { id: 'visa_purpose', label: 'What is the purpose of your travel?', type: 'select', required: true, types: ['visa'],
    options: [
      { label: 'Tourism', value: 'tourism' },
      { label: 'Business', value: 'business' },
      { label: 'Study', value: 'study' },
      { label: 'Family Visit', value: 'family' },
      { label: 'Medical', value: 'medical' },
      { label: 'Other', value: 'other' },
    ] },
  { id: 'visa_travel_dates', label: 'What are your planned travel dates?', type: 'text', required: true, types: ['visa'],
    placeholder: 'e.g., June 2026 – August 2026' },
  { id: 'visa_visited_before', label: 'Have you visited this country before?', type: 'select', required: true, types: ['visa'],
    options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
  { id: 'visa_accommodation', label: 'Do you have a host, hotel booking, or accommodation arranged?', type: 'select', required: false, types: ['visa'],
    options: [{ label: 'Yes, I have accommodation', value: 'yes' }, { label: 'Not yet arranged', value: 'no' }] },
  { id: 'visa_denied', label: 'Have you ever had a visa application denied?', type: 'select', required: true, types: ['visa'],
    options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },

  // Education questions
  { id: 'edu_field', label: 'What field of study are you interested in?', type: 'text', required: true, types: ['edu'],
    placeholder: 'e.g., Computer Science, Medicine, Engineering' },
  { id: 'edu_universities', label: 'Do you have preferred universities or institutions?', type: 'textarea', required: false, types: ['edu'],
    placeholder: 'List any institutions you are considering...' },
  { id: 'edu_level', label: 'What is your highest education level completed?', type: 'select', required: true, types: ['edu'],
    options: [
      { label: 'High School / Secondary', value: 'secondary' },
      { label: 'Diploma / Associate', value: 'diploma' },
      { label: "Bachelor's Degree", value: 'bachelor' },
      { label: "Master's Degree", value: 'master' },
      { label: 'PhD / Doctorate', value: 'phd' },
    ] },
  { id: 'edu_gpa', label: 'What is your current GPA or grade range?', type: 'select', required: true, types: ['edu'],
    options: [
      { label: '4.0+ / A (Excellent)', value: 'excellent' },
      { label: '3.0–3.9 / B (Good)', value: 'good' },
      { label: '2.0–2.9 / C (Average)', value: 'average' },
      { label: 'Below 2.0 / D', value: 'below' },
    ] },
  { id: 'edu_scholarship', label: 'Do you already have a scholarship or funding?', type: 'select', required: true, types: ['edu'],
    options: [{ label: 'Yes, I have funding', value: 'yes' }, { label: 'No, I need funding', value: 'no' }, { label: 'Partial funding', value: 'partial' }] },
  { id: 'edu_english', label: 'Do you have an English proficiency test score?', type: 'select', required: false, types: ['edu'],
    options: [
      { label: 'IELTS', value: 'ielts' },
      { label: 'TOEFL', value: 'toefl' },
      { label: 'PTE Academic', value: 'pte' },
      { label: 'None yet', value: 'none' },
    ] },

  // Job questions
  { id: 'job_title', label: 'What is your current job title?', type: 'text', required: true, types: ['job'],
    placeholder: 'e.g., Software Engineer, Registered Nurse' },
  { id: 'job_experience', label: 'How many years of professional experience do you have?', type: 'select', required: true, types: ['job'],
    options: [
      { label: 'Less than 1 year', value: 'entry' },
      { label: '1–3 years', value: 'junior' },
      { label: '4–7 years', value: 'mid' },
      { label: '8–15 years', value: 'senior' },
      { label: '15+ years', value: 'executive' },
    ] },
  { id: 'job_industry', label: 'What industry do you work in?', type: 'text', required: true, types: ['job'],
    placeholder: 'e.g., Healthcare, Technology, Finance' },
  { id: 'job_relocate', label: 'Are you willing to relocate internationally?', type: 'select', required: true, types: ['job'],
    options: [
      { label: 'Yes, anywhere', value: 'anywhere' },
      { label: 'Yes, to specific countries', value: 'specific' },
      { label: 'I need more information', value: 'unsure' },
      { label: 'Not at this time', value: 'no' },
    ] },
  { id: 'job_salary', label: 'What is your expected salary range (annual, gross)?', type: 'select', required: true, types: ['job'],
    options: [
      { label: 'Under $30,000', value: 'low' },
      { label: '$30,000 – $60,000', value: 'mid_low' },
      { label: '$60,000 – $100,000', value: 'mid' },
      { label: '$100,000 – $150,000', value: 'high' },
      { label: '$150,000+', value: 'exec' },
    ] },
  { id: 'job_cv', label: 'Do you have an updated CV/Resume ready?', type: 'select', required: false, types: ['job'],
    options: [{ label: 'Yes, ready to upload', value: 'yes' }, { label: 'I need to prepare one', value: 'no' }] },
  { id: 'job_certifications', label: 'Do you have any professional certifications?', type: 'textarea', required: false, types: ['job'],
    placeholder: 'List relevant certifications, licenses, or qualifications...' },

  // PR questions
  { id: 'pr_reason', label: 'What is your primary reason for seeking permanent residence?', type: 'select', required: true, types: ['pr'],
    options: [
      { label: 'Work & career opportunities', value: 'work' },
      { label: 'Family reunification', value: 'family' },
      { label: 'Quality of life', value: 'quality' },
      { label: 'Education for children', value: 'education' },
      { label: 'Safety & stability', value: 'safety' },
      { label: 'Other', value: 'other' },
    ] },
  { id: 'pr_family', label: 'Do you have family members already living there?', type: 'select', required: true, types: ['pr'],
    options: [{ label: 'Yes, immediate family', value: 'immediate' }, { label: 'Yes, extended family', value: 'extended' }, { label: 'No', value: 'no' }] },
  { id: 'pr_lived', label: 'Have you previously lived in this country?', type: 'select', required: true, types: ['pr'],
    options: [{ label: 'Yes, I lived there', value: 'yes' }, { label: 'Yes, for short visits', value: 'visits' }, { label: 'No, never', value: 'no' }] },
  { id: 'pr_job_offer', label: 'Do you have a job offer in that country?', type: 'select', required: true, types: ['pr'],
    options: [{ label: 'Yes, I have an offer', value: 'yes' }, { label: 'I am actively looking', value: 'looking' }, { label: 'Not yet', value: 'no' }] },
];

// ── Document Requirements Generator ──

const CORE_DOCS: RequiredDoc[] = [
  { id: 'passport', name: 'International Passport (Biodata Page)', description: 'Scanned copy of your passport biodata page', required: true, accepted: '.pdf,.jpg,.jpeg,.png' },
  { id: 'photo', name: 'Passport-Sized Photograph', description: 'Recent passport-sized photograph (white background)', required: true, accepted: '.jpg,.jpeg,.png' },
];

const TYPE_DOCS: Record<string, RequiredDoc[]> = {
  job: [
    { id: 'cv', name: 'CV / Resume', description: 'Your updated curriculum vitae or resume', required: true, accepted: '.pdf,.doc,.docx' },
    { id: 'certs', name: 'Professional Certifications', description: 'Copies of relevant certifications and licenses', required: false, accepted: '.pdf,.jpg,.jpeg,.png' },
    { id: 'ref_letters', name: 'Reference Letters', description: 'Professional reference letters from previous employers', required: false, accepted: '.pdf,.doc,.docx' },
  ],
  edu: [
    { id: 'cv', name: 'CV / Resume', description: 'Your academic curriculum vitae', required: true, accepted: '.pdf,.doc,.docx' },
    { id: 'transcripts', name: 'Academic Transcripts', description: 'Official transcripts from your previous institution', required: true, accepted: '.pdf,.jpg,.jpeg,.png' },
    { id: 'rec_letters', name: 'Recommendation Letters', description: 'Academic recommendation letters (minimum 2)', required: true, accepted: '.pdf,.doc,.docx' },
    { id: 'english_test', name: 'English Proficiency Test Score', description: 'IELTS, TOEFL, or PTE score report', required: false, accepted: '.pdf,.jpg,.jpeg,.png' },
  ],
  visa: [
    { id: 'travel_itinerary', name: 'Travel Itinerary', description: 'Flight booking or travel plan', required: false, accepted: '.pdf,.jpg,.jpeg,.png' },
    { id: 'accommodation', name: 'Accommodation Proof', description: 'Hotel booking or host invitation letter', required: false, accepted: '.pdf,.jpg,.jpeg,.png' },
    { id: 'bank_statement', name: 'Bank Statements', description: 'Last 3-6 months bank statements', required: true, accepted: '.pdf,.jpg,.jpeg,.png' },
  ],
  pr: [
    { id: 'birth_cert', name: 'Birth Certificate', description: 'Official birth certificate', required: true, accepted: '.pdf,.jpg,.jpeg,.png' },
    { id: 'police_clearance', name: 'Police Clearance Certificate', description: 'Police clearance from your country of residence', required: true, accepted: '.pdf,.jpg,.jpeg,.png' },
    { id: 'marriage_cert', name: 'Marriage Certificate', description: 'If applicable', required: false, accepted: '.pdf,.jpg,.jpeg,.png' },
    { id: 'medical_report', name: 'Medical Examination Report', description: 'Medical report from an approved physician', required: true, accepted: '.pdf,.jpg,.jpeg,.png' },
  ],
};

function getRequiredDocs(types: string[]): RequiredDoc[] {
  const docs = [...CORE_DOCS];
  for (const t of types) {
    const typeDocs = TYPE_DOCS[t];
    if (typeDocs) {
      for (const d of typeDocs) {
        if (!docs.find((existing) => existing.id === d.id)) {
          docs.push(d);
        }
      }
    }
  }
  return docs;
}

// ── Steps ──

const STEPS = [
  { id: 'types', label: 'Sponsorship Type', icon: Briefcase },
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'interview', label: 'Questionnaire', icon: Globe },
  { id: 'documents', label: 'Required Documents', icon: FileText },
  { id: 'upload', label: 'Upload', icon: Upload },
  { id: 'review', label: 'Review & Submit', icon: CheckCircle2 },
];

// ── Component ──

export default function ApplyWizard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isLoading, isAuthenticated } = useAuthStore();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login?redirect=/apply', { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [uploadingDocs, setUploadingDocs] = useState<Record<string, { name: string; size: number; status: 'uploading' | 'done' | 'error' }>>({});

  // Parse initial types from query params
  const initialTypes = searchParams.getAll('type').filter((t) => SPONSORSHIP_TYPES.some((st) => st.id === t));
  const initialCategory = searchParams.get('category') || '';

  const [formData, setFormData] = useState<FormData>({
    types: initialTypes.length > 0 ? initialTypes : [],
    category: initialCategory,
    personalInfo: {
      fullName: user?.name || '',
      dateOfBirth: '',
      nationality: '',
      phoneNumber: '',
      currentCountry: user?.country || '',
      destinationCountry: '',
    },
    answers: {},
    documents: [],
    consented: false,
  });

  // Pre-fill name from user data
  useEffect(() => {
    if (user?.name && !formData.personalInfo.fullName) {
      setFormData((prev) => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, fullName: user.name },
      }));
    }
    if (user?.country && !formData.personalInfo.currentCountry) {
      setFormData((prev) => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, currentCountry: user.country! },
      }));
    }
  }, [user]);

  const toggleType = (typeId: string) => {
    setFormData((prev) => ({
      ...prev,
      types: prev.types.includes(typeId)
        ? prev.types.filter((t) => t !== typeId)
        : [...prev.types, typeId],
    }));
  };

  const updatePersonalInfo = (field: keyof FormData['personalInfo'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const updateAnswer = (questionId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value },
    }));
  };

  // Get questions relevant to selected types
  const relevantQuestions = INTERVIEW_QUESTIONS.filter((q) =>
    q.types.some((t) => formData.types.includes(t))
  );

  // Required questions that must be answered
  const requiredQuestions = relevantQuestions.filter((q) => q.required);
  const answeredRequired = requiredQuestions.filter((q) => formData.answers[q.id]?.trim());
  const allRequiredAnswered = answeredRequired.length === requiredQuestions.length;

  // Documents
  const requiredDocs = getRequiredDocs(formData.types);
  const allRequiredDocsUploaded = requiredDocs
    .filter((d) => d.required)
    .every((d) => uploadingDocs[d.id]?.status === 'done');

  // Validate current step
  const canProceed = (): boolean => {
    switch (step) {
      case 0: return formData.types.length > 0;
      case 1: {
        const p = formData.personalInfo;
        return !!(p.fullName && p.dateOfBirth && p.nationality && p.phoneNumber && p.currentCountry);
      }
      case 2: return allRequiredAnswered;
      case 3: return requiredDocs.length > 0;
      case 4: return allRequiredDocsUploaded;
      case 5: return true; // review step always allows proceed (submit button)
      default: return true;
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  // Handle document upload to server
  const handleDocUpload = useCallback(async (docId: string, file: File) => {
    // Show uploading state
    setUploadingDocs((prev) => ({
      ...prev,
      [docId]: { name: file.name, size: file.size, status: 'uploading' },
    }));

    try {
      const formDataObj = new FormData();
      formDataObj.append('file', file);
      formDataObj.append('category', docId);

      const res = await fetch('/api/user/documents/upload', {
        method: 'POST',
        credentials: 'include',
        body: formDataObj,
      });

      const data = await apiJson<{ message: string; document: { id: number; name: string; filename: string } }>(res);

      if (res.ok) {
        setUploadingDocs((prev) => ({
          ...prev,
          [docId]: { name: file.name, size: file.size, status: 'done' },
        }));
        setFormData((prev) => ({
          ...prev,
          documents: [...prev.documents, { id: docId, url: data.document.filename, name: file.name }],
        }));
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch {
      setUploadingDocs((prev) => ({
        ...prev,
        [docId]: { name: file.name, size: file.size, status: 'error' },
      }));
    }
  }, []);

  const handleDocRemove = useCallback((docId: string) => {
    setUploadingDocs((prev) => {
      const next = { ...prev };
      delete next[docId];
      return next;
    });
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((d) => d.id !== docId),
    }));
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await apiFetch('/user/applications', {
        method: 'POST',
        body: JSON.stringify({
          service_types: formData.types,
          job_category: formData.category || undefined,
          sponsorship_type: formData.types[0],
          personal_info: formData.personalInfo,
          answers: formData.answers,
          documents: formData.documents.map((d) => d.url),
          country: formData.personalInfo.currentCountry,
        }),
      });

      const data = await apiJson<{ message: string; application: { id: number } }>(res);
      if (res.ok) {
        setSubmitted(true);
      } else {
        throw new Error(data.message || 'Failed to submit application');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="min-h-screen bg-navy">
      <div className="hidden lg:block"><Sidebar /></div>
      <MobileMenu />
      <div className="lg:ml-60 min-h-screen pb-20 md:pb-0">
        <div className="p-6 md:p-8 max-w-4xl mx-auto py-6">
          {/* Header */}
          <header className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {submitted ? <>Application <span className="text-gold">Submitted.</span></> : <>Your <span className="text-gold">Application.</span></>}
            </h2>
            <p className="text-sm text-white/50 font-medium">
              {submitted ? 'Thank you for applying!' : 'Complete the steps below to submit your sponsorship request.'}
            </p>
          </header>

          {!submitted && (
            <>
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-10 relative px-2">
                <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
                {STEPS.map((s, i) => {
                  const active = i <= step;
                  const isCurrent = i === step;
                  const Icon = s.icon;
                  return (
                    <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        active ? 'bg-gold text-navy shadow-lg shadow-gold/20' : 'bg-white/5 text-white/30 border border-white/10'
                      }`}>
                        {i < step ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-widest hidden sm:block ${
                        active ? 'text-gold' : 'text-white/30'
                      }`}>{s.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Step Content */}
              <div className="p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 min-h-[400px]">
                <AnimatePresence mode="wait">
                  {/* Step 0: Sponsorship Types */}
                  {step === 0 && (
                    <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <h4 className="text-xl font-heading font-bold text-white mb-2">Select Sponsorship Type(s)</h4>
                      <p className="text-sm text-white/50 mb-6">Choose one or more sponsorship pathways that match your goals.</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {SPONSORSHIP_TYPES.map((t) => {
                          const selected = formData.types.includes(t.id);
                          const Icon = t.icon;
                          return (
                            <button
                              key={t.id}
                              onClick={() => toggleType(t.id)}
                              className={`p-5 text-left rounded-xl border-2 transition-all ${
                                selected
                                  ? 'border-gold bg-gold/10'
                                  : 'border-white/10 bg-white/5 hover:border-white/30'
                              }`}
                            >
                              <Icon className={`mb-3 ${selected ? 'text-gold' : 'text-white/50'}`} size={28} />
                              <h6 className={`font-bold text-sm mb-1 ${selected ? 'text-gold' : 'text-white'}`}>{t.label}</h6>
                              <p className="text-xs text-white/40">{t.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 1: Personal Info */}
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <h4 className="text-xl font-heading font-bold text-white mb-2">Personal Information</h4>
                      <p className="text-sm text-white/50 mb-4">Provide your personal details for the application.</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Full Name *</label>
                          <input type="text" value={formData.personalInfo.fullName} onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                            placeholder="Your full name" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-gold outline-none text-white placeholder-white/30" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Date of Birth *</label>
                          <input type="date" value={formData.personalInfo.dateOfBirth} onChange={(e) => updatePersonalInfo('dateOfBirth', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-gold outline-none text-white [color-scheme:dark]" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Nationality *</label>
                          <input type="text" value={formData.personalInfo.nationality} onChange={(e) => updatePersonalInfo('nationality', e.target.value)}
                            placeholder="e.g., Nigerian, Indian" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-gold outline-none text-white placeholder-white/30" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Phone Number *</label>
                          <input type="tel" value={formData.personalInfo.phoneNumber} onChange={(e) => updatePersonalInfo('phoneNumber', e.target.value)}
                            placeholder="+234 800 000 0000" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-gold outline-none text-white placeholder-white/30" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Current Country of Residence *</label>
                          <input type="text" value={formData.personalInfo.currentCountry} onChange={(e) => updatePersonalInfo('currentCountry', e.target.value)}
                            placeholder="Your current country" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-gold outline-none text-white placeholder-white/30" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Destination Country</label>
                          <input type="text" value={formData.personalInfo.destinationCountry} onChange={(e) => updatePersonalInfo('destinationCountry', e.target.value)}
                            placeholder="Target country (if known)" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-gold outline-none text-white placeholder-white/30" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Interview Questions */}
                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="text-xl font-heading font-bold text-white">Interview Questions</h4>
                          <p className="text-sm text-white/50 mt-1">Answer the questions based on your selected sponsorship type(s).</p>
                        </div>
                        <span className="text-xs text-gold font-medium bg-gold/10 px-3 py-1 rounded-full">
                          {answeredRequired.length}/{requiredQuestions.length} required
                        </span>
                      </div>
                      <InterviewStep
                        questions={relevantQuestions}
                        answers={formData.answers}
                        onAnswer={updateAnswer}
                      />
                    </motion.div>
                  )}

                  {/* Step 3: Document Requirements */}
                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <h4 className="text-xl font-heading font-bold text-white mb-2">Required Documents</h4>
                      <p className="text-sm text-white/50 mb-4">
                        Based on your selections, the following documents are required. You will upload them in the next step.
                      </p>
                      <div className="space-y-3">
                        {requiredDocs.map((doc) => {
                          const isCore = CORE_DOCS.some((c) => c.id === doc.id);
                          return (
                            <div key={doc.id} className={`p-4 rounded-xl border ${isCore ? 'border-gold/20 bg-gold/5' : 'border-white/10 bg-white/5'}`}>
                              <div className="flex items-start gap-3">
                                <FileText className={`w-5 h-5 mt-0.5 ${isCore ? 'text-gold' : 'text-white/40'}`} />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-white">{doc.name}</span>
                                    {doc.required ? (
                                      <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">Required</span>
                                    ) : (
                                      <span className="text-[10px] font-bold text-white/30 bg-white/5 px-2 py-0.5 rounded-full">Optional</span>
                                    )}
                                  </div>
                                  <p className="text-xs text-white/40 mt-1">{doc.description}</p>
                                  <p className="text-[10px] text-white/20 mt-0.5">Accepted formats: {doc.accepted}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Upload Documents */}
                  {step === 4 && (
                    <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <h4 className="text-xl font-heading font-bold text-white mb-2">Upload Documents</h4>
                      <p className="text-sm text-white/50 mb-4">Upload each required document. All files must be clear and legible.</p>
                      <DocumentChecklist
                        documents={requiredDocs}
                        uploadedFiles={uploadingDocs}
                        onUpload={handleDocUpload}
                        onRemove={handleDocRemove}
                      />
                    </motion.div>
                  )}

                  {/* Step 5: Review & Submit */}
                  {step === 5 && (
                    <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <h4 className="text-xl font-heading font-bold text-white mb-2">Review & Submit</h4>
                      <p className="text-sm text-white/50 mb-4">Please review your application before submitting.</p>

                      {submitError && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <span className="text-red-200 text-sm">{submitError}</span>
                        </div>
                      )}

                      <div className="space-y-4">
                        {/* Selected Types */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Sponsorship Type(s)</p>
                          <div className="flex flex-wrap gap-2">
                            {formData.types.map((t) => {
                              const st = SPONSORSHIP_TYPES.find((s) => s.id === t);
                              return (
                                <span key={t} className="px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold">
                                  {st?.label || t}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* Personal Info */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Personal Information</p>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div><span className="text-white/40">Name:</span> <span className="text-white">{formData.personalInfo.fullName}</span></div>
                            <div><span className="text-white/40">DOB:</span> <span className="text-white">{formData.personalInfo.dateOfBirth}</span></div>
                            <div><span className="text-white/40">Nationality:</span> <span className="text-white">{formData.personalInfo.nationality}</span></div>
                            <div><span className="text-white/40">Phone:</span> <span className="text-white">{formData.personalInfo.phoneNumber}</span></div>
                            <div><span className="text-white/40">From:</span> <span className="text-white">{formData.personalInfo.currentCountry}</span></div>
                            {formData.personalInfo.destinationCountry && (
                              <div><span className="text-white/40">To:</span> <span className="text-white">{formData.personalInfo.destinationCountry}</span></div>
                            )}
                          </div>
                        </div>

                        {/* Answers Summary */}
                        {relevantQuestions.length > 0 && (
                          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Questionnaire Answers</p>
                            <div className="space-y-2 text-sm">
                              {relevantQuestions.map((q) => (
                                <div key={q.id} className="flex justify-between">
                                  <span className="text-white/50 truncate mr-4 max-w-[60%]">{q.label}</span>
                                  <span className="text-white font-medium">{formData.answers[q.id] || '—'}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Document Status */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Documents</p>
                          <div className="flex items-center gap-2 text-sm">
                            {allRequiredDocsUploaded ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                <span className="text-green-400">All required documents uploaded</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-4 h-4 text-gold" />
                                <span className="text-gold">Some required documents still missing</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Consent */}
                        <label className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.consented}
                            onChange={() => setFormData((prev) => ({ ...prev, consented: !prev.consented }))}
                            className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-gold focus:ring-gold"
                          />
                          <div>
                            <span className="text-sm font-medium text-white">I confirm that all the information provided is accurate and complete.</span>
                            <p className="text-xs text-white/40 mt-1">I understand that submitting false information may result in rejection.</p>
                          </div>
                        </label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-8 mt-8 border-t border-white/5">
                  {step > 0 && (
                    <button
                      onClick={prevStep}
                      disabled={isSubmitting}
                      className="px-6 py-3 rounded-full border border-white/20 text-white font-semibold text-sm hover:bg-white/5 transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                  )}
                  <div className="flex-1" />
                  {step < STEPS.length - 1 ? (
                    <button
                      onClick={nextStep}
                      disabled={!canProceed()}
                      className="px-8 py-3 rounded-full bg-gold text-navy font-bold text-sm hover:bg-gold/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-gold/20"
                    >
                      Continue <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !formData.consented}
                      className="px-8 py-3 rounded-full bg-gold text-navy font-bold text-sm hover:bg-gold/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-gold/20"
                    >
                      {isSubmitting ? (
                        <><Loader2 size={16} className="animate-spin" /> Submitting…</>
                      ) : (
                        <><CheckCircle2 size={16} /> Submit Application</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Success Screen */}
          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 text-center max-w-lg mx-auto"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={48} className="text-green-500" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-white mb-3">
                Application Submitted!
              </h3>
              <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">
                Your application has been received. Our team will review it and get back to you within 3&ndash;5 business days.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-3 rounded-full bg-gold text-navy font-bold hover:bg-gold/90 transition-colors shadow-lg shadow-gold/20"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => navigate('/opportunities')}
                  className="px-8 py-3 rounded-full border border-white/20 text-white font-bold hover:bg-white/5 transition-colors"
                >
                  Browse Opportunities
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <MobileTabBar />
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import type { Question } from '@/pages/Apply';

interface InterviewStepProps {
  questions: Question[];
  answers: Record<string, string>;
  onAnswer: (questionId: string, value: string) => void;
}

export default function InterviewStep({ questions, answers, onAnswer }: InterviewStepProps) {
  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/60">No questions for the selected sponsorship type(s).</p>
        <p className="text-white/40 text-sm mt-2">Click Next to continue.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {questions.map((q, idx) => (
        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.08 }}
          className="p-5 rounded-xl bg-white/5 border border-white/10"
        >
          <label className="block text-sm font-medium text-white/80 mb-3">
            {q.label}
            {q.required && <span className="text-red-400 ml-1">*</span>}
          </label>

          {q.type === 'text' && (
            <input
              type="text"
              value={answers[q.id] || ''}
              onChange={(e) => onAnswer(q.id, e.target.value)}
              placeholder={q.placeholder || 'Enter your answer...'}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-gold outline-none text-white placeholder-white/30 transition-colors"
            />
          )}

          {q.type === 'select' && q.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.options.map((opt) => {
                const isSelected = answers[q.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onAnswer(q.id, opt.value)}
                    className={`p-3 rounded-xl text-left text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-gold/20 border border-gold/50 text-gold'
                        : 'bg-white/5 border border-white/10 text-white/70 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          )}

          {q.type === 'textarea' && (
            <textarea
              value={answers[q.id] || ''}
              onChange={(e) => onAnswer(q.id, e.target.value)}
              placeholder={q.placeholder || 'Type your answer...'}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-gold outline-none text-white placeholder-white/30 transition-colors resize-none"
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

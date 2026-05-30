'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Send, ChevronDown } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'support';
  time: string;
}

const FAQ_RESPONSES: Record<string, string> = {
  visa: 'For Visa Sponsorship, we help you secure a sponsor and guide you through the entire application process. Our team handles documentation, employer matching, and follow-ups.',
  job: 'Our Job Placement service connects you with verified international employers. We match your skills to vacancies, prepare your CV, and coordinate interviews.',
  education: 'We assist with scholarship applications, university admissions, and student visa processing for top institutions worldwide.',
  residence: 'Permanent Residence support includes eligibility assessment, document preparation, and full application management.',
  cost: 'Our service fees vary by programme. Please visit our Services page or contact our team directly for a personalised quote.',
  contact: 'You can reach us via WhatsApp, email (info@lotoks.com), or by filling out our Contact form at lotoks.com/contact.',
};

function getAutoReply(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('visa')) return FAQ_RESPONSES.visa;
  if (lower.includes('job') || lower.includes('work')) return FAQ_RESPONSES.job;
  if (lower.includes('education') || lower.includes('school') || lower.includes('university')) return FAQ_RESPONSES.education;
  if (lower.includes('residence') || lower.includes('permanent')) return FAQ_RESPONSES.residence;
  if (lower.includes('cost') || lower.includes('price') || lower.includes('fee') || lower.includes('pay')) return FAQ_RESPONSES.cost;
  if (lower.includes('contact') || lower.includes('reach') || lower.includes('email') || lower.includes('phone')) return FAQ_RESPONSES.contact;
  return "Thank you for your message! A member of our team will get back to you shortly. For urgent enquiries, please WhatsApp us or email info@lotoks.com.";
}

export default function SupportSystem() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hello! Welcome to Lotoks Support 👋 How can we help you today? You can ask about Visa Sponsorship, Job Placement, Education, or Permanent Residence.',
      sender: 'support',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now(),
      text: input.trim(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const reply: Message = {
        id: Date.now() + 1,
        text: getAutoReply(userMsg.text),
        sender: 'support',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, reply]);
    }, 800);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open support chat"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9998,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #C9A44B, #a07c30)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(201,164,75,0.4)',
          transition: 'transform 0.2s',
        }}
      >
        {open ? <X color="#fff" size={22} /> : <MessageCircle color="#fff" size={22} />}
      </button>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: '92px',
            right: '24px',
            zIndex: 9997,
            width: '340px',
            maxHeight: '480px',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            background: '#0B1D3A',
            border: '1px solid rgba(201,164,75,0.25)',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(90deg, #0B1D3A, #1a2f50)',
              borderBottom: '1px solid rgba(201,164,75,0.25)',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(201,164,75,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageCircle color="#C9A44B" size={18} />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>Lotoks Support</div>
              <div style={{ color: '#C9A44B', fontSize: '11px' }}>● Online</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}>
              <ChevronDown size={18} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '10px 14px',
                    borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.sender === 'user' ? 'linear-gradient(135deg, #C9A44B, #a07c30)' : 'rgba(255,255,255,0.07)',
                    color: '#fff',
                    fontSize: '13px',
                    lineHeight: '1.5',
                  }}
                >
                  {msg.text}
                </div>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '3px' }}>{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '8px' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Type a message…"
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '9px 12px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none',
              }}
            />
            <button
              onClick={send}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #C9A44B, #a07c30)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Send color="#fff" size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

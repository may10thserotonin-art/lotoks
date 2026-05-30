export const SUPPORT_CONFIG = {
  persistKey: 'lotoks-chat-messages',
  autoReplyDelay: 1500,
  typingDelay: 500,
};

export const AUTO_REPLIES: { keywords: string[]; reply: string }[] = [
  {
    keywords: ['visa', 'sponsorship'],
    reply: 'We offer a range of visa sponsorship services. Please visit /services or apply at /apply to get started.',
  },
  {
    keywords: ['payment', 'fee', 'cost', 'price'],
    reply: 'Our fees vary by service type. You can view pricing during the application process at /apply.',
  },
  {
    keywords: ['document', 'documents', 'upload', 'file'],
    reply: 'You can upload your documents from the Documents section in your dashboard at /documents.',
  },
  {
    keywords: ['status', 'application', 'progress'],
    reply: 'You can check your application status in the Dashboard at /dashboard.',
  },
  {
    keywords: ['contact', 'email', 'support', 'help'],
    reply: 'You can reach us at info@lotoks.co.za or visit our Contact page at /contact.',
  },
];

export const DEFAULT_REPLY =
  "Thanks for your message! Our team will get back to you shortly. For immediate help, please visit our Contact page or email info@lotoks.co.za.";

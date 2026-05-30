export const SUPPORT_CONFIG = {
  phoneNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2348012345678',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2348012345678',
  whatsappMessage: 'Hello! I need help with my sponsorship application.',
  email: 'support@lotoks.com',
  businessName: 'Lotoks',
  responseTime: 'Typically responds in 24 hours',
  maxMessageLength: 1000,
  persistKey: 'lotoks-chat-messages',
  typingDelay: 800,
  autoReplyDelay: 2000,
};

export const AUTO_REPLIES = [
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
    reply: 'Hello! Welcome to Lotoks Support. How can I assist you today?',
  },
  {
    keywords: ['visa', 'application', 'status'],
    reply:
      'You can check your application status from your dashboard. If you need specific help, please provide your application ID.',
  },
  {
    keywords: ['document', 'upload', 'file'],
    reply:
      'Documents can be uploaded from your Documents page. Supported formats: PDF, JPG, PNG (max 10MB each).',
  },
  {
    keywords: ['payment', 'pay', 'fee', 'invoice'],
    reply:
      'Payments can be made via the Payment page. We support PayPal, Stripe, and Paystack. Contact us for payment issues.',
  },
  {
    keywords: ['time', 'processing', 'how long'],
    reply:
      'Processing times vary by service type. Visa applications typically take 2-4 weeks, education placements 1-3 months, and job placements 2-6 months.',
  },
  {
    keywords: ['contact', 'email', 'phone', 'call'],
    reply:
      'You can reach us at support@lotoks.com or via WhatsApp. Our team typically responds within 24 hours.',
  },
];

export const DEFAULT_REPLY =
  "Thank you for your message. One of our support agents will get back to you shortly. For urgent inquiries, please contact us via WhatsApp.";

const supportConfig = {
  ...SUPPORT_CONFIG,
  chatAutoReplies: AUTO_REPLIES,
  offlineMessage:
    'Our team is currently offline. Please leave a message and we will get back to you within 24 hours.',
  greetingMessage: 'Hi there! 👋 How can we help you with your sponsorship journey?',
};

export default supportConfig;

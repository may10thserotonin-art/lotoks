import { z } from 'zod';

// ── Auth ───────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['super_admin', 'admin']).default('admin'),
});

// ── Contact Form ───────────────────────────────────────────────
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// ── Config ─────────────────────────────────────────────────────
export const configSchema = z.object({
  siteName: z.string().min(1),
  supportEmail: z.string().email(),
  supportPhone: z.string().optional(),
  whatsappNumber: z.string().optional(),
  maintenanceMode: z.boolean().default(false),
  paypalClientId: z.string().optional(),
  stripePublicKey: z.string().optional(),
  paystackPublicKey: z.string().optional(),
});

// ── Requirement Document ───────────────────────────────────────
export const documentSchema = z.object({
  doc_key: z.string().min(1),
  label: z.string().min(1),
  description: z.string().optional().default(''),
  required: z.boolean().default(true),
  display_order: z.number().int().min(0).default(0),
});

export const categorySchema = z.object({
  category_key: z.string().min(1),
  category_name: z.string().min(1),
  display_order: z.number().int().min(0).default(0),
  documents: z.array(documentSchema).default([]),
});

export const requirementSetSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().default(''),
  categories: z.array(categorySchema).default([]),
});

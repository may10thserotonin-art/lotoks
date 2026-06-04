import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Settings, Save, Eye, EyeOff, Loader2, AlertTriangle } from 'lucide-react';
import { apiFetch, apiJson } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/shared/Toast';

interface ConfigField {
  key: string;
  label: string;
  description?: string;
  type: 'text' | 'password' | 'number' | 'select' | 'toggle';
  options?: { label: string; value: string }[];
  group: string;
}

const CONFIG_FIELDS: ConfigField[] = [
  // Payments
  { key: 'stripe_publishable_key', label: 'Stripe Publishable Key', type: 'text', group: 'Payments' },
  { key: 'stripe_secret_key', label: 'Stripe Secret Key', type: 'password', group: 'Payments' },
  { key: 'paypal_client_id', label: 'PayPal Client ID', type: 'text', group: 'Payments' },
  { key: 'paypal_secret', label: 'PayPal Secret', type: 'password', group: 'Payments' },
  { key: 'flutterwave_public_key', label: 'Flutterwave Public Key', type: 'text', group: 'Payments' },
  { key: 'flutterwave_secret_key', label: 'Flutterwave Secret Key', type: 'password', group: 'Payments' },
  // OTP
  { key: 'otp_expiry_minutes', label: 'OTP Expiry (minutes)', type: 'number', group: 'Authentication', description: 'How long OTP codes remain valid.' },
  { key: 'otp_length', label: 'OTP Length', type: 'number', group: 'Authentication' },
  // Email
  { key: 'smtp_host', label: 'SMTP Host', type: 'text', group: 'Email' },
  { key: 'smtp_port', label: 'SMTP Port', type: 'number', group: 'Email' },
  { key: 'smtp_user', label: 'SMTP Username', type: 'text', group: 'Email' },
  { key: 'smtp_pass', label: 'SMTP Password', type: 'password', group: 'Email' },
  { key: 'email_from', label: 'From Email Address', type: 'text', group: 'Email' },
  // General
  { key: 'app_name', label: 'App Name', type: 'text', group: 'General' },
  { key: 'support_email', label: 'Support Email', type: 'text', group: 'General' },
  { key: 'maintenance_mode', label: 'Maintenance Mode', type: 'toggle', group: 'General', description: 'When enabled, the public site will show a maintenance page.' },
];

const GROUPS = [...new Set(CONFIG_FIELDS.map((f) => f.group))];

export function AdminConfigPage() {
  const qc = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const { isLoading, error } = useQuery({
    queryKey: ['adminConfig'],
    queryFn: async () => {
      const res = await apiFetch('/admin/config');
      if (!res.ok) throw new Error('Failed');
      const data = await apiJson(res);
      const cfg = data.config ?? data;
      setValues(cfg);
      setLoaded(true);
      return cfg;
    },
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await apiFetch('/admin/config', {
        method: 'PUT',
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      toast.success('Configuration saved successfully!');
      qc.invalidateQueries({ queryKey: ['adminConfig'] });
    } catch {
      toast.error('Failed to save configuration.');
    } finally {
      setSaving(false);
    }
  };

  const set = (key: string, val: string) => setValues((prev) => ({ ...prev, [key]: val }));

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red/10 border border-red/20 text-red/80">
          <AlertTriangle className="w-5 h-5" /><span className="text-sm">Failed to load configuration.</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-6 lg:p-8">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">System Configuration</h1>
          <p className="text-white/50 text-sm mt-1">Manage API keys, email settings, and system options.</p>
        </div>
        <Button variant="primary" size="sm" onClick={handleSave} disabled={saving} icon={<Save className="w-4 h-4" />}>
          {saving ? 'Saving…' : 'Save All'}
        </Button>
      </div>

      <div className="space-y-8">
        {GROUPS.map((group) => (
          <div key={group} className="p-6 rounded-2xl bg-white/3 border border-white/10">
            <h2 className="text-lg font-heading font-semibold text-white mb-5 flex items-center gap-2">
              <Settings className="w-4 h-4 text-gold" />
              {group}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CONFIG_FIELDS.filter((f) => f.group === group).map((field) => (
                <div key={field.key} className={field.type === 'toggle' ? 'md:col-span-2' : ''}>
                  <label className="block text-white/60 text-sm mb-1.5 font-medium">{field.label}</label>
                  {field.description && (
                    <p className="text-white/30 text-xs mb-2">{field.description}</p>
                  )}

                  {field.type === 'toggle' ? (
                    <button
                      type="button"
                      onClick={() => set(field.key, values[field.key] === 'true' ? 'false' : 'true')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${values[field.key] === 'true' ? 'bg-gold' : 'bg-white/20'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${values[field.key] === 'true' ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  ) : field.type === 'password' ? (
                    <div className="relative">
                      <input
                        type={revealed[field.key] ? 'text' : 'password'}
                        value={values[field.key] ?? ''}
                        onChange={(e) => set(field.key, e.target.value)}
                        placeholder={`Enter ${field.label.toLowerCase()}…`}
                        className="w-full pr-10 pl-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold/50 text-sm font-mono transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setRevealed((r) => ({ ...r, [field.key]: !r[field.key] }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                      >
                        {revealed[field.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      value={values[field.key] ?? ''}
                      onChange={(e) => set(field.key, e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()}…`}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold/50 text-sm transition-colors"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

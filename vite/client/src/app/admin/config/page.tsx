
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Globe, Mail, Shield, Bell, Save } from "lucide-react";

const configSections = [
  { id: "general", label: "General", icon: Settings },
  { id: "localization", label: "Localization", icon: Globe },
  { id: "email", label: "Email", icon: Mail },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export default function AdminConfigPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [config, setConfig] = useState({
    siteName: "Lotoks",
    supportEmail: "support@lotoks.com",
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
  });

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-on-surface">System Configuration</h2>
        <p className="text-sm text-on-surface-variant font-medium mt-1">Configure platform settings and preferences</p>
      </div>

      <div className="flex gap-8">
        <div className="w-64 shrink-0">
          <nav className="space-y-1">
            {configSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-all ${
                  activeSection === section.id
                    ? "bg-primary text-white"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                <section.icon size={18} />
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 bg-white border border-outline-variant/30 rounded-2xl p-8">
          {activeSection === "general" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h4 className="text-xl font-bold text-on-surface mb-6">General Settings</h4>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-2">Site Name</label>
                  <input
                    type="text"
                    value={config.siteName}
                    onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                  <div>
                    <p className="font-bold text-on-surface">Maintenance Mode</p>
                    <p className="text-sm text-on-surface-variant">Show maintenance page to users</p>
                  </div>
                  <button
                    onClick={() => setConfig({ ...config, maintenanceMode: !config.maintenanceMode })}
                    className={`w-12 h-6 rounded-full transition-colors ${config.maintenanceMode ? "bg-primary" : "bg-outline-variant"}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${config.maintenanceMode ? "translate-x-6" : "translate-x-0.5"}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                  <div>
                    <p className="font-bold text-on-surface">Allow Registration</p>
                    <p className="text-sm text-on-surface-variant">New users can create accounts</p>
                  </div>
                  <button
                    onClick={() => setConfig({ ...config, allowRegistration: !config.allowRegistration })}
                    className={`w-12 h-6 rounded-full transition-colors ${config.allowRegistration ? "bg-primary" : "bg-outline-variant"}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${config.allowRegistration ? "translate-x-6" : "translate-x-0.5"}`} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "email" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h4 className="text-xl font-bold text-on-surface mb-6">Email Settings</h4>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-2">Support Email</label>
                  <input
                    type="email"
                    value={config.supportEmail}
                    onChange={(e) => setConfig({ ...config, supportEmail: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                  <div>
                    <p className="font-bold text-on-surface">Email Notifications</p>
                    <p className="text-sm text-on-surface-variant">Send email updates to users</p>
                  </div>
                  <button
                    onClick={() => setConfig({ ...config, emailNotifications: !config.emailNotifications })}
                    className={`w-12 h-6 rounded-full transition-colors ${config.emailNotifications ? "bg-primary" : "bg-outline-variant"}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${config.emailNotifications ? "translate-x-6" : "translate-x-0.5"}`} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "localization" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h4 className="text-xl font-bold text-on-surface mb-6">Localization</h4>
              <p className="text-on-surface-variant">Language and regional settings</p>
            </motion.div>
          )}

          {activeSection === "security" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h4 className="text-xl font-bold text-on-surface mb-6">Security</h4>
              <p className="text-on-surface-variant">Security and authentication settings</p>
            </motion.div>
          )}

          {activeSection === "notifications" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h4 className="text-xl font-bold text-on-surface mb-6">Notifications</h4>
              <p className="text-on-surface-variant">Push and in-app notification settings</p>
            </motion.div>
          )}

          <div className="mt-8 pt-6 border-t border-outline-variant/20">
            <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dim transition-all shadow-lg shadow-primary/20">
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
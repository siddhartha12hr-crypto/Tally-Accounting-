import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Bell, Palette, Database, Shield, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export function AdminSettings() {
  const [settings, setSettings] = useState({
    // Security Settings
    adminPin: "9090",
    userPin: "1234",
    enableTwoFactor: false,
    sessionTimeout: "30",
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: false,
    weeklyReports: true,
    
    // Appearance Settings
    siteName: "Tally Accounting Hub Pro",
    tagline: "Learn Tally, Accounting & Business Skills",
    primaryColor: "#FF6B35",
    accentColor: "#004E89",
    
    // System Settings
    maxUploadSize: "100",
    enableCache: true,
    maintenanceMode: false,
    backupFrequency: "daily",
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In a real app, this would save to backend
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const settingSections = [
    {
      title: "Security Settings",
      icon: Shield,
      items: [
        {
          type: "input",
          label: "Admin PIN",
          description: "PIN required to access admin panel",
          value: settings.adminPin,
          onChange: (value: string) => setSettings({ ...settings, adminPin: value }),
        },
        {
          type: "input",
          label: "User PIN",
          description: "PIN required for protected content",
          value: settings.userPin,
          onChange: (value: string) => setSettings({ ...settings, userPin: value }),
        },
        {
          type: "toggle",
          label: "Two-Factor Authentication",
          description: "Require 2FA for admin access",
          value: settings.enableTwoFactor,
          onChange: (value: boolean) => setSettings({ ...settings, enableTwoFactor: value }),
        },
        {
          type: "input",
          label: "Session Timeout (minutes)",
          description: "Auto-logout after inactivity",
          value: settings.sessionTimeout,
          onChange: (value: string) => setSettings({ ...settings, sessionTimeout: value }),
        },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      items: [
        {
          type: "toggle",
          label: "Email Notifications",
          description: "Receive admin updates via email",
          value: settings.emailNotifications,
          onChange: (value: boolean) => setSettings({ ...settings, emailNotifications: value }),
        },
        {
          type: "toggle",
          label: "Push Notifications",
          description: "Browser push notifications",
          value: settings.pushNotifications,
          onChange: (value: boolean) => setSettings({ ...settings, pushNotifications: value }),
        },
        {
          type: "toggle",
          label: "SMS Alerts",
          description: "Critical alerts via SMS",
          value: settings.smsAlerts,
          onChange: (value: boolean) => setSettings({ ...settings, smsAlerts: value }),
        },
        {
          type: "toggle",
          label: "Weekly Reports",
          description: "Automated weekly analytics reports",
          value: settings.weeklyReports,
          onChange: (value: boolean) => setSettings({ ...settings, weeklyReports: value }),
        },
      ],
    },
    {
      title: "Appearance",
      icon: Palette,
      items: [
        {
          type: "input",
          label: "Site Name",
          description: "Display name for the platform",
          value: settings.siteName,
          onChange: (value: string) => setSettings({ ...settings, siteName: value }),
        },
        {
          type: "input",
          label: "Tagline",
          description: "Site tagline or description",
          value: settings.tagline,
          onChange: (value: string) => setSettings({ ...settings, tagline: value }),
        },
        {
          type: "color",
          label: "Primary Color",
          description: "Main brand color",
          value: settings.primaryColor,
          onChange: (value: string) => setSettings({ ...settings, primaryColor: value }),
        },
        {
          type: "color",
          label: "Accent Color",
          description: "Secondary brand color",
          value: settings.accentColor,
          onChange: (value: string) => setSettings({ ...settings, accentColor: value }),
        },
      ],
    },
    {
      title: "System Settings",
      icon: Database,
      items: [
        {
          type: "input",
          label: "Max Upload Size (MB)",
          description: "Maximum file upload size",
          value: settings.maxUploadSize,
          onChange: (value: string) => setSettings({ ...settings, maxUploadSize: value }),
        },
        {
          type: "toggle",
          label: "Enable Cache",
          description: "Cache content for faster loading",
          value: settings.enableCache,
          onChange: (value: boolean) => setSettings({ ...settings, enableCache: value }),
        },
        {
          type: "toggle",
          label: "Maintenance Mode",
          description: "Put site in maintenance mode",
          value: settings.maintenanceMode,
          onChange: (value: boolean) => setSettings({ ...settings, maintenanceMode: value }),
        },
        {
          type: "select",
          label: "Backup Frequency",
          description: "Automated backup schedule",
          value: settings.backupFrequency,
          options: ["hourly", "daily", "weekly", "monthly"],
          onChange: (value: string) => setSettings({ ...settings, backupFrequency: value }),
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {settingSections.map((section, sectionIdx) => {
        const Icon = section.icon;
        return (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIdx * 0.1 }}
            className="rounded-2xl glass p-5 shadow-card"
          >
            <h3 className="text-lg font-black mb-4 flex items-center gap-2">
              <Icon className="h-5 w-5 text-primary" />
              {section.title}
            </h3>
            <div className="space-y-4">
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx} className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-accent/20 transition-colors">
                  <div className="flex-1">
                    <Label className="text-sm font-bold">{item.label}</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                  </div>
                  <div className="shrink-0">
                    {item.type === "toggle" && (
                      <Switch
                        checked={item.value as boolean}
                        onCheckedChange={item.onChange as (value: boolean) => void}
                      />
                    )}
                    {item.type === "input" && (
                      <Input
                        value={item.value as string}
                        onChange={(e) => (item.onChange as (value: string) => void)(e.target.value)}
                        className="w-32 rounded-xl text-right"
                      />
                    )}
                    {item.type === "color" && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={item.value as string}
                          onChange={(e) => (item.onChange as (value: string) => void)(e.target.value)}
                          className="w-12 h-10 rounded-xl cursor-pointer"
                        />
                        <span className="text-xs font-mono">{item.value}</span>
                      </div>
                    )}
                    {item.type === "select" && (
                      <select
                        value={item.value as string}
                        onChange={(e) => (item.onChange as (value: string) => void)(e.target.value)}
                        className="px-3 py-2 rounded-xl glass border-0 text-sm font-semibold"
                      >
                        {(item as any).options.map((option: string) => (
                          <option key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-3"
      >
        <Button
          onClick={handleSave}
          className="flex-1 rounded-xl gradient-hero text-white shadow-glow py-6 text-base font-black"
        >
          <Save className="h-5 w-5 mr-2" />
          Save All Settings
        </Button>
      </motion.div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-center"
        >
          <p className="text-sm font-bold text-green-600">✓ Settings saved successfully!</p>
        </motion.div>
      )}

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl glass p-5 shadow-card border-2 border-destructive/20"
      >
        <h3 className="text-lg font-black mb-4 text-destructive">⚠️ Danger Zone</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-destructive/5 transition-colors">
            <div>
              <Label className="text-sm font-bold">Clear All Cache</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Remove all cached data</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl border-destructive/20 text-destructive hover:bg-destructive hover:text-white">
              Clear Cache
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-destructive/5 transition-colors">
            <div>
              <Label className="text-sm font-bold">Reset to Defaults</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Restore all default settings</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl border-destructive/20 text-destructive hover:bg-destructive hover:text-white">
              Reset All
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-destructive/5 transition-colors">
            <div>
              <Label className="text-sm font-bold">Delete All Content</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Permanently delete all videos, courses, etc.</p>
            </div>
            <Button variant="destructive" size="sm" className="rounded-xl">
              Delete All
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

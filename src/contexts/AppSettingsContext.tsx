import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";

export interface AppSettings {
  adminPin: string;
  userPin: string;
  enableTwoFactor: boolean;
  sessionTimeout: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsAlerts: boolean;
  weeklyReports: boolean;
  maxUploadSize: string;
  enableCache: boolean;
  maintenanceMode: boolean;
  backupFrequency: string;
}

const STORAGE_KEY = "tally_app_settings";
export const DEFAULT_APP_SETTINGS: AppSettings = {
  adminPin: "9090", userPin: "1234", enableTwoFactor: false, sessionTimeout: "30",
  emailNotifications: true, pushNotifications: true, smsAlerts: false, weeklyReports: true,
  maxUploadSize: "100", enableCache: true, maintenanceMode: false, backupFrequency: "daily",
};

interface AppSettingsContextType {
  settings: AppSettings;
  isLoading: boolean;
  saveSettings: (settings: AppSettings) => Promise<void>;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

function readLocal(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_APP_SETTINGS, ...JSON.parse(raw) } : DEFAULT_APP_SETTINGS;
  } catch { return DEFAULT_APP_SETTINGS; }
}

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const local = readLocal();
      setSettings(local);
      if (supabase) {
        const { data } = await supabase.from("app_settings").select("value").eq("key", "app_settings").maybeSingle();
        if (data?.value && typeof data.value === "object") {
          const saved = { ...DEFAULT_APP_SETTINGS, ...(data.value as Partial<AppSettings>) };
          setSettings(saved);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
        }
      }
      setIsLoading(false);
    };
    void load();
  }, []);

  const saveSettings = async (next: AppSettings) => {
    if (!/^\d{4,}$/.test(next.adminPin) || !/^\d{4,}$/.test(next.userPin)) {
      throw new Error("PINs must contain at least four digits");
    }
    setSettings(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    if (supabase) {
      const { error } = await supabase.from("app_settings").upsert({ key: "app_settings", value: next });
      if (error) throw error;
    }
  };

  return <AppSettingsContext.Provider value={{ settings, isLoading, saveSettings }}>{children}</AppSettingsContext.Provider>;
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (!context) throw new Error("useAppSettings must be used within AppSettingsProvider");
  return context;
}

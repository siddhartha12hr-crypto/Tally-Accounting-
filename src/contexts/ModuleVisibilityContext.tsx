import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";

export type ModuleKey = "courses" | "movies" | "sports" | "notes";
export type ModuleVisibility = Record<ModuleKey, boolean>;

const STORAGE_KEY = "tally_module_visibility";
const DEFAULT_VISIBILITY: ModuleVisibility = {
  courses: true,
  movies: true,
  sports: true,
  notes: true,
};

interface ModuleVisibilityContextType {
  visibility: ModuleVisibility;
  isLoading: boolean;
  isVisible: (module: ModuleKey) => boolean;
  setVisibility: (module: ModuleKey, visible: boolean) => Promise<void>;
}

const ModuleVisibilityContext = createContext<ModuleVisibilityContextType | undefined>(undefined);

function readLocal(): ModuleVisibility {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_VISIBILITY, ...JSON.parse(raw) } : DEFAULT_VISIBILITY;
  } catch {
    return DEFAULT_VISIBILITY;
  }
}

export function ModuleVisibilityProvider({ children }: { children: ReactNode }) {
  const [visibility, setVisibilityState] = useState<ModuleVisibility>(DEFAULT_VISIBILITY);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const local = readLocal();
      setVisibilityState(local);
      if (supabase) {
        const { data } = await supabase
          .from("app_settings")
          .select("value")
          .eq("key", "module_visibility")
          .maybeSingle();
        if (data?.value && typeof data.value === "object") {
          const saved = { ...DEFAULT_VISIBILITY, ...(data.value as Partial<ModuleVisibility>) };
          setVisibilityState(saved);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
        }
      }
      setIsLoading(false);
    };
    void load();
  }, []);

  const setVisibility = async (module: ModuleKey, visible: boolean) => {
    const next = { ...visibility, [module]: visible };
    setVisibilityState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

    if (supabase) {
      const { error } = await supabase.from("app_settings").upsert({
        key: "module_visibility",
        value: next,
      });
      if (error) throw error;
    }
  };

  return (
    <ModuleVisibilityContext.Provider value={{ visibility, isLoading, isVisible: module => visibility[module], setVisibility }}>
      {children}
    </ModuleVisibilityContext.Provider>
  );
}

export function useModuleVisibility() {
  const context = useContext(ModuleVisibilityContext);
  if (!context) throw new Error("useModuleVisibility must be used within ModuleVisibilityProvider");
  return context;
}

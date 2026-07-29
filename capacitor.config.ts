import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.tallyhub.pro",
  appName: "Tally Hub Pro",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;

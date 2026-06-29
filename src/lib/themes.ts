export interface Theme {
  id: string;
  name: string;
  icon: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    surfaceHover: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    glow: string;
  };
}

export const themes: Theme[] = [
  {
    id: "dark-green",
    name: "System 777",
    icon: "🟢",
    colors: {
      primary: "#00FF88",
      secondary: "#00C8FF",
      accent: "#7C3AED",
      background: "#0A0A0A",
      surface: "#121212",
      surfaceHover: "#1a1a1a",
      text: "#ffffff",
      textSecondary: "#9ca3af",
      border: "rgba(255,255,255,0.05)",
      success: "#00FF88",
      warning: "#FFD93D",
      error: "#EF4444",
      glow: "rgba(0,255,136,0.15)",
    },
  },
  {
    id: "discord",
    name: "Discord",
    icon: "💜",
    colors: {
      primary: "#5865F2",
      secondary: "#EB459E",
      accent: "#FEE75C",
      background: "#313338",
      surface: "#2B2D31",
      surfaceHover: "#35373C",
      text: "#ffffff",
      textSecondary: "#b5bac1",
      border: "rgba(255,255,255,0.06)",
      success: "#57F287",
      warning: "#FEE75C",
      error: "#ED4245",
      glow: "rgba(88,101,242,0.2)",
    },
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "💚",
    colors: {
      primary: "#25D366",
      secondary: "#128C7E",
      accent: "#075E54",
      background: "#0B141A",
      surface: "#1F2C34",
      surfaceHover: "#2A3942",
      text: "#E9EDEF",
      textSecondary: "#8696A0",
      border: "rgba(255,255,255,0.06)",
      success: "#25D366",
      warning: "#FFD93D",
      error: "#EF4444",
      glow: "rgba(37,211,102,0.15)",
    },
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    icon: "🟡",
    colors: {
      primary: "#FACC15",
      secondary: "#F43F5E",
      accent: "#06B6D4",
      background: "#0C0A09",
      surface: "#1C1917",
      surfaceHover: "#292524",
      text: "#FAFAF9",
      textSecondary: "#A8A29E",
      border: "rgba(250,204,21,0.1)",
      success: "#22C55E",
      warning: "#FACC15",
      error: "#F43F5E",
      glow: "rgba(250,204,21,0.15)",
    },
  },
  {
    id: "ocean",
    name: "Océano",
    icon: "🌊",
    colors: {
      primary: "#0EA5E9",
      secondary: "#06B6D4",
      accent: "#8B5CF6",
      background: "#0C1222",
      surface: "#131C2E",
      surfaceHover: "#1A2540",
      text: "#F0F9FF",
      textSecondary: "#7DD3FC",
      border: "rgba(14,165,233,0.1)",
      success: "#22C55E",
      warning: "#FBBF24",
      error: "#EF4444",
      glow: "rgba(14,165,233,0.15)",
    },
  },
  {
    id: "sunset",
    name: "Atardecer",
    icon: "🌅",
    colors: {
      primary: "#F97316",
      secondary: "#EC4899",
      accent: "#A855F7",
      background: "#1C0F13",
      surface: "#2A1520",
      surfaceHover: "#3A1F2E",
      text: "#FFF7ED",
      textSecondary: "#FDBA74",
      border: "rgba(249,115,22,0.1)",
      success: "#22C55E",
      warning: "#FBBF24",
      error: "#EF4444",
      glow: "rgba(249,115,22,0.15)",
    },
  },
  {
    id: "matrix",
    name: "Matrix",
    icon: "🟢",
    colors: {
      primary: "#00FF41",
      secondary: "#008F11",
      accent: "#00FF41",
      background: "#000000",
      surface: "#0D0D0D",
      surfaceHover: "#1A1A1A",
      text: "#00FF41",
      textSecondary: "#008F11",
      border: "rgba(0,255,65,0.1)",
      success: "#00FF41",
      warning: "#FFFF00",
      error: "#FF0000",
      glow: "rgba(0,255,65,0.15)",
    },
  },
  {
    id: "light",
    name: "Claro",
    icon: "☀️",
    colors: {
      primary: "#059669",
      secondary: "#0284C7",
      accent: "#7C3AED",
      background: "#F9FAFB",
      surface: "#FFFFFF",
      surfaceHover: "#F3F4F6",
      text: "#111827",
      textSecondary: "#6B7280",
      border: "rgba(0,0,0,0.08)",
      success: "#059669",
      warning: "#D97706",
      error: "#DC2626",
      glow: "rgba(5,150,105,0.1)",
    },
  },
];

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const c = theme.colors;
  root.style.setProperty("--color-primary", c.primary);
  root.style.setProperty("--color-secondary", c.secondary);
  root.style.setProperty("--color-accent", c.accent);
  root.style.setProperty("--color-background", c.background);
  root.style.setProperty("--color-surface", c.surface);
  root.style.setProperty("--color-surface-hover", c.surfaceHover);
  root.style.setProperty("--color-text", c.text);
  root.style.setProperty("--color-text-secondary", c.textSecondary);
  root.style.setProperty("--color-border", c.border);
  root.style.setProperty("--color-success", c.success);
  root.style.setProperty("--color-warning", c.warning);
  root.style.setProperty("--color-error", c.error);
  root.style.setProperty("--color-glow", c.glow);
  root.style.background = c.background;
  root.style.color = c.text;
}

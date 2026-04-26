import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        shell: "var(--shell)",
        panel: "var(--panel)",
        elevated: "var(--elevated)",
        "elevated-2": "var(--elevated-2)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        subtle: "var(--subtle)",
        line: "var(--line)",
        "line-soft": "var(--line-soft)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "on-accent": "var(--on-accent)",
        "accent-soft": "var(--accent-soft)",
        "accent-border": "var(--accent-border)",
        "accent-muted": "var(--accent-muted)",
        "success-bg": "var(--success-bg)",
        "success-fg": "var(--success-fg)",
        "success-border": "var(--success-border)",
        "warn-bg": "var(--warn-bg)",
        "warn-border": "var(--warn-border)",
        "warn-text": "var(--warn-text)",
        "warn-muted": "var(--warn-muted)",
        "danger-bg": "var(--danger-bg)",
        "danger-border": "var(--danger-border)",
        "danger-text": "var(--danger-text)",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
export default config;

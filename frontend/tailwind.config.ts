import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm Editorial Stationery Color Tokens
        surface: {
          DEFAULT: "var(--surface)",
          dim: "#dadad8",
          bright: "#f9f9f7",
          "container-lowest": "#ffffff",
          "container-low": "#f4f4f2",
          container: "#eeeeec",
          "container-high": "#e8e8e6",
          "container-highest": "#e2e3e1",
          variant: "#e2e3e1",
          tint: "#5f5e5e",
        },
        "on-surface": "#1a1c1b",
        "on-surface-variant": "#444748",
        "inverse-surface": "#2f3130",
        "inverse-on-surface": "#f1f1ef",
        outline: {
          DEFAULT: "#747878",
          variant: "#c4c7c7",
        },

        // Primary / Secondary / Tertiary
        primary: {
          DEFAULT: "#000000",
          foreground: "#ffffff",
          container: "#1c1b1b",
          "on-container": "#858383",
          fixed: "#e5e2e1",
          "fixed-dim": "#c8c6c5",
          "on-fixed": "#1c1b1b",
          "on-fixed-variant": "#474746",
          inverse: "#c8c6c5",
        },
        "on-primary": "#ffffff",

        secondary: {
          DEFAULT: "#6a5d43",
          foreground: "#ffffff",
          container: "#f0debd",
          "on-container": "#6e6147",
          fixed: "#f3e0c0",
          "fixed-dim": "#d6c5a5",
          "on-fixed": "#231a06",
          "on-fixed-variant": "#51452d",
        },
        "on-secondary": "#ffffff",

        tertiary: {
          DEFAULT: "#000000",
          foreground: "#ffffff",
          container: "#1b1c19",
          "on-container": "#848480",
          fixed: "#e4e2dd",
          "fixed-dim": "#c8c6c2",
          "on-fixed": "#1b1c19",
          "on-fixed-variant": "#474744",
        },
        "on-tertiary": "#ffffff",

        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
          "on-container": "#93000a",
        },
        "on-error": "#ffffff",

        // Base & Functional mappings
        bg: "var(--bg)",
        border: "var(--border)",
        text: "var(--text)",
        "text-muted": "var(--text-muted)",
        accent: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
        },
        "warm-gold": "var(--warm-gold)",
        success: "var(--success)",
        danger: "var(--danger)",

        // shadcn compatibility
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        input: "var(--input)",
        ring: "var(--ring)",
      },
      borderRadius: {
        sm: "0.25rem",      // 4px
        DEFAULT: "0.625rem", // 10px uniform stationery radius
        md: "0.75rem",       // 12px
        lg: "1rem",          // 16px
        xl: "1.5rem",        // 24px
        full: "9999px",      // pill geometry
      },
      spacing: {
        gutter: "1.5rem",
        "gutter-lg": "2.5rem",
        margin: "1.25rem",
        "margin-md": "2.5rem",
        "margin-lg": "4rem",
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2.5rem",
        "space-2xl": "4rem",

        // Workspace sizing
        rail: "72px",
        panel: "300px",
        props: "280px",
        topbar: "56px",
        "page-strip": "110px",
      },
      boxShadow: {
        DEFAULT: "0 1px 2px rgba(26, 28, 27, 0.04)",
        ambient: "0 8px 30px rgba(26, 26, 26, 0.04)",
        card: "0 1px 2px rgba(26, 28, 27, 0.04), 0 8px 30px rgba(26, 26, 26, 0.04)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        serif: ["var(--font-playfair)", "Playfair Display", "serif"],
        display: ["var(--font-playfair)", "Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;

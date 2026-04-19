import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        destructive: "var(--destructive)",
        "destructive-foreground": "var(--destructive-foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        // Night Shift specific colors
        night: {
          900: "#0a0a0f",
          800: "#0f0f19",
          700: "#1e1b4b",
          600: "#1e293b",
        },
        neon: {
          cyan: "#22d3ee",
          purple: "#8b5cf6",
          pink: "#c084fc",
          blue: "#60a5fa",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down": "slideDown 0.3s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "spin-slow": "spin 2s linear infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "twinkle": "twinkle 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { 
            boxShadow: "0 0 20px rgba(34, 211, 238, 0.3), 0 0 40px rgba(139, 92, 246, 0.1)"
          },
          "50%": { 
            boxShadow: "0 0 30px rgba(34, 211, 238, 0.5), 0 0 60px rgba(139, 92, 246, 0.2)"
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) translateX(0)", opacity: "0.3" },
          "25%": { transform: "translateY(-20px) translateX(10px)", opacity: "0.8" },
          "50%": { transform: "translateY(-10px) translateX(-5px)", opacity: "0.5" },
          "75%": { transform: "translateY(-30px) translateX(5px)", opacity: "0.7" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "night-gradient": "linear-gradient(180deg, #0a0a0f 0%, #1e1b4b 50%, #0a0a0f 100%)",
        "neon-gradient": "linear-gradient(135deg, #22d3ee 0%, #8b5cf6 50%, #c084fc 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
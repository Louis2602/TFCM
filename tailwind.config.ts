import type { Config } from "tailwindcss";
const { fontFamily } = require("tailwindcss/defaultTheme");

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: {
        "2xl": "1280px",
      },
    },
    fontFamily: {
      sans: ["var(--font-sans)", ...fontFamily.sans],
      heading: ["var(--font-heading)", ...fontFamily.sans],
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        "nav-height": "var(--nav-height)",
      },

      backgroundImage: {
        "logo-gradient":
          "conic-gradient(from 180deg at 50% 50%,#ff7a85 0deg,#a488f6 112.5deg,#1a8cff 228.75deg,#ff7a85 360deg)",
        "image-gradient":
          "conic-gradient(from 180deg at 50% 50%,#ff7a85 0deg,#a488f6 112.5deg,#1a8cff 228.75deg,#0d1117 360deg)",
        "button-gradient":
          "linear-gradient(to bottom right,#a488f6ee,#1a8cffaa);",
        "border-gradient":
          "radial-gradient(62.87% 100% at 50% 100%,rgba(255,255,255,.12) 0%,rgba(255,255,255,0) 100%)",
        "header-gradient":
          "radial-gradient(37.74% 81.78% at 50% 26.56%,rgba(164, 136, 246,.06) 0%,rgba(3,0,20,0) 100%)",
        "divider-gradient":
          "linear-gradient(90deg, hsla(218, 18%, 21%, 1) 45%, hsla(218, 18%, 21%, 0) 45%, hsla(218, 18%, 21%, 0) 55%, hsla(218, 18%, 21%, 1) 55%);",
        "service-card-gradient":
          "linear-gradient(90deg,rgba(255,255,255,0) 0%, #a488f6 50%, rgba(0,255,0,0) 100%);",
        "secondary-track":
          "linear-gradient(0deg,rgba(255,255,255,0) 0%, #a488f655 50%, rgba(0,255,0,0) 100%);",
        "pricing-card-gradient":
          "linear-gradient(0deg,rgba(255,255,255,0) 0%, #1a8cff 50%, rgba(0,255,0,0) 100%);",
      },
      boxShadow: {
        button: "rgba(26,140,255,0.3) 0px 0px 40px",
        hero: "rgba(0, 99, 198, 0.1) 0px 0px 150px 100px",
        "hero-secondary": "rgba(164, 136, 246, 0.1) 0px 0px 150px 100px",
        "hero-image": "rgba(0, 99, 198, 0.1) 0px 0px 150px 20px",
        dashboard: "rgba(0, 99, 198, 0.07) 0px 0px 200px 20px",
        "primary-card": "rgba(0, 99, 198, 0.1) 0px 4px 24px",
        "secondary-card": "rgba(164, 136, 246, 0.1) 0px 4px 24px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        rotate: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "none", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        rotate: "rotate 20s linear infinite",
        "pulse-slow": "pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-down": "slide-down 1s ease backwards running",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

export default config;

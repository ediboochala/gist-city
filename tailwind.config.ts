import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1A1712",
        cream: "#FFF8E7",
        paper: "#FFFFFF",
        line: "#E9DFC4",
        muted: "#5C5443",
        danfo: { DEFAULT: "#F5BE1B", soft: "#FDE9A8" },
        naija: { DEFAULT: "#0E6B3A", dark: "#0A4F2B", soft: "#D7EBDD" },
        salon: { DEFAULT: "#7A2E10", soft: "#F6D9CC" },
        owa: "#B93C0C",
        parlour: { DEFAULT: "#14120E", card: "#1F1C16", edge: "#2E2A22" },
        church: { DEFAULT: "#3B2F7A", dark: "#2C2360", soft: "#E4E0F5" },
        mosque: { DEFAULT: "#0F5E5A", dark: "#0A4744", soft: "#D3E8E6" },
        barber: { DEFAULT: "#1F3A5F", soft: "#DCE8F5" },
      },
      fontFamily: {
        display: ["'Bricolage Grotesque'", "'DM Sans'", "system-ui", "sans-serif"],
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
      },
      keyframes: {
        speak: {
          "0%, 100%": { boxShadow: "0 0 0 3px rgba(14,107,58,0.35)" },
          "50%": { boxShadow: "0 0 0 7px rgba(14,107,58,0.15)" },
        },
        pop: {
          "0%": { transform: "scale(0.8) rotate(-8deg)" },
          "60%": { transform: "scale(1.08) rotate(3deg)" },
          "100%": { transform: "scale(1) rotate(0)" },
        },
        floatUp: {
          "0%": { transform: "translateY(0) scale(0.6)", opacity: "0" },
          "15%": { transform: "translateY(-20px) scale(1.2)", opacity: "1" },
          "100%": { transform: "translateY(-220px) scale(1)", opacity: "0" },
        },
        typing: {
          "0%, 80%, 100%": { opacity: "0.25" },
          "40%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        speak: "speak 1.2s ease-in-out infinite",
        "slide-up": "slideUp 220ms ease-out",
        pop: "pop 380ms ease-out",
        "float-up": "floatUp 1.8s ease-out forwards",
        typing: "typing 1.2s infinite",
      },
    },
  },
  plugins: [],
};

export default config;

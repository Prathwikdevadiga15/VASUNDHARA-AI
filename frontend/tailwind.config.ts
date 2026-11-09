import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: { forest: "#0f3d2a", emerald: "#10a56b", beige: "#f6f3ea", gold: "#b8923a" },
      fontFamily: { display: ["Fraunces", "Georgia", "serif"], sans: ["Figtree", "system-ui", "sans-serif"] },
    },
  },
} satisfies Config;

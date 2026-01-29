// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // Ajoutez d'autres chemins si vos composants sont ailleurs
  ],
  // Dans v4, on définit souvent le thème directement ici
  theme: {
    extend: {
      // 1. DÉFINISSEZ VOS COULEURS PERSONNALISÉES ICI
      colors: {
        orange: "#FF6B00",
        secondary: "#FFA040",
        gray: "#2E2E2E",
        platinium: "#E6E6E6",
        gray_clair: "#F5F5F5",
        blue: "#4F46E5",
        ghost: "#CDCDCD",
        ironside: "#636363",
      },
      // 2. Vous pouvez garder vos animations si besoin
      animation: {
        "open-sidebar": "open-sidebar 0.2s ease-out forwards",
        "close-sidebar": "close-sidebar 0.2s ease-out forwards",
        "fade-in": "fade-in 0.4s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;

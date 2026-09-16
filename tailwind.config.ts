import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FCE4EC", // Açık Pembe
        secondary: "#F8BBD0", // Pastel Pembe
        accent: "#E8A0BF", // Rose Gold
        background: "#FFF8FB",
        card: "#FFFFFF",
        hover: "#FDECF4",
        border: "#F5D6E3",
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "serif"],
        body: ["var(--font-poppins)", "sans-serif"],
        alt: ["var(--font-dmsans)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px rgba(232, 160, 191, 0.15)",
        glow: "0 0 32px rgba(232, 160, 191, 0.35)",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 50%, #E8A0BF 100%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

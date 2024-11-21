/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        lighter: "rgba(var(--foreground), 0.1)",
        light: "rgba(var(--foreground), 0.25)",
        medium: "rgba(var(--foreground), 0.35)",
        glass: "rgba(var(--background), 0.6)",
      },
      borderColor: {
        DEFAULT: "rgba(var(--foreground), 0.25)",
      },
    },
  },
  plugins: [],
};

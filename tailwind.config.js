/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        lighter: "rgba(var(--foreground), 0.1)",
        light: "rgba(var(--foreground), 0.2)",
        medium: "rgba(var(--foreground), 0.3)",
        glass: "rgba(var(--background), 0.5)",
      },
      borderColor: {
        DEFAULT: "rgba(var(--foreground), 0.2)",
      },
    },
  },
  plugins: [],
};

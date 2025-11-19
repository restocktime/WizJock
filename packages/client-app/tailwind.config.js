/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f172a', // Slate 900
          light: '#334155',   // Slate 700
        },
        accent: {
          DEFAULT: '#3b82f6', // Blue 500
          hover: '#2563eb',   // Blue 600
        },
        gold: '#fbbf24',      // Amber 400
        silver: '#94a3b8',    // Slate 400
        bronze: '#b45309',    // Amber 700
      },
      fontSize: {
        'body-lg': ['1.125rem', '1.75rem'], // 18px
        'body-xl': ['1.25rem', '1.75rem'],  // 20px
        'h1': ['2rem', '2.5rem'],           // 32px
        'h2': ['1.75rem', '2.25rem'],       // 28px
        'h3': ['1.5rem', '2rem'],           // 24px
      },
      spacing: {
        'touch': '44px', // Minimum touch target size
      }
    },
  },
  plugins: [],
}

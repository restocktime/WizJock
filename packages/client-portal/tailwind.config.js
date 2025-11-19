/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontSize: {
        'client-body': '20px',
        'client-heading': '28px',
      },
    },
  },
  plugins: [],
};

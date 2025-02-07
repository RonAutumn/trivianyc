/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'subway-yellow': '#FCCC0A',
        'subway-orange': '#FF6319',
        'subway-red': '#EE352E',
        'subway-green': '#00933C',
        'subway-blue': '#0039A6',
        'subway-purple': '#B933AD',
      },
      fontFamily: {
        helvetica: ['Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderColor: {
        DEFAULT: 'hsl(214.3, 31.8%, 91.4%)',
      },
      backgroundColor: {
        background: 'hsl(0, 0%, 100%)',
      },
      textColor: {
        foreground: 'hsl(222.2, 84%, 4.9%)',
      },
    },
  },
  plugins: [],
}
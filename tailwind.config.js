/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        noir: {
          lightest: '#F8F7F1',
          light: '#E4E0D6',
          medium: '#A69988',
          dark: '#4E3606',
          darkest: '#0E1111',
        }
      },
      fontFamily: {
        'seasons': ['"the-seasons"', 'serif'],
        'times': ['"Times New Roman"', 'Times', 'serif'],
      },
    },
  },
  plugins: [],
  // Permitir colores arbitrarios para usar los códigos hexadecimales
  safelist: [
    'bg-[#F8F7F1]',
    'bg-[#E4E0D6]',
    'bg-[#A69988]',
    'bg-[#4E3606]',
    'bg-[#0E1111]',
    'text-[#F8F7F1]',
    'text-[#E4E0D6]',
    'text-[#A69988]',
    'text-[#4E3606]',
    'text-[#0E1111]',
    'border-[#F8F7F1]',
    'border-[#E4E0D6]',
    'border-[#A69988]',
    'border-[#4E3606]',
    'border-[#0E1111]',
  ]
}
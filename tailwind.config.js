/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Impact', 'sans-serif'],
      },
      // Taken from the Rosebud Motel sign (and public/logo.svg):
      // rose red, leaf green and butter cream, lit up as neon at night.
      colors: {
        // Night sky over the pines: charcoal with a green cast
        primary: {
          50: '#F4F6F5',
          100: '#E7ECE9',
          200: '#CDD5D1',
          300: '#A7B3AE',
          400: '#808F89',
          500: '#5E6F68',
          600: '#42524C',
          700: '#2D3B36',
          800: '#1E2A26',
          900: '#131C19',
          950: '#0B1210',
        },
        // Rose red of the sign's bloom and script (700 is the sign itself)
        accent: {
          50: '#FDF2F4',
          100: '#FBE3E8',
          200: '#F6C2CD',
          300: '#F0A3B6',
          400: '#E77C97',
          500: '#DA5577',
          600: '#BF3A60',
          700: '#A83A55',
          800: '#8E2D46',
          900: '#571D2C',
          950: '#33101A',
        },
        // Leaf and stem green
        leaf: {
          300: '#8FE3D2',
          400: '#4FC9B4',
          500: '#2FA894',
          600: '#2A8377',
          700: '#216A61',
        },
        // Butter-cream sign board
        cream: {
          100: '#FDF8E8',
          200: '#FBEFC6',
          300: '#F5DB8A',
          400: '#EDC85E',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px theme(colors.accent.500 / 40%), 0 0 16px -4px theme(colors.accent.500 / 30%)',
        'glow-leaf':
          '0 0 0 1px theme(colors.leaf.400 / 40%), 0 0 14px -4px theme(colors.leaf.400 / 30%)',
      },
    },
  },
  plugins: [],
};

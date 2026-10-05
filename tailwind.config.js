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
          DEFAULT: '#D32F2F', // Emergency Red
          hover: '#B71C1C',
          light: '#FFEBEE',
          dark: '#9A0007',
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#EF9A9A',
          500: '#D32F2F',
          600: '#C62828',
          700: '#B71C1C',
        },
        secondary: {
          DEFAULT: '#1976D2', // Medical Blue
          hover: '#1565C0',
          light: '#E3F2FD',
          dark: '#0D47A1',
          50: '#E3F2FD',
          100: '#BBDEFB',
          500: '#1976D2',
          600: '#1565C0',
          700: '#0D47A1',
        },
        success: {
          DEFAULT: '#2E7D32', // Available Green
          hover: '#1B5E20',
          light: '#E8F5E9',
          50: '#E8F5E9',
          500: '#2E7D32',
          600: '#1B5E20',
        },
        warning: {
          DEFAULT: '#F57C00',
          hover: '#E65100',
          light: '#FFF3E0',
          50: '#FFF3E0',
          500: '#F57C00',
        },
        surface: {
          DEFAULT: '#F7F9FC', // Clean healthcare background
          card: '#FFFFFF',
          darker: '#EEF2F6',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'emergency': '0 0 25px rgba(211, 47, 47, 0.35)',
        'emergency-lg': '0 0 40px rgba(211, 47, 47, 0.55)',
        'card-soft': '0 2px 12px rgba(15, 23, 42, 0.06)',
        'card-hover': '0 12px 28px -6px rgba(15, 23, 42, 0.12)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'beacon': 'beacon 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'siren': 'siren 0.8s ease-in-out infinite alternate',
      },
      keyframes: {
        beacon: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '75%, 100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        siren: {
          '0%': { filter: 'drop-shadow(0 0 8px #D32F2F)' },
          '100%': { filter: 'drop-shadow(0 0 20px #FF5252)' },
        }
      }
    },
  },
  plugins: [],
}

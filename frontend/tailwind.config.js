/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'rgba(var(--bg-background), <alpha-value>)',
        surface: 'rgba(var(--bg-surface), <alpha-value>)',
        surfaceHighlight: 'rgba(var(--bg-surface-highlight), <alpha-value>)',
        primary: 'rgba(var(--color-primary), <alpha-value>)',
        primaryHover: 'rgba(var(--color-primary-hover), <alpha-value>)',
        accent: 'rgba(var(--color-accent), <alpha-value>)',
        danger: 'rgba(var(--color-danger), <alpha-value>)',
        warning: 'rgba(var(--color-warning), <alpha-value>)',
        info: 'rgba(var(--color-info), <alpha-value>)',
        textPrimary: 'rgba(var(--text-primary), <alpha-value>)',
        textSecondary: 'rgba(var(--text-secondary), <alpha-value>)',
        borderWhite: 'rgba(var(--border-color), <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}

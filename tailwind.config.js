/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eefcfb', 100: '#d3f7f4', 200: '#abefea', 300: '#73e1db',
          400: '#38c9c2', 500: '#1eaba4', 600: '#168a84', 700: '#156d69',
          800: '#165754', 900: '#154846', 950: '#062a28',
        },
        secondary: {
          50: '#f0f7ff', 100: '#e0edff', 200: '#c7dcff', 300: '#a4c4ff',
          400: '#7da3ff', 500: '#5b80fb', 600: '#435ff0', 700: '#3647dc',
          800: '#313bb2', 900: '#30378d', 950: '#1d214f',
        },
        accent: {
          50: '#fff8ed', 100: '#ffefd4', 200: '#ffdba8', 300: '#ffc170',
          400: '#ffa038', 500: '#fb8413', 600: '#ec6607', 700: '#c44c08',
          800: '#9c3c0f', 900: '#7e3410', 950: '#451705',
        },
        success: {
          50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac',
          400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d',
          800: '#166534', 900: '#14532d', 950: '#052e16',
        },
        warning: {
          50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d',
          400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309',
          800: '#92400e', 900: '#78350f', 950: '#451a03',
        },
        error: {
          50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5',
          400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c',
          800: '#991b1b', 900: '#7f1d1d', 950: '#450a0a',
        },
        ink: {
          50: '#f6f8fa', 100: '#e9eef3', 200: '#d2dbe4', 300: '#aebcc9',
          400: '#8295a8', 500: '#62788d', 600: '#4d6074', 700: '#404e5e',
          800: '#384151', 900: '#1f2630', 950: '#0f141b',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(16, 42, 41, 0.08), 0 8px 24px -8px rgba(16, 42, 41, 0.10)',
        glow: '0 0 0 1px rgba(30, 171, 164, 0.15), 0 12px 40px -12px rgba(30, 171, 164, 0.35)',
        card: '0 1px 2px rgba(15, 20, 27, 0.04), 0 8px 24px -12px rgba(15, 20, 27, 0.12)',
      },
      backgroundImage: {
        'grid-faint': 'linear-gradient(to right, rgba(15,20,27,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,20,27,0.04) 1px, transparent 1px)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.6' },
          '70%': { transform: 'scale(1.3)', opacity: '0' },
          '100%': { opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'gradient-pan': {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'heart-beat': {
          '0%,100%': { transform: 'scale(1)' },
          '15%': { transform: 'scale(1.18)' },
          '30%': { transform: 'scale(1)' },
          '45%': { transform: 'scale(1.12)' },
          '60%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.5s ease both',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'slide-in-right': 'slide-in-right 0.5s cubic-bezier(0.16,1,0.3,1) both',
        float: 'float 6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
        shimmer: 'shimmer 2s linear infinite',
        'gradient-pan': 'gradient-pan 8s ease infinite',
        'heart-beat': 'heart-beat 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          950: '#070B14',
          900: '#0B1120',
          800: '#111827',
          700: '#1E293B',
        },
        accent: {
          blue: '#3B82F6',
          purple: '#8B5CF6',
          cyan: '#22D3EE',
          emerald: '#34D399',
        },
        ink: {
          primary: '#F1F5F9',
          muted: '#94A3B8',
          faint: '#64748B',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'grad-primary': 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #22D3EE 100%)',
        'grad-emerald': 'linear-gradient(135deg, #34D399 0%, #22D3EE 100%)',
        'grad-mesh': 'radial-gradient(at 20% 20%, rgba(59,130,246,0.25) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(139,92,246,0.25) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(34,211,238,0.2) 0px, transparent 50%)',
      },
      boxShadow: {
        glow: '0 0 40px rgba(139, 92, 246, 0.25)',
        'glow-cyan': '0 0 40px rgba(34, 211, 238, 0.2)',
      },
      animation: {
        blob: 'blob 14s infinite ease-in-out',
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -40px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
      },
    },
  },
  plugins: [],
};

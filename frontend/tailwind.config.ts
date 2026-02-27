import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './contexts/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ── Brand colors (match CSS var tokens) ────────────────────────────────
      colors: {
        orange:  '#FF6B35',
        red:     '#E63946',
        // Semantic tokens — reference CSS vars at runtime via arbitrary values
        // Usage: bg-[var(--bg)], text-[var(--text-primary)], etc.
      },
      // ── Fonts (match CSS var font families) ────────────────────────────────
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body:    ['Syne', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      // ── Animation utilities ─────────────────────────────────────────────────
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'ink-float': {
          '0%':   { opacity: '0',   transform: 'translateY(0) scale(0.5)' },
          '15%':  { opacity: '0.8' },
          '85%':  { opacity: '0.4' },
          '100%': { opacity: '0',   transform: 'translateY(-600px) scale(1.5) rotate(180deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        'bounce-dot': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-up':    'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in':    'fade-in 0.4s ease both',
        'slide-down': 'slide-down 0.2s cubic-bezier(0.16, 1, 0.3, 1) both',
        'ink-float':  'ink-float linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'bounce-dot': 'bounce-dot 0.8s ease-in-out infinite',
      },
      // ── Spacing / sizing helpers ────────────────────────────────────────────
      spacing: {
        'header': '57px', // 2.5px accent line + 54.5px nav row
      },
      maxWidth: {
        'content': '80rem',
      },
      borderRadius: {
        'xl2': '1rem',
        'xl3': '1.25rem',
      },
      backdropBlur: {
        'nav': '20px',
      },
      boxShadow: {
        'orange':    '0 4px 20px rgba(255, 107, 53, 0.3)',
        'orange-lg': '0 6px 24px rgba(255, 107, 53, 0.4)',
        'card':      '0 4px 16px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};

export default config;